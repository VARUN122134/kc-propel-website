/**
 * The hairline under the header that fills as you move down the page.
 * Reads scroll once per frame and writes a single transform, so it stays cheap
 * even with Lenis driving the scroll.
 */
export function initProgress(): void {
  const fill = document.querySelector<HTMLElement>(".scroll-progress span");
  if (!fill) return;

  let ticking = false;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fill.style.transform = `scaleX(${progress.toFixed(4)})`;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  // late layout shifts (fonts, rail pinning) change the scrollable height
  window.addEventListener("load", update);

  update();
}
