import { Module } from '@nestjs/common';
import { PeriodGroupsService } from './period-groups.service';
import { PeriodGroupsController } from './period-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Period } from 'src/periods/entities/period.entity';
import { Group } from 'src/groups/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Period, Group])],
  controllers: [PeriodGroupsController],
  providers: [PeriodGroupsService],
})
export class PeriodGroupsModule {}
