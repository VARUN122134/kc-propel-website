import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/monogram.css";
import "../styles/pages.css";
import "../styles/about.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { initChrome } from "../site/chrome";
import { initMonograms } from "../site/monogram";
import { initIntro, initMotion } from "../site/reveal";
import { initDust } from "../site/dust";

gsap.registerPlugin(ScrollTrigger);

document.documentElement.classList.add("js");

initChrome();
initMonograms();
initIntro();
void initMotion();

const dust = document.getElementById("dust");
if (dust instanceof HTMLCanvasElement) initDust(dust, 0.8);

/* the approach rail fills as the five stages come into view */
const wrap = document.querySelector<HTMLElement>("[data-stages]");
const bar = wrap?.querySelector<HTMLElement>(".stages-progress");
const stages = Array.from(document.querySelectorAll<HTMLElement>("[data-stage]"));
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (wrap && bar && stages.length) {
  if (reduced) {
    stages.forEach((stage) => stage.classList.add("is-on"));
  } else {
    const horizontal = window.matchMedia("(min-width: 961px)").matches;
    const last = Math.max(stages.length - 1, 1);

    gsap.fromTo(
      bar,
      horizontal ? { scaleX: 0 } : { scaleY: 0 },
      {
        scaleX: horizontal ? 1 : 0,
        scaleY: horizontal ? 1 : 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top 80%",
          end: horizontal ? "bottom 55%" : "bottom 70%",
          scrub: 0.4,
          onUpdate: (self) => {
            const passed = self.progress * last;
            stages.forEach((stage, index) => {
              stage.classList.toggle("is-on", index <= Math.ceil(passed));
            });
          },
        },
      },
    );
  }
}
