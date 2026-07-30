# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (hamzatekin.dev) built with Astro 7, TypeScript, and Tailwind CSS 4. It ships as pure static HTML and ships **zero** first-party JavaScript — the goal is maximum load speed and SEO. Keep it that way: page transitions are CSS-only, so anything that would add a client-side script needs a deliberate reason.

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

- **Static output only.** `astro.config.mjs` sets `output: 'static'`, `compressHTML: true`, `trailingSlash: 'never'`, and `site: 'https://hamzatekin.dev'`. Tailwind is wired in as a Vite plugin (`@tailwindcss/vite`), not the Astro integration — global styles live in `src/styles/global.css`.
- **Pages** live in `src/pages/` (`index.astro`, `privacy.astro`, `404.astro`) and map to routes by filename.
- **`src/layouts/Layout.astro`** is the single shared shell. It owns the full `<head>`: meta tags, Open Graph/Twitter cards, JSON-LD `Person` structured data, favicons, and performance hints. It accepts `title`, `description`, and `noindex` props — pages pass their own, and the canonical/`og:url` are derived from `Astro.url`. When adding SEO or head changes, edit here rather than per-page.
- **Analytics** (Umami) is injected in `Layout.astro` and gated to production on the canonical domain only: `import.meta.env.PROD && import.meta.env.SITE === 'https://hamzatekin.dev'`. Every navigation is a full page load, so Umami records views on its own — no manual re-tracking.
- **Page transitions** are cross-document CSS view transitions: `@view-transition { navigation: auto; }` plus `::view-transition-old/new(root)` fades in `src/styles/global.css`, with a `prefers-reduced-motion` opt-out. Astro's `<ClientRouter />` and the `transition:*` directives are deliberately **not** used — they would reintroduce ~16 kB of JS. Chromium 126+ and Safari 18.2+ animate; Firefox has no cross-document support yet and navigates instantly.
- **`public/`** holds static assets served as-is, including hand-maintained `sitemap.xml`, `robots.txt`, `_headers` (Cloudflare Pages), `.htaccess` (Apache), and the web manifest — these are not generated, so update them manually when routes change. Security headers live in three places (`_headers`, `nginx.conf`, `.htaccess`); change all three together.

## Deployment

The build output (`dist/`) is a static site that any host can serve; two paths are wired up:

- **Cloudflare Pages** (primary) — `wrangler.toml` sets `pages_build_output_dir = "./dist"`, so `pnpm deploy` / `pnpm cf:preview` and the Cloudflare dashboard all consume the Astro build. `pnpm` is pinned to only build the `esbuild` and `workerd` native deps (`onlyBuiltDependencies`).
- **Docker + nginx** (alternative) — the multi-stage `Dockerfile` builds with pnpm on `node:22-alpine`, then serves `dist/` from `nginx:alpine` using the checked-in `nginx.conf`. Because nginx serves the files, `nginx.conf` (not the Cloudflare or Apache `.htaccess` config) governs headers/redirects/caching for that path.

## Conventions

- Prettier config (`.prettierrc.json`): single quotes, semicolons, `printWidth` 140.
- Dark theme is the default (`<html class="dark">`); theme color is `#0b0b0b`, matching `--color-background` in `src/styles/global.css`. Keep the `theme-color` meta tag, `site.webmanifest`, and the CSS token in sync.
