import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ChatMode } from '../entities/conversation.entity';

export class CreateConversationDto {
  @IsInt()
  @IsNotEmpty()
  subjectGroupId: number;

  @IsEnum(ChatMode)
  @IsOptional()
  mode?: ChatMode;
}
