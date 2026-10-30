import "./styles/site.css";
import "./styles/stage.css";

import { initScroll } from "./motion/scroll";
import { heroIntro, initReveals } from "./motion/reveals";
import { initRail } from "./motion/rail";
import { initTilt } from "./motion/tilt";
import { initHeader } from "./ui/header";
import { initForm } from "./ui/form";
import { runLoader } from "./ui/loader";
import { initStage, type StageHandle } from "./stage/renderer";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function boot(): void {
  document.documentElement.classList.add("js");

  initHeader();
  initForm();
  initScroll(reduced);
  initRail();

  let stage: StageHandle | null = null;
  if (!reduced) {
    const lowPower =
      window.innerWidth < 900 ||
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      window.matchMedia("(hover: none)").matches;

    stage = initStage({
      quality: lowPower ? "low" : "high",
      allowPointer: !lowPower,
    });

    initTilt();
  }

  const ready = stage ? stage.ready : Promise.resolve();
  void runLoader(ready).then(() => {
    if (!reduced) {
      heroIntro();
      void initReveals();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
