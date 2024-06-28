import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentScheduleView } from './entities/student-schedule.view';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { WeekDay } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TeacherScheduleView } from './entities/teacher-schedule.view';
import { ScheduleRangeDatesDto } from './dto/schedule-range-dates.dto';

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
    day?: WeekDay,
  ): Promise<Pagination<StudentScheduleView>> {
    const qb = this.studentScheduleRepository
      .createQueryBuilder('ss')
      .where('ss.periodId = :periodId', { periodId })
      .andWhere('ss.studentId = :studentId', { studentId });

    if (day) {
      qb.andWhere('ss.day = :day', { day });
      qb.orderBy('ss.startTime', 'ASC');
    } else {
      qb.orderBy('ss.day');
    }

    return paginate<StudentScheduleView>(qb, options);
  }

  getTeachersSchedule(
    periodId: number,
    teacherId: number,
    options: IPaginationOptions,
    day?: WeekDay,
  ): Promise<Pagination<TeacherScheduleView>> {
    const qb = this.teacherScheduleRepository
      .createQueryBuilder('tsch')
      .where('tsch.periodId = :periodId', { periodId })
      .andWhere('tsch.teacherId = :teacherId', { teacherId });

    if (day) {
      qb.andWhere('tsch.day = :day', { day });
      qb.orderBy('tsch.startTime', 'ASC');
    } else {
      qb.orderBy('tsch.day', 'ASC');
    }

    return paginate<TeacherScheduleView>(qb, options);
  }

  async getStudentScheduleByRange(
    periodId: number,
    studentId: number,
    scheduleRangeDatesDto: ScheduleRangeDatesDto,
  ): Promise<Map<string, StudentScheduleView[]>> {
    const { startDate, endDate } = scheduleRangeDatesDto;

    const nDate = new Date(startDate);
    const end = new Date(endDate);

    const scheduleMap: Map<string, StudentScheduleView[]> = new Map();

    while (nDate <= end) {
      if (
        !fairyDays.includes(nDate.toString()) &&
        !(nDate.getDay() == 5 || nDate.getDay() == 6)
      ) {
        const qb = this.studentScheduleRepository
          .createQueryBuilder('schedule')
          .where('schedule.periodId = :periodId', { periodId })
          .andWhere('schedule.studentId = :studentId', { studentId })
          .andWhere('schedule.day = :day', { day: DaysMap[nDate.getDay()] })
          .orderBy('schedule.startTime', 'ASC');

        const dayTimeSlots = await qb.execute();

        scheduleMap.set(nDate.toISOString().slice(0, 10), dayTimeSlots);
      }

      nDate.setDate(nDate.getDate() + 1);
    }

    return scheduleMap;
  }
}

export const DaysMap = {
  6: undefined,
  0: WeekDay.MONDAY,
  1: WeekDay.TUESDAY,
  2: WeekDay.WEDNESDAY,
  3: WeekDay.THURSDAY,
  4: WeekDay.FRIDAY,
  5: undefined,
};

export const fairyDays: string[] = [new Date('2024-06-26').toString()];
