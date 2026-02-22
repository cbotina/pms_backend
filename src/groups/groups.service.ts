import { Injectable } from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Brackets, Repository } from 'typeorm';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepository: Repository<Enrollment>,
  ) {}

  findAll(options: IPaginationOptions, search?: string) {
    const qb = this.groupsRepository
      .createQueryBuilder('g')
      .leftJoinAndSelect('g.period', 'period')
      .orderBy('period.name', 'DESC')
      .addOrderBy('g.name', 'ASC');

    if (search) {
      qb.where(
        new Brackets((q) => {
          q.where('g.name LIKE :s', { s: `%${search}%` }).orWhere(
            'period.name LIKE :s',
            { s: `%${search}%` },
          );
        }),
      );
    }

    return paginate<Group>(qb, options);
  }

  findOne(id: number) {
    return this.groupsRepository
      .createQueryBuilder('group')
      .where('group.id = :id', { id })
      .leftJoinAndSelect('group.period', 'period')
      .leftJoin('group.tutor', 'tutor')
      .addSelect(['tutor.id', 'tutor.firstName', 'tutor.lastName'])
      .getOneOrFail();
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const existingGroup = await this.findOne(id);

    let tutor: Teacher = undefined;
    if (updateGroupDto.teacherId) {
      tutor = await this.teachersRepository.findOneByOrFail({
        id: updateGroupDto.teacherId,
      });
    } else if (updateGroupDto.teacherId === null) {
      tutor = null;
    }

    const groupData = this.groupsRepository.merge(existingGroup, {
      ...updateGroupDto,
      ...(tutor !== undefined ? { tutor } : {}),
    });

    return await this.groupsRepository.save(groupData);
  }

  remove(id: number) {
    return this.groupsRepository.delete({ id });
  }

  async generateEnrollments(groupId: number) {
    const { students, subjectGroups } =
      await this.groupsRepository.findOneOrFail({
        where: { id: groupId },
        relations: { students: true, subjectGroups: true },
      });

    for (const subjectGroup of subjectGroups) {
      for (const student of students) {
        const exists = await this.enrollmentsRepository.findOne({
          where: { student: { id: student.id }, subjectGroup: { id: subjectGroup.id } },
        });
        if (!exists) {
          await this.enrollmentsRepository.save({ student, subjectGroup });
        }
      }
    }
  }
}
