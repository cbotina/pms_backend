import { Module } from '@nestjs/common';
import { StudentEnrollmentsService } from './student-enrollments.service';
import { StudentEnrollmentsController } from './student-enrollments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/students/entities/student.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Enrollment, SubjectGroup])],
  controllers: [StudentEnrollmentsController],
  providers: [StudentEnrollmentsService],
})
export class StudentEnrollmentsModule {}
