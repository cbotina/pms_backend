import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AbsenceCountBySubjectView } from '@absences/entities/absence-count-by-subject.view';
import { AbsenceCountView } from '@absences/entities/absence-count.view';
import { Absence } from '@absences/entities/absence.entity';
import { AbsenceWithStudentView } from '@absences/entities/absence_with_student.view';
import { PermissionAbsenceDetailsView } from '@absences/entities/permission-absence-details.view';
import { SubjectGroupStudentAbsenceDetailsView } from '@absences/entities/student-absence-details.view';
import { UnjustifiedAbsenceDetailsView } from '@absences/entities/unjustified-absences.view';
import { DailyReportPermissionView } from '@daily-reports/dto/daily-reports-permission.view';
import { DailyReport } from '@daily-reports/entities/daily-report.entity';
import { TeacherDailyReportView } from '@daily-reports/entities/teacher-daily-reports.view';
import { Enrollment } from '@enrollments/entities/enrollment.entity';
import { Group } from '@groups/entities/group.entity';
import { Period } from '@periods/entities/period.entity';
import { StudentEnrollmentView } from '@periods/entities/student-enrollment.view';
import { PermissionWithStudentView } from '@permissions/dto/permission-with-student.view';
import { Permission } from '@permissions/entities/permission.entity';
import { StudentScheduleView } from '@schedules/entities/student-schedule.view';
import { TeacherScheduleView } from '@schedules/entities/teacher-schedule.view';
import { AbsencesByStudentView } from '@stats/entities/absences-by-student.view';
import { AbsencesByGroupView } from '@stats/entities/absences-per-group.view';
import { PermissionCountByReasonView } from '@stats/entities/permission-count-by-reason.view';
import { PermissionCountByStatusView } from '@stats/entities/permission-count-by-status.view';
import { SubjectsWithMostAbsencesView } from '@stats/entities/subject-with-most-absences.view';
import { Student } from '@students/entities/student.entity';
import { SubjectGroupTimeSlot } from '@subject-group-time-slots/entities/subject-group-time-slot.entity';
import { SubjectGroupStudentsView } from '@subject-groups/entities/subget-group-student.view';
import { SubjectGroup } from '@subject-groups/entities/subject-group.entity';
import { TeacherSubjectsView } from '@subject-groups/entities/teacher-subject-groups.view';
import { Subject } from '@subjects/entities/subject.entity';
import { Teacher } from '@teachers/entities/teacher.entity';
import { TimeSlot } from '@time-slots/entities/time-slot.entity';
import { User } from '@users/entities/user.entity';

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
      StudentEnrollmentView,
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
