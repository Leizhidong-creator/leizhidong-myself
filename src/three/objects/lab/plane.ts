import { Mesh, PlaneGeometry, MeshBasicMaterial, LinearSRGBColorSpace } from "three";
import gsap from "gsap";
import { uniforms as hologramUniforms } from "../avatar/hologram-material";
import { resources } from "../../../utils/resources";

let plane: Mesh | null = null;

const START_Y = -0.2;
const END_Y = 4.5;
const FADE_IN_START = 0.2;
const FADE_IN_END = 0.3;
const FADE_OUT_START = 0.7;
const FADE_OUT_END = 0.9;

const init = () => {
  if (plane) return;

  // Create a simple plane geometry
  const geometry = new PlaneGeometry(1.5, 1);
  geometry.rotateX(-Math.PI / 2);

  const texture = resources.items["hologram-plane-texture"];
  texture.colorSpace = LinearSRGBColorSpace;
  texture.generateMipmaps = false;
  texture.flipY = false;

  // Create a basic material (could be customized later)
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
  });

  plane = new Mesh(geometry, material);
  plane.renderOrder = 24;

  gsap.ticker.add(tick);
};

const tick = () => {
  if (!plane) return;

  const progress = hologramUniforms.uProgress.value;
  const yPosition = START_Y + progress * (END_Y - START_Y);
  plane.position.y = yPosition + 0.01;

  // Calculate opacity based on progress - fade in and out
  let opacity = 0;
  if (progress <= FADE_IN_START) {
    // Before FADE_IN_START: opacity 0
    opacity = 0;
  } else if (progress <= FADE_IN_END) {
    // Fade in phase: 0.2 to 0.3
    const fadeInProgress = (progress - FADE_IN_START) / (FADE_IN_END - FADE_IN_START);
    opacity = fadeInProgress;
  } else if (progress <= FADE_OUT_START) {
    // Fully visible phase: 0.3 to 0.7
    opacity = 1;
  } else if (progress <= FADE_OUT_END) {
    // Fade out phase: 0.7 to 1.0
    const fadeOutProgress = (progress - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START);
    opacity = 1 - fadeOutProgress;
  } else {
    // After FADE_OUT_END: opacity 0
    opacity = 0;
  }

  // Calculate scale - fade between 0 (scale=1), 0.5 (scale=1.5) and 1 (scale=1)
  let scale = 1;
  if (progress <= 0.5) {
    // From 0 to 0.5: scale from 1 to 1.5
    scale = 1 + (progress / 0.5) * 0.5;
  } else {
    // From 0.5 to 1: scale from 1.5 back to 1
    scale = 1.5 - ((progress - 0.5) / 0.5) * 0.5;
  }

  // Apply scale to X and Z axes
  plane.scale.x = scale;
  // Update material opacity
  if (plane.material instanceof MeshBasicMaterial) {
    plane.material.opacity = opacity;
  }

  // Set visibility based on opacity
  plane.visible = opacity > 0;
};

const destroy = () => {
  gsap.ticker.remove(tick);
  if (plane) {
    plane.geometry.dispose();
    if (plane.material instanceof MeshBasicMaterial) {
      plane.material.dispose();
    }
    plane = null;
  }
};

export const labPlane = {
  init,
  destroy,
  get mesh() {
    return plane;
  },
};
