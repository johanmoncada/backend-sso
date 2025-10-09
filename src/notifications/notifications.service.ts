import { Injectable } from '@nestjs/common';
import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';
import { WhatsappService } from './channels/whatsapp.service';
import { TelegramService } from './channels/telegram.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly whatsappService: WhatsappService,
    private readonly telegramService: TelegramService,
  ) {}

  async sendNotification(
    channel: string,
    to: string,
    subject: string | undefined,
    message: string,
  ) {
    switch (channel) {
      case 'email':
        return this.emailService.sendEmail(to, subject ?? '', message);
      case 'sms':
        return this.smsService.sendSms(to, message);
      case 'whatsapp':
        return this.whatsappService.sendWhatsapp(to, message);
      case 'telegram':
        return this.telegramService.sendTelegram(to, message);
      default:
        throw new Error('Canal de notificación no soportado');
    }
  }
}
