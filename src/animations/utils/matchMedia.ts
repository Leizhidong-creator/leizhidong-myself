import gsap from "gsap";
import { BREAKPOINTS } from "../../utils/sizes";

export const createMatchMedia = (
  setup: (
    context: gsap.Context,
    conditions: { isMobile: boolean; isDesktop: boolean; isLandscape: boolean },
  ) => void | (() => void),
): gsap.MatchMedia => {
  const mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
      isDesktop: `(min-width: ${BREAKPOINTS.md}px)`,
      isLandscape: `(min-aspect-ratio: 1)`,
    },
    (context) => {
      const { conditions } = context;
      const cleanup = setup(context, conditions as { isMobile: boolean; isDesktop: boolean; isLandscape: boolean });
      return cleanup;
    },
  );

  return mm;
};
