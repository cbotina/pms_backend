import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Name of the subject',
    example: 'Mathematics',
    maxLength: 250,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  name: string;
}
