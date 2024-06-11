import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { TypeORMExceptionFilter } from 'src/exception-filter/typeorm-exception.filter';
import { CopyTimeSlotsDto } from './dto/copy-time-slots.dto';

@UseFilters(TypeORMExceptionFilter)
@Controller('periods/:periodId/time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post()
  create(
    @Body() createTimeSlotDto: CreateTimeSlotDto,
    @Param('periodId', ParseIntPipe) periodId: number,
  ) {
    return this.timeSlotsService.addTimeSlotToPeriod(
      createTimeSlotDto,
      periodId,
    );
  }
  @Post('import')
  createMany(
    @Body() createMultipleTimeslotsDto: CopyTimeSlotsDto,
    @Param('periodId', ParseIntPipe) periodId: number,
  ) {
    return this.timeSlotsService.importTimeSlots(
      createMultipleTimeslotsDto,
      periodId,
    );
  }

  @Get()
  findAll() {
    return this.timeSlotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeSlotsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeSlotDto: UpdateTimeSlotDto,
  ) {
    return this.timeSlotsService.update(+id, updateTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSlotsService.remove(+id);
  }
}
