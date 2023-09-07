<script setup lang="ts">
import GoogleIcon from "@/modules/icon/components/GoogleIcon.vue";
import FacebookIcon from "@/modules/icon/components/FacebookIcon.vue";

import { ApiConfig } from "@/configs/api.config";

enum AuthParty {
  Google,
  Facebook,
}

function handleThirdAuth(party: AuthParty) {
  const url =
    party === AuthParty.Google
      ? ApiConfig.GOOGLE_AUTH_API_URL
      : ApiConfig.FACEBOOK_AUTH_API_URL;
  location.replace(url);
}
</script>

<template>
  <div class="auth-modal__third-parties">
    <GoogleIcon
      class="auth-modal__third-parties__icon"
      v-on:click="() => handleThirdAuth(AuthParty.Google)"
    />
    <FacebookIcon
      class="auth-modal__third-parties__icon"
      v-on:click="() => handleThirdAuth(AuthParty.Facebook)"
    />
  </div>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.auth-modal__third-parties {
  display: flex;
  justify-content: space-around;

  .auth-modal__third-parties__icon {
    height: 4rem;
    @include clickable;
  }
}
</style>
