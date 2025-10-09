import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  async sendSms(to: string, message: string): Promise<any> {
    // Implementa aquí la integración con el proveedor SMS (ej: Twilio)
    return { status: 'pending', to, message };
  }
}
