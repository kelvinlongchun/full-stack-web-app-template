<script setup lang="ts">
import LoadingSpinnerIcon from "@/modules/icon/components/LoadingSpinnerIcon.vue";

const props = defineProps<{
  name: string;
  type?: "warning";
  disabled?: boolean;
  isLoading?: boolean;
}>();
</script>

<template>
  <button
    class="button"
    v-bind:buttonType="props.type"
    v-bind:disabled="props.disabled || props.isLoading"
    v-bind:is-loading="props.isLoading"
  >
    <span class="button__buttonName">
      {{ props.name }}
    </span>
    <LoadingSpinnerIcon
      v-if="props.isLoading"
      class="button__loading-spinner"
    />
  </button>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.button {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: $button-color;
  color: $button-text-color;
  border: none;
  border-radius: 0.25rem;

  &:hover {
    cursor: pointer;
    color: $button-text-hover-color;
    transition: all 0.3s ease;
  }

  &[disabled] {
    filter: grayscale(1);

    &:hover {
      cursor: not-allowed;
      color: $button-text-color;
    }

    &[is-loading="true"],
    &[is-successful="true"] {
      filter: none;
    }
  }

  &[is-loading="true"],
  &[is-successful="true"] {
    .button__buttonName {
      visibility: hidden;
    }
  }

  &[buttonType="warning"] {
    background-color: $button-warning-color;

    &:hover {
      color: $button-warning-text-hover-color;
    }
  }

  .button__loading-spinner {
    position: absolute;
    height: 50%;
  }

  .button__check-icon {
    position: absolute;
    height: 1rem;
  }
}
</style>
