import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  IsStrongPasswordOptions,
  MaxLength,
} from 'class-validator';
import { Roles } from '../entities/user.entity';

export const passwordOptions: IsStrongPasswordOptions = {
  minLength: 8,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export class CreateUserDto {
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  password?: string;

  @IsEnum(Roles)
  role: Roles;
}
