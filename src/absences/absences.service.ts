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
import { AbsenceCountBySubjectView } from './entities/absence-count-by-subject.view';
import { AbsenceWithStudentView } from './entities/absence_with_student.view';
import { Absence } from './entities/absence.entity';

@Injectable()
export class AbsencesService {
  constructor(
    @InjectRepository(Absence)
    private readonly absencesRepository: Repository<Absence>,
    @InjectRepository(PermissionAbsenceDetailsView)
    private readonly absenceDetailsRepository: Repository<PermissionAbsenceDetailsView>,
    @InjectRepository(AbsenceCountView)
    private readonly absenceCountRepository: Repository<AbsenceCountView>,
    @InjectRepository(UnjustifiedAbsenceDetailsView)
    private readonly unjustifiedAbsenceDetailsRepository: Repository<UnjustifiedAbsenceDetailsView>,
    @InjectRepository(AbsenceCountBySubjectView)
    private readonly studentAbsenceCountBySubjectRepository: Repository<AbsenceCountBySubjectView>,
    @InjectRepository(SubjectGroupStudentAbsenceDetailsView)
    private readonly sgStudentsAbsencesDetailsRepository: Repository<SubjectGroupStudentAbsenceDetailsView>,
    @InjectRepository(AbsenceWithStudentView)
    private readonly absenceWithStudentRepository: Repository<AbsenceWithStudentView>,
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

  getPermissionAbsences(
    permissionId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<PermissionAbsenceDetailsView>> {
    const qb = this.absenceDetailsRepository
      .createQueryBuilder('ar')
      .where('ar.permissionId = :permissionId', { permissionId })
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

    const blockedSubjectGroups =
      await this.studentAbsenceCountBySubjectRepository
        .createQueryBuilder('ac')
        .where('ac.studentId = :studentId', { studentId })
        .andWhere('ac.periodId = :periodId', { periodId })
        .andWhere('ac.absences >= ac.subjectGroupHours*3') // todo: para bloquear permisos
        .getMany();

    console.log(blockedSubjectGroups);

    const result = qb.filter((e) => {
      let isValid = true;

      if (blockedSubjectGroups.length == 0) {
        return this.hasBeenLessThanThreeWorkdays(e.absenceDate);
      }

      for (let i = 0; i < blockedSubjectGroups.length; i++) {
        const blocked = blockedSubjectGroups[i];

        if (blocked.subjectGroupId === e.subjectGroupId) {
          isValid = false;
          break;
        }

        if (isValid) {
          return this.hasBeenLessThanThreeWorkdays(e.absenceDate);
        }
      }
    });

    return result;
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
    return workdays <= 3;
  }

  getSubjectGroupAbsenceReport(subjectGroupId: number) {
    return this.absenceCountRepository
      .createQueryBuilder('ac')
      .where('ac.subjectGroupId = :subjectGroupId', { subjectGroupId })
      .getMany();
  }

  getStudentAbsencesCountBySubject(periodId: number, studentId: number) {
    return this.studentAbsenceCountBySubjectRepository
      .createQueryBuilder('ac')
      .where('ac.studentId = :studentId', { studentId })
      .andWhere('ac.periodId = :periodId', { periodId })
      .getMany();
  }

  getSubjectGroupStudentAbsences(subjectGroupId: number, studentId: number) {
    return this.sgStudentsAbsencesDetailsRepository
      .createQueryBuilder('a')
      .where('a.subjectGroupId = :subjectGroupId', { subjectGroupId })
      .andWhere('a.studentId = :studentId', { studentId })
      .getMany();
  }

  getPeriodAbsences(
    periodId: number,
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<AbsenceWithStudentView>> {
    const qb = this.absenceWithStudentRepository
      .createQueryBuilder('a')
      .where('a.periodId = :periodId', { periodId })
      .orderBy('a.absenceDate', 'DESC');

    if (search) {
      qb.where('a.studentCC LIKE :search', { search: `%${search}%` });
      qb.orWhere('a.student LIKE :search', { search: `%${search}%` });
    }

    return paginate<AbsenceWithStudentView>(qb, options);
  }

  deleteAbsence(absenceId: number) {
    return this.absencesRepository.delete({ id: absenceId });
  }
}
