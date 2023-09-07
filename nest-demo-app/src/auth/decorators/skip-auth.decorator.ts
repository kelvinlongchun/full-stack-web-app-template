import { SetMetadata } from '@nestjs/common';

import { IS_NO_AUTH_KEY } from 'src/auth/guards/jwt-auth.guard';

export const NoAuth = () => SetMetadata(IS_NO_AUTH_KEY, true);
