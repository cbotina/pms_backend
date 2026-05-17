import { Student } from 'src/students/entities/student.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { PracticeTest } from './practice-test.entity';

export enum PracticeGradeStatus {
  PENDING = 'pending',
  GRADING = 'grading',
  GRADED = 'graded',
  FAILED = 'failed',
}

@Entity('practice_attempts')
@Unique(['practiceTest', 'attemptNumber'])
export class PracticeAttempt {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Index()
  @ManyToOne(() => PracticeTest, (t) => t.attempts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'practiceTestId' })
  practiceTest: PracticeTest;

  @Index()
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'int', default: 1 })
  attemptNumber: number;

  @Column({ type: 'json' })
  answersJson: Record<string, unknown>;

  @Column({ type: 'int', nullable: true })
  score: number | null;

  @Column({ type: 'int', nullable: true })
  maxScore: number | null;

  @Column({ type: 'json', nullable: true })
  perQuestionJson: unknown[] | null;

  @Column({ type: 'json', nullable: true })
  weakTopicsJson: string[] | null;

  @Column({
    type: 'enum',
    enum: PracticeGradeStatus,
    default: PracticeGradeStatus.PENDING,
  })
  gradeStatus: PracticeGradeStatus;

  @Column({ type: 'int', nullable: true })
  durationSeconds: number | null;

  @CreateDateColumn()
  submittedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  gradedAt: Date | null;
}
