import avatarModel from "./assets/models/avatar.glb";
import labModel from "./assets/models/lab.glb";
import roomModel from "./assets/models/room.glb";
import contactModel from "./assets/models/contact.glb";
import contactTexture from "./assets/textures/contact.webp";
import contactShadowTexture from "./assets/textures/contact-shadow.webp";
import desktopsTexture from "./assets/textures/desktops.webp";
import diffuseMap from "./assets/textures/diffuse-map.png";
import faceTexture from "./assets/textures/face-spritesheet.png";
import headTexture from "./assets/textures/head.webp";
import iconSpritesheet from "./assets/textures/icon-spritesheet.webp";
import matcapBlack from "./assets/textures/matcap-black.webp";
import matcapGray from "./assets/textures/matcap-gray.webp";
import matcapSkin from "./assets/textures/matcap-skin.webp";
import matcapWhite from "./assets/textures/matcap-white.webp";
import numbersBitmap from "./assets/textures/numbers-bitmap.webp";
import roomTexture from "./assets/textures/room.webp";
import roomShadowTexture from "./assets/textures/room-shadow.webp";
import hologramPlaneTexture from "./assets/textures/hologram-plane.webp";
import soundClick from "./assets/sounds/click.mp3";
import contactSprite from "./assets/sounds/sprites/contact.ogg";
import roomSprite from "./assets/sounds/sprites/room.mp3";
import trackLuci from "./assets/music/luci.ogg";
import trackAbout from "./assets/music/ambient-pads.ogg";
import thumbnailGardenDream from "./assets/thumbnails/garden-dream.jpg";
import thumbnailZhiyanAgent from "./assets/thumbnails/zhiyan-agent.jpg";
import thumbnailPetAgent from "./assets/thumbnails/pet-agent.jpg";

type BaseAsset = {
  name: string;
  path: string;
  weight: number;
};

export type ThreeSource = BaseAsset & { type: "gltfModel" | "texture" };
export type SoundSource = BaseAsset & { type: "sound" };
export type CoverSource = BaseAsset & { type: "cover" };
export type CriticalAsset = ThreeSource | SoundSource | CoverSource;

export const soundAssetUrls = {
  click: soundClick,
  contact: contactSprite,
  room: roomSprite,
  luci: trackLuci,
  about: trackAbout,
} as const;

export const coverAssetUrls = {
  gardenDream: thumbnailGardenDream,
  zhiyanAgent: thumbnailZhiyanAgent,
  petAgent: thumbnailPetAgent,
} as const;

export const criticalAssets = [
  { name: "avatar-model", type: "gltfModel", path: avatarModel, weight: 616_536 },
  { name: "lab-model", type: "gltfModel", path: labModel, weight: 11_384 },
  { name: "room-model", type: "gltfModel", path: roomModel, weight: 289_976 },
  { name: "contact-model", type: "gltfModel", path: contactModel, weight: 10_580 },
  { name: "contact-texture", type: "texture", path: contactTexture, weight: 111_790 },
  { name: "contact-shadow-texture", type: "texture", path: contactShadowTexture, weight: 2_910 },
  { name: "desktops-texture", type: "texture", path: desktopsTexture, weight: 5_320 },
  { name: "diffuse-map", type: "texture", path: diffuseMap, weight: 254 },
  { name: "face-texture", type: "texture", path: faceTexture, weight: 22_465 },
  { name: "head-texture", type: "texture", path: headTexture, weight: 16_854 },
  { name: "hologram-plane-texture", type: "texture", path: hologramPlaneTexture, weight: 688 },
  { name: "icon-spritesheet", type: "texture", path: iconSpritesheet, weight: 7_002 },
  { name: "matcap-black", type: "texture", path: matcapBlack, weight: 4_134 },
  { name: "matcap-gray", type: "texture", path: matcapGray, weight: 5_222 },
  { name: "matcap-skin", type: "texture", path: matcapSkin, weight: 5_596 },
  { name: "matcap-white", type: "texture", path: matcapWhite, weight: 3_548 },
  { name: "numbers-bitmap", type: "texture", path: numbersBitmap, weight: 6_564 },
  { name: "room-texture", type: "texture", path: roomTexture, weight: 117_996 },
  { name: "room-shadow-texture", type: "texture", path: roomShadowTexture, weight: 3_050 },
  { name: "sound-click", type: "sound", path: soundClick, weight: 1_419 },
  { name: "sound-contact", type: "sound", path: contactSprite, weight: 24_587 },
  { name: "sound-room", type: "sound", path: roomSprite, weight: 148_418 },
  { name: "music-luci", type: "sound", path: trackLuci, weight: 176_293 },
  { name: "music-about", type: "sound", path: trackAbout, weight: 199_850 },
  { name: "cover-garden-dream", type: "cover", path: thumbnailGardenDream, weight: 179_745 },
  { name: "cover-zhiyan-agent", type: "cover", path: thumbnailZhiyanAgent, weight: 151_303 },
  { name: "cover-pet-agent", type: "cover", path: thumbnailPetAgent, weight: 153_578 },
] as const satisfies readonly CriticalAsset[];

export const threeSources = criticalAssets.filter(
  (asset) => asset.type === "gltfModel" || asset.type === "texture",
) as readonly ThreeSource[];

export const soundSources = criticalAssets.filter((asset) => asset.type === "sound") as readonly SoundSource[];
export const coverSources = criticalAssets.filter((asset) => asset.type === "cover") as readonly CoverSource[];
