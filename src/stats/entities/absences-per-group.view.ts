import { Absence } from '@absences/entities/absence.entity';
import { DailyReport } from '@daily-reports/entities/daily-report.entity';
import { Group } from '@groups/entities/group.entity';
import { Permission } from '@permissions/entities/permission.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';
import { Brackets, DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'absences')
      .addSelect('g.name', 'group')
      .addSelect('g.periodId', 'periodId')
      .from(Absence, 'a')
      .leftJoin(DailyReport, 'dr', 'dr.id = a.dailyReportId')
      .leftJoin(Permission, 'p', 'p.id = a.permissionId')
      .innerJoin(
        SubjectGroupTimeSlot,
        'sgts',
        'sgts.id = dr.subjectGroupTimeSlotId',
      )
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .where(
        new Brackets((qb) => {
          qb.where('p.id is null').orWhere(`p.status != "A"`);
        }),
      )
      .groupBy('a.studentId')
      .addGroupBy('st.firstName')
      .addGroupBy('st.lastName')
      .groupBy('g.id')
      .orderBy('absences', 'DESC'),
})
export class AbsencesByGroupView {
  @ViewColumn()
  absences: number;

  @ViewColumn()
  group: string;
}
