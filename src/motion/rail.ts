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

  const mm = gsap.matchMedia();

  mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

    const tween = gsap.to(track, { x: () => -distance(), ease: "none" });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.max(480, distance() + window.innerHeight * 0.5)}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.7,
      animation: tween,
      invalidateOnRefresh: true,
    });

    return () => {
      trigger.kill();
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
    };
  });
}
