import { IsInt, IsNotEmpty } from 'class-validator';

export class SetActivePeriodDto {
  @IsInt()
  @IsNotEmpty()
  periodId: number;
}
