<script setup lang="ts">
import { reactive, computed } from "vue";

import InputStatusBar from "@/modules/common/components/InputStatusBar.vue";
import InputTooltip from "@/modules/common/components/InputTooltip.vue";
import InputPasswordSwitch from "@/modules/common/components/InputPasswordSwitch.vue";

import { convertCamelCase } from "@/modules/common/utils/convert-camel-case.util";

const props = defineProps<{
  name: string;
  type: "text" | "email" | "password";
  modelValue: string;
  disabled?: boolean;
  isHidden?: boolean;
  isValid: boolean;
  errorMessages: string[];
  autocomplete?: "username" | "current-password" | "off";
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const input = reactive({
  labelName: convertCamelCase(props.name),
  noErrorMessages: computed(() => props.errorMessages.length === 0),
  isBlank: computed(() => props.modelValue?.length === 0),
  isFocus: false,
  isPasswordType: props.type === "password",
  isPasswordShowed: false,
  type: props.type,
});

function updateInputType(type: "text" | "email" | "password") {
  input.type = type;
}

function handlePasswordSwitch() {
  if (input.isPasswordShowed) {
    updateInputType("password");
  }
  if (!input.isPasswordShowed) {
    updateInputType("text");
  }
  input.isPasswordShowed = !input.isPasswordShowed;
}

function toggleIsFocus() {
  input.isFocus = !input.isFocus;
}

function updateModelValue(event: Event) {
  emit("update:modelValue", (event.target as HTMLInputElement).value);
}
</script>

<template>
  <label class="input-container" v-show="!props.isHidden">
    <div class="input-with-status-bar-and-password-switch">
      <input
        class="input"
        v-bind:name="props.name"
        v-bind:type="input.type"
        v-bind:value="props.modelValue"
        v-bind:placeholder="input.labelName"
        v-bind:disabled="props.disabled"
        v-bind:autocomplete="props.autocomplete ?? 'off'"
        v-bind:is-valid="props.isValid || input.isBlank"
        v-bind:is-password="input.isPasswordType"
        v-on:input="updateModelValue"
        v-on:focus="toggleIsFocus"
        v-on:blur="toggleIsFocus"
        spellCheck="false"
      />
      <InputPasswordSwitch
        v-if="input.isPasswordType"
        v-bind:isOpen="input.isPasswordShowed"
        v-on:click="handlePasswordSwitch"
      />
      <InputStatusBar
        v-bind:isValid="props.isValid"
        v-bind:isBlank="input.isBlank"
      />
    </div>
    <InputTooltip
      v-bind:errorMessages="props.errorMessages"
      v-bind:isShowed="
        input.isFocus && !input.noErrorMessages && !input.isBlank
      "
    />
  </label>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.input-container {
  display: grid;
  row-gap: 0.5rem;
  position: relative;

  .input-with-status-bar-and-password-switch {
    position: relative;
    display: flex;
    align-items: center;

    .input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: $input-border-radius;
      background-color: $input-color;
      color: $input-text-color;
      font-size: 1rem;
      border: none;

      &:focus {
        outline-width: medium;
        outline-style: solid;
        background-color: $input-focus-color;
        transition: background-color 0.5s ease;
        outline-color: $theme-color;

        &[is-valid="false"] {
          outline-color: $red-color;
        }
      }

      &::placeholder {
        color: $input-placeholder-color;
      }

      &::-ms-reveal {
        display: none;
      }

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px $input-color inset;
        -webkit-text-fill-color: $input-text-color;

        &:focus {
          box-shadow: 0 0 0 1000px $input-focus-color inset;
          transition: box-shadow 0.5s ease;
        }
      }

      &[disabled] {
        cursor: not-allowed;
      }

      &[is-password="true"] {
        padding-right: 3.5rem;
      }
    }
  }
}
</style>
