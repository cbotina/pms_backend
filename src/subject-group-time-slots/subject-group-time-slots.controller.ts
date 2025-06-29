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
import { SubjectGroupTimeSlotsService } from './subject-group-time-slots.service';
import { CreateSubjectGroupTimeSlotDto } from './dto/create-subject-group-time-slot.dto';
import { UpdateSubjectGroupTimeSlotDto } from './dto/update-subject-group-time-slot.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { Tags } from '../config/swagger/swagger.config';
import {
  CreateSubjectGroupTimeSlotDocs,
  GetSubjectGroupTimeSlotsDocs,
  GetSubjectGroupTimeSlotDocs,
  UpdateSubjectGroupTimeSlotDocs,
  DeleteSubjectGroupTimeSlotDocs,
} from './subject-group-time-slots.controller.docs';

@Role(Roles.SECRETARY)
@ApiTags(Tags.SUBJECT_GROUP_TIME_SLOTS)
@Controller()
export class SubjectGroupTimeSlotsController {
  constructor(
    private readonly subjectGroupTimeSlotsService: SubjectGroupTimeSlotsService,
  ) {}

  @Post('subject-groups/:subjectGroupId/time-slots')
  @CreateSubjectGroupTimeSlotDocs()
  create(
    @Body() createSubjectGroupTimeSlotDto: CreateSubjectGroupTimeSlotDto,
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.subjectGroupTimeSlotsService.addTimeSlotToSubjectGroup(
      createSubjectGroupTimeSlotDto,
      subjectGroupId,
    );
  }

  @Get('subject-groups/:subjectGroupId/time-slots')
  @GetSubjectGroupTimeSlotsDocs()
  findAll(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };
    return this.subjectGroupTimeSlotsService.findAll(options, subjectGroupId);
  }

  @Get('subject-group-time-slots/:subjetcGroupTimeSlotId')
  @GetSubjectGroupTimeSlotDocs()
  findOne(@Param('subjetcGroupTimeSlotId') id: string) {
    return this.subjectGroupTimeSlotsService.findOne(+id);
  }

  @Patch('subject-group-time-slots/:subjetcGroupTimeSlotId')
  @UpdateSubjectGroupTimeSlotDocs()
  update(
    @Param('subjetcGroupTimeSlotId') id: string,
    @Body() updateSubjectGroupTimeSlotDto: UpdateSubjectGroupTimeSlotDto,
  ) {
    return this.subjectGroupTimeSlotsService.update(
      +id,
      updateSubjectGroupTimeSlotDto,
    );
  }

  @Delete('subject-group-time-slots/:subjetcGroupTimeSlotId')
  @DeleteSubjectGroupTimeSlotDocs()
  remove(@Param('subjetcGroupTimeSlotId') id: string) {
    return this.subjectGroupTimeSlotsService.remove(+id);
  }
}
