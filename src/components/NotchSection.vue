<script setup lang="ts">
import Notch from "./Notch.vue";
</script>

<template>
  <div class="notch-section">
    <Notch class="notch-element notch-element-left" />
    <Notch class="notch-element notch-element-right" />
  </div>
</template>

<style scoped lang="scss">
.notch-section {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.notch-element {
  width: var(--radius-xxl);

  &-right {
    transform: scaleX(-1);
  }
}
</style>
