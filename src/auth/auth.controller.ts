import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';

/** Payload attached by JwtStrategy.validate */
type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    return this.authService.login(username, password);
  }

  @Get('firebase-custom-token')
  firebaseCustomToken(@Req() req: Request & { user: JwtUser }) {
    return this.authService.getFirebaseCustomToken(req.user);
  }
}
