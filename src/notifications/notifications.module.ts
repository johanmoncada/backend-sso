import { Module } from '@nestjs/common';
import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';
import { WhatsappService } from './channels/whatsapp.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TelegramService } from './channels/telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { notificationConstants } from 'src/shared/constants';

@Module({
  controllers: [NotificationsController],
  imports: [
    TelegrafModule.forRoot({
      token: notificationConstants.telegramBotToken,
    }),
  ],
  providers: [NotificationsService, EmailService, SmsService, TelegramService, WhatsappService],
})
export class NotificationsModule {}
