import { ref, watch, onMounted, onUnmounted } from "vue";
import { resources } from "../utils/resources";
import { createPreloaderGate } from "./preloaderGate";
import { threeReady } from "../three";

export const preloaderVisible = ref(true);

export const usePreloader = () => {
  const progress = ref(0);
  const resourcesProgress = ref(0);
  let gate: ReturnType<typeof createPreloaderGate> | null = null;

  const revealApp = () => {
    const preloader = document.querySelector(".preloader") as HTMLElement | null;
    document.body.classList.remove("is-loading");
    preloader?.classList.add("preloader-hidden");
    preloaderVisible.value = false;
  };

  onMounted(() => {
    resources.on("progress", (newProgress) => {
      resourcesProgress.value = newProgress;
    });

    gate = createPreloaderGate(revealApp);
    if (threeReady.value) {
      gate.markReady();
    } else {
      const stopWatchingThree = watch(threeReady, (ready) => {
        if (!ready) return;
        gate?.markReady();
        stopWatchingThree();
      });
    }
  });

  onUnmounted(() => gate?.cancel());

  watch(
    resourcesProgress,
    (newProgress) => {
      progress.value = 0.25 + newProgress * 0.75;
    },
    { immediate: true },
  );

  watch(
    progress,
    (newProgress) => {
      const rect = document.querySelector(".preloader-rect") as HTMLElement | null;

      if (rect) rect.style.transform = `scaleY(${newProgress})`;
    },
    { immediate: true },
  );
};
