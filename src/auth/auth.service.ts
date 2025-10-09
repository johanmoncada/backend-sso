import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from 'src/shared/interface/jwtpayload';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async signV1(document: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByDocument(document);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Datos de autenticación inválidos');
    }
    const payload = { sub: user.id, username: user.document };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signV2(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Datos de autenticación inválidos');
    }
    const payload = { sub: user.id, username: user.document };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signV3(otp: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findByOtp(otp);
    if (!user || user.otp !== otp) {
      throw new UnauthorizedException('Datos de autenticación inválidos');
    }
    const payload = { sub: user.id, username: user.document };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return payload;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  async sendOtp(channel: string, to: string): Promise<{ success: boolean }> {
    // 1. Genera el OTP y lo asocia al usuario
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.usersService.updateOtp(to, otp);

    // 2. Envía el OTP por el canal seleccionado
    const subject = 'Tu código OTP';
    const message = `Tu código OTP es: ${otp}`;
    await this.notificationsService.sendNotification(channel, to, subject, message);

    return { success: true };
  }
}
