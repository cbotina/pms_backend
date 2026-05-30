import { ClusteringAiMockAdapter } from './clustering-ai.mock.adapter';

describe('ClusteringAiMockAdapter', () => {
  let adapter: ClusteringAiMockAdapter;

  beforeEach(() => {
    adapter = new ClusteringAiMockAdapter();
  });

  it('getClusteringResults returns fixture for subject group 15', async () => {
    const r = await adapter.getClusteringResults(15);
    expect(r).not.toBeNull();
    expect(r?.status).toBe('completed');
    expect(r?.nClusters).toBe(3);
    expect(r?.clusters?.length).toBe(3);
  });

  it('getClusteringResults returns null for unknown group', async () => {
    await expect(adapter.getClusteringResults(99)).resolves.toBeNull();
  });

  it('runClustering returns synthetic success', async () => {
    const res = await adapter.runClustering({
      subjectGroupId: 7,
      students: [{ studentId: 1, attempts: [] }],
    });
    expect(res?.status).toBe('completed');
    expect(res?.nStudents).toBe(1);
    expect(res?.subjectGroupId).toBe(7);
  });
});
