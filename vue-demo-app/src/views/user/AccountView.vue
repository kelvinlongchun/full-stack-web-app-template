<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

import Card from "@/modules/common/components/Card.vue";
import AccountInfoContainer from "@/modules/user/components/AccountInfoContainer.vue";
import FormModal from "@/modules/common/components/FormModal.vue";

import { convertCamelCase } from "@/modules/common/utils/convert-camel-case.util";
import { fetchData } from "@/modules/common/utils/fetch-data.util";
import { getInjection } from "@/modules/common/utils/get-injection.util";

import { ApiConfig } from "@/configs/api.config";

import type { UserResponse } from "@/modules/user/types/user.type";
import type {
  PropInputs,
  SubmitOptions,
} from "@/modules/common/types/form.type";
import type { ErrorResponse } from "@/modules/common/utils/fetch-data.util";
import { Provider } from "@/modules/common/types/provider.type";

const user = getInjection(Provider.user);
const userDispatch = getInjection(Provider.userDispatch);
const errorModalDispatch = getInjection(Provider.errorModalDispatch);
const normalModalDispatch = getInjection(Provider.normalMoalDispatch);

userDispatch.checkAccountStatus(["Active"]);

interface EditModal {
  isModalShowed: boolean;
  name: string;
  inputs: PropInputs;
  submitOptions: SubmitOptions;
  buttonName: string;
  successStatement?: string;
}

const editModal = ref<EditModal>({
  isModalShowed: false,
  name: "",
  inputs: [{ name: "", type: "text", conditions: {} }],
  submitOptions: { url: "", method: "PATCH", accessToken: "" },
  buttonName: "Submit",
});

function toggleEditModal() {
  editModal.value.isModalShowed = !editModal.value.isModalShowed;
}

const title = "Account Info";

const defaultAccountInfos = computed(() => [
  { name: "email", content: user.email },
  {
    name: "username",
    content: user.username,
    isEditable: true,
    isLoading: false,
  },
  { name: "password", content: "********", isEditable: true, isLoading: false },
]);

const accountInfos = ref([...defaultAccountInfos.value]);

function updateInfos() {
  accountInfos.value = [...defaultAccountInfos.value];
}

function toggleIsLoading(name: string) {
  const targetInfo = accountInfos.value.find((info) => info.name === name);
  if (targetInfo) {
    targetInfo.isLoading = !targetInfo.isLoading;
  }
}

async function editInfo(name: string) {
  toggleIsLoading(name);
  if (name === "username") {
    editModal.value = {
      ...editModal.value,
      ...{
        name: `Change ${convertCamelCase(name)}`,
        inputs: [
          {
            name: name,
            type: "text",
            conditions: {
              required: true,
              minLength: 5,
              maxLength: 12,
              onlyNumberOrAlpha: true,
            },
          },
        ],
        submitOptions: {
          url: ApiConfig.CHANGE_USERNAME_URL(user.userId),
          method: "PATCH",
          accessToken: user.accessToken,
        },
        successStatement: "Username is changed.",
      },
    };
    toggleEditModal();
  }

  if (name === "password") {
    const response = await fetchData(
      ApiConfig.REQUEST_RESEST_PASSWORD_URL,
      "POST",
      { body: { email: user.email } }
    );
    if (response.error) {
      errorModalDispatch.openModal(response.message);
    }
    if (!response.error) {
      normalModalDispatch.openModal(
        "Change Password",
        "OK",
        "We already sent the reset password email to you. Please check your mailbox to continue the process."
      );
    }
  }
  toggleIsLoading(name);
}

function submitForm(response: Partial<UserResponse & ErrorResponse>) {
  if (response.user) {
    userDispatch.updateUserInfo(response.user);
  }

  if (!response.error) {
    toggleEditModal();
  }
}

watchEffect(() => updateInfos());
</script>

<template>
  <Card class="account-view" v-bind:title="title" v-bind:isFullPage="true">
    <AccountInfoContainer
      v-for="info in accountInfos"
      v-bind:key="`account-info-${info.name}`"
      v-bind:name="info.name"
      v-bind:content="info.content"
      v-bind:isEditable="info.isEditable"
      v-bind:isLoading="info.isLoading"
      v-on:edit-info="editInfo"
    />
  </Card>
  <FormModal
    v-bind:isShowed="editModal.isModalShowed"
    v-bind:headerTitle="editModal.name"
    v-bind:inputs="editModal.inputs"
    v-bind:submitOptions="editModal.submitOptions"
    v-bind:buttonName="editModal.buttonName"
    v-bind:successStatement="editModal.successStatement"
    v-on:close="toggleEditModal"
    v-on:form-submit="submitForm"
  />
</template>

<style scoped lang="scss">
@import "@/sass/all";

@media (min-width: $pc-min-width) {
  .account-view {
    &[is-full-page="true"] {
      width: 100%;
    }
  }
}
</style>
