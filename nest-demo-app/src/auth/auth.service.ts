import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/user.schema';
import { LoginUserDto } from './dtos/login-user.dto';
import { GoogleAuthDto } from './dtos/google-auth.dto';
import { FacebookAuthDto } from './dtos/facebook-auth.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { JwtRespone } from 'src/auth/types/jwt-response.type';
import { UserDataResponse } from 'src/user/types/user-data-response.type';
import { AuthThirdParty } from 'src/user/types/auth-third-party.type';
import { HttpResponse } from 'src/common/types/http-response.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  async loginUser(
    user: UserDocument,
  ): Promise<HttpResponse & JwtRespone & UserDataResponse> {
    // It will generate JWT.
    const token = await this.createJWT(user.id);
    const { id, email, username, accountStatus } = user;
    return {
      message: 'Login successful.',
      accessToken: token,
      user: { userId: id, email, username, accountStatus },
    };
  }

  async googleAuth(googleUser: GoogleAuthDto, res: Response): Promise<void> {
    await this.thirdPartyAuthHandler(AuthThirdParty.Google, googleUser, res);
  }

  async facebookAuth(
    facebookUser: FacebookAuthDto,
    res: Response,
  ): Promise<void> {
    await this.thirdPartyAuthHandler(
      AuthThirdParty.Facebook,
      facebookUser,
      res,
    );
  }

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async validateLogin(dto: LoginUserDto): Promise<void> {
    const { email, password } = dto;
    const isEmailExist = await this.userService.isEmailExist(email);
    if (!isEmailExist) {
      throw new UnauthorizedException('Invalid account or password.');
    }
    const user = await this.userService.findUserByEmail(email);
    await this.userService.validateUserPassword(user, password);
  }

  async validateJwt(payload: JwtPayload): Promise<void> {
    const isUserExist = await this.userService.isUserIdExist(payload.userId);
    if (!isUserExist) {
      throw new UnauthorizedException("User doesn't exist.");
    }
  }

  async createJWT(userId: string): Promise<string> {
    const user = await this.userService.findUser(userId);
    const { email, username } = user;
    const payload: JwtPayload = { userId: user.id, email, username };
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async thirdPartyAuthHandler(
    thirdParty: AuthThirdParty,
    thirdPartyUser: GoogleAuthDto | FacebookAuthDto,
    res: Response,
  ): Promise<void> {
    if (!thirdPartyUser) {
      throw new NotFoundException(
        'Could not get user information from Third Party.',
      );
    }
    const { email } = thirdPartyUser;
    const thirdPartyIdkey =
      this.userService.thirdPartyUser.getThirdPartyIdkey(thirdParty);
    const thirdPartyId = thirdPartyUser[thirdPartyIdkey];
    const isThirdPartyIdExist =
      await this.userService.thirdPartyUser.isThirdPartyIdExist(
        thirdParty,
        thirdPartyId,
      );
    const isEmailExist = await this.userService.isEmailExist(email);
    let user: UserDocument;
    if (!isThirdPartyIdExist) {
      if (!isEmailExist) {
        // Create account.
        user = await this.userService.thirdPartyUser.createUserByThirdParty(
          email,
          thirdParty,
          thirdPartyId,
        );
      }
      if (isEmailExist) {
        // Link existing account.
        user = await this.userService.findUserByEmail(email);
        user = await this.userService.thirdPartyUser.linkageThirdPartyAccount(
          user,
          thirdParty,
          thirdPartyId,
        );
      }
    }
    if (isThirdPartyIdExist) {
      // Do nothing, and login account.
      user = await this.userService.findUserByEmail(email);
    }
    const accessToken = await this.createJWT(user.id);
    const data = { userId: user.id, accessToken };
    const url = this.convertUrl(
      this.configService.get('auth.THIRD_PARTY_AUTH_FRONTEND_REDIRECT_URL'),
      data,
    );
    return res.redirect(url);
  }

  private convertUrl(url: string, data: object) {
    const keys = Object.keys(data);
    const updatedUrl = keys
      .map((key) => `${key}=${data[key]}&`)
      .reduce((prev, current) => prev + current, `${url}?`)
      .slice(0, -1);
    return updatedUrl;
  }
}
