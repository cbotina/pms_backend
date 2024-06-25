import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Period } from 'src/periods/entities/period.entity';
import { StudentScheduleView } from 'src/schdules/entities/student-schedule.view';
import { TeacherScheduleView } from 'src/schdules/entities/teacher-schedule.view';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';

export const dbConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get('database.host'),
    port: +configService.get('database.port'),
    username: configService.get('database.username'),
    password: configService.get('database.password'),
    database: configService.get('database.database'),
    entities: [
      Period,
      TimeSlot,
      Subject,
      Teacher,
      Group,
      SubjectGroup,
      SubjectGroupTimeSlot,
      Student,
      Enrollment,
      StudentScheduleView,
      TeacherScheduleView,
    ],
    synchronize: configService.get('database.synchronize'),
  };
};
