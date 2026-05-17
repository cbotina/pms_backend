import { Conversation } from 'src/chat/entities/conversation.entity';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PracticeAttempt } from './practice-attempt.entity';

export enum PracticeTestStatus {
  GENERATING = 'generating',
  READY = 'ready',
  FAILED = 'failed',
}

@Entity('practice_tests')
export class PracticeTest {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Index()
  @ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Index()
  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Index()
  @ManyToOne(() => SubjectGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subjectGroupId' })
  subjectGroup: SubjectGroup;

  @Column({
    type: 'enum',
    enum: PracticeTestStatus,
    default: PracticeTestStatus.GENERATING,
  })
  status: PracticeTestStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  aiJobId: string | null;

  @Column({ type: 'json', nullable: true })
  questionsJson: Record<string, unknown> | null;

  @Column({ type: 'int', default: 1 })
  schemaVersion: number;

  @Column({ type: 'int', nullable: true })
  questionCount: number | null;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'timestamp', nullable: true })
  processingStartedAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt: Date | null;

  @OneToMany(() => PracticeAttempt, (a) => a.practiceTest)
  attempts: PracticeAttempt[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
