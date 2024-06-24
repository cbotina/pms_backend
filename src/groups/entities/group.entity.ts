import { Period } from 'src/periods/entities/period.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Teacher, (teacher) => teacher.tutoredGroups)
  tutor: Teacher;
}
