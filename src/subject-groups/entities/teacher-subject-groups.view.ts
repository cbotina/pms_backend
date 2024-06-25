import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { SubjectGroup } from './subject-group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('sg.id', 'subjectGroupId')
      .addSelect('sub.name', 'subjectName')
      .addSelect('g.name', 'groupName')
      .addSelect('t.id', 'teacherId')
      .addSelect('g.periodId', 'periodId')
      .from(SubjectGroup, 'sg')
      .innerJoin(Subject, 'sub', 'sub.id = sg.subjectId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .innerJoin(Teacher, 't', 't.id = sg.teacherId'),
})
export class TeacherSubjectsView {
  @ViewColumn()
  subjectGroupId: number;

  @ViewColumn()
  subjectName: string;

  @ViewColumn()
  groupName: string;
}
