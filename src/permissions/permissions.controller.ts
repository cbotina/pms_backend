import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Patch,
  Body,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PermissionStatus } from './entities/permission.entity';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { TypeORMExceptionFilter } from 'src/exception-filter/typeorm-exception.filter';

@UseInterceptors(LoggingInterceptor)
@UseFilters(TypeORMExceptionFilter)
@Controller()
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

  @Get('periods/:periodId/permissions')
  getPeriodPermissions(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
    @Query('search') search?: string,
    @Query('status') status?: PermissionStatus,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.permissionsService.getPeriodPermissions(
      periodId,
      options,
      search,
      status,
    );
  }

  @Patch('permissions/:permissionId')
  updatePermission(
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.updatePermission(
      permissionId,
      updatePermissionDto,
    );
  }

  @Get('permissions/:permissionId')
  getPermission(@Param('permissionId', ParseIntPipe) permissionId: number) {
    return this.permissionsService.getPermission(permissionId);
  }
}
