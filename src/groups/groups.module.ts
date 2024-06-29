import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { GroupStudentsController } from './group-students/group-students.controller';
import { GroupStudentsService } from './group-students/group-students.service';
import { Student } from 'src/students/entities/student.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Teacher, Enrollment, Student, Group]),
    UsersModule,
  ],
  controllers: [GroupsController, GroupStudentsController],
  providers: [GroupsService, GroupStudentsService],
})
export class GroupsModule {}
