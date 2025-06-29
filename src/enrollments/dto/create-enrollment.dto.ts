import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'ID of the subject group to enroll the student in',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  subjectGroupId: number;
}
