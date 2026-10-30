# K&C Propel — website

**Live:** https://varun122134.github.io/kc-propel-website/
**Repo:** https://github.com/VARUN122134/kc-propel-website

**Business Development × Sales × Strategy** — one page, fourteen sections.

The site is a Vite + TypeScript build. The hero diagram is a real 3D scene
(three.js) that travels the page as you scroll, and every section below it is
plain semantic HTML with GSAP-driven reveals.

## Running it

```sh
npm install
npm run dev      # http://localhost:5177
npm run build    # typecheck + production build into dist/
npm run preview  # serve dist/
```

Node 20+ required. `tsc --noEmit` runs as part of `build`, so a type error fails
the build before anything is emitted.

## Structure

```
index.html               all markup: 14 sections, inline SVG icon sprite
src/main.ts              boot order
src/styles/site.css      design tokens, layout, section styling
src/styles/stage.css     canvas, loader, campaign rail, motion states
src/stage/renderer.ts    renderer, camera, scroll progress, seams, pointer parallax
src/stage/object.ts      nucleus, rings, spokes, labels, particle field
src/stage/chapters.ts    the camera choreography (screen-relative keyframes)
src/stage/textures.ts    canvas textures: dot, glow, diagram labels
src/motion/scroll.ts     Lenis + ScrollTrigger wiring, anchor offsets
src/motion/reveals.ts    hero intro and scroll reveals
src/motion/rail.ts       pinned horizontal campaign rail (desktop only)
src/motion/tilt.ts       pointer tilt on cards (desktop pointers only)
src/ui/loader.ts         entry loader with a hard 2.6s ceiling
src/ui/header.ts         mobile menu, sticky state, active nav link
src/ui/form.ts           contact form validation + submit stub
```

## The 3D stage

The object is the hero diagram extruded: ink hairlines on paper, one burnt-orange
nucleus, labelled **PROSPECT → ENGAGE → OPPORTUNITY** (the same story the original
SVG told). It sits on a fixed canvas above the section backgrounds and below the
copy.

Two rules keep it from fighting the page:

- **Chapter choreography** (`chapters.ts`) is expressed in screen fractions
  (`fracX`, `fracY`, `size`) rather than world units, so the composition holds at
  any viewport size. Strong at the hero, a large quiet watermark on dark sections,
  and nearly gone over dense content.
- **Seam fading** (`renderer.ts`) fades the stage out whenever a section edge
  approaches the middle of the viewport, so the object is never sliced in half by
  a paper↔ink boundary.

Theme inversion is driven by whichever section sits under the viewport centre: dark
sections get light hairlines.

Quality drops automatically below 900px, on 4-core machines, and on touch-only
devices (fewer particles, no pointer parallax, capped DPR at 1.6).

## Accessibility and fallbacks

- With `prefers-reduced-motion: reduce` the canvas never initialises, the loader is
  removed immediately, the original SVG diagram stays visible, and no scroll
  animation is registered.
- Without WebGL the stage fails silently and the SVG fallback remains.
- Without JavaScript a `<noscript>` block hides the loader and the canvas, so the
  page is fully readable.
- The canvas is `aria-hidden` and `pointer-events: none`; all content lives in the
  DOM. Focus rings, `aria-expanded` on the menu button, labelled fields and an
  `aria-live` form status are unchanged.

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F7F4F0` | page background |
| `--paper-2` | `#F2EEE9` | tinted sections, soft cards |
| `--ink` | `#14161A` | headings, dark sections |
| `--body` | `#4A4F57` | paragraph text |
| `--accent` | `#C4501E` | eyebrows, key lines, primary CTA on dark |
| `--line` | `#E4DED5` | hairlines and card borders |

Type: **Inter** for everything, **Newsreader italic** for the founder quote and
footer motto. Buttons are fully rounded pills; no drop shadows — depth comes from
tonal bands and 1px hairlines.

## Deploying

Hosted on GitHub Pages. Every push to `main` runs
`.github/workflows/deploy.yml`, builds the site and publishes `dist/`.

```sh
git add -A
git commit -m "Update copy"
git push
```

One-time repo setting: **Settings → Pages → Build and deployment → Source** must be
**GitHub Actions** (not “Deploy from a branch”), because the site is built rather
than served from the repo root.

Any static host works too — Netlify, Vercel and Cloudflare Pages all detect Vite and
need no configuration beyond `npm run build` and a `dist` output directory.

## Before going live — replace these

1. **Team names / photos** — the three cards read `Founder Name` and `Director Name`.
   In `index.html`, swap the name text and replace `.team-photo` gradients with
   `<img>` tags (keep the `aspect-ratio: 4 / 4.5` wrapper so cards stay aligned).
2. **Contact details** — `hello@kcpropel.com` appears in the contact block and footer.
   The LinkedIn links are `href="#"` placeholders.
3. **Contact form** — validates and confirms in the browser only; nothing is sent.
   Set `ENDPOINT` in `src/ui/form.ts` (Formspree, Web3Forms, or the customer's CRM
   webhook) and the same handler starts delivering.
4. **Founder quote attribution** — set the real name in the `Founder Message` block.
5. **OG image** — add `assets/og.jpg` and an `og:image` tag for link previews.

The customer's PDF and page renders (`K&C.pdf`, `reference/spec-pages/`) stay on
your machine only and are not tracked.

## Content sections, in order

1. Hero + process strip (Research → Connect → Engage → Qualify → Propel)
2. Statement — Good Products Need Good Conversations
3. What We Do — eight service cards, 01–08
4. How We Propel — five stages, dark band
5. Every Campaign Needs a Reason — pinned horizontal rail (grid below 1024px)
6. Who We Help — nine target sectors
7. Why K&C Propel — three commitments
8. The Team
9. How We Work Together — Campaign / Partnership / Expansion
10. Results — dark CTA
11. About — Why the Name?
12. Founder Message
13. Contact — dark band with form
14. Footer

## Notes

- Fully responsive: 4-up grids collapse to 2-up at 1080px and 1-up at 620px; nav
  becomes a burger at 900px; the campaign rail pins only above 1024px.
- The build emits one ~650 kB JS chunk (three.js + GSAP). It gzips to ~187 kB and is
  the only blocking script; split it further only if the bundle becomes a problem.
