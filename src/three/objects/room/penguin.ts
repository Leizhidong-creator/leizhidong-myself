import { Box3, Mesh, ShaderMaterial, LinearSRGBColorSpace, LinearFilter } from "three";
import { raycast } from "../../utils/raycast";
import { planeGeometry } from "../../common/geometries";
import { resources } from "../../../utils/resources";
import gsap from "gsap";
import vertexShader from "../../shaders/heart/vertex.glsl";
import fragmentShader from "../../shaders/heart/fragment.glsl";
import { room } from ".";
import { playSound } from "../../../features/sounds/utils/sounds";

import type { ClickableBox3 } from "../../types";

let mesh: Mesh | null = null;
let box3: ClickableBox3 | null = null;
let isJumping = false;
let wings: { left: Mesh; right: Mesh } | null = null;
let heart: Mesh | null = null;
let heartMaterial: ShaderMaterial | null = null;
let initialized = false;

const init = (_mesh: Mesh, _wings: { left: Mesh; right: Mesh }) => {
  mesh = _mesh;
  wings = _wings;

  if (initialized) return;
  initialized = true;

  mesh.add(wings.left);
  mesh.add(wings.right);

  initHeart();

  box3 = new Box3().setFromObject(mesh);
  box3.onClick = handleClick;
  box3.hoverSound = "hover";

  raycast.boxesToCheck.push(box3);
};

const initHeart = () => {
  if (!mesh) return;

  const texture = resources.items["icon-spritesheet"];
  texture.colorSpace = LinearSRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  heartMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTexture: { value: texture },
      uProgress: { value: 0 },
    },
  });

  heart = new Mesh(planeGeometry, heartMaterial);
  heart.position.copy(mesh.position);
  heart.position.x += 0.1;
  heart.position.y += 0.4;
  heart.position.z += 0.1;
  heart.visible = false;

  room.group.add(heart);
};

const handleClick = () => {
  if (isJumping || !mesh || !wings) return;
  isJumping = true;
  const tl = gsap.timeline();

  playSound("bird");

  tl.add(() => {
    isJumping = false;
  }, 0.8);

  tl.to(
    mesh.position,
    {
      y: 2,
      duration: 0.4,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    },
    0,
  );

  tl.to(
    wings.left.rotation,
    {
      x: 0.4,
      duration: 0.1,
      repeat: 7,
      ease: "power2.out",
      yoyo: true,
    },
    0,
  );

  tl.to(
    wings.left.position,
    {
      y: 0.05,
      duration: 0.1,
      repeat: 7,
      ease: "power2.out",
      yoyo: true,
    },
    0,
  );

  tl.to(
    wings.right.rotation,
    {
      x: -0.4,
      duration: 0.1,
      repeat: 7,
      ease: "power2.out",
      yoyo: true,
    },
    0,
  );

  tl.to(
    wings.right.position,
    {
      y: 0.05,
      duration: 0.1,
      repeat: 7,
      ease: "power2.out",
      yoyo: true,
    },
    0,
  );

  // Animate heart
  if (heart && heartMaterial && heartMaterial.uniforms.uProgress) {
    tl.set(heartMaterial.uniforms.uProgress, { value: 0 }, 0);
    tl.set(heart, { visible: true }, 0);
    tl.to(
      heartMaterial.uniforms.uProgress,
      {
        value: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      0,
    );
    tl.set(heartMaterial.uniforms.uProgress, { value: 1 });
  }
};

const tick = () => {
  if (!mesh || !box3) return;

  box3.setFromObject(mesh);
  box3.expandByScalar(0.15);

  // Hide heart when progress is 0 or 1, show when animating
  if (heart && heartMaterial && heartMaterial.uniforms.uProgress) {
    const progress = heartMaterial.uniforms.uProgress.value;
    if (progress <= 0.001 || progress >= 0.999) {
      heart.visible = false;
    } else {
      heart.visible = true;
    }
  }
};

const destroy = () => {
  if (box3) {
    raycast.boxesToCheck.splice(raycast.boxesToCheck.indexOf(box3), 1);
  }
  box3 = null;
};

export const penguin = { init, tick, destroy };
