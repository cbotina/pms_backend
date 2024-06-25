import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { CreateEnrollmentDto } from 'src/enrollments/dto/create-enrollment.dto';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentEnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(SubjectGroup)
    private readonly subjectGroupsRepository: Repository<SubjectGroup>,
  ) {}

  async addEnrollmentToStudent(
    studentId: number,
    createEnrollmentDto: CreateEnrollmentDto,
  ) {
    const student = await this.studentsRepository.findOneByOrFail({
      id: studentId,
    });

    const { subjectGroupId } = createEnrollmentDto;

    const subjectGroup = await this.subjectGroupsRepository.findOneByOrFail({
      id: subjectGroupId,
    });

    return await this.enrollmentsRepository.save({
      student,
      subjectGroup,
    });
  }

  async getStudentEnrollments(
    studentId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Enrollment>> {
    const qb = this.enrollmentsRepository.createQueryBuilder('e');
    qb.where('e.studentId = :studentId', { studentId })
      .leftJoin('e.subjectGroup', 'sg')
      .leftJoin('sg.subject', 's')
      .addSelect(['sg.id', 's.name']);

    return paginate<Enrollment>(qb, options);
  }
}
