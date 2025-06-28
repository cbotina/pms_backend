import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Modality } from '../entities/group.entity';

export class CreateGroupDto {
  @ApiProperty({
    description: 'Name of the group',
    example: 'Grade 10A',
    maxLength: 25,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  name: string;

  @ApiProperty({
    description: 'Semester of the group',
    example: '2024-1',
    maxLength: 25,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  semester: string;

  @ApiProperty({
    description: 'Modality of the group',
    enum: Modality,
    example: Modality.ACADEMIC,
    enumName: 'Modality',
  })
  @IsEnum(Modality)
  modality: Modality;

  @ApiProperty({
    description: 'ID of the teacher assigned as tutor (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  teacherId?: number;
}
