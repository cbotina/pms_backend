import { Test, TestingModule } from '@nestjs/testing';
import { GroupStudentsController } from './group-students.controller';
import { GroupStudentsService } from './group-students.service';

describe('GroupStudentsController', () => {
  let controller: GroupStudentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupStudentsController],
      providers: [GroupStudentsService],
    }).compile();

    controller = module.get<GroupStudentsController>(GroupStudentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
