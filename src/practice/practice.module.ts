import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from 'src/chat/chat.module';
import { Conversation } from 'src/chat/entities/conversation.entity';
import { DocumentsModule } from 'src/documents/documents.module';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { PracticeAttempt } from './entities/practice-attempt.entity';
import { PracticeTest } from './entities/practice-test.entity';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PracticeTest,
      PracticeAttempt,
      Conversation,
      Enrollment,
    ]),
    DocumentsModule,
    ChatModule,
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
})
export class PracticeModule {}
