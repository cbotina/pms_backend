import { Test, TestingModule } from '@nestjs/testing';
import { PeriodGroupsService } from './period-groups.service';

describe('PeriodGroupsService', () => {
  let service: PeriodGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeriodGroupsService],
    }).compile();

    service = module.get<PeriodGroupsService>(PeriodGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
