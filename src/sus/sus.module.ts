import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SusResponse } from './entities/sus-response.entity';
import { AdminSusController, StudentSusController } from './sus.controller';
import { SusService } from './sus.service';

@Module({
  imports: [TypeOrmModule.forFeature([SusResponse])],
  controllers: [StudentSusController, AdminSusController],
  providers: [SusService],
})
export class SusModule {}
