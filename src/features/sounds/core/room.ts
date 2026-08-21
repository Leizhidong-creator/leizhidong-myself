import { projectVisible } from "../../../composables/useRouteObserver";
import { clamp } from "../../../utils/math";
import { sceneWeights } from "../../../animations/scenes";
import { sprites } from "../definitions/sprites";

export const tick = () => {
  const volume = projectVisible.value ? 0 : clamp(sceneWeights.hero * 0.75, 0, 1);
  sprites.room.howl.volume(volume);
};
