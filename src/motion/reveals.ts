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
    ".statement .h2, .section-head .h2, .founder .h2, .results-inner .h2, .about-close-lead, .closing-line, .contact-copy .h2",
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

  // The three closing lines of the statement land one after another.
  const statementLines = document.querySelectorAll<HTMLElement>(".statement-lines span");
  if (statementLines.length) {
    gsap.from(statementLines, {
      y: 26,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.14,
      scrollTrigger: { trigger: ".statement-lines", start: "top 88%", once: true },
    });
  }

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

  // Sector icons arrive a beat after their row, so the grid draws itself in.
  const sectorIcons = document.querySelectorAll<HTMLElement>(".sector-icon");
  if (sectorIcons.length) {
    gsap.from(sectorIcons, {
      opacity: 0,
      scale: 0.6,
      rotate: -12,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.04,
      scrollTrigger: { trigger: ".sector-grid", start: "top 86%", once: true },
    });
  }

  // Results: the three stat words settle in letter by letter.
  document.querySelectorAll<HTMLElement>(".stat-value").forEach((value) => {
    const split = new SplitText(value, { type: "chars" });
    gsap.from(split.chars, {
      yPercent: 60,
      opacity: 0,
      duration: 0.65,
      ease: "power3.out",
      stagger: 0.035,
      scrollTrigger: { trigger: value, start: "top 90%", once: true },
    });
  });

  // Founder message: the accent rule draws down as the words settle in.
  const quote = document.querySelector<HTMLElement>(".founder-quote");
  if (quote) {
    const split = new SplitText(quote, { type: "words" });
    gsap.from(split.words, {
      opacity: 0,
      y: 10,
      duration: 0.5,
      ease: "power2.out",
      stagger: 0.014,
      scrollTrigger: { trigger: quote, start: "top 84%", once: true },
    });

    gsap.fromTo(
      quote,
      { "--rule": 0 },
      {
        "--rule": 1,
        ease: "none",
        scrollTrigger: {
          trigger: quote,
          start: "top 86%",
          end: "bottom 62%",
          scrub: 0.5,
        },
      },
    );
  }

  // Method: the rule above the five steps extends across the band, and each
  // number ring pops in on its own.
  const method = document.querySelector<HTMLElement>(".method");
  if (method) {
    gsap.fromTo(
      method,
      { "--draw": 0 },
      {
        "--draw": 1,
        ease: "none",
        scrollTrigger: { trigger: method, start: "top 84%", end: "bottom 62%", scrub: 0.6 },
      },
    );

    gsap.from(".method-num", {
      opacity: 0,
      scale: 0.7,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: method, start: "top 80%", once: true },
    });
  }

  // Decorative numerals and marks drift against the page as it scrolls.
  document.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) => {
    const amount = Number(el.dataset.drift) || 22;
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
