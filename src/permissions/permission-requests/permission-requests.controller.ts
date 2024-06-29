import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PermissionRequestsService } from './permission-requests.service';
import { PermissionRequestDto } from '../dto/permission-request.dto';
import { JustifyAbsencesRequestDto } from '../dto/justify-absences-request.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';

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
