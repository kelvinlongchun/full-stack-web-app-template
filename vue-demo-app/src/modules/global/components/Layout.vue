<script setup lang="ts">
import Header from "@/modules/global/components/Header.vue";
</script>

<template>
  <Header />
  <main class="layout__main">
    <slot />
  </main>
</template>

<style scoped lang="scss">
@import "@/sass/all";
.layout__main {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: min-content;
  align-content: baseline;
  justify-items: baseline;
  row-gap: 2rem;
  @include standard-padding;
  overflow: auto;
}

@media (min-width: $pc-min-width) {
  .layout__main {
    padding-left: 10rem;
    padding-right: 10rem;
  }
}
</style>
