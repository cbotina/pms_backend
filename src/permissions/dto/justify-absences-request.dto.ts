import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class JustifyAbsencesRequestDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  evidenceUrl: string;

  @IsString()
  @IsNotEmpty()
  studentNote: string;

  @IsArray()
  unjustifiedAbsencesIds: number[];
}
