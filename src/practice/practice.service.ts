import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Conversation } from 'src/chat/entities/conversation.entity';
import { ChatService } from 'src/chat/chat.service';
import { AiServiceClient } from 'src/ai-service/ai-service.client';
import { DocumentsService } from 'src/documents/documents.service';
import { GeneratePracticeDto, SubmitPracticeDto } from './dto/generate-practice.dto';
import {
  PracticeAttempt,
  PracticeGradeStatus,
} from './entities/practice-attempt.entity';
import {
  PracticeTest,
  PracticeTestStatus,
} from './entities/practice-test.entity';
import { stripAnswerKeys } from './strip-questions';

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

const SYNC_THROTTLE_MS = 5 * 1000;
const STALE_GENERATION_MS = 15 * 60 * 1000;

function startOfUtcDay(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function isFirebaseStorageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === 'firebasestorage.googleapis.com' ||
      u.hostname.endsWith('.firebasestorage.app')
    );
  } catch {
    return false;
  }
}

@Injectable()
export class PracticeService {
  private readonly logger = new Logger(PracticeService.name);

  constructor(
    @InjectRepository(PracticeTest)
    private readonly testRepo: Repository<PracticeTest>,
    @InjectRepository(PracticeAttempt)
    private readonly attemptRepo: Repository<PracticeAttempt>,
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    private readonly aiClient: AiServiceClient,
    private readonly documentsService: DocumentsService,
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  private maxQuestions(): number {
    const v = this.configService.get<number>('practice.maxQuestions');
    if (v != null && Number.isFinite(v)) return v;
    const raw = parseInt(process.env.PRACTICE_MAX_QUESTIONS ?? '15', 10);
    return Number.isFinite(raw) ? raw : 15;
  }

  private generationsPerDay(): number {
    const v = this.configService.get<number>('practice.generationsPerDay');
    if (v != null && Number.isFinite(v)) return v;
    const raw = parseInt(process.env.PRACTICE_GENERATIONS_PER_DAY ?? '10', 10);
    return Number.isFinite(raw) ? raw : 10;
  }

  private requireStudentId(user: JwtUser): number {
    if (user.entityId == null) {
      throw new ForbiddenException('Solo estudiantes pueden usar practicas.');
    }
    return user.entityId;
  }

  private async assertEnrollment(
    studentId: number,
    subjectGroupId: number,
  ): Promise<void> {
    const row = await this.enrollmentRepo.findOne({
      where: {
        student: { id: studentId },
        subjectGroup: { id: subjectGroupId },
      },
    });
    if (!row) {
      throw new ForbiddenException(
        'No estas matriculado en esta asignatura o grupo.',
      );
    }
  }

  private async applyStaleGenerationIfNeeded(test: PracticeTest): Promise<void> {
    if (
      test.status === PracticeTestStatus.GENERATING &&
      test.processingStartedAt &&
      Date.now() - test.processingStartedAt.getTime() > STALE_GENERATION_MS
    ) {
      test.status = PracticeTestStatus.FAILED;
      test.errorMessage =
        'La generacion excedio el tiempo limite. Intenta de nuevo.';
      await this.testRepo.save(test);
    }
  }

  async generate(user: JwtUser, dto: GeneratePracticeDto) {
    const studentId = this.requireStudentId(user);
    const questionCount = dto.questionCount ?? 10;
    if (questionCount > this.maxQuestions()) {
      throw new BadRequestException('Numero de preguntas no permitido.');
    }

    const conv = await this.conversationRepo.findOne({
      where: { id: dto.conversationId, student: { id: studentId } },
      relations: ['subjectGroup'],
    });
    if (!conv) {
      throw new NotFoundException('Conversacion no encontrada.');
    }
    const subjectGroupId = conv.subjectGroup.id;
    await this.assertEnrollment(studentId, subjectGroupId);

    const todayCount = await this.testRepo.count({
      where: {
        student: { id: studentId },
        createdAt: MoreThanOrEqual(startOfUtcDay()),
      },
    });
    if (todayCount >= this.generationsPerDay()) {
      throw new ForbiddenException(
        'Has alcanzado el limite diario de practicas generadas.',
      );
    }

    const existing = await this.testRepo.findOne({
      where: {
        conversation: { id: conv.id },
        status: PracticeTestStatus.GENERATING,
      },
    });
    if (existing) {
      await this.applyStaleGenerationIfNeeded(existing);
      if (existing.status === PracticeTestStatus.GENERATING && existing.aiJobId) {
        return {
          jobId: existing.aiJobId,
          testId: existing.id,
        };
      }
    }

    const testId = randomUUID();
    const jobId = randomUUID();
    const test = this.testRepo.create({
      id: testId,
      conversation: conv,
      student: { id: studentId },
      subjectGroup: { id: subjectGroupId },
      status: PracticeTestStatus.GENERATING,
      aiJobId: jobId,
      questionsJson: null,
      schemaVersion: 1,
      questionCount,
      errorMessage: null,
      processingStartedAt: new Date(),
      lastSyncedAt: null,
    });
    await this.testRepo.save(test);

    const readyDocs = await this.documentsService.countReadyDocuments(
      subjectGroupId,
    );
    const hasDocuments = readyDocs > 0;

    const accepted = await this.aiClient.triggerPracticeGenerate({
      jobId,
      subjectGroupId,
      questionCount,
      topicHints: dto.topicHints,
      hasDocuments,
    });
    if (!accepted) {
      test.status = PracticeTestStatus.FAILED;
      test.errorMessage = 'No se pudo conectar con el servicio de IA.';
      await this.testRepo.save(test);
      throw new ServiceUnavailableException(
        'El servicio de IA no esta disponible. Intenta mas tarde.',
      );
    }

    return { jobId, testId };
  }

  async getGenerationStatus(user: JwtUser, jobId: string) {
    const studentId = this.requireStudentId(user);
    const test = await this.testRepo.findOne({
      where: { aiJobId: jobId, student: { id: studentId } },
      relations: ['conversation'],
    });
    if (!test) {
      throw new NotFoundException('Trabajo de generacion no encontrado.');
    }

    await this.applyStaleGenerationIfNeeded(test);
    if (test.status === PracticeTestStatus.FAILED) {
      return {
        status: 'failed' as const,
        testId: test.id,
        error: test.errorMessage ?? 'Error desconocido',
      };
    }
    if (test.status === PracticeTestStatus.READY) {
      return { status: 'ready' as const, testId: test.id };
    }

    const recentlyChecked =
      test.lastSyncedAt &&
      Date.now() - test.lastSyncedAt.getTime() < SYNC_THROTTLE_MS;
    if (!recentlyChecked) {
      const ai = await this.aiClient.getPracticeGenerationStatus(jobId);
      test.lastSyncedAt = new Date();
      if (ai?.status === 'ready' && ai.questions) {
        test.status = PracticeTestStatus.READY;
        test.questionsJson = ai.questions as Record<string, unknown>;
        test.errorMessage = null;
      } else if (ai?.status === 'failed') {
        test.status = PracticeTestStatus.FAILED;
        test.errorMessage = ai.error ?? 'La generacion fallo.';
      }
      await this.testRepo.save(test);
    }

    if (test.status === PracticeTestStatus.READY) {
      return { status: 'ready' as const, testId: test.id };
    }
    if (test.status === PracticeTestStatus.FAILED) {
      return {
        status: 'failed' as const,
        testId: test.id,
        error: test.errorMessage ?? 'Error',
      };
    }
    return { status: 'generating' as const, testId: test.id };
  }

  async getTest(user: JwtUser, testId: string) {
    const studentId = this.requireStudentId(user);
    const test = await this.testRepo.findOne({
      where: { id: testId, student: { id: studentId } },
      relations: ['conversation', 'subjectGroup', 'subjectGroup.subject'],
    });
    if (!test) {
      throw new NotFoundException('Practica no encontrada.');
    }
    if (test.status !== PracticeTestStatus.READY || !test.questionsJson) {
      throw new BadRequestException('La practica aun no esta lista.');
    }
    return {
      id: test.id,
      conversationId: test.conversation.id,
      schemaVersion: test.schemaVersion,
      questions: stripAnswerKeys(test.questionsJson)?.questions ?? [],
      questionCount: test.questionCount,
      createdAt: test.createdAt.toISOString(),
    };
  }

  async getAttempt(user: JwtUser, testId: string, attemptId: string) {
    const studentId = this.requireStudentId(user);
    const attempt = await this.attemptRepo.findOne({
      where: { id: attemptId, student: { id: studentId } },
      relations: [
        'practiceTest',
        'practiceTest.conversation',
        'practiceTest.subjectGroup',
        'practiceTest.subjectGroup.subject',
      ],
    });
    if (!attempt || attempt.practiceTest.id !== testId) {
      throw new NotFoundException('Intento no encontrado.');
    }
    if (attempt.gradeStatus !== PracticeGradeStatus.GRADED) {
      throw new BadRequestException('Este intento aun no esta calificado.');
    }
    const test = attempt.practiceTest;
    return {
      id: attempt.id,
      practiceTestId: test.id,
      conversationId: test.conversation.id,
      answersJson: attempt.answersJson,
      score: attempt.score,
      maxScore: attempt.maxScore,
      perQuestionJson: attempt.perQuestionJson,
      weakTopicsJson: attempt.weakTopicsJson,
      durationSeconds: attempt.durationSeconds,
      submittedAt: attempt.submittedAt.toISOString(),
      gradedAt: attempt.gradedAt?.toISOString() ?? null,
      questionsJson: test.questionsJson,
    };
  }

  async submit(user: JwtUser, testId: string, dto: SubmitPracticeDto) {
    const studentId = this.requireStudentId(user);
    const test = await this.testRepo.findOne({
      where: { id: testId, student: { id: studentId } },
      relations: ['conversation', 'subjectGroup', 'subjectGroup.subject'],
    });
    if (!test) {
      throw new NotFoundException('Practica no encontrada.');
    }
    if (test.status !== PracticeTestStatus.READY || !test.questionsJson) {
      throw new BadRequestException('La practica no esta lista para enviar.');
    }

    const existingAttempt = await this.attemptRepo.findOne({
      where: { practiceTest: { id: testId }, student: { id: studentId } },
    });
    if (existingAttempt) {
      throw new BadRequestException('Ya enviaste respuestas para esta practica.');
    }

    const qPayload = test.questionsJson as {
      questions?: Array<Record<string, unknown>>;
    };
    const questions = Array.isArray(qPayload.questions) ? qPayload.questions : [];
    this.validateAnswers(questions, dto.answers);

    const { mcqPerQuestion, gradePayload } = this.buildMcqGrading(
      questions,
      dto.answers,
    );

    let aiResult = await this.aiClient.gradePractice(gradePayload);
    if (!aiResult) {
      aiResult = {
        perQuestion: [],
        totalScore: 0,
        maxScore: 0,
      };
    }

    const merged = this.mergePerQuestion(
      questions,
      mcqPerQuestion,
      aiResult.perQuestion as Array<Record<string, unknown>>,
    );
    const totalScore = merged.reduce((s, r) => s + Number(r.score ?? 0), 0);
    const maxScore = merged.reduce((s, r) => s + Number(r.maxScore ?? 0), 0);

    const weakTopics = this.extractWeakTopics(merged, questions);

    const attemptId = randomUUID();
    const attempt = this.attemptRepo.create({
      id: attemptId,
      practiceTest: test,
      student: { id: studentId },
      attemptNumber: 1,
      answersJson: dto.answers,
      score: totalScore,
      maxScore,
      perQuestionJson: merged,
      weakTopicsJson: weakTopics,
      gradeStatus: PracticeGradeStatus.GRADED,
      durationSeconds: dto.durationSeconds ?? null,
      gradedAt: new Date(),
    });
    await this.attemptRepo.save(attempt);

    const subjectName =
      test.subjectGroup?.subject?.name ?? 'Asignatura';

    let feedbackMessageId: string | null = null;
    try {
      const msg = await this.chatService.generatePracticeFeedback(
        test.conversation.id,
        studentId,
        {
          testId: test.id,
          attemptId,
          score: totalScore,
          maxScore,
          perQuestion: merged,
          weakTopics,
          subjectName,
        },
      );
      feedbackMessageId = msg.id;
    } catch (e) {
      this.logger.warn(`Practice feedback LLM failed: ${e}`);
    }

    return {
      attemptId,
      score: totalScore,
      maxScore,
      perQuestion: merged,
      weakTopics,
      feedbackMessageId,
    };
  }

  async history(
    user: JwtUser,
    subjectGroupId: number | undefined,
    page: number,
    limit: number,
  ) {
    const studentId = this.requireStudentId(user);
    const qb = this.attemptRepo
      .createQueryBuilder('a')
      .innerJoinAndSelect('a.practiceTest', 't')
      .leftJoinAndSelect('t.subjectGroup', 'sg')
      .where('a.studentId = :sid', { sid: studentId })
      .andWhere('a.gradeStatus = :gs', { gs: PracticeGradeStatus.GRADED })
      .orderBy('a.gradedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    if (subjectGroupId != null) {
      qb.andWhere('t.subjectGroupId = :sg', { sg: subjectGroupId });
    }
    const [rows, total] = await qb.getManyAndCount();
    const items = rows.map((a) => ({
      testId: a.practiceTest.id,
      attemptId: a.id,
      score: a.score,
      maxScore: a.maxScore,
      questionCount: a.practiceTest.questionCount,
      createdAt: a.gradedAt?.toISOString() ?? a.submittedAt.toISOString(),
      subjectGroupId: a.practiceTest.subjectGroup?.id ?? 0,
    }));
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  private extractWeakTopics(
    merged: Array<Record<string, unknown>>,
    questions: Array<Record<string, unknown>>,
  ): string[] {
    const topicById = new Map<string, string>();
    for (const q of questions) {
      const id = String(q.id);
      const topic = typeof q.topic === 'string' ? q.topic : '';
      topicById.set(id, topic);
    }
    const weak = new Set<string>();
    for (const row of merged) {
      const id = String(row.id);
      const score = Number(row.score ?? 0);
      const max = Number(row.maxScore ?? 1);
      const correct = row.correct === true;
      if (!correct || score < max * 0.6) {
        const t = topicById.get(id);
        if (t) weak.add(t);
      }
    }
    return [...weak];
  }

  private mergePerQuestion(
    questions: Array<Record<string, unknown>>,
    mcq: Array<Record<string, unknown>>,
    aiRows: Array<Record<string, unknown>>,
  ): Array<Record<string, unknown>> {
    const byId = new Map<string, Record<string, unknown>>();
    for (const r of mcq) byId.set(String(r.id), r);
    for (const r of aiRows) byId.set(String(r.id), r);
    const ordered: Array<Record<string, unknown>> = [];
    for (const q of questions) {
      const id = String(q.id);
      const row = byId.get(id);
      if (row) {
        ordered.push(row);
        continue;
      }
      const type = q.type;
      if (type === 'open') {
        const mx = Number(q.maxPoints ?? 5);
        ordered.push({
          id,
          type: 'open',
          score: 0,
          maxScore: mx,
          correct: false,
          feedback: 'No se pudo obtener calificación automática.',
        });
      } else if (type === 'photo_solution') {
        const mx = Number(q.maxPoints ?? 6);
        ordered.push({
          id,
          type: 'photo_solution',
          score: 0,
          maxScore: mx,
          correct: false,
          feedback: 'No se pudo obtener calificación automática.',
          legible: true,
        });
      }
    }
    return ordered;
  }

  private buildMcqGrading(
    questions: Array<Record<string, unknown>>,
    answers: Record<string, unknown>,
  ): {
    mcqPerQuestion: Array<Record<string, unknown>>;
    gradePayload: { questions: unknown[]; answers: Record<string, unknown> };
  } {
    const mcqPerQuestion: Array<Record<string, unknown>> = [];
    const openPhotoQuestions: Record<string, Record<string, unknown>> = {};
    const openPhotoAnswers: Record<string, unknown> = {};

    for (const q of questions) {
      const id = String(q.id);
      const type = q.type;
      if (type === 'mcq') {
        const points = Number(q.points ?? 0);
        const correctIndex = Number(q.correctIndex);
        const ans = answers[id] as { selectedIndex?: number };
        const ok = ans.selectedIndex === correctIndex;
        mcqPerQuestion.push({
          id,
          type: 'mcq',
          score: ok ? points : 0,
          maxScore: points,
          correct: ok,
        });
      } else if (type === 'open' || type === 'photo_solution') {
        openPhotoQuestions[id] = q as Record<string, unknown>;
        openPhotoAnswers[id] = answers[id];
      }
    }

    const questionsList = Object.values(openPhotoQuestions);
    const answersSubset: Record<string, unknown> = {};
    for (const q of questionsList) {
      answersSubset[String(q.id)] = openPhotoAnswers[String(q.id)];
    }

    return {
      mcqPerQuestion,
      gradePayload: { questions: questionsList, answers: answersSubset },
    };
  }

  private validateAnswers(
    questions: Array<Record<string, unknown>>,
    answers: Record<string, unknown>,
  ): void {
    for (const q of questions) {
      const id = String(q.id);
      const type = q.type;
      const a = answers[id];
      if (a == null || typeof a !== 'object') {
        throw new BadRequestException(`Falta respuesta para la pregunta ${id}.`);
      }
      if (type === 'mcq') {
        const sel = (a as { selectedIndex?: unknown }).selectedIndex;
        if (typeof sel !== 'number' || !Number.isInteger(sel)) {
          throw new BadRequestException(`Respuesta invalida (MCQ) para ${id}.`);
        }
        const choices = q.choices as unknown[] | undefined;
        if (!Array.isArray(choices) || sel < 0 || sel >= choices.length) {
          throw new BadRequestException(`Indice de opcion invalido para ${id}.`);
        }
      } else if (type === 'open') {
        const text = (a as { text?: unknown }).text;
        if (typeof text !== 'string' || !text.trim()) {
          throw new BadRequestException(`Respuesta de texto requerida para ${id}.`);
        }
      } else if (type === 'photo_solution') {
        const urls = (a as { imageUrls?: unknown }).imageUrls;
        if (!Array.isArray(urls) || urls.length === 0) {
          throw new BadRequestException(`Se requiere al menos una imagen para ${id}.`);
        }
        const maxImg = Number(q.maxImages ?? 3);
        if (urls.length > maxImg) {
          throw new BadRequestException(`Demasiadas imagenes para ${id}.`);
        }
        for (const u of urls) {
          if (typeof u !== 'string' || !isFirebaseStorageUrl(u)) {
            throw new BadRequestException(
              `Solo se permiten URLs de Firebase Storage para ${id}.`,
            );
          }
        }
      }
    }
  }
}
