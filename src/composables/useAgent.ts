import { onMounted, ref } from "vue";

export const isTouch = ref(false);

export const useAgent = () => {
  onMounted(() => {
    isTouch.value =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  });

  return {
    isTouch,
  };
};
