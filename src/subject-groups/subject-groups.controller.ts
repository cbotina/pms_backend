import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { SubjectGroupsService } from './subject-groups.service';
import { CreateSubjectGroupDto } from './dto/create-subject-group.dto';
import { UpdateSubjectGroupDto } from './dto/update-subject-group.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TypeORMExceptionFilter } from 'src/exception-filter/typeorm-exception.filter';

@UseInterceptors(LoggingInterceptor)
@UseFilters(TypeORMExceptionFilter)
@Controller()
export class SubjectGroupsController {
  constructor(private readonly subjectGroupsService: SubjectGroupsService) {}

  @Post('groups/:groupId/subjects')
  create(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() createSubjectGroupDto: CreateSubjectGroupDto,
  ) {
    return this.subjectGroupsService.addSubjectToGroup(
      createSubjectGroupDto,
      groupId,
    );
  }

  @Get('groups/:groupId/subjects')
  findAll(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.subjectGroupsService.getGroupSubjects(groupId, options);
  }

  @Get('subject-groups/:subjectGroupId')
  findOne(@Param('subjectGroupId', ParseIntPipe) id: number) {
    return this.subjectGroupsService.findOne(+id);
  }

  @Patch('subject-groups/:subjectGroupId')
  update(
    @Param('subjectGroupId', ParseIntPipe) id: number,
    @Body() updateSubjectGroupDto: UpdateSubjectGroupDto,
  ) {
    return this.subjectGroupsService.update(+id, updateSubjectGroupDto);
  }

  @Delete('subject-groups/:subjectGroupId')
  remove(@Param('subjectGroupId', ParseIntPipe) id: number) {
    return this.subjectGroupsService.remove(+id);
  }

  @Get('periods/:periodId/teachers/:teacherId/subject-groups')
  getTeacherSubjectGroups(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.subjectGroupsService.getTeacherSubjectGroups(
      periodId,
      teacherId,
      options,
    );
  }

  @Get('subject-groups/:subjectGroupId/students')
  getSubjectGroupStudents(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.subjectGroupsService.getSubjectGroupStudents(subjectGroupId);
  }
}
