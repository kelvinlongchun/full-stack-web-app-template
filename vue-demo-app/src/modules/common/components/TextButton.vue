<script setup lang="ts">
import { reactive } from "vue";

import LoadingSpinnerIcon from "@/modules/icon/components/LoadingSpinnerIcon.vue";

const props = defineProps<{
  content: string;
  asyncCallback?: () => Promise<void>;
}>();

async function handleClick() {
  if (props.asyncCallback) {
    if (!textButton.isLoading) {
      textButton.isLoading = true;
      await props.asyncCallback();
      textButton.isLoading = false;
    }
  }
}

const textButton = reactive({
  isLoading: false,
});
</script>

<template>
  <div class="text-button-container">
    <div>
      <span
        class="text-button"
        v-bind:disabled="textButton.isLoading"
        v-on:click="handleClick"
      >
        {{ props.content }}
      </span>
    </div>
    <LoadingSpinnerIcon
      v-if="textButton.isLoading"
      class="text-button-container__loading-spinner"
    />
  </div>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.text-button-container {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;

  .text-button {
    color: $theme-color;

    &[disabled="false"] {
      @include clickable;
    }

    &[disabled="true"] {
      cursor: not-allowed;
      filter: grayscale(1);
    }
  }

  .text-button-container__loading-spinner {
    height: 1rem;
  }
}
</style>
