import { Permission } from 'src/permissions/entities/permission.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Absence } from './absence.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { Group } from 'src/groups/entities/group.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .addSelect('dr.reportDate', 'absenceDate')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('sub.name', 'subjectName')
      .addSelect('p.id', 'permissionId')
      .addSelect('p.status', 'permissionStatus')
      .addSelect('a.teacherNote', 'teacherNote')
      .addSelect('a.id', 'absenceId')
      .addSelect('p.studentId', 'studentId')
      .addSelect('g.periodId', 'periodId')
      .from(Permission, 'p')
      .innerJoin(Absence, 'a', 'a.permissionId = p.id')
      .innerJoin(DailyReport, 'dr', 'dr.id = a.dailyReportId')
      .innerJoin(
        SubjectGroupTimeSlot,
        'sgts',
        'sgts.id = dr.subjectGroupTimeSlotId',
      )
      .innerJoin(TimeSlot, 'ts', 'ts.id = sgts.timeSlotId')
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .innerJoin(Subject, 'sub', 'sub.id = sg.subjectId'),
})
export class PermissionAbsenceDetailsView {
  @ViewColumn()
  absenceDate: Date;

  @ViewColumn()
  absenceId: number;

  @ViewColumn()
  startTime: Date;

  @ViewColumn()
  endTime: Date;

  @ViewColumn()
  teacherNote: string;

  @ViewColumn()
  subjectName: string;
}
