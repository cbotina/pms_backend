import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Period } from '../periods/entities/period.entity';
import { Group } from '../groups/entities/group.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { SubjectGroup } from '../subject-groups/entities/subject-group.entity';
import { Student } from '../students/entities/student.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Period,
      Group,
      Teacher,
      Subject,
      SubjectGroup,
      Student,
      Enrollment,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
