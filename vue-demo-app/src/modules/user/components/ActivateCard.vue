<script setup lang="ts">
import FormCard from "@/modules/common/components/FormCard.vue";
import ActivateCardResendButton from "@/modules/user/components/ActivateCardResendButton.vue";

import router from "@/router";
import { getInjection } from "@/modules/common/utils/get-injection.util";

import { ApiConfig } from "@/configs/api.config";
import { UserConfig } from "@/configs/user.config";

import type { ErrorResponse } from "@/modules/common/utils/fetch-data.util";
import type { UserResponse } from "@/modules/user/types/user.type";
import type {
  PropInputs,
  SubmitOptions,
} from "@/modules/common/types/form.type";
import { Provider } from "@/modules/common/types/provider.type";

const user = getInjection(Provider.user);
const userDispatch = getInjection(Provider.userDispatch);

const inputs: PropInputs = [
  {
    name: "activationCode",
    isPassCode: true,
    passCodeLength: UserConfig.ACTIVATION_CODE_LENGTH,
    conditions: {
      required: true,
      minLength: UserConfig.ACTIVATION_CODE_LENGTH,
      maxLength: UserConfig.ACTIVATION_CODE_LENGTH,
    },
  },
];

const submitOptions: SubmitOptions = {
  url: ApiConfig.ACTIVATE_USER_API_URL(user.userId),
  method: "POST",
  accessToken: user.accessToken,
};

const activateCard = {
  title: "Activate Your Account",
  description:
    "We already sent the activation code to your email. Please check your mailbox.",
  buttonName: "Activate",
  successStatement: "Activate Successful",
  inputs: inputs,
  submitOptions: submitOptions,
};

function submitForm(response: Partial<ErrorResponse & UserResponse>) {
  if (!response.error && response.user) {
    userDispatch.updateUserInfo(response.user);
    router.push("/");
  }
}
</script>

<template>
  <FormCard
    v-bind:title="activateCard.title"
    v-bind:description="activateCard.description"
    v-bind:inputs="activateCard.inputs"
    v-bind:submitOptions="activateCard.submitOptions"
    v-bind:buttonName="activateCard.buttonName"
    v-bind:successStatement="activateCard.successStatement"
    v-on:form-submit="submitForm"
  >
    <ActivateCardResendButton />
  </FormCard>
</template>
