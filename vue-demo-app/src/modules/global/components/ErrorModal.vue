<script setup lang="ts">
import Modal from "@/modules/common/components/Modal.vue";
import FailIcon from "@/modules/icon/components/FailIcon.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const errorModal = getInjection(Provider.errorModal);
const errorModalDispatch = getInjection(Provider.errorModalDispatch);
</script>

<template>
  <Modal
    v-bind:isShowed="errorModal.isShowed"
    buttonName="OK"
    buttonType="warning"
    v-on:close="errorModalDispatch.closeModal"
  >
    <div class="error-modal__fail-icon-container">
      <FailIcon class="error-modal__fail-icon" />
    </div>
    <p>{{ errorModal.message }}</p>
  </Modal>
</template>

<style scoped lang="scss">
.error-modal__fail-icon-container {
  display: flex;
  justify-content: center;
  .error-modal__fail-icon {
    width: 4rem;
  }
}
</style>
