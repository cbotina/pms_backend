import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-email')
  sendEmail(@Body() dto: { email: string; message: string }) {
    const { email, message } = dto;
    return this.mailService.sendMessage(message, email);
  }
}
