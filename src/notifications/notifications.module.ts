import { Module } from '@nestjs/common';
import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';
import { TelegramService } from './channels/telegram.service';
import { WhatsappService } from './channels/whatsapp.service';
import { NotificationsController } from './notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [EmailService, SmsService, TelegramService, WhatsappService],
})
export class NotificationsModule {}
