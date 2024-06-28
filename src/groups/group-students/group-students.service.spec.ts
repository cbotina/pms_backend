import { Test, TestingModule } from '@nestjs/testing';
import { GroupStudentsService } from './group-students.service';

describe('GroupStudentsService', () => {
  let service: GroupStudentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupStudentsService],
    }).compile();

    service = module.get<GroupStudentsService>(GroupStudentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
