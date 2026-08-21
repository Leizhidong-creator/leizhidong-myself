<script setup lang="ts">
import Tag from "../../../components/Tag.vue";
import Button from "../../../components/Button.vue";
import { t } from "../../../i18n/utils/translate";
import Link from "../../../components/Link.vue";
import { projectId } from "../../../composables/useRouteObserver";
import { ref, watch } from "vue";

import type { ProjectContent } from "../../../content/types";

const { content } = defineProps<{
  content: ProjectContent;
}>();

const animationKey = ref(0);

// Force animation restart when projectId changes
watch(projectId, () => {
  animationKey.value++;
});
</script>

<template>
  <div class="project-hero grid">
    <div class="project-hero-top">
      <div class="project-hero-title-wrapper">
        <h1 class="project-hero-title" :key="animationKey">
          {{ content.title }}
        </h1>
      </div>
      <div class="project-hero-tags">
        <Tag v-for="tag in content.tags" :key="tag" :variant="tag" />
      </div>
    </div>
    <p class="project-hero-description" v-html="content.description"></p>
    <div class="project-hero-buttons">
      <Link v-if="content.live" :href="content.live" external class="project-hero-button" data-cursor="arrow-external">
        <Button renderAs="div" variant="accent" class="children-unclickable" data-hoversound="hover">{{
          t("live-view")
        }}</Button>
      </Link>
      <Link
        v-if="content.source"
        :href="content.source"
        external
        class="project-hero-button"
        data-cursor="arrow-external"
      >
        <Button renderAs="div" variant="border" class="children-unclickable" data-hoversound="hover">{{
          t("source-code")
        }}</Button>
      </Link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-hero {
  padding: 0 var(--space-outer);
  padding-bottom: 48px;
  padding-top: calc(var(--height-header) + 24px);

  @include mixins.mq("md") {
    padding-bottom: 64px;
  }

  &-button {
    flex: 0.5;

    @include mixins.mq("md") {
      width: fit-content;
    }
  }

  &-buttons {
    grid-row: 3;
    grid-column: 1 / 13;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    margin-top: var(--space-md);
    width: 100%;
    grid-column: 1 / 13;

    @include mixins.mq("md") {
      gap: var(--space-md);
      width: fit-content;
      grid-column: 1 / 6;
      grid-row: 2;
      margin-top: 0;
    }

    @include mixins.mq("lg") {
      grid-column: 2 / 6;
    }
  }

  &-video {
    grid-column: 1 / span 12;
    align-self: center;

    @include mixins.mq("md") {
      grid-column: 1 / 8;
    }

    @include mixins.mq("lg") {
      grid-column: 2 / 8;
    }
  }

  &-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  &-title {
    font-size: var(--font-size-title-lg);
    color: var(--color-text-400);
    line-height: var(--line-height-title);
    transform: translateY(0%);
    animation: project-hero-title-visible 0.5s var(--ease-smooth);

    @include mixins.mq("md") {
      font-size: var(--font-size-title-xl);
    }

    @keyframes project-hero-title-visible {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    &-wrapper {
      overflow: hidden;
    }
  }

  &-description {
    color: var(--color-text-400);
    line-height: var(--line-height-copy);
    grid-column: 1 / 13;
    align-self: center;

    @include mixins.mq("md") {
      grid-row: 1;
      grid-column: 6 / 12;
    }

    @include mixins.mq("lg") {
      grid-row: 1;
      grid-column: 7 / 12;
    }

    @include mixins.mq("xl") {
      grid-row: 1;
      grid-column: 7 / 11;
    }
  }

  &-top {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    grid-row: 1;
    align-self: top;
    grid-column: 1 / 13;

    @include mixins.mq("md") {
      grid-column: 1 / 6;
    }

    @include mixins.mq("lg") {
      grid-column: 2 / 6;
    }
  }
}
</style>
