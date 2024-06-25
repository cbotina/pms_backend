import { IsDateString, IsNotEmpty } from 'class-validator';

export class ScheduleRangeDatesDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;
}
