<script setup lang="ts">
import { computed } from "vue";
import ButtonWrapper from "./ButtonWrapper.vue";

import type { Props as ButtonWrapperProps } from "./ButtonWrapper.vue";

export interface Props extends ButtonWrapperProps {
  size?: "sm" | "md" | "lg";
}

const props = defineProps<Props>();

const classes = computed(() => ["button", `button-size-${props.size ?? "md"}`, "children-unclickable"]);
</script>

<template>
  <ButtonWrapper v-bind="props" :class="classes">
    <slot></slot>
  </ButtonWrapper>
</template>

<style scoped lang="scss">
.button {
  display: flex;
  align-items: center;
  justify-content: center;

  &-size {
    &-sm {
      height: 38px;
      padding: 0 16px;
    }

    &-md {
      height: 44px;
      padding: 0 26px;
    }

    &-lg {
      height: 50px;
      padding: 0 34px;
    }
  }
}
</style>
