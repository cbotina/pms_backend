import { Test, TestingModule } from '@nestjs/testing';
import { PeriodTimeSlotsService } from './period-time-slots.service';

describe('PeriodTimeSlotsService', () => {
  let service: PeriodTimeSlotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeriodTimeSlotsService],
    }).compile();

    service = module.get<PeriodTimeSlotsService>(PeriodTimeSlotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
