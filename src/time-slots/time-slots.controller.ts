import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { UpdateTimeSlotDto } from './dto/update-time-slot.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { Tags } from '../config/swagger/swagger.config';
import {
  FindAllTimeSlotsDocs,
  FindOneTimeSlotDocs,
  UpdateTimeSlotDocs,
  RemoveTimeSlotDocs,
} from './time-slots.controller.docs';

@Role(Roles.SECRETARY)
@ApiTags(Tags.TIME_SLOTS)
@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Get()
  @FindAllTimeSlotsDocs()
  findAll() {
    return this.timeSlotsService.findAll();
  }

  @Get(':id')
  @FindOneTimeSlotDocs()
  findOne(@Param('id') id: string) {
    return this.timeSlotsService.findOne(+id);
  }

  @Patch(':id')
  @UpdateTimeSlotDocs()
  update(
    @Param('id') id: string,
    @Body() updateTimeSlotDto: UpdateTimeSlotDto,
  ) {
    return this.timeSlotsService.update(+id, updateTimeSlotDto);
  }

  @Delete(':id')
  @RemoveTimeSlotDocs()
  remove(@Param('id') id: string) {
    return this.timeSlotsService.remove(+id);
  }
}
