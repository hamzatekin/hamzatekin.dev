# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (hamzatekin.dev) built with Astro 7, TypeScript, and Tailwind CSS 4. It ships as pure static HTML with no client-side JavaScript framework — the goal is maximum load speed and SEO.

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
- **`src/layouts/Layout.astro`** is the single shared shell. It owns the full `<head>`: meta tags, Open Graph/Twitter cards, JSON-LD `Person` structured data, favicons, and performance hints. It also mounts Astro's `<ClientRouter />` for view transitions. When adding SEO or head changes, edit here rather than per-page.
- **Analytics** (Umami) is injected in `Layout.astro` and gated to production on the canonical domain only: `import.meta.env.PROD && import.meta.env.SITE === 'https://hamzatekin.dev'`. It re-tracks on `astro:page-load` because of client-side view transitions.
- **`public/`** holds static assets served as-is, including hand-maintained `sitemap.xml`, `robots.txt`, `.htaccess`, and the web manifest — these are not generated, so update them manually when routes change.

## Deployment

The build output (`dist/`) is a static site that any host can serve; two paths are wired up:

- **Cloudflare Pages** (primary) — `wrangler.toml` sets `pages_build_output_dir = "./dist"`, so `pnpm deploy` / `pnpm cf:preview` and the Cloudflare dashboard all consume the Astro build. `pnpm` is pinned to only build the `esbuild` and `workerd` native deps (`onlyBuiltDependencies`).
- **Docker + nginx** (alternative) — the multi-stage `Dockerfile` builds with pnpm on `node:22-alpine`, then serves `dist/` from `nginx:alpine` using the checked-in `nginx.conf`. Because nginx serves the files, `nginx.conf` (not the Cloudflare or Apache `.htaccess` config) governs headers/redirects/caching for that path.

## Conventions

- Prettier config (`.prettierrc.json`): single quotes, semicolons, `printWidth` 140.
- Dark theme is the default (`<html class="dark">`); theme color is `#0f172a`.
