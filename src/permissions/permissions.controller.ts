import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PermissionStatus } from './entities/permission.entity';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { JustifyLeavingPermissionDto } from './dto/justify-permission.dto';

@ApiTags('Permissions 🅿️')
@Controller()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Role(Roles.SECRETARY, Roles.STUDENT)
  @Get('periods/:periodId/students/:studentId/permissions')
  getStudentPeriodPermissions(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
    @Query('search') search?: string,
    @Query('status') status?: PermissionStatus,
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
      status,
    );
  }

  @Role(Roles.SECRETARY)
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

  // todo: check secreatry permissions for this operation
  @Role(Roles.SECRETARY)
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

  @Public()
  // todo : remove public
  @Patch('permissions/:permissionId/justify')
  justifyLeavingPermission(
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Body() justifyLeavingPermissionDto: JustifyLeavingPermissionDto,
  ) {
    return this.permissionsService.justifyLeavingPermission(
      permissionId,
      justifyLeavingPermissionDto,
    );
  }

  @Role(Roles.SECRETARY, Roles.STUDENT, Roles.TEACHER)
  @Get('permissions/:permissionId')
  getPermission(@Param('permissionId', ParseIntPipe) permissionId: number) {
    return this.permissionsService.getPermission(permissionId);
  }

  @Public()
  @Delete('permissions/:permissionId')
  deletePermission(@Param('permissionId', ParseIntPipe) permissionId: number) {
    return this.permissionsService.deletePermission(permissionId);
  }
}
