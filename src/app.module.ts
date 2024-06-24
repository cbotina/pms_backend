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
import { PeriodTimeSlotsModule } from './period-time-slots/period-time-slots.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TeachersModule } from './teachers/teachers.module';
import { GroupsModule } from './groups/groups.module';
import { PeriodGroupsModule } from './period-groups/period-groups.module';
import { SubjectGroupsModule } from './subject-groups/subject-groups.module';
import { SubjectGroupTimeSlotsModule } from './subject-group-time-slots/subject-group-time-slots.module';
import { StudentsModule } from './students/students.module';
import { GroupStudentsModule } from './group-students/group-students.module';
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
    PeriodTimeSlotsModule,
    SubjectsModule,
    TeachersModule,
    GroupsModule,
    PeriodGroupsModule,
    SubjectGroupsModule,
    SubjectGroupTimeSlotsModule,
    StudentsModule,
    GroupStudentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
