import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionWithStudentView } from './dto/permission-with-student.view';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, PermissionWithStudentView])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
