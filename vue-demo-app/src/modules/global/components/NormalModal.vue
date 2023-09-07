<script setup lang="ts">
import Modal from "@/modules/common/components/Modal.vue";

import { getInjection } from "@/modules/common/utils/get-injection.util";

import { Provider } from "@/modules/common/types/provider.type";

const normalModal = getInjection(Provider.normalMdoal);
const normalModalDispatch = getInjection(Provider.normalMoalDispatch);
</script>

<template>
  <Modal
    v-bind:isShowed="normalModal.isShowed"
    v-bind:headerTitle="normalModal.headerTitle"
    v-bind:buttonName="normalModal.buttonName"
    v-on:close="normalModalDispatch.closeModal"
  >
    <p>
      {{ normalModal.message }}
    </p>
  </Modal>
</template>
