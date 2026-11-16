import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/monogram.css";
import "../styles/discover.css";

import { gsap } from "gsap";

import { initChrome } from "../site/chrome";
import { initMonograms } from "../site/monogram";
import { initIntro, initMotion } from "../site/reveal";
import { initDust } from "../site/dust";
import { createModal } from "../site/modal";
import { SERVICES } from "../site/services";

document.documentElement.classList.add("js");

initChrome();
initMonograms();
initIntro();
void initMotion();

const dust = document.getElementById("dust");
if (dust instanceof HTMLCanvasElement) initDust(dust, 0.85);

const hub = document.getElementById("hub");
const modalRoot = document.getElementById("service-modal");
const BASE = "/kc-propel-website/";

if (hub && modalRoot) {
  const modal = createModal(modalRoot);

  /* ---------- the six nodes, in the order the hub travels ---------- */

  const byKey = new Map(SERVICES.map((s) => [s.name.toLowerCase(), s]));
  const order = (key: string) => {
    const index = SERVICES.findIndex((s) => s.name.toLowerCase() === key);
    return index === -1 ? 99 : index;
  };

  const nodes = Array.from(
    hub.querySelectorAll<HTMLButtonElement>(".hub-node[data-service]"),
  )
    .map((el) => ({ el, key: el.dataset.service ?? "", x: 50, y: 50 }))
    .sort((a, b) => order(a.key) - order(b.key));

  const core = hub.querySelector<HTMLButtonElement>(".hub-core");
  const svg = hub.querySelector<SVGSVGElement>(".hub-lines");
  const traveler = hub.querySelector<HTMLElement>(".hub-traveler");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- connectors ---------- */

  const hubRect = () => hub.getBoundingClientRect();

  /** Node centres as percentages of the hub, measured rather than assumed. */
  const measure = () => {
    const host = hubRect();
    if (!host.width || !host.height) return false;
    for (const node of nodes) {
      const rect = node.el.getBoundingClientRect();
      node.x = ((rect.left + rect.width / 2 - host.left) / host.width) * 100;
      node.y = ((rect.top + rect.height / 2 - host.top) / host.height) * 100;
    }
    return true;
  };

  const drawLines = () => {
    if (!svg) return;
    if (!measure()) return;
    const host = hubRect();
    if (!host.width || !host.height) return;

    svg.setAttribute("viewBox", `0 0 ${host.width.toFixed(0)} ${host.height.toFixed(0)}`);
    svg.innerHTML = "";

    for (const node of nodes) {
      const cx = (node.x / 100) * host.width;
      const cy = (node.y / 100) * host.height;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", (host.width / 2).toFixed(1));
      line.setAttribute("y1", (host.height / 2).toFixed(1));
      line.setAttribute("x2", cx.toFixed(1));
      line.setAttribute("y2", cy.toFixed(1));
      svg.append(line);

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", cx.toFixed(1));
      dot.setAttribute("cy", cy.toFixed(1));
      dot.setAttribute("r", "1.7");
      dot.setAttribute("fill", "rgba(198, 166, 107, 0.7)");
      svg.append(dot);
    }
  };

  drawLines();
  const redraw = () => requestAnimationFrame(drawLines);
  window.addEventListener("resize", redraw);
  window.addEventListener("orientationchange", redraw);

  if ("ResizeObserver" in window) {
    new ResizeObserver(redraw).observe(hub);
  }
  document.fonts?.ready.then(redraw).catch(() => undefined);

  /* ---------- the traveler ---------- */

  if (traveler && !reduced && getComputedStyle(traveler).display !== "none") {
    let paused = false;
    let step = 0;
    let timer = 0;
    let moveTo: gsap.core.Timeline | null = null;

    const light = (node: { el: HTMLButtonElement } | undefined) => {
      nodes.forEach((n) => n.el.classList.toggle("is-lit", n === node));
    };

    const travel = (x: number, y: number, duration: number, viaCentre = true) => {
      moveTo?.kill();
      const timeline = gsap.timeline();

      if (viaCentre) {
        timeline.to(traveler, {
          left: "50%",
          top: "50%",
          duration: duration * 0.45,
          ease: "power2.in",
        });
      }
      timeline.to(traveler, {
        left: `${x}%`,
        top: `${y}%`,
        duration: viaCentre ? duration * 0.55 : duration,
        ease: "power2.out",
      });

      moveTo = timeline;
    };

    const arrive = (index: number) => {
      const target = nodes[index];
      if (!target) return;
      travel(target.x, target.y, 1.8);
      light(target);
    };

    const patrol = () => {
      if (!paused && document.visibilityState === "visible" && measure()) {
        step = (step + 1) % nodes.length;
        arrive(step);
      }
      timer = window.setTimeout(patrol, 3300);
    };

    gsap.set(traveler, { opacity: 1 });
    if (measure()) arrive(0);
    timer = window.setTimeout(patrol, 3300);

    const hold = (node: (typeof nodes)[number]) => {
      paused = true;
      step = nodes.indexOf(node);
      if (!measure()) return;
      travel(node.x, node.y, 0.55);
      light(node);
    };

    nodes.forEach((node) => {
      node.el.addEventListener("pointerenter", () => hold(node));
      node.el.addEventListener("focus", () => hold(node));
      node.el.addEventListener("pointerleave", () => {
        paused = false;
      });
      node.el.addEventListener("blur", () => {
        paused = false;
      });
    });

    const centre = () => {
      paused = true;
      light(undefined);
      travel(50, 50, 0.6, false);
    };

    if (core) {
      core.addEventListener("pointerenter", centre);
      core.addEventListener("focus", centre);
      core.addEventListener("pointerleave", () => {
        paused = false;
      });
      core.addEventListener("blur", () => {
        paused = false;
      });
    }

    document.addEventListener("visibilitychange", () => {
      window.clearTimeout(timer);
      if (document.visibilityState === "visible") {
        timer = window.setTimeout(patrol, 900);
      }
    });

    window.addEventListener("pagehide", () => {
      window.clearTimeout(timer);
      moveTo?.kill();
    });
  }

  /* ---------- dialogs ---------- */

  const openService = (key: string) => {
    const service = byKey.get(key);
    if (!service) return;
    modal.open({
      kicker: "Discipline",
      title: service.name,
      body: `${service.field}. ${service.body}`,
      points: service.points,
      ctaHref: `${BASE}contact/`,
      ctaLabel: `Talk to us about ${service.name.toLowerCase()}`,
    });
  };

  nodes.forEach((node) => {
    node.el.addEventListener("click", () => openService(node.key));
  });

  const openOverview = () => {
    modal.open({
      kicker: "K&C",
      title: "The full picture",
      body:
        "K&C is a business development and sales growth partner. We work across six disciplines as one system — finding the opportunity, opening the conversation, deciding the strategy, keeping the pipeline honest, running the sales work and presenting it well. Most businesses start with two or three of them.",
      points: SERVICES.map((s) => `${s.name} — ${s.field}`),
      ctaHref: `${BASE}about/`,
      ctaLabel: "See how we work",
    });
  };

  core?.addEventListener("click", openOverview);

  /* the modal's own links should not leave the veil behind */
  modalRoot.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
    link.addEventListener("click", () => modal.close());
  });
}
