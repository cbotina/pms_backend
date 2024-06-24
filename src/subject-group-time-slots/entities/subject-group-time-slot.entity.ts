import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Day {
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
    enum: Day,
  })
  day: Day;
}
