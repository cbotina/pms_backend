import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/users/entities/user.entity';
import { ClusteringService } from './clustering.service';

type JwtUser = {
  id: number;
  role: string;
  entityId?: number | null;
  userId: number;
};

@ApiTags('Clustering')
@Role(Roles.TEACHER)
@Controller('teacher/subject-groups/:subjectGroupId/clustering')
export class ClusteringController {
  constructor(private readonly clusteringService: ClusteringService) {}

  @Get()
  getInsights(
    @Req() req: Request & { user: JwtUser },
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.clusteringService.getInsights(req.user, subjectGroupId);
  }

  @Post('recompute')
  recompute(
    @Req() req: Request & { user: JwtUser },
    @Param('subjectGroupId', ParseIntPipe) subjectGroupId: number,
  ) {
    return this.clusteringService.recompute(req.user, subjectGroupId);
  }
}
