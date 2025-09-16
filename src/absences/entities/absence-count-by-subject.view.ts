import { Brackets, DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Absence } from './absence.entity';
import { Student } from '@students/entities/student.entity';
import { DailyReport } from '@daily-reports/entities/daily-report.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';
import { Subject } from '@subjects/entities/subject.entity';
import { Group } from '@groups/entities/group.entity';
import { Permission } from '@permissions/entities/permission.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'absences')
      .addSelect('s.name', 'subjectName')
      .addSelect('sg.id', 'subjectGroupId')
      .addSelect('g.periodId', 'periodId')
      .addSelect('sg.hours', 'subjectGroupHours')
      .addSelect('st.id', 'studentId')
      .from(Absence, 'a')
      .innerJoin(Student, 'st', 'st.id = a.studentId')
      .innerJoin(DailyReport, 'dr', 'dr.id = a.dailyReportId')
      .leftJoin(Permission, 'p', 'p.id = a.permissionId')
      .innerJoin(
        SubjectGroupTimeSlot,
        'sgts',
        'sgts.id = dr.subjectGroupTimeSlotId',
      )
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Subject, 's', 's.id = sg.subjectId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .where(
        new Brackets((qb) => {
          qb.where("p.status != 'A'").orWhere('p.id is null');
        }),
      )
      .groupBy('sg.id')
      .addGroupBy('g.periodId')
      .addGroupBy('st.id')
      .orderBy('absences', 'DESC'),
})
export class AbsenceCountBySubjectView {
  @ViewColumn()
  absences: number;

  @ViewColumn()
  subjectName: string;

  @ViewColumn()
  subjectGroupId: number;

  @ViewColumn()
  periodId: number;

  @ViewColumn()
  studentId: number;
}
