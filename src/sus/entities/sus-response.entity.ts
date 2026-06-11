import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** One System Usability Scale response per student (tool-wide feedback). */
@Entity('sus_responses')
export class SusResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  /** 10 Likert answers, values 1-5, in SUS question order. */
  @Column({ type: 'json' })
  answersJson: number[];

  /** Computed SUS score 0-100 (stored to keep aggregates cheap). */
  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
