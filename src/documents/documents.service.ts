import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { AiServiceClient } from 'src/ai-service/ai-service.client';
import { FirebaseAdminService } from 'src/firebase/firebase-admin.service';
import { Document, DocumentStatus } from './entities/document.entity';
import { ConfirmDocumentDto } from './dto/confirm-document.dto';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const STALE_TIMEOUT_MS = 15 * 60 * 1000;
const SYNC_THROTTLE_MS = 5 * 1000;

type TeacherUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepo: Repository<Document>,
    @InjectRepository(SubjectGroup)
    private readonly subjectGroupRepo: Repository<SubjectGroup>,
    private readonly aiClient: AiServiceClient,
    private readonly firebase: FirebaseAdminService,
  ) {}

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
        'No tienes permiso para gestionar documentos de este grupo.',
      );
    }
    return sg;
  }

  private requireTeacherId(user: TeacherUser): number {
    if (user.entityId == null) {
      throw new ForbiddenException('Solo docentes pueden gestionar documentos.');
    }
    return user.entityId;
  }

  async prepare(user: TeacherUser, subjectGroupId: number) {
    const teacherId = this.requireTeacherId(user);
    await this.assertTeacherOwnsSubjectGroup(teacherId, subjectGroupId);

    const documentId = randomUUID();
    const uploadPath = `subject-materials/${subjectGroupId}/${documentId}`;

    const doc = this.documentRepo.create({
      id: documentId,
      subjectGroup: { id: subjectGroupId },
      uploadedBy: { id: teacherId },
      status: DocumentStatus.PENDING,
      mimeType: 'application/pdf',
    });
    await this.documentRepo.save(doc);

    return { documentId, uploadPath };
  }

  async confirm(
    user: TeacherUser,
    subjectGroupId: number,
    documentId: string,
    dto: ConfirmDocumentDto,
  ) {
    const teacherId = this.requireTeacherId(user);
    await this.assertTeacherOwnsSubjectGroup(teacherId, subjectGroupId);

    if (!ALLOWED_MIME_TYPES.includes(dto.mimeType)) {
      throw new BadRequestException(
        `Tipo de archivo no permitido. Solo se aceptan: PDF, DOCX.`,
      );
    }

    const doc = await this.documentRepo.findOne({
      where: { id: documentId, subjectGroup: { id: subjectGroupId } },
    });
    if (!doc) {
      throw new NotFoundException('Documento no encontrado.');
    }
    if (doc.status !== DocumentStatus.PENDING) {
      throw new BadRequestException(
        'Este documento ya fue confirmado o está siendo procesado.',
      );
    }

    doc.filename = dto.filename;
    doc.mimeType = dto.mimeType;
    doc.sizeBytes = dto.sizeBytes ?? null;
    doc.storagePath = `subject-materials/${subjectGroupId}/${documentId}/${dto.filename}`;
    doc.status = DocumentStatus.PROCESSING;
    doc.processingStartedAt = new Date();
    await this.documentRepo.save(doc);

    const signedReadUrl = await this.firebase.getSignedReadUrl(doc.storagePath, 30);
    if (!signedReadUrl) {
      this.logger.warn(`Could not generate signed URL for ${doc.storagePath} — using storage path as fallback`);
    }

    const accepted = await this.aiClient.triggerIngest({
      documentId,
      subjectGroupId,
      signedReadUrl: signedReadUrl ?? doc.storagePath,
    });
    if (!accepted) {
      doc.status = DocumentStatus.FAILED;
      doc.errorMessage = 'No se pudo conectar con el servicio de IA.';
      await this.documentRepo.save(doc);
    }

    return this.serialize(doc, subjectGroupId);
  }

  async findAll(user: TeacherUser, subjectGroupId: number) {
    const teacherId = this.requireTeacherId(user);
    await this.assertTeacherOwnsSubjectGroup(teacherId, subjectGroupId);

    const docs = await this.documentRepo.find({
      where: { subjectGroup: { id: subjectGroupId } },
      order: { createdAt: 'DESC' },
    });

    for (const doc of docs) {
      if (doc.status === DocumentStatus.PROCESSING) {
        this.checkStaleJob(doc);
        await this.lazySyncFromAi(doc);
      }
    }

    return docs.map((d) => this.serialize(d, subjectGroupId));
  }

  async findOne(user: TeacherUser, subjectGroupId: number, documentId: string) {
    const teacherId = this.requireTeacherId(user);
    await this.assertTeacherOwnsSubjectGroup(teacherId, subjectGroupId);

    const doc = await this.documentRepo.findOne({
      where: { id: documentId, subjectGroup: { id: subjectGroupId } },
    });
    if (!doc) {
      throw new NotFoundException('Documento no encontrado.');
    }

    this.checkStaleJob(doc);
    await this.lazySyncFromAi(doc);

    return this.serialize(doc, subjectGroupId);
  }

  async remove(user: TeacherUser, subjectGroupId: number, documentId: string) {
    const teacherId = this.requireTeacherId(user);
    await this.assertTeacherOwnsSubjectGroup(teacherId, subjectGroupId);

    const result = await this.documentRepo.delete({
      id: documentId,
      subjectGroup: { id: subjectGroupId },
    });
    if (!result.affected) {
      throw new NotFoundException('Documento no encontrado.');
    }

    this.aiClient.deleteDocument(documentId).catch((e) =>
      this.logger.error(`Failed to delete vectors for ${documentId}`, e),
    );

    return { ok: true };
  }

  async countReadyDocuments(subjectGroupId: number): Promise<number> {
    return this.documentRepo.count({
      where: {
        subjectGroup: { id: subjectGroupId },
        status: DocumentStatus.READY,
      },
    });
  }

  /**
   * Filename + storage path for chat citations, scoped to a subject group (RAG chunks).
   */
  async getCitationMetadataBySubjectGroup(
    subjectGroupId: number,
    documentIds: string[],
  ): Promise<Map<string, { filename: string | null; storagePath: string | null }>> {
    const unique = [...new Set(documentIds)].filter(Boolean);
    if (unique.length === 0) {
      return new Map();
    }

    const rows = await this.documentRepo.find({
      where: {
        id: In(unique),
        subjectGroup: { id: subjectGroupId },
      },
      select: ['id', 'filename', 'storagePath'],
    });

    const map = new Map<
      string,
      { filename: string | null; storagePath: string | null }
    >();
    for (const row of rows) {
      map.set(row.id, {
        filename: row.filename ?? null,
        storagePath: row.storagePath ?? null,
      });
    }
    return map;
  }

  private async lazySyncFromAi(doc: Document): Promise<void> {
    if (doc.status !== DocumentStatus.PROCESSING) return;

    const recentlyChecked =
      doc.lastSyncedAt &&
      Date.now() - doc.lastSyncedAt.getTime() < SYNC_THROTTLE_MS;
    if (recentlyChecked) return;

    const aiStatus = await this.aiClient.getDocumentStatus(doc.id);
    if (!aiStatus) return;

    doc.lastSyncedAt = new Date();

    if (aiStatus.status === 'ready' || aiStatus.status === 'failed') {
      doc.status =
        aiStatus.status === 'ready'
          ? DocumentStatus.READY
          : DocumentStatus.FAILED;
      doc.summary = aiStatus.summary ?? null;
      doc.chunkCount = aiStatus.chunkCount ?? null;
      doc.errorMessage = aiStatus.error ?? null;
    }

    await this.documentRepo.save(doc);
  }

  private checkStaleJob(doc: Document): void {
    if (
      doc.status === DocumentStatus.PROCESSING &&
      doc.processingStartedAt &&
      Date.now() - doc.processingStartedAt.getTime() > STALE_TIMEOUT_MS
    ) {
      doc.status = DocumentStatus.FAILED;
      doc.errorMessage = 'El procesamiento excedió el tiempo límite. Por favor, suba el documento nuevamente.';
      this.documentRepo.save(doc).catch((e) =>
        this.logger.error(`Failed to mark stale document ${doc.id}`, e),
      );
    }
  }

  private serialize(doc: Document, subjectGroupId: number) {
    return {
      id: doc.id,
      subjectGroupId,
      filename: doc.filename,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
      status: doc.status,
      errorMessage: doc.errorMessage,
      summary: doc.summary,
      chunkCount: doc.chunkCount,
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    };
  }
}
