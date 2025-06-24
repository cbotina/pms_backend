import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMExceptionFilter } from './exception-filter/typeorm-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RolesGuard } from './common/guards/roles.guard';
import helmet from 'helmet';

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

  const config = new DocumentBuilder()
    .setTitle('Sistema Gestor de Permisos')
    .setDescription('Programa de Formación Complementaria')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom tag ordering - Authentication first, then others alphabetically
  const customTagsSorter = (a: any, b: any) => {
    const priorityTags = [
      'Authentication 🔐',
      'Health',
      'Users',
      'Students',
      'Teachers',
      'Groups',
      'Subjects',
      'Periods',
      'Permissions',
      'Absences',
      'Daily Reports',
      'Stats',
    ];

    const aIndex = priorityTags.findIndex((tag) => tag === a);
    const bIndex = priorityTags.findIndex((tag) => tag === b);

    // If both tags are in priority list, sort by priority
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }

    // If only one is in priority list, prioritize it
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;

    // Otherwise, sort alphabetically
    return a.localeCompare(b);
  };

  // Custom Swagger options to control tag ordering
  const options = {
    swaggerOptions: {
      tagsSorter: customTagsSorter,
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'PMS API Documentation',
  };

  SwaggerModule.setup('api', app, document, options);

  await app.listen(port).then(() => {
    console.log(`Server is running on port ${port}!`);
  });
}

bootstrap();
