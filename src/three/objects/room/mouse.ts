import { Vector3 } from "three";
import gsap from "gsap";
import { avatar } from "../avatar";
import { room } from ".";
import { sceneWeights } from "../../../animations/scenes";
import { isFeatureEnabled } from "../../../utils/features";

import type { Mesh } from "three";

const Y_BOUND = 1.8;
const enabled = {
  value: !isFeatureEnabled("introWave"),
};

const BOUNDS = {
  x: {
    max: -0.7,
    min: -0.9,
  },
  z: {
    max: -0.28,
    min: -0.6,
  },
} as const;

const initialPos = new Vector3(0, 0, 0);
const currentPos = new Vector3(0, 0, 0);
let mesh: Mesh | null = null;

const init = (_mesh: Mesh) => {
  mesh = _mesh;

  initialPos.copy(mesh.position);
  gsap.ticker.add(tick);
};

const tick = () => {
  if (!mesh || !enabled.value) return;

  if (sceneWeights.hero < 0.95) return;

  const bone = avatar.getRightHandBone();
  if (!bone) return;

  bone.getWorldPosition(currentPos);
  room.group.worldToLocal(currentPos);

  if (currentPos.y > Y_BOUND) return;
  if (currentPos.x < BOUNDS.x.min || currentPos.x > BOUNDS.x.max) return;
  if (currentPos.z < BOUNDS.z.min || currentPos.z > BOUNDS.z.max) return;

  mesh.position.copy(currentPos);

  mesh.position.y = initialPos.y;
  mesh.position.z -= 0.15;
};

const destroy = () => {
  gsap.ticker.remove(tick);
};

export const mouse = { init, destroy, enabled };
