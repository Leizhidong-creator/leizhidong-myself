import { musicTracks } from "./definitions/music";
import { sounds } from "./definitions/sounds";
import { sprites } from "./definitions/sprites";

export const criticalHowls = [
  musicTracks.luci,
  musicTracks.about,
  sounds.click.howl,
  sprites.contact.howl,
  sprites.room.howl,
] as const;
