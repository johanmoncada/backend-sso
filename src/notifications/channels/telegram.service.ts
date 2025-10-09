import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(@InjectBot() private readonly bot: Telegraf<any>) {}
  async sendTelegram(to: string, message: string): Promise<any> {
    // Enviar mensaje usando el bot de Telegram
    await this.bot.telegram.sendMessage(to, message);
    return { status: 'sent', to, message };
  }
}
