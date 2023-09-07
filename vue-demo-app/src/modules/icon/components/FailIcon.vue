<script setup lang="ts"></script>

<template>
  <svg
    class="fail-icon"
    version="1.1"
    viewBox="0 0 226 226"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="113" cy="113" r="113" fill="#FF3860" />
    <line
      class="fail-icon__cross-1"
      x1="69.8"
      y1="156.2"
      x2="156.2"
      y2="69.8"
      fill="none"
      stroke="#eeeeee"
      stroke-width="30"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-dasharray="240"
    />
    <line
      class="fail-icon__cross-2"
      x1="69.8"
      y1="69.8"
      x2="156.2"
      y2="156.2"
      fill="none"
      stroke="#eeeeee"
      stroke-width="30"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-dasharray="240"
    />
  </svg>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.fail-icon {
  animation: show-icon 0.5s ease;
  .fail-icon__cross-1 {
    visibility: hidden;
    animation: cross 2s ease forwards;
    animation-delay: 0.5s;
  }

  .fail-icon__cross-2 {
    visibility: hidden;
    animation: cross 2s ease forwards;
    animation-delay: 1s;
  }

  @keyframes cross {
    0% {
      visibility: visible;
      stroke-dashoffset: 240;
    }
    100% {
      visibility: visible;
      stroke-dashoffset: 0;
    }
  }

  @keyframes show-icon {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
}
</style>
