<script setup lang="ts">
import { reactive, ref, computed, watchEffect, type Ref } from "vue";

import { parseProxy } from "@/modules/common/utils/parse-proxy.util";
import { convertCamelCase } from "@/modules/common/utils/convert-camel-case.util";

const props = defineProps<{
  name: string;
  modelValue: string;
  length: number;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputRefs: Ref<Ref<null | HTMLInputElement>[]> = ref([]);
for (let i = 0; i < props.length; i++) inputRefs.value.push(ref(null));

const passCode = reactive({
  passCodeValue: "",
  values: inputRefs.value.map(() => ""),
  prevValues: inputRefs.value.map(() => ""),
  labelName: computed(() => convertCamelCase(props.name)),
});

watchEffect(
  () =>
    (passCode.passCodeValue = passCode.values.join("").slice(0, props.length))
);

watchEffect(() => updateModelValue());

function updateModelValue() {
  emit("update:modelValue", passCode.passCodeValue);
}

function focusElement(index: number) {
  const targetElement = parseProxy(inputRefs.value[index].value);
  targetElement.focus();
}

function handleInput(event: Event) {
  const currentElement = event.currentTarget as HTMLInputElement;
  const currentIndex = Number(currentElement.getAttribute("index"));
  const currentValue = currentElement.value;
  const prevValue = passCode.prevValues[currentIndex];
  const refreshedValue =
    currentValue.slice(0, 1) === prevValue
      ? currentValue.slice(1)
      : currentValue.slice(-1) === prevValue
      ? currentValue.slice(0, -1)
      : currentValue;

  passCode.values = passCode.values.map((value, index) => {
    const keepCase =
      index < currentIndex || index >= currentIndex + refreshedValue.length;
    if (keepCase) {
      return value;
    } else {
      return refreshedValue[index - currentIndex];
    }
  });

  passCode.prevValues = { ...passCode.values };

  const targetIndex = Math.min(
    currentIndex + refreshedValue.length,
    props.length - 1
  );
  focusElement(targetIndex);
}

function handleKeydown(event: KeyboardEvent) {
  const currentElement = event.currentTarget as HTMLInputElement;
  const currentIndex = Number(currentElement.getAttribute("index"));
  const currentValue = passCode.values[currentIndex];
  let targetIndex = null;
  if (event.key === "Backspace") {
    passCode.values[currentIndex] = "";
    if (!currentValue) {
      targetIndex = Math.max(currentIndex - 1, 0);
    }
  }
  if (event.key === "ArrowLeft") {
    targetIndex = Math.max(currentIndex - 1, 0);
  }
  if (event.key === "ArrowRight") {
    targetIndex = Math.min(currentIndex + 1, props.length - 1);
  }
  if (targetIndex !== null) {
    focusElement(targetIndex);
  }
}
</script>

<template>
  <label class="pass-code-container">
    <p>{{ passCode.labelName }}</p>
    <div class="pass-code">
      <input
        v-for="(ref, index) in inputRefs"
        v-bind:key="`pass-code-${index}`"
        class="pass-code__box"
        v-model="passCode.values[index]"
        v-bind:disabled="props.isLoading"
        v-bind:index="index"
        type="text"
        v-on:input="handleInput"
        v-on:keydown="handleKeydown"
        v-bind:ref="ref"
      />
    </div>
  </label>
</template>

<style scoped lang="scss">
@import "@/sass/all";

.pass-code-container {
  display: grid;
  row-gap: 0.5rem;

  .pass-code {
    display: grid;
    grid-auto-flow: column;
    column-gap: 0.5rem;

    .pass-code__box {
      width: 100%;
      padding: 1.5rem 0;
      text-align: center;
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
    }
  }
}
</style>
