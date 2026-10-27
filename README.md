# K&C Propel — website

Static marketing site built from the customer's design brief (`K&C.pdf`).

**Business Development × Sales × Strategy** — one page, six anchored sections.

```
index.html      markup (all sections)
style.css       design tokens, layout, responsive rules
app.js          mobile menu, scroll state, reveal animation, form validation
assets/         drop images here (team photos, OG image, etc.)
reference/      the original PDF, page by page, for design comparison
```

No build step. No framework. Open `index.html` directly, or serve the folder:

```sh
npx serve .          # or: python -m http.server
```

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F7F4F0` | page background |
| `--paper-2` | `#F2EEE9` | tinted sections, soft cards |
| `--ink` | `#14161A` | headings, dark sections |
| `--body` | `#4A4F57` | paragraph text |
| `--accent` | `#C4501E` | eyebrows, key lines, primary CTA on dark |
| `--line` | `#E4DED5` | hairlines and card borders |

Type: **Inter** for everything, **Newsreader italic** for the founder quote and footer motto.
Buttons are fully rounded pills, primary is near-black, hover shifts to burnt orange.
No drop shadows — depth comes from tonal bands and 1px hairlines.

## Before going live — replace these

1. **Team names / photos** — the three cards read `Founder Name` and `Director Name`.
   In `index.html`, swap the name text and replace `.team-photo` gradients with `<img>` tags
   (keep the `aspect-ratio: 4 / 4.5` wrapper so cards stay aligned).
2. **Contact details** — `hello@kcpropel.com` appears in the contact block and footer.
   The LinkedIn links are `href="#"` placeholders.
3. **Contact form** — currently validates and confirms in the browser only; nothing is sent.
   Point it at a real endpoint in `app.js` (there is a commented `fetch` example):
   Formspree, Netlify Forms, or the customer's CRM webhook.
4. **Founder quote attribution** — set the real name in the `Founder Message` block.
5. **OG image** — add `assets/og.jpg` and an `og:image` tag for link previews.

## Content sections, in order

1. Hero + process strip (Research → Connect → Engage → Qualify → Propel)
2. Statement — Good Products Need Good Conversations
3. What We Do — eight service cards, 01–08
4. Drag the Propel Method — five stages, dark band
5. Every Campaign Needs a Reason — five campaign types + dashed CTA
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

- Fully responsive: 4-up grids collapse to 2-up at 1080px and 1-up at 620px; nav becomes a burger at 900px.
- Motion is subtle and respects `prefers-reduced-motion`.
- Accessible focus rings, `aria-expanded` on the menu button, labelled form fields, `aria-live` status text.
- The hero diagram is inline SVG — hairline rings, dotted spokes, one animated orange core. No image assets needed.
