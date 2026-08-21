<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Vector3 } from "three";
import { camera } from "../three/core/camera";
import { sizes } from "../utils/sizes";
import gsap from "gsap";
import { sceneWeightsInOut } from "../animations/scenes";

const props = defineProps<{
  point: Vector3;
}>();

const wrapperRef = ref<HTMLDivElement | null>(null);

let lastTransform = "";

const updatePosition = () => {
  if (!wrapperRef.value) return;
  if (sceneWeightsInOut.about.in === 0) return;
  if (sceneWeightsInOut.about.out === 1) return;

  const isLandscape = sizes.isLandscape;
  const { point } = props;

  const screenPos = isLandscape ? camera.project(point) : { x: 0, y: 0 };

  const transform = isLandscape ? `translate(${screenPos.x}px, ${screenPos.y}px)` : `translate(0px, 0px)`;

  if (transform !== lastTransform) {
    wrapperRef.value.style.transform = transform;
    lastTransform = transform;
  }
};

onMounted(() => {
  gsap.ticker.add(updatePosition);
});

onBeforeUnmount(() => {
  gsap.ticker.remove(updatePosition);
});
</script>

<template>
  <div ref="wrapperRef" class="projected-element">
    <slot> </slot>
  </div>
</template>

<style scoped lang="scss">
.projected-element {
  width: 100%;
  height: 100%;

  @include mixins.landscape {
    width: 0;
    height: 0;
    position: relative;
  }
}
</style>
