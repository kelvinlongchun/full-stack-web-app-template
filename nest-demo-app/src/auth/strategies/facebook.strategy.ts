import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

import { FacebookAuthDto } from 'src/auth/dtos/facebook-auth.dto';

export const FACEBOOK_STRATEGY_NAME = 'facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  FACEBOOK_STRATEGY_NAME,
) {
  constructor(
    // @ts-expect-error: Extends class
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('auth.FACEBOOK_AUTH_CLIENT_ID'),
      clientSecret: configService.get('auth.FACEBOOK_AUTH_CLIENT_SECRET'),
      callbackURL: configService.get('auth.FACEBOOK_AUTH_CALLBACK_URL'),
      scope: ['email'],
      profileFields: ['emails'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ) {
    const facebookUser: FacebookAuthDto = {
      facebookId: profile.id,
      email: profile.emails[0].value,
    };
    done(null, facebookUser);
  }
}
