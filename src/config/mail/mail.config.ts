import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

export const mailConfig = (configService: ConfigService): MailerOptions => {
  const config = configService.get('email');
  return {
    transport: {
      host: config.host,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    },
    defaults: {
      from: '"SGP <noreply@example.com>',
    },
    template: {
      dir: join(__dirname, '../../mail/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };
};
