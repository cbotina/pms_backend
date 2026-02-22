import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AbsencesByGroupView } from './entities/absences-per-group.view';
import { PermissionCountByReasonView } from './entities/permission-count-by-reason.view';
import { AbsencesByStudentView } from './entities/absences-by-student.view';
import { PermissionCountByStatusView } from './entities/permission-count-by-status.view';
import { SubjectsWithMostAbsencesView } from './entities/subject-with-most-absences.view';
import { Group } from 'src/groups/entities/group.entity';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Absence } from 'src/absences/entities/absence.entity';
import { Period } from 'src/periods/entities/period.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AbsencesByGroupView,
      PermissionCountByReasonView,
      AbsencesByStudentView,
      PermissionCountByStatusView,
      SubjectsWithMostAbsencesView,
      Group,
      Student,
      SubjectGroup,
      Enrollment,
      Permission,
      Absence,
      Period,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
