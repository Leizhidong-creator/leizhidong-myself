//import { animations as avatarAnimations } from "../three/objects/avatar/animations";
import { isFeatureEnabled } from "../utils/features";
import gsap from "gsap";
import { mouse } from "../three/objects/room/mouse";

const play = () => {
  if (!isFeatureEnabled("introWave")) return;

  //avatarAnimations.wave();

  const tl = gsap.timeline();
  tl.set(mouse.enabled, { value: true }, 0.3);
};

export const intro = { play };
