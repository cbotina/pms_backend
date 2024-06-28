import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    onDelete: 'CASCADE',
  })
  student: Student;

  @ManyToOne(() => SubjectGroup, (sg) => sg.enrollments, {
    onDelete: 'CASCADE',
  })
  subjectGroup: SubjectGroup;
}
