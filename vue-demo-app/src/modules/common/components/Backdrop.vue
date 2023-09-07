<script setup lang="ts">
const props = defineProps<{ isShowed: boolean }>();
</script>

<template>
  <Transition name="fade">
    <!-- Cannot use v-if. Since we need to wait slot's transition. -->
    <div v-if="props.isShowed" class="backdrop" />
  </Transition>
</template>

<style scoped lang="scss">
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
