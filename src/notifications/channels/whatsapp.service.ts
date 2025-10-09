import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsappService {
  async sendWhatsapp(to: string, message: string): Promise<any> {
    // Implementa aquí la integración con el proveedor de WhatsApp
    return { status: 'pending', to, message };
  }
}
