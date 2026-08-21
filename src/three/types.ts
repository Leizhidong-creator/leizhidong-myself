import type { Box3 } from "three";

export type ClickableBox3 = Box3 & {
  onClick?: () => void;
  hoverSound?: string;
};
