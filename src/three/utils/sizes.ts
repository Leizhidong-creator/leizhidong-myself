import EventEmitter from "../../utils/EventEmitter";

class ThreeSizes extends EventEmitter<{
  resize: { width: number; height: number; pixelRatio: number };
}> {
  width: number = 0;
  height: number = 0;
  pixelRatio: number = 1;
  canvas: HTMLCanvasElement | null = null;
  observer: ResizeObserver | null = null;

  init(_canvas: HTMLCanvasElement) {
    this.canvas = _canvas;
    this.observer = new ResizeObserver(this.resize.bind(this));
    this.observer.observe(this.canvas);
  }

  resize() {
    const rect = this.canvas?.getBoundingClientRect();
    if (!rect || !rect.width || !rect.height) return;
    this.width = rect?.width ?? 0;
    this.height = rect?.height ?? 0;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.emit("resize", { width: this.width, height: this.height, pixelRatio: this.pixelRatio });
  }

  destroy() {
    this.observer?.disconnect();
    this.observer = null;
    this.canvas = null;
  }
}

export const threeSizes = new ThreeSizes();
