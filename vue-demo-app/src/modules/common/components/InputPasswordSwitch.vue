<script setup lang="ts">
import OpenEyeIcon from "@/modules/icon/components/OpenEyeIcon.vue";
import CloseEyeIcon from "@/modules/icon/components/CloseEyeIcon.vue";

const props = defineProps<{
  isOpen: boolean;
}>();
</script>

<template>
  <OpenEyeIcon v-if="!props.isOpen" class="input-password-switch__icon" />
  <CloseEyeIcon v-else class="input-password-switch__icon" />
</template>

<style scoped lang="scss">
@import "@/sass/all";

.input-password-switch__icon {
  position: absolute;
  right: 1rem;
  height: 60%;
  @include clickable;
}
</style>
