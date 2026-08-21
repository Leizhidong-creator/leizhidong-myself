import { ref, watch } from "vue";
import { path } from "./useRouteObserver";

const isFirstRoute = ref(true);
let hasNavigated = false;

export function useFirstRoute() {
  watch(path, (newPath, oldPath) => {
    if (!hasNavigated && newPath !== oldPath) {
      hasNavigated = true;
      isFirstRoute.value = false;
    }
  });

  return {
    isFirstRoute,
  };
}
