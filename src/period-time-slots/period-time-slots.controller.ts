import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PeriodTimeSlotsService } from './period-time-slots.service';
import { CreateTimeSlotDto } from 'src/time-slots/dto/create-time-slot.dto';
import { CopyTimeSlotsDto } from 'src/time-slots/dto/copy-time-slots.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('periods/:periodId/time-slots')
export class PeriodTimeSlotsController {
  constructor(
    private readonly periodTimeSlotsService: PeriodTimeSlotsService,
  ) {}

  @Get()
  async getPeriodTimeSlots(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return await this.periodTimeSlotsService.getPeriodTimeSlots(
      periodId,
      options,
    );
  }

  @Post()
  addTimeSlotToPeriod(
    @Body() createTimeSlotDto: CreateTimeSlotDto,
    @Param('periodId', ParseIntPipe) periodId: number,
  ) {
    return this.periodTimeSlotsService.addTimeSlotToPeriod(
      createTimeSlotDto,
      periodId,
    );
  }

  @Post('import')
  importTimeSlotsFromPeriod(
    @Body() createMultipleTimeslotsDto: CopyTimeSlotsDto,
    @Param('periodId', ParseIntPipe) periodId: number,
  ) {
    return this.periodTimeSlotsService.importTimeSlotsFromPeriod(
      createMultipleTimeslotsDto,
      periodId,
    );
  }
}
