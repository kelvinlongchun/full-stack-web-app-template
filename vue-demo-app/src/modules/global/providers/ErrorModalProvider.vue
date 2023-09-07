<script setup lang="ts">
import { provide, reactive } from "vue";

import ErrorModal from "@/modules/global/components/ErrorModal.vue";

import type {
  ErrorModalData,
  ErrorModalDispatch,
} from "@/modules/global/types/error-modal.type";
import { Provider } from "@/modules/common/types/provider.type";

const defaultErrorModal = {
  isShowed: false,
  message: "Something went wrong...",
};

const errorModal: ErrorModalData = reactive({ ...defaultErrorModal });

function openModal(message?: string) {
  errorModal.isShowed = true;
  errorModal.message = message ?? defaultErrorModal.message;
}

function closeModal() {
  errorModal.isShowed = false;
  errorModal.message = defaultErrorModal.message;
}

const errorModalDispatch: ErrorModalDispatch = {
  openModal,
  closeModal,
};

provide(Provider.errorModal, errorModal);
provide(Provider.errorModalDispatch, errorModalDispatch);
</script>

<template>
  <slot />
  <ErrorModal />
</template>
