import { ref, computed, onMounted, onUnmounted } from "vue";
import { isTransitioning } from "./useProjectTransition";

// -----------------------------------------------------------------------------
// GLOBAL REACTIVE PATH
// -----------------------------------------------------------------------------

export const path = ref(typeof window !== "undefined" ? window.location.pathname : "/");

// -----------------------------------------------------------------------------
// COMPUTED HELPERS
// -----------------------------------------------------------------------------

export const isProjectRoute = (path: string) => {
  return path.match(/^\/project\/([^/]+)$/);
};

export const projectId = computed(() => {
  const match = isProjectRoute(path.value);
  return match ? match[1] : null;
});

export const projectVisible = computed(() => {
  return projectId.value !== null && !isTransitioning.value;
});

export const recentProject = ref<string | null>(null);

export const recentProjectId = computed(() => {
  if (projectId.value) {
    recentProject.value = projectId.value;
  }
  return recentProject.value;
});

// -----------------------------------------------------------------------------
// HISTORY PATCH (safe & minimal)
// -----------------------------------------------------------------------------

let historyPatched = false;

function patchHistory() {
  if (historyPatched || typeof window === "undefined") return;
  historyPatched = true;

  const wrap = (key: "pushState" | "replaceState") => {
    const original = history[key];
    history[key] = function (...args) {
      // @ts-ignore
      original.apply(this, args);

      // IMPORTANT FIX: delay events to avoid reactivity collisions
      queueMicrotask(() => {
        window.dispatchEvent(new Event("route-change"));
      });
    };
  };

  wrap("pushState");
  wrap("replaceState");
}

// -----------------------------------------------------------------------------
// COMPOSABLE
// -----------------------------------------------------------------------------

export function useRouteObserver() {
  const update = () => {
    const newPath = window.location.pathname;
    if (newPath !== path.value) {
      path.value = newPath;
    }
  };
  onMounted(() => {
    patchHistory();
    update();

    window.addEventListener("popstate", update);
    window.addEventListener("route-change", update);
  });

  onUnmounted(() => {
    window.removeEventListener("popstate", update);
    window.removeEventListener("route-change", update);
  });

  return {
    path,
    projectId,
    recentProjectId,
  };
}
