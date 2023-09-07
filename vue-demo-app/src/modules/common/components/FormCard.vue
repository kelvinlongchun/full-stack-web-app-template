<script setup lang="ts">
import { reactive } from "vue";

import Card from "@/modules/common/components/Card.vue";
import Form from "@/modules/common/components/Form.vue";

import type {
  PropInputs,
  SubmitOptions,
} from "@/modules/common/types/form.type";
import type { ErrorResponse } from "@/modules/common/utils/fetch-data.util";

const props = defineProps<{
  title: string;
  description?: string;
  inputs: PropInputs;
  submitOptions: SubmitOptions;
  buttonName: string;
  successStatement?: string;
}>();

const emit = defineEmits<{
  (e: "form-submit", response: object): void;
}>();

const formCard = reactive({
  isFail: false,
});

function submitForm(response: Partial<ErrorResponse>) {
  if (response.error) {
    formCard.isFail = true;
  }

  emit("form-submit", response);
}

function handleIsLoading(isLaoding: boolean) {
  if (isLaoding) {
    formCard.isFail = false;
  }
}
</script>

<template>
  <Card
    class="form-card"
    v-bind:title="props.title"
    v-bind:description="props.description"
    v-bind:isFail="formCard.isFail"
    v-bind:isFullPage="true"
  >
    <Form
      v-bind:inputs="props.inputs"
      v-bind:submitOptions="props.submitOptions"
      v-bind:buttonName="props.buttonName"
      v-bind:successStatement="props.successStatement"
      v-on:form-submit="submitForm"
      v-on:form-is-loading="handleIsLoading"
    />
    <slot />
  </Card>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.form-card {
  position: relative;
}
</style>
