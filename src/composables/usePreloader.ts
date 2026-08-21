import { ref, watch, onMounted } from "vue";
import { resources } from "../utils/resources";
import gsap from "gsap";

export const preloaderVisible = ref(true);

export const usePreloader = () => {
  const progress = ref(0);
  const resourcesProgress = ref(0);

  onMounted(() => {
    resources.on("progress", (newProgress) => {
      resourcesProgress.value = newProgress;
    });
  });

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
      const rect = document.querySelector(".preloader-rect") as HTMLElement;
      const preloader = document.querySelector(".preloader") as HTMLElement;
      if (newProgress === 1) {
        gsap.delayedCall(0.2, () => {
          document.body.classList.remove("is-loading");
          preloader.classList.add("preloader-hidden");
          preloaderVisible.value = false;
        });
      }

      if (rect) rect.style.transform = `scaleY(${newProgress})`;
    },
    { immediate: true },
  );
};
