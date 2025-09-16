import { Group } from '@groups/entities/group.entity';
import { Permission } from '@permissions/entities/permission.entity';
import { Student } from '@students/entities/student.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .addSelect('p.reason', 'reason')
      .addSelect('g.periodId', 'periodId')
      .from(Permission, 'p')
      .innerJoin(Student, 'st', 'p.studentId = st.id')
      .innerJoin(Group, 'g', 'g.id = st.groupId')
      .groupBy('p.reason')
      .addGroupBy('g.periodId'),
})
export class PermissionCountByReasonView {
  @ViewColumn()
  count: number;

  @ViewColumn()
  reason: string;

  @ViewColumn()
  periodId: number;
}
