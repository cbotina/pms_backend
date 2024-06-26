import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { DailyReport } from './daily-report.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Subject } from 'src/subjects/entities/subject.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('sgts.id', 'subjectGroupTimeSlotId')
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
      .innerJoin(Subject, 's', 's.id = sg.subjectId'),
})
export class TeacherDailyReportsView {
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
}
