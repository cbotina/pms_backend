import { Controller, Param, Delete } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '@common/decorators/roles.decorator';
import { Roles } from '@users/entities/user.entity';
@ApiTags('Enrollments 🧑📚')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Role(Roles.SECRETARY)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
}
