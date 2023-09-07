<script setup lang="ts">
import { reactive, watchEffect } from "vue";

import Input from "@/modules/common/components/Input.vue";
import Button from "@/modules/common/components/Button.vue";
import PassCode from "@/modules/common/components/PassCode.vue";

import { validate } from "@/modules/common/utils/validate.util";
import { fetchData } from "@/modules/common/utils/fetch-data.util";
import { getInjection } from "../utils/get-injection.util";

import type {
  PropInputs,
  Inputs,
  SubmitOptions,
} from "@/modules/common/types/form.type";
import { Provider } from "../types/provider.type";

const props = defineProps<{
  inputs: PropInputs;
  submitOptions: SubmitOptions;
  buttonName: string;
  successStatement?: string;
}>();

const emit = defineEmits<{
  (e: "form-submit", response: object): void;
  (e: "form-is-loading", isLoading: boolean): void;
}>();

const successModalDispatch = getInjection(Provider.successModalDispatch);

const inputs = reactive(initiateInputs(props.inputs));

const form = reactive({ isValid: false, errorMessage: "", isLoading: false });

watchEffect(() => {
  inputs.forEach((input) => {
    const { isValid, errorMessages } = validate(input.value, input.conditions);
    input.isValid = isValid;
    input.errorMessages = errorMessages;
  });
  updateIsFormValid();
  clearErrorMessage();
});

watchEffect(() => {
  const newInputs = initiateInputs(props.inputs);
  inputs.splice(0);
  newInputs.forEach((input) => inputs.push(input));
});

watchEffect(() => emit("form-is-loading", form.isLoading));

watchEffect(() => {
  if (form.isLoading) {
    clearErrorMessage();
  }
});

function initiateInputs(propInputs: PropInputs): Inputs {
  return propInputs
    .map((input) => {
      return {
        name: input.name,
        value: input.value ?? "",
        conditions: input.conditions,
      };
    })
    .map((input) => {
      const { isValid, errorMessages } = validate(
        input.value,
        input.conditions
      );
      return { ...input, isValid, errorMessages };
    });
}

function updateIsFormValid() {
  form.isValid = inputs
    .map((input) => input.isValid)
    .reduce((prev, current) => prev && current, true);
}

function clearErrorMessage() {
  form.errorMessage = "";
}

async function submitForm() {
  form.isLoading = true;

  const inputsData = inputs
    .map((input) => {
      return { [input.name]: input.value };
    })
    .reduce((prev, current) => {
      return { ...prev, ...current };
    }, {});

  const { url, method, accessToken } = props.submitOptions;

  const response = await fetchData(url, method, {
    body: inputsData,
    accessToken: accessToken,
  });

  form.isLoading = false;

  if (response.error) {
    form.errorMessage = response.message as string;
  }

  if (!response.error) {
    successModalDispatch.openModal(props.successStatement);
  }

  emit("form-submit", response);
}
</script>

<template>
  <form class="form" v-on:submit.prevent="submitForm">
    <div
      v-for="(input, index) in inputs"
      v-bind:key="`form-input-${input.name}`"
    >
      <Input
        v-if="!props.inputs[index].isPassCode"
        v-bind:name="input.name"
        v-model="input.value"
        v-bind:type="props.inputs[index].type ?? 'text'"
        v-bind:disabled="form.isLoading"
        v-bind:isHidden="props.inputs[index].isHidden"
        v-bind:isValid="input.isValid"
        v-bind:errorMessages="input.errorMessages"
        v-bind:autocomplete="props.inputs[index].autocomplete ?? 'off'"
      />
      <PassCode
        v-else
        v-bind:name="input.name"
        v-model="input.value"
        v-bind:length="props.inputs[index].passCodeLength ?? 4"
        v-bind:isLoading="form.isLoading"
      />
    </div>
    <p class="form__error-message" v-if="form.errorMessage">
      {{ form.errorMessage }}
    </p>
    <slot />
    <Button
      class="form__button"
      v-bind:name="props.buttonName"
      v-bind:disabled="!form.isValid"
      v-bind:isLoading="form.isLoading"
    />
  </form>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.form {
  display: grid;
  row-gap: 1rem;

  .form__error-message {
    color: $red-color;
  }

  .form__button {
    margin: auto;
  }
}
</style>
