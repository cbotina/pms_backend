import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const jwt = configService.get('jwt');
  return {
    secret: jwt.secret,
    signOptions: { expiresIn: jwt.accessTokenExpiresIn },
  };
};

export const refreshJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => {
  const jwt = configService.get('jwt');
  return {
    secret: jwt.refreshSecret,
    signOptions: { expiresIn: jwt.refreshTokenExpiresIn },
  };
};
