import { resources } from "../../../utils/resources";
import { contact } from ".";
import { getShadowMaterial } from "../../common/materials";
import { colors } from "../../common/colors";
import { Color } from "three";

import type { Object3D } from "three";

const backgroundColor = colors.beigeDark.clone().convertLinearToSRGB();
const shadowColor = new Color("rgb(208, 185, 156)");

const init = () => {
  initObjects();
};

const initObjects = () => {
  const resource = resources.items["contact-model"];
  const texture = resources.items["contact-shadow-texture"];
  texture.flipY = false;

  const mesh = resource.scene.children.find((child: Object3D) => child.name === "shadow-catcher");
  if (!mesh) return;

  mesh.material = getShadowMaterial();
  mesh.onBeforeRender = () => {
    mesh.material.uniforms.uTexture.value = texture;
    mesh.material.uniforms.uColorBackground.value = backgroundColor;
    mesh.material.uniforms.uColorShadow.value = shadowColor;
  };

  mesh.renderOrder = -1000;

  contact.group.add(mesh);
};

const destroy = () => {};

export const shadow = { init, destroy };
