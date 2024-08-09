import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AbsenceCountBySubjectView } from 'src/absences/entities/absence-count-by-subject.view';
import { AbsenceCountView } from 'src/absences/entities/absence-count.view';
import { Absence } from 'src/absences/entities/absence.entity';
import { AbsenceWithStudentView } from 'src/absences/entities/absence_with_student.view';
import { PermissionAbsenceDetailsView } from 'src/absences/entities/permission-absence-details.view';
import { SubjectGroupStudentAbsenceDetailsView } from 'src/absences/entities/student-absence-details.view';
import { UnjustifiedAbsenceDetailsView } from 'src/absences/entities/unjustified-absences.view';
import { DailyReportPermissionView } from 'src/daily-reports/dto/daily-reports-permission.view';
import { DailyReport } from 'src/daily-reports/entities/daily-report.entity';
import { TeacherDailyReportView } from 'src/daily-reports/entities/teacher-daily-reports.view';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Period } from 'src/periods/entities/period.entity';
import { PermissionWithStudentView } from 'src/permissions/dto/permission-with-student.view';
import { Permission } from 'src/permissions/entities/permission.entity';
import { StudentScheduleView } from 'src/schedules/entities/student-schedule.view';
import { TeacherScheduleView } from 'src/schedules/entities/teacher-schedule.view';
import { AbsencesByStudentView } from 'src/stats/entities/absences-by-student.view';
import { AbsencesByGroupView } from 'src/stats/entities/absences-per-group.view';
import { PermissionCountByReasonView } from 'src/stats/entities/permission-count-by-reason.view';
import { PermissionCountByStatusView } from 'src/stats/entities/permission-count-by-status.view';
import { SubjectsWithMostAbsencesView } from 'src/stats/entities/subject-with-most-absences.view';
import { Student } from 'src/students/entities/student.entity';
import { SubjectGroupTimeSlot } from 'src/subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroupStudentsView } from 'src/subject-groups/entities/subget-group-student.view';
import { SubjectGroup } from 'src/subject-groups/entities/subject-group.entity';
import { TeacherSubjectsView } from 'src/subject-groups/entities/teacher-subject-groups.view';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';
import { User } from 'src/users/entities/user.entity';

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
      Permission,
      Absence,
      DailyReport,
      TeacherSubjectsView,
      TeacherDailyReportView,
      SubjectGroupStudentsView,
      PermissionAbsenceDetailsView,
      UnjustifiedAbsenceDetailsView,
      AbsenceCountView,
      SubjectGroupStudentAbsenceDetailsView,
      PermissionWithStudentView,
      AbsencesByGroupView,
      PermissionCountByReasonView,
      AbsencesByStudentView,
      PermissionCountByReasonView,
      PermissionCountByStatusView,
      SubjectsWithMostAbsencesView,
      DailyReportPermissionView,
      User,
      AbsenceCountBySubjectView,
      AbsenceWithStudentView,
    ],
    synchronize: configService.get('database.synchronize'),
  };
};
