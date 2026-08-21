import { Howl } from "howler";

import type { SoundsData, SoundKey } from "../types";

import soundClick from "../../../assets/sounds/click.mp3";
//import soundHover0 from "../../../assets/sounds/hover-0.mp3";
//import soundHover1 from "../../../assets/sounds/hover-1.mp3";
//import soundHover2 from "../../../assets/sounds/hover-2.mp3";
//import soundHover3 from "../../../assets/sounds/hover-3.mp3";

export const sounds = {
  bird: { spriteKey: "room", name: "bird" },
  click: { howl: new Howl({ src: [soundClick], loop: false, volume: 1, preload: false }) },
  gasp: { spriteKey: "contact", name: "gasp" },
  //hover0: { howl: new Howl({ src: [soundHover0], loop: false, volume: 0.05, preload: false }) },
  //hover1: { howl: new Howl({ src: [soundHover1], loop: false, volume: 0.05, preload: false }) },
  //hover2: { howl: new Howl({ src: [soundHover2], loop: false, volume: 0.05, preload: false }) },
  //hover3: { howl: new Howl({ src: [soundHover3], loop: false, volume: 0.05, preload: false }) },
  keyboard: { spriteKey: "room", name: "keyboard" },
  mouseWheel0: { spriteKey: "room", name: "mouse-wheel-0" },
  mouseWheel1: { spriteKey: "room", name: "mouse-wheel-1" },
  mouseWheel2: { spriteKey: "room", name: "mouse-wheel-2" },
  notification: { spriteKey: "room", name: "notification" },
  snore: { spriteKey: "contact", name: "snore" },
} as const satisfies SoundsData;

export const pools = {
  //hover: ["hover0", "hover1", "hover2", "hover3"],
  mouseWheel: ["mouseWheel0", "mouseWheel1", "mouseWheel2"],
} as const satisfies Record<string, SoundKey[]>;
