<script setup lang="ts">
import ArrowRight from "../../../components/icons/ArrowRight.vue";
import { t } from "../../../i18n/utils/translate";

import type { ProjectPreview } from "../../../content/types";

const { project } = defineProps<{
  project: ProjectPreview;
}>();
</script>

<template>
  <div class="next-project children-unclickable" data-hoversound="hover">
    <img :src="project.thumbnail" :alt="project.title" class="next-project-image" />
    <div class="next-project-content">
      <p class="next-project-prefix">{{ t("next-project") }}:</p>
      <h3 class="next-project-title">{{ project.title }}</h3>
    </div>
    <ArrowRight class="next-project-arrow" />
  </div>
</template>

<style scoped lang="scss">
.next-project {
  border: var(--stroke-md) solid var(--color-grayscale-400);
  padding: var(--space-xxs);
  padding-right: var(--space-sm);
  border-radius: var(--radius-md);
  color: var(--color-text-400);
  --icon-color: var(--color-text-400);
  transition: background-color 0.1s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  justify-content: space-between;
  height: 64px;

  @include mixins.mq("sm") {
    height: 80px;
  }

  @include mixins.mq("md") {
    padding: var(--space-xs);
    padding-right: var(--space-md);
    height: 120px;
  }

  @include mixins.mq("lg") {
    padding-right: var(--space-lg);
  }

  &-prefix {
    color: var(--color-text-300);
    white-space: nowrap;
  }

  &-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: var(--space-sm);
    gap: var(--space-xxs);

    @include mixins.mq("md") {
      padding-left: var(--space-md);
    }
  }

  &-title {
    font-size: var(--font-size-title-xxs);
    line-height: var(--line-height-title);
    font-weight: 700;
    color: var(--color-text-400);

    @include mixins.mq("md") {
      font-size: var(--font-size-title-xs);
    }
  }

  &-arrow {
    width: var(--icon-size-md);
    color: var(--color-text-300);
    --icon-color: var(--color-text-400);
  }

  &-image {
    border-radius: var(--radius-sm);
    max-height: 100%;
    width: auto;
  }

  @include mixins.hover {
    &:hover {
      background-color: var(--color-grayscale-400);
    }
  }
}
</style>
