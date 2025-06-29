import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { WeekDay } from '../entities/subject-group-time-slot.entity';

export class CreateSubjectGroupTimeSlotDto {
  @ApiProperty({
    description: 'ID of the time slot to associate with the subject group',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  timeSlotId: number;

  @ApiProperty({
    description: 'Day of the week for this time slot',
    enum: WeekDay,
    example: 'MON',
  })
  @IsEnum(WeekDay)
  day: WeekDay;
}
