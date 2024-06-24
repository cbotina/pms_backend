import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSubjectGroupDto {
  @IsInt()
  @IsNotEmpty()
  teacherId: number;

  @IsInt()
  @IsNotEmpty()
  subjectId: number;

  @IsInt()
  @IsNotEmpty()
  hours: number;
}
