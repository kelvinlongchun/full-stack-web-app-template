<script setup lang="ts"></script>

<template>
  <svg
    class="success-icon"
    version="1.1"
    viewBox="0 0 226 226"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="113" cy="113" r="113" fill="#09c372" />
    <polyline
      class="success-icon__tick"
      points="64.5,113 93.5,152 161.5,74"
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

.success-icon {
  animation: show-icon 0.5s ease;
  .success-icon__tick {
    visibility: hidden;
    animation: tick 2s ease forwards;
    animation-delay: 0.5s;

    @keyframes tick {
      0% {
        visibility: visible;
        stroke-dashoffset: 240;
      }
      100% {
        visibility: visible;
        stroke-dashoffset: 0;
      }
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
