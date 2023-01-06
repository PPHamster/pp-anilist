import { RequestUser } from '@/utils/decorators/AuthDecorator';
import { AuthGuard } from '@/utils/guards/AuthGuard';
import { GoogleAuthGuard } from '@/utils/guards/GoogleAuthGuard';
import {
  Controller,
  Get,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

@Controller('auth')
export class AuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  public googleLogin(@Res() res: Response) {
    return res.send({ message: 'Login Route' });
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  public googleCallback(@Res() res: Response) {
    return res.status(HttpStatus.OK).send({ message: 'Callback Route' });
  }

  @Get('logout')
  @UseGuards(AuthGuard)
  public logout(@Req() req: Request, @Res() res: Response, next: NextFunction) {
    req.logOut((err: unknown) => {
      if (err && err instanceof Error) return next(err);
      res.status(HttpStatus.OK).send({ message: 'Logout Success' });
    });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  public me(@RequestUser() user: User, @Res() res: Response) {
    res.status(HttpStatus.OK).json(user);
  }

  @Get('status')
  public checkStatus(@Req() req: Request) {
    console.log('cookies');
    console.log(req.session.cookie);
    if (req.user) {
      return { message: 'Authenticate', user: req.user };
    } else {
      return { message: 'Not Authenticate' };
    }
  }
}
