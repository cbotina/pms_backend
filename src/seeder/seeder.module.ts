import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';

import { Period } from 'src/periods/entities/period.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Group } from 'src/groups/entities/group.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { Student } from 'src/students/entities/student.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Period,
      TimeSlot,
      Subject,
      Teacher,
      Group,
      SubjectGroup,
      SubjectGroupTimeSlot,
      Student,
      Enrollment,
      User,
    ]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
