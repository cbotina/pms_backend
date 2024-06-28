import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SchdulesService } from './schedules.service';
import { WeekDay } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ScheduleRangeDatesDto } from './dto/schedule-range-dates.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Schedules 📜')
@Controller('periods/:periodId')
export class SchdulesController {
  constructor(private readonly schdulesService: SchdulesService) {}

  @Get('students/:studentId/schedule')
  getStudentSchedule(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number = 1,
    @Query('day') day?: WeekDay,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.schdulesService.getStudentSchedule(
      periodId,
      studentId,
      options,
      day,
    );
  }

  @Get('teachers/:teacherId/schedule')
  getTeachersSchedule(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number = 1,
    @Query('day') day?: WeekDay,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.schdulesService.getTeachersSchedule(
      periodId,
      teacherId,
      options,
      day,
    );
  }

  @Get('students/:studentId/range-schedule')
  async getStudentScheduleByRange(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() scheduleRangeDatesDto: ScheduleRangeDatesDto,
  ) {
    const scheduleMap = await this.schdulesService.getStudentScheduleByRange(
      periodId,
      studentId,
      scheduleRangeDatesDto,
    );

    return Array.from(scheduleMap.entries());
  }
}
