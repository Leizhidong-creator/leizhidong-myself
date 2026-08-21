import { Howl } from "howler";
import contactSprite from "../../../assets/sounds/sprites/contact.ogg";
import roomSprite from "../../../assets/sounds/sprites/room.mp3";

import type { SpritesData } from "../types";

export const sprites = {
  contact: {
    howl: new Howl({
      src: [contactSprite],
      sprite: {
        gasp: [0, 485.32879818594105, false],
        snore: [1200, 2761.972789115646, false],
      },
      preload: false,
    }),
  },
  room: {
    howl: new Howl({
      src: [roomSprite],
      sprite: {
        bird: [0, 136.89342403628119, false],
        keyboard: [1200, 2856.666666666667, false],
        "mouse-wheel-0": [4400, 208.6167800453515, false],
        "mouse-wheel-1": [5600, 312.993197278912, false],
        "mouse-wheel-2": [6800, 266.5532879818596, false],
        notification: [8000, 961.972789115647, false],
      },
      preload: false,
    }),
  },
} as const satisfies SpritesData;
