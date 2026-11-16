# K&C — website

**Live:** https://varun122134.github.io/kc-propel-website/
**Repo:** https://github.com/VARUN122134/kc-propel-website

**Business Development × Sales Growth** — a five-page brand experience in deep
burgundy, champagne gold and warm ivory. Built with Vite + TypeScript and GSAP.

## Pages

| Path | What it is |
| --- | --- |
| `/` | Landing. The floating K&C monogram, the tagline and one clear way in. |
| `/discover/` | The QR-inspired service hub: six disciplines around a central K&C. |
| `/about/` | The business and the five-stage approach. |
| `/contact/` | Enquiry form, email, WhatsApp and what happens next. |
| `/profile/` | The dedicated QR destination: intro, six services, approach, contact. |

Every page is a real document, not a client-side route, so a QR code can point
straight at `/profile/` and every link always resolves.

## Running it

```sh
npm install
npm run dev      # http://localhost:5177
npm run build    # typecheck + production build into dist/
npm run preview  # serve dist/ at the Pages base path
```

Node 20+ required. `tsc --noEmit` runs as part of `build`.

## Structure

```
index.html                 landing page
discover/index.html        hub + modal shell + no-JS fallback
about/index.html           about & approach
contact/index.html         contact form and direct channels
profile/index.html         QR destination / company profile

src/pages/*.ts             one entry per page: imports its styles, boots its UI
src/site/config.ts         brand name, tagline, email, WhatsApp, base path
src/site/services.ts       the six disciplines + five approach stages (shared copy)
src/site/chrome.ts         sticky header, mobile menu, scroll hairline, page veil
src/site/monogram.ts       monogram float, pointer tilt, moving highlight
src/site/dust.ts           canvas champagne motes
src/site/reveal.ts         masked headline reveals, scroll reveals, parallax
src/site/modal.ts          accessible service dialog with focus trap

src/styles/tokens.css      brand colours, type stacks, layout and motion tokens
src/styles/base.css        reset, type scale, header/footer, buttons, form, veil
src/styles/monogram.css    the coin, orbit, gloss and spark
src/styles/landing.css     landing composition
src/styles/discover.css    hub grid, nodes, traveler, marquee, modal
src/styles/pages.css       shared hero, stage rail and closing band
src/styles/about.css       about-specific layout
src/styles/contact.css     form + direct panel
src/styles/profile.css     the compact QR profile
```

## The brand system

| Token | Value | Use |
| --- | --- | --- |
| `--ivory` | `#FAF9F6` | page background |
| `--ivory-2` | `#F3F0E9` | alternating bands |
| `--burgundy` | `#702632` | primary brand, headings, buttons |
| `--burgundy-ink` | `#2C1216` | dark bands and footer |
| `--gold` | `#C6A66B` | accents, rules, the orbit |
| `--charcoal` | `#282526` | body text |
| `--muted` | `#6F6663` | secondary text |

**Type:** DUNE for display headings, DM Sans for body copy and Cormorant Garamond
italic for the serif counterpoint.

DUNE is a licensed display face and is not redistributable, so **the build ships
without it** and falls back to Jost. To switch it on, drop the licensed webfont
into `public/fonts/dune-regular.woff2` and uncomment the `@font-face` block at the
bottom of `src/styles/tokens.css`. Nothing else changes.

### The monogram

The K&C mark is CSS and SVG, not WebGL: a burgundy coin with a champagne serif
monogram, a soft extruded edge, a rotating gloss, a slow orbit and a highlight
that follows the pointer. It floats continuously, tilts on hover and appears at
three sizes across the site (small in the chrome, medium in the hub, large on the
landing page). Under `prefers-reduced-motion` it is completely static.

### The discovery hub

A 3×3 QR-like grid: the K&C hub in the centre, six service nodes in the outer
cells, finder-square corners and a faint module grid. Thin dashed connectors are
drawn at runtime from the measured node centres, and a single gold traveler
patrols the six nodes. It routes through the centre each time, so the motion
tells the same story as the layout: everything passes through K&C.

Hovering or focusing a node sends the traveler to it and highlights the card.
Clicking opens one shared dialog with the service description and next step.
The centre opens the full company overview. Below 900px the hub becomes a
stacked list (core first) and the traveler/connectors are removed.

## Motion

GSAP + SplitText + ScrollTrigger. One vocabulary throughout: masked lines rising,
short reveals, gentle drifts and a handful of slow ambient loops.

| Where | What |
| --- | --- |
| Landing | monogram float, gloss sweep, orbit, pointer tilt, halo |
| Header | gold hairline that tracks scroll progress |
| Headlines | masked line-by-line reveals on scroll |
| Sections | staggered fades and parallax drifts |
| Hub | dashed connectors, orbiting ring, patrol traveler, card highlight |
| Marquee | slow discipline ticker (pauses on hover) |
| About | stage rail fills as the five stages come into view |
| Quote / closing | slow sheen sweep, floating marks |
| Throughout | champagne dust motes on a low-frame-rate canvas |

All of it is skipped under `prefers-reduced-motion: reduce`, and none of it is
needed to read or use the page.

## Accessibility and fallbacks

- The service dialog traps focus, closes on Escape or backdrop click, locks the
  page behind it and returns focus to the control that opened it.
- The burger exposes `aria-expanded` / `aria-controls`; the current page is marked
  with `aria-current="page"`.
- Form fields have real labels, a `role="status"` live region and native
  validation; contact links are real `mailto:` and `https://wa.me/` links.
- `prefers-reduced-motion` disables the dust canvas, the traveler, the marquee and
  every scroll animation.
- Without JavaScript the hub is replaced by a readable six-service list; all other
  pages remain fully readable.
- Canvas and decorative marks are `aria-hidden` and `pointer-events: none`.

## The enquiry form

There is no backend in this build, so a valid enquiry is passed to the visitor's
mail client with every field pre-filled (`mailto:hello@kcpropel.com`). To deliver
it server-side instead, set an endpoint (Formspree, Web3Forms, the client's CRM
webhook) and replace the submit handler in `src/pages/contact.ts`.

## QR codes

Point the ME-QR code at:

- `https://varun122134.github.io/kc-propel-website/profile/` for the full company
  profile (intro, six services, approach, contact) — the recommended destination;
- `https://varun122134.github.io/kc-propel-website/discover/` for the interactive
  service hub;
- `https://varun122134.github.io/kc-propel-website/contact/` for a code printed on
  a proposal or business card.

Use a different code per placement and keep the destination in ME-QR so it can be
repointed without reprinting.

## Deploying

Hosted on GitHub Pages. Every push to `main` runs
`.github/workflows/deploy.yml`, builds the site and publishes `dist/`.

```sh
git add -A
git commit -m "Update copy"
git push
```

One-time repo setting: **Settings → Pages → Build and deployment → Source** must be
**GitHub Actions**, because the site is built rather than served from the repo root.

Any static host works too — Netlify, Vercel and Cloudflare Pages detect Vite and
need no configuration beyond `npm run build` and a `dist` output directory.

## Before going live — replace these

1. **DUNE licence** — add the licensed webfont and enable the `@font-face` block in
   `src/styles/tokens.css` (currently falls back to Jost).
2. **WhatsApp number** — `src/site/config.ts` uses `https://wa.me/?text=…` with no
   number, which opens WhatsApp's own contact picker. Set the real number
   (`https://wa.me/91XXXXXXXXXX?text=…`) and update the same links in the HTML.
3. **Email** — `hello@kcpropel.com` is the assumed address in `src/site/config.ts`
   and every page. Confirm or replace it.
4. **Form endpoint** — swap the mailto handler in `src/pages/contact.ts` for a real
   endpoint when one exists.
5. **Copy review** — service descriptions, the five stages and the profile intro are
   written from the brief and should be signed off by the client.
6. **OG image** — add `assets/og.jpg` and an `og:image` tag per page for link previews.

The client's PDF and page renders (`K&C.pdf`, `reference/spec-pages/`) stay on your
machine only and are not tracked.

## Notes

- Bundle: GSAP (+ SplitText/ScrollTrigger) is the only runtime dependency;
  `three` and `lenis` were removed with the rebrand. The shared JS chunk is
  ~127 kB (~50 kB gzip) and is deferred as a module.
- The previous 3D one-pager is preserved in git history at commit `007f7aa`.
- Tested at 1440×900, 1024×800 and 390×844, with reduced motion and with
  JavaScript disabled.
