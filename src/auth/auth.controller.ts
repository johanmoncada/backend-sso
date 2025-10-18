import { Body, Controller, Get, Logger, Post, Res, Headers, Version } from '@nestjs/common';
import { LoginV1Request } from 'src/shared/request/login-v1.request';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginV2Request } from 'src/shared/request/login-v2.request';
import { LoginV3Request } from 'src/shared/request/login-v3.request';
import { Public } from 'src/shared/decorators/public.decorator';
import { OtpEmailRequest } from 'src/shared/request/otp-email.request';

@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Version('1')
  @Get()
  getVersion1Api(@Res() res: Response) {
    return res.status(200).json({ version: '1.0', message: 'versionado de api' });
  }

  @Public()
  @Version('1')
  @Post('login')
  async loginV1(@Body() loginRequest: LoginV1Request, @Res() res: Response) {
    const result = await this.authService.signV1(loginRequest.document, loginRequest.password);
    return res.status(200).json({
      message: 'Login exitoso',
      access_token: result.access_token,
      expires_in: process.env.JWT_EXPIRES_IN || 120,
    });
  }

  @Public()
  @Version('2')
  @Get()
  getVersion2Api(@Res() res: Response) {
    return res.status(200).json({ version: '2.0', message: 'versionado de api' });
  }

  @Public()
  @Version('2')
  @Post('login')
  async loginV2(@Body() loginRequest: LoginV2Request, @Res() res: Response) {
    const result = await this.authService.signV2(loginRequest.email, loginRequest.password);
    return res.status(200).json({
      message: 'Login exitoso',
      access_token: result.access_token,
      expires_in: process.env.JWT_EXPIRES_IN || 120,
    });
  }

  @Public()
  @Version('3')
  @Get()
  getVersion3Api(@Res() res: Response) {
    return res.status(200).json({ version: '3.0', message: 'versionado de api' });
  }

  @Public()
  @Version('3')
  @Post('login')
  async loginV3(@Body() loginRequest: LoginV3Request, @Res() res: Response) {
    const result = await this.authService.signV3(loginRequest.otp);
    return res.status(200).json({
      message: 'Login exitoso',
      access_token: result.access_token,
      expires_in: process.env.JWT_EXPIRES_IN || 120,
    });
  }

  @Public()
  @Version('1')
  @Post('validate')
  async validateTokenV1(@Body('token') token: string, @Res() res: Response) {
    this.logger.log(`Validando token: ${token}`);
    const payload = await this.authService.validateToken(token);
    return res.status(200).json({ message: 'Token válido', valid: true, payload });
  }

  @Public()
  @Version('2')
  @Post('validate')
  async validateTokenV2(@Headers('authorization') authHeader: string, @Res() res: Response) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No se proporcionó un token Bearer válido.' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    console.log('Validating token:', token);
    console.log('Hora:', new Date().toISOString());
    const payload = await this.authService.validateToken(token);
    return res.status(200).json({ message: 'Token válido', valid: true, payload });
  }

  @Public()
  @Post('otp-email')
  async requestOtpEmail(@Body() request: OtpEmailRequest, @Res() res: Response) {
    this.logger.log(`Body: ${request.channel} -- ${request.email}`);

    try {
      // Enviar OTP por email
      await this.authService.sendOtp(request.channel, request.email);
      return res.status(200).json({ message: 'OTP enviado por email' });
    } catch (error) {
      return res.status(400).json({ message: 'No se pudo enviar el OTP', error: error });
    }
  }
}
