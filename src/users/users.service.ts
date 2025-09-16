import {
  BadRequestException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles, User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Student } from '@students/entities/student.entity';
import { Teacher } from '@teachers/entities/teacher.entity';
import { compareSync, hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit{
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.initializeAdminUser();
  }

  private async initializeAdminUser() {
    try {
      // Check if admin user already exists
      const adminExists = await this.usersRepository.findOne({
        where: { role: Roles.ADMIN }
      });

      if (!adminExists) {
        await this.createAdminUser();
      }
    } catch (error) {
      console.error('❌ Failed to initialize admin user:', error.message);
    }
  }

  async createAdminUser(email?: string, password?: string) {
    try {
      const adminEmail = email || this.configService.get('admin.email');
      const adminPassword = password || this.configService.get('admin.password');
      
      // Check if admin already exists
      const existingAdmin = await this.usersRepository.findOne({
        where: { email: adminEmail }
      });

      if (existingAdmin) {
        throw new BadRequestException('Admin user already exists');
      }

      const adminUser = this.usersRepository.create({
        email: adminEmail,
        password: await hash(adminPassword, 10),
        role: Roles.ADMIN,
        entityId: null,
      });

      const savedAdmin = await this.usersRepository.save(adminUser);
      return plainToInstance(User, savedAdmin);
    } catch (error) {
      throw error;
    }
  }

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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return this.usersRepository.findOneByOrFail({ id });
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneByOrFail({ email });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
