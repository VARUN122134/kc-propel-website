/* =========================================================
   K&C Propel — interactions
   ========================================================= */

(function () {
  "use strict";

  /* ---------- mobile menu ---------- */
  const header = document.querySelector(".site-header");
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("primary-nav");

  function closeMenu() {
    header.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Open menu");
  }

  if (burger && header) {
    burger.addEventListener("click", function () {
      const open = header.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- active nav link on scroll ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  function setActiveLink() {
    const y = window.scrollY + 140;
    let current = sections[0] ? sections[0].id : null;

    sections.forEach(function (section) {
      if (section.offsetTop <= y) current = section.id;
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href").replace("#", "");
      link.classList.toggle("is-active", href === current || (href === "top" && current === "top"));
    });
  }

  /* ---------- header shadow on scroll ---------- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    setActiveLink();
  }

  let ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );

  /* ---------- reveal on scroll ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(
    ".card, .sector, .method-step, .team-card, .stat, .name-block, .statement-lines"
  );

  if (!prefersReduced && "IntersectionObserver" in window) {
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const index = Array.prototype.indexOf.call(el.parentNode.children, el);
          el.style.transitionDelay = Math.min(index * 55, 320) + "ms";
          el.classList.add("is-visible");
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- contact form ---------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");

      if (name && !name.value.trim()) {
        if (status) status.textContent = "Please add your name so we know who to reply to.";
        name.focus();
        return;
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        if (status) status.textContent = "Please check that business email address.";
        email.focus();
        return;
      }

      if (status) {
        status.textContent =
          "Thanks" + (name && name.value.trim() ? ", " + name.value.trim().split(" ")[0] : "") +
          ". Your message is ready to send — connect a form endpoint to deliver it.";
      }

      /* TODO: point this at the customer's endpoint (Formspree, Netlify Forms, CRM, etc.)
         Example:
         fetch("https://formspree.io/f/XXXX", {
           method: "POST",
           headers: { "Content-Type": "application/json", Accept: "application/json" },
           body: JSON.stringify(Object.fromEntries(new FormData(form)))
         });
      */
    });
  }

  /* ---------- year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- smooth anchor offset for browsers without scroll-padding ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: top, behavior: prefersReduced ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    });
  });
})();
