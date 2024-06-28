import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
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

  @ManyToOne(() => Teacher, (teacher) => teacher.subjectGroups, {
    onDelete: 'CASCADE',
  })
  teacher: Teacher;

  @ManyToOne(() => Subject, (subject) => subject.subjectGroups, {
    onDelete: 'CASCADE',
  })
  subject: Subject;

  @ManyToOne(() => Group, (group) => group.subjectGroups, {
    onDelete: 'CASCADE',
  })
  group: Group;

  @OneToMany(() => SubjectGroupTimeSlot, (sgts) => sgts.subjectGroup)
  subjectGroupTimeslots: SubjectGroupTimeSlot[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.subjectGroup)
  enrollments: Enrollment[];
}
