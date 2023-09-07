import { registerAs } from '@nestjs/config';

export default registerAs('mongodb', () => ({
  MONGODB_URI: 'CHANGE_IT',
}));
