import { avatar } from "../../three/objects/avatar";
import { sceneWeightsInOut } from "../scenes";
import { createMatchMedia } from "../utils/matchMedia";
import { room } from "../../three/objects/room";
import { lab } from "../../three/objects/lab";
import gsap from "gsap";

let inMM: gsap.MatchMedia | null = null;
let outTl: gsap.core.Timeline | null = null;
let progressMm: gsap.MatchMedia | null = null;
let sectionsMm: gsap.MatchMedia | null = null;
let scenesMm: gsap.MatchMedia | null = null;

export const aboutProgress = { value: 0 };

const setup = ({
  about,
  tlDescription,
  contentDescription,
  tlServices,
  contentServices,
  tlDetails,
  contentDetails,
  contentProgressCount,
}: {
  about: HTMLElement;
  tlDescription: gsap.core.Timeline;
  contentDescription: HTMLDivElement;
  tlServices: gsap.core.Timeline;
  contentServices: HTMLDivElement;
  tlDetails: gsap.core.Timeline;
  contentDetails: HTMLDivElement;
  contentProgressCount: HTMLDivElement;
}) => {
  setupInAnimation(about);
  setupProgressAnimation(about);
  setupSectionsAnimation({
    about,
    tlDescription,
    contentDescription,
    tlServices,
    contentServices,
    tlDetails,
    contentDetails,
    contentProgressCount,
  });
  setupOutAnimation(about);
  setupScenesAnimation(about);
};

const setupProgressAnimation = (about: HTMLElement) => {
  progressMm = createMatchMedia((_context, { isLandscape }) => {
    const tl = gsap.timeline({
      duration: 1,
      scrollTrigger: {
        trigger: about,
        start: isLandscape ? "top bottom" : "top 75%",
        end: "bottom bottom",
        scrub: true,
      },
    });
    const completed = { value: false };
    tl.to(completed, { value: true, duration: 0 }, 1);

    tl.fromTo(aboutProgress, { value: 0 }, { value: 1, duration: 0.95, ease: "none" }, 0);
  });
};

const setupInAnimation = (about: HTMLElement) => {
  inMM = createMatchMedia((_context, { isMobile, isLandscape }) => {
    const tl = gsap.timeline({
      duration: 1,
      scrollTrigger: {
        trigger: about,
        start: isMobile ? "top bottom" : "-=200px bottom",
        end: "top top",
        scrub: true,
      },
    });

    tl.fromTo(sceneWeightsInOut.hero, { out: 0 }, { out: 1, ease: "none", duration: 1 }, 0);

    tl.fromTo(room.chairScrollRotation, { x: 0, y: 0, z: 0 }, { y: -1.1, duration: 0.6, ease: "power4.out" }, 0);
    tl.fromTo(room.chairScrollRotation, { x: 0, y: 0, z: 0 }, { x: -0.9, z: -1.3, duration: 0.6 }, 0);

    tl.fromTo(avatar.tIdleIntensity, { value: 0 }, { value: 1, duration: 0.75, ease: "power1.out" }, 0);

    tl.fromTo(sceneWeightsInOut.about, { in: 0 }, { in: 1, ease: "none", duration: 1 }, 0);
    tl.fromTo(sceneWeightsInOut["about-1"], { in: 0 }, { in: 1, ease: "none", duration: 1 }, 0);

    tl.fromTo(room.group.scale, { x: 1, y: 1, z: 1 }, { x: 0.85, y: 0.85, z: 0.85, duration: 1, ease: "none" }, 0);
    if (!isLandscape) {
      tl.fromTo(room.group.position, { x: 0, y: 0, z: 0 }, { x: 0, y: 5.4, z: 0, duration: 1, ease: "none" }, 0);
      tl.fromTo(room.group.rotation, { x: 0, y: -2.1, z: 0 }, { x: 0, y: -2.1, z: 0, duration: 1, ease: "none" }, 0);
    } else {
      tl.fromTo(room.group.position, { x: 2, y: 0, z: 0 }, { x: 4.5, y: 5.7, z: 0, duration: 1, ease: "none" }, 0);
      tl.fromTo(
        room.group.rotation,
        { x: 0, y: -2.3, z: 0 },
        { x: 0.1, y: -2.3, z: 0.09, duration: 1, ease: "none" },
        0,
      );
    }

    const { waypointsPosition, waypointsRotation } = avatar;

    if (isLandscape) {
      //lab
      tl.fromTo(lab.group.position, { x: 0, y: 0, z: 6 }, { x: 0, y: 0, z: 6, duration: 1, ease: "power.1out" }, 0);

      tl.fromTo(waypointsPosition, { x: 2, y: 0, z: 0 }, { x: 0, y: 0, z: 6, duration: 1, ease: "power1.out" }, 0);
      tl.fromTo(
        waypointsRotation,
        { x: 0, y: -2.3 + Math.PI / 2, z: 0 },
        //{ x: 0, y: -Math.PI, z: 0, duration: 1, ease: "power1.out" },
        { x: 0, y: -Math.PI, z: 0, duration: 1, ease: "power1.out" },
        0,
      );

      tl.to(
        "#hero-content-inner",
        { x: "27vw", rotate: 4, y: isMobile ? "-5vh" : "10vh", duration: 1, ease: "none" },
        0,
      );
    } else {
      //lab
      tl.fromTo(lab.group.position, { x: 0, y: 0, z: 6 }, { x: 0, y: 0, z: 6, duration: 1, ease: "none" }, 0);

      tl.fromTo(waypointsPosition, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 6, duration: 1, ease: "power1.out" }, 0);
      tl.fromTo(
        waypointsRotation,
        { x: 0, y: -2.1 + Math.PI / 2, z: 0 },
        { x: 0, y: -Math.PI, z: 0, duration: 1, ease: "power1.out" },
        0,
      );
    }
  });
};

const setupOutAnimation = (about: HTMLElement) => {
  outTl = gsap.timeline({
    scrollTrigger: {
      trigger: about,
      start: "bottom bottom",
      end: "bottom top",
      scrub: true,
    },
  });

  outTl.fromTo(sceneWeightsInOut["about"], { out: 0 }, { out: 1, ease: "none", duration: 1 }, 0);
  outTl.fromTo(sceneWeightsInOut["about-2"], { out: 0 }, { out: 1, ease: "none", duration: 1 }, 0);
};

const setupScenesAnimation = (about: HTMLElement) => {
  scenesMm = createMatchMedia((_context) => {
    const tl = gsap.timeline({
      duration: 1,
      scrollTrigger: {
        trigger: about,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });

    const completed = { value: false };
    tl.to(completed, { value: true, duration: 1 }, 0);

    const delay = 0;
    const multiplier = 0.95;
    const duration = (1 - delay * 2) * multiplier;

    const { waypointsRotation } = avatar;
    tl.to(waypointsRotation, { x: 0, y: -Math.PI, z: 0, duration: duration, ease: "power1.inOut" }, delay);

    tl.to(sceneWeightsInOut["about-2"], { in: 1, duration: duration, ease: "power1.inOut" }, delay);
    tl.to(sceneWeightsInOut["about-1"], { out: 1, duration: duration, ease: "power1.inOut" }, delay);
  });
};

const setupSectionsAnimation = ({
  about,
  tlDescription,
  contentDescription,
  tlServices,
  contentServices,
  tlDetails,
  contentDetails,
  contentProgressCount,
}: {
  about: HTMLElement;
  contentDescription: HTMLDivElement;
  contentServices: HTMLDivElement;
  contentDetails: HTMLDivElement;
  contentProgressCount: HTMLDivElement;
  tlDescription: gsap.core.Timeline;
  tlServices: gsap.core.Timeline;
  tlDetails: gsap.core.Timeline;
}) => {
  sectionsMm = createMatchMedia((_context, { isLandscape }) => {
    const tl = gsap.timeline({
      duration: 1,
      scrollTrigger: {
        trigger: about,
        start: isLandscape ? "top 35%" : "top 25%",
        end: "bottom bottom",
        scrub: true,
      },
    });

    const completed = { value: false };
    tl.to(completed, { value: true, duration: 0 }, 1);

    if (isLandscape) {
      // Equal spacing between three animations: 0, 0.275, 0.55
      const DETAILS_DELAY = 0;
      const DESCRIPTION_DELAY = 0.4;
      const SERVICES_DELAY = 0.8;

      // Details animation (first, only on landscape)
      tl.fromTo(contentDetails, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "power1.out" }, DETAILS_DELAY);
      //tl.fromTo(contentDetails, { y: "12.5vh" }, { y: "0vh", duration: 0.35, ease: "none" }, DETAILS_DELAY);
      tl.add(() => {
        tlDetails?.play();
      }, DETAILS_DELAY);

      // Description animation
      tl.fromTo(
        contentDescription,
        { opacity: 0 },
        { opacity: 1, duration: 0.15, ease: "power1.out" },
        DESCRIPTION_DELAY,
      );
      //tl.fromTo(contentDescription, { y: "12.5vh" }, { y: "0vh", duration: 0.35, ease: "none" }, DESCRIPTION_DELAY);
      tl.add(() => {
        tlDescription?.play();
      }, DESCRIPTION_DELAY);

      // Services animation
      tl.fromTo(contentServices, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "power1.out" }, SERVICES_DELAY);
      //tl.fromTo(contentServices, { y: "12.5vh" }, { y: 0, duration: 0.35, ease: "none" }, SERVICES_DELAY);
      tl.add(() => {
        tlServices?.play();
      }, SERVICES_DELAY);
    } else {
      // Mobile: only description and services (details hidden on portrait)
      const DESCRIPTION_DELAY = 0;
      const SERVICES_DELAY = 0.6;

      // Details animation disabled - BoxDetails is hidden on portrait

      // Description animation
      tl.fromTo(
        contentDescription,
        { opacity: 0, y: "10vh" },
        { opacity: 1, y: "0vh", duration: 0.15, ease: "power1.out" },
        DESCRIPTION_DELAY,
      );
      tl.to(contentDescription, { opacity: 0, y: "-10vh", duration: 0.15, ease: "power1.out" }, SERVICES_DELAY - 0.075);
      tl.add(() => {
        tlDescription?.play();
      }, DESCRIPTION_DELAY);

      // Services animation
      tl.fromTo(
        contentServices,
        { opacity: 0, y: "10vh" },
        { opacity: 1, y: "0vh", duration: 0.15, ease: "power1.out" },
        SERVICES_DELAY,
      );
      tl.add(() => {
        tlServices?.play();
      }, SERVICES_DELAY);

      // ProgressCount animation - fade in on portrait, never fade out
      tl.fromTo(
        contentProgressCount,
        { opacity: 0, y: "10vh" },
        { opacity: 1, y: "0vh", duration: 0.15, ease: "power1.out" },
        DESCRIPTION_DELAY,
      );
    }
  });
};

const destroy = () => {
  if (inMM) inMM.revert();
  if (progressMm) progressMm.revert();
  if (outTl) outTl.revert();
  if (sectionsMm) sectionsMm.revert();
  if (scenesMm) scenesMm.revert();
};

export const about = { setup, destroy };
