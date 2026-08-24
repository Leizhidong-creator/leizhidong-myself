import { Howl } from "howler";
import { soundAssetUrls } from "../../../criticalAssets";

import type { MusicTrack } from "../types";

export const musicTracks = {
  luci: new Howl({ src: [soundAssetUrls.luci], loop: true, volume: 0, preload: false }),
  about: new Howl({ src: [soundAssetUrls.about], loop: true, volume: 0, preload: false }),
} as const;

export const BASE_VOLUMES = {
  luci: 0.2,
  about: 0.3,
} as const satisfies Record<MusicTrack, number>;
