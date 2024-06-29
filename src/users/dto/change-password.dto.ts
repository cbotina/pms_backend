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
    description: `User's previous password`,
  })
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    description: `User's new password`,
  })
  @IsStrongPassword(passwordOptions)
  @MaxLength(30)
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
