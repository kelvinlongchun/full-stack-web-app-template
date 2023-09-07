import { SetMetadata } from '@nestjs/common';

import { AccountStatusType } from 'src/user/types/account-status-type.type';
import { ALLOW_ACCOUNTS_KEY } from 'src/user/guards/account-status.guard';

export const AllowAccounts = (accountStatus: AccountStatusType[]) =>
  SetMetadata(ALLOW_ACCOUNTS_KEY, accountStatus);
