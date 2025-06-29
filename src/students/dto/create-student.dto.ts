import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../entities/student.entity';

export class CreateStudentDto {
  @ApiProperty({
    description: 'Student identification number (must be unique)',
    example: '1234567890',
    maxLength: 20,
  })
  @IsNumberString()
  @IsNotEmpty()
  @MaxLength(20)
  cc: string;

  @ApiProperty({
    description: 'Student first name',
    example: 'John',
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  firstName: string;

  @ApiProperty({
    description: 'Student last name',
    example: 'Doe',
    maxLength: 250,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  lastName: string;

  @ApiProperty({
    description: 'ID of the group the student belongs to',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  groupId: number;

  @ApiProperty({
    description: 'Student gender',
    enum: Gender,
    example: Gender.MALE,
    enumName: 'Gender',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Student email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;
}
