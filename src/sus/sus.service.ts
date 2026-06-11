import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { SubmitSusDto } from './dto/submit-sus.dto';
import { SusResponse } from './entities/sus-response.entity';

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

export const SUS_QUESTION_COUNT = 10;

/** Standard SUS scoring: odd items (value-1), even items (5-value), sum * 2.5 → 0-100. */
export function computeSusScore(answers: number[]): number {
  let sum = 0;
  for (let i = 0; i < answers.length; i++) {
    sum += i % 2 === 0 ? answers[i] - 1 : 5 - answers[i];
  }
  return Math.round(sum * 2.5 * 100) / 100;
}

@Injectable()
export class SusService {
  constructor(
    @InjectRepository(SusResponse)
    private readonly responseRepo: Repository<SusResponse>,
  ) {}

  private requireStudentId(user: JwtUser): number {
    if (user.entityId == null) {
      throw new BadRequestException('El usuario no tiene perfil de estudiante.');
    }
    return user.entityId;
  }

  async getStatus(user: JwtUser): Promise<{ answered: boolean }> {
    const studentId = this.requireStudentId(user);
    const count = await this.responseRepo.count({
      where: { student: { id: studentId } },
    });
    return { answered: count > 0 };
  }

  async submit(
    user: JwtUser,
    dto: SubmitSusDto,
  ): Promise<{ score: number }> {
    const studentId = this.requireStudentId(user);
    const existing = await this.responseRepo.findOne({
      where: { student: { id: studentId } },
    });
    if (existing) {
      throw new ConflictException('Ya has respondido el formulario. ¡Gracias!');
    }
    const score = computeSusScore(dto.answers);
    const comment = dto.comment?.trim() || null;
    const entity = this.responseRepo.create({
      student: { id: studentId } as Student,
      answersJson: dto.answers,
      score,
      comment,
    });
    await this.responseRepo.save(entity);
    return { score };
  }

  async getResults(): Promise<{
    totalResponses: number;
    averageScore: number | null;
    perQuestion: Array<{
      index: number;
      average: number | null;
      distribution: number[];
    }>;
  }> {
    const rows = await this.responseRepo.find();
    const total = rows.length;

    const perQuestion = Array.from({ length: SUS_QUESTION_COUNT }, (_, i) => {
      const distribution = [0, 0, 0, 0, 0];
      let sum = 0;
      let n = 0;
      for (const r of rows) {
        const v = r.answersJson?.[i];
        if (typeof v === 'number' && v >= 1 && v <= 5) {
          distribution[v - 1]++;
          sum += v;
          n++;
        }
      }
      return {
        index: i,
        average: n > 0 ? Math.round((sum / n) * 100) / 100 : null,
        distribution,
      };
    });

    const averageScore =
      total > 0
        ? Math.round(
            (rows.reduce((acc, r) => acc + (r.score ?? 0), 0) / total) * 100,
          ) / 100
        : null;

    return { totalResponses: total, averageScore, perQuestion };
  }

  async getResponses(): Promise<
    Array<{
      id: number;
      studentName: string;
      answers: number[];
      score: number;
      comment: string | null;
      createdAt: Date;
    }>
  > {
    const rows = await this.responseRepo.find({
      relations: { student: true },
      order: { createdAt: 'DESC' },
    });
    return rows.map((r) => ({
      id: r.id,
      studentName: r.student
        ? `${r.student.firstName} ${r.student.lastName}`.trim()
        : 'Estudiante',
      answers: r.answersJson ?? [],
      score: r.score,
      comment: r.comment,
      createdAt: r.createdAt,
    }));
  }
}
