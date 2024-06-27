import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbsencesByGroupView } from './entities/absences-per-group.view';
import { Repository } from 'typeorm';
import { PermissionCountByReasonView } from './entities/permission-count-by-reason.view';
import { PermissionCountByStatusView } from './entities/permission-count-by-status.view';
import { AbsencesByStudentView } from './entities/absences-by-student.view';
import { SubjectsWithMostAbsencesView } from './entities/subject-with-most-absences.view';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(AbsencesByGroupView)
    private readonly absencesByGroupRepository: Repository<AbsencesByGroupView>,

    @InjectRepository(PermissionCountByReasonView)
    private readonly permissionCountByReasonRepository: Repository<PermissionCountByReasonView>,

    @InjectRepository(PermissionCountByStatusView)
    private readonly permissionCountByStatusRepository: Repository<PermissionCountByStatusView>,

    @InjectRepository(AbsencesByStudentView)
    private readonly absencesByStudentRepository: Repository<AbsencesByStudentView>,

    @InjectRepository(SubjectsWithMostAbsencesView)
    private readonly subjectsWithMostAbsencesRepository: Repository<SubjectsWithMostAbsencesView>,
  ) {}

  getAbsencesPerGroup(periodId: number) {
    return this.absencesByGroupRepository
      .createQueryBuilder('a')
      .where('a.periodId = :periodId', { periodId })
      .getMany();
  }

  getPermissionCountByReason(periodId: number) {
    return this.permissionCountByReasonRepository
      .createQueryBuilder('p')
      .where('p.periodId = :periodId', { periodId })
      .getMany();
  }

  getPermissionCountByStatus(periodId: number) {
    return this.permissionCountByStatusRepository
      .createQueryBuilder('p')
      .where('p.periodId = :periodId', { periodId })
      .getMany();
  }

  getAbsencesByStudent(periodId: number) {
    return this.absencesByStudentRepository
      .createQueryBuilder('a')
      .where('a.periodId = :periodId', { periodId })
      .getMany();
  }

  getSubjectsWithMostAbsences(periodId: number) {
    return this.subjectsWithMostAbsencesRepository
      .createQueryBuilder('s')
      .where('s.periodId = :periodId', { periodId })
      .getMany();
  }
}
