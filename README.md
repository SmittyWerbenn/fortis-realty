# Fortis Realty

Company profile & property platform for **Fortis Realty**: listing catalog (21 units), survey booking / contact
form (sends to WhatsApp), Instagram feed (Elfsight), mortgage (KPR) calculator, Indonesian / English toggle.

Live site: <https://fortis.frel.cloud/> · Admin: <https://fortis.frel.cloud/admin/>

## How it is built

The site is the Fortis Realty website that runs locally on port 8080 (`npm run dev`): the page base in `full/`
plus the Fortis layer on top (`fortis/`). GitHub Pages serves exactly that, pre-built:

| Path | What it is |
| --- | --- |
| `full/` | Base pages and assets the site is built on |
| `fortis/fortis.js`, `fortis/fortis.css` | Rebrand layer: catalog, forms, KPR, i18n, header, animations |
| `fortis/img/` | Listing posters (`catalog-1…21.webp`), logo, favicon |
| `fortis/properties.json` | **The property listings** (single source of truth, read by the landing page and edited from `/admin`) |
| `admin/` | Admin dashboard (CRM + property manager), served at `/admin/` |
| `server.mjs` | Local dev server (applies the layer on the fly) |
| `build.mjs` | Static build for GitHub Pages → `dist/` |
| `preview.mjs` | Serves `dist/` the way GitHub Pages does |

## Commands

```bash
npm run dev          # http://localhost:8080  (live layer, no build)
npm run build        # dist/ for a project site at /fortis-realty (ORIGIN defaults to http://localhost:8090)
npm run build:root   # dist/ for a domain root (set ORIGIN=https://your-domain)
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

## Admin dashboard (`/admin`)

A static app (no backend) published together with the landing page. **Properties** in the admin is the same list the
landing page shows: both read `fortis/properties.json`.

* Edit / add / remove properties and upload photos in the admin: changes stay as a draft in the browser.
* **Publish to website** makes one commit (`fortis/properties.json` + new `fortis/img/catalog-*.webp`) through the GitHub API;
  the Pages workflow rebuilds and the landing page updates in ~1–2 minutes.
* Needs a GitHub **fine-grained token** limited to this repo with *Contents: Read and write*
  (Admin → Settings → Website sync). The token is kept in `sessionStorage` only (gone when the tab closes).
* Deals, leads, tasks, contacts and messages are demo CRM data stored in the browser (`localStorage`); they are not synced.
* `/admin` is not linked from the site and is `noindex` / `Disallow`ed, but it is **not access-controlled** (writes need the
  token). To put a real login in front of it, use Cloudflare Access on `fortis.frel.cloud/admin*`.
* `fortis/fortis.js` keeps an inline copy of the listings only as an offline fallback; `properties.json` always wins.

```bash
npm run dev   # http://localhost:8080  and  http://localhost:8080/admin/
```
