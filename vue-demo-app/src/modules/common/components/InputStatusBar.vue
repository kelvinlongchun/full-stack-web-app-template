<script setup lang="ts">
const props = defineProps<{
  isValid: boolean;
  isBlank: boolean;
}>();
</script>

<template>
  <div class="status-bar-container">
    <Transition name="status-bar">
      <div
        v-if="!isBlank"
        class="status-bar"
        v-bind:is-valid="props.isValid"
      ></div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.status-bar-container {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 0.3rem;
  background-color: $input-status-bar-color;
  border-radius: 0 0 $input-border-radius $input-border-radius;
  overflow: hidden;

  .status-bar-enter-from,
  .status-bar-leave-to {
    transform: translateX(-100%);
  }
  .status-bar-enter-active,
  .status-bar-leave-active {
    transition: all 0.75s ease;
  }

  .status-bar {
    position: relative;
    width: 100%;
    height: 100%;

    &[is-valid="true"] {
      background-color: $theme-color;
    }

    &[is-valid="false"] {
      background-color: $red-color;
    }
  }
}
</style>
