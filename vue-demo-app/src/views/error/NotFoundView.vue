<script setup lang="ts">
import CryIcon from "@/modules/icon/components/CryIcon.vue";
</script>

<template>
  <CryIcon class="not-found-view__icon" />
  <h1 class="not-found-view__word">404 Not Found</h1>
</template>

<style scoped lang="scss">
.not-found-view__icon {
  width: 70%;
  margin: auto;
}

.not-found-view__word {
  justify-self: center;
}
</style>
