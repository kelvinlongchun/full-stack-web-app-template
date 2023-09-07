<script setup lang="ts">
import { provide, reactive } from "vue";

import NormalModal from "@/modules/global/components/NormalModal.vue";

import type {
  NormalModalData,
  NormalModalDispatch,
} from "@/modules/global/types/normal-modal.type";
import { Provider } from "@/modules/common/types/provider.type";

const defaultNormalModal: NormalModalData = {
  isShowed: false,
  headerTitle: "",
  buttonName: "",
  message: "",
};

const normalModal: NormalModalData = reactive({ ...defaultNormalModal });

function openModal(
  headerTitle: string = defaultNormalModal.headerTitle,
  buttonName: string = defaultNormalModal.buttonName,
  message: string = defaultNormalModal.message
) {
  normalModal.isShowed = true;
  normalModal.headerTitle = headerTitle;
  normalModal.buttonName = buttonName;
  normalModal.message = message;
}

function closeModal() {
  normalModal.isShowed = false;
  normalModal.headerTitle = defaultNormalModal.headerTitle;
  normalModal.buttonName = defaultNormalModal.buttonName;
  normalModal.message = defaultNormalModal.message;
}

const normalMoalDispatch: NormalModalDispatch = { openModal, closeModal };

provide(Provider.normalMdoal, normalModal);
provide(Provider.normalMoalDispatch, normalMoalDispatch);
</script>

<template>
  <slot />
  <NormalModal />
</template>
