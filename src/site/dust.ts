/**
 * Champagne dust: a very light canvas field of slow gold motes.
 * Sits behind content, stops when the tab is hidden, and never runs when the
 * visitor asked for reduced motion.
 */
export function initDust(canvas: HTMLCanvasElement, density = 1): (() => void) | void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let raf = 0;
  let running = true;

  interface Mote {
    x: number;
    y: number;
    r: number;
    vy: number;
    drift: number;
    phase: number;
    speed: number;
    alpha: number;
  }
  let motes: Mote[] = [];

  const build = () => {
    const count = Math.round(
      Math.min(70, Math.max(18, (width * height) / 26000)) * density,
    );
    motes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.7 + Math.random() * 1.9,
      vy: 0.08 + Math.random() * 0.26,
      drift: 0.4 + Math.random() * 1.1,
      phase: Math.random() * Math.PI * 2,
      speed: 0.0015 + Math.random() * 0.004,
      alpha: 0.14 + Math.random() * 0.34,
    }));
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  };

  let last = 0;
  const frame = (time: number) => {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    if (time - last < 32) return; // ~30fps is plenty for dust
    last = time;

    ctx.clearRect(0, 0, width, height);
    for (const m of motes) {
      m.y -= m.vy;
      m.phase += m.speed * 16;
      m.x += Math.sin(m.phase) * m.drift * 0.28;

      if (m.y < -12) {
        m.y = height + 12;
        m.x = Math.random() * width;
      }

      const twinkle = 0.65 + Math.sin(m.phase * 2) * 0.35;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(198, 166, 107, ${(m.alpha * twinkle).toFixed(3)})`;
      ctx.fill();
    }
  };

  const onVisibility = () => {
    running = document.visibilityState === "visible";
  };

  resize();
  raf = requestAnimationFrame(frame);

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
