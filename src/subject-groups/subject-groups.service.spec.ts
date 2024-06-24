import { Test, TestingModule } from '@nestjs/testing';
import { SubjectGroupsService } from './subject-groups.service';

describe('SubjectGroupsService', () => {
  let service: SubjectGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectGroupsService],
    }).compile();

    service = module.get<SubjectGroupsService>(SubjectGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
