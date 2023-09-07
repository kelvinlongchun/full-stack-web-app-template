import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtPayload } from 'src/auth/types/jwt-payload.type';

@Injectable()
export class UserIdParamGuard implements CanActivate {
  // This guard makes sure user JWT matchs will URL userId param.
  // When using this guard, JWT must be set in HTTP Headers, and userId param must be set in URL.. Otherwise it will throw error.
  canActivate(context: ExecutionContext): boolean {
    const userIdParam = this.getUserIdParam(context);
    const jwtUserId = this.getjwtUserId(context);
    return this.validateUserIdParam(userIdParam, jwtUserId);
  }

  private getUserIdParam(context: ExecutionContext) {
    return context.switchToHttp().getRequest().params.userId;
  }

  private getjwtUserId(context: ExecutionContext) {
    const reqUser: JwtPayload = context.getArgs()[0].user;
    return reqUser.userId;
  }

  private validateUserIdParam(userIdParam: string, jwtUserId: string) {
    if (userIdParam !== jwtUserId) {
      throw new UnauthorizedException(
        `Invalid userId parameter. URL param userId should be ${jwtUserId}`,
      );
    } else {
      return true;
    }
  }
}
