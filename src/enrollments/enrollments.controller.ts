import { Controller, Param, Delete } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { Tags } from '../config/swagger/swagger.constants';

@ApiTags(Tags.ENROLLMENTS)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Role(Roles.SECRETARY)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(+id);
  }
}
