import { Module } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { AbsencesController } from './absences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionAbsenceDetailsView } from './entities/permission-absence-details.view';
import { UnjustifiedAbsenceDetailsView } from './entities/unjustified-absences.view';
import { AbsenceCountView } from './entities/absence-count.view';
import { SubjectGroupStudentAbsenceDetailsView } from './entities/student-absence-details.view';
import { AbsenceCountBySubjectView } from './entities/absence-count-by-subject.view';
import { AbsenceWithStudentView } from './entities/absence_with_student.view';
import { Absence } from './entities/absence.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Absence,
      PermissionAbsenceDetailsView,
      UnjustifiedAbsenceDetailsView,
      AbsenceCountView,
      SubjectGroupStudentAbsenceDetailsView,
      AbsenceCountBySubjectView,
      AbsenceWithStudentView,
    ]),
  ],
  controllers: [AbsencesController],
  providers: [AbsencesService],
})
export class AbsencesModule {}
