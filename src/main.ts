import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './exception-filter/typeorm-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesGuard } from './common/guards/roles.guard';
import helmet from 'helmet';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const nodeEnv = process.env.NODE_ENV;
  const isDev = nodeEnv === 'dev' || nodeEnv === 'development';
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : [];

  const app = await NestFactory.create(AppModule, {
    cors: isDev || allowedOrigins.length === 0
      ? true
      : { origin: allowedOrigins, credentials: true },
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || process.env.PORT || 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Sistema Gestor de Permisos')
    .setDescription('Programa de Formación Complementaria')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, '0.0.0.0');
  console.log(`Application running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
