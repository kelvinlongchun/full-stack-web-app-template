import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseService, RefreshModel } from 'src/database/database.service';
import { AuthThirdParty } from 'src/user/types/auth-third-party.type';
import { User, UserDocument } from '../user.schema';
import { UserService } from '../user.service';

@Injectable()
export class ThirdPartyUser {
  private readonly refreshUserModel: RefreshModel<UserDocument>;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.refreshUserModel = this.databaseService.getRefreshModel(
      this.userModel,
    );
  }

  private readonly thirdPartyIdKeynames: {
    [key in Required<AuthThirdParty>]: string;
  } = {
    [AuthThirdParty.Google]: 'googleId',
    [AuthThirdParty.Facebook]: 'facebookId',
  };

  async createUserByThirdParty(
    email: string,
    thirdParty: AuthThirdParty,
    thirdPartyId: string,
  ): Promise<UserDocument> {
    const key = this.thirdPartyIdKeynames[thirdParty];
    const username = await this.userService.getRandomUsername();
    const encryptedPassword = 'N/A';
    const accountStatus = 'Active';
    const accountCreateTime = new Date();
    const newUser = await this.refreshUserModel.createDocument({
      username,
      email,
      encryptedPassword,
      accountStatus,
      [key]: thirdPartyId,
      accountCreateTime,
    });
    return newUser;
  }

  async linkageThirdPartyAccount(
    user: UserDocument,
    thirdParty: AuthThirdParty,
    thirdPartyId: string,
  ): Promise<UserDocument> {
    const thirdPartyIdKey = this.getThirdPartyIdkey(thirdParty);
    let updatedUser = await this.refreshUserModel.updateDocument(user, {
      [thirdPartyIdKey]: thirdPartyId,
      accountStatus: 'Active',
    });
    updatedUser = await this.refreshUserModel.removeDocumentKeys(updatedUser, [
      'activationCode',
    ]);
    return updatedUser;
  }

  async isThirdPartyIdExist(thirdParty: AuthThirdParty, thirdPartyId: string) {
    const key = this.getThirdPartyIdkey(thirdParty);
    const result = await this.refreshUserModel.isFieldExist({
      [key]: thirdPartyId,
    });
    return result;
  }

  getThirdPartyIdkey(thirdParty: AuthThirdParty) {
    return this.thirdPartyIdKeynames[thirdParty];
  }
}
