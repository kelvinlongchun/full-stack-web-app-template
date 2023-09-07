import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

import { EmailType } from 'src/user/types/email-type.type';
import { User } from 'src/user/user.schema';

export type EmailRecordDocument = EmailRecord & Document;

@Schema()
export class EmailRecord {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User;

  @Prop({
    type: String,
    required: true,
    maxLength: 50,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  emailType: EmailType;

  @Prop({ type: Date, required: true })
  timestamp: Date;
}

export const EmailSchema = SchemaFactory.createForClass(EmailRecord);
