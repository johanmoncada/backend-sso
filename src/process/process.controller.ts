import { Controller, Get, Post, Res, Version } from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.decorator';
import type { Response } from 'express';

@Controller('api/process')
export class ProcessController {
  @Public()
  @Version('1')
  @Get()
  getVersion1Api(@Res() res: Response) {
    return res.status(200).json({ version: '1.0', message: 'versionado de api' });
  }

  @Version('1')
  @Post('restricted')
  getRestrictedVersion1Api(@Res() res: Response) {
    return res.status(200).json({ version: '1.0', message: 'Exito: endpoint restringido' });
  }

  @Public()
  @Version('2')
  @Get()
  getVersion2Api(@Res() res: Response) {
    return res.status(200).json({ version: '2.0', message: 'versionado de api' });
  }

  @Version('2')
  @Post('restricted')
  getRestrictedVersion2Api(@Res() res: Response) {
    return res.status(200).json({ version: '2.0', message: 'Exito: endpoint restringido' });
  }
}
