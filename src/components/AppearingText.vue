<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import gsap from "gsap";
import { BREAKPOINTS } from "../utils/sizes";

const props = defineProps<{
  text: string;
  steps: number;
  duration: number;
}>();

const emit = defineEmits<{
  "timeline:created": [timeline: gsap.core.Timeline];
}>();

// Animation configuration constants
const FLICKER_CHARACTER_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const displayText = ref("");
let currentTimeline: gsap.core.Timeline | null = null;
let matchMedia: gsap.MatchMedia | null = null;

const randomChar = () => FLICKER_CHARACTER_POOL[Math.floor(Math.random() * FLICKER_CHARACTER_POOL.length)];

watch(
  () => [props.text, props.steps, props.duration],
  () => {
    if (!props.text || typeof window === "undefined") return;

    // Kill previous timeline and matchMedia if they exist
    if (currentTimeline) {
      currentTimeline.kill();
      currentTimeline = null;
    }
    if (matchMedia) {
      matchMedia.revert();
      matchMedia = null;
    }

    // Reset display text
    displayText.value = "";

    // Skip animation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      displayText.value = props.text;
      return;
    }

    // Initialize GSAP matchMedia
    matchMedia = gsap.matchMedia();

    // Use GSAP matchMedia to handle mobile vs desktop
    matchMedia.add(
      {
        isMobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
        isDesktop: `(min-width: ${BREAKPOINTS.md}px)`,
      },
      (context) => {
        const { conditions } = context;
        const { isMobile } = conditions as { isMobile: boolean; isDesktop: boolean };

        // Recalculate animation parameters based on current text
        const totalLetters = props.text.length;
        const totalSteps = Math.ceil(totalLetters / props.steps);
        const DURATION_PER_STEP = props.duration / totalSteps;

        const timeline = gsap.timeline({
          paused: true,
        });

        if (isMobile) {
          // On mobile, set text immediately
          displayText.value = props.text;
        } else {
          // On desktop, create the flicker animation
          for (let step = 0; step < totalSteps; step++) {
            const startIndex = step * props.steps;

            const progress = { value: 0 };

            // Flicker phase for this group of letters
            timeline.to(progress, {
              value: 1,
              duration: DURATION_PER_STEP,
              onUpdate: () => {
                const revealed = props.text.slice(0, startIndex);
                const remaining = totalLetters - startIndex;
                const flickerLength = Math.min(props.steps, remaining);
                const flicker = Array(flickerLength)
                  .fill(0)
                  .map(() => randomChar())
                  .join("");
                displayText.value = revealed + flicker;
              },
              onComplete: () => {
                displayText.value = props.text;
              },
            });
          }
        }

        currentTimeline = timeline;

        // Emit the timeline to parent
        emit("timeline:created", timeline);

        // Return cleanup function
        return () => {
          if (timeline) {
            timeline.kill();
          }
        };
      },
    );
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (currentTimeline) {
    currentTimeline.kill();
  }
  if (matchMedia) {
    matchMedia.revert();
  }
});
</script>

<template>
  <div class="appearing-text">
    <p class="appearing-text-value" v-html="displayText"></p>
    <p class="appearing-text-clone" aria-hidden="true" v-html="props.text"></p>
  </div>
</template>

<style scoped>
.appearing-text {
  position: relative;
}

.appearing-text-value {
  position: absolute;
}

.appearing-text-clone {
  visibility: hidden;
}
</style>
