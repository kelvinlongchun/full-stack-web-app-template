import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseService, RefreshModel } from 'src/database/database.service';
import { UserService } from '../user.service';
import { User, UserDocument } from '../user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ResetUserPassword {
  private readonly refreshUserModel: RefreshModel<UserDocument>;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(JwtService) private readonly jwtService: JwtService,
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.refreshUserModel = this.databaseService.getRefreshModel(
      this.userModel,
    );
  }

  async validateResetPasswordToken(
    user: UserDocument,
    token: string,
  ): Promise<void> {
    await this.refreshUserModel.validateDocument(user, {
      resetPasswordToken: token,
    });
    try {
      this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid reset password token.');
    }
  }

  async createResetPasswordToken(email: string): Promise<string> {
    const user = await this.userService.findUserByEmail(email);
    const token = this.jwtService.sign({ userId: user.id });
    return token;
  }
}
