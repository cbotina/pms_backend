import { Module } from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { AbsencesController } from './absences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionAbsenceDetailsView } from './entities/permission-absence-details.view';
import { UnjustifiedAbsenceDetailsView } from './entities/unjustified-absences.view';
import { AbsenceCountView } from './entities/absence-count.view';
import { SubjectGroupStudentAbsenceDetailsView } from './entities/student-absence-details.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionAbsenceDetailsView,
      UnjustifiedAbsenceDetailsView,
      AbsenceCountView,
      SubjectGroupStudentAbsenceDetailsView,
    ]),
  ],
  controllers: [AbsencesController],
  providers: [AbsencesService],
})
export class AbsencesModule {}
