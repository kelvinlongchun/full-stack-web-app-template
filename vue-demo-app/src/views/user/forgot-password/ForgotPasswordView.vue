<script setup lang="ts">
import FormCard from "@/modules/common/components/FormCard.vue";

import router from "@/router";
import { getInjection } from "@/modules/common/utils/get-injection.util";

import { ApiConfig } from "@/configs/api.config";

import type { ErrorResponse } from "@/modules/common/utils/fetch-data.util";
import type {
  PropInputs,
  SubmitOptions,
} from "@/modules/common/types/form.type";

import { Provider } from "@/modules/common/types/provider.type";

const userDispatch = getInjection(Provider.userDispatch);

userDispatch.checkAccountStatus(["N/A"]);

const title = "Forgot Password";

const description = "Please input your email.";

const inputs: PropInputs = [
  {
    name: "email",
    type: "email",
    autocomplete: "username",
    conditions: {
      required: true,
      isEmail: true,
    },
  },
];

const submitForm = (response: Partial<ErrorResponse>) => {
  if (!response.error) {
    router.push("/");
  }
};

const submitOptions: SubmitOptions = {
  url: ApiConfig.REQUEST_RESEST_PASSWORD_URL,
  method: "POST",
};

const buttonName = "Submit";

const successStatement = "Email is sent.";
</script>

<template>
  <FormCard
    class="forgot-password"
    v-bind:title="title"
    v-bind:description="description"
    v-bind:inputs="inputs"
    v-bind:submitOptions="submitOptions"
    v-bind:buttonName="buttonName"
    v-bind:successStatement="successStatement"
    v-on:form-submit="submitForm"
  />
</template>

<style scoped lang="scss">
@import "@/sass/all";

@media (min-width: $pc-min-width) {
  .forgot-password {
    margin: auto;
  }
}
</style>
