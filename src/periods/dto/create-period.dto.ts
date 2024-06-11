import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePeriodDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  name: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}
