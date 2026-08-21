import gsap from "gsap";
import { sizes } from "../utils/sizes";
import { sceneWeights } from "./scenes";
import { points } from "./waypoints-data";
import { Vector3 } from "three";

import type { SceneKey } from "./types";

const position = new Vector3();
const focus = new Vector3();

const init = () => {
  updateReferences();
  gsap.ticker.add(tick);
};

function weightedAverage<T extends { x: number; y: number; z: number }>(points: T[], weights: number[]): T {
  let total = 0,
    x = 0,
    y = 0,
    z = 0;

  for (let i = 0; i < points.length; i++) {
    const w = weights[i] ?? 0;
    total += w;
    x += points[i]!.x * w;
    y += points[i]!.y * w;
    z += points[i]!.z * w;
  }

  if (total === 0) total = 1;

  return { x: x / total, y: y / total, z: z / total } as T;
}

// cache
let positions: { x: number; y: number; z: number }[] = [];
let focuses: { x: number; y: number; z: number }[] = [];
let weights: number[] = [];
let resolvedPoints: typeof points.landscape | typeof points.portrait = points.landscape;

// called when viewport or scene set changes
function updateReferences() {
  const isLandscape = sizes.isLandscape;
  resolvedPoints = isLandscape ? points.landscape : points.portrait;

  const active = Object.entries(sceneWeights).filter(([key, weight]) => weight > 0 && key in resolvedPoints) as [
    SceneKey,
    number,
  ][];

  positions = active.map(([key]) => resolvedPoints[key as keyof typeof resolvedPoints]!.position);
  focuses = active.map(([key]) => resolvedPoints[key as keyof typeof resolvedPoints]!.focus);
  weights = active.map(([, w]) => w);
}

const tick = () => {
  updateReferences();

  const finalPos = weightedAverage(positions, weights);
  const finalFocus = weightedAverage(focuses, weights);

  position.set(finalPos.x, finalPos.y, finalPos.z);
  focus.set(finalFocus.x, finalFocus.y, finalFocus.z);
};

const destroy = () => {
  gsap.ticker.remove(tick);
};

export const waypoints = { init, points, updateReferences, position, focus, destroy };
