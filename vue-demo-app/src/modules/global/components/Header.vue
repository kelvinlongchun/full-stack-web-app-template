<script setup lang="ts">
import { RouterLink } from "vue-router";

import LogoIcon from "@/modules/icon/components/LogoIcon.vue";
import HeaderLoginButton from "@/modules/global/components/HeaderLoginButton.vue";
import HeaderHamburgerButton from "@/modules/global/components/HeaderHamburgerButton.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const user = getInjection(Provider.user);
</script>

<template>
  <header class="header">
    <div class="header__left-part">
      <RouterLink to="/">
        <LogoIcon />
      </RouterLink>
    </div>
    <div class="header__right-part">
      <HeaderLoginButton v-if="!user.isLoggedIn && !user.isDataInStorage" />
      <HeaderHamburgerButton />
    </div>
  </header>
</template>

<style scoped lang="scss">
@import "@/sass/all";
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $nav-bar-height;
  @include standard-padding;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: $nav-bar-color;

  .header__left-part {
    height: 100%;
    @include clickable;
  }

  .header__right-part {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    height: 80%;
  }
}
</style>
