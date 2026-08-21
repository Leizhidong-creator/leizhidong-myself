<script setup lang="ts">
import { computed, ref, useSlots } from "vue";

const wrapperRef = ref<HTMLDivElement | null>(null);
defineExpose({ wrapperRef });

const props = defineProps<{
  footer?: boolean;
}>();

const slots = useSlots();
const classes = computed(() => ["hologram-box", { "hologram-box-has-title": !!slots.title }]);
</script>

<template>
  <div :class="classes" ref="wrapperRef">
    <div class="hologram-box-header" v-if="slots.title">
      <div class="hologram-box-header-content">
        <h2 class="hologram-box-header-title">
          <slot name="title"></slot>
        </h2>
      </div>
      <div class="hologram-box-curve">
        <svg viewBox="0 0 51 34" fill="none" xmlns="http://www.w3.org/2000/svg" class="hologram-box-curve-svg">
          <path d="M47.6098 33C24.1951 33 26.5366 1 3.12195 1H0V33H47.6098Z" class="hologram-box-curve-fill" />
          <path
            d="M0 1H3.12195C26.5366 1 24.1951 33 47.6098 33H50.7317"
            vector-effect="non-scaling-stroke"
            class="hologram-box-curve-path"
          />
        </svg>
      </div>
      <div class="hologram-box-header-notch-right"></div>
    </div>
    <div class="hologram-box-content">
      <slot></slot>
    </div>
    <div class="hologram-box-footer" v-if="props.footer">
      <svg class="hologram-box-footer-svg" viewBox="0 0 255 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.257324 0.428772L14.3995 8.91406C18.1502 11.1645 23.2373 12.4288 28.5416 12.4288H225.973C231.277 12.4288 236.364 11.1645 240.115 8.91405L254.257 0.428772"
          class="hologram-box-footer-path"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hologram-box {
  position: relative;
  will-change: clip-path;
  //filter: drop-shadow(0 -10px rgb(52, 191, 255, 0.2)) drop-shadow(0 10px rgb(52, 191, 255, 0.2));

  &-content {
    padding-top: calc(var(--space-sm) - var(--radius-md));
    width: 100%;
    border: var(--stroke-md) solid var(--color-cyan-400);
    position: relative;
    border-radius: 0 0 var(--radius-md) var(--radius-md);
    border-top-width: 0;
    background: linear-gradient(to bottom, var(--color-hologram-top) 0%, var(--color-hologram-bottom) 95%);
    font-size: var(--font-size-md);
    line-height: var(--line-height-copy);

    @include mixins.mq("md") {
      font-size: var(--font-size-lg);
      padding-top: calc(var(--space-md) - var(--radius-md));
    }
  }

  &-curve {
    padding-bottom: var(--radius-md);
    max-width: 43px;
    display: flex;
    justify-content: center;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: var(--stroke-md);
      left: -1px;
      width: calc(100% + 2px);
      height: var(--radius-md);
      background-color: var(--color-hologram-top);
      z-index: -1;
    }

    &-svg {
      overflow: visible;
      min-width: 51px;
      height: 34px;
      z-index: 2;
    }

    &-fill {
      fill: var(--color-hologram-top);
    }

    &-path {
      stroke: var(--color-cyan-400);
      stroke-width: var(--stroke-md);
    }
  }

  &-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    height: calc(var(--radius-md) + 34px - var(--stroke-md));
    position: relative;
    top: 1px;
    z-index: -1;

    &-title {
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    &-content {
      //top left border radius
      border-radius: var(--radius-md) 0 0 0;
      border: var(--stroke-md) solid var(--color-cyan-400);
      border-bottom-width: 0;
      border-right-width: 0;
      width: fit-content;
      height: 100%;
      padding: var(--space-xxs) var(--space-sm);
      background-color: var(--color-hologram-top);

      @include mixins.mq("md") {
        padding: var(--space-xxs) var(--space-md);
      }
    }

    &-notch-right {
      position: relative;
      align-self: flex-end;
      width: 100%;
      height: var(--radius-md);
      border: var(--stroke-md) solid var(--color-cyan-400);
      border-left-width: 0;
      border-bottom-width: 0;
      border-radius: 0 var(--radius-md) 0 0;
      background-color: var(--color-hologram-top);
      z-index: -2;
    }
  }

  &-footer {
    position: absolute;
    bottom: 0;
    right: var(--space-md);
    transform: translate(0, 100%);
    width: 96px;

    &-path {
      fill: var(--color-cyan-400);
    }

    &-svg {
      overflow: visible;
    }
  }
}
</style>
