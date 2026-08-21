<script setup lang="ts">
const props = defineProps<{
  renderAs?: "button" | "a" | "div";
}>();
</script>

<template>
  <component :is="props.renderAs ?? 'button'" class="clickable">
    <slot></slot>
  </component>
</template>

<style scoped lang="scss">
.clickable {
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  z-index: 0;
  transition: color 0.1s ease-in-out;

  &::after {
    content: "";
    position: absolute;
    top: -4px;
    left: -8px;
    width: calc(100% + 16px);
    height: calc(100% + 8px);
    background-color: var(--color-hover, var(--color-black-400));
    z-index: -1;
    border-radius: var(--radius-md);
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
  }

  @include mixins.hover {
    &:hover {
      color: var(--color-white-400);

      &::after {
        opacity: 1;
      }
    }
  }
}
</style>
