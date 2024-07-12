import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Gender, Student } from 'src/students/entities/student.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('st.id', 'studentId')
      .addSelect('en.subjectGroupId', 'subjectGroupId')
      .addSelect('st.gender', 'studentGender')
      .addSelect(`st.firstName`, 'studentFirstName')
      .addSelect(`st.lastName`, 'studentLastName')
      .from(Enrollment, 'en')
      .innerJoin(Student, 'st', 'st.id = en.studentId'),
})
export class SubjectGroupStudentsView {
  @ViewColumn()
  studentId: number;

  @ViewColumn()
  studentFirstName: string;

  @ViewColumn()
  studentGender: Gender;

  @ViewColumn()
  studentLastName: string;
}
