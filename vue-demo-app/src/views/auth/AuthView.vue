<script setup lang="ts">
import { watchEffect } from "vue";

import LoadingSpinnerIcon from "@/modules/icon/components/LoadingSpinnerIcon.vue";

import router from "@/router";
import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const props = defineProps<{
  query: {
    userId?: string;
    accessToken?: string;
  };
}>();

const userDispatch = getInjection(Provider.userDispatch);
const successModalDispatch = getInjection(Provider.successModalDispatch);
const errorModalDispatch = getInjection(Provider.errorModalDispatch);

async function handleThirdPartyAuth() {
  if (props.query.userId && props.query.accessToken) {
    const userData = await userDispatch.loginThirdPartyUser(
      props.query.userId,
      props.query.accessToken
    );

    if (userData?.isLoggedIn) {
      successModalDispatch.openModal("Login Successful");
    }

    if (!userData || !userData?.isLoggedIn) {
      errorModalDispatch.openModal(
        "Could not log user in by third party account."
      );
    }
  }

  router.push("/");
}

watchEffect(() => handleThirdPartyAuth());
</script>

<template>
  <LoadingSpinnerIcon class="auth-view__loading-spinner" />
</template>

<style scoped lang="scss">
@import "@/sass/all";

.auth-view__loading-spinner {
  width: 30%;
  @include center-viewport;
}
</style>
