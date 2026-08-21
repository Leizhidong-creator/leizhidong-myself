import EventEmitter from "./EventEmitter";

export const BREAKPOINTS = {
  sm: 480,
  md: 840,
  lg: 1024,
  xl: 1280,
} as const satisfies Record<string, number>;

const BREAKPOINT_ORDER = ["xl", "lg", "md", "sm"];

const getBreakpoint = (width: number) => {
  return BREAKPOINT_ORDER.find((key) => width >= BREAKPOINTS[key as keyof typeof BREAKPOINTS]) || "sm";
};

class Sizes extends EventEmitter<{
  resize: { width: number; height: number; pixelRatio: number };
  hide: void;
  show: void;
}> {
  width: number;
  height: number;
  pixelRatio: number;
  breakpoint: keyof typeof BREAKPOINTS;
  visible: boolean;
  aspectRatio: number;
  isLandscape: boolean;
  resizeObserver: ResizeObserver | null;

  constructor() {
    super();
    this.width = 0;
    this.height = 0;
    this.aspectRatio = 0;
    this.pixelRatio = 1;
    this.breakpoint = "md";
    this.visible = true;
    this.isLandscape = false;
    this.resizeObserver = null;

    this.resize();
    this.init();
  }

  init() {
    // Use ResizeObserver for more accurate and performant resize detection
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    // Observe the document element for size changes
    this.resizeObserver.observe(document.documentElement);

    window.addEventListener("visibilitychange", this.visibilityChange.bind(this));
    this.resize();
  }

  visibilityChange() {
    this.visible = document.visibilityState === "visible";
    if (this.visible) {
      this.emit("show");
    } else {
      this.emit("hide");
    }
  }

  matchMedia(breakpoint: keyof typeof BREAKPOINTS) {
    const breakpointOrder: (keyof typeof BREAKPOINTS)[] = ["sm", "md", "lg", "xl"];
    const currentIndex = breakpointOrder.indexOf(this.breakpoint);
    const targetIndex = breakpointOrder.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  }

  setViewportUnits() {
    document.documentElement.style.setProperty("--vh", 0.01 * window.innerHeight + "px");
    document.documentElement.style.setProperty("--dvh", 0.01 * window.innerHeight + "px");
    document.documentElement.style.setProperty("--svh", 0.01 * document.documentElement.clientHeight + "px");
    document.documentElement.style.setProperty("--lvh", "1vh");

    document.documentElement.style.setProperty("--vw", 0.01 * window.innerWidth + "px");
    document.documentElement.style.setProperty("--dvw", 0.01 * window.innerWidth + "px");
    document.documentElement.style.setProperty("--svw", 0.01 * document.documentElement.clientWidth + "px");
    document.documentElement.style.setProperty("--lvw", "1vw");
  }

  resize() {
    this.width = Math.max(window.innerWidth, document.documentElement.clientWidth);
    this.height = window.innerHeight;
    this.aspectRatio = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.setViewportUnits();

    this.breakpoint = getBreakpoint(this.width) as keyof typeof BREAKPOINTS;

    this.emit("resize", { width: this.width, height: this.height, pixelRatio: this.pixelRatio });

    this.isLandscape = window.matchMedia("(orientation: landscape)").matches;
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    window.removeEventListener("visibilitychange", this.visibilityChange.bind(this));
  }
}

export const sizes = new Sizes();
