import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMessage(message: string, email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Hello`,
      template: './message',
      context: {
        message,
      },
    });

    return { message: 'Email sent successfully' };
  }

  async sendWelcomeMessage(user: User) {}
}
