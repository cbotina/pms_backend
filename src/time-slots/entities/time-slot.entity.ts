import { Period } from 'src/periods/entities/period.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column({ type: 'time' })
  startTime: Date;

  @Column({ type: 'time' })
  endTime: Date;

  @Column()
  isAcademic: boolean;

  @ManyToOne(() => Period, (period) => period.timeSlots, {
    onDelete: 'CASCADE',
  })
  period: Period;
}
