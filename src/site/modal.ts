export interface ModalContent {
  kicker: string;
  title: string;
  body: string;
  points: string[];
  ctaHref?: string;
  ctaLabel?: string;
}

interface ModalHandle {
  open(content: ModalContent): void;
  close(): void;
}

/**
 * One accessible dialog, reused for every service. Focus is trapped while it is
 * open, the page behind it is locked, and focus returns to the control that
 * opened it. Open/close motion is CSS (see discover.css).
 */
export function createModal(root: HTMLElement): ModalHandle {
  const panel = root.querySelector<HTMLElement>(".modal-panel");
  const kicker = root.querySelector<HTMLElement>("[data-modal-kicker]");
  const title = root.querySelector<HTMLElement>("[data-modal-title]");
  const body = root.querySelector<HTMLElement>("[data-modal-body]");
  const list = root.querySelector<HTMLElement>("[data-modal-points]");
  const cta = root.querySelector<HTMLAnchorElement>("[data-modal-cta]");
  const closeBtn = root.querySelector<HTMLElement>(".modal-close");

  if (!panel || !title || !body || !list) {
    return { open: () => undefined, close: () => undefined };
  }

  let lastFocus: HTMLElement | null = null;

  const focusables = () =>
    Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);

  const close = () => {
    if (!root.classList.contains("is-open")) return;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("is-locked");
    lastFocus?.focus({ preventScroll: true });
  };

  const open = (content: ModalContent) => {
    lastFocus = document.activeElement as HTMLElement;

    if (kicker) kicker.textContent = content.kicker;
    title.textContent = content.title;
    body.textContent = content.body;
    list.innerHTML = "";
    content.points.forEach((point) => {
      const li = document.createElement("li");
      li.textContent = point;
      list.append(li);
    });
    if (cta) {
      cta.href = content.ctaHref ?? "../contact/";
      cta.textContent = content.ctaLabel ?? "Start a conversation";
    }

    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("is-locked");

    window.setTimeout(() => closeBtn?.focus({ preventScroll: true }), 60);
  };

  root.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (event) => {
    if (!root.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") return;
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  return { open, close };
}
