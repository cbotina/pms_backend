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

  @Column({ nullable: true })
  semester: string;

  @Column({
    type: 'enum',
    enum: Modality,
    nullable: true,
  })
  modality: Modality;

  @ManyToOne(() => Period, (period) => period.groups, {
    onDelete: 'CASCADE',
  })
  period: Period;

  @ManyToOne(() => Teacher, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tutor?: Teacher;

  @OneToMany(() => SubjectGroup, (subjectGroup) => subjectGroup.group)
  subjectGroups: SubjectGroup[];

  @OneToMany(() => Student, (student) => student.group)
  students: Student[];
}
