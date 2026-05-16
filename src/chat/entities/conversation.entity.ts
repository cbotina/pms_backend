import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';

export enum ChatMode {
  ASK = 'ask',
  PRACTICE = 'practice',
}

@Entity('chat_conversation')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ChatMode,
    default: ChatMode.ASK,
  })
  mode: ChatMode;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => SubjectGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subjectGroupId' })
  subjectGroup: SubjectGroup;

  @OneToMany(() => Message, (m) => m.conversation, { cascade: true })
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
