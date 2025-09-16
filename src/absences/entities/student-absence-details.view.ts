import { Permission } from '@permissions/entities/permission.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Absence } from './absence.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TimeSlot } from '@time-slots/entities/time-slot.entity';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';
import { DailyReport } from '@daily-reports/entities/daily-report.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .addSelect('a.id', 'absenceId')
      .addSelect('dr.reportDate', 'absenceDate')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('p.status', 'permissionStatus')
      .addSelect('a.teacherNote', 'teacherNote')
      .addSelect('a.studentId', 'studentId')
      .addSelect('sg.id', 'subjectGroupId')
      .from(Absence, 'a')
      .innerJoin(DailyReport, 'dr', 'dr.id = a.dailyReportId')
      .leftJoin(Permission, 'p', 'p.id = a.permissionId')
      .innerJoin(
        SubjectGroupTimeSlot,
        'sgts',
        'sgts.id = dr.subjectGroupTimeSlotId',
      )
      .innerJoin(TimeSlot, 'ts', 'ts.id = sgts.timeSlotId')
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId'),
})
export class SubjectGroupStudentAbsenceDetailsView {
  @ViewColumn()
  absenceId: number;

  @ViewColumn()
  absenceDate: Date;

  @ViewColumn()
  startTime: Date;

  @ViewColumn()
  endTime: Date;

  @ViewColumn()
  teacherNote: string;

  @ViewColumn()
  permissionStatus: string;
}
