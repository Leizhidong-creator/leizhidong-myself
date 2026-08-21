export const mix = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

export const lerp = (a: number, b: number, t: number) => {
  return a + (b - a) * t;
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};
