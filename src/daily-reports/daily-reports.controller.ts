import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DailyReportsService } from './daily-reports.service';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';

@Controller()
export class DailyReportsController {
  constructor(private readonly dailyReportsService: DailyReportsService) {}

  @Post('daily-reports')
  create(@Body() createDailyReportDto: CreateDailyReportDto) {
    return this.dailyReportsService.create(createDailyReportDto);
  }

  @Get('daily-reports')
  findAll() {
    return this.dailyReportsService.findAll();
  }

  @Get('periods/:periodId/teachers/:teacherId/daily-reports')
  getTeacherDailyReports(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('teacherId', ParseIntPipe) teacherId: number,
    @Query('date') date: string,
  ) {
    return this.dailyReportsService.getTeacherDailyReports(
      periodId,
      teacherId,
      date,
    );
  }
}
