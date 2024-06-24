import { Test, TestingModule } from '@nestjs/testing';
import { SubjectGroupTimeSlotsController } from './subject-group-time-slots.controller';
import { SubjectGroupTimeSlotsService } from './subject-group-time-slots.service';

describe('SubjectGroupTimeSlotsController', () => {
  let controller: SubjectGroupTimeSlotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectGroupTimeSlotsController],
      providers: [SubjectGroupTimeSlotsService],
    }).compile();

    controller = module.get<SubjectGroupTimeSlotsController>(SubjectGroupTimeSlotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
