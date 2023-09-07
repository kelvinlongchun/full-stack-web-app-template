<script setup lang="ts">
import Card from "@/modules/common/components/Card.vue";
import Backdrop from "@/modules/common/components/Backdrop.vue";
import CrossIcon from "@/modules/icon/components/CrossIcon.vue";
import Button from "@/modules/common/components/Button.vue";

const props = defineProps<{
  isShowed: boolean;
  headerTitle?: string;
  isFail?: boolean;
  buttonName?: string;
  buttonType?: "warning";
}>();

const emit = defineEmits(["close"]);

function closeMdoal() {
  emit("close");
}
</script>

<template>
  <Backdrop v-bind:isShowed="props.isShowed" v-on:click.self="closeMdoal" />
  <Transition name="fly-down">
    <Card v-if="props.isShowed" class="modal" v-bind:isFail="props.isFail">
      <!-- Modal header -->
      <div v-if="headerTitle" class="modal__header">
        <h2 class="modal__header__title">{{ props.headerTitle }}</h2>
        <CrossIcon
          class="modal__header__close-button"
          v-on:click="closeMdoal"
        />
      </div>
      <!-- Modal body -->
      <div class="mdoal__body">
        <slot />
        <Button
          v-if="props.buttonName"
          class="mdoal__body__button"
          v-bind:name="props.buttonName"
          v-bind:type="props.buttonType"
          v-on:click="closeMdoal"
        />
      </div>
    </Card>
  </Transition>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.modal {
  @include center-viewport;
  grid-template-rows: auto 1fr;
  row-gap: 0;
  width: 80vw;
  max-width: $standard-card-width;
  height: fit-content;
  padding: 0;

  .modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include standard-padding;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;

    .modal__header__title {
      color: $theme-color;
    }

    .modal__header__close-button {
      height: 0.75rem;
      @include clickable;
    }
  }

  .mdoal__body {
    display: grid;
    row-gap: 1.25rem;
    @include standard-padding;
    padding-top: 0;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;

    &:first-child {
      @include standard-padding; // It will add normal padding to padding-top
    }

    .mdoal__body__button {
      margin: auto;
    }
  }
}
</style>
