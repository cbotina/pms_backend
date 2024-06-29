import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { mailConfig } from 'src/config/mail/mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mailConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
