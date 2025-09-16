import { Controller, Put, HttpException, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Put()
  async seedDatabase() {
    // Only allow seeding in development environment
    if (process.env.NODE_ENV !== 'dev') {
      throw new HttpException(
        'Seeding is only allowed in development environment',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const result = await this.seedService.seedDatabase();
      return result;
    } catch (error) {
      throw new HttpException(
        `Seeding failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
