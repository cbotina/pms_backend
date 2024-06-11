import { IsNotEmpty, IsNumber } from 'class-validator';

export class CopyTimeSlotsDto {
  @IsNotEmpty()
  @IsNumber()
  sourcePeriodId: number;
}
