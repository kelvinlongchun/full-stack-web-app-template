import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from '../user.service';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';

export const ALLOW_ACCOUNTS_KEY = 'allowAccounts';
export const BLOCK_ACCOUNTS_KEY = 'blockAccounts';

@Injectable()
export class AccountStatusGuard implements CanActivate {
  // This guard is handling user role management.
  // When using decorator, JWT must be set in HTTP Headers. Otherwise it will throw error.
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowAccounts = this.reflector.get<string>(
      ALLOW_ACCOUNTS_KEY,
      context.getHandler(),
    );
    const blockAccounts = this.reflector.get<string>(
      BLOCK_ACCOUNTS_KEY,
      context.getHandler(),
    );
    const reqUser = this.getReqUser(context);
    const isDecoratorSet = allowAccounts || blockAccounts;
    if (isDecoratorSet) {
      if (!reqUser) {
        throw new BadRequestException('Invalid JWT.');
      }
      if (allowAccounts) {
        // AllowAccount decorator is set.
        return await this.vaildateAllowAccounts(reqUser, allowAccounts);
      }
      if (blockAccounts) {
        // BlockAccount decorator is set.
        return await this.vaildateBlockAccounts(reqUser, blockAccounts);
      }
    }
    return true; // Always return true if no decorator is set.
  }

  private getReqUser(context: ExecutionContext): JwtPayload {
    return context.switchToHttp().getRequest().user;
  }

  private async getUserAccountStatus(userId: string) {
    const user = await this.userService.findUser(userId);
    return user.accountStatus;
  }

  private async vaildateAllowAccounts(
    reqUser: JwtPayload,
    accountStatus: string,
  ) {
    const userAccountStatus = await this.getUserAccountStatus(reqUser.userId);
    if (!accountStatus.includes(userAccountStatus)) {
      throw new UnauthorizedException(
        `This route opens for the below account status only: [${accountStatus}]`,
      );
    }
    return true;
  }

  private async vaildateBlockAccounts(
    reqUser: JwtPayload,
    accountStatus: string,
  ) {
    const userAccountStatus = await this.getUserAccountStatus(reqUser.userId);
    if (accountStatus.includes(userAccountStatus)) {
      throw new UnauthorizedException(
        `This route doesn't allow the below account status: [${accountStatus}]`,
      );
    }
    return true;
  }
}
