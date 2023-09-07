<script setup lang="ts">
import { reactive, computed } from "vue";

import TextButton from "@/modules/common/components/TextButton.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const authModal = getInjection(Provider.authModal);
const authModalDispatch = getInjection(Provider.authModalDispatch);

const authModalSwitch = reactive({
  statement: computed(() =>
    authModal.isLogin ? "Not a number? " : "Already have account? "
  ),
  buttonKeyword: computed(() => (authModal.isLogin ? "Register" : "Login")),
});
</script>

<template>
  <div>
    <p>
      {{ authModalSwitch.statement }}
      <TextButton
        v-bind:content="authModalSwitch.buttonKeyword"
        v-on:click="authModalDispatch.toggleIsLogin"
      />
    </p>
  </div>
</template>

<style scoped lang="scss"></style>
