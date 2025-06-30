import { Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService, TokenResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  LoginDocs,
  RefreshTokenDocs,
  LogoutDocs,
} from './auth.controller.docs';
import { Tags } from '../config/swagger/swagger.config';

@ApiTags(Tags.AUTHENTICATION)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Public()
  @Post('login')
  @LoginDocs()
  login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
    const { username, password } = loginDto;
    return this.authService.login(username, password);
  }

  @HttpCode(200)
  @Public()
  @Post('refresh')
  @RefreshTokenDocs()
  refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    return this.authService.refreshToken(refreshTokenDto.refresh);
  }

  @HttpCode(200)
  @Post('logout')
  @LogoutDocs()
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
