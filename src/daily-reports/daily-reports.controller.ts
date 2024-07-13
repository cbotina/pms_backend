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
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyReportPermissionView } from './dto/daily-reports-permission.view';
import { Repository } from 'typeorm';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Daily Reports 📃')
@Controller()
export class DailyReportsController {
  constructor(
    private readonly dailyReportsService: DailyReportsService,
    @InjectRepository(DailyReportPermissionView)
    private readonly drPermissionRepository: Repository<DailyReportPermissionView>,
  ) {}

  // @Public()
  @Role(Roles.TEACHER)
  @Post('daily-reports')
  create(@Body() createDailyReportDto: CreateDailyReportDto) {
    return this.dailyReportsService.create(createDailyReportDto);
  }

  @Role(Roles.ADMIN)
  @Get('daily-reports')
  findAll() {
    return this.dailyReportsService.findAll();
  }

  @Public()
  // todo : remove public
  // @Role(Roles.TEACHER)
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

  // @Public()
  @Get('daily-reports/:dailyReportId/permissions')
  getDailyReportPermissions(
    @Param('dailyReportId', ParseIntPipe) dailyReportId: number,
  ) {
    return this.drPermissionRepository.find({ where: { dailyReportId } });
  }
}
