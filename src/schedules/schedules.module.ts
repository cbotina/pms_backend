import { Module } from '@nestjs/common';
import { SchdulesService } from './schedules.service';
import { SchdulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentScheduleView } from './entities/student-schedule.view';
import { TeacherScheduleView } from './entities/teacher-schedule.view';
import { AbsenceCountBySubjectView } from 'src/absences/entities/absence-count-by-subject.view';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StudentScheduleView,
      TeacherScheduleView,
      AbsenceCountBySubjectView,
      SubjectGroupTimeSlot,
    ]),
  ],
  controllers: [SchdulesController],
  providers: [SchdulesService],
})
export class SchdulesModule {}
