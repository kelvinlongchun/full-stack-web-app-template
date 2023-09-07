import { SetMetadata } from '@nestjs/common';

import { AccountStatusType } from 'src/user/types/account-status-type.type';
import { BLOCK_ACCOUNTS_KEY } from 'src/user/guards/account-status.guard';

export const BlockAccounts = (accountStatus: AccountStatusType[]) =>
  SetMetadata(BLOCK_ACCOUNTS_KEY, accountStatus);
