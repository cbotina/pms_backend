import { Group } from 'src/groups/entities/group.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  cc: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => Group)
  tutoredGroup: Group;

  @OneToMany(() => SubjectGroup, (subjectGroup) => subjectGroup.teacher)
  subjectGroups: SubjectGroup[];
}
