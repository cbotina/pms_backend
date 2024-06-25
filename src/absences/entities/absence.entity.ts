import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Student } from 'src/students/entities/student.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  teacherNote: string;

  @ManyToOne(() => Permission, (permission) => permission.absences)
  permission?: Permission;

  @ManyToOne(() => DailyReport, (dailyReport) => dailyReport.absences)
  dailyReport: DailyReport;

  @ManyToOne(() => Student, (student) => student.absences)
  student: Student;
}
