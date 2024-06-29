import { IsEnum, IsNumberString, MaxLength } from 'class-validator';
import { Roles } from '../entities/user.entity';

export class CreateUserDto {
  @IsNumberString()
  @MaxLength(150)
  username: string;

  @IsEnum(Roles)
  role: Roles;
}
