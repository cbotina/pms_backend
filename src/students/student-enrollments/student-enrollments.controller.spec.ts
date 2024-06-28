import { Test, TestingModule } from '@nestjs/testing';
import { StudentEnrollmentsController } from './student-enrollments.controller';
import { StudentEnrollmentsService } from './student-enrollments.service';

describe('StudentEnrollmentsController', () => {
  let controller: StudentEnrollmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentEnrollmentsController],
      providers: [StudentEnrollmentsService],
    }).compile();

    controller = module.get<StudentEnrollmentsController>(StudentEnrollmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
