import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';

export const LOCAL_STRATEGY_NAME = 'local';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  LOCAL_STRATEGY_NAME,
) {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({ usernameField: 'email' }); // Using email as username.
  }

  async validate(email: string, password: string): Promise<User> {
    // To use this strategy, we need to add parameters json into body.
    await this.authService.validateLogin({ email, password });
    const user = await this.userService.findUserByEmail(email);
    return user;
  }
}
