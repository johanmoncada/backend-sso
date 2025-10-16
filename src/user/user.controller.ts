import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import type { Response } from 'express';
import { CreateUserRequest } from 'src/shared/request/create-user.request';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Body() body: CreateUserRequest, @Res() res: Response) {
    try {
      const user = await this.userService.createUser(body);
      return res.status(201).json({ message: 'Usuario creado', user });
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Error al crear usuario';
      return res.status(400).json({ message: 'Error al crear usuario', error: message });
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.userService.deleteUser(id);
      return res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error: unknown) {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Usuario no encontrado';
      return res.status(404).json({ message: 'Usuario no encontrado', error: message });
    }
  }
}
