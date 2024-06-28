import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => {
  return {
    secret: configService.get('jwtSecret'),
    signOptions: { expiresIn: '2h' },
  };
};
