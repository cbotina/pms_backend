import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';

@ApiTags('Absences 🚨')
@Controller()
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  @Role(Roles.STUDENT, Roles.TEACHER, Roles.SECRETARY)
  @Get('students/:studentId/permissions/:permissionId/absences')
  getPermissionsAbsences(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.absencesService.getStudentPermissionAbsences(
      studentId,
      permissionId,
      options,
    );
  }

  @Role(Roles.STUDENT, Roles.TEACHER, Roles.SECRETARY)
  @Get('periods/:periodId/students/:studentId/absences/unjustified')
  getStudentUnjustifiedAbsences(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.absencesService.getStudentUnjustifiedAbsences(
      periodId,
      studentId,
      options,
    );
  }

  @Role(Roles.STUDENT, Roles.TEACHER, Roles.SECRETARY)
  @Get('periods/:periodId/students/:studentId/absences/justificable')
  getJustificableAbsences(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.absencesService.getJustificableAbsences(periodId, studentId);
  }

  @Role(Roles.TEACHER)
  @Get('subject-groups/:subjectGroupId/absence-report')
  getSubjectGroupAbsenceReport(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.absencesService.getSubjectGroupAbsenceReport(subjectGroupId);
  }

  @Role(Roles.TEACHER)
  @Get('subject-groups/:subjectGroupId/students/:studentId/absences')
  getSubjectGroupStudentAbsences(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.absencesService.getSubjectGroupStudentAbsences(
      subjectGroupId,
      studentId,
    );
  }
}
