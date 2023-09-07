<script setup lang="ts">
import { reactive, computed, watchEffect, type ComputedRef } from "vue";

import FormModal from "@/modules/common/components/FormModal.vue";
import AuthModalThirdParties from "@/modules/global/components/AuthModalThirdParties.vue";
import AuthModalSwitch from "@/modules/global/components/AuthModalSwitch.vue";
import HorizontalLine from "@/modules/common/components/HorizontalLine.vue";
import AuthModalForgotPassword from "@/modules/global/components/AuthModalForgotPassword.vue";

import router from "@/router";
import { getInjection } from "@/modules/common/utils/get-injection.util";

import { ApiConfig } from "@/configs/api.config";

import type {
  PropInputs,
  SubmitOptions,
} from "@/modules/common/types/form.type";
import type { JwtRespone, UserResponse } from "@/modules/user/types/user.type";
import type { ErrorResponse } from "@/modules/common/utils/fetch-data.util";
import { Provider } from "@/modules/common/types/provider.type";

const authModal = getInjection(Provider.authModal);
const authModalDispatch = getInjection(Provider.authModalDispatch);
const userDispatch = getInjection(Provider.userDispatch);

const loginInputs: PropInputs = [
  {
    name: "email",
    type: "email",
    autocomplete: "username",
    conditions: { required: true, isEmail: true, maxLength: 50 },
  },
  {
    name: "password",
    type: "password",
    autocomplete: "current-password",
    conditions: { required: true },
  },
];

const registerInputs: PropInputs = [
  {
    name: "email",
    type: "email",
    autocomplete: "username",
    conditions: { required: true, isEmail: true, maxLength: 50 },
  },
  {
    name: "username",
    type: "text",
    conditions: {
      required: true,
      minLength: 5,
      maxLength: 12,
      onlyNumberOrAlpha: true,
    },
  },
  {
    name: "password",
    type: "password",
    autocomplete: "current-password",
    conditions: {
      required: true,
      minLength: 8,
      maxLength: 50,
      containNumber: true,
      containAlpha: true,
    },
  },
];

const submitOptions: ComputedRef<SubmitOptions> = computed(() => {
  return {
    url: authModal.isLogin
      ? ApiConfig.LOGIN_API_URL
      : ApiConfig.REGISTER_API_URL,
    method: "POST",
  };
});

const authModalSetup = reactive({
  headerTitle: computed(() => (authModal.isLogin ? "Login" : "Register")),
  buttonName: computed(() => (authModal.isLogin ? "Login" : "Register")),
  inputs: computed(() => (authModal.isLogin ? loginInputs : registerInputs)),
  submitOptions: submitOptions,
  successStatement: computed(() =>
    authModal.isLogin ? "Login Successful" : "Register Successful"
  ),
});

function submitForm(
  response: Partial<JwtRespone & UserResponse & ErrorResponse>
) {
  if (response.user && response.accessToken) {
    userDispatch.loginUser(response.user, response.accessToken);
    authModalDispatch.toggleModal();
    router.push("/");
  }
}

watchEffect(() => {
  if (!authModal.isShowed) {
    authModalDispatch.resetModal();
  }
});
</script>

<template>
  <FormModal
    v-bind:isShowed="authModal.isShowed"
    v-bind:headerTitle="authModalSetup.headerTitle"
    v-bind:inputs="authModalSetup.inputs"
    v-bind:submitOptions="authModalSetup.submitOptions"
    v-bind:buttonName="authModalSetup.buttonName"
    v-bind:successStatement="authModalSetup.successStatement"
    v-on:close="authModalDispatch.toggleModal"
    v-on:form-submit="submitForm"
  >
    <template v-slot:form-modal-form>
      <AuthModalForgotPassword v-if="authModal.isLogin" />
    </template>
    <HorizontalLine />
    <AuthModalThirdParties />
    <AuthModalSwitch />
  </FormModal>
</template>
