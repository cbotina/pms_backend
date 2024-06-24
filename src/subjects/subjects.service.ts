import { Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { Repository } from 'typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  async getPaginatedSubjects(
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<Subject>> {
    const queryBuilder = this.subjectsRepository.createQueryBuilder('sub');
    queryBuilder.orderBy('sub.name', 'ASC');
    if (search) {
      queryBuilder.where('sub.name LIKE :search', { search: `%${search}%` });
    }

    return paginate<Subject>(queryBuilder, options);
  }

  create(createSubjectDto: CreateSubjectDto) {
    return this.subjectsRepository.save(createSubjectDto);
  }

  findAll() {
    return this.subjectsRepository.find();
  }

  findOne(id: number) {
    return this.subjectsRepository.findOneByOrFail({ id });
  }

  async update(
    id: number,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    const existingSubject = await this.findOne(id);
    const subjectData = this.subjectsRepository.merge(
      existingSubject,
      updateSubjectDto,
    );

    return await this.subjectsRepository.save(subjectData);
  }

  remove(id: number) {
    return this.subjectsRepository.delete({ id });
  }
}
