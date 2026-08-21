import type { SceneKey } from "./types";

export const points = {
  landscape: {
    hero: {
      position: { x: 0, y: 6, z: 10 },
      focus: { x: 0, y: 3, z: 0 },
    },
    "about-1": {
      /**      position: { x: 0, y: 4.7, z: 14.5 },
      position: { x: 0, y: 4.3, z: 11 },
      focus: { x: 0, y: 2.5, z: 6 },
      focus: { x: 0, y: 3.25, z: 6 }, */
      position: { x: 0, y: 4.5, z: 15.5 },
      focus: { x: 0, y: 2.2, z: 6 },
    },
    "about-2": {
      //position: { x: 0, y: 4.7, z: 14.5 },
      //position: { x: 0, y: 3, z: 15.5 },
      //focus: { x: 0, y: 2.5, z: 6 },
      //focus: { x: 0, y: 1.2, z: 6 },

      position: { x: 0, y: 4.5, z: 15.5 },
      focus: { x: 0, y: 2.2, z: 6 },
    },
  },
  portrait: {
    hero: {
      position: { x: 0, y: 8.2, z: 16 },
      focus: { x: 0, y: 5.2, z: 0 },
    },
    "about-1": {
      //position: { x: 0, y: 5.5, z: 20 },
      //focus: { x: 0, y: 1.8, z: 6 },
      position: { x: 0, y: 4.75, z: 19.5 },
      focus: { x: 0, y: 0.8, z: 6 },
    },
    "about-2": {
      //position: { x: 0, y: 5.5, z: 20 },
      //focus: { x: 0, y: 1.8, z: 6 },
      position: { x: 0, y: 4.75, z: 19.5 },
      focus: { x: 0, y: 0.8, z: 6 },
    },
  },
} as const satisfies Record<
  "landscape" | "portrait",
  Partial<
    Record<
      SceneKey,
      {
        position: { x: number; y: number; z: number };
        focus: { x: number; y: number; z: number };
      }
    >
  >
>;
