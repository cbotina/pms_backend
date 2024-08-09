import { Permission } from 'src/permissions/entities/permission.entity';
import { Brackets, DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Absence } from './absence.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { Student } from 'src/students/entities/student.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .addSelect('a.id', 'absenceId')
      .addSelect(`CONCAT(st.firstName, ' ', st.lastName)`, 'student')
      .addSelect(`st.cc`, 'studentCC')
      .addSelect('dr.reportDate', 'absenceDate')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('p.status', 'permissionStatus')
      .addSelect('ts.periodId', 'periodId')
      .addSelect('s.name', 'subjectName')
      .addSelect('a.teacherNote', 'teacherNote')
      .from(Absence, 'a')
      .innerJoin(Student, 'st', 'st.id = a.studentId')
      .leftJoin(DailyReport, 'dr', 'dr.id = a.dailyReportId')
      .leftJoin(Permission, 'p', 'p.id = a.permissionId')
      .innerJoin(
        SubjectGroupTimeSlot,
        'sgts',
        'sgts.id = dr.subjectGroupTimeSlotId',
      )
      .innerJoin(TimeSlot, 'ts', 'ts.id = sgts.timeSlotId')
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Subject, 's', 's.id = sg.subjectId')
      .where(
        new Brackets((qb) => {
          qb.where("p.status != 'A'").orWhere('p.id is null');
        }),
      ),
})
export class AbsenceWithStudentView {
  @ViewColumn()
  absenceId: number;

  @ViewColumn()
  student: string;

  @ViewColumn()
  subjectName: string;

  @ViewColumn()
  studentCC: string;

  @ViewColumn()
  teacherNote: string;

  @ViewColumn()
  absenceDate: Date;

  @ViewColumn()
  startTime: Date;

  @ViewColumn()
  endTime: Date;

  @ViewColumn()
  permissionStatus?: string;
}
