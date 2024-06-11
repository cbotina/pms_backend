import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environments } from './config/environments';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/database/database.config';
import { PeriodsModule } from './periods/periods.module';
import { TimeSlotsModule } from './time-slots/time-slots.module';
import configValidation from './config/validation/config.validation';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV],
      load: [configuration],
      validationSchema: configValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConfig,
      inject: [ConfigService],
    }),
    PeriodsModule,
    TimeSlotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
