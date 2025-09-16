import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PermissionRequestsService } from './permission-requests.service';
import { PermissionRequestDto } from '../dto/permission-request.dto';
import { JustifyAbsencesRequestDto } from '../dto/justify-absences-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@common/decorators/roles.decorator';
import { Roles } from '@users/entities/user.entity';
import { Public } from '@common/decorators/public.decorator';
import { CreateLeavingPermissionDto } from '../dto/create-leaving-permission.dto';

@ApiTags('Permission Requests 🅿️🙋‍♂️')
@Controller()
export class PermissionRequestsController {
  constructor(
    private readonly permissionRequestsService: PermissionRequestsService,
  ) {}

  @Role(Roles.SECRETARY, Roles.STUDENT)
  @Post('students/:studentId/permissions')
  createPermissionRequest(
    @Body() permissionRequestDto: PermissionRequestDto,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.permissionRequestsService.createPermissionRequest(
      studentId,
      permissionRequestDto,
    );
  }
  @Public()
  // todo: remove public
  // @Role(Roles.SECRETARY)
  @Post('students/:studentId/leaving-permissions')
  createLeavingPermissionRequest(
    @Body() leavingPermissionRequestDto: CreateLeavingPermissionDto,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.permissionRequestsService.createLeavingPermissionRequest(
      studentId,
      leavingPermissionRequestDto,
    );
  }

  @Role(Roles.SECRETARY, Roles.STUDENT)
  @Post('students/:studentId/justify-absences')
  justifyStudentAbsences(
    @Body() justifyAbsencesDto: JustifyAbsencesRequestDto,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.permissionRequestsService.justifyStudentAbsences(
      studentId,
      justifyAbsencesDto,
    );
  }
}
