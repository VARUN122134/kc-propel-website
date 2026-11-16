import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Above-the-fold entrance, played once the page is painted. */
export function initIntro(): void {
  if (reduced()) return;
  const items = document.querySelectorAll<HTMLElement>("[data-intro]");
  if (!items.length) return;

  gsap.from(items, {
    y: 26,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    stagger: 0.085,
    delay: 0.08,
    clearProps: "transform",
  });
}

/** Scroll-driven reveals and gentle drifts. */
export async function initMotion(): Promise<void> {
  if (reduced()) return;

  try {
    await document.fonts.ready;
  } catch {
    /* split anyway */
  }

  document.querySelectorAll<HTMLElement>("[data-lines]").forEach((el) => {
    const split = new SplitText(el, { type: "lines", mask: "lines" });
    gsap.from(split.lines, {
      yPercent: 112,
      duration: 1.05,
      ease: "expo.out",
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });

  ScrollTrigger.batch("[data-reveal]", {
    start: "top 92%",
    once: true,
    onEnter: (batch) =>
      gsap.from(batch, {
        y: 22,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        clearProps: "transform",
      }),
  });

  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
    const amount = Number(el.dataset.parallax) || 24;
    gsap.fromTo(
      el,
      { y: -amount },
      {
        y: amount,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });

  ScrollTrigger.refresh();
}
