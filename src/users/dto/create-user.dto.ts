import { IsEnum, IsNumberString, MaxLength } from 'class-validator';
import { Role } from '../entities/user.entity';

export class CreateUserDto {
  @IsNumberString()
  @MaxLength(150)
  username: string;

  @IsEnum(Role)
  role: Role;
}
