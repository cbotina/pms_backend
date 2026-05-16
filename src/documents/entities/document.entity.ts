import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}

@Entity('documents')
export class Document {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Index()
  @ManyToOne(() => SubjectGroup, { onDelete: 'CASCADE' })
  subjectGroup: SubjectGroup;

  @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
  uploadedBy: Teacher;

  @Column({ nullable: true })
  filename: string;

  @Column({ length: 100 })
  mimeType: string;

  @Column({ nullable: true })
  sizeBytes: number;

  @Column({ length: 500, nullable: true })
  storagePath: string;

  @Index()
  @Column({ type: 'enum', enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ nullable: true })
  chunkCount: number;

  @Column({ type: 'timestamp', nullable: true })
  processingStartedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastSyncedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
