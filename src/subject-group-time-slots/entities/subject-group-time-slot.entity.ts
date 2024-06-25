import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum WeekDay {
  MONDAY = 'MON',
  TUESDAY = 'TUE',
  WEDNESDAY = 'WED',
  THURSDAY = 'THU',
  FRIDAY = 'FRI',
}

@Entity()
export class SubjectGroupTimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TimeSlot, (ts) => ts.subjectGroupTimeSlots)
  timeSlot: TimeSlot;

  @ManyToOne(() => SubjectGroup, (sg) => sg.subjectGroupTimeslots)
  subjectGroup: SubjectGroup;

  @Column({
    type: 'enum',
    enum: WeekDay,
  })
  day: WeekDay;

  @OneToMany(
    () => DailyReport,
    (dailyReport) => dailyReport.subjectGroupTimeSlot,
  )
  dailyReports: DailyReport[];
}
