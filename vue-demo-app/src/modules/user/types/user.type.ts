export interface UserData extends UserInfo {
  isDataInStorage: boolean;
  isLoggedIn: boolean;
  accessToken: string;
}

export interface UserDispatch {
  loginUser: (userInfo: UserInfo, accessToken: string) => UserData;
  loginThirdPartyUser: (
    userId: string,
    accessToken: string
  ) => Promise<UserData | undefined>;
  logoutUser: () => void;
  updateUserInfo: (userInfo: UserInfo) => void;
  checkAccountStatus: (allowStatus: AccountStatus[]) => void;
}

export interface UserInfo {
  userId: string;
  email: string;
  username: string;
  accountStatus: AccountStatus;
}

export interface UserResponse {
  user: UserInfo;
}

export interface JwtRespone {
  accessToken: string;
}

export type AccountStatus = "Active" | "Unactivated" | "Blocked" | "N/A";
