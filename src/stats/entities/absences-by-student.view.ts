import { Absence } from '@absences/entities/absence.entity';
import { DailyReport } from '@daily-reports/entities/daily-report.entity';
import { Group } from '@groups/entities/group.entity';
import { Permission } from '@permissions/entities/permission.entity';
import { Student } from '@students/entities/student.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';
import { Brackets, DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'absences')
      .addSelect("CONCAT(st.firstName, ' ', st.lastName)", 'student')
      .addSelect('g.periodId', 'periodId')
      .from(Absence, 'a')
      .innerJoin(Student, 'st', 'st.id = a.studentId')
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
          qb.where('p.id IS NULL').orWhere('p.status != "A"');
        }),
      )
      .groupBy('a.studentId')
      .addGroupBy('st.firstName')
      .addGroupBy('st.lastName')
      .addGroupBy('g.periodId')
      .orderBy('absences', 'DESC'),
})
export class AbsencesByStudentView {
  @ViewColumn()
  absences: number;

  @ViewColumn()
  student: string;

  @ViewColumn()
  periodId: number;
}
