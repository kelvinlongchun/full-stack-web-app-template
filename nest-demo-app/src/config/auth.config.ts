import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  AUTH_JWT_SECRET: 'CHANGE_IT',
  AUTH_JWT_EXPIRES_IN: '90d',
  GOOGLE_OAUTH_CLIENT_ID: 'CHANGE_IT.apps.googleusercontent.com',
  GOOGLE_OAUTH_CLIENT_SECRET: 'CHANGE_IT',
  GOOGLE_OAUTH_CALLBACK_URL: 'http://localhost:5000/auth/google',
  FACEBOOK_AUTH_CLIENT_ID: 'CHANGE_IT',
  FACEBOOK_AUTH_CLIENT_SECRET: 'CHANGE_IT',
  FACEBOOK_AUTH_CALLBACK_URL: 'http://localhost:5000/auth/facebook',
  THIRD_PARTY_AUTH_FRONTEND_REDIRECT_URL: 'http://localhost:3000/auth',
}));
