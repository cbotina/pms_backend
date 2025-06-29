import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  Delete,
} from '@nestjs/common';
import { AbsencesService } from './absences.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { Tags } from '../config/swagger/swagger.config';
import {
  GetStudentPermissionAbsencesDocs,
  GetPermissionAbsencesDocs,
  GetStudentUnjustifiedAbsencesDocs,
  GetJustificableAbsencesDocs,
  GetSubjectGroupAbsenceReportDocs,
  GetSubjectGroupStudentAbsencesDocs,
  GetStudentAbsencesCountBySubjectDocs,
  GetPeriodAbsencesDocs,
  DeleteAbsenceDocs,
} from './absences.controller.docs';

// TODO: Check if we can remove the @Public decorator from all endpoints
@ApiTags(Tags.ABSENCES)
@Controller('absences')
export class AbsencesController {
  constructor(private readonly absencesService: AbsencesService) {}

  @Role(Roles.STUDENT, Roles.TEACHER, Roles.SECRETARY)
  @Get('students/:studentId/permissions/:permissionId/absences')
  @GetStudentPermissionAbsencesDocs()
  getStudentPermissionAbsences(
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

  @Role(Roles.SECRETARY)
  @Get('permissions/:permissionId/absences')
  @GetPermissionAbsencesDocs()
  getPermissionAbsences(
    @Param('permissionId', ParseIntPipe) permissionId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.absencesService.getPermissionAbsences(permissionId, options);
  }

  @Role(Roles.STUDENT, Roles.TEACHER, Roles.SECRETARY)
  @Get('periods/:periodId/students/:studentId/absences/unjustified')
  @GetStudentUnjustifiedAbsencesDocs()
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
  @GetJustificableAbsencesDocs()
  getJustificableAbsences(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.absencesService.getJustificableAbsences(periodId, studentId);
  }

  // @Public()
  @Role(Roles.TEACHER)
  @Get('subject-groups/:subjectGroupId/absence-report')
  @GetSubjectGroupAbsenceReportDocs()
  getSubjectGroupAbsenceReport(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.absencesService.getSubjectGroupAbsenceReport(subjectGroupId);
  }

  // @Public()
  @Role(Roles.TEACHER)
  @Get('subject-groups/:subjectGroupId/students/:studentId/absences')
  @GetSubjectGroupStudentAbsencesDocs()
  getSubjectGroupStudentAbsences(
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.absencesService.getSubjectGroupStudentAbsences(
      subjectGroupId,
      studentId,
    );
  }

  @Public()
  @Get('periods/:periodId/students/:studentId/absence-count-by-subject')
  @GetStudentAbsencesCountBySubjectDocs()
  getStudentAbsencesCountBySubject(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.absencesService.getStudentAbsencesCountBySubject(
      periodId,
      studentId,
    );
  }

  @Public()
  @Get('periods/:periodId/absences')
  @GetPeriodAbsencesDocs()
  getPeriodAbsences(
    @Param('periodId', ParseIntPipe) periodId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
    @Query('search') search?: string,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.absencesService.getPeriodAbsences(periodId, options, search);
  }

  @Public()
  @Delete('absences/:absenceId')
  @DeleteAbsenceDocs()
  deleteAbsence(@Param('absenceId', ParseIntPipe) absenceId: number) {
    return this.absencesService.deleteAbsence(absenceId);
  }
}
