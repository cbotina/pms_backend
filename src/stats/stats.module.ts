import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsencesByGroupView } from './entities/absences-per-group.view';
import { PermissionCountByReasonView } from './entities/permission-count-by-reason.view';
import { AbsencesByStudentView } from './entities/absences-by-student.view';
import { PermissionCountByStatusView } from './entities/permission-count-by-status.view';
import { SubjectsWithMostAbsencesView } from './entities/subject-with-most-absences.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AbsencesByGroupView,
      PermissionCountByReasonView,
      AbsencesByStudentView,
      PermissionCountByReasonView,
      PermissionCountByStatusView,
      SubjectsWithMostAbsencesView,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
