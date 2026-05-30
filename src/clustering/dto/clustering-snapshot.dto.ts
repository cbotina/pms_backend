/** Types aligned with phase4a-plan.md §8 (POST/GET clustering internal API). */

export interface ClusteringPerQuestionRow {
  id: string;
  type: string;
  topic?: string;
  score: number;
  maxScore: number;
  correct: boolean;
}

export interface ClusteringSnapshotAttempt {
  gradedAt: string;
  score: number;
  maxScore: number;
  durationSeconds: number | null;
  questionCount: number;
  perQuestion: ClusteringPerQuestionRow[];
}

export interface ClusteringSnapshotStudent {
  studentId: number;
  attempts: ClusteringSnapshotAttempt[];
}

export interface ClusteringRunRequest {
  subjectGroupId: number;
  students: ClusteringSnapshotStudent[];
}

export interface ClusteringRunResponse {
  runId: number;
  subjectGroupId: number;
  status: string;
  nStudents?: number;
  nClusters?: number;
  noiseCount?: number;
  reason?: string;
}

export interface ClusteringClusterRow {
  label: number;
  title: string;
  description: string;
  strongTopics: string[];
  weakTopics: string[];
  studentIds: number[];
}

export interface ClusteringResultsResponse {
  runId: number;
  subjectGroupId: number;
  status: string;
  createdAt: string;
  nStudents: number;
  nClusters: number;
  noiseCount?: number;
  noiseStudentIds?: number[];
  clusters: ClusteringClusterRow[];
}
