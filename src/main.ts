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
  // Configure CORS based on environment
  const nodeEnv = process.env.NODE_ENV;
  const isDev = nodeEnv === 'dev' || nodeEnv === 'development';
  const isStaging = nodeEnv === 'staging' || nodeEnv === 'stage';
  
  let corsOptions: boolean | { origin: string | string[] | boolean; credentials: boolean } = false;
  
  if (isDev) {
    // Development: allow all origins
    corsOptions = true;
  } else if (isStaging) {
    // Staging: use allowed origins from environment, or allow all if not set
    const allowedOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : [];
    
    if (allowedOrigins.length > 0) {
      corsOptions = {
        origin: allowedOrigins,
        credentials: true,
      };
    } else {
      // Allow all origins if CORS_ORIGINS not set
      corsOptions = true;
    }
  } else {
    // Production: use allowed origins from environment (required)
    const allowedOrigins = process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
      : [];
    
    if (allowedOrigins.length > 0) {
      corsOptions = {
        origin: allowedOrigins,
        credentials: true,
      };
    }
    // If CORS_ORIGINS not set in production, CORS will be disabled (more secure)
  }
  
  const app = await NestFactory.create(AppModule, {
    cors: corsOptions,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

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

  await app.listen(port);
}

bootstrap();
