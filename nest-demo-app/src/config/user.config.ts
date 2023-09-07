import { registerAs } from '@nestjs/config';

export default registerAs('user', () => ({
  HOURLY_EMAIL_SENDING_LIMIT: 10,
  RESET_PASSWORD_JWT_EXPIRES_IN: '1h',
  RESET_PASSWORD_JWT_SECRET: 'CHANGE_IT',
  RESET_PASSWORD_URL: 'http://localhost:3000/user/reset-password',
}));
