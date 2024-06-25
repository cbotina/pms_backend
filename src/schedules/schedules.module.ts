import { Module } from '@nestjs/common';
import { SchdulesService } from './schedules.service';
import { SchdulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentScheduleView } from './entities/student-schedule.view';
import { TeacherScheduleView } from './entities/teacher-schedule.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentScheduleView, TeacherScheduleView]),
  ],
  controllers: [SchdulesController],
  providers: [SchdulesService],
})
export class SchdulesModule {}
