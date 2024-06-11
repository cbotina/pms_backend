import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Period } from 'src/periods/entities/period.entity';
import { TimeSlot } from 'src/time-slots/entities/time-slot.entity';

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
    entities: [Period, TimeSlot],
    synchronize: configService.get('database.synchronize'),
  };
};
