import { Test, TestingModule } from '@nestjs/testing';
import { SubjectGroupsController } from './subject-groups.controller';
import { SubjectGroupsService } from './subject-groups.service';

describe('SubjectGroupsController', () => {
  let controller: SubjectGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectGroupsController],
      providers: [SubjectGroupsService],
    }).compile();

    controller = module.get<SubjectGroupsController>(SubjectGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
