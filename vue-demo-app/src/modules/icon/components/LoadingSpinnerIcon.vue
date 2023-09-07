<script setup lang="ts"></script>

<template>
  <svg
    class="loading-spinner"
    version="1.1"
    viewBox="0 0 50 50"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="25"
      cy="25"
      r="20"
      stroke-width="5"
      stroke-linecap="round"
      fill="none"
    ></circle>
  </svg>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.loading-spinner {
  animation: rotate 2s linear infinite;
  height: 100%;
  max-height: 4rem;

  circle {
    stroke: $text-color;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
}
</style>
