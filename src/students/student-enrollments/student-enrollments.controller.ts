import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { StudentEnrollmentsService } from './student-enrollments.service';
import { CreateEnrollmentDto } from 'src/enrollments/dto/create-enrollment.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';

@Role(Roles.SECRETARY)
@ApiTags('Student enrollments 👦📚')
@Controller('students/:studentId/enrollments')
export class StudentEnrollmentsController {
  constructor(
    private readonly studentEnrollmentsService: StudentEnrollmentsService,
  ) {}

  @Post()
  addEnrollmentToStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    return this.studentEnrollmentsService.addEnrollmentToStudent(
      studentId,
      createEnrollmentDto,
    );
  }

  @Get()
  getStudentEnrollments(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 1,
  ) {
    const options: IPaginationOptions = {
      limit,
      page,
    };

    return this.studentEnrollmentsService.getStudentEnrollments(
      studentId,
      options,
    );
  }
}
