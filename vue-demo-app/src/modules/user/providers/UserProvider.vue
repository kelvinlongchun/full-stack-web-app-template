<script setup lang="ts">
import { onMounted, provide, reactive, watchEffect } from "vue";

import router from "@/router";
import { fetchData } from "@/modules/common/utils/fetch-data.util";

import { ApiConfig } from "@/configs/api.config";

import { Provider } from "@/modules/common/types/provider.type";
import type {
  UserData,
  UserInfo,
  UserDispatch,
  UserResponse,
  AccountStatus,
  JwtRespone,
} from "@/modules/user/types/user.type";

const defaultUser: UserData = {
  isDataInStorage: checkLocalStorge(),
  isLoggedIn: false,
  accessToken: "",
  userId: "",
  email: "",
  username: "",
  accountStatus: "N/A",
};

const user: UserData = reactive({ ...defaultUser });

const userDispatch: UserDispatch = {
  loginUser,
  loginThirdPartyUser,
  updateUserInfo,
  logoutUser,
  checkAccountStatus,
};

provide(Provider.user, user);
provide(Provider.userDispatch, userDispatch);

onMounted(async () => {
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");

  if (!(userId && accessToken)) {
    logoutUser();
  }

  if (userId && accessToken) {
    const response = await fetchGetUser(userId, accessToken);

    if (response.user && response.accessToken) {
      loginUser(response.user, response.accessToken);
    } else {
      logoutUser();
    }
  }
});

function loginUser(userInfo: UserInfo, accessToken: string) {
  updateUserInfo(userInfo);
  user.accessToken = accessToken;

  user.isLoggedIn = true;

  localStorage.setItem("userId", user.userId);
  localStorage.setItem("accessToken", user.accessToken);
  user.isDataInStorage = true;

  return user;
}

async function loginThirdPartyUser(userId: string, accessToken: string) {
  const response = await fetchGetUser(userId, accessToken);
  if (response.user) {
    const userInfo = loginUser(response.user, accessToken);
    return userInfo;
  }
}

function logoutUser() {
  (Object.keys(defaultUser) as (keyof UserData)[]).forEach((key) => {
    (user[key] as UserData[keyof UserData]) = defaultUser[key];
  });

  localStorage.removeItem("userId");
  localStorage.removeItem("accessToken");
  user.isDataInStorage = false;
}

function updateUserInfo(userInfo: UserInfo) {
  (Object.keys(userInfo) as (keyof UserInfo)[]).forEach((key) => {
    (user[key] as UserData[keyof UserInfo]) = userInfo[key];
  });
}

function checkAccountStatus(allowStatus: AccountStatus[]) {
  watchEffect(() => {
    if (!allowStatus.includes(user.accountStatus)) {
      switch (user.accountStatus) {
        case "Active":
          router.push("/");
          break;
        case "Unactivated":
          router.push("/user/activate");
          break;
        case "Blocked":
          router.push("/");
          break;
        case "N/A":
          router.push("/");
          break;
        default:
          break;
      }
    }
  });
}

async function fetchGetUser(userId: string, accessToken: string) {
  const url = ApiConfig.GET_USER_API_URL(userId);
  const response = await fetchData<UserResponse & JwtRespone>(url, "GET", {
    accessToken,
  });
  return response;
}

function checkLocalStorge() {
  return !!(
    localStorage.getItem("accessToken") && localStorage.getItem("userId")
  );
}
</script>

<template>
  <slot />
</template>
