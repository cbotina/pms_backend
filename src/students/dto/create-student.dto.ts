import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(20)
  cc: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  lastName: string;

  @IsInt()
  @IsNotEmpty()
  groupId: number;
}
