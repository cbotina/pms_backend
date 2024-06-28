import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { UpdateGroupDto } from './dto/update-group.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Groups 👥')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.groupsService.remove(id);
  }

  @Post(':id/generate-enrollments')
  generateEnrollments(@Param('id') id: number) {
    return this.groupsService.generateEnrollments(id);
  }
}
