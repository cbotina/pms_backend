import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsStrongPassword,
  IsStrongPasswordOptions,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '../entities/user.entity';

export const passwordOptions: IsStrongPasswordOptions = {
  minLength: 8,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address (must be unique)',
    example: 'user@example.com',
    maxLength: 150,
  })
  @MaxLength(150)
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (required for ADMIN and SECRETARY roles)',
    example: 'SecurePass123!',
    maxLength: 30,
    minLength: 8,
    required: false,
    pattern:
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
  })
  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: Roles,
    example: Roles.STUDENT,
    enumName: 'Roles',
  })
  @IsEnum(Roles)
  role: Roles;
}
