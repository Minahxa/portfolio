# Amina Abdi — Portfolio

A personal design and engineering portfolio, hand-written in HTML, CSS, and
JavaScript. No frameworks and no build step: open `index.html` in a browser and
it runs.

**Live site:** https://minahxa.github.io/portfolio/

---

## Structure

```
.
├── index.html              Home: hero, about, selected work, experience, gallery, contact
├── philosophy.html         Design philosophy
├── work/
│   ├── family-of-buttons.html
│   ├── smartenroll.html
│   ├── hobbyplus.html
│   ├── gas-analytics.html
│   ├── omgame.html
│   └── ai-chatbot.html
├── css/style.css           Design system: tokens, layout, components, motion
├── js/main.js              Page transitions, cursor, hero animation, carousel, glass sigils
└── assets/img/             Photographs and project documentation
```

---

## Design notes

The visual direction is a cold, glacial monochrome. Colour is deliberately
withheld from the interface so that the photographs and project screenshots
carry it instead.

Everything interactive is written from scratch rather than pulled from a
library:

- **Page transitions** — a frost curtain wipes between pages on navigation
- **Hero** — the name assembles from scattered fragments on first load, the one
  orchestrated motion on the page
- **Work list** — hovering a row floats a preview image that trails the cursor
- **Carousel** — centre-focus gallery driven only by the viewer, with keyboard,
  pointer and touch support
- **Glass sigils** — each project carries an animated SVG mark built from
  gradients, a turbulence displacement filter and a travelling specular highlight

Accessibility and resilience are part of the build: visible keyboard focus,
`prefers-reduced-motion` respected throughout, and a layout that holds from
320px upward.

---

## Running locally

Open `index.html` in any browser.

For live reload, install the **Live Server** extension in VS Code, then
right-click `index.html` and choose *Open with Live Server*.

---

## Deployment

Served by GitHub Pages from the `main` branch, root directory.
