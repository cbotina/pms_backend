import { Group } from 'src/groups/entities/group.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('sgts.id', 'subjectGroupTimeSlotId')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('g.periodId', 'periodId')
      .addSelect('g.name', 'groupName')
      .addSelect('sub.name', 'subjectName')
      .addSelect('sgts.day', 'day')
      .addSelect('t.id', 'teacherId')
      .from(SubjectGroupTimeSlot, 'sgts')
      .innerJoin(TimeSlot, 'ts', 'ts.id = sgts.timeSlotId')
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .innerJoin(Subject, 'sub', 'sub.id = sg.subjectId')
      .innerJoin(Teacher, 't', 't.id = sg.teacherId'),
})
export class TeacherScheduleView {
  @ViewColumn()
  subjectGroupTimeSlotId: number;

  @ViewColumn()
  startTime: Date;

  @ViewColumn()
  endTime: Date;

  @ViewColumn()
  periodId: number;

  @ViewColumn()
  groupName: string;

  @ViewColumn()
  subjectName: string;

  @ViewColumn()
  day: string;
}
