import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiServiceModule } from 'src/ai-service/ai-service.module';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { PracticeAttempt } from 'src/practice/entities/practice-attempt.entity';
import { PracticeTest } from 'src/practice/entities/practice-test.entity';
import { CLUSTERING_AI_PORT } from './clustering-ai.port';
import { ClusteringAiLiveAdapter } from './clustering-ai.live.adapter';
import { ClusteringController } from './clustering.controller';
import { ClusteringService } from './clustering.service';

@Module({
  imports: [
    ConfigModule,
    AiServiceModule,
    TypeOrmModule.forFeature([
      PracticeAttempt,
      PracticeTest,
      SubjectGroup,
      Student,
    ]),
  ],
  controllers: [ClusteringController],
  providers: [
    ClusteringService,
    {
      provide: CLUSTERING_AI_PORT,
      useClass: ClusteringAiLiveAdapter,
    },
  ],
})
export class ClusteringModule {}
