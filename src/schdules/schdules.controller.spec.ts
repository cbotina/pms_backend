import { Test, TestingModule } from '@nestjs/testing';
import { SchdulesController } from './schdules.controller';
import { SchdulesService } from './schdules.service';

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
