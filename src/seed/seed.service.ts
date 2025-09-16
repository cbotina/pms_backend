import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Period } from '../periods/entities/period.entity';
import { Group, Modality } from '../groups/entities/group.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { SubjectGroup } from '../subject-groups/entities/subject-group.entity';
import { Student, Gender } from '../students/entities/student.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Period)
    private periodRepository: Repository<Period>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
    @InjectRepository(SubjectGroup)
    private subjectGroupRepository: Repository<SubjectGroup>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
  ) {}

  async seedDatabase() {
    console.log('🌱 Starting database seeding...');

    try {
      // Clear existing data (in reverse order of dependencies)
      console.log('🧹 Clearing existing data...');
      await this.enrollmentRepository.delete({});
      await this.studentRepository.delete({});
      await this.subjectGroupRepository.delete({});
      await this.subjectRepository.delete({});
      await this.teacherRepository.delete({});
      await this.groupRepository.delete({});
      await this.periodRepository.delete({});

      // 1. Create Period
      console.log('📅 Creating period...');
      const period = this.periodRepository.create({
        name: 'Periodo Académico 2025-1',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-11-30'),
        active: true,
      });
      const savedPeriod = await this.periodRepository.save(period);
      console.log('✅ Period created:', savedPeriod.name);

      // 2. Create Teachers
      console.log('👨‍🏫 Creating teachers...');
      const teachers = [
        { cc: '1001', firstName: 'Ana', lastName: 'García', email: 'ana.garcia@university.edu' },
        { cc: '1002', firstName: 'Carlos', lastName: 'Rodríguez', email: 'carlos.rodriguez@university.edu' },
        { cc: '1003', firstName: 'María', lastName: 'López', email: 'maria.lopez@university.edu' },
        { cc: '1004', firstName: 'José', lastName: 'Martínez', email: 'jose.martinez@university.edu' },
        { cc: '1005', firstName: 'Laura', lastName: 'Fernández', email: 'laura.fernandez@university.edu' },
      ];

      const createdTeachers = [];
      for (const teacherData of teachers) {
        const teacher = this.teacherRepository.create(teacherData);
        const savedTeacher = await this.teacherRepository.save(teacher);
        createdTeachers.push(savedTeacher);
        console.log('✅ Teacher created:', `${savedTeacher.firstName} ${savedTeacher.lastName}`);
      }

      // 3. Create Group
      console.log('👥 Creating group...');
      const group = this.groupRepository.create({
        name: '12-01',
        semester: 'SEMESTRE I',
        modality: Modality.ACADEMIC,
        period: savedPeriod,
        tutor: createdTeachers[0], // Ana García as tutor
      });
      const savedGroup = await this.groupRepository.save(group);
      console.log('✅ Group created:', savedGroup.name, 'with tutor:', `${savedGroup.tutor.firstName} ${savedGroup.tutor.lastName}`);

      // 4. Create Subjects
      console.log('📚 Creating subjects...');
      const subjects = [
        { name: 'Matemáticas Básicas' },
        { name: 'Física I' },
        { name: 'Química General' },
        { name: 'Programación I' },
        { name: 'Inglés Técnico' },
      ];

      const createdSubjects = [];
      for (const subjectData of subjects) {
        const subject = this.subjectRepository.create(subjectData);
        const savedSubject = await this.subjectRepository.save(subject);
        createdSubjects.push(savedSubject);
        console.log('✅ Subject created:', savedSubject.name);
      }

      // 5. Create Subject Groups
      console.log('📖 Creating subject groups...');
      const subjectGroups = [
        { hours: 4, teacher: createdTeachers[0], subject: createdSubjects[0], group: savedGroup }, // Matemáticas - Ana García
        { hours: 3, teacher: createdTeachers[1], subject: createdSubjects[1], group: savedGroup }, // Física - Carlos Rodríguez
        { hours: 3, teacher: createdTeachers[2], subject: createdSubjects[2], group: savedGroup }, // Química - María López
        { hours: 4, teacher: createdTeachers[3], subject: createdSubjects[3], group: savedGroup }, // Programación - José Martínez
        { hours: 2, teacher: createdTeachers[4], subject: createdSubjects[4], group: savedGroup }, // Inglés - Laura Fernández
      ];

      const createdSubjectGroups = [];
      for (const sgData of subjectGroups) {
        const subjectGroup = this.subjectGroupRepository.create(sgData);
        const savedSubjectGroup = await this.subjectGroupRepository.save(subjectGroup);
        createdSubjectGroups.push(savedSubjectGroup);
        console.log('✅ Subject Group created:', `${savedSubjectGroup.subject.name} - ${savedSubjectGroup.teacher.firstName} ${savedSubjectGroup.teacher.lastName}`);
      }

      // 6. Create Students
      console.log('👨‍🎓 Creating students...');
      
      // First student - John Doe
      const student1 = this.studentRepository.create({
        cc: '123456',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@test.com',
        gender: Gender.MALE,
        group: savedGroup,
      });
      const savedStudent1 = await this.studentRepository.save(student1);
      console.log('✅ Student created:', `${savedStudent1.firstName} ${savedStudent1.lastName} (${savedStudent1.cc})`);

      // Second student - Jane Smith
      const student2 = this.studentRepository.create({
        cc: '789012',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@test.com',
        gender: Gender.FEMALE,
        group: savedGroup,
      });
      const savedStudent2 = await this.studentRepository.save(student2);
      console.log('✅ Student created:', `${savedStudent2.firstName} ${savedStudent2.lastName} (${savedStudent2.cc})`);

      // 7. Create Enrollments
      console.log('📝 Creating enrollments...');
      
      // John Doe's enrollments (3 subjects)
      const johnEnrollments = [
        { student: savedStudent1, subjectGroup: createdSubjectGroups[0] }, // Matemáticas
        { student: savedStudent1, subjectGroup: createdSubjectGroups[2] }, // Química
        { student: savedStudent1, subjectGroup: createdSubjectGroups[3] }, // Programación
      ];

      for (const enrollmentData of johnEnrollments) {
        const enrollment = this.enrollmentRepository.create(enrollmentData);
        await this.enrollmentRepository.save(enrollment);
        console.log('✅ Enrollment created:', `${enrollment.student.firstName} ${enrollment.student.lastName} -> ${enrollment.subjectGroup.subject.name}`);
      }

      // Jane Smith's enrollments (4 subjects - different from John)
      const janeEnrollments = [
        { student: savedStudent2, subjectGroup: createdSubjectGroups[0] }, // Matemáticas
        { student: savedStudent2, subjectGroup: createdSubjectGroups[1] }, // Física
        { student: savedStudent2, subjectGroup: createdSubjectGroups[3] }, // Programación
        { student: savedStudent2, subjectGroup: createdSubjectGroups[4] }, // Inglés
      ];

      for (const enrollmentData of janeEnrollments) {
        const enrollment = this.enrollmentRepository.create(enrollmentData);
        await this.enrollmentRepository.save(enrollment);
        console.log('✅ Enrollment created:', `${enrollment.student.firstName} ${enrollment.student.lastName} -> ${enrollment.subjectGroup.subject.name}`);
      }

      const allEnrollments = [...johnEnrollments, ...janeEnrollments];

      const summary = {
        period: savedPeriod.name,
        group: savedGroup.name,
        groupTutor: `${savedGroup.tutor.firstName} ${savedGroup.tutor.lastName}`,
        teachers: createdTeachers.map(t => `${t.firstName} ${t.lastName}`),
        subjects: createdSubjects.map(s => s.name),
        subjectGroups: createdSubjectGroups.map(sg => `${sg.subject.name} (${sg.teacher.firstName} ${sg.teacher.lastName})`),
        students: [
          `${savedStudent1.firstName} ${savedStudent1.lastName} (${savedStudent1.cc})`,
          `${savedStudent2.firstName} ${savedStudent2.lastName} (${savedStudent2.cc})`
        ],
        enrollments: {
          john: johnEnrollments.length,
          jane: janeEnrollments.length,
          total: allEnrollments.length
        },
        johnEnrollments: johnEnrollments.map(e => e.subjectGroup.subject.name),
        janeEnrollments: janeEnrollments.map(e => e.subjectGroup.subject.name),
      };

      console.log('🎉 Database seeding completed successfully!');
      console.log('\n📊 Summary:');
      console.log(`- 1 Period: ${summary.period}`);
      console.log(`- 1 Group: ${summary.group} (tutor: ${summary.groupTutor})`);
      console.log(`- 5 Teachers: ${summary.teachers.join(', ')}`);
      console.log(`- 5 Subjects: ${summary.subjects.join(', ')}`);
      console.log(`- 5 Subject Groups: ${summary.subjectGroups.join(', ')}`);
      console.log(`- 2 Students: ${summary.students.join(', ')}`);
      console.log(`- 7 Total Enrollments: John (${summary.enrollments.john} subjects), Jane (${summary.enrollments.jane} subjects)`);
      console.log(`  - John's subjects: ${summary.johnEnrollments.join(', ')}`);
      console.log(`  - Jane's subjects: ${summary.janeEnrollments.join(', ')}`);

      return {
        success: true,
        message: 'Database seeded successfully',
        data: summary,
      };

    } catch (error) {
      console.error('❌ Error during seeding:', error);
      throw error;
    }
  }
}
