import { Injectable } from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { Teacher } from 'src/teachers/entities/teacher.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
    @InjectRepository(Teacher)
    private readonly teachersRepository: Repository<Teacher>,
  ) {}

  findOne(id: number) {
    return this.groupsRepository
      .createQueryBuilder('group')
      .where('group.id = :id', { id })
      .leftJoin('group.tutor', 'tutor')
      .addSelect(['tutor.id', 'tutor.firstName', 'tutor.lastName']) // Select specific properties of the tutor relation
      .getOneOrFail();
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const existingGroup = await this.findOne(id);

    let teacher: Teacher = null;
    if (updateGroupDto.teacherId) {
      teacher = await this.teachersRepository.findOneByOrFail({
        id: updateGroupDto.teacherId,
      });
    }

    const groupData = this.groupsRepository.merge(
      existingGroup,
      updateGroupDto,
      teacher,
    );

    return await this.groupsRepository.save(groupData);
  }

  remove(id: number) {
    return this.groupsRepository.delete({ id });
  }
}
