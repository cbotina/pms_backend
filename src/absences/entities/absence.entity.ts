import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Absence {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  teacherNote: string;

  @ManyToOne(() => Permission, (permission) => permission.absences)
  permission?: Permission;

  @ManyToOne(() => DailyReport, (dailyReport) => dailyReport.absences)
  @JoinColumn()
  dailyReport: DailyReport;

  @ManyToOne(() => Student, (student) => student.absences)
  student: Student;
}
