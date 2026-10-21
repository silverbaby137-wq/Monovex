# MONOVEX

Marketing landing page for **MONOVEX**, a crypto-fintech app for receiving, holding, swapping and spending digital assets like cash. It is a static, single-page site built with React and TypeScript, with plain CSS and no UI libraries.

## Sections

1. **Navbar**: rounded translucent pill with links and actions; collapses to a logo + hamburger menu on mobile.
2. **Hero + ticker**: headline, download CTA, portrait with floating wallet card and crypto pill, and a scrolling feature ticker.
3. **Your world of crypto**: coin showcase.
4. **One App. Unlimited Possibilities**: pinned, scroll-driven feature cards.
5. **Use Crypto like Real Money**: benefits panel and portrait.
6. **One Click. Instant Swap**: image cards plus an interactive-looking swap demo (see *Demo-only features*).
7. **Your money should work everywhere**: three feature panels with scroll reveals.
8. **Take Monovex everywhere you go!**: download section with an animated background ribbon.
9. **Beyond Borders + footer**: QR download card, links and company details.

Motion respects `prefers-reduced-motion`, and every layout is responsive from 320px phones to wide desktops.

## Tech stack

- [Vite](https://vite.dev/) 8
- [React](https://react.dev/) 19 + TypeScript
- Plain CSS, one file per component
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for linting
- Self-hosted Geist font; no runtime dependencies besides React

## Getting started

Requires **Node.js 20 or newer** and npm.

```bash
# install dependencies
npm install

# start the dev server (http://localhost:5173)
npm run dev
```

### Scripts

| Command           | What it does                                           |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server with hot reload              |
| `npm run build`   | Type-check (`tsc -b`) and create the production build in `dist/` |
| `npm run preview` | Serve the production build locally (http://localhost:4173) |
| `npm run lint`    | Run Oxlint                                             |

## Project structure

```
index.html            page shell, title, description, favicon link
public/               files copied as-is (favicon.svg)
src/
  main.tsx            React entry point
  App.tsx             page sections, in order
  styles/global.css   font, colour tokens, base styles
  components/         one folder per section (Component.tsx + Component.css)
    SwapFlow/         swap demo animation and mock transaction logic
  assets/             images, SVGs and the Geist font
```

## Deployment

The site is fully static. Any static host works; on **Vercel**:

- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

If you host under a sub-path (for example GitHub Pages at `/monovex/`), set `base: '/monovex/'` in `vite.config.ts`.

## Demo-only features and placeholders

This repository is a front-end prototype. Before a public launch, review:

- **Swap demo**: `src/components/SwapFlow/swapService.ts` is an explicitly labelled **mock**; no real transaction is made. It starts automatically about 2 seconds after the swap panel scrolls into view and resets when you leave. Opening the page with `?swap=fail` or `?swap=slow` exercises the failure and slow paths (developer hook).
- **Sample figures**: wallet balance, swap quote, USD account balance, notification amounts and gift-card rows are illustrative.
- **Links**: buttons and links point to `#` or `#top` until real destinations (app stores, sign-up, social profiles, legal pages) are added.
- **Company details**: phone number, address, email and the QR code in the footer should be confirmed before launch.
