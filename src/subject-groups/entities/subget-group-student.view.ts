import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Student } from 'src/students/entities/student.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('st.id', 'studentId')
      .addSelect('en.subjectGroupId', 'subjectGroupId')
      .addSelect(`concat(st.lastName, ' ', st.firstName)`, 'studentName')
      .from(Enrollment, 'en')
      .innerJoin(Student, 'st', 'st.id = en.studentId'),
})
export class SubjectGroupStudentsView {
  @ViewColumn()
  studentId: number;

  @ViewColumn()
  studentName: string;
}
