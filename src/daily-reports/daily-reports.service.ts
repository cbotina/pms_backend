import { Injectable } from '@nestjs/common';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyReport } from './entities/daily-report.entity';
import { DataSource, Repository } from 'typeorm';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { Absence } from 'src/absences/entities/absence.entity';
import { Student } from 'src/students/entities/student.entity';
import { TeacherDailyReportView } from './entities/teacher-daily-reports.view';

@Injectable()
export class DailyReportsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(DailyReport)
    private readonly dailyReportsRepository: Repository<DailyReport>,
    @InjectRepository(SubjectGroupTimeSlot)
    private readonly sgtsRepository: Repository<SubjectGroupTimeSlot>,
    @InjectRepository(Absence)
    private readonly absencesRepository: Repository<Absence>,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
    @InjectRepository(TeacherDailyReportView)
    private readonly teacherDailyReportsRepository: Repository<TeacherDailyReportView>,
  ) {}

  async create(createDailyReportDto: CreateDailyReportDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        subjectGroupTimeSlotId,
        reportDate,
        isSubmitted,
        studentsAbsences,
      } = createDailyReportDto;

      const subjectGroupTimeSlot = await this.sgtsRepository.findOneByOrFail({
        id: subjectGroupTimeSlotId,
      });

      let dailyReport = await this.dailyReportsRepository
        .createQueryBuilder('dr')
        .where('dr.reportDate LIKE :reportDate', {
          reportDate: `${reportDate}%`,
        })
        .andWhere('dr.subjectGroupTimeSlotId = :subjectGroupTimeSlotId', {
          subjectGroupTimeSlotId,
        })
        .getOne();

      if (!dailyReport) {
        dailyReport = await this.dailyReportsRepository.save({
          subjectGroupTimeSlot,
          reportDate,
        });
      }

      for (let i = 0; i < studentsAbsences.length; i++) {
        const e = studentsAbsences[i];

        const student = await this.studentsRepository.findOneByOrFail({
          id: e.studentId,
        });

        await this.absencesRepository.save({
          student,
          teacherNote: e.teacherComment,
          dailyReport,
        });
      }

      // studentsAbsences.forEach(async (e) => {
      //   const student = await this.studentsRepository.findOneByOrFail({
      //     id: e.studentId,
      //   });

      //   await this.absencesRepository.save({
      //     student,
      //     teacherNote: e.teacherComment,
      //     dailyReport,
      //   });
      // });

      dailyReport.isSubmitted = isSubmitted;

      await this.dailyReportsRepository.save(dailyReport);
      // await queryRunner.manager.save<DailyReport>(dailyReport);

      await queryRunner.commitTransaction();

      return {
        message: 'Daily report created successfully',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.dailyReportsRepository.find();
  }

  getTeacherDailyReports(periodId: number, teacherId: number, date: string) {
    return (
      this.teacherDailyReportsRepository
        .createQueryBuilder('tdr')
        .where('tdr.periodId = :periodId', { periodId })
        // .andWhere('tdr.teacherId = :teacherId', { teacherId })
        .andWhere('tdr.reportDate like :date', { date: `${date}%` })
        .getMany()
    );
  }
}
