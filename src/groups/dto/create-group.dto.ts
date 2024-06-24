import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Modality } from '../entities/group.entity';

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  semester: string;

  @IsEnum(Modality)
  modality: Modality;
}
