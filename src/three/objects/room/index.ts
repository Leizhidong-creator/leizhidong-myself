import { resources } from "../../../utils/resources";
import { scene } from "../../core/scene";
import { Euler, Group, Mesh } from "three";
import { getRoomMaterial } from "../../common/materials";
import { sceneWeights } from "../../../animations/scenes";
import gsap from "gsap";
import { shadow } from "./shadow";
import { desktops } from "./desktops";
import { mouse } from "./mouse";
import { messagePopup } from "./message-popup";
import { penguin } from "./penguin";
import { music } from "./music";

import type { Object3D } from "three";

const group = new Group();
const chairScrollRotation = new Euler();

let objects: {
  blackboard: Mesh;
  carpet: Mesh;
  chair: Mesh;
  frame: Mesh;
  mouse: Mesh;
  music: Mesh;
  penguin: Mesh;
  "penguin-wing-left": Mesh;
  "penguin-wing-right": Mesh;
  plant: Mesh;
  room: Mesh;
  shelf: Mesh;
} | null = null;

const init = () => {
  gsap.ticker.add(tick);
  initObjects();
  shadow.init();
  desktops.init();
  messagePopup.init();
  if (objects?.mouse) mouse.init(objects.mouse);
  if (objects?.penguin)
    penguin.init(objects.penguin, { left: objects["penguin-wing-left"], right: objects["penguin-wing-right"] });

  if (objects?.music) music.init(objects.music);
};

const initObjects = () => {
  if (objects) return;
  const resource = resources.items["room-model"];

  const penguin = resource.scene.children.find((child: Object3D) => child.name === "penguin");
  objects = {
    blackboard: resource.scene.children.find((child: Object3D) => child.name === "blackboard"),
    carpet: resource.scene.children.find((child: Object3D) => child.name === "carpet"),
    chair: resource.scene.children.find((child: Object3D) => child.name === "chair"),
    frame: resource.scene.children.find((child: Object3D) => child.name === "frame"),
    mouse: resource.scene.children.find((child: Object3D) => child.name === "mouse"),
    music: resource.scene.children.find((child: Object3D) => child.name === "music"),
    plant: resource.scene.children.find((child: Object3D) => child.name === "plant"),
    room: resource.scene.children.find((child: Object3D) => child.name === "room"),
    shelf: resource.scene.children.find((child: Object3D) => child.name === "shelf"),
    penguin,
    "penguin-wing-left": penguin.children.find((child: Object3D) => child.name === "penguin-wing-left"),
    "penguin-wing-right": penguin.children.find((child: Object3D) => child.name === "penguin-wing-right"),
  };

  Object.values(objects).forEach((object) => {
    if (!object) return;
    const mat = getRoomMaterial();
    object.material = mat;
    group.add(object);

    if (object.name === "carpet") {
      object.renderOrder = -10;
      object.onBeforeRender = () => {
        mat.depthWrite = false;
      };

      object.onAfterRender = () => {
        mat.depthWrite = true;
      };
    }
  });

  scene.instance.add(group);
};

const tick = () => {
  group.visible = sceneWeights.hero > 0.001;

  if (objects?.chair) {
    objects.chair.rotation.copy(chairScrollRotation);
  }

  penguin.tick();
  music.tick();
};

const destroy = () => {
  gsap.ticker.remove(tick);
  shadow.destroy();
  //group.clear();
  //objects = null;
  desktops.destroy();
  mouse.destroy();
  penguin.destroy();
  music.destroy();
};

export const room = { init, destroy, group, chairScrollRotation };
