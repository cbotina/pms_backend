import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './exception-filter/typeorm-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { SwaggerModule } from '@nestjs/swagger';
import { RolesGuard } from './common/guards/roles.guard';
import helmet from 'helmet';
import {
  createSwaggerConfig,
  createSwaggerOptions,
} from './config/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: process.env.NODE_ENV === 'dev',
  });

  const configService = app.get(ConfigService);
  const port = configService.get('APP_DOCKER_PORT');

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new TypeORMExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.use(helmet());

  // Swagger setup
  const config = createSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  const options = createSwaggerOptions();
  SwaggerModule.setup('api', app, document, options);

  await app.listen(port).then(() => {
    console.log(`Server is running on port ${port}!`);
  });
}

bootstrap();
