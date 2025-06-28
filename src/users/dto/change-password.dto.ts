import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { passwordOptions } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'User\'s current password for verification',
    example: 'CurrentPass123!',
    maxLength: 30
  })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: 'User\'s new password (must meet security requirements)',
    example: 'NewSecurePass123!',
    maxLength: 30,
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
  })
  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
