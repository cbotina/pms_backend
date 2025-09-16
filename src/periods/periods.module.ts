import { Module } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { PeriodsController } from './periods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { StudentEnrollmentView } from './entities/student-enrollment.view';
import { PeriodGroupsController } from './period-groups/period-groups.controller';
import { PeriodGroupsService } from './period-groups/period-groups.service';
import { Group } from '@groups/entities/group.entity';
import { Teacher } from '@teachers/entities/teacher.entity';
import { PeriodTimeSlotsController } from './period-time-slots/period-time-slots.controller';
import { PeriodTimeSlotsService } from './period-time-slots/period-time-slots.service';
import { TimeSlot } from '@time-slots/entities/time-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Period, StudentEnrollmentView, Group, Teacher, TimeSlot])],
  controllers: [
    PeriodsController,
    PeriodGroupsController,
    PeriodTimeSlotsController,
  ],
  providers: [PeriodsService, PeriodGroupsService, PeriodTimeSlotsService],
})
export class PeriodsModule {}
