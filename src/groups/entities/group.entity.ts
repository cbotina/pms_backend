import { Period } from 'src/periods/entities/period.entity';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Modality {
  ACADEMIC = 'ACADEMIC',
  PEDAGOGIC = 'PEDAGOGIC',
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  semester: string;

  @Column({
    type: 'enum',
    enum: Modality,
  })
  modality: Modality;

  @ManyToOne(() => Period, (period) => period.groups)
  period: Period;

  @OneToOne(() => Teacher)
  @JoinColumn()
  tutor: Teacher;

  @OneToMany(() => SubjectGroup, (subjectGroup) => subjectGroup.group)
  subjectGroups: SubjectGroup[];

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];
}
