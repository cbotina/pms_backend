import { IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(250)
  username: string;

  @IsNotEmpty()
  @MaxLength(250)
  password: string;
}
