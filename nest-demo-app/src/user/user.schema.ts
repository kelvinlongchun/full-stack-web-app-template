import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { EmailRecord } from 'src/email/email-record.schema';

import { AccountStatusType } from 'src/user/types/account-status-type.type';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    type: String,
    required: true,
    minlength: 5,
    maxlength: 12,
    trim: true,
    lowercase: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: String, required: true })
  encryptedPassword: string;

  @Prop({ type: String, required: true })
  accountStatus: AccountStatusType;

  @Prop({ type: String, required: true })
  accountCreateTime: Date;

  @Prop({ type: String })
  activationCode?: string;

  @Prop({ type: String })
  googleId?: string;

  @Prop({ type: String })
  facebookId?: string;

  @Prop({ type: String })
  resetPasswordToken?: string;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: 'EmailRecord',
  })
  emailRecords?: EmailRecord[];
}

export const UserSchema = SchemaFactory.createForClass(User);
