import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbsencesByGroupView } from './entities/absences-per-group.view';
import { Repository } from 'typeorm';
import { PermissionCountByReasonView } from './entities/permission-count-by-reason.view';
import { PermissionCountByStatusView } from './entities/permission-count-by-status.view';
import { AbsencesByStudentView } from './entities/absences-by-student.view';
import { SubjectsWithMostAbsencesView } from './entities/subject-with-most-absences.view';
import { Group } from 'src/groups/entities/group.entity';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import {
  Permission,
  PermissionStatus,
} from 'src/permissions/entities/permission.entity';
import { Absence } from 'src/absences/entities/absence.entity';
import { Period } from 'src/periods/entities/period.entity';

interface StatsCountItem {
  label: string;
  count: number;
}

export interface StatsSummaryResponse {
  totalStudents: number;
  totalGroups: number;
  activeTeachers: number;
  totalEnrollments: number;
  totalPermissions: number;
  approvedPermissions: number;
  pendingPermissions: number;
  rejectedPermissions: number;
  leavePermissions: number;
  totalAbsences: number;
  approvalRate: number;
}

export interface StatsTrendPoint {
  date: string;
  permissionsRequested: number;
  permissionsApproved: number;
  absences: number;
}

export interface StatsDistributionResponse {
  permissionsByStatus: StatsCountItem[];
  permissionsByReason: StatsCountItem[];
  absencesByGroup: StatsCountItem[];
  absencesBySubject: StatsCountItem[];
  topStudentsByAbsences: StatsCountItem[];
}

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
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(SubjectGroup)
    private readonly subjectGroupsRepository: Repository<SubjectGroup>,
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
    @InjectRepository(Absence)
    private readonly absencesRepository: Repository<Absence>,
    @InjectRepository(Period)
    private readonly periodsRepository: Repository<Period>,
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

  async getSummary(periodId: number): Promise<StatsSummaryResponse> {
    const [
      totalStudents,
      totalGroups,
      activeTeachersRaw,
      totalEnrollments,
      permissionStatusRows,
      absencesTotalRaw,
    ] = await Promise.all([
      this.studentsRepository
        .createQueryBuilder('st')
        .innerJoin('st.group', 'g')
        .where('g.periodId = :periodId', { periodId })
        .getCount(),
      this.groupsRepository
        .createQueryBuilder('g')
        .where('g.periodId = :periodId', { periodId })
        .getCount(),
      this.subjectGroupsRepository
        .createQueryBuilder('sg')
        .innerJoin('sg.group', 'g')
        .where('g.periodId = :periodId', { periodId })
        .select('COUNT(DISTINCT sg.teacherId)', 'count')
        .getRawOne<{ count: string }>(),
      this.enrollmentsRepository
        .createQueryBuilder('en')
        .innerJoin('en.subjectGroup', 'sg')
        .innerJoin('sg.group', 'g')
        .where('g.periodId = :periodId', { periodId })
        .getCount(),
      this.permissionCountByStatusRepository
        .createQueryBuilder('p')
        .where('p.periodId = :periodId', { periodId })
        .getMany(),
      this.absencesByStudentRepository
        .createQueryBuilder('a')
        .select('COALESCE(SUM(a.absences), 0)', 'total')
        .where('a.periodId = :periodId', { periodId })
        .getRawOne<{ total: string }>(),
    ]);

    const statusMap = {
      [PermissionStatus.PENDING]: 0,
      [PermissionStatus.APPROVED]: 0,
      [PermissionStatus.REJECTED]: 0,
      [PermissionStatus.LEAVE_PERMISSION]: 0,
    };

    for (const row of permissionStatusRows) {
      statusMap[row.status] = Number(row.count) || 0;
    }

    const totalPermissions =
      statusMap[PermissionStatus.PENDING] +
      statusMap[PermissionStatus.APPROVED] +
      statusMap[PermissionStatus.REJECTED] +
      statusMap[PermissionStatus.LEAVE_PERMISSION];

    const approvalRate =
      totalPermissions > 0
        ? Number(
            ((statusMap[PermissionStatus.APPROVED] * 100) / totalPermissions).toFixed(
              1,
            ),
          )
        : 0;

    return {
      totalStudents,
      totalGroups,
      activeTeachers: Number(activeTeachersRaw?.count ?? 0),
      totalEnrollments,
      totalPermissions,
      approvedPermissions: statusMap[PermissionStatus.APPROVED],
      pendingPermissions: statusMap[PermissionStatus.PENDING],
      rejectedPermissions: statusMap[PermissionStatus.REJECTED],
      leavePermissions: statusMap[PermissionStatus.LEAVE_PERMISSION],
      totalAbsences: Number(absencesTotalRaw?.total ?? 0),
      approvalRate,
    };
  }

  async getTrends(periodId: number): Promise<StatsTrendPoint[]> {
    const period = await this.periodsRepository.findOneByOrFail({ id: periodId });

    const [permissionRows, absenceRows] = await Promise.all([
      this.permissionsRepository
        .createQueryBuilder('p')
        .innerJoin('p.student', 'st')
        .innerJoin('st.group', 'g')
        .where('g.periodId = :periodId', { periodId })
        .andWhere('p.requestDate BETWEEN :startDate AND :endDate', {
          startDate: period.startDate,
          endDate: period.endDate,
        })
        .select('DATE(p.requestDate)', 'date')
        .addSelect('COUNT(*)', 'requested')
        .addSelect(
          `SUM(CASE WHEN p.status = '${PermissionStatus.APPROVED}' THEN 1 ELSE 0 END)`,
          'approved',
        )
        .groupBy('DATE(p.requestDate)')
        .orderBy('DATE(p.requestDate)', 'ASC')
        .getRawMany<{ date: string; requested: string; approved: string }>(),
      this.absencesRepository
        .createQueryBuilder('a')
        .innerJoin('a.dailyReport', 'dr')
        .innerJoin('dr.subjectGroupTimeSlot', 'sgts')
        .innerJoin('sgts.subjectGroup', 'sg')
        .innerJoin('sg.group', 'g')
        .leftJoin('a.permission', 'p')
        .where('g.periodId = :periodId', { periodId })
        .andWhere('dr.reportDate BETWEEN :startDate AND :endDate', {
          startDate: period.startDate,
          endDate: period.endDate,
        })
        .andWhere('(p.id IS NULL OR p.status != :approvedStatus)', {
          approvedStatus: PermissionStatus.APPROVED,
        })
        .select('DATE(dr.reportDate)', 'date')
        .addSelect('COUNT(*)', 'absences')
        .groupBy('DATE(dr.reportDate)')
        .orderBy('DATE(dr.reportDate)', 'ASC')
        .getRawMany<{ date: string; absences: string }>(),
    ]);

    const permissionMap = new Map<
      string,
      { permissionsRequested: number; permissionsApproved: number }
    >();
    const absencesMap = new Map<string, number>();

    for (const row of permissionRows) {
      const date = this.normalizeDate(row.date);
      permissionMap.set(date, {
        permissionsRequested: Number(row.requested) || 0,
        permissionsApproved: Number(row.approved) || 0,
      });
    }

    for (const row of absenceRows) {
      const date = this.normalizeDate(row.date);
      absencesMap.set(date, Number(row.absences) || 0);
    }

    const dates = this.createDateRange(period.startDate, period.endDate);
    return dates.map((date) => {
      const permissionStats = permissionMap.get(date);
      return {
        date,
        permissionsRequested: permissionStats?.permissionsRequested ?? 0,
        permissionsApproved: permissionStats?.permissionsApproved ?? 0,
        absences: absencesMap.get(date) ?? 0,
      };
    });
  }

  async getDistribution(periodId: number): Promise<StatsDistributionResponse> {
    const [
      permissionsByStatusRaw,
      permissionsByReasonRaw,
      absencesByGroupRaw,
      absencesBySubjectRaw,
      topStudentsByAbsencesRaw,
    ] = await Promise.all([
      this.permissionCountByStatusRepository
        .createQueryBuilder('p')
        .where('p.periodId = :periodId', { periodId })
        .orderBy('p.count', 'DESC')
        .getMany(),
      this.permissionCountByReasonRepository
        .createQueryBuilder('p')
        .where('p.periodId = :periodId', { periodId })
        .orderBy('p.count', 'DESC')
        .limit(8)
        .getMany(),
      this.absencesRepository
        .createQueryBuilder('a')
        .innerJoin('a.dailyReport', 'dr')
        .innerJoin('dr.subjectGroupTimeSlot', 'sgts')
        .innerJoin('sgts.subjectGroup', 'sg')
        .innerJoin('sg.group', 'g')
        .leftJoin('a.permission', 'p')
        .where('g.periodId = :periodId', { periodId })
        .andWhere('(p.id IS NULL OR p.status != :approvedStatus)', {
          approvedStatus: PermissionStatus.APPROVED,
        })
        .select('g.name', 'label')
        .addSelect('COUNT(*)', 'count')
        .groupBy('g.id')
        .addGroupBy('g.name')
        .orderBy('count', 'DESC')
        .limit(8)
        .getRawMany<{ label: string; count: string }>(),
      this.absencesRepository
        .createQueryBuilder('a')
        .innerJoin('a.dailyReport', 'dr')
        .innerJoin('dr.subjectGroupTimeSlot', 'sgts')
        .innerJoin('sgts.subjectGroup', 'sg')
        .innerJoin('sg.subject', 'sub')
        .innerJoin('sg.group', 'g')
        .leftJoin('a.permission', 'p')
        .where('g.periodId = :periodId', { periodId })
        .andWhere('(p.id IS NULL OR p.status != :approvedStatus)', {
          approvedStatus: PermissionStatus.APPROVED,
        })
        .select('sub.name', 'label')
        .addSelect('COUNT(*)', 'count')
        .groupBy('sub.id')
        .addGroupBy('sub.name')
        .orderBy('count', 'DESC')
        .limit(8)
        .getRawMany<{ label: string; count: string }>(),
      this.absencesByStudentRepository
        .createQueryBuilder('a')
        .where('a.periodId = :periodId', { periodId })
        .orderBy('a.absences', 'DESC')
        .limit(10)
        .getMany(),
    ]);

    return {
      permissionsByStatus: permissionsByStatusRaw.map((item) => ({
        label: item.status,
        count: Number(item.count) || 0,
      })),
      permissionsByReason: permissionsByReasonRaw.map((item) => ({
        label: item.reason,
        count: Number(item.count) || 0,
      })),
      absencesByGroup: absencesByGroupRaw.map((item) => ({
        label: item.label,
        count: Number(item.count) || 0,
      })),
      absencesBySubject: absencesBySubjectRaw.map((item) => ({
        label: item.label,
        count: Number(item.count) || 0,
      })),
      topStudentsByAbsences: topStudentsByAbsencesRaw.map((item) => ({
        label: item.student,
        count: Number(item.absences) || 0,
      })),
    };
  }

  private normalizeDate(value: string | Date): string {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10);
    }
    return String(value).slice(0, 10);
  }

  private createDateRange(startDate: Date, endDate: Date): string[] {
    const dates: string[] = [];
    const cursor = new Date(startDate);
    const end = new Date(endDate);

    while (cursor <= end) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setDate(cursor.getDate() + 1);
    }

    return dates;
  }
}
