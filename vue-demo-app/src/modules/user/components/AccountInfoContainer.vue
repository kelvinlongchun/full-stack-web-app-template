<script setup lang="ts">
import PenIcon from "@/modules/icon/components/PenIcon.vue";
import LoadingSpinnerIcon from "@/modules/icon/components/LoadingSpinnerIcon.vue";

import { convertCamelCase } from "@/modules/common/utils/convert-camel-case.util";

const props = defineProps<{
  name: string;
  content: string;
  isEditable?: boolean;
  isLoading?: boolean;
}>();

const emit = defineEmits<{ (e: "edit-info", name: string): void }>();

function editInfo() {
  if (!props.isLoading) {
    emit("edit-info", props.name);
  }
}
</script>

<template>
  <div class="info-container">
    <h3 class="info-container__title">
      {{ convertCamelCase(props.name) }}
    </h3>
    <div class="info-container__content-container">
      <p class="info-container__content-container__content">
        {{ props.content }}
      </p>
      <div
        v-if="props.isEditable"
        class="info-container__content-container__edit-button-container"
      >
        <PenIcon
          v-if="!props.isLoading"
          class="info-container__content-container__edit-button"
          v-on:click="editInfo"
        />
        <LoadingSpinnerIcon v-if="props.isLoading" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.info-container {
  .info-container__title {
    font-size: 0.85rem;
  }

  .info-container__content-container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .info-container__content-container__content {
      word-break: break-all;
    }

    .info-container__content-container__edit-button-container {
      height: 1.5rem;

      .info-container__content-container__edit-button {
        @include clickable;
      }
    }
  }
}
</style>
