import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Response } from 'express';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Repository } from 'typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatMode, Conversation } from './entities/conversation.entity';
import { ChatMessageRole, Message } from './entities/message.entity';
import { OpenaiService } from './openai.service';

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(SubjectGroup)
    private readonly subjectGroupRepo: Repository<SubjectGroup>,
    private readonly openaiService: OpenaiService,
  ) {}

  private requireStudentId(user: JwtUser): number {
    if (user.entityId == null) {
      throw new ForbiddenException('Solo estudiantes pueden usar el chat.');
    }
    return user.entityId;
  }

  async assertEnrollment(studentId: number, subjectGroupId: number) {
    const row = await this.enrollmentRepo.findOne({
      where: {
        student: { id: studentId },
        subjectGroup: { id: subjectGroupId },
      },
    });
    if (!row) {
      throw new ForbiddenException(
        'No estás matriculado en esta asignatura o grupo.',
      );
    }
  }

  async getSubjectGroupContext(subjectGroupId: number) {
    const sg = await this.subjectGroupRepo.findOne({
      where: { id: subjectGroupId },
      relations: ['subject', 'group', 'teacher'],
    });
    if (!sg) {
      throw new NotFoundException('Grupo de asignatura no encontrado.');
    }
    const teacherName = sg.teacher
      ? `${sg.teacher.firstName} ${sg.teacher.lastName}`
      : 'Sin docente asignado';
    return {
      subjectName: sg.subject.name,
      groupName: sg.group.name,
      teacherName,
      hours: sg.hours,
    };
  }

  buildSystemPrompt(
    ctx: Awaited<ReturnType<ChatService['getSubjectGroupContext']>>,
    mode: ChatMode,
  ): string {
    const modeLine =
      mode === ChatMode.PRACTICE
        ? 'Modo práctica (aún en construcción): orienta al estudiante hacia ejercicios y autoevaluación cuando sea posible.'
        : 'Modo consulta: responde dudas del curso con claridad y pasos cuando aplique.';
    return [
      `Eres un asistente académico para la asignatura "${ctx.subjectName}" del grupo "${ctx.groupName}".`,
      `Docente: ${ctx.teacherName}. Carga lectiva: ${ctx.hours} horas.`,
      modeLine,
      'Aún no hay material oficial indexado en el sistema (RAG); si no estás seguro, dilo y ofrece orientación general sin inventar contenidos del programa.',
      'Responde en español salvo que el estudiante pida otro idioma.',
    ].join('\n');
  }

  messageToOpenAI(m: Message): ChatCompletionMessageParam {
    if (m.role === ChatMessageRole.USER && m.imageUrl) {
      const text = m.content?.trim() || 'Describe esta imagen en el contexto del curso.';
      return {
        role: 'user',
        content: [
          { type: 'text', text },
          { type: 'image_url', image_url: { url: m.imageUrl } },
        ],
      };
    }
    if (m.role === ChatMessageRole.USER) {
      return { role: 'user', content: m.content };
    }
    if (m.role === ChatMessageRole.ASSISTANT) {
      return { role: 'assistant', content: m.content };
    }
    return { role: 'system', content: m.content };
  }

  async createConversation(user: JwtUser, dto: CreateConversationDto) {
    const studentId = this.requireStudentId(user);
    await this.assertEnrollment(studentId, dto.subjectGroupId);
    const mode = dto.mode ?? ChatMode.ASK;
    const conv = this.conversationRepo.create({
      student: { id: studentId },
      subjectGroup: { id: dto.subjectGroupId },
      mode,
      title: null,
    });
    const saved = await this.conversationRepo.save(conv);
    return {
      id: saved.id,
      mode: saved.mode,
      title: saved.title,
      subjectGroupId: dto.subjectGroupId,
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString(),
    };
  }

  async getConversation(user: JwtUser, id: string) {
    const studentId = this.requireStudentId(user);
    const conv = await this.conversationRepo.findOne({
      where: { id, student: { id: studentId } },
      relations: ['subjectGroup'],
    });
    if (!conv) {
      throw new NotFoundException('Conversación no encontrada.');
    }
    return this.serializeConversation(conv);
  }

  async getConversations(
    user: JwtUser,
    page: number,
    limit: number,
    subjectGroupId?: number,
  ) {
    const studentId = this.requireStudentId(user);
    const qb = this.conversationRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.subjectGroup', 'sg')
      .where('c.studentId = :studentId', { studentId })
      .orderBy('c.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);
    if (subjectGroupId != null) {
      qb.andWhere('c.subjectGroupId = :subjectGroupId', { subjectGroupId });
    }
    const [items, totalItems] = await qb.getManyAndCount();
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    return {
      items: items.map((c) => this.serializeConversation(c)),
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async getMessages(user: JwtUser, conversationId: string) {
    const studentId = this.requireStudentId(user);
    const conv = await this.conversationRepo.findOne({
      where: { id: conversationId, student: { id: studentId } },
    });
    if (!conv) {
      throw new NotFoundException('Conversación no encontrada.');
    }
    const messages = await this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      relations: ['conversation'],
      order: { createdAt: 'ASC' },
    });
    return messages.map((m) => this.serializeMessage(m));
  }

  async deleteConversation(user: JwtUser, id: string) {
    const studentId = this.requireStudentId(user);
    const res = await this.conversationRepo.delete({
      id,
      student: { id: studentId },
    });
    if (!res.affected) {
      throw new NotFoundException('Conversación no encontrada.');
    }
    return { ok: true };
  }

  private serializeConversation(c: Conversation) {
    const subjectGroupId =
      c.subjectGroup?.id ??
      (c as Conversation & { subjectGroupId?: number }).subjectGroupId;
    if (!subjectGroupId) {
      throw new NotFoundException('Datos de conversación incompletos.');
    }
    return {
      id: c.id,
      mode: c.mode,
      title: c.title,
      subjectGroupId,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }

  private serializeMessage(m: Message) {
    const convId = m.conversation?.id ?? "";
    return {
      id: m.id,
      conversationId: convId,
      role: m.role,
      content: m.content,
      imageUrl: m.imageUrl,
      metadata: m.metadata,
      createdAt: m.createdAt.toISOString(),
    };
  }

  async streamMessage(
    user: JwtUser,
    conversationId: string,
    dto: SendMessageDto,
    res: Response,
  ): Promise<void> {
    const studentId = this.requireStudentId(user);
    this.openaiService.assertConfigured();

    const conv = await this.conversationRepo.findOne({
      where: { id: conversationId, student: { id: studentId } },
      relations: ['subjectGroup', 'subjectGroup.subject', 'subjectGroup.group', 'subjectGroup.teacher'],
    });
    if (!conv) {
      throw new NotFoundException('Conversación no encontrada.');
    }

    await this.assertEnrollment(studentId, conv.subjectGroup.id);

    const textContent = (dto.content ?? '').trim();
    const imageUrl = dto.imageUrl?.trim() || undefined;
    if (!textContent && !imageUrl) {
      res.status(400).json({ message: 'Se requiere texto o imagen.' });
      return;
    }

    const userMessage = this.messageRepo.create({
      conversation: conv,
      role: ChatMessageRole.USER,
      content: textContent || '(imagen)',
      imageUrl: imageUrl ?? null,
      metadata: null,
    });
    await this.messageRepo.save(userMessage);

    const historyBatch = await this.messageRepo.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
      take: 50,
    });
    const history = historyBatch.reverse();

    const ctx = await this.getSubjectGroupContext(conv.subjectGroup.id);
    const system: ChatCompletionMessageParam = {
      role: 'system',
      content: this.buildSystemPrompt(ctx, conv.mode),
    };
    const openaiMessages: ChatCompletionMessageParam[] = [
      system,
      ...history.map((m) => this.messageToOpenAI(m)),
    ];

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const writeSse = (obj: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(obj)}\n\n`);
    };

    let assistantText = '';
    try {
      for await (const delta of this.openaiService.streamChatCompletion(
        openaiMessages,
      )) {
        assistantText += delta;
        writeSse({ type: 'delta', data: { content: delta } });
      }
    } catch (e) {
      writeSse({
        type: 'error',
        data: { message: e instanceof Error ? e.message : 'Error del modelo' },
      });
      res.end();
      return;
    }

    const assistantMessage = this.messageRepo.create({
      conversation: conv,
      role: ChatMessageRole.ASSISTANT,
      content: assistantText,
      imageUrl: null,
      metadata: null,
    });
    await this.messageRepo.save(assistantMessage);

    await this.conversationRepo.update(
      { id: conv.id },
      { updatedAt: new Date() },
    );

    if (!conv.title && textContent) {
      const assistantCount = await this.messageRepo.count({
        where: {
          conversation: { id: conv.id },
          role: ChatMessageRole.ASSISTANT,
        },
      });
      if (assistantCount === 1) {
        const title = await this.openaiService.generateConversationTitle(
          textContent,
          assistantText,
        );
        await this.conversationRepo.update(
          { id: conv.id },
          { title: title.slice(0, 120) },
        );
      }
    }

    writeSse({
      type: 'done',
      data: {
        messageId: assistantMessage.id,
        userMessageId: userMessage.id,
      },
    });
    res.end();
  }
}
