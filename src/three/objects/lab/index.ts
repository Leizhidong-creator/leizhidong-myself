import { resources } from "../../../utils/resources";
import { Group, Mesh, Vector3, Color } from "three";
import { scene } from "../../core/scene";
import { labShine } from "./shine";
import { labBase } from "./base";
import { labParticles } from "./particles";
import { labElectric } from "./electric";
import { labPlane } from "./plane";
import { DigitalNumbers } from "../digital-numbers";
import { aboutProgress } from "../../../animations/transitions/about";
import gsap from "gsap";

import type { Object3D } from "three";

const group = new Group();

let objects: {
  base: Mesh;
  shine: Mesh;
  display: Mesh;
  electric: Mesh;
} | null = null;

let aboutNumbers: DigitalNumbers | null = null;

const init = () => {
  if (objects) return;
  const resource = resources.items["lab-model"];

  objects = {
    base: resource.scene.children.find((child: Object3D) => child.name === "base"),
    shine: resource.scene.children.find((child: Object3D) => child.name === "shine"),
    display: resource.scene.children.find((child: Object3D) => child.name === "display"),
    electric: resource.scene.children.find((child: Object3D) => child.name === "electric"),
  };

  Object.values(objects).forEach((object) => {
    if (object.name === "shine") object.renderOrder = 30;
    if (object.name === "electric") object.renderOrder = 25;
    if (object.name === "base") object.renderOrder = 20;
    if (object.name === "display") object.renderOrder = 21;
    group.add(object);
  });

  scene.instance.add(group);

  if (objects?.shine) labShine.init(objects.shine);
  if (objects?.base) labBase.init(objects.base, objects.display);
  if (objects?.electric) labElectric.init(objects.electric);

  labParticles.init();
  labPlane.init();

  if (labPlane.mesh) {
    group.add(labPlane.mesh);
  }

  aboutNumbers = new DigitalNumbers({
    count: 3,
    scene: group,
    position: new Vector3(0, -0.23, 1.07),
    scale: 0.17,
    renderOrder: 22,
    color: new Color("#bae9ff"),
  });
  aboutNumbers.updateFrames(0);

  gsap.ticker.add(tick);
};

const tick = () => {
  if (!aboutNumbers) return;
  const value = Math.floor(aboutProgress.value * 100);
  aboutNumbers.updateFrames(value);
};

const destroy = () => {
  gsap.ticker.remove(tick);
  labShine.destroy();
  labBase.destroy();
  labElectric.destroy();
  labParticles.destroy();
  labPlane.destroy();
  aboutNumbers?.destroy();
  aboutNumbers = null;
  group.clear();
  //objects = null;
};

export const lab = { init, destroy, group };
