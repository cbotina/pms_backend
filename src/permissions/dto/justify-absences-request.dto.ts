import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JustifyAbsencesRequestDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  evidenceUrl: string;

  @IsString()
  @IsOptional()
  studentNote: string;

  @IsArray()
  unjustifiedAbsencesIds: number[];
}
