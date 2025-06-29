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
} from '@nestjs/common';
import { SubjectGroupsService } from './subject-groups.service';
import { CreateSubjectGroupDto } from './dto/create-subject-group.dto';
import { UpdateSubjectGroupDto } from './dto/update-subject-group.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { Tags } from '../config/swagger/swagger.config';
import {
  CreateSubjectGroupDocs,
  FindAllSubjectGroupsDocs,
  FindOneSubjectGroupDocs,
  UpdateSubjectGroupDocs,
  RemoveSubjectGroupDocs,
  GetTeacherSubjectGroupsDocs,
  GetSubjectGroupStudentsDocs,
} from './subject-groups.controller.docs';

@Role(Roles.SECRETARY)
@ApiTags(Tags.SUBJECT_GROUPS)
@Controller()
export class SubjectGroupsController {
  constructor(private readonly subjectGroupsService: SubjectGroupsService) {}

  @Post('groups/:groupId/subjects')
  @CreateSubjectGroupDocs()
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
  @FindAllSubjectGroupsDocs()
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
  @FindOneSubjectGroupDocs()
  findOne(@Param('subjectGroupId', ParseIntPipe) id: number) {
    return this.subjectGroupsService.findOne(+id);
  }

  @Patch('subject-groups/:subjectGroupId')
  @UpdateSubjectGroupDocs()
  update(
    @Param('subjectGroupId', ParseIntPipe) id: number,
    @Body() updateSubjectGroupDto: UpdateSubjectGroupDto,
  ) {
    return this.subjectGroupsService.update(+id, updateSubjectGroupDto);
  }

  @Delete('subject-groups/:subjectGroupId')
  @RemoveSubjectGroupDocs()
  remove(@Param('subjectGroupId', ParseIntPipe) id: number) {
    return this.subjectGroupsService.remove(+id);
  }

  // @Public()
  @Role(Roles.TEACHER)
  @Get('periods/:periodId/teachers/:teacherId/subject-groups')
  @GetTeacherSubjectGroupsDocs()
  getTeacherSubjectGroups(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 1,
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

  // @Public()
  @Role(Roles.TEACHER)
  @Get('subject-groups/:subjectGroupId/students')
  @GetSubjectGroupStudentsDocs()
  getSubjectGroupStudents(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.subjectGroupsService.getSubjectGroupStudents(subjectGroupId);
  }
}
