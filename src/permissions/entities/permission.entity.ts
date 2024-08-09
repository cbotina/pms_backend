import { Absence } from 'src/absences/entities/absence.entity';
import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PermissionStatus {
  PENDING = 'P',
  LEAVE_PERMISSION = 'L',
  APPROVED = 'A',
  REJECTED = 'R',
}

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PermissionStatus,
    default: PermissionStatus.PENDING,
  })
  status: PermissionStatus;

  @Column()
  requestDate: Date;

  @Column({ nullable: true })
  approvalDate: Date;

  @Column({ nullable: true })
  justificationDeadline: Date;

  @Column()
  reason: string;

  @Column({ type: 'text', nullable: true })
  evidenceUrl: string;

  @Column({ nullable: true })
  studentNote: string;

  @Column({ nullable: true })
  principalNote: string;

  @ManyToOne(() => Student, (student) => student.permissions, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @OneToMany(() => Absence, (absence) => absence.permission)
  absences: Absence[];
}
