import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { HealthCheckDocs } from './health.controller.docs';
import { Tags } from '../../config/swagger/swagger.constants';

@ApiTags(Tags.HEALTH)
@Controller('health')
export class HealthController {
  @Get()
  @Public()
  @HealthCheckDocs()
  check() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
