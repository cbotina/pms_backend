import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './entities/subject.entity';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}
