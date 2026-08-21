<template>
  <div class="layout"><slot></slot></div>
</template>

<style scoped lang="scss">
.layout {
  //width: calc(var(--svw) * 100);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: var(--z-index-layout);
  position: relative;
}
</style>
