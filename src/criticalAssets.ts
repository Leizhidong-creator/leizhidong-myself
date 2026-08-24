const avatarModel = new URL("./assets/models/avatar.glb", import.meta.url).href;
const labModel = new URL("./assets/models/lab.glb", import.meta.url).href;
const roomModel = new URL("./assets/models/room.glb", import.meta.url).href;
const contactModel = new URL("./assets/models/contact.glb", import.meta.url).href;
const contactTexture = new URL("./assets/textures/contact.webp", import.meta.url).href;
const contactShadowTexture = new URL("./assets/textures/contact-shadow.webp", import.meta.url).href;
const desktopsTexture = new URL("./assets/textures/desktops.webp", import.meta.url).href;
const diffuseMap = new URL("./assets/textures/diffuse-map.png", import.meta.url).href;
const faceTexture = new URL("./assets/textures/face-spritesheet.png", import.meta.url).href;
const headTexture = new URL("./assets/textures/head.webp", import.meta.url).href;
const iconSpritesheet = new URL("./assets/textures/icon-spritesheet.webp", import.meta.url).href;
const matcapBlack = new URL("./assets/textures/matcap-black.webp", import.meta.url).href;
const matcapGray = new URL("./assets/textures/matcap-gray.webp", import.meta.url).href;
const matcapSkin = new URL("./assets/textures/matcap-skin.webp", import.meta.url).href;
const matcapWhite = new URL("./assets/textures/matcap-white.webp", import.meta.url).href;
const numbersBitmap = new URL("./assets/textures/numbers-bitmap.webp", import.meta.url).href;
const roomTexture = new URL("./assets/textures/room.webp", import.meta.url).href;
const roomShadowTexture = new URL("./assets/textures/room-shadow.webp", import.meta.url).href;
const hologramPlaneTexture = new URL("./assets/textures/hologram-plane.webp", import.meta.url).href;
const soundClick = new URL("./assets/sounds/click.ogg", import.meta.url).href;
const contactSprite = new URL("./assets/sounds/sprites/contact.ogg", import.meta.url).href;
const roomSprite = new URL("./assets/sounds/sprites/room.ogg", import.meta.url).href;
const trackLuci = new URL("./assets/music/luci.ogg", import.meta.url).href;
const trackAbout = new URL("./assets/music/ambient-pads.ogg", import.meta.url).href;
const thumbnailGardenDream = new URL("./assets/thumbnails/garden-dream.webp", import.meta.url).href;
const thumbnailZhiyanAgent = new URL("./assets/thumbnails/zhiyan-agent.webp", import.meta.url).href;
const thumbnailPetAgent = new URL("./assets/thumbnails/pet-agent.webp", import.meta.url).href;

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
  { name: "avatar-model", type: "gltfModel", path: avatarModel, weight: 296_976 },
  { name: "lab-model", type: "gltfModel", path: labModel, weight: 9_276 },
  { name: "room-model", type: "gltfModel", path: roomModel, weight: 146_484 },
  { name: "contact-model", type: "gltfModel", path: contactModel, weight: 8_996 },
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
  { name: "sound-click", type: "sound", path: soundClick, weight: 5_098 },
  { name: "sound-contact", type: "sound", path: contactSprite, weight: 24_587 },
  { name: "sound-room", type: "sound", path: roomSprite, weight: 42_851 },
  { name: "music-luci", type: "sound", path: trackLuci, weight: 176_293 },
  { name: "music-about", type: "sound", path: trackAbout, weight: 199_850 },
  { name: "cover-garden-dream", type: "cover", path: thumbnailGardenDream, weight: 140_372 },
  { name: "cover-zhiyan-agent", type: "cover", path: thumbnailZhiyanAgent, weight: 116_260 },
  { name: "cover-pet-agent", type: "cover", path: thumbnailPetAgent, weight: 109_036 },
] as const satisfies readonly CriticalAsset[];

export const threeSources = criticalAssets.filter(
  (asset) => asset.type === "gltfModel" || asset.type === "texture",
) as readonly ThreeSource[];

export const soundSources = criticalAssets.filter((asset) => asset.type === "sound") as readonly SoundSource[];
export const coverSources = criticalAssets.filter((asset) => asset.type === "cover") as readonly CoverSource[];
