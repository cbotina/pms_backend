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

@Controller('')
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

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

  @Get('subject-groups/:subjectGroupId/absence-report')
  getSubjectGroupAbsenceReport(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.absencesService.getSubjectGroupAbsenceReport(subjectGroupId);
  }

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
