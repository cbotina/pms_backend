import { Module } from '@nestjs/common';
import { PermissionRequestsService } from './permission-requests.service';
import { PermissionRequestsController } from './permission-requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Student } from 'src/students/entities/student.entity';
import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { Absence } from 'src/absences/entities/absence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      Student,
      DailyReport,
      SubjectGroupTimeSlot,
      Absence,
    ]),
  ],
  controllers: [PermissionRequestsController],
  providers: [PermissionRequestsService],
})
export class PermissionRequestsModule {}
