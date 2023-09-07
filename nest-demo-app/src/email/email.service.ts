import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailgun from 'mailgun-js';

@Injectable()
export class EmailService {
  private readonly mailgun: mailgun.Mailgun;

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    this.mailgun = new mailgun({
      apiKey: this.configService.get('mailgun.MAILGUN_API_KEY'),
      domain: this.configService.get('mailgun.MAILGUN_DOMAIN'),
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    const emailData = {
      from: this.configService.get('mailgun.MAILGUN_SENDER_EMAIL'),
      to,
      subject,
      text: body,
    };
    try {
      await this.mailgun.messages().send(emailData);
    } catch (error) {
      throw new InternalServerErrorException('Could not send the email.');
    }
  }
}
