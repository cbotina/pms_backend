import { Group } from 'src/groups/entities/group.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cc: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @ManyToOne(() => Group, (group) => group.students)
  group: Group;
}
