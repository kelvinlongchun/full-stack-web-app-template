<script setup lang="ts">
const props = defineProps<{
  isShowed: boolean;
  errorMessages: string[];
}>();
</script>

<template>
  <Transition name="fly-down">
    <div v-if="props.isShowed" class="input-tooltip">
      <ul class="input-tooltop__messages">
        <li
          v-for="message in props.errorMessages"
          v-bind:key="`input-tooltip-messages-${message}`"
        >
          {{ message }}
        </li>
      </ul>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.input-tooltip {
  position: absolute;
  width: fit-content;
  max-width: 100%;
  padding: 1rem;
  top: 120%;
  z-index: 1;
  background-color: $input-tooltip-color;
  border-radius: $standard-border-radius;

  &::after {
    content: "";
    position: absolute;
    bottom: 95%;
    left: 15%;
    border-width: 0.6rem;
    border-style: solid;
    border-color: transparent transparent $input-tooltip-color transparent;
  }

  .input-tooltop__messages {
    display: grid;
    row-gap: 0.5rem;
    font-size: 0.8rem;
    list-style: none;
    color: $input-tooltip-text-color;
  }
}
</style>
