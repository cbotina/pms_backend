import { Module } from '@nestjs/common';
import { DailyReportsService } from './daily-reports.service';
import { DailyReportsController } from './daily-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyReport } from './entities/daily-report.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { Student } from 'src/students/entities/student.entity';
import { Absence } from 'src/absences/entities/absence.entity';
import { TeacherDailyReportView } from './entities/teacher-daily-reports.view';
import { DailyReportPermissionView } from './dto/daily-reports-permission.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyReport,
      SubjectGroupTimeSlot,
      Student,
      Absence,
      TeacherDailyReportView,
      DailyReportPermissionView,
    ]),
  ],
  controllers: [DailyReportsController],
  providers: [DailyReportsService],
})
export class DailyReportsModule {}
