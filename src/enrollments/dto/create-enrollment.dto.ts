import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateEnrollmentDto {
  @IsInt()
  @IsNotEmpty()
  subjectGroupId: number;
}
