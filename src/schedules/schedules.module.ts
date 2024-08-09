import { Module } from '@nestjs/common';
import { SchdulesService } from './schedules.service';
import { SchdulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentScheduleView } from './entities/student-schedule.view';
import { TeacherScheduleView } from './entities/teacher-schedule.view';
import { AbsenceCountBySubjectView } from 'src/absences/entities/absence-count-by-subject.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentScheduleView,
      TeacherScheduleView,
      AbsenceCountBySubjectView,
    ]),
  ],
  controllers: [SchdulesController],
  providers: [SchdulesService],
})
export class SchdulesModule {}
