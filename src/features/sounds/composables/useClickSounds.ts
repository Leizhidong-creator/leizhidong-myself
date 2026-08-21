import { onMounted, onBeforeUnmount } from "vue";
import { playSound } from "../utils/sounds";

import type { SoundKey } from "../types";

const SELECTOR = "[data-sound]";

export function useClickSound(): void {
  const findElementWithSound = (target: HTMLElement | null): HTMLElement | null => {
    if (!target) return null;
    return target.closest<HTMLElement>(SELECTOR);
  };

  const playSoundForElement = (el: HTMLElement | null) => {
    if (!el) return;
    const soundName = el.dataset.sound;
    if (soundName) {
      playSound(soundName as SoundKey);
    }
  };

  const handleClick = (e: MouseEvent) => {
    const el = findElementWithSound(e.target as HTMLElement | null);
    playSoundForElement(el);
  };

  const addListeners = () => {
    document.body.addEventListener("click", handleClick, { capture: false });
  };

  const removeListeners = () => {
    document.body.removeEventListener("click", handleClick, { capture: false });
  };

  onMounted(() => {
    addListeners();
  });

  onBeforeUnmount(() => {
    removeListeners();
  });
}
