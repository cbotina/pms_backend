import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Group } from 'src/groups/entities/group.entity';
import { Student } from 'src/students/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupStudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  getAllGroupStudents(
    options: IPaginationOptions,
    groupId: number,
    search?: string,
  ): Promise<Pagination<Student>> {
    const queryBuilder = this.studentsRepository.createQueryBuilder('student');
    queryBuilder.where('student.groupId = :groupId', { groupId });
    queryBuilder.orderBy('student.lastName', 'ASC');

    if (search) {
      queryBuilder
        .where('student.firstName LIKE :search', {
          search: `%${search}%`,
        })
        .orWhere('student.lastName LIKE :search', {
          search: `%${search}%`,
        });
    }
    return paginate(queryBuilder, options);
  }

  async promoteStudents(oldGroupId: number, newGroupId: number) {
    const oldGroup = await this.groupsRepository.findOneOrFail({
      where: { id: oldGroupId },
      relations: { students: true },
    });

    const newGroup = await this.groupsRepository.findOneOrFail({
      where: { id: newGroupId },
    });

    const groupStudents = oldGroup.students;

    groupStudents.forEach(async (student) => {
      const studentData = await this.studentsRepository.merge(student, {
        group: newGroup,
      });

      await this.studentsRepository.save(studentData);
    });
  }
}
