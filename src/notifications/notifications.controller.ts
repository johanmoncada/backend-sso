import { Body, Controller, Post } from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Public()
  @Post()
  async notify(
    @Body()
    body: {
      channel: string;
      to: string;
      subject?: string;
      message: string;
    },
  ) {
    return await this.notificationsService.sendNotification(
      body.channel,
      body.to,
      body.subject,
      body.message,
    );
  }
}
