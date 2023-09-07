<script setup lang="ts">
import AccountIcon from "@/modules/icon/components/AccountIcon.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const authModalDispatch = getInjection(Provider.authModalDispatch);
</script>

<template>
  <div class="header-login-button">
    <AccountIcon
      class="header-login-button__icon"
      v-on:click="authModalDispatch.toggleModal"
    />
  </div>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.header-login-button {
  position: relative;
  height: 100%;

  .header-login-button__icon {
    @include clickable;
  }
}
</style>
