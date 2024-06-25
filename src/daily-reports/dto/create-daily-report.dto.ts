import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateDailyReportDto {
  @IsNotEmpty()
  @IsDateString()
  reportDate: string;

  @IsBoolean()
  @IsNotEmpty()
  isSubmitted: boolean;

  @IsInt()
  @IsNotEmpty()
  subjectGroupTimeSlotId: number;

  @IsArray()
  @ValidateNested({ each: true, always: true })
  @Type(() => StudentAbsence)
  studentsAbsences: StudentAbsence[];
}

export class StudentAbsence {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsString()
  @IsNotEmpty()
  teacherComment: string;
}
