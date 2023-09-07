<script setup lang="ts">
const props = defineProps<{ content?: string }>();

const horizontalLine = { content: props.content ?? "Or" };
</script>

<template>
  <div class="horizontal-line">
    <span class="horizontal-line__line" />
    <p class="horizontal-line__words">
      {{ horizontalLine.content }}
    </p>
    <span class="horizontal-line__line" />
  </div>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.horizontal-line {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .horizontal-line__line {
    background: $text-color;
    width: 100%;
    height: 0.1rem;
  }

  .horizontal-line__words {
    margin: 0 1rem;
  }
}
</style>
