import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => SubjectGroup, (subjectGroup) => subjectGroup.subject)
  subjectGroups: SubjectGroup[];
}
