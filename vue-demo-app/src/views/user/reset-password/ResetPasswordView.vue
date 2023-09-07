<script setup lang="ts">
import FormCard from "@/modules/common/components/FormCard.vue";

import router from "@/router";
import type { ErrorResponse } from "@/modules/common/utils/fetch-data.util";
import { getInjection } from "@/modules/common/utils/get-injection.util";

import { ApiConfig } from "@/configs/api.config";

import type {
  PropInputs,
  SubmitOptions,
} from "@/modules/common/types/form.type";
import type { JwtRespone, UserResponse } from "@/modules/user/types/user.type";
import { Provider } from "@/modules/common/types/provider.type";

const userDispatch = getInjection(Provider.userDispatch);

const props = defineProps<{
  query: {
    userId?: string;
    token?: string;
  };
}>();

const title = "Reset Password";

const description = "Please input an new password.";

const inputs: PropInputs = [
  {
    name: "password",
    type: "password",
    conditions: {
      required: true,
      minLength: 8,
      maxLength: 50,
      containNumber: true,
      containAlpha: true,
    },
  },
  {
    name: "token",
    type: "text",
    isHidden: true,
    value: props.query.token,
    conditions: { required: true },
  },
];

const submitForm = (
  response: Partial<JwtRespone & UserResponse & ErrorResponse>
) => {
  if (response.user && response.accessToken) {
    userDispatch.loginUser(response.user, response.accessToken);
    router.push("/");
  }
};

const submitOptions: SubmitOptions = {
  url: ApiConfig.RESET_PASSWORD_URL(props.query.userId ?? ""),
  method: "PATCH",
  accessToken: props.query.token,
};

const buttonName = "Submit";

const successStatement = "Reset Password Successful";
</script>

<template>
  <FormCard
    class="reset-password"
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
  .reset-password {
    margin: auto;
  }
}
</style>
