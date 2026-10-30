/**
 * Entry loader. It reports real readiness but never traps the user:
 * a hard ceiling releases the page after 2.6s even if the 3D stage is slow.
 */
export async function runLoader(ready: Promise<unknown>): Promise<void> {
  const overlay = document.getElementById("loader");
  const fill = document.getElementById("loader-fill");
  if (!overlay || !fill) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    overlay.remove();
    return;
  }

  let settled = false;
  ready.then(
    () => (settled = true),
    () => (settled = true),
  );

  let progress = 0;
  const start = performance.now();

  await new Promise<void>((resolve) => {
    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed > 2600) settled = true;

      const ceiling = settled ? 100 : Math.min(92, (elapsed / 1100) * 92);
      progress = Math.min(ceiling, progress + 3);
      fill.style.width = `${progress}%`;

      if (progress < 100) {
        requestAnimationFrame(tick);
        return;
      }
      window.setTimeout(resolve, 160);
    };
    requestAnimationFrame(tick);
  });

  overlay.classList.add("is-done");
  document.body.classList.add("entered");
  window.setTimeout(() => overlay.remove(), 900);
}
