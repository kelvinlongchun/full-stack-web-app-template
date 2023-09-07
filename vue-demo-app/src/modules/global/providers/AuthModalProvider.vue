<script setup lang="ts">
import { provide, reactive } from "vue";

import AuthModal from "@/modules/global/components/AuthModal.vue";

import type {
  AuthModalData,
  AuthModalDispatch,
} from "@/modules/global/types/auth-modal.type";
import { Provider } from "@/modules/common/types/provider.type";

const defaultAuthModal: AuthModalData = {
  isShowed: false,
  isLogin: true,
};

const authModal: AuthModalData = reactive({ ...defaultAuthModal });

function toggleModal() {
  authModal.isShowed = !authModal.isShowed;
}

const toggleIsLogin = () => (authModal.isLogin = !authModal.isLogin);

const resetModal = () => {
  let key: keyof AuthModalData;
  for (key in defaultAuthModal) {
    authModal[key] = defaultAuthModal[key];
  }
};

const authModalDispatch: AuthModalDispatch = {
  toggleModal,
  toggleIsLogin,
  resetModal,
};

provide(Provider.authModal, authModal);
provide(Provider.authModalDispatch, authModalDispatch);
</script>

<template>
  <slot />
  <AuthModal />
</template>
