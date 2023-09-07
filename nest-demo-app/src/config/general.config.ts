import { registerAs } from '@nestjs/config';

export default registerAs('general', () => ({
  PORT: 5000,
}));
