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
import { SubjectGroupTimeSlotsService } from './subject-group-time-slots.service';
import { CreateSubjectGroupTimeSlotDto } from './dto/create-subject-group-time-slot.dto';
import { UpdateSubjectGroupTimeSlotDto } from './dto/update-subject-group-time-slot.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TypeORMExceptionFilter } from 'src/exception-filter/typeorm-exception.filter';

@UseInterceptors(LoggingInterceptor)
@UseFilters(TypeORMExceptionFilter)
@Controller()
export class SubjectGroupTimeSlotsController {
  constructor(
    private readonly subjectGroupTimeSlotsService: SubjectGroupTimeSlotsService,
  ) {}

  @Post('subject-groups/:subjectGroupId/time-slots')
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
  findAll(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
    @Query('search') search?: string,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };
    return this.subjectGroupTimeSlotsService.findAll(
      options,
      subjectGroupId,
      search,
    );
  }

  @Get('subject-group-time-slots/:subjetcGroupTimeSlotId')
  findOne(@Param('subjetcGroupTimeSlotId') id: string) {
    return this.subjectGroupTimeSlotsService.findOne(+id);
  }

  @Patch('subject-group-time-slots/:subjetcGroupTimeSlotId')
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
  remove(@Param('subjetcGroupTimeSlotId') id: string) {
    return this.subjectGroupTimeSlotsService.remove(+id);
  }
}
