import { Group } from 'src/groups/entities/group.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SubjectGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hours: number;

  @ManyToOne(() => Teacher, (teacher) => teacher.subjectGroups)
  teacher: Teacher;

  @ManyToOne(() => Subject, (subject) => subject.subjectGroups)
  subject: Subject;

  @ManyToOne(() => Group, (group) => group.subjectGroups)
  group: Group;

  @OneToMany(() => SubjectGroupTimeSlot, (sgts) => sgts.subjectGroup)
  subjectGroupTimeslots: SubjectGroupTimeSlot[];
}
