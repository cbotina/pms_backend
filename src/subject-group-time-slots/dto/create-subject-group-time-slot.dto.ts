import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { Day } from '../entities/subject-group-time-slot.entity';

export class CreateSubjectGroupTimeSlotDto {
  @IsInt()
  @IsNotEmpty()
  timeSlotId: number;

  @IsEnum(Day)
  day: Day;
}
