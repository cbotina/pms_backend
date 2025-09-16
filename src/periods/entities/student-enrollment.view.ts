import { DataSource, ViewColumn, ViewEntity } from 'typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Period } from 'src/periods/entities/period.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('en.id', 'enrollmentId')
      .addSelect('sub.name', 'subjectName')
      .addSelect(`concat(t.firstName, ' ', t.lastName)`, 'teacherName')
      .addSelect('p.id', 'periodId')
      .addSelect('st.id', 'studentId')
      .from(Enrollment, 'en')
      .innerJoin(Student, 'st', 'st.id = en.studentId')
      .innerJoin(SubjectGroup, 'sg', 'sg.id = en.subjectGroupId')
      .innerJoin(Subject, 'sub', 'sub.id = sg.subjectId')
      .innerJoin(Teacher, 't', 't.id = sg.teacherId')
      .innerJoin(Group, 'g', 'g.id = sg.groupId')
      .innerJoin(Period, 'p', 'p.id = g.periodId'),
})
export class StudentEnrollmentView {
  @ViewColumn()
  enrollmentId: number;

  @ViewColumn()
  subjectName: string;

  @ViewColumn()
  teacherName: string;

  @ViewColumn()
  periodId: number;

  @ViewColumn()
  studentId: number;
}
