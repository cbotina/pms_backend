import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { SubmitSusDto } from './dto/submit-sus.dto';
import { SusService } from './sus.service';

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

@ApiTags('SUS')
@Role(Roles.STUDENT)
@Controller('student/sus')
export class StudentSusController {
  constructor(private readonly susService: SusService) {}

  @Get('status')
  getStatus(@Req() req: Request & { user: JwtUser }) {
    return this.susService.getStatus(req.user);
  }

  @Post()
  submit(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: SubmitSusDto,
  ) {
    return this.susService.submit(req.user, dto);
  }
}

@ApiTags('SUS')
@Role(Roles.ADMIN)
@Controller('admin/sus')
export class AdminSusController {
  constructor(private readonly susService: SusService) {}

  @Get('results')
  getResults() {
    return this.susService.getResults();
  }

  @Get('responses')
  getResponses() {
    return this.susService.getResponses();
  }
}
