import { Injectable } from '@nestjs/common';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TimeSlot } from './entities/time-slot.entity';
import { DataSource, Repository } from 'typeorm';
import { Period } from 'src/periods/entities/period.entity';
import { CopyTimeSlotsDto } from './dto/copy-time-slots.dto';

@Injectable()
export class TimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly timeSlotsRepository: Repository<TimeSlot>,
    @InjectRepository(Period)
    private readonly periodsRepository: Repository<Period>,
    private readonly dataSource: DataSource,
  ) {}

  async addTimeSlotToPeriod(
    createTimeSlotDto: CreateTimeSlotDto,
    periodId: number,
  ) {
    const period = await this.periodsRepository.findOneByOrFail({
      id: periodId,
    });

    return this.timeSlotsRepository.save({
      ...createTimeSlotDto,
      period: period,
    });
  }

  async importTimeSlots(
    copyTimeSlotsDto: CopyTimeSlotsDto,
    targetPeriodId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sourcePeriod = await this.periodsRepository.findOneOrFail({
        where: { id: copyTimeSlotsDto.sourcePeriodId },
        relations: ['timeSlots'],
      });

      const sourceTimeSlots = sourcePeriod.timeSlots;

      const targetPeriod = await this.periodsRepository.findOneByOrFail({
        id: targetPeriodId,
      });

      sourceTimeSlots.forEach(async (timeSlot) => {
        const { startTime, endTime, label, isAcademic } = timeSlot;

        await this.timeSlotsRepository.save({
          label,
          startTime,
          endTime,
          isAcademic,
          period: targetPeriod,
        });
      });

      await queryRunner.commitTransaction();

      return {
        message: 'TimeSlots imported successfully',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

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
