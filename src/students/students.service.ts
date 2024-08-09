import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Brackets, Repository } from 'typeorm';
import { Group } from 'src/groups/entities/group.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const { groupId, cc, firstName, lastName } = createStudentDto;

    const group = await this.groupsRepository.findOneByOrFail({ id: groupId });

    return await this.studentsRepository.save({
      cc,
      firstName,
      lastName,
      group,
    });
  }

  findAll(options: IPaginationOptions, search?: string) {
    const queryBuilder = this.studentsRepository.createQueryBuilder('student');
    queryBuilder.orderBy('student.lastName', 'ASC');
    if (search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where('student.firstName LIKE :search', {
            search: `%${search}%`,
          })
            .orWhere('student.lastName LIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('student.cc LIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }
    return paginate<Student>(queryBuilder, options);
  }

  findOne(id: number) {
    return this.studentsRepository.findOneOrFail({
      where: { id },
      relations: { group: true },
    });
  }

  findOneByCC(cc: string) {
    return this.studentsRepository.findOne({
      where: { cc },
    });
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    const existingStudent = await this.findOne(id);

    const { cc, firstName, groupId, lastName, email, gender } =
      updateStudentDto;

    let group: Group = undefined;

    if (groupId) {
      group = await this.groupsRepository.findOneByOrFail({ id: groupId });
    }

    const studentData = this.studentsRepository.merge(existingStudent, {
      cc,
      firstName,
      lastName,
      group,
      email,
      gender,
    });

    return await this.studentsRepository.save(studentData);
  }

  remove(id: number) {
    return this.studentsRepository.delete({ id });
  }
}
