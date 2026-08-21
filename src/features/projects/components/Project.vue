<script setup lang="ts">
import { projectId, projectVisible, recentProjectId } from "../../../composables/useRouteObserver";
import { isTransitioning } from "../../../composables/useProjectTransition";
import { ref, watch } from "vue";
import { projectModules } from "../../../content/projects";
import ProjectContent from "./ProjectContent.vue";
import Footer from "../../../components/Footer.vue";
import { locale } from "../../../i18n/store";
import { lenis } from "../../../composables/useScroll";

import type { Locale } from "../../../i18n/types";

const loading = ref(true);
const content = ref(null);
const error = ref<Error | null>(null);

const fetchProject = async (project: string | undefined) => {
  try {
    const module = await projectModules[locale.value as Locale][project as string].default;
    content.value = module;
    loading.value = false;
  } catch (err) {
    error.value = new Error(`Failed to fetch project ${project}`);
  } finally {
    loading.value = false;
  }
};

watch(
  [recentProjectId, locale],
  () => {
    if (recentProjectId.value) {
      fetchProject(recentProjectId.value);
    }
  },
  { immediate: true },
);

watch(
  [projectId, isTransitioning, locale],
  () => {
    if (!projectId.value || isTransitioning.value) return;
    lenis.value?.scrollTo(0, { immediate: true });
  },
  { immediate: true },
);
</script>

<template>
  <div
    ref="projectRef"
    :class="[
      'project',
      recentProjectId !== null && `project-${recentProjectId}`,
      isTransitioning && `project-transitioning`,
      projectVisible && `project-visible`,
    ]"
  >
    <div :class="['project-content-wrapper', projectVisible && `project-content-wrapper-visible`]">
      <ProjectContent
        v-if="content && recentProjectId && projectVisible"
        :content="content"
        :projectId="recentProjectId"
      />
      <Footer :class="['project-footer', `project-${recentProjectId}`]"></Footer>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project {
  min-height: calc(var(--lvh) * 100);
  background-color: var(--color-background-300);
  max-width: calc(var(--lvw) * 100);
  overflow: hidden;

  &-content-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    opacity: 0;
    transition: opacity 0.4s ease-out;

    &-visible {
      opacity: 1;
    }
  }

  &-footer {
    position: relative;
    margin-top: auto;
    color: var(--color-text-400);
  }

  ::selection {
    background: var(--color-accent-400);
    color: var(--color-accent-text-400);
    text-shadow: none;
  }

  ::-moz-selection {
    background: var(--color-accent-400);
    color: var(--color-accent-text-400);
    text-shadow: none;
  }
}
</style>
