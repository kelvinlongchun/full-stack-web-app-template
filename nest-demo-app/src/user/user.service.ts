import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { DatabaseService, RefreshModel } from 'src/database/database.service';
import { User, UserDocument } from './user.schema';
import { RandomService } from 'src/random/random.service';
import { AuthService } from 'src/auth/auth.service';
import { ThirdPartyUser } from './providers/third-party-user.provider';
import { ResetUserPassword } from './providers/reset-user-password.provider';
import { UserEmail } from './providers/user-email.provider';
import { RegisterUserDto } from './dtos/register-user.dto';
import { HttpResponse } from 'src/common/types/http-response.type';
import { UserDataResponse } from 'src/user/types/user-data-response.type';
import { JwtRespone } from 'src/auth/types/jwt-response.type';
import { ActivateUserDto } from './dtos/activate-user.dto';
import { RequestResetPasswordDto } from './dtos/request-reset-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ChangeUsernameDto } from './dtos/change-username.dto';

@Injectable()
export class UserService {
  private readonly refreshUserModel: RefreshModel<UserDocument>;

  async registerUser(
    dto: RegisterUserDto,
  ): Promise<HttpResponse & JwtRespone & UserDataResponse> {
    await this.refreshUserModel.blockDuplicate({ username: dto.username });
    await this.refreshUserModel.blockDuplicate({ email: dto.email });
    const encryptedPassword = await this.hashPassword(dto.password);
    const newUser = await this.createUser(
      dto.username,
      dto.email,
      encryptedPassword,
    );
    const userId = newUser.id;
    await this.userEmail.sendUserEmail(newUser.id, 'Activation', {
      activationCode: newUser.activationCode,
    });
    const token = await this.authService.createJWT(userId);
    const { id, email, username, accountStatus } = newUser;
    return {
      message: 'User is created.',
      accessToken: token,
      user: { userId: id, email, username, accountStatus },
    };
  }

  async activateUser(
    dto: ActivateUserDto,
    userId: string,
  ): Promise<HttpResponse & UserDataResponse> {
    const user = await this.findUser(userId);
    await this.refreshUserModel.validateDocument(user, {
      activationCode: dto.activationCode,
    });
    const updatedUser = await this.refreshUserModel.updateDocument(user, {
      accountStatus: 'Active',
    });
    await this.refreshUserModel.removeDocumentKeys(updatedUser, [
      'activationCode',
    ]);
    const { email, username, accountStatus } = updatedUser;
    return {
      message: 'Account is activated.',
      user: { userId, email, username, accountStatus },
    };
  }

  async requestActivationCode(userId: string): Promise<HttpResponse> {
    const user = await this.findUser(userId);
    const { activationCode } = user;
    await this.userEmail.sendUserEmail(userId, 'Activation', {
      activationCode,
    });
    return { message: 'Activation email is resent.' };
  }

  async getUser(
    userId: string,
  ): Promise<HttpResponse & JwtRespone & UserDataResponse> {
    const token = await this.authService.createJWT(userId);
    const user = await this.findUser(userId);
    const { email, username, accountStatus } = user;
    return {
      message: `User ${username} is found.`,
      accessToken: token,
      user: { userId, email, username, accountStatus },
    };
  }

  async requestResetPassword(
    dto: RequestResetPasswordDto,
  ): Promise<HttpResponse> {
    const isUserExist = await this.refreshUserModel.isFieldExist({
      email: dto.email,
    });
    if (isUserExist) {
      const token = await this.resetUserPassword.createResetPasswordToken(
        dto.email,
      );
      const user = await this.refreshUserModel.findAndUpdateDocument(
        { email: dto.email },
        { resetPasswordToken: token },
      );
      await this.userEmail.sendUserEmail(user.id, 'ResetPassword', {
        token,
      });
    }
    return { message: 'Reset password email is sent.' };
  }

  async resetPassword(
    dto: ResetPasswordDto,
    userId: string,
  ): Promise<HttpResponse & JwtRespone & UserDataResponse> {
    const user = await this.findUser(userId);
    await this.resetUserPassword.validateResetPasswordToken(user, dto.token);
    const newEncryptedPassword = await this.hashPassword(dto.password);
    const updateduser = await this.refreshUserModel.updateDocument(user, {
      encryptedPassword: newEncryptedPassword,
      resetPasswordToken: null,
    });
    const { id, email, username, accountStatus } = updateduser;
    const token = await this.authService.createJWT(id);
    return {
      message: 'Password is changed.',
      accessToken: token,
      user: { userId: id, email, username, accountStatus },
    };
  }

  async changeUsername(
    dto: ChangeUsernameDto,
    userId: string,
  ): Promise<HttpResponse & UserDataResponse> {
    await this.refreshUserModel.blockDuplicate({ username: dto.username });
    const user = await this.findUser(userId);
    const updateduser = await this.refreshUserModel.updateDocument(user, {
      username: dto.username,
    });
    const { id, email, username, accountStatus } = updateduser;
    return {
      message: 'Username is changed.',
      user: { userId: id, email, username, accountStatus },
    };
  }

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
    @Inject(RandomService) private readonly randomService: RandomService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ThirdPartyUser))
    readonly thirdPartyUser: ThirdPartyUser,
    @Inject(forwardRef(() => UserEmail))
    private readonly userEmail: UserEmail,
    @Inject(forwardRef(() => ResetUserPassword))
    private readonly resetUserPassword: ResetUserPassword,
  ) {
    this.refreshUserModel = this.databaseService.getRefreshModel(
      this.userModel,
    );
  }

  async findUser(userId: string): Promise<UserDocument> {
    const user = await this.refreshUserModel.findDocumentById(userId);
    return user;
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.refreshUserModel.findDocumentByField({
      email: email.toLowerCase(),
    });
    return user;
  }

  async validateUserPassword(
    user: UserDocument,
    password: string,
  ): Promise<void> {
    const isMatch = await bcrypt.compare(password, user.encryptedPassword);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid account or password.');
    }
  }

  async isUserIdExist(userId: string) {
    return await this.refreshUserModel.isIdExist(userId);
  }

  async isEmailExist(email: string) {
    return await this.refreshUserModel.isFieldExist({ email });
  }

  async getRandomUsername(): Promise<string> {
    let username: string;
    let isValidUsername = false;
    while (!isValidUsername) {
      username = 'user' + this.randomService.createRandomString(8, ['number']);
      isValidUsername = !(await this.refreshUserModel.isFieldExist({
        username,
      }));
    }
    return username;
  }

  private async createUser(
    username: string,
    email: string,
    encryptedPassword: string,
  ): Promise<UserDocument> {
    const accountStatus = 'Unactivated';
    const accountCreateTime = new Date();
    const newUser = await this.refreshUserModel.createDocument({
      username,
      email,
      encryptedPassword,
      accountStatus,
      accountCreateTime,
      activationCode: this.randomService.createRandomString(5, [
        'upperCaseLetter',
        'number',
      ]),
    });
    return newUser;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
}
