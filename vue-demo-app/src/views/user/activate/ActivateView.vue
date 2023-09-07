<script setup lang="ts">
import ActivateCard from "@/modules/user/components/ActivateCard.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const userDispatch = getInjection(Provider.userDispatch);

userDispatch.checkAccountStatus(["Unactivated"]);
</script>

<template>
  <ActivateCard class="activate" />
</template>

<style scoped lang="scss">
@import "@/sass/all";

@media (min-width: $pc-min-width) {
  .activate {
    margin: auto;
  }
}
</style>
