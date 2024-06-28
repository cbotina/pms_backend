import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PermissionRequestDto {
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
  @ValidateNested({ each: true, always: true })
  @Type(() => AbsenceTimeSlot)
  absenceTimeSlots: AbsenceTimeSlot[];
}

export class AbsenceTimeSlot {
  @IsInt()
  @IsNotEmpty()
  subjectGroupTimeSlotId: number;

  @IsDateString()
  @IsNotEmpty()
  absenceDate: Date;
}
