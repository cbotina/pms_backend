import { Absence } from 'src/absences/entities/absence.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
}
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

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @ManyToOne(() => Group, (group) => group.students, {
    onDelete: 'CASCADE',
  })
  group: Group;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @OneToMany(() => Permission, (permission) => permission.student)
  permissions: Permission[];

  @OneToMany(() => Absence, (absence) => absence.student)
  absences: Absence[];
}
