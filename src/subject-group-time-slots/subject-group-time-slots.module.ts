import { Module } from '@nestjs/common';
import { SubjectGroupTimeSlotsService } from './subject-group-time-slots.service';
import { SubjectGroupTimeSlotsController } from './subject-group-time-slots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectGroupTimeSlot } from './entities/subject-group-time-slot.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubjectGroupTimeSlot, TimeSlot, SubjectGroup]),
  ],
  controllers: [SubjectGroupTimeSlotsController],
  providers: [SubjectGroupTimeSlotsService],
})
export class SubjectGroupTimeSlotsModule {}
