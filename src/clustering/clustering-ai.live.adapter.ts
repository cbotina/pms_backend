import { Injectable, Logger } from '@nestjs/common';
import { AiServiceClient } from 'src/ai-service/ai-service.client';
import type { ClusteringAiPort } from './clustering-ai.port';
import type {
  ClusteringResultsResponse,
  ClusteringRunRequest,
  ClusteringRunResponse,
} from './dto/clustering-snapshot.dto';

@Injectable()
export class ClusteringAiLiveAdapter implements ClusteringAiPort {
  private readonly logger = new Logger(ClusteringAiLiveAdapter.name);

  constructor(private readonly aiClient: AiServiceClient) {}

  async runClustering(
    body: ClusteringRunRequest,
  ): Promise<ClusteringRunResponse | null> {
    const res = await this.aiClient.runClustering(body);
    if (!res) {
      this.logger.warn('runClustering: AI service returned no response');
    }
    return res;
  }

  async getClusteringResults(
    subjectGroupId: number,
  ): Promise<ClusteringResultsResponse | null> {
    return this.aiClient.getClusteringResults(subjectGroupId);
  }
}
