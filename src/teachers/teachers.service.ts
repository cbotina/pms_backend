import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  create(createTeacherDto: CreateTeacherDto) {
    return this.teachersRepository.save(createTeacherDto);
  }

  findAll(options: IPaginationOptions, search?: string) {
    const queryBuilder = this.teachersRepository.createQueryBuilder('t');
    queryBuilder.orderBy('t.lastName', 'ASC');
    if (search) {
      queryBuilder
        .where('t.firstName LIKE :search', { search: `%${search}%` })
        .orWhere('t.lastName LIKE :search', { search: `%${search}%` });
    }

    return paginate<Teacher>(queryBuilder, options);
  }

  findOne(id: number) {
    return this.teachersRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto) {
    const existingTeacher = await this.findOne(id);
    const teacherData = this.teachersRepository.merge(
      existingTeacher,
      updateTeacherDto,
    );

    return await this.teachersRepository.save(teacherData);
  }

  remove(id: number) {
    return this.teachersRepository.delete({ id });
  }
}
