import { Permission } from 'src/permissions/entities/permission.entity';
import { Brackets, DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Absence } from './absence.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { Gender, Student } from 'src/students/entities/student.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('count(*)', 'absences')
      .addSelect(`concat(st.firstName, ' ', st.lastName)`, 'student')
      .addSelect(`st.gender`, 'studentGender')
      .addSelect('sg.id', 'subjectGroupId')
      .from(DailyReport, 'dr')
      .innerJoin(Absence, 'a', 'a.dailyReportId = dr.id')
      .leftJoin(Permission, 'p', 'p.id = a.permissionId')
      .innerJoin(
        SubjectGroupTimeSlot,
        'sgts',
        'sgts.id = dr.subjectGroupTimeSlotId',
      )
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Student, 'st', 'st.id = a.studentId')
      .where(
        new Brackets((qb) => {
          qb.where("p.status != 'A'").orWhere('p.id is null');
        }),
      )
      .groupBy('a.studentId')
      .addGroupBy('st.firstName')
      .addGroupBy('st.lastName')
      .addGroupBy('sg.id')
      .orderBy('absences', 'DESC'),
})
export class AbsenceCountView {
  @ViewColumn()
  absences: number;

  @ViewColumn()
  student: string;

  @ViewColumn()
  studentGender: Gender;
}
