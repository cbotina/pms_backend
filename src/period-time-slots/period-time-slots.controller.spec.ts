import { Test, TestingModule } from '@nestjs/testing';
import { PeriodTimeSlotsController } from './period-time-slots.controller';
import { PeriodTimeSlotsService } from './period-time-slots.service';

describe('PeriodTimeSlotsController', () => {
  let controller: PeriodTimeSlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodTimeSlotsController],
      providers: [PeriodTimeSlotsService],
    }).compile();

    controller = module.get<PeriodTimeSlotsController>(PeriodTimeSlotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
