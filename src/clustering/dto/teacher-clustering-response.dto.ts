export interface TeacherClusteringMember {
  studentId: number;
  name: string;
}

export interface TeacherClusteringCluster {
  label: number;
  title: string;
  description: string;
  strongTopics: string[];
  weakTopics: string[];
  members: TeacherClusteringMember[];
}

export type TeacherClusteringInsightsResponse =
  | {
      runId: number;
      createdAt: string;
      status: string;
      nClusters: number;
      nStudents: number;
      noiseStudents: TeacherClusteringMember[];
      clusters: TeacherClusteringCluster[];
    }
  | {
      status: 'no_data';
      message: string;
    };

export type TeacherClusteringRecomputeResponse =
  | { status: 'accepted'; runId?: number }
  | { status: 'skipped'; message: string };
