import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { GeneratePracticeDto, SubmitPracticeDto } from './dto/generate-practice.dto';
import { PracticeService } from './practice.service';

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

@ApiTags('Practice')
@Role(Roles.STUDENT)
@Controller('student/practice')
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post('generate')
  generate(
    @Req() req: Request & { user: JwtUser },
    @Body() dto: GeneratePracticeDto,
  ) {
    return this.practiceService.generate(req.user, dto);
  }

  @Get('generation/:jobId')
  getGenerationStatus(
    @Req() req: Request & { user: JwtUser },
    @Param('jobId', ParseUUIDPipe) jobId: string,
  ) {
    return this.practiceService.getGenerationStatus(req.user, jobId);
  }

  @Get('history')
  history(
    @Req() req: Request & { user: JwtUser },
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('subjectGroupId') subjectGroupId?: string,
  ) {
    const sg =
      subjectGroupId != null && subjectGroupId !== ''
        ? parseInt(subjectGroupId, 10)
        : undefined;
    return this.practiceService.history(
      req.user,
      Number.isFinite(sg) ? sg : undefined,
      page,
      limit,
    );
  }

  @Get('tests/:testId/attempts/:attemptId')
  getAttempt(
    @Req() req: Request & { user: JwtUser },
    @Param('testId', ParseUUIDPipe) testId: string,
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
  ) {
    return this.practiceService.getAttempt(req.user, testId, attemptId);
  }

  @Get('tests/:testId')
  getTest(
    @Req() req: Request & { user: JwtUser },
    @Param('testId', ParseUUIDPipe) testId: string,
  ) {
    return this.practiceService.getTest(req.user, testId);
  }

  @Post('tests/:testId/submit')
  submit(
    @Req() req: Request & { user: JwtUser },
    @Param('testId', ParseUUIDPipe) testId: string,
    @Body() dto: SubmitPracticeDto,
  ) {
    return this.practiceService.submit(req.user, testId, dto);
  }
}
