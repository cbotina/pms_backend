import {
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class GeneratePracticeDto {
  @IsUUID()
  conversationId: string;

  @IsOptional()
  @IsIn([5, 10, 15])
  questionCount?: 5 | 10 | 15;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  topicHints?: string;
}

export class SubmitPracticeDto {
  @IsObject()
  answers: Record<string, unknown>;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationSeconds?: number;
}
