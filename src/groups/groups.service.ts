import { Injectable } from '@nestjs/common';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupsRepository: Repository<Group>,
  ) {}

  findOne(id: number) {
    return this.groupsRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const existingGroup = await this.findOne(id);
    const groupData = this.groupsRepository.merge(
      existingGroup,
      updateGroupDto,
    );

    return await this.groupsRepository.save(groupData);
  }

  remove(id: number) {
    return this.groupsRepository.delete({ id });
  }
}
