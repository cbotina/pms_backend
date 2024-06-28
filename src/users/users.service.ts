import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { hash } from 'bcrypt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { username, role } = createUserDto;

    switch (role) {
      case Role.STUDENT:
        await this.studentsRepository.findOneByOrFail({ cc: username });
        break;
      case Role.TEACHER:
        await this.teachersRepository.findOneByOrFail({ cc: username });
        break;
    }

    const hashedPassword = await hash(username, 10);

    const user = this.usersRepository.create(createUserDto);

    user.password = hashedPassword;

    const createdUser = await this.usersRepository.save(user);

    return plainToInstance(User, createdUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(username: string) {
    return this.usersRepository.findOneByOrFail({ username: username });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
