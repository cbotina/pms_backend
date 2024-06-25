import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Teacher } from 'src/teachers/entities/teacher.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, Teacher, Enrollment])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
