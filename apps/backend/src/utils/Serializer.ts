/* eslint-disable @typescript-eslint/ban-types */
import { AuthService } from '@/services/AuthService';
import { Inject } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@prisma/client';

export class SessionSerializer extends PassportSerializer {
  public constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  public serializeUser(user: User, done: Function) {
    console.log('Serialize User');
    done(null, user);
  }

  public async deserializeUser(payload: any, done: Function) {
    const user = await this.authService.getUserById(payload.id);
    console.log('Deserialize User');
    console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}
