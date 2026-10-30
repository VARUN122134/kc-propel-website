import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildPropelObject, type PropelObject } from "./object";
import { sampleFrame } from "./chapters";
import { smoothstep } from "./math";

export interface StageHandle {
  /** Resolves after the first frame has been painted. */
  ready: Promise<void>;
  dispose(): void;
}

interface Options {
  quality: "high" | "low";
  allowPointer: boolean;
}

const DPR_CAP = 1.6;
/** Fixed camera distance — positioning is expressed in screen fractions. */
const CAM_Z = 10;
/** Dotted-ring bounding diameter in object-local units (see object.ts). */
const OBJECT_DIAMETER = 4.288;
/** How close (as a fraction of viewport height) a section seam may get before the stage fades. */
const SEAM_BAND = 0.16;

export function initStage({ quality, allowPointer }: Options): StageHandle | null {
  const canvas = document.getElementById("stage") as HTMLCanvasElement | null;
  if (!canvas) return null;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setClearAlpha(0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 120);
  camera.position.set(0, 0, CAM_Z);
  camera.lookAt(0, 0, 0);

  const object: PropelObject = buildPropelObject(quality);
  scene.add(object.root);

  // ---- scroll progress ---------------------------------------------------
  let targetProgress = 0;
  const progressTrigger = ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      targetProgress = self.progress;
    },
  });

  // ---- geometry of the document ------------------------------------------
  // Section seams are where the page changes background colour. The stage must
  // never be split in half by one, so it fades out as a seam crosses centre.
  let sections: HTMLElement[] = [];
  let seamTops: number[] = [];
  let darkFlags: boolean[] = [];

  const measure = () => {
    sections = Array.from(document.querySelectorAll<HTMLElement>("main section"));
    seamTops = [];
    darkFlags = sections.map((s) => s.classList.contains("section-dark"));
    for (let i = 1; i < sections.length; i++) {
      seamTops.push(sections[i].getBoundingClientRect().top + window.scrollY);
    }
  };
  measure();

  // ---- viewport ----------------------------------------------------------
  let vw = window.innerWidth;
  let vh = window.innerHeight;
  let aspect = 1;
  let halfH = 1;
  let halfW = 1;

  const resize = () => {
    vw = window.innerWidth;
    vh = window.innerHeight;
    aspect = vw / vh;
    camera.aspect = aspect;
    camera.fov = vw < 720 ? 46 : 38;
    camera.updateProjectionMatrix();
    halfH = CAM_Z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    halfW = halfH * aspect;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
    renderer.setSize(vw, vh, false);
    measure();
  };
  resize();
  window.addEventListener("resize", resize);
  ScrollTrigger.addEventListener("refresh", measure);

  // ---- pointer -----------------------------------------------------------
  let pointerX = 0;
  let pointerY = 0;
  let pointerTargetX = 0;
  let pointerTargetY = 0;
  const onPointerMove = (event: PointerEvent) => {
    pointerTargetX = (event.clientX / window.innerWidth) * 2 - 1;
    pointerTargetY = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (allowPointer) window.addEventListener("pointermove", onPointerMove, { passive: true });

  // ---- loop --------------------------------------------------------------
  const clock = new THREE.Clock();
  let smoothProgress = 0;
  let smoothTheme = 0;
  let smoothIntensity = 0;
  let firstFrame = false;
  let readyResolve: (() => void) | null = null;
  const ready = new Promise<void>((resolve) => {
    readyResolve = resolve;
  });

  /** 0 while a section seam sits at the viewport centre, 1 once it is clear. */
  const seamFade = (scrollY: number) => {
    let fade = 1;
    const centre = scrollY + vh * 0.5;
    const band = vh * SEAM_BAND;
    for (const top of seamTops) {
      const d = Math.abs(top - centre);
      if (d < band) {
        fade *= smoothstep(0, 1, d / band);
        if (fade === 0) break;
      }
    }
    return fade;
  };

  /** True when the viewport centre is over a dark section. */
  const centreIsDark = (scrollY: number) => {
    const centre = scrollY + vh * 0.5;
    let current = false;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      const top = rect.top + scrollY;
      if (top <= centre && top + rect.height > centre) {
        current = darkFlags[i];
        break;
      }
    }
    return current;
  };

  const frame = () => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;
    const scrollY = window.scrollY;

    smoothProgress += (targetProgress - smoothProgress) * Math.min(1, dt * 4.5);
    smoothTheme +=
      ((centreIsDark(scrollY) ? 1 : 0) - smoothTheme) * Math.min(1, dt * 9);

    pointerX += (pointerTargetX - pointerX) * Math.min(1, dt * 2.6);
    pointerY += (pointerTargetY - pointerY) * Math.min(1, dt * 2.6);

    const narrow = vw < 900;
    const choreo = sampleFrame(smoothProgress);

    // On narrow screens the hero grid stacks: copy first, figure below the fold.
    // Move the diagram down to that figure slot and soften it so it never
    // competes with the headline.
    const mobileHero = narrow && smoothProgress < 0.09;
    const fracX = narrow ? choreo.fracX * 0.34 : choreo.fracX;
    const fracY = mobileHero ? Math.max(choreo.fracY, 0.52) : choreo.fracY;
    const size = narrow ? choreo.size * 0.78 : choreo.size;

    const targetIntensity =
      choreo.opacity * seamFade(scrollY) * (mobileHero ? 0.42 : 1);
    // leave quickly at a seam, return gently
    const rate = targetIntensity < smoothIntensity ? 12 : 5;
    smoothIntensity += (targetIntensity - smoothIntensity) * Math.min(1, dt * rate);

    object.root.position.set(fracX * halfW, -fracY * halfH, 0);
    object.root.rotation.set(choreo.rot[0], choreo.rot[1], choreo.rot[2]);
    object.root.scale.setScalar((size * halfH * 2) / OBJECT_DIAMETER);
    object.applyTheme(smoothTheme);
    object.setIntensity(smoothIntensity);

    camera.position.set(pointerX * 0.4, -pointerY * 0.3, CAM_Z);
    camera.lookAt(0, 0, 0);

    object.tick(dt, elapsed);
    renderer.render(scene, camera);

    if (import.meta.env.DEV || location.search.includes("debug")) {
      (window as unknown as Record<string, unknown>).__stage = {
        progress: +smoothProgress.toFixed(4),
        target: +targetProgress.toFixed(4),
        chapter: +choreo.opacity.toFixed(3),
        seam: +seamFade(scrollY).toFixed(3),
        intensity: +smoothIntensity.toFixed(3),
        theme: +smoothTheme.toFixed(3),
        size: +choreo.size.toFixed(3),
      };
    }

    if (!firstFrame) {
      firstFrame = true;
      document.body.classList.add("stage-ready");
      readyResolve?.();
    }
  };

  renderer.setAnimationLoop(frame);

  const onVisibility = () => {
    if (document.hidden) renderer.setAnimationLoop(null);
    else {
      clock.getDelta();
      renderer.setAnimationLoop(frame);
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return {
    ready,
    dispose() {
      renderer.setAnimationLoop(null);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      ScrollTrigger.removeEventListener("refresh", measure);
      progressTrigger.kill();
      object.dispose();
      renderer.dispose();
    },
  };
}
