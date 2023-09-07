<script setup lang="ts">
import { RouterView } from "vue-router";

import GlobalWrapper from "@/modules/global/components/GlobalWrapper.vue";
</script>

<template>
  <GlobalWrapper>
    <RouterView />
  </GlobalWrapper>
</template>

<style lang="scss">
@import "@/sass/global.scss";
</style>
