<script setup lang="ts">
import TextButton from "@/modules/common/components/TextButton.vue";

import router from "@/router";
import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const authModalDispatch = getInjection(Provider.authModalDispatch);

const forgotPassowrdButton = {
  content: "Forgot Password?",
};

function handleForgotPassword() {
  router.push("/user/forgot-password");
  authModalDispatch.toggleModal();
}
</script>

<template>
  <TextButton
    class="auth-modal-forgot-password"
    v-bind:content="forgotPassowrdButton.content"
    v-on:click="handleForgotPassword"
  />
</template>

<style scoped lang="scss">
.auth-modal-forgot-password {
  margin-left: auto;
}
</style>
