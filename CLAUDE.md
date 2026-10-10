# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (hamzatekin.dev) built with Astro 7, TypeScript, and Tailwind CSS 4. It ships as pure static HTML and works fully without JavaScript — the goal is maximum load speed, SEO, and accessibility. The only first-party JavaScript is two small inline scripts that exist for a legal reason (the analytics objection route, see below). Keep it that way: page transitions are CSS-only, so anything that would add a client-side script needs a deliberate reason.

The site targets **WCAG 2.2 AA** and UK GDPR / PECR compliance, and is meant to be a reference example of both. `/accessibility` and `/privacy` make public claims about how the site behaves, so keep them true when you change anything they describe.

## Commands

The project uses **pnpm** (`packageManager` is pinned in `package.json`). Astro 7 requires Node 22.12+.

- `pnpm install` — install dependencies
- `pnpm dev` — start the dev server (`astro dev`)
- `pnpm build` — build the static site to `dist/`
- `pnpm preview` — preview the production build locally
- `pnpm exec prettier --write .` — format (prettier with `prettier-plugin-astro`)
- `pnpm deploy` — build, then deploy `dist/` to Cloudflare Pages (`wrangler pages deploy`)
- `pnpm cf:preview` — build, then serve locally through the Cloudflare Pages runtime (`wrangler pages dev`)

There is no test suite or lint script configured. Type-checking comes from Astro's strict `tsconfig` (`astro/tsconfigs/strict`); `pnpm exec astro check` runs a type check but will prompt to install `@astrojs/check` + `typescript` the first time.

Astro 7 uses a stricter Rust-based compiler that errors on invalid HTML (unclosed tags, invalid nesting like `<div>` inside `<p>`) — the build will surface these.

## Architecture

- **Static output only.** `astro.config.mjs` sets `output: 'static'`, `compressHTML: true`, `trailingSlash: 'never'`, `build.format: 'file'`, and `site: 'https://hamzatekin.dev'`. The file format matters: it emits `privacy.html` instead of `privacy/index.html`, so Cloudflare Pages serves `/privacy` with a 200 rather than 308-redirecting it to `/privacy/` (which Search Console flagged as "Page with redirect"). `Layout.astro` strips the `.html` when deriving the canonical URL. Tailwind is wired in as a Vite plugin (`@tailwindcss/vite`), not the Astro integration — global styles live in `src/styles/global.css`.
- **Pages** live in `src/pages/` (`index.astro`, `privacy.astro`, `accessibility.astro`, `404.astro`) and map to routes by filename. A new route also needs adding to the footer links in `SiteFooter.astro` (every page links to every other, which is how the site meets WCAG 2.4.5) and to `public/sitemap.xml`.
- **`src/layouts/Layout.astro`** is the single shared shell. It imports `global.css`, owns the full `<head>` (meta tags, Open Graph/Twitter cards, JSON-LD `Person` structured data, favicons, performance hints), and wraps each page in the shared container, `<main>`, and `SiteFooter`. Pages render only their main content. It accepts `title`, `description`, and `noindex` props — pages pass their own, and the canonical/`og:url` are derived from `Astro.url`. When adding SEO or head changes, edit here rather than per-page.
- **Cloudflare email obfuscation.** The zone has Scrape Shield's Email Address Obfuscation on, which rewrites mailto links into `[email protected]` plus an injected decoder script. `Layout.astro` wraps the body in `<!--email_off-->` markers to opt out; keep them (Astro preserves HTML comments in the build).
- **Analytics** (self-hosted Umami at `umami.hamzatekin.dev`, a Hetzner server in Helsinki) is rendered by `src/components/Analytics.astro`, gated to production on the canonical domain only: `import.meta.env.PROD && import.meta.env.SITE === 'https://hamzatekin.dev'`. It relies on PECR's statistical-purposes exception (Schedule A1 para 5, in force since 5 Feb 2026), which needs clear information and a free way to object, so there is no cookie banner. The inline loader only fetches the tracker when the visitor hasn't objected: the switch on `/privacy` (which stores Umami's own `umami.disabled` localStorage key), Global Privacy Control, or Do Not Track. The tracker runs with `data-exclude-search`, `data-exclude-hash`, `data-do-not-track` and `data-domains`. Every navigation is a full page load, so Umami records views on its own — no manual re-tracking.
- **Privacy notice** (`src/pages/privacy.astro`) lists every processor (Cloudflare for hosting/DNS/email routing, Hetzner for Umami), what Umami collects, lawful bases, the 24-month analytics and two-year email retention periods, transfers, rights, and the DUAA complaints route. Anything that adds a third party (fonts, embeds, scripts), a cookie, or new device storage must update it, and may need consent rather than the analytics exception. Bump its "Last updated" date with every change.
- **Accessibility statement** (`src/pages/accessibility.astro`) claims full WCAG 2.2 AA conformance and lists how it was tested. Re-test (axe-core at desktop and 320px, keyboard, text spacing, forced colours) and bump the "Last reviewed" date after visual or structural changes.
- **Page transitions** are cross-document CSS view transitions: `@view-transition { navigation: auto; }` plus `::view-transition-old/new(root)` fades in `src/styles/global.css`, with a `prefers-reduced-motion` opt-out. Astro's `<ClientRouter />` and the `transition:*` directives are deliberately **not** used — they would reintroduce ~16 kB of JS. Chromium 126+ and Safari 18.2+ animate; Firefox has no cross-document support yet and navigates instantly.
- **`public/`** holds static assets served as-is, including hand-maintained `sitemap.xml`, `robots.txt`, `_headers` (Cloudflare Pages), `.htaccess` (Apache), and the web manifest — these are not generated, so update them manually when routes change. Security headers live in three places (`_headers`, `nginx.conf`, `.htaccess`); change all three together.

## Deployment

The build output (`dist/`) is a static site that any host can serve; two paths are wired up:

- **Cloudflare Pages** (primary) — `wrangler.toml` sets `pages_build_output_dir = "./dist"`, so `pnpm deploy` / `pnpm cf:preview` and the Cloudflare dashboard all consume the Astro build. `pnpm` is pinned to only build the `esbuild` and `workerd` native deps (`onlyBuiltDependencies`).
- **Docker + nginx** (alternative) — the multi-stage `Dockerfile` builds with pnpm on `node:22-alpine`, then serves `dist/` from `nginx:alpine` using the checked-in `nginx.conf`. Because nginx serves the files, `nginx.conf` (not the Cloudflare or Apache `.htaccess` config) governs headers/redirects/caching for that path.

## Conventions

- Prettier config (`.prettierrc.json`): single quotes, semicolons, `printWidth` 140.
- Accessibility patterns: links with `target="_blank"` include `<NewTabNote />` so screen readers announce the new tab; styled lists (`list-style: none`) get `role="list"` so Safari keeps list semantics; decorative glyphs and icons get `aria-hidden="true"`; keyboard focus uses the global `:focus-visible` outline in `--color-ring` (13:1 contrast); targets are at least 24px tall (WCAG 2.5.8). `prefers-reduced-motion` and `prefers-contrast: more` are handled in `global.css`.
- Long-form pages (privacy, accessibility) use the `prose-page` utility from `global.css` for headings, lists and links.
- Dark theme is the default (`<html class="dark">`); theme color is `#0b0b0b`, matching `--color-background` in `src/styles/global.css`. Keep the `theme-color` meta tag, `site.webmanifest`, and the CSS token in sync.
