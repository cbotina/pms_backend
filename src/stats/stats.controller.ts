import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Stats 📊')
@Controller('periods/:periodId/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('absences-per-group')
  getAbsencesPerGroup(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.statsService.getAbsencesPerGroup(periodId);
  }

  @Get('permission-count-by-reason')
  getPermissionCountByReason(
    @Param('periodId', ParseIntPipe) periodId: number,
  ) {
    return this.statsService.getPermissionCountByReason(periodId);
  }

  @Get('permission-count-by-status')
  getPermissionCountByStatus(
    @Param('periodId', ParseIntPipe) periodId: number,
  ) {
    return this.statsService.getPermissionCountByStatus(periodId);
  }

  @Get('absences-by-student')
  getAbsencesByStudent(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.statsService.getAbsencesByStudent(periodId);
  }

  @Get('subjects-with-most-absences')
  getSubjectsWithMostAbsences(
    @Param('periodId', ParseIntPipe) periodId: number,
  ) {
    return this.statsService.getSubjectsWithMostAbsences(periodId);
  }

  @Get('summary')
  getSummary(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.statsService.getSummary(periodId);
  }

  @Get('trends')
  getTrends(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.statsService.getTrends(periodId);
  }

  @Get('distribution')
  getDistribution(@Param('periodId', ParseIntPipe) periodId: number) {
    return this.statsService.getDistribution(periodId);
  }
}
