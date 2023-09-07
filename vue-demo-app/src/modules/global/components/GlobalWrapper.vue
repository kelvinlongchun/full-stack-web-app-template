<script setup lang="ts">
import UserProvider from "@/modules/user/providers/UserProvider.vue";
import ErrorModalProvider from "@/modules/global/providers/ErrorModalProvider.vue";
import SuccessModalProvider from "@/modules/global/providers/SuccessModalProvider.vue";
import AuthModalProvider from "@/modules/global/providers/AuthModalProvider.vue";
import NormalModalProvider from "@/modules/global/providers/NormalModalProvider.vue";

import Layout from "./Layout.vue";
</script>

<template>
  <UserProvider>
    <ErrorModalProvider>
      <SuccessModalProvider>
        <AuthModalProvider>
          <NormalModalProvider>
            <Layout>
              <slot />
            </Layout>
          </NormalModalProvider>
        </AuthModalProvider>
      </SuccessModalProvider>
    </ErrorModalProvider>
  </UserProvider>
</template>

<style scoped lang="scss"></style>
