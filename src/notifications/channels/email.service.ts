import { Injectable } from '@nestjs/common';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

@Injectable()
export class EmailService {
  private mailerSend: MailerSend;

  constructor() {
    this.mailerSend = new MailerSend({
      apiKey: process.env.MAILERSEND_API_KEY || '',
    });
  }

  async sendEmail(to: string, subject: string, message: string) {
    const sentFrom = new Sender(
      process.env.MAILERSEND_FROM || 'noreply@yourdomain.com',
      process.env.MAILERSEND_FROM_NAME || 'Your App',
    );

    const recipients = [new Recipient(to, 'Usuario')];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(message)
      .setText(message.replace(/<[^>]+>/g, ''));

    const response = await this.mailerSend.email.send(emailParams);

    // Explicitly type headers as Record<string, string> or undefined
    const headers = response.headers as Record<string, string> | undefined;
    const body = response.body as string | undefined;

    return {
      status: response.statusCode,
      message:
        response.statusCode === 202
          ? 'Email aceptado para envío'
          : 'Error al enviar el email (MailerSend)',
      mailersend: {
        body: body,
        statusCode: response.statusCode,
        messageId: headers?.['x-message-id'],
        quotaRemaining: headers?.['x-apiquota-remaining'],
        quotaReset: headers?.['x-apiquota-reset'],
        rateLimit: headers?.['x-ratelimit-limit'],
        rateLimitRemaining: headers?.['x-ratelimit-remaining'],
      },
    };
  }
}
