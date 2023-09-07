<script setup lang="ts"></script>

<template>
  <div class="text-with-icon">
    <div class="text-with-icon__icon">
      <slot name="icon" />
    </div>
    <p>
      <slot name="text" />
    </p>
  </div>
</template>

<style scoped lang="scss">
.text-with-icon {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  height: 1.5rem;

  .text-with-icon__icon {
    height: 100%;
  }
}
</style>
