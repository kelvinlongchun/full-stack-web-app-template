import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { JwtPayload } from '../types/jwt-payload.type';

export const JWT_STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    // @ts-expect-error: Extends class
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.AUTH_JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // To use this strategy, user needs to add JWT into HTTP Headers.
    // Check user JWT and return decrypted object.
    await this.authService.validateJwt(payload);
    return payload;
  }
}
