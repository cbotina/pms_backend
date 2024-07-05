import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionAbsenceDetailsView } from './entities/permission-absence-details.view';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { UnjustifiedAbsenceDetailsView } from './entities/unjustified-absences.view';
import { AbsenceCountView } from './entities/absence-count.view';
import { SubjectGroupStudentAbsenceDetailsView } from './entities/student-absence-details.view';
import { fairyDates, fairyDays } from 'src/schedules/schedules.service';

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(PermissionAbsenceDetailsView)
    private readonly absenceDetailsRepository: Repository<PermissionAbsenceDetailsView>,
    @InjectRepository(AbsenceCountView)
    private readonly absenceCountRepository: Repository<AbsenceCountView>,
    @InjectRepository(UnjustifiedAbsenceDetailsView)
    private readonly unjustifiedAbsenceDetailsRepository: Repository<UnjustifiedAbsenceDetailsView>,
    @InjectRepository(SubjectGroupStudentAbsenceDetailsView)
    private readonly sgStudentsAbsencesDetailsRepository: Repository<SubjectGroupStudentAbsenceDetailsView>,
  ) {}

  getStudentPermissionAbsences(
    studentId: number,
    permissionId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<PermissionAbsenceDetailsView>> {
    const qb = this.absenceDetailsRepository
      .createQueryBuilder('ar')
      .where('ar.permissionId = :permissionId', { permissionId })
      .andWhere('ar.studentId = :studentId', { studentId })
      .orderBy('ar.absenceDate', 'ASC');

    return paginate<PermissionAbsenceDetailsView>(qb, options);
  }

  getStudentUnjustifiedAbsences(
    periodId: number,
    studentId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<UnjustifiedAbsenceDetailsView>> {
    const qb = this.unjustifiedAbsenceDetailsRepository
      .createQueryBuilder('ar')
      .where('ar.periodId = :periodId', { periodId })
      .andWhere('ar.studentId = :studentId', { studentId })
      // .andWhere(
      //   new Brackets((qb) => {
      //     qb.where('ar.permissionId is null');
      //   }),
      // )
      .orderBy('ar.absenceDate', 'ASC');

    return paginate<UnjustifiedAbsenceDetailsView>(qb, options);
  }

  async getJustificableAbsences(
    periodId: number,
    studentId: number,
  ): Promise<UnjustifiedAbsenceDetailsView[]> {
    const qb = await this.unjustifiedAbsenceDetailsRepository
      .createQueryBuilder('ar')
      .where('ar.periodId = :periodId', { periodId })
      .andWhere('ar.studentId = :studentId', { studentId })
      .orderBy('ar.absenceDate', 'ASC')
      .getMany();

    return qb.filter((e) => {
      // return true;
      return this.hasBeenLessThanThreeWorkdays(e.absenceDate);
    });
  }

  isWorkday(date: Date): boolean {
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    const isHoliday = fairyDays.includes(date.toDateString());

    return !isWeekend && !isHoliday;
  }

  getWorkdaysBetween(startDate: Date, endDate: Date): number {
    let workdays = 0;
    const currentDate = new Date(startDate);
    // console.log('=======');
    while (currentDate < endDate) {
      // console.log(this.isWorkday(currentDate));
      if (this.isWorkday(currentDate)) {
        workdays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return workdays;
  }

  hasBeenLessThanThreeWorkdays(targetDate: Date): boolean {
    const now = new Date();
    const workdays = this.getWorkdaysBetween(targetDate, now);
    console.log(workdays);
    return workdays <= 3;
  }

  getSubjectGroupAbsenceReport(subjectGroupId: number) {
    return this.absenceCountRepository
      .createQueryBuilder('ac')
      .where('ac.subjectGroupId = :subjectGroupId', { subjectGroupId })
      .getMany();
  }

  getSubjectGroupStudentAbsences(subjectGroupId: number, studentId: number) {
    return this.sgStudentsAbsencesDetailsRepository
      .createQueryBuilder('a')
      .where('a.subjectGroupId = :subjectGroupId', { subjectGroupId })
      .andWhere('a.studentId = :studentId', { studentId })
      .getMany();
  }
}
