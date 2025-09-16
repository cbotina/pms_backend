import { Enrollment } from '@enrollments/entities/enrollment.entity';
import { Group } from '@groups/entities/group.entity';
import { Student } from '@students/entities/student.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';
import { Subject } from '@subjects/entities/subject.entity';
import { Teacher } from '@teachers/entities/teacher.entity';
import { TimeSlot } from '@time-slots/entities/time-slot.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('sgts.id', 'subjectGroupTimeSlotId')
      .addSelect('sg.id', 'subjectGroupId')
      .addSelect('ts.startTime', 'startTime')
      .addSelect('ts.endTime', 'endTime')
      .addSelect('sub.name', 'subjectName')
      .addSelect('sgts.day', 'day')
      .addSelect('st.id', 'studentId')
      .addSelect('g.periodId', 'periodId')
      .addSelect(`concat(t.firstName, ' ', t.lastname)`, 'teacherName')
      .from(SubjectGroupTimeSlot, 'sgts')
      .innerJoin(TimeSlot, 'ts', 'ts.id = sgts.timeSlotId')
      .innerJoin(SubjectGroup, 'sg', 'sg.id = sgts.subjectGroupId')
      .innerJoin(Teacher, 't', 't.id = sg.teacherId')
      .innerJoin(Subject, 'sub', 'sub.id = sg.subjectId')
      .innerJoin(Enrollment, 'en', 'en.subjectGroupId = sg.id')
      .innerJoin(Student, 'st', 'st.id = en.studentId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId'),
})
export class StudentScheduleView {
  @ViewColumn()
  subjectGroupTimeSlotId: number;

  @ViewColumn()
  subjectGroupId: number;

  @ViewColumn()
  startTime: Date;

  @ViewColumn()
  endTime: Date;

  @ViewColumn()
  subjectName: string;

  @ViewColumn()
  teacherName: string;

  @ViewColumn()
  day: string;
}
