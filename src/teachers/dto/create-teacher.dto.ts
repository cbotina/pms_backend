import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateTeacherDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  cc: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  lastName: string;
}
