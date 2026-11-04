import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Desktop only: pin the campaigns section and translate the card rail
 * horizontally while the page scrolls. Below 1024px the rail is a normal grid.
 */
export function initRail(): void {
  const section = document.querySelector<HTMLElement>(".campaigns");
  const track = document.querySelector<HTMLElement>(".campaign-track");
  if (!section || !track) return;

  const fill = document.querySelector<HTMLElement>(".rail-progress span");
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${Math.max(480, distance() + window.innerHeight * 0.5)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });

    tl.to(track, { x: () => -distance(), ease: "none" }, 0);
    if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set(track, { clearProps: "transform" });
      if (fill) gsap.set(fill, { clearProps: "transform" });
    };
  });
}
