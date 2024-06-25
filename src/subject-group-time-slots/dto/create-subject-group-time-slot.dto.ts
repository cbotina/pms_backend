import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { WeekDay } from '../entities/subject-group-time-slot.entity';

export class CreateSubjectGroupTimeSlotDto {
  @IsInt()
  @IsNotEmpty()
  timeSlotId: number;

  @IsEnum(WeekDay)
  day: WeekDay;
}
