import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles, User } from './entities/user.entity';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { compareSync, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ChangePasswordDto } from './dto/change-password.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, role, password } = createUserDto;
    let pass;
    let entityId;

    switch (role) {
      case Roles.STUDENT:
        const student = await this.studentsRepository.findOneByOrFail({
          email,
        });

        pass = student.cc;
        entityId = student.id;

        break;
      case Roles.TEACHER:
        const teacher = await this.teachersRepository.findOneByOrFail({
          email,
        });

        pass = teacher.cc;
        entityId = teacher.id;
        break;
      default:
        if (!password) {
          throw new BadRequestException(`${role} user must have a password`);
        }
        pass = password;
        entityId = null;
    }

    const hashedPassword = await hash(pass, 10);

    const user = this.usersRepository.create(createUserDto);

    user.password = hashedPassword;
    user.entityId = entityId;

    const createdUser = await this.usersRepository.save(user);

    return plainToInstance(User, createdUser);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, userId: number) {
    const user = await this.usersRepository.findOneByOrFail({ id: userId });
    const { oldPassword, newPassword } = changePasswordDto;

    const checkPassword = compareSync(oldPassword, user.password);

    if (!checkPassword) {
      throw new UnauthorizedException('Wrong Password');
    }
    const hashedPassword = await hash(newPassword, 10);
    user.password = hashedPassword;

    this.usersRepository.save(user);
    return { message: 'Password changed successfully' };
  }

  async createGroupStudentsAccounts(groupId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const students = await this.studentsRepository.findBy({
        group: { id: groupId },
      });

      for (let i = 0; i < students.length; i++) {
        const { email, cc, id } = students[i];

        const createUserDto: CreateUserDto = {
          email,
          role: Roles.STUDENT,
          password: cc,
        };

        const hashedPassword = await hash(cc, 10);

        const user = this.usersRepository.create(createUserDto);

        user.password = hashedPassword;
        user.entityId = id;

        await queryRunner.manager.save(user);
      }

      await queryRunner.commitTransaction();

      return {
        message: 'Users generated successfully',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async syncAccounts() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const [students, teachers, existingUsers] = await Promise.all([
        this.studentsRepository.find(),
        this.teachersRepository.find(),
        this.usersRepository.find({ select: ['email'] }),
      ]);

      const knownEmails = new Set(
        existingUsers.map((user) => user.email.toLowerCase()),
      );

      let created = 0;

      const candidates: {
        email: string;
        cc: string;
        entityId: number;
        role: Roles;
      }[] = [
        ...students.map((s) => ({
          email: s.email,
          cc: s.cc,
          entityId: s.id,
          role: Roles.STUDENT,
        })),
        ...teachers.map((t) => ({
          email: t.email,
          cc: t.cc,
          entityId: t.id,
          role: Roles.TEACHER,
        })),
      ];

      for (const candidate of candidates) {
        if (!candidate.email) {
          continue;
        }

        const normalizedEmail = candidate.email.toLowerCase();

        if (knownEmails.has(normalizedEmail)) {
          continue;
        }

        const user = this.usersRepository.create({
          email: candidate.email,
          role: candidate.role,
        });
        user.password = await hash(candidate.cc, 10);
        user.entityId = candidate.entityId;

        await queryRunner.manager.save(user);

        knownEmails.add(normalizedEmail);
        created += 1;
      }

      await queryRunner.commitTransaction();

      return { created };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(options: IPaginationOptions, search?: string) {
    const qb = this.usersRepository.createQueryBuilder('user');
    qb.orderBy('user.email', 'ASC');

    if (search) {
      qb.where(
        new Brackets((sub) => {
          sub
            .where('user.email LIKE :search', { search: `%${search}%` })
            .orWhere('user.role LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    return paginate<User>(qb, options);
  }

  findOne(id: number) {
    return this.usersRepository.findOneByOrFail({ id });
  }

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneByOrFail({ email });
  }

  async resetPassword(userId: number) {
    const user = await this.usersRepository.findOneByOrFail({ id: userId });
    let defaultPassword: string;

    switch (user.role) {
      case Roles.STUDENT:
        const student = await this.studentsRepository.findOneByOrFail({
          id: user.entityId,
        });
        defaultPassword = student.cc;
        break;
      case Roles.TEACHER:
        const teacher = await this.teachersRepository.findOneByOrFail({
          id: user.entityId,
        });
        defaultPassword = teacher.cc;
        break;
      default:
        throw new BadRequestException(
          'Cannot reset password for this user role',
        );
    }

    user.password = await hash(defaultPassword, 10);
    await this.usersRepository.save(user);

    return { message: 'Password reset successfully' };
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }
}
