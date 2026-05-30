import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { In, Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import {
  PracticeAttempt,
  PracticeGradeStatus,
} from 'src/practice/entities/practice-attempt.entity';
import { PracticeTest } from 'src/practice/entities/practice-test.entity';
import { CLUSTERING_AI_PORT, type ClusteringAiPort } from './clustering-ai.port';
import type {
  ClusteringPerQuestionRow,
  ClusteringResultsResponse,
  ClusteringRunRequest,
  ClusteringRunResponse,
  ClusteringSnapshotAttempt,
  ClusteringSnapshotStudent,
} from './dto/clustering-snapshot.dto';
import type {
  TeacherClusteringInsightsResponse,
  TeacherClusteringMember,
  TeacherClusteringRecomputeResponse,
} from './dto/teacher-clustering-response.dto';

const MIN_STUDENTS = 8;
const MIN_ATTEMPTS_PER_STUDENT = 2;

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

const CRON_JOB_NAME = 'clustering-eligible-groups';

@Injectable()
export class ClusteringService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ClusteringService.name);
  private cronJob: CronJob | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    @InjectRepository(PracticeAttempt)
    private readonly attemptRepo: Repository<PracticeAttempt>,
    @InjectRepository(PracticeTest)
    private readonly testRepo: Repository<PracticeTest>,
    @InjectRepository(SubjectGroup)
    private readonly subjectGroupRepo: Repository<SubjectGroup>,
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @Inject(CLUSTERING_AI_PORT)
    private readonly clusteringAi: ClusteringAiPort,
  ) {}

  onModuleInit(): void {
    const enabled = this.configService.get<boolean>('clustering.enabled');
    if (!enabled) {
      this.logger.log('Clustering cron disabled (CLUSTERING_ENABLED=false)');
      return;
    }
    const pattern =
      this.configService.get<string>('clustering.cron') ?? '0 3 * * 0';
    this.cronJob = new CronJob(pattern, () => {
      void this.runForAllEligibleGroups();
    });
    this.schedulerRegistry.addCronJob(CRON_JOB_NAME, this.cronJob);
    this.cronJob.start();
    this.logger.log(`Clustering cron registered: ${pattern}`);
  }

  onModuleDestroy(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      try {
        this.schedulerRegistry.deleteCronJob(CRON_JOB_NAME);
      } catch {
        /* already removed */
      }
      this.cronJob = null;
    }
  }

  private requireTeacherId(user: JwtUser): number {
    if (user.entityId == null) {
      throw new ForbiddenException('Solo docentes pueden ver clustering.');
    }
    return user.entityId;
  }

  private async assertTeacherOwnsSubjectGroup(
    teacherId: number,
    subjectGroupId: number,
  ): Promise<SubjectGroup> {
    const sg = await this.subjectGroupRepo.findOne({
      where: { id: subjectGroupId },
      relations: ['teacher'],
    });
    if (!sg) {
      throw new NotFoundException('Grupo de asignatura no encontrado.');
    }
    if (sg.teacher?.id !== teacherId) {
      throw new ForbiddenException(
        'No tienes permiso para ver clustering de este grupo.',
      );
    }
    return sg;
  }

  private topicByQuestionId(
    questionsJson: Record<string, unknown> | null,
  ): Map<string, string> {
    const m = new Map<string, string>();
    const raw = questionsJson?.questions;
    if (!Array.isArray(raw)) return m;
    for (const q of raw) {
      if (!q || typeof q !== 'object') continue;
      const row = q as Record<string, unknown>;
      const id = String(row.id ?? '');
      if (!id) continue;
      const topic = typeof row.topic === 'string' ? row.topic : '';
      m.set(id, topic);
    }
    return m;
  }

  private mapPerQuestion(
    rows: unknown[] | null,
    topicByQuestionId: Map<string, string>,
  ): ClusteringPerQuestionRow[] {
    if (!Array.isArray(rows)) return [];
    const out: ClusteringPerQuestionRow[] = [];
    for (const row of rows) {
      if (!row || typeof row !== 'object') continue;
      const r = row as Record<string, unknown>;
      const id = String(r.id ?? '');
      if (!id) continue;
      const type = String(r.type ?? 'mcq');
      const topicFromRow =
        typeof r.topic === 'string' && r.topic ? r.topic : undefined;
      const topic = topicFromRow ?? topicByQuestionId.get(id);
      const pq: ClusteringPerQuestionRow = {
        id,
        type,
        score: Number(r.score ?? 0),
        maxScore: Number(r.maxScore ?? 0),
        correct: r.correct === true,
      };
      if (topic) {
        pq.topic = topic;
      }
      out.push(pq);
    }
    return out;
  }

  async buildSnapshot(subjectGroupId: number): Promise<{
    eligible: boolean;
    students: ClusteringSnapshotStudent[];
  }> {
    const rows = await this.attemptRepo
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.practiceTest', 't')
      .innerJoin('t.subjectGroup', 'sg')
      .innerJoinAndSelect('a.student', 'st')
      .where('sg.id = :sgId', { sgId: subjectGroupId })
      .andWhere('a.gradeStatus = :gs', { gs: PracticeGradeStatus.GRADED })
      .orderBy('a.submittedAt', 'ASC')
      .getMany();

    const byStudent = new Map<number, PracticeAttempt[]>();
    for (const a of rows) {
      const sid = a.student?.id;
      if (sid == null) continue;
      if (!byStudent.has(sid)) byStudent.set(sid, []);
      byStudent.get(sid).push(a);
    }

    const students: ClusteringSnapshotStudent[] = [];
    for (const [studentId, attempts] of byStudent) {
      if (attempts.length < MIN_ATTEMPTS_PER_STUDENT) continue;
      const snapshotAttempts: ClusteringSnapshotAttempt[] = [];
      for (const att of attempts) {
        const test = att.practiceTest;
        const qj = test?.questionsJson as Record<string, unknown> | null;
        const topicMap = this.topicByQuestionId(qj);
        const perQuestion = this.mapPerQuestion(
          att.perQuestionJson as unknown[] | null,
          topicMap,
        );
        const gradedAt = att.gradedAt ?? att.submittedAt;
        const questionCount =
          test?.questionCount != null && Number.isFinite(test.questionCount)
            ? test.questionCount
            : perQuestion.length;
        snapshotAttempts.push({
          gradedAt: gradedAt.toISOString(),
          score: att.score ?? 0,
          maxScore: att.maxScore ?? 0,
          durationSeconds: att.durationSeconds ?? null,
          questionCount,
          perQuestion,
        });
      }
      students.push({ studentId, attempts: snapshotAttempts });
    }

    const eligible = students.length >= MIN_STUDENTS;
    return { eligible, students };
  }

  private async resolveStudentNames(
    ids: number[],
  ): Promise<Map<number, string>> {
    const uniq = [...new Set(ids)].filter((id) => Number.isFinite(id));
    const map = new Map<number, string>();
    if (uniq.length === 0) return map;
    const found = await this.studentRepo.find({
      where: { id: In(uniq) },
    });
    for (const s of found) {
      map.set(s.id, `${s.firstName} ${s.lastName}`.trim());
    }
    for (const id of uniq) {
      if (!map.has(id)) {
        map.set(id, `Estudiante ${id}`);
      }
    }
    return map;
  }

  /** Builds teacher dashboard DTO from AI clustering results (names from DB). */
  async buildTeacherInsightsDto(
    raw: ClusteringResultsResponse,
  ): Promise<Exclude<TeacherClusteringInsightsResponse, { status: 'no_data' }>> {
    const ids: number[] = [...(raw.noiseStudentIds ?? [])];
    for (const c of raw.clusters) {
      ids.push(...c.studentIds);
    }
    const names = await this.resolveStudentNames(ids);

    const noiseStudents: TeacherClusteringMember[] = (
      raw.noiseStudentIds ?? []
    ).map((studentId) => ({
      studentId,
      name: names.get(studentId) ?? `Estudiante ${studentId}`,
    }));

    const clusters = raw.clusters.map((c) => ({
      label: c.label,
      title: c.title,
      description: c.description,
      strongTopics: c.strongTopics ?? [],
      weakTopics: c.weakTopics ?? [],
      members: c.studentIds.map((studentId) => ({
        studentId,
        name: names.get(studentId) ?? `Estudiante ${studentId}`,
      })),
    }));

    return {
      runId: raw.runId,
      createdAt: raw.createdAt,
      status: raw.status,
      nClusters: raw.nClusters,
      nStudents: raw.nStudents,
      noiseStudents,
      clusters,
    };
  }

  async getInsights(
    user: JwtUser,
    subjectGroupId: number,
  ): Promise<TeacherClusteringInsightsResponse> {
    const teacherId = this.requireTeacherId(user);
    await this.assertTeacherOwnsSubjectGroup(teacherId, subjectGroupId);

    const raw = await this.clusteringAi.getClusteringResults(subjectGroupId);
    if (!raw) {
      return {
        status: 'no_data',
        message:
          'Aún no hay resultados de clustering para este grupo. Necesitas al menos 8 estudiantes con 2 prácticas calificadas, o espera a que se ejecute un cálculo.',
      };
    }
    return this.buildTeacherInsightsDto(raw);
  }

  async recompute(
    user: JwtUser,
    subjectGroupId: number,
  ): Promise<TeacherClusteringRecomputeResponse> {
    const teacherId = this.requireTeacherId(user);
    await this.assertTeacherOwnsSubjectGroup(teacherId, subjectGroupId);

    const { eligible, students } = await this.buildSnapshot(subjectGroupId);
    if (!eligible) {
      return {
        status: 'skipped',
        message:
          'No hay suficientes datos: se requieren al menos 8 estudiantes con al menos 2 prácticas calificadas cada uno.',
      };
    }

    const body: ClusteringRunRequest = { subjectGroupId, students };
    const res = await this.clusteringAi.runClustering(body);
    if (!res) {
      return {
        status: 'skipped',
        message:
          'No se pudo contactar el servicio de clustering. Verifica la configuración del servicio de IA.',
      };
    }
    return { status: 'accepted', runId: res.runId };
  }

  async runForAllEligibleGroups(): Promise<void> {
    const enabled = this.configService.get<boolean>('clustering.enabled');
    if (!enabled) return;

    const raw = await this.testRepo
      .createQueryBuilder('t')
      .select('sg.id', 'id')
      .distinct(true)
      .innerJoin('t.subjectGroup', 'sg')
      .innerJoin('t.attempts', 'a')
      .where('a.gradeStatus = :gs', { gs: PracticeGradeStatus.GRADED })
      .getRawMany();

    const groupIds = raw
      .map((r) => Number(r.id))
      .filter((id) => Number.isFinite(id));

    for (const subjectGroupId of groupIds) {
      try {
        const { eligible, students } = await this.buildSnapshot(
          subjectGroupId,
        );
        if (!eligible) {
          this.logger.log(
            `Skipping subject group ${subjectGroupId}: insufficient graded practice data`,
          );
          continue;
        }
        const body: ClusteringRunRequest = { subjectGroupId, students };
        const res = await this.clusteringAi.runClustering(body);
        if (!res) {
          this.logger.warn(
            `Clustering run returned no response for subject group ${subjectGroupId}`,
          );
        }
      } catch (e) {
        this.logger.warn(
          `Clustering cron failed for subject group ${subjectGroupId}: ${e}`,
        );
      }
    }
  }

  /**
   * Runs snapshot + clustering port for one or more subject groups and writes a JSON report.
   * Intended for `npm run clustering:export` (see clustering-export.ts).
   */
  async exportClusteringReportToFile(options: {
    outputPath: string;
    /** If empty, all subject groups that have at least one graded attempt are considered. */
    subjectGroupIds: number[];
  }): Promise<void> {
    let groupIds = [...new Set(options.subjectGroupIds)].filter((id) =>
      Number.isFinite(id),
    );
    if (groupIds.length === 0) {
      const raw = await this.testRepo
        .createQueryBuilder('t')
        .select('sg.id', 'id')
        .distinct(true)
        .innerJoin('t.subjectGroup', 'sg')
        .innerJoin('t.attempts', 'a')
        .where('a.gradeStatus = :gs', { gs: PracticeGradeStatus.GRADED })
        .getRawMany();
      groupIds = raw
        .map((r) => Number(r.id))
        .filter((id) => Number.isFinite(id));
    }

    type GroupExportRow = {
      subjectGroupId: number;
      eligible: boolean;
      skipReason?: string;
      snapshot?: ClusteringRunRequest;
      runResponse?: ClusteringRunResponse | null;
      clusteringResults?: ClusteringResultsResponse | null;
      teacherInsights?: Exclude<
        TeacherClusteringInsightsResponse,
        { status: 'no_data' }
      > | null;
    };

    const groups: GroupExportRow[] = [];

    for (const subjectGroupId of groupIds) {
      const { eligible, students } = await this.buildSnapshot(subjectGroupId);
      if (!eligible) {
        groups.push({
          subjectGroupId,
          eligible: false,
          skipReason:
            'Fewer than 8 students with at least 2 graded attempts each.',
        });
        continue;
      }

      const body: ClusteringRunRequest = { subjectGroupId, students };
      const runResponse = await this.clusteringAi.runClustering(body);
      const clusteringResults =
        await this.clusteringAi.getClusteringResults(subjectGroupId);

      let teacherInsights: GroupExportRow['teacherInsights'] = null;
      if (clusteringResults) {
        teacherInsights =
          await this.buildTeacherInsightsDto(clusteringResults);
      }

      groups.push({
        subjectGroupId,
        eligible: true,
        snapshot: body,
        runResponse,
        clusteringResults,
        teacherInsights,
      });
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      groups,
    };

    const dir = dirname(options.outputPath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      options.outputPath,
      JSON.stringify(payload, null, 2),
      'utf8',
    );
    this.logger.log(
      `Clustering export written: ${options.outputPath} (${groups.length} subject group(s))`,
    );
  }
}
