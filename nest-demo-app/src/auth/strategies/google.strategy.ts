import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GoogleAuthDto } from 'src/auth/dtos/google-auth.dto';

export const GOOGLE_STRATEGY_NAME = 'google';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  GOOGLE_STRATEGY_NAME,
) {
  constructor(
    // @ts-expect-error: Extends class
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('auth.GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('auth.GOOGLE_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('auth.GOOGLE_OAUTH_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: { id: string; emails: { value: string }[] },
    done: VerifyCallback,
  ) {
    const googleUser: GoogleAuthDto = {
      googleId: profile.id,
      email: profile.emails[0].value,
    };
    done(null, googleUser);
  }
}
