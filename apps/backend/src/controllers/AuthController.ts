import { GoogleAuthGuard } from '@/utils/guards/GoogleAuthGuard';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Controller('auth')
export class AuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  public googleLogin(@Res() res: Response) {
    return res.send({ msg: 'Login Route' });
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  public googleCallback(@Res() res: Response) {
    return res.status(HttpStatus.OK).send({ msg: 'Callback Route' });
  }

  @Get('logout')
  public logout(@Req() req: Request, @Res() res: Response, next: NextFunction) {
    req.logOut((err: unknown) => {
      if (err && err instanceof Error) return next(err);
      res.status(HttpStatus.OK).send({ msg: 'Logout Success' });
    });
  }

  @Get('status')
  public checkStatus(@Req() req: Request) {
    console.log('cookies');
    console.log(req.session.cookie);
    if (req.user) {
      return { msg: 'Authenticate', user: req.user };
    } else {
      return { msg: 'Not Authenticate' };
    }
  }

  @Get('me')
  public me(@Req() req: Request, @Res() res: Response) {
    if (req.user) {
      res.status(HttpStatus.FOUND).json(req.user);
    } else {
      throw new HttpException('Unauthorization User', HttpStatus.UNAUTHORIZED);
    }
  }
}
