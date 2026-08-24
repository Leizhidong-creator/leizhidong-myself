<script setup lang="ts">
import { projectId, projectVisible, recentProjectId } from "../../../composables/useRouteObserver";
import { isTransitioning } from "../../../composables/useProjectTransition";
import { ref, watch } from "vue";
import { projectModules } from "../../../content/projects";
import ProjectContent from "./ProjectContent.vue";
import Footer from "../../../components/Footer.vue";
import { locale } from "../../../i18n/store";
import { lenis } from "../../../composables/useScroll";
import { createProjectLoader } from "../utils/projectLoader";

import type { Locale } from "../../../i18n/types";
import type { ProjectContent as ProjectContentData } from "../../../content/types";

const loading = ref(false);
const content = ref<ProjectContentData | null>(null);
const error = ref<Error | null>(null);
let loadVersion = 0;

const projectLoader = createProjectLoader(async (project: string) => {
  const loadModule = projectModules[locale.value as Locale][project];
  if (!loadModule) throw new Error(`Unknown project ${project}`);
  const module = await loadModule();
  return module.default;
});

watch(
  [projectId, locale],
  async ([currentProjectId]) => {
    content.value = null;
    error.value = null;

    if (!currentProjectId) {
      projectLoader.cancel();
      loading.value = false;
      return;
    }

    loading.value = true;
    const version = ++loadVersion;
    try {
      const loadedContent = await projectLoader.load(currentProjectId);
      if (loadedContent) content.value = loadedContent;
    } catch (err) {
      if (projectLoader.current.value === null) {
        error.value = new Error(`Failed to fetch project ${currentProjectId}`);
      }
    } finally {
      if (version === loadVersion) loading.value = false;
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
        :key="recentProjectId"
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
