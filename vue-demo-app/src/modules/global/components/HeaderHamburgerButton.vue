<script setup lang="ts">
import { reactive } from "vue";

import HeaderMenu from "@/modules/global/components/HeaderMenu.vue";

const hambugerButton = reactive({
  isMenuShowed: false,
});

function toggleMenu() {
  hambugerButton.isMenuShowed = !hambugerButton.isMenuShowed;
}
</script>

<template>
  <div class="header-hamburger-button" v-on:click="toggleMenu">
    <div class="header-hamburger-button__line"></div>
    <div class="header-hamburger-button__line"></div>
    <div class="header-hamburger-button__line"></div>
  </div>
  <HeaderMenu
    v-bind:isShowed="hambugerButton.isMenuShowed"
    v-on:close="toggleMenu"
  />
</template>

<style scoped lang="scss">
@import "@/sass/all";

.header-hamburger-button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 70%;
  aspect-ratio: 1.2;
  @include clickable;

  &:hover {
    .header-hamburger-button__line {
      background-color: $theme-color;
    }
  }

  .header-hamburger-button__line {
    height: 0.2rem;
    background-color: $text-color;
    border-radius: 1rem;
  }
}
</style>
