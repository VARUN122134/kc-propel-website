/** Header behaviour: mobile menu, scroll state, active section link. */
export function initHeader(): void {
  const header = document.querySelector<HTMLElement>(".site-header");
  const burger = document.querySelector<HTMLButtonElement>(".burger");
  const nav = document.getElementById("primary-nav");
  if (!header || !burger) return;

  const closeMenu = () => {
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

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-link"));

  let ticking = false;
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);

    const marker = window.scrollY + window.innerHeight * 0.32;
    let current = "top";
    for (const section of sections) {
      if (section.offsetTop <= marker) current = section.id;
    }

    for (const link of links) {
      const href = (link.getAttribute("href") ?? "").replace("#", "");
      link.classList.toggle("is-active", href === current);
    }
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true },
  );

  onScroll();
}
