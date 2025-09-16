import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionWithStudentView } from './dto/permission-with-student.view';
import { Student } from '@students/entities/student.entity';
import { DailyReport } from '@daily-reports/entities/daily-report.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { Absence } from '@absences/entities/absence.entity';
import { PermissionRequestsController } from './permission-requests/permission-requests.controller';
import { PermissionRequestsService } from './permission-requests/permission-requests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
      PermissionWithStudentView,
      Student,
      DailyReport,
      SubjectGroupTimeSlot,
      Absence,
    ]),
  ],
  controllers: [PermissionsController, PermissionRequestsController],
  providers: [PermissionsService, PermissionRequestsService],
})
export class PermissionsModule {}
