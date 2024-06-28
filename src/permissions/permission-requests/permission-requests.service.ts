import { Injectable } from '@nestjs/common';
import { PermissionRequestDto } from '../dto/permission-request.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Student } from 'src/students/entities/student.entity';
import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { Absence } from 'src/absences/entities/absence.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { JustifyAbsencesRequestDto } from '../dto/justify-absences-request.dto';

@Injectable()
export class PermissionRequestsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,

    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,

    @InjectRepository(DailyReport)
    private readonly dailyReportsRepository: Repository<DailyReport>,

    @InjectRepository(Absence)
    private readonly absencesRepository: Repository<Absence>,

    @InjectRepository(SubjectGroupTimeSlot)
    private readonly sgtsRepository: Repository<SubjectGroupTimeSlot>,
  ) {}

  async createPermissionRequest(
    studentId: number,
    permissionRequestDto: PermissionRequestDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const student = await this.studentsRepository.findOneByOrFail({
        id: studentId,
      });

      const { absenceTimeSlots, evidenceUrl, reason, studentNote } =
        permissionRequestDto;

      const permission = await this.permissionsRepository.save({
        student,
        requestDate: new Date(),
        studentNote,
        reason,
        evidenceUrl,
      });

      absenceTimeSlots.forEach(async (e) => {
        const subjectGroupTimeSlot = await this.sgtsRepository.findOneByOrFail({
          id: e.subjectGroupTimeSlotId,
        });

        let dailyReport = await this.dailyReportsRepository.findOne({
          where: {
            reportDate: e.absenceDate,
            subjectGroupTimeSlot: subjectGroupTimeSlot,
          },
        });

        if (!dailyReport) {
          dailyReport = await this.dailyReportsRepository.save({
            reportDate: e.absenceDate,
            subjectGroupTimeSlot: subjectGroupTimeSlot,
            absences: [],
          });
        }

        await this.absencesRepository.save({
          dailyReport,
          permission,
          student,
        });
      });

      await queryRunner.commitTransaction();

      return {
        message: 'Permission request created successfully',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async justifyStudentAbsences(
    studentId: number,
    justifyAbsencesDto: JustifyAbsencesRequestDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const student = await this.studentsRepository.findOneByOrFail({
        id: studentId,
      });

      const { unjustifiedAbsencesIds, evidenceUrl, reason, studentNote } =
        justifyAbsencesDto;

      const permission = this.permissionsRepository.create({
        student,
        requestDate: new Date(),
        studentNote,
        reason,
        evidenceUrl,
      });

      const absences: Absence[] = [];

      for (let i = 0; i < unjustifiedAbsencesIds.length; i++) {
        const absence = await this.absencesRepository.findOneByOrFail({
          id: unjustifiedAbsencesIds[i],
          student,
        });

        absences.push(absence);
      }

      permission.absences = absences;

      await queryRunner.manager.save(permission);

      await queryRunner.commitTransaction();

      return {
        message: 'Permission request created successfully',
      };
    } catch (err) {
      console.log('Error!!!');
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
