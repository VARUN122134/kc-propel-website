import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

/** Animated once the loader is gone. */
export function heroIntro(): void {
  const copy = [".hero .eyebrow", ".hero .hero-lede", ".hero .btn-row", ".process-strip"];

  const heading = document.querySelector<HTMLElement>(".hero .display");
  let lines: Element[] = [];

  if (heading) {
    const split = new SplitText(heading, { type: "lines", mask: "lines" });
    lines = split.lines;
  }

  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  tl.from(lines, { yPercent: 118, duration: 1.15, stagger: 0.085 }, 0.05);
  tl.from(copy, { y: 22, opacity: 0, duration: 0.9, stagger: 0.07 }, 0.28);

  const figure = document.querySelector(".hero-figure");
  if (figure) tl.from(figure, { opacity: 0, duration: 1.2 }, 0.35);
}

/** Scroll-triggered reveals for every section below the fold. */
export async function initReveals(): Promise<void> {
  // SplitText must not measure before the webfonts settle.
  try {
    await document.fonts.ready;
  } catch {
    /* fonts API unavailable — split anyway */
  }

  const headings = document.querySelectorAll<HTMLElement>(
    ".statement .h2, .section-head .h2, .founder .h2, .results-inner .h2, .about-close-lead",
  );

  headings.forEach((heading) => {
    const split = new SplitText(heading, { type: "lines", mask: "lines" });
    gsap.from(split.lines, {
      yPercent: 110,
      duration: 1,
      ease: "expo.out",
      stagger: 0.055,
      scrollTrigger: { trigger: heading, start: "top 86%", once: true },
    });
  });

  ScrollTrigger.batch(".card, .sector, .method-step, .team-card, .stat, .name-block, .campaign-head", {
    start: "top 90%",
    once: true,
    onEnter: (batch) =>
      gsap.from(batch, {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.055,
        clearProps: "transform",
      }),
  });

  ScrollTrigger.refresh();
}
