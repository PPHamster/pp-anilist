import { Profile, Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { googleCredential } from '@/utils/Contants';
import { AuthService } from '@/services/AuthService';
import { Inject } from '@nestjs/common';

export class GoogleStrategy extends PassportStrategy(Strategy) {
  public constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: googleCredential.clientId,
      clientSecret: googleCredential.clientSecret,
      callbackURL: googleCredential.callbackUrl,
      scope: ['profile', 'email'],
    });
  }

  public async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    const user = await this.authService.validateUser({
      email: profile.emails[0].value,
      id: profile.id,
      image: profile.photos[0].value,
      name: profile.displayName,
    });
    return user || null;
  }
}
