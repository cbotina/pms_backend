import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { PracticeAttempt } from 'src/practice/entities/practice-attempt.entity';
import { PracticeTest } from 'src/practice/entities/practice-test.entity';
import { CLUSTERING_AI_PORT } from './clustering-ai.port';
import { ClusteringAiLiveAdapter } from './clustering-ai.live.adapter';
import { ClusteringAiMockAdapter } from './clustering-ai.mock.adapter';
import { ClusteringController } from './clustering.controller';
import { ClusteringService } from './clustering.service';

@Module({
  imports: [
    ConfigModule,
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
    ClusteringAiMockAdapter,
    ClusteringAiLiveAdapter,
    {
      // TODO: Remove this and replace with actual implementation after phase 4A is ready
      provide: CLUSTERING_AI_PORT,
      useFactory: (
        config: ConfigService,
        mock: ClusteringAiMockAdapter,
        live: ClusteringAiLiveAdapter,
      ) => {
        const useMock = config.get<boolean>('clustering.aiMock');
        return useMock ? mock : live;
      },
      inject: [ConfigService, ClusteringAiMockAdapter, ClusteringAiLiveAdapter],
    },
  ],
})
export class ClusteringModule {}
