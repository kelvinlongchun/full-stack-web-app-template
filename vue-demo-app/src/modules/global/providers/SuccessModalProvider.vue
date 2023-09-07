<script setup lang="ts">
import { provide, reactive } from "vue";

import SuccessModal from "@/modules/global/components/SuccessModal.vue";

import type {
  SuccessModalData,
  SuccessModalDispatch,
} from "@/modules/global/types/success-modal.type";
import { Provider } from "@/modules/common/types/provider.type";

const defaultSuccessModal: SuccessModalData = {
  isShowed: false,
  message: "Successful",
};

const successModal: SuccessModalData = reactive({ ...defaultSuccessModal });

function openModal(message: string = defaultSuccessModal.message) {
  successModal.isShowed = true;
  successModal.message = message;
}

function closeModal() {
  successModal.isShowed = false;
  successModal.message = defaultSuccessModal.message;
}

const successModalDispatch: SuccessModalDispatch = { openModal, closeModal };

provide(Provider.successModal, successModal);
provide(Provider.successModalDispatch, successModalDispatch);
</script>

<template>
  <slot />
  <SuccessModal />
</template>
