<script setup lang="ts">
import LogoIcon from "@/modules/icon/components/LogoIcon.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const userDispatch = getInjection(Provider.userDispatch);

userDispatch.checkAccountStatus(["Active", "N/A"]);
</script>

<template>
  <h1 class="home-view__title">Vue Demo App</h1>
  <LogoIcon class="home-view__logo" />
  <p>This is a web app demo which is run by Vue and Nestjs servers.</p>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.home-view__title {
  color: $theme-color;
}

.home-view__logo {
  width: 80%;
  max-width: 20rem;
  height: fit-content;
  margin: auto;
  animation: logo-move 2s alternate infinite ease;
  z-index: -1;

  @keyframes logo-move {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-10%);
    }
  }
}
</style>
