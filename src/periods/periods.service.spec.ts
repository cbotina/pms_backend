import { Test, TestingModule } from '@nestjs/testing';
import { PeriodsService } from './periods.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Period } from './entities/period.entity';
import { StudentEnrollmentView } from './entities/student-enrollment.view';
import { NotFoundException } from '@nestjs/common';

describe('PeriodsService', () => {
  let service: PeriodsService;
  let periodsRepository: any;
  let studentEnrollmentViewRepository: any;

  const mockPeriod = {
    id: 1,
    name: '2024-1',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    active: true,
  };

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
    const mockPeriodsRepository = {
      findOneBy: jest.fn(),
    };

    const mockStudentEnrollmentViewRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodsService,
        {
          provide: getRepositoryToken(Period),
          useValue: mockPeriodsRepository,
        },
        {
          provide: getRepositoryToken(StudentEnrollmentView),
          useValue: mockStudentEnrollmentViewRepository,
        },
      ],
    }).compile();

    service = module.get<PeriodsService>(PeriodsService);
    periodsRepository = module.get(getRepositoryToken(Period));
    studentEnrollmentViewRepository = module.get(getRepositoryToken(StudentEnrollmentView));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStudentEnrollmentsForPeriod', () => {
    it('should return student enrollments for a valid period', async () => {
      // Arrange
      const periodId = 1;
      const studentId = 1;
      periodsRepository.findOneBy.mockResolvedValue(mockPeriod);
      studentEnrollmentViewRepository.find.mockResolvedValue(mockStudentEnrollments);

      // Act
      const result = await service.getStudentEnrollmentsForPeriod(periodId, studentId);

      // Assert
      expect(result).toEqual(mockStudentEnrollments);
      expect(periodsRepository.findOneBy).toHaveBeenCalledWith({ id: periodId });
      expect(studentEnrollmentViewRepository.find).toHaveBeenCalledWith({
        where: { periodId, studentId },
      });
    });

    it('should throw NotFoundException when period does not exist', async () => {
      // Arrange
      const periodId = 999;
      const studentId = 1;
      periodsRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getStudentEnrollmentsForPeriod(periodId, studentId))
        .rejects
        .toThrow(NotFoundException);
      expect(periodsRepository.findOneBy).toHaveBeenCalledWith({ id: periodId });
      expect(studentEnrollmentViewRepository.find).not.toHaveBeenCalled();
    });

    it('should return empty array when no enrollments found', async () => {
      // Arrange
      const periodId = 1;
      const studentId = 1;
      periodsRepository.findOneBy.mockResolvedValue(mockPeriod);
      studentEnrollmentViewRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getStudentEnrollmentsForPeriod(periodId, studentId);

      // Assert
      expect(result).toEqual([]);
      expect(periodsRepository.findOneBy).toHaveBeenCalledWith({ id: periodId });
      expect(studentEnrollmentViewRepository.find).toHaveBeenCalledWith({
        where: { periodId, studentId },
      });
    });
  });
});
