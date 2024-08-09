import { Brackets, DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Absence } from './absence.entity';
import { Student } from 'src/students/entities/student.entity';
import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Permission } from 'src/permissions/entities/permission.entity';

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
