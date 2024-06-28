import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PermissionRequestsService } from './permission-requests.service';
import { PermissionRequestDto } from '../dto/permission-request.dto';
import { JustifyAbsencesRequestDto } from '../dto/justify-absences-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Permission Requests 🅿️🙋‍♂️')
@Controller()
export class PermissionRequestsController {
  constructor(
    private readonly permissionRequestsService: PermissionRequestsService,
  ) {}

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
