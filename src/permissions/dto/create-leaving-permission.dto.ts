import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AbsenceTimeSlot } from './permission-request.dto';

export class CreateLeavingPermissionDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsDateString()
  @IsNotEmpty()
  justificationDeadline: Date;

  @IsArray()
  @ValidateNested({ each: true, always: true })
  @Type(() => AbsenceTimeSlot)
  absenceTimeSlots: AbsenceTimeSlot[];
}
