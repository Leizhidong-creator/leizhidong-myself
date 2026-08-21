<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { lerp } from "../utils/math";
import gsap from "gsap";
import ArrowRightLong from "./icons/ArrowRightLong.vue";
import { path } from "../composables/useRouteObserver";
import { raycast } from "../three/utils/raycast";
import { projectId } from "../composables/useRouteObserver";

const cursorWrapperRef = ref<HTMLElement | null>(null);
const cursorScaleRef = ref<HTMLElement | null>(null);
const mouseX = ref(0);
const mouseY = ref(0);
const currentX = ref(0);
const currentY = ref(0);
const isVisible = ref(false);
const cursorType = ref<"circle-black" | "arrow" | "arrow-external" | "circle-white" | null>(null);
const detectedType = ref<"circle-black" | "arrow" | "arrow-external" | "circle-white" | null>(null);

const lerpSpeed = 0.1;

const tick = () => {
  // Lerp the current position towards the mouse position
  currentX.value = lerp(currentX.value, mouseX.value, lerpSpeed);
  currentY.value = lerp(currentY.value, mouseY.value, lerpSpeed);

  const hoveringBox = raycast.getHoveringBox();

  if (hoveringBox) {
    if (!isVisible.value) {
      isVisible.value = true;
      currentX.value = mouseX.value;
      currentY.value = mouseY.value;
    }
    cursorType.value = "circle-black";
  } else if (detectedType.value) {
    if (!isVisible.value) {
      isVisible.value = true;
      currentX.value = mouseX.value;
      currentY.value = mouseY.value;
    }
    cursorType.value = detectedType.value;
  } else {
    isVisible.value = false;
    cursorType.value = null;
  }

  if (cursorWrapperRef.value) {
    cursorWrapperRef.value.style.transform = `translate(${currentX.value}px, ${currentY.value}px)`;
  }

  if (cursorScaleRef.value) {
    const scale = isVisible.value ? 1 : 0;
    cursorScaleRef.value.style.transform = `scale(${scale})`;
  }
};

const checkIfHasCursorAttribute = (
  element: Element | null,
): "circle-black" | "arrow" | "arrow-external" | "circle-white" | null => {
  if (!element) return null;
  if (element instanceof HTMLElement) {
    const cursor = element.dataset.cursor;
    if (cursor === "circle-black" || cursor === "arrow" || cursor === "arrow-external" || cursor === "circle-white") {
      return cursor;
    }
  }
  return checkIfHasCursorAttribute(element.parentElement);
};

const handleMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
  detectedType.value = checkIfHasCursorAttribute(e.target as Element);
};

onMounted(() => {
  // Initialize position to center of screen
  mouseX.value = window.innerWidth / 2;
  mouseY.value = window.innerHeight / 2;
  currentX.value = mouseX.value;
  currentY.value = mouseY.value;

  window.addEventListener("mousemove", handleMouseMove);
  gsap.ticker.add(tick);
});

// Watch for route changes and reset cursor
watch(
  () => path.value,
  () => {
    isVisible.value = false;
    cursorType.value = null;
  },
);

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
  gsap.ticker.remove(tick);
});
</script>

<template>
  <div ref="cursorWrapperRef" class="cursor-wrapper" :class="{ [`project-${projectId}`]: projectId !== null }">
    <div ref="cursorScaleRef" class="cursor-scale">
      <div class="cursor cursor-circle-black" :class="{ 'cursor-active': cursorType === 'circle-black' }" />
      <div class="cursor cursor-circle-white" :class="{ 'cursor-active': cursorType === 'circle-white' }" />
      <div class="cursor cursor-arrow" :class="{ 'cursor-active': cursorType === 'arrow' }">
        <ArrowRightLong class="cursor-arrow-icon" />
      </div>
      <div class="cursor cursor-arrow-external" :class="{ 'cursor-active': cursorType === 'arrow-external' }">
        <ArrowRightLong class="cursor-arrow-external-icon" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
  display: none;

  // Hide cursor on touch devices
  @include mixins.hover {
    display: block;
  }
}

.cursor-scale {
  position: relative;
  transform-origin: center;
  will-change: transform;
  transition: transform 0.1s ease-in-out;
}

.cursor {
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.1s ease-in-out;

  &-active {
    opacity: 1;
  }

  &-circle-black {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 4px solid var(--color-text-400);
  }

  &-circle-white {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 4px solid var(--color-white-400);
  }

  &-arrow {
    width: 54px;
    height: 54px;
    transition:
      background-color 0.1s ease-in-out,
      opacity 0.1s ease-in-out;
    background-color: var(--color-accent-400, var(--color-orange-400));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    //border: var(--stroke-md) solid var(--color-white-400);

    &-icon {
      color: var(--color-accent-text-400, var(--color-white-400));
      --icon-color: var(--color-accent-text-400, var(--color-white-400));
      width: 24px;
    }
  }

  &-arrow-external {
    width: 54px;
    height: 54px;
    transition:
      background-color 0.1s ease-in-out,
      opacity 0.1s ease-in-out;
    background-color: var(--color-accent-400, var(--color-orange-400));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    //border: var(--stroke-md) solid var(--color-white-400);

    &-icon {
      color: var(--color-accent-text-400, var(--color-white-400));
      --icon-color: var(--color-accent-text-400, var(--color-white-400));
      width: 24px;
      transform: rotate(-45deg);
    }
  }
}
</style>
