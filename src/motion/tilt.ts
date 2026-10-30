/**
 * Pointer tilt on cards. Desktop pointers only, and only where motion is welcome.
 * Purely decorative: never required to read content.
 */
export function initTilt(): void {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reduced) return;

  const targets = document.querySelectorAll<HTMLElement>(".card, .sector, .team-card");

  targets.forEach((el) => {
    let frame = 0;
    let inside = false;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        inside = true;
        el.style.transform =
          `perspective(1000px) rotateX(${(-py * 4.5).toFixed(2)}deg) ` +
          `rotateY(${(px * 5.5).toFixed(2)}deg) translateY(-2px)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      if (!inside) return;
      inside = false;
      el.style.transform = "";
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
  });
}
