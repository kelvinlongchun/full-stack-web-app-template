<script setup lang="ts">
import { watchEffect } from "vue";

import Modal from "@/modules/common/components/Modal.vue";
import SuccessIcon from "@/modules/icon/components/SuccessIcon.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const successModal = getInjection(Provider.successModal);
const successModalDispatch = getInjection(Provider.successModalDispatch);

const MODAL_IS_SHOWED_TIMEOUT = 1800;

watchEffect(() => {
  if (successModal.isShowed) {
    setTimeout(successModalDispatch.closeModal, MODAL_IS_SHOWED_TIMEOUT);
  }
});
</script>

<template>
  <Modal v-bind:isShowed="successModal.isShowed">
    <Transition name="fade">
      <div class="success-modal-body">
        <SuccessIcon class="success-modal-body__icon" />
        <p class="success-modal-body__message">
          {{ successModal.message }}
        </p>
      </div>
    </Transition>
  </Modal>
</template>

<style scoped lang="scss">
.success-modal-body {
  display: grid;
  grid-template-columns: auto;
  row-gap: 1rem;

  .success-modal-body__icon {
    width: 4rem;
    margin: auto;
  }

  .success-modal-body__message {
    text-align: center;
  }
}
</style>
