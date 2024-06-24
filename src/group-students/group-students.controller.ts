import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { GroupStudentsService } from './group-students.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PromoteStudentsDto } from './dto/promote-students.dto';

@Controller('groups/:groupId/students')
export class GroupStudentsController {
  constructor(private readonly groupStudentsService: GroupStudentsService) {}

  @Get()
  async getAllGroupStudents(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
    @Query('search') search?: string,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return await this.groupStudentsService.getAllGroupStudents(
      options,
      groupId,
      search,
    );
  }

  @Patch('promote')
  promoteStudents(
    @Param('groupId', ParseIntPipe) oldGroupId: number,
    @Body() promoteStudentsDto: PromoteStudentsDto,
  ) {
    const { newGroupId } = promoteStudentsDto;
    return this.groupStudentsService.promoteStudents(oldGroupId, newGroupId);
  }
}
