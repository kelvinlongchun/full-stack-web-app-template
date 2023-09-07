<script setup lang="ts">
import { reactive, watchEffect } from "vue";

import Modal from "@/modules/common/components/Modal.vue";
import Form from "@/modules/common/components/Form.vue";

import type {
  PropInputs,
  SubmitOptions,
} from "@/modules/common/types/form.type";
import type { ErrorResponse } from "@/modules/common/utils/fetch-data.util";

const props = defineProps<{
  isShowed: boolean;
  headerTitle: string;
  inputs: PropInputs;
  submitOptions: SubmitOptions;
  buttonName: string;
  successStatement?: string;
}>();

const emit = defineEmits<{
  (e: "form-submit", response: object): void;
}>();

const formModal = reactive({
  isFail: false,
});

watchEffect(() => {
  if (!props.isShowed) {
    formModal.isFail = false;
  }
});

function submitForm(response: Partial<ErrorResponse>) {
  if (response.error) {
    formModal.isFail = true;
  }

  emit("form-submit", response);
}

function handleIsLoading(isLaoding: boolean) {
  if (isLaoding) {
    formModal.isFail = false;
  }
}
</script>

<template>
  <Modal
    v-bind:isShowed="props.isShowed"
    v-bind:headerTitle="props.headerTitle"
    v-bind:isFail="formModal.isFail"
  >
    <Form
      v-bind:inputs="props.inputs"
      v-bind:submitOptions="props.submitOptions"
      v-bind:buttonName="props.buttonName"
      v-bind:successStatement="props.successStatement"
      v-on:form-submit="submitForm"
      v-on:form-is-loading="handleIsLoading"
    >
      <slot name="form-modal-form" />
    </Form>
    <slot />
  </Modal>
</template>
