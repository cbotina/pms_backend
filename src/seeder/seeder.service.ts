import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
import { Roles } from 'src/users/entities/user.entity';

import { periodsData } from './data/periods.data';
import { timeSlotsData } from './data/time-slots.data';
import { subjectsData } from './data/subjects.data';
import { teachersData } from './data/teachers.data';
import { groupsData } from './data/groups.data';
import { studentsData } from './data/students.data';
import { subjectGroupsData } from './data/subject-groups.data';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Period) private periodRepo: Repository<Period>,
    @InjectRepository(TimeSlot) private timeSlotRepo: Repository<TimeSlot>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(SubjectGroup) private subjectGroupRepo: Repository<SubjectGroup>,
    @InjectRepository(SubjectGroupTimeSlot) private sgtsRepo: Repository<SubjectGroupTimeSlot>,
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Enrollment) private enrollmentRepo: Repository<Enrollment>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    if (this.configService.get('SEED_ON_START') === 'true') {
      await this.seed();
    }
  }

  async seed() {
    const nodeEnv = this.configService.get('NODE_ENV');
    
    // Allow seeding in development and staging environments
    // Block seeding in production
    const allowedEnvironments = ['development', 'dev', 'staging', 'stage'];
    const isProduction = nodeEnv === 'production' || nodeEnv === 'prod';
    
    if (isProduction) {
      this.logger.warn(
        `Seeder is disabled in production (NODE_ENV=${nodeEnv}). ` +
        `Allowed environments: ${allowedEnvironments.join(', ')}`
      );
      return;
    }

    const existingPeriods = await this.periodRepo.count();
    if (existingPeriods > 0) {
      this.logger.log('Database already has data — skipping seed.');
      return;
    }

    this.logger.log('Seeding database...');

    const periods = await this.seedPeriods();
    const activePeriod = periods.find((p) => p.active);
    const timeSlots = await this.seedTimeSlots(activePeriod);
    const subjects = await this.seedSubjects();
    const teachers = await this.seedTeachers();
    const groups = await this.seedGroups(activePeriod, teachers);
    const subjectGroups = await this.seedSubjectGroups(teachers, subjects, groups, timeSlots);
    const students = await this.seedStudents(groups);
    await this.seedEnrollments(students, subjectGroups, groups);
    await this.seedUsers(teachers, students);

    this.logger.log('Database seeded successfully.');
  }

  private async seedPeriods(): Promise<Period[]> {
    const periods = periodsData.map((p) =>
      this.periodRepo.create({
        ...p,
        startDate: new Date(p.startDate),
        endDate: new Date(p.endDate),
      }),
    );
    return this.periodRepo.save(periods);
  }

  private async seedTimeSlots(period: Period): Promise<TimeSlot[]> {
    const slots = timeSlotsData.map((ts) =>
      this.timeSlotRepo.create({ ...ts, period }),
    );
    return this.timeSlotRepo.save(slots);
  }

  private async seedSubjects(): Promise<Subject[]> {
    const subjects = subjectsData.map((s) => this.subjectRepo.create(s));
    return this.subjectRepo.save(subjects);
  }

  private async seedTeachers(): Promise<Teacher[]> {
    const teachers = teachersData.map((t) => this.teacherRepo.create(t));
    return this.teacherRepo.save(teachers);
  }

  private async seedGroups(period: Period, teachers: Teacher[]): Promise<Group[]> {
    const groups = groupsData.map((g) =>
      this.groupRepo.create({
        name: g.name,
        semester: g.semester,
        modality: g.modality,
        period,
        tutor: teachers[g.tutorIndex],
      }),
    );
    return this.groupRepo.save(groups);
  }

  private async seedSubjectGroups(
    teachers: Teacher[],
    subjects: Subject[],
    groups: Group[],
    timeSlots: TimeSlot[],
  ): Promise<SubjectGroup[]> {
    const savedSubjectGroups: SubjectGroup[] = [];

    for (const sgData of subjectGroupsData) {
      const sg = this.subjectGroupRepo.create({
        hours: sgData.hours,
        teacher: teachers[sgData.teacherIndex],
        subject: subjects[sgData.subjectIndex],
        group: groups[sgData.groupIndex],
      });
      const savedSg = await this.subjectGroupRepo.save(sg);

      for (const slot of sgData.schedule) {
        const sgts = this.sgtsRepo.create({
          subjectGroup: savedSg,
          timeSlot: timeSlots[slot.timeSlotIndex],
          day: slot.day,
        });
        await this.sgtsRepo.save(sgts);
      }

      savedSubjectGroups.push(savedSg);
    }

    return savedSubjectGroups;
  }

  private async seedStudents(groups: Group[]): Promise<Student[]> {
    const students = studentsData.map((s) =>
      this.studentRepo.create({
        cc: s.cc,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        gender: s.gender,
        group: groups[s.groupIndex],
      }),
    );
    return this.studentRepo.save(students);
  }

  private async seedEnrollments(
    students: Student[],
    subjectGroups: SubjectGroup[],
    groups: Group[],
  ): Promise<void> {
    const enrollments: Enrollment[] = [];

    for (const student of students) {
      const studentGroupId = groups.findIndex((g) => g.id === student.group.id);
      const groupSubjectGroups = subjectGroups.filter(
        (sg) => sg.group.id === groups[studentGroupId]?.id,
      );

      for (const sg of groupSubjectGroups) {
        enrollments.push(this.enrollmentRepo.create({ student, subjectGroup: sg }));
      }
    }

    await this.enrollmentRepo.save(enrollments);
  }

  private async seedUsers(teachers: Teacher[], students: Student[]): Promise<void> {
    const defaultPassword = await bcrypt.hash('Password123!', 10);

    const adminUser = this.userRepo.create({
      email: this.configService.get('ADMIN_EMAIL') || 'admin@pms.edu.co',
      password: await bcrypt.hash(
        this.configService.get('ADMIN_PASSWORD') || 'Admin1234!',
        10,
      ),
      role: Roles.ADMIN,
    });

    const teacherUsers = teachers.map((t) =>
      this.userRepo.create({
        email: t.email,
        password: defaultPassword,
        entityId: t.id,
        role: Roles.TEACHER,
      }),
    );

    const studentUsers = students.map((s) =>
      this.userRepo.create({
        email: s.email,
        password: defaultPassword,
        entityId: s.id,
        role: Roles.STUDENT,
      }),
    );

    await this.userRepo.save([adminUser, ...teacherUsers, ...studentUsers]);
  }
}
