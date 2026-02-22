import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentScheduleView } from './entities/student-schedule.view';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { WeekDay } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TeacherScheduleView } from './entities/teacher-schedule.view';
import { ScheduleRangeDatesDto } from './dto/schedule-range-dates.dto';
import { DayTimeSlots } from './models/day-time-slots';
import { AbsenceCountBySubjectView } from 'src/absences/entities/absence-count-by-subject.view';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';

@Injectable()
export class SchdulesService {
  constructor(
    @InjectRepository(StudentScheduleView)
    private readonly studentScheduleRepository: Repository<StudentScheduleView>,
    @InjectRepository(TeacherScheduleView)
    private readonly teacherScheduleRepository: Repository<TeacherScheduleView>,
    @InjectRepository(AbsenceCountBySubjectView)
    private readonly studentAbsenceCountBySubjectRepository: Repository<AbsenceCountBySubjectView>,
    @InjectRepository(SubjectGroupTimeSlot)
    private readonly subjectGroupTimeSlotRepository: Repository<SubjectGroupTimeSlot>,
  ) {}

  async getGroupWeeklySchedule(periodId: number, groupId: number) {
    const qb = this.subjectGroupTimeSlotRepository
      .createQueryBuilder('sgts')
      .innerJoin('sgts.timeSlot', 'ts')
      .innerJoin('sgts.subjectGroup', 'sg')
      .innerJoin('sg.group', 'g')
      .innerJoin('sg.subject', 'sub')
      .leftJoin('sg.teacher', 't')
      .where('g.periodId = :periodId', { periodId })
      .andWhere('g.id = :groupId', { groupId })
      .select('sgts.id', 'subjectGroupTimeSlotId')
      .addSelect('sg.id', 'subjectGroupId')
      .addSelect('sgts.day', 'day')
      .addSelect('ts.id', 'timeSlotId')
      .addSelect('ts.label', 'timeSlotLabel')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('ts.isAcademic', 'isAcademic')
      .addSelect('sub.name', 'subjectName')
      .addSelect('g.name', 'groupName')
      .addSelect("concat(t.firstName, ' ', t.lastName)", 'teacherName');

    this.applyWeekOrder(qb, 'sgts.day');
    qb.addOrderBy('ts.startTime', 'ASC');

    return qb.getRawMany();
  }

  async getTeacherWeeklySchedule(periodId: number, teacherId: number) {
    const qb = this.subjectGroupTimeSlotRepository
      .createQueryBuilder('sgts')
      .innerJoin('sgts.timeSlot', 'ts')
      .innerJoin('sgts.subjectGroup', 'sg')
      .innerJoin('sg.group', 'g')
      .innerJoin('sg.subject', 'sub')
      .innerJoin('sg.teacher', 't')
      .where('g.periodId = :periodId', { periodId })
      .andWhere('t.id = :teacherId', { teacherId })
      .select('sgts.id', 'subjectGroupTimeSlotId')
      .addSelect('sg.id', 'subjectGroupId')
      .addSelect('sgts.day', 'day')
      .addSelect('ts.id', 'timeSlotId')
      .addSelect('ts.label', 'timeSlotLabel')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('ts.isAcademic', 'isAcademic')
      .addSelect('sub.name', 'subjectName')
      .addSelect('g.name', 'groupName')
      .addSelect("concat(t.firstName, ' ', t.lastName)", 'teacherName');

    this.applyWeekOrder(qb, 'sgts.day');
    qb.addOrderBy('ts.startTime', 'ASC');

    return qb.getRawMany();
  }

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
  ): Promise<DayTimeSlots[]> {
    const { startDate, endDate } = scheduleRangeDatesDto;

    const nDate = new Date(startDate);
    const end = new Date(endDate);

    const dayTimeSlotsList: DayTimeSlots[] = [];

    const blockedSubjectGroups =
      await this.studentAbsenceCountBySubjectRepository
        .createQueryBuilder('ac')
        .where('ac.studentId = :studentId', { studentId })
        .andWhere('ac.periodId = :periodId', { periodId })
        .andWhere('ac.absences >= ac.subjectGroupHours*3') // todo: para bloquear permisos
        .getMany();

    console.log(blockedSubjectGroups);

    while (nDate <= end) {
      if (
        !fairyDays.includes(nDate.toString()) &&
        !(nDate.getDay() == 0 || nDate.getDay() == 6)
      ) {
        const qb = this.studentScheduleRepository
          .createQueryBuilder('schedule')
          .where('schedule.periodId = :periodId', { periodId })
          .andWhere('schedule.studentId = :studentId', { studentId })
          .andWhere('schedule.day = :day', { day: DaysMap[nDate.getDay()] })
          .orderBy('schedule.startTime', 'ASC');

        const dayTimeSlots = await qb.getMany();

        const nonBlockedDayTimeSlots: StudentScheduleView[] = [];

        for (let i = 0; i < dayTimeSlots.length; i++) {
          let isValid = true;
          const dayTimeSlot = dayTimeSlots[i];

          for (let j = 0; j < blockedSubjectGroups.length; j++) {
            const blockedSubjectGroup = blockedSubjectGroups[j];

            if (
              blockedSubjectGroup.subjectGroupId === dayTimeSlot.subjectGroupId
            ) {
              isValid = false;
              break;
            }
          }

          if (isValid) {
            nonBlockedDayTimeSlots.push(dayTimeSlot);
          }
        }

        dayTimeSlotsList.push({
          date: nDate.toISOString().slice(0, 10),
          subjectGroupTimeSlots: nonBlockedDayTimeSlots,
        });
      }

      nDate.setDate(nDate.getDate() + 1);
    }

    return dayTimeSlotsList;
  }

  private applyWeekOrder(
    qb: SelectQueryBuilder<SubjectGroupTimeSlot>,
    dayColumn: string,
  ) {
    qb.orderBy(
      `CASE
        WHEN ${dayColumn} = '${WeekDay.MONDAY}' THEN 1
        WHEN ${dayColumn} = '${WeekDay.TUESDAY}' THEN 2
        WHEN ${dayColumn} = '${WeekDay.WEDNESDAY}' THEN 3
        WHEN ${dayColumn} = '${WeekDay.THURSDAY}' THEN 4
        WHEN ${dayColumn} = '${WeekDay.FRIDAY}' THEN 5
        WHEN ${dayColumn} = '${WeekDay.SATURDAY}' THEN 6
        WHEN ${dayColumn} = '${WeekDay.SUNDAY}' THEN 7
        ELSE 8
      END`,
      'ASC',
    );
  }
}

export const DaysMap = {
  0: WeekDay.SUNDAY,
  1: WeekDay.MONDAY,
  2: WeekDay.TUESDAY,
  3: WeekDay.WEDNESDAY,
  4: WeekDay.THURSDAY,
  5: WeekDay.FRIDAY,
  6: WeekDay.SATURDAY,
};

export const fairyDays: string[] = [
  // new Date('2024-07-01').toDateString(),
  new Date('2024-07-02').toDateString(),
];
export const fairyDates: Date[] = [new Date('2024-07-01')];
