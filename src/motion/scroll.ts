import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollHandle {
  lenis: Lenis | null;
  destroy(): void;
}

const HEADER_OFFSET = 88;

/**
 * Lenis drives native window scrolling (so sticky positioning and ScrollTrigger
 * pinning keep working), while GSAP owns all scroll-linked animation.
 */
export function initScroll(reduced: boolean): ScrollHandle {
  if (reduced) {
    bindAnchors(null);
    return { lenis: null, destroy: () => undefined };
  }

  const lenis = new Lenis({
    lerp: 0.085,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  lenis.on("scroll", ScrollTrigger.update);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  bindAnchors(lenis);

  return {
    lenis,
    destroy() {
      gsap.ticker.remove(raf);
      lenis.destroy();
    },
  };
}

function bindAnchors(lenis: Lenis | null) {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET - 16;

      if (lenis) lenis.scrollTo(top, { duration: 1.2 });
      else window.scrollTo({ top, behavior: "auto" });

      history.replaceState(null, "", href);
    });
  });
}
