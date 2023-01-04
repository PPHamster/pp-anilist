import { AuthService } from '@/services/AuthService';
import { GoogleAuthGuard } from '@/utils/guards/GoogleAuthGuard';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  public constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  public googleLogin(@Res() response: Response) {
    return response.send({ msg: 'Login Route' });
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  public googleCallback(@Res() response: Response) {
    return response.status(HttpStatus.OK).send({ msg: 'Callback Route' });
  }

  @Get('status')
  public checkStatus(@Req() request: Request) {
    console.log('cookies');
    console.log(request.session.cookie);
    if (request.user) {
      return { msg: 'Authenticate', user: request.user };
    } else {
      return { msg: 'Not Authenticate' };
    }
  }

  @Get('me')
  public me(@Req() request: Request, @Res() response: Response) {
    if (request.user) {
      response.status(HttpStatus.FOUND).json({ user: request.user });
    } else {
      throw new HttpException('Unauthorization User', HttpStatus.UNAUTHORIZED);
    }
  }
}
