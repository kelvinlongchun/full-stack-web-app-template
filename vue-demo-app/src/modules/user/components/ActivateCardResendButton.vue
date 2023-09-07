<script setup lang="ts">
import TextButton from "@/modules/common/components/TextButton.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";
import { fetchData } from "@/modules/common/utils/fetch-data.util";

import { ApiConfig } from "@/configs/api.config";

import { Provider } from "@/modules/common/types/provider.type";

const user = getInjection(Provider.user);
const errorModalDispatch = getInjection(Provider.errorModalDispatch);
const successModalDispatch = getInjection(Provider.successModalDispatch);

const resendButton = {
  content: "Resend activation email",
};

async function resendEmail() {
  const response = await fetchData(
    ApiConfig.REQUEST_RESEST_ACTIVATION_CODE_URL(user.userId),
    "POST",
    { accessToken: user.accessToken }
  );

  if (response.error) {
    errorModalDispatch.openModal(response.message);
  }

  if (!response.error) {
    successModalDispatch.openModal("Resend Email Successful");
  }
}
</script>

<template>
  <TextButton
    v-bind:content="resendButton.content"
    v-bind:asyncCallback="resendEmail"
  />
</template>

<style scoped lang="scss"></style>
