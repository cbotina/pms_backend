import { Controller, Param, Delete } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Enrollments 🧑📚')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
}
