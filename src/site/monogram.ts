import { gsap } from "gsap";

/**
 * The monogram: a slow float, a pointer-driven tilt and a highlight that follows
 * the cursor. The tilt lives on the coin so it never fights the float.
 */
export function initMonograms(): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  document.querySelectorAll<HTMLElement>("[data-monogram]").forEach((el) => {
    const float = el.querySelector<HTMLElement>(".mono-float");
    const disc = el.querySelector<HTMLElement>(".mono-disc");
    const shadow = el.querySelector<HTMLElement>(".mono-shadow");
    const spark = el.querySelector<HTMLElement>(".mono-spark");
    if (!float) return;

    if (!reduced) {
      const bob = gsap.to(float, {
        y: -9,
        duration: 3.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(float, {
        rotate: 1.4,
        duration: 5.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.6,
      });
      if (shadow) {
        gsap.to(shadow, {
          scaleX: 0.9,
          opacity: 0.72,
          duration: bob.vars.duration as number,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }

    if (!fine || !disc || el.offsetWidth < 90) return;

    const reset = () => {
      disc.style.setProperty("--rx", "0deg");
      disc.style.setProperty("--ry", "0deg");
      spark?.style.setProperty("--mx", "32%");
      spark?.style.setProperty("--my", "24%");
    };

    el.addEventListener("pointermove", (event) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      disc.style.setProperty("--ry", `${(px * 20).toFixed(2)}deg`);
      disc.style.setProperty("--rx", `${(-py * 16).toFixed(2)}deg`);
      spark?.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
      spark?.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
    });

    el.addEventListener("pointerleave", reset);
  });
}
