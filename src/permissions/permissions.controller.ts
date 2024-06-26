import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('periods/:periodId/students/:studentId/permissions')
  getStudentPeriodPermissions(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
    @Query('search') search?: string,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.permissionsService.getStudentPeriodPermissions(
      periodId,
      studentId,
      options,
      search,
    );
  }
}
