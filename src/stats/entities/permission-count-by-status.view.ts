import { Group } from '@groups/entities/group.entity';
import { Permission } from '@permissions/entities/permission.entity';
import { Student } from '@students/entities/student.entity';
import { DataSource, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .addSelect('p.status', 'status')
      .addSelect('g.periodId', 'periodId')
      .from(Permission, 'p')
      .innerJoin(Student, 'st', 'p.studentId = st.id')
      .innerJoin(Group, 'g', 'g.id = st.groupId')
      .groupBy('p.status')
      .addGroupBy('g.periodId'),
})
export class PermissionCountByStatusView {
  @ViewColumn()
  count: number;

  @ViewColumn()
  status: string;

  @ViewColumn()
  periodId: number;
}
