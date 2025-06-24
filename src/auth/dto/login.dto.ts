import { IsNotEmpty, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    maxLength: 250
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(250)
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password',
    maxLength: 250,
    minLength: 8
  })
  @IsNotEmpty()
  @MaxLength(250)
  password: string;
}
