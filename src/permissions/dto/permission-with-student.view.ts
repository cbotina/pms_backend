import {
  Permission,
  PermissionStatus,
} from 'src/permissions/entities/permission.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

import { Student } from 'src/students/entities/student.entity';
import { Group } from 'src/groups/entities/group.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('p.id', 'permissionId')
      .addSelect('p.requestDate', 'requestDate')
      .addSelect(`concat(st.firstName, ' ', st.lastName)`, 'student')
      .addSelect('p.reason', 'reason')
      .addSelect('p.status', 'status')
      .addSelect('g.periodId', 'periodId')
      .addSelect('st.id', 'studentId')
      .from(Permission, 'p')
      .innerJoin(Student, 'st', 'st.id = p.studentId')
      .innerJoin(Group, 'g', 'g.id = st.groupId')
      .orderBy('p.requestDate', 'DESC'),
})
export class PermissionWithStudentView {
  @ViewColumn()
  permissionId: number;

  @ViewColumn()
  studentId: number;

  @ViewColumn()
  requestDate: Date;

  @ViewColumn()
  student: string;

  @ViewColumn()
  reason: string;

  @ViewColumn()
  status: PermissionStatus;
}
