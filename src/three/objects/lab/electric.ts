import { ShaderMaterial } from "three";
import gsap from "gsap";
import { velocity } from "../../../composables/useScroll";
import { isTouch } from "../../../composables/useAgent";
import { lerp } from "../../../utils/math";
import vertexShader from "../../shaders/lab-electric/vertex.glsl";
import fragmentShader from "../../shaders/lab-electric/fragment.glsl";

import type { Mesh } from "three";

let material: ShaderMaterial | null = null;
let mesh: Mesh | null = null;
let lastScrollY = 0;
let touchVelocity = 0;
let touchVelocityTarget = 0;
let scrollTimeout: number | null = null;
const uniforms = {
  uTime: { value: 0 },
  uOpacity: { value: 0 },
};

const init = (_mesh: Mesh) => {
  mesh = _mesh;
  material = new ShaderMaterial({
    transparent: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms,
  });

  mesh.material = material;

  // Initialize scroll position for touch fallback
  lastScrollY = window.scrollY;

  // Add touch fallback for devices where Lenis doesn't work
  if (isTouch.value) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  }

  gsap.ticker.add(tick);
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  const delta = Math.abs(currentScrollY - lastScrollY);
  lastScrollY = currentScrollY;

  // If we're scrolling (delta > 0), set target to 1
  if (delta > 0) {
    touchVelocityTarget = 1;

    // Clear existing timeout and set new one to detect when scrolling stops
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    scrollTimeout = window.setTimeout(() => {
      touchVelocityTarget = 0;
      scrollTimeout = null;
    }, 150); // 150ms delay to detect scroll stop
  }
};

const tick = () => {
  if (!material) return;
  material.uniforms.uTime!.value = gsap.ticker.time;

  // Lerp touchVelocity towards target with delta 0.06
  touchVelocity = lerp(touchVelocity, touchVelocityTarget, 0.06);

  // Use touch velocity fallback if main velocity is 0 (e.g., on touch devices)
  const currentVelocity = velocity.value > 0 ? velocity.value : touchVelocity;
  const opacity = currentVelocity * 0.75;
  material.uniforms.uOpacity!.value = opacity;
};

const destroy = () => {
  gsap.ticker.remove(tick);

  // Clean up touch fallback
  if (isTouch.value) {
    window.removeEventListener("scroll", handleScroll);
  }

  // Clear any pending scroll timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
    scrollTimeout = null;
  }
};

export const labElectric = { init, destroy };
