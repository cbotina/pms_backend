import { Module } from '@nestjs/common';
import { SubjectGroupsService } from './subject-groups.service';
import { SubjectGroupsController } from './subject-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectGroup } from './entities/subject-group.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Subject } from 'src/subjects/entities/subject.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { TeacherSubjectsView } from './entities/teacher-subject-groups.view';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      Subject,
      Teacher,
      SubjectGroup,
      TeacherSubjectsView,
    ]),
  ],
  controllers: [SubjectGroupsController],
  providers: [SubjectGroupsService],
})
export class SubjectGroupsModule {}
