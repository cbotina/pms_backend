import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({
    description: 'Id of the teacher',
    example: '1234567890',
    maxLength: 15,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  cc: string;

  @ApiProperty({
    description: 'Email address of the teacher',
    example: 'john.doe@school.edu',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'First name of the teacher',
    example: 'John',
    maxLength: 250,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  firstName: string;

  @ApiProperty({
    description: 'Last name of the teacher',
    example: 'Doe',
    maxLength: 250,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  lastName: string;
}
