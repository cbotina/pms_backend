import { Test, TestingModule } from '@nestjs/testing';
import { SchdulesService } from './schedules.service';

describe('SchdulesService', () => {
  let service: SchdulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchdulesService],
    }).compile();

    service = module.get<SchdulesService>(SchdulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
