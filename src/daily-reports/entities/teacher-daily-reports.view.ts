import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { DailyReport } from './daily-report.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TimeSlot } from '@time-slots/entities/time-slot.entity';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';
import { Group } from '@groups/entities/group.entity';
import { Teacher } from '@teachers/entities/teacher.entity';
import { Subject } from '@subjects/entities/subject.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('sgts.id', 'subjectGroupTimeSlotId')
      .addSelect('dr.id', 'dailyReportId')
      .addSelect('dr.reportDate', 'reportDate')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('s.name', 'subjectName')
      .addSelect('g.name', 'groupName')
      .addSelect('sg.id', 'subjectGroupId')
      .addSelect('dr.isSubmitted', 'isSubmitted')
      .addSelect('g.periodId', 'periodId')
      .addSelect('t.id', 'teacherId')
      .from(SubjectGroupTimeSlot, 'sgts')
      .innerJoin(DailyReport, 'dr', 'sgts.id = dr.subjectGroupTimeSlotId')
      .innerJoin(TimeSlot, 'ts', 'ts.id = sgts.timeSlotId')
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .innerJoin(Teacher, 't', 't.id = sg.teacherId')
      .innerJoin(Subject, 's', 's.id = sg.subjectId')
      .orderBy('ts.startTime', 'ASC'),
})
export class TeacherDailyReportView {
  @ViewColumn()
  dailyReportId: number;

  @ViewColumn()
  subjectGroupTimeSlotId: number;

  @ViewColumn()
  subjectGroupId: number;

  @ViewColumn()
  reportDate: string;

  @ViewColumn()
  startTime: string;

  @ViewColumn()
  endTime: string;

  @ViewColumn()
  subjectName: string;

  @ViewColumn()
  groupName: string;

  @ViewColumn()
  isSubmitted: boolean;

  @ViewColumn()
  teacherId: number;
}
