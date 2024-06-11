import {
  IsBoolean,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTimeSlotDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  label: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  startTime: string;

  @IsNotEmpty()
  @IsMilitaryTime()
  endTime: string;

  @IsNotEmpty()
  @IsBoolean()
  isAcademic: boolean;
}
