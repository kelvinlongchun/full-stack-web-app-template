import { registerAs } from '@nestjs/config';

const MAILGUN_DOMAIN = 'CHANGE_IT';

export default registerAs('mailgun', () => ({
  MAILGUN_API_KEY: 'CHANGE_IT',
  MAILGUN_DOMAIN: MAILGUN_DOMAIN,
  MAILGUN_SENDER_EMAIL: `Vue Demo App <auto@${MAILGUN_DOMAIN}>`,
}));
