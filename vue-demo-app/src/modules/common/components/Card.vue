<script setup lang="ts">
const props = defineProps<{
  title?: string;
  description?: string;
  isFail?: boolean;
  isFullPage?: boolean;
}>();
</script>

<template>
  <div
    class="card"
    v-bind:is-fail="props.isFail"
    v-bind:is-full-page="props.isFullPage"
  >
    <h2 v-if="props.title" class="card__title">{{ props.title }}</h2>
    <p v-if="props.description" class="card__description">
      {{ props.description }}
    </p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.card {
  display: grid;
  row-gap: 1rem;
  @include standard-padding;
  border-radius: 0.5rem;
  background-color: $nav-bar-color;
  @include standard-box-shadow;

  &[is-fail="true"] {
    @include shake-animation;
  }

  &[is-full-page="true"] {
    width: 100%;
  }

  .card__title {
    color: $theme-color;
  }

  .card__description {
    font-size: 0.85rem;
  }
}

@media (min-width: $pc-min-width) {
  .card {
    &[is-full-page="true"] {
      width: $standard-card-width;
    }
  }
}
</style>
