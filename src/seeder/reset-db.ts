import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const logger = new Logger('ResetDB');
  const configService = app.get(ConfigService);
  const dataSource = app.get(DataSource);

  // Safety check: Only allow reset in staging/development environments
  // This is a DESTRUCTIVE operation - we must be extra careful
  const nodeEnv = configService.get('NODE_ENV');
  const allowedEnvironments = ['development', 'dev', 'staging', 'stage'];
  const isProduction = nodeEnv === 'production' || nodeEnv === 'prod';
  const isAllowed = allowedEnvironments.includes(nodeEnv);

  // Block production explicitly
  if (isProduction) {
    logger.error(
      `❌ CRITICAL: Database reset is BLOCKED in production (NODE_ENV=${nodeEnv}). ` +
      `This is a safety measure to prevent accidental data loss. ` +
      `Allowed environments: ${allowedEnvironments.join(', ')}`
    );
    await app.close();
    process.exit(1);
  }

  // Also check that the environment is explicitly in the allowed list
  if (!isAllowed) {
    logger.error(
      `❌ Database reset is BLOCKED for NODE_ENV=${nodeEnv}. ` +
      `This operation is only allowed in staging/development environments. ` +
      `Allowed environments: ${allowedEnvironments.join(', ')}`
    );
    await app.close();
    process.exit(1);
  }

  try {
    logger.warn('⚠️  WARNING: This will delete ALL tables and data!');
    logger.log(`Environment: ${nodeEnv} (allowed)`);
    logger.log('Dropping all tables...');

    // Drop all tables
    await dataSource.dropDatabase();

    logger.log('✅ Database reset complete. All tables have been dropped.');
    logger.log('💡 Run the seeder to repopulate: npm run seed:prod');
  } catch (error) {
    logger.error('❌ Failed to reset database:', error);
    await app.close();
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('Reset failed:', err);
  process.exit(1);
});
