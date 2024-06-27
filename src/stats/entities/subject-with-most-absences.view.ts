import { Absence } from 'src/absences/entities/absence.entity';
import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Brackets, DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'absences')
      .addSelect('sub.name', 'subject')
      .addSelect('g.name', 'group')
      .addSelect('g.periodId', 'periodId')
      .from(Absence, 'a')
      .leftJoin(DailyReport, 'dr', 'dr.id = a.dailyReportId')
      .innerJoin(
        SubjectGroupTimeSlot,
        'sgts',
        'sgts.id = dr.subjectGroupTimeSlotId',
      )
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Subject, 'sub', 'sub.id = sg.subjectId')
      .innerJoin(Student, 'st', 'st.id = a.studentId')
      .leftJoin(Permission, 'p', 'a.permissionId = p.id')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .where(
        new Brackets((qb) => {
          qb.where('p.status IS NULL').orWhere('p.status != "A"');
        }),
      )
      .groupBy('sg.id')
      .addGroupBy('sub.name')
      .addGroupBy('g.name')
      .addGroupBy('g.periodId')
      .orderBy('absences', 'DESC'),
})
export class SubjectsWithMostAbsencesView {
  @ViewColumn()
  absences: number;

  @ViewColumn()
  subject: string;

  @ViewColumn()
  group: string;

  @ViewColumn()
  periodId: number;
}
