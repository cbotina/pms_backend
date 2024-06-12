import { Module } from '@nestjs/common';
import { PeriodTimeSlotsService } from './period-time-slots.service';
import { PeriodTimeSlotsController } from './period-time-slots.controller';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { Period } from 'src/periods/entities/period.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TimeSlot, Period])],
  controllers: [PeriodTimeSlotsController],
  providers: [PeriodTimeSlotsService],
})
export class PeriodTimeSlotsModule {}
