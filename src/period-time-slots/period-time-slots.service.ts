import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Period } from 'src/periods/entities/period.entity';
import { CopyTimeSlotsDto } from 'src/time-slots/dto/copy-time-slots.dto';
import { CreateTimeSlotDto } from 'src/time-slots/dto/create-time-slot.dto';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PeriodTimeSlotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly timeSlotsRepository: Repository<TimeSlot>,
    @InjectRepository(Period)
    private readonly periodsRepository: Repository<Period>,
    private readonly dataSource: DataSource,
  ) {}

  async getPeriodTimeSlots(
    periodId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<TimeSlot>> {
    const queryBuilder = this.timeSlotsRepository.createQueryBuilder('ts');
    queryBuilder.where('ts.periodId = :periodId', { periodId });

    return paginate<TimeSlot>(queryBuilder, options);
  }

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

  async importTimeSlotsFromPeriod(
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
}
