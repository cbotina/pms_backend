import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { DocumentsModule } from 'src/documents/documents.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { OpenaiService } from './openai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      Message,
      Enrollment,
      SubjectGroup,
    ]),
    DocumentsModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, OpenaiService],
})
export class ChatModule {}
