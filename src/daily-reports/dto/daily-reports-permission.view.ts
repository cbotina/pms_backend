import { Absence } from 'src/absences/entities/absence.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Student } from 'src/students/entities/student.entity';
import { ViewEntity, ViewColumn, DataSource } from 'typeorm';
import { DailyReport } from '../entities/daily-report.entity';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('a.id', 'absenceId')
      .addSelect('dr.id', 'dailyReportId')
      .addSelect('s.id', 'studentId')
      .addSelect(`concat(s.lastName, ' ', s.firstName)`, 'studentName')
      .addSelect('p.reason', 'permissionReason')
      .addSelect('p.status', 'permissionStatus')
      .addSelect('p.id', 'permissionId')
      .from(Absence, 'a')
      .innerJoin(Permission, 'p', 'a.permissionId = p.id')
      .innerJoin(Student, 's', 's.id = a.studentId')
      .innerJoin(DailyReport, 'dr', 'dr.id = a.dailyReportId'),
})
export class DailyReportPermissionView {
  @ViewColumn()
  dailyReportId: number;

  @ViewColumn()
  absenceId: number;

  @ViewColumn()
  studentId: number;

  @ViewColumn()
  studentName: string;

  @ViewColumn()
  permissionReason: string;

  @ViewColumn()
  permissionStatus: string;

  @ViewColumn()
  permissionId: number;
}
