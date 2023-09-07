import { AccountStatusType } from './account-status-type.type';

export interface UserDataResponse {
  user: {
    userId: string;
    email: string;
    username: string;
    accountStatus: AccountStatusType;
  };
}
