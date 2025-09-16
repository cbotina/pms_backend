import { Permission } from '@permissions/entities/permission.entity';
import { Brackets, DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Absence } from './absence.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TimeSlot } from '@time-slots/entities/time-slot.entity';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';
import { Subject } from '@subjects/entities/subject.entity';
import { DailyReport } from '@daily-reports/entities/daily-report.entity';
import { Group } from '@groups/entities/group.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .addSelect('a.id', 'absenceId')
      .addSelect('dr.reportDate', 'absenceDate')
      .addSelect('sg.id', 'subjectGroupId')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('sub.name', 'subjectName')
      .addSelect('p.id', 'permissionId')
      .addSelect('p.status', 'permissionStatus')
      .addSelect('a.teacherNote', 'teacherNote')
      .addSelect('a.studentId', 'studentId')
      .addSelect('g.periodId', 'periodId')
      .from(Absence, 'a')
      .innerJoin(DailyReport, 'dr', 'dr.id = a.dailyReportId')
      .leftJoin(Permission, 'p', 'p.id = a.permissionId')
      .innerJoin(
        SubjectGroupTimeSlot,
        'sgts',
        'sgts.id = dr.subjectGroupTimeSlotId',
      )
      .innerJoin(TimeSlot, 'ts', 'ts.id = sgts.timeSlotId')
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .innerJoin(Subject, 'sub', 'sub.id = sg.subjectId')
      .where(
        new Brackets((qb) => {
          qb.where('p.id is null');
        }),
      ),
})
export class UnjustifiedAbsenceDetailsView {
  @ViewColumn()
  absenceId: number;

  @ViewColumn()
  subjectGroupId: number;

  @ViewColumn()
  absenceDate: Date;

  @ViewColumn()
  startTime: Date;

  @ViewColumn()
  endTime: Date;

  @ViewColumn()
  teacherNote: string;

  @ViewColumn()
  subjectName: string;

  @ViewColumn()
  permissionStatus: string;
}
