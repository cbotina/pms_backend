import { Absence } from 'src/absences/entities/absence.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class DailyReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reportDate: Date;

  @Column({ default: false })
  isSubmitted: boolean;

  @ManyToOne(() => SubjectGroupTimeSlot, (sgts) => sgts.dailyReports, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  subjectGroupTimeSlot: SubjectGroupTimeSlot;

  @OneToMany(() => Absence, (absence) => absence.dailyReport)
  absences: Absence[];
}
