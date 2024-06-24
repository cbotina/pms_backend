import { Injectable } from '@nestjs/common';
import { CreateSubjectGroupDto } from './dto/create-subject-group.dto';
import { UpdateSubjectGroupDto } from './dto/update-subject-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectGroup } from './entities/subject-group.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Repository } from 'typeorm';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class SubjectGroupsService {
  constructor(
    @InjectRepository(SubjectGroup)
    private readonly subjectGroupsRepository: Repository<SubjectGroup>,
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private readonly subjectsRepository: Repository<Subject>,
  ) {}

  async addSubjectToGroup(
    createSubjectGroupDto: CreateSubjectGroupDto,
    groupId: number,
  ): Promise<SubjectGroup> {
    const { subjectId, teacherId, hours } = createSubjectGroupDto;

    const group: Group = await this.groupsRepository.findOneByOrFail({
      id: groupId,
    });

    const subject: Subject = await this.subjectsRepository.findOneByOrFail({
      id: subjectId,
    });

    const teacher: Teacher = await this.teachersRepository.findOneByOrFail({
      id: teacherId,
    });

    return this.subjectGroupsRepository.save({
      group,
      subject,
      teacher,
      hours,
    });
  }

  async getGroupSubjects(
    groupId: number,
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<SubjectGroup>> {
    const queryBuilder = this.subjectGroupsRepository.createQueryBuilder('sg');

    queryBuilder.where('sg.groupId = :groupId', { groupId });
    queryBuilder.leftJoin('sg.teacher', 't');
    queryBuilder.addSelect(['t.id', 't.firstName', 't.lastName']);
    queryBuilder.leftJoin('sg.subject', 's');
    queryBuilder.addSelect(['s.id', 's.name']);

    // queryBuilder.innerJoinAndSelect('g.subjectGroups', 'subjectGroups');
    // if (search) {
    //   queryBuilder.where('sg.name LIKE :search', { search: `%${search}%` });
    // }

    return paginate<SubjectGroup>(queryBuilder, options);
  }

  findOne(id: number) {
    return this.subjectGroupsRepository
      .createQueryBuilder('sg')
      .where('sg.id = :id', { id })
      .leftJoin('sg.teacher', 'teacher')
      .addSelect(['teacher.id', 'teacher.firstName', 'teacher.lastName'])
      .leftJoin('sg.subject', 'subject')
      .addSelect(['subject.id', 'subject.name'])
      .leftJoin('sg.group', 'group')
      .addSelect(['group.id', 'group.name'])
      .getOneOrFail();
  }

  async update(id: number, updateSubjectGroupDto: UpdateSubjectGroupDto) {
    const existingSubjectGroup = await this.findOne(id);

    const { hours, subjectId, teacherId } = updateSubjectGroupDto;

    let teacher: Teacher = undefined;
    let subject: Subject = undefined;

    if (teacherId) {
      teacher = await this.teachersRepository.findOneByOrFail({
        id: teacherId,
      });
    }

    if (subjectId) {
      subject = await this.subjectsRepository.findOneByOrFail({
        id: subjectId,
      });
    }

    const subjectGroupData = this.subjectGroupsRepository.merge({
      ...existingSubjectGroup,
      teacher,
      subject,
      hours,
    });

    return await this.subjectGroupsRepository.save(subjectGroupData);
  }

  async remove(id: number) {
    return await this.subjectGroupsRepository.delete({ id });
  }
}
