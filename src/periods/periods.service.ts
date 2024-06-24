import { Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(Period)
    private readonly periodsRepository: Repository<Period>,
  ) {}

  create(createPeriodDto: CreatePeriodDto): Promise<Period> {
    return this.periodsRepository.save(createPeriodDto);
  }

  findAll(): Promise<Period[]> {
    return this.periodsRepository.find();
  }

  findOne(id: number): Promise<Period | null> {
    return this.periodsRepository.findOneByOrFail({ id });
  }

  async update(id: number, updatePeriodDto: UpdatePeriodDto): Promise<Period> {
    const existingPeriod = await this.findOne(id);
    const periodData = this.periodsRepository.merge(
      existingPeriod,
      updatePeriodDto,
    );

    return await this.periodsRepository.save(periodData);
  }

  async remove(id: number): Promise<void> {
    await this.periodsRepository.delete({ id });
  }

  // Pagination

  async getPaginatedPeriods(
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<Period>> {
    const queryBuilder = this.periodsRepository.createQueryBuilder('period');
    queryBuilder.orderBy('period.id', 'DESC');
    if (search) {
      queryBuilder.where('period.name LIKE :search', { search: `%${search}%` });
    }

    return paginate<Period>(queryBuilder, options);
  }
}
