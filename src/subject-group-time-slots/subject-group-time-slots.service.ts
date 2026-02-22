import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubjectGroupTimeSlotDto } from './dto/create-subject-group-time-slot.dto';
import { UpdateSubjectGroupTimeSlotDto } from './dto/update-subject-group-time-slot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectGroupTimeSlot } from './entities/subject-group-time-slot.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SubjectGroupTimeSlotsService {
  constructor(
    @InjectRepository(SubjectGroupTimeSlot)
    private readonly sgtsRepository: Repository<SubjectGroupTimeSlot>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotsRepository: Repository<TimeSlot>,
    @InjectRepository(SubjectGroup)
    private readonly subjectGroupsRepositor: Repository<SubjectGroup>,
  ) {}

  async addTimeSlotToSubjectGroup(
    createSubjectGroupTimeSlotDto: CreateSubjectGroupTimeSlotDto,
    subjectGroupId: number,
  ) {
    const { timeSlotId, day } = createSubjectGroupTimeSlotDto;

    const timeSlot = await this.timeSlotsRepository.findOneOrFail({
      where: { id: timeSlotId },
      relations: { period: true },
    });

    const subjectGroup = await this.subjectGroupsRepositor.findOneOrFail({
      where: { id: subjectGroupId },
      relations: { group: { period: true } },
    });

    if (!timeSlot.isAcademic) {
      throw new BadRequestException(
        'No se pueden asignar unidades de formación a franjas no académicas',
      );
    }

    if (timeSlot.period.id !== subjectGroup.group.period.id) {
      throw new BadRequestException(
        'La franja horaria no pertenece al periodo del grupo',
      );
    }

    return this.sgtsRepository.save({
      day,
      subjectGroup,
      timeSlot,
    });
  }

  async findAll(
    options: IPaginationOptions,
    subjectGroupId: number,
  ): Promise<Pagination<SubjectGroupTimeSlot>> {
    const queryBuilder = this.sgtsRepository.createQueryBuilder('sgts');

    queryBuilder
      .where('sgts.subjectGroupId = :subjectGroupId', {
        subjectGroupId,
      })
      .leftJoin('sgts.timeSlot', 'ts')
      .addSelect(['ts.id', 'ts.startTime', 'ts.endTime']);

    return paginate<SubjectGroupTimeSlot>(queryBuilder, options);
  }

  findOne(id: number) {
    return this.sgtsRepository
      .createQueryBuilder('sgts')
      .where('sgts.id = :id', { id })
      .leftJoin('sgts.timeSlot', 'ts')
      .addSelect(['ts.id', 'ts.startTime', 'ts.endTime'])
      .leftJoin('sgts.subjectGroup', 'sg')
      .addSelect(['sg.id'])
      .leftJoin('sg.subject', 's')
      .addSelect(['s.id', 's.name'])
      .getOneOrFail();
  }

  async update(
    id: number,
    updateSubjectGroupTimeSlotDto: UpdateSubjectGroupTimeSlotDto,
  ) {
    const existingSgts = await this.findOne(id);

    const { day, timeSlotId } = updateSubjectGroupTimeSlotDto;

    let timeSlot: TimeSlot = undefined;

    if (timeSlotId) {
      timeSlot = await this.timeSlotsRepository.findOneOrFail({
        where: { id: timeSlotId },
        relations: { period: true },
      });

      if (!timeSlot.isAcademic) {
        throw new BadRequestException(
          'No se pueden asignar unidades de formación a franjas no académicas',
        );
      }

      const subjectGroup = await this.subjectGroupsRepositor.findOneOrFail({
        where: { id: existingSgts.subjectGroup.id },
        relations: { group: { period: true } },
      });

      if (timeSlot.period.id !== subjectGroup.group.period.id) {
        throw new BadRequestException(
          'La franja horaria no pertenece al periodo del grupo',
        );
      }
    }

    const sgtsData = this.sgtsRepository.merge({
      ...existingSgts,
      day,
      timeSlot,
    });

    return await this.sgtsRepository.save(sgtsData);
  }

  async remove(id: number) {
    return await this.sgtsRepository.delete({ id });
  }
}
