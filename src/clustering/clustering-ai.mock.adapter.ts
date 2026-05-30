/**
 * TODO: Remove this and replace with actual implementation after phase 4A is ready
 *
 * Temporary mock for AI clustering HTTP — logs snapshots and serves static GET results.
 */
import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { ClusteringAiPort } from './clustering-ai.port';
import type {
  ClusteringResultsResponse,
  ClusteringRunRequest,
  ClusteringRunResponse,
} from './dto/clustering-snapshot.dto';

const MOCK_RESULTS_SUBJECT_GROUP_ID = 15;

@Injectable()
export class ClusteringAiMockAdapter implements ClusteringAiPort {
  private readonly logger = new Logger(ClusteringAiMockAdapter.name);

  // TODO: Remove this and replace with actual implementation after phase 4A is ready
  async runClustering(
    body: ClusteringRunRequest,
  ): Promise<ClusteringRunResponse | null> {
    const payload = JSON.stringify(body, null, 2);
    this.logger.log(
      `[clustering-mock] POST /internal/clustering/run (mock)\n${payload}`,
    );
    return {
      runId: 1,
      subjectGroupId: body.subjectGroupId,
      status: 'completed',
      nStudents: body.students.length,
      nClusters: 3,
      noiseCount: 1,
    };
  }

  // TODO: Remove this and replace with actual implementation after phase 4A is ready
  async getClusteringResults(
    subjectGroupId: number,
  ): Promise<ClusteringResultsResponse | null> {
    if (subjectGroupId !== MOCK_RESULTS_SUBJECT_GROUP_ID) {
      return null;
    }
    const path = join(__dirname, 'fixtures', 'clustering-mock-results.json');
    const raw = JSON.parse(readFileSync(path, 'utf8')) as Record<
      string,
      unknown
    >;
    delete raw._comment;
    return raw as unknown as ClusteringResultsResponse;
  }
}
