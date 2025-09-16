import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Group } from '@groups/entities/group.entity';
import { Enrollment } from '@enrollments/entities/enrollment.entity';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Group, Enrollment, SubjectGroup]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
