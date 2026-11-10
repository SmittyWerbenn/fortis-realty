# Fortis Realty

Company profile & property platform for **Fortis Realty**: listing catalog (21 units), survey booking / contact
form (sends to WhatsApp), Instagram feed (Elfsight), mortgage (KPR) calculator, Indonesian / English toggle.

Live site: <https://smittywerbenn.github.io/fortis-realty/>

## How it is built

The site is a static export of a Framer template (`full/`) with a Fortis layer on top (`fortis/`):

| Path | What it is |
| --- | --- |
| `full/` | Mirrored template pages and assets |
| `fortis/fortis.js`, `fortis/fortis.css` | Rebrand layer: catalog, forms, KPR, i18n, header, animations |
| `fortis/img/` | Listing posters (`catalog-1…21.webp`), logo, favicon |
| `server.mjs` | Local dev server (applies the layer on the fly) |
| `build.mjs` | Static build for GitHub Pages → `dist/` |
| `preview.mjs` | Serves `dist/` the way GitHub Pages does |

## Commands

```bash
npm run dev          # http://localhost:8080  (live layer, no build)
npm run build        # dist/ for a project site at /fortis-realty
npm run build:root   # dist/ for a domain root (custom domain)
BASE_PATH=/fortis-realty npm run preview   # http://localhost:8090/fortis-realty/
```

## Deploy (GitHub Pages + GitHub Actions)

`.github/workflows/pages.yml` runs on every push to `main`: it builds `dist/` with the correct base path
(`actions/configure-pages` provides it, so a custom domain just works) and publishes it with `actions/deploy-pages`.

In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Things to fill in (top of `fortis/fortis.js`)

* `WA_NUMBER` – WhatsApp Concierge number (placeholder `6281234567890`)
* `EMAIL`, `PHONE`, `ADDRESS` – contact details in the footer
* Listing data (`const P = [...]`): prices, sizes and descriptions that are not on the posters are dummy values
* `ELFSIGHT_APP_ID` – Instagram widget

## Notes

`full/` contains a third-party Framer template (Lumura). Make sure you hold a licence that allows publishing it.
