<script setup lang="ts">
import { isTransitioning } from "../../../composables/useProjectTransition";
import { projectId, recentProjectId } from "../../../composables/useRouteObserver";
</script>

<template>
  <div
    :class="[
      'project-background-blend',
      typeof recentProjectId === 'string' && `project-${recentProjectId}`,
      isTransitioning && `project-background-blend-transitioning`,
      typeof projectId === 'string' && `project-background-blend-visible`,
    ]"
  ></div>
  <div
    :class="[
      'project-background',
      typeof recentProjectId === 'string' && `project-${recentProjectId}`,
      typeof projectId === 'string' && `project-background-visible`,
      isTransitioning && `project-background-transitioning`,
    ]"
  ></div>
</template>

<style scoped lang="scss">
.project-background {
  position: fixed;
  top: calc(var(--radius-xxl) * -1);
  left: 0;
  height: calc(100% + var(--radius-xxl));
  width: 100%;
  background-color: var(--color-background-300);
  z-index: calc(var(--z-index-project-background) - 3);
  pointer-events: none;
  transition: transform var(--transition-route-duration) var(--transition-route-ease);
  visibility: hidden;
  transform: translate3d(0, 100%, 0);
  border-radius: var(--radius-xxl) var(--radius-xxl) 0 0;

  &-blend {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: calc(var(--z-index-project-background) - 4);
    background-color: rgb(21, 34, 66);
    transition: opacity var(--transition-route-duration);
    opacity: 0;
    pointer-events: none;
    visibility: hidden;

    &-visible {
      opacity: 0.5;
    }

    &-transitioning {
      visibility: visible;
    }
  }

  &-visible {
    transform: translate3d(0, 0, 0);
  }

  &-transitioning {
    visibility: visible;
  }
}
</style>
