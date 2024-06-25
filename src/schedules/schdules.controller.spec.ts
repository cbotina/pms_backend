import { Test, TestingModule } from '@nestjs/testing';
import { SchdulesController } from './schedules.controller';
import { SchdulesService } from './schedules.service';

describe('SchdulesController', () => {
  let controller: SchdulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchdulesController],
      providers: [SchdulesService],
    }).compile();

    controller = module.get<SchdulesController>(SchdulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
