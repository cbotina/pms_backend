import { Test, TestingModule } from '@nestjs/testing';
import { SubjectGroupTimeSlotsService } from './subject-group-time-slots.service';

describe('SubjectGroupTimeSlotsService', () => {
  let service: SubjectGroupTimeSlotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectGroupTimeSlotsService],
    }).compile();

    service = module.get<SubjectGroupTimeSlotsService>(
      SubjectGroupTimeSlotsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
