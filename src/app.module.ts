import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { environments } from './config/environments';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/database/database.config';
import { PeriodsModule } from './periods/periods.module';
import { TimeSlotsModule } from './time-slots/time-slots.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TeachersModule } from './teachers/teachers.module';
import { GroupsModule } from './groups/groups.module';
import { SubjectGroupsModule } from './subject-groups/subject-groups.module';
import { SubjectGroupTimeSlotsModule } from './subject-group-time-slots/subject-group-time-slots.module';
import { StudentsModule } from './students/students.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AbsencesModule } from './absences/absences.module';
import { SchdulesModule } from './schedules/schedules.module';
import { DailyReportsModule } from './daily-reports/daily-reports.module';
import { PermissionsModule } from './permissions/permissions.module';
import { StatsModule } from './stats/stats.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import configValidation from './config/validation/config.validation';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV],
      load: [configuration],
      validationSchema: configValidation,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbConfig,
      inject: [ConfigService],
    }),
    PeriodsModule,
    TimeSlotsModule,
    SubjectsModule,
    TeachersModule,
    GroupsModule,
    SubjectGroupsModule,
    SubjectGroupTimeSlotsModule,
    StudentsModule,
    EnrollmentsModule,
    AbsencesModule,
    SchdulesModule,
    DailyReportsModule,
    PermissionsModule,
    StatsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
