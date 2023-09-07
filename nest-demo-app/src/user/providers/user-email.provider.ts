import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DatabaseService, RefreshModel } from 'src/database/database.service';
import { UserService } from '../user.service';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from '../user.schema';
import {
  EmailRecord,
  EmailRecordDocument,
} from 'src/email/email-record.schema';
import { EmailType } from 'src/user/types/email-type.type';

@Injectable()
export class UserEmail {
  private readonly refreshUserModel: RefreshModel<UserDocument>;
  private readonly refreshEmailModel: RefreshModel<EmailRecordDocument>;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(EmailRecord.name)
    private readonly emailModel: Model<EmailRecordDocument>,
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
    @Inject(EmailService) private readonly emailService: EmailService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    this.refreshUserModel = this.databaseService.getRefreshModel(
      this.userModel,
    );
    this.refreshEmailModel = this.databaseService.getRefreshModel(
      this.emailModel,
    );
  }

  async sendUserEmail(
    userId: string,
    emailType: EmailType,
    replaceWords: object,
  ): Promise<void> {
    let subject: string;
    let body: string;
    switch (emailType) {
      case 'ResetPassword':
        subject = '[Vue Demo App] Reset Password';
        const targetUrl = this.configService.get('user.RESET_PASSWORD_URL');
        body = `URL: ${targetUrl}?userId=${userId}&token={token}`;
        break;
      case 'Activation':
        subject = '[Vue Demo App] Activation Code';
        body = 'Activation Code: {activationCode}';
        break;
      default:
        break;
    }
    Object.keys(replaceWords).forEach(
      (key) => (body = body.replace(`{${key}}`, replaceWords[key])),
    );
    const user = await this.userService.findUser(userId);
    await this.checkHourlyEmailLimit(user);
    await this.emailService.sendEmail(user.email, subject, body);
    const newEmailRecord = await this.createEmailRecord(user, emailType);
    await this.updateEmailRecords(user, newEmailRecord);
  }

  private async updateEmailRecords(
    user: UserDocument,
    emailRecord: EmailRecordDocument,
  ): Promise<UserDocument> {
    user.emailRecords.push(emailRecord);
    const updatedUser = await this.refreshUserModel.updateDocument(user, {
      emailRecords: user.emailRecords,
    });
    return updatedUser;
  }

  private async createEmailRecord(
    user: UserDocument,
    emailType: EmailType,
  ): Promise<EmailRecordDocument> {
    const newEmailRecord = await this.refreshEmailModel.createDocument({
      userId: user,
      email: user.email,
      emailType: emailType,
      timestamp: new Date(),
    });
    return newEmailRecord;
  }

  private async checkHourlyEmailLimit(user: UserDocument) {
    await user.populate('emailRecords');
    const todayEmailRecords = user.emailRecords
      .filter(
        (record) =>
          record.timestamp.toDateString() === new Date().toDateString(),
      )
      .filter(
        (record) => record.timestamp.getHours() === new Date().getHours(),
      );
    if (
      todayEmailRecords.length >=
      this.configService.get('user.HOURLY_EMAIL_SENDING_LIMIT')
    ) {
      throw new BadRequestException(
        'Could not send the email. User reached hourly email sending limit. Please try it later.',
      );
    }
  }
}
