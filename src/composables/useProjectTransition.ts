import { ref, watch } from "vue";
import { projectId } from "./useRouteObserver";

export const ROUTE_TRANSITION_DURATION = 500;
export const isTransitioning = ref(false);

let timeout: ReturnType<typeof setTimeout> | null = null;

export const useProjectTransition = () => {
  watch(projectId, (newId, oldId, onInvalidate) => {
    // if neither entering nor leaving project → do nothing
    const entering = oldId === null && newId !== null;
    const leaving = oldId !== null && newId === null;

    if (!entering && !leaving) return;

    // clear old timeout
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    isTransitioning.value = true;

    timeout = setTimeout(() => {
      isTransitioning.value = false;
      timeout = null;
    }, ROUTE_TRANSITION_DURATION);

    onInvalidate(() => {
      if (timeout) clearTimeout(timeout);
    });
  });

  return { isTransitioning };
};
