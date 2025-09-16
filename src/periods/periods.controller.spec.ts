import { Test, TestingModule } from '@nestjs/testing';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';
import { StudentIdGuard } from '@common/guards/student_id.guard';

describe('PeriodsController', () => {
  let controller: PeriodsController;
  let service: PeriodsService;

  const mockStudentEnrollments = [
    {
      enrollmentId: 1,
      subjectName: 'Mathematics',
      teacherName: 'John Doe',
      periodId: 1,
      studentId: 1,
    },
    {
      enrollmentId: 2,
      subjectName: 'Physics',
      teacherName: 'Jane Smith',
      periodId: 1,
      studentId: 1,
    },
  ];

  beforeEach(async () => {
    const mockPeriodsService = {
      getStudentEnrollmentsForPeriod: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodsController],
      providers: [
        {
          provide: PeriodsService,
          useValue: mockPeriodsService,
        },
      ],
    })
      .overrideGuard(StudentIdGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PeriodsController>(PeriodsController);
    service = module.get<PeriodsService>(PeriodsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getStudentEnrollmentsForPeriod', () => {
    it('should return student enrollments for a valid period and student', async () => {
      // Arrange
      const periodId = 1;
      const studentId = 1;
      jest.spyOn(service, 'getStudentEnrollmentsForPeriod').mockResolvedValue(mockStudentEnrollments);

      // Act
      const result = await controller.getStudentEnrollmentsForPeriod(periodId, studentId);

      // Assert
      expect(result).toEqual(mockStudentEnrollments);
      expect(service.getStudentEnrollmentsForPeriod).toHaveBeenCalledWith(periodId, studentId);
    });

    it('should call service with correct parameters', async () => {
      // Arrange
      const periodId = 2;
      const studentId = 3;
      jest.spyOn(service, 'getStudentEnrollmentsForPeriod').mockResolvedValue([]);

      // Act
      await controller.getStudentEnrollmentsForPeriod(periodId, studentId);

      // Assert
      expect(service.getStudentEnrollmentsForPeriod).toHaveBeenCalledWith(periodId, studentId);
    });

    it('should handle service errors', async () => {
      // Arrange
      const periodId = 999;
      const studentId = 1;
      const error = new Error('Period not found');
      jest.spyOn(service, 'getStudentEnrollmentsForPeriod').mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getStudentEnrollmentsForPeriod(periodId, studentId))
        .rejects
        .toThrow('Period not found');
    });
  });
});
