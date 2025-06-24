import { Body, Controller, HttpCode, Post, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService, TokenResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Authentication 🔐')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password to receive JWT tokens',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Wrong Password' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  login(@Body() loginDto: LoginDto): Promise<TokenResponse> {
    const { username, password } = loginDto;
    return this.authService.login(username, password);
  }

  @HttpCode(200)
  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Get new access and refresh tokens using a valid refresh token.',
  })
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenResponse> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @HttpCode(200)
  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Invalidate the current refresh token.',
  })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
