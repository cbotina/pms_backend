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
  HttpCode,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';

import { PeriodsService } from './periods.service';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { TypeORMExceptionFilter } from 'src/exception-filter/typeorm-exception.filter';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@UseFilters(TypeORMExceptionFilter)
@Controller('periods')
export class PeriodsController {
  constructor(private readonly periodsService: PeriodsService) {}

  @Post()
  create(@Body() createPeriodDto: CreatePeriodDto) {
    return this.periodsService.create(createPeriodDto);
  }

  findAll() {
    return this.periodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.periodsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePeriodDto: UpdatePeriodDto,
  ) {
    return this.periodsService.update(id, updatePeriodDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.periodsService.remove(id);
  }

  // Pagination
  @Get()
  async getPaginatedPeriods(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return await this.periodsService.getPaginatedPeriods(options);
  }
}
