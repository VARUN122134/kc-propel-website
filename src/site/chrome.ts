import { SITE } from "./config";

/**
 * Site chrome shared by every page: sticky header, mobile menu, footer year and
 * the champagne veil that covers the gap between page loads.
 */
export function initChrome(): void {
  const header = document.querySelector<HTMLElement>(".site-header");
  const burger = document.querySelector<HTMLButtonElement>(".burger");
  const nav = document.getElementById("primary-nav");

  if (header && burger && nav) {
    const close = () => {
      header.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-label", "Open menu");
    };

    burger.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* a hairline of gold that tracks how far through the page you are */
  if (header) {
    const bar = document.createElement("span");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    header.append(bar);

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
  }

  document.querySelectorAll<HTMLElement>("[data-year]").forEach((el) => {
    el.textContent = String(SITE.year);
  });

  initVeil();
}

function initVeil(): void {
  const veil = document.querySelector<HTMLElement>(".veil");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!veil || reduced) return;

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    const href = link.getAttribute("href") ?? "";
    if (!href || href.startsWith("#")) return;
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

    event.preventDefault();
    veil.classList.add("is-on");
    window.setTimeout(() => window.location.assign(href), 340);
  });

  // returning via the back button restores the page from cache — drop the veil
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) veil.classList.remove("is-on");
  });
}
