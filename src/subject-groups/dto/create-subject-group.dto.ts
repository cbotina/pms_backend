import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectGroupDto {
  @ApiProperty({
    description: 'ID of the teacher assigned to this subject group',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  teacherId: number;

  @ApiProperty({
    description: 'ID of the subject for this group',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  subjectId: number;

  @ApiProperty({
    description: 'Number of hours allocated for this subject group',
    example: 4,
  })
  @IsInt()
  @IsNotEmpty()
  hours: number;
}
