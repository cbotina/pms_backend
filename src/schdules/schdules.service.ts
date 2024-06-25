import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentScheduleView } from './entities/student-schedule.view';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Day } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TeacherScheduleView } from './entities/teacher-schedule.view';

@Injectable()
export class SchdulesService {
  constructor(
    @InjectRepository(StudentScheduleView)
    private readonly studentScheduleRepository: Repository<StudentScheduleView>,
    @InjectRepository(TeacherScheduleView)
    private readonly teacherScheduleRepository: Repository<TeacherScheduleView>,
  ) {}

  getStudentSchedule(
    periodId: number,
    studentId: number,
    options: IPaginationOptions,
    day?: Day,
  ): Promise<Pagination<StudentScheduleView>> {
    const qb = this.studentScheduleRepository
      .createQueryBuilder('ss')
      .where('ss.periodId = :periodId', { periodId })
      .andWhere('ss.studentId = :studentId', { studentId });

    if (day) {
      qb.andWhere('ss.day = :day', { day });
    }

    return paginate<StudentScheduleView>(qb, options);
  }

  getTeachersSchedule(
    periodId: number,
    teacherId: number,
    options: IPaginationOptions,
    day?: Day,
  ): Promise<Pagination<TeacherScheduleView>> {
    const qb = this.teacherScheduleRepository
      .createQueryBuilder('tsch')
      .where('tsch.periodId = :periodId', { periodId })
      .andWhere('tsch.teacherId = :teacherId', { teacherId });

    if (day) {
      qb.andWhere('tsch.day = :day', { day });
    }

    return paginate<TeacherScheduleView>(qb, options);
  }
}
