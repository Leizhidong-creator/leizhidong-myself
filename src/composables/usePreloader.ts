import { onUnmounted, ref, watch } from "vue";
import gsap from "gsap";
import { criticalBoot } from "../utils/criticalBoot";

export const preloaderVisible = ref(true);

export const usePreloader = () => {
  const progress = ref(criticalBoot.progress);

  const stopProgress = criticalBoot.onProgress((newProgress) => {
    progress.value = newProgress;
  });
  const stopReady = criticalBoot.onReady(() => {
    gsap.delayedCall(0.2, () => {
      const preloader = document.querySelector(".preloader") as HTMLElement | null;
      document.body.classList.remove("is-loading");
      preloader?.classList.add("preloader-hidden");
      preloaderVisible.value = false;
    });
  });

  watch(
    progress,
    (newProgress) => {
      const rect = document.querySelector(".preloader-rect") as HTMLElement | null;
      if (rect) rect.style.transform = `scaleY(${newProgress})`;
    },
    { immediate: true },
  );

  onUnmounted(() => {
    stopProgress();
    stopReady();
  });
};
