import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

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
}
