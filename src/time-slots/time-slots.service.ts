import { Injectable } from '@nestjs/common';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly timeSlotsRepository: Repository<TimeSlot>,
  ) {}

  create(createTimeSlotDto: CreateTimeSlotDto) {
    return this.timeSlotsRepository.save(createTimeSlotDto);
  }

  findAll() {
    return this.timeSlotsRepository.find();
  }

  findOne(id: number) {
    return this.timeSlotsRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateTimeSlotDto: UpdateTimeSlotDto) {
    const existingTimeSlot = await this.findOne(id);
    const timeSlotData = this.timeSlotsRepository.merge(
      existingTimeSlot,
      updateTimeSlotDto,
    );

    return await this.timeSlotsRepository.save(timeSlotData);
  }

  async remove(id: number) {
    await this.timeSlotsRepository.delete({ id });
  }
}
