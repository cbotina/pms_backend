import { Group } from 'src/groups/entities/group.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Period {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ default: false })
  active: boolean;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.period)
  timeSlots: TimeSlot[];

  @OneToMany(() => Group, (group) => group.period)
  groups: Group[];
}
