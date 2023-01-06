import { UserService } from '@/services/UserService';
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('/')
  public async getAllUser(@Res() res: Response) {
    const users = await this.userService.getAllUser();
    return res.status(HttpStatus.OK).json(users);
  }

  @Get(':id')
  public async getUserByEmail(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.getUserById(id);
    if (!user) throw new BadRequestException();
    return res.status(HttpStatus.OK).json(user);
  }
}
