import { LinearSRGBColorSpace, ShaderMaterial } from "three";
import { resources } from "../../../utils/resources";
import fragmentShader from "../../shaders/avatar-face/fragment.glsl";
import vertexShader from "../../shaders/avatar-face/vertex.glsl";
import { avatar } from "./index";
import gsap from "gsap";

import type { Material } from "three";
import { sceneWeights } from "../../../animations/scenes";

let material: Material | null = null;

const FRAME_INDEXES = {
  "default-0": 0,
  "default-1": 1,
  "default-2": 2,
  "default-3": 3,
  sleeping: 4,
  "proud-0": 12,
  "proud-1": 13,
  "proud-2": 14,
  "proud-3": 15,
  "contact-transition-0": 8,
  "contact-transition-1": 9,
  "contact-transition-2": 10,
} as const satisfies Record<string, number>;

const blinkFrame = { value: 0 };

const uniforms = { uFrame: { value: 0 } };

const sceneFrames: Record<"intro" | "contact", keyof typeof FRAME_INDEXES> = {
  intro: "default-0",
  contact: "sleeping",
};

const init = () => {
  gsap.ticker.add(tick);
  scheduleBlinkInterval();
};

const scheduleBlinkInterval = () => {
  gsap.delayedCall(3 + Math.random() * 3, () => {
    scheduleBlinkInterval();
    blink();
  });
};

const blink = () => {
  if (!canBlink()) return;
  const tl = gsap.timeline();
  tl.to(blinkFrame, { value: 3, duration: 0.12, ease: "power2.out" });
  tl.to(blinkFrame, { value: 0, duration: 0.2, ease: "power2.out" });
};

const getMaterial = (): Material | null => {
  const texture = resources.items["face-texture"];
  texture.colorSpace = LinearSRGBColorSpace;
  texture.generateMipmaps = false;

  material = new ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    fragmentShader,
    vertexShader,
    uniforms: { uTexture: { value: texture }, ...uniforms, ...avatar.uniforms },
  });

  return material;
};

const canBlink = (): boolean => {
  const isContact = sceneWeights.contact > 0.001;
  if (isContact) {
    if (sceneFrames.contact.startsWith("proud")) {
      return true;
    }
  } else {
    if (sceneFrames.intro.startsWith("default")) {
      return true;
    }
  }
  return false;
};

const wakeUp = () => {
  sceneFrames.contact = "proud-0";
  const tl = gsap.timeline();
  tl.set(sceneFrames, { contact: "contact-transition-0" }, 0);
  tl.set(sceneFrames, { contact: "contact-transition-1" }, 0.4);
  tl.set(sceneFrames, { contact: "contact-transition-2" }, 0.43);
  tl.set(sceneFrames, { contact: "proud-0" }, 0.46);
};

const wave = () => {
  const tl = gsap.timeline();

  const RESET_AFTER = 3;
  tl.set(sceneFrames, { intro: "proud-0" }, 0);
  tl.set(sceneFrames, { intro: "default-0" }, RESET_AFTER);

  return tl;
};

const tick = () => {
  const isContact = sceneWeights.contact > 0.001;
  if (isContact) {
    const name = sceneFrames.contact.startsWith("proud")
      ? `proud-${Math.round(blinkFrame.value)}`
      : sceneFrames.contact;
    uniforms.uFrame.value = FRAME_INDEXES[name as keyof typeof FRAME_INDEXES];
  } else {
    const isAbout = sceneWeights.about > 0.1;
    if (isAbout) {
      uniforms.uFrame.value = FRAME_INDEXES["default-0"];
    } else {
      const name = sceneFrames.intro.startsWith("default")
        ? `default-${Math.round(blinkFrame.value)}`
        : sceneFrames.intro;
      uniforms.uFrame.value = FRAME_INDEXES[name as keyof typeof FRAME_INDEXES];
    }
  }
};

const destroy = () => {
  gsap.ticker.remove(tick);
};

export const face = { init, destroy, getMaterial, FRAME_INDEXES, wakeUp, wave };
