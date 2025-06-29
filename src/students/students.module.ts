import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { StudentEnrollmentsController } from './student-enrollments/student-enrollments.controller';
import { StudentEnrollmentsService } from './student-enrollments/student-enrollments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Group, Enrollment, SubjectGroup]),
  ],
  controllers: [StudentsController, StudentEnrollmentsController],
  providers: [StudentsService, StudentEnrollmentsService],
})
export class StudentsModule {}
