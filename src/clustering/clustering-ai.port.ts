import type {
  ClusteringResultsResponse,
  ClusteringRunRequest,
  ClusteringRunResponse,
} from './dto/clustering-snapshot.dto';

export const CLUSTERING_AI_PORT = Symbol('CLUSTERING_AI_PORT');

export interface ClusteringAiPort {
  runClustering(
    body: ClusteringRunRequest,
  ): Promise<ClusteringRunResponse | null>;
  getClusteringResults(
    subjectGroupId: number,
  ): Promise<ClusteringResultsResponse | null>;
}
