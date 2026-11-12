# Fortis Realty

Company profile & property platform for **Fortis Realty**: listing catalog (21 units), survey booking / contact
form (sends to WhatsApp), Instagram feed (Elfsight), mortgage (KPR) calculator, Indonesian / English toggle.

Live site: <https://fortis.frel.cloud/>

## How it is built

The site is the Fortis Realty website that runs locally on port 8080 (`npm run dev`): the page base in `full/`
plus the Fortis layer on top (`fortis/`). GitHub Pages serves exactly that, pre-built:

| Path | What it is |
| --- | --- |
| `full/` | Base pages and assets the site is built on |
| `fortis/fortis.js`, `fortis/fortis.css` | Rebrand layer: catalog, forms, KPR, i18n, header, animations |
| `fortis/img/` | Listing posters (`catalog-1…21.webp`), logo, favicon |
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


## Koneksi ke Admin Dashboard (katalog, KPR, inquiry)

Dashboard (`fortis-dashboard/web`) adalah **sumber data** katalog. Situs ini mengambil dari API-nya dan tetap jalan memakai data
statis di `fortis.js` bila API tidak terjangkau (hasil terakhir juga disimpan di `localStorage` selama 7 hari).

| Apa | Endpoint dashboard | Perilaku di situs |
| --- | --- | --- |
| Katalog unit | `GET /api/public/properties?format=site` | Grid, halaman detail (`/?unit=ID`), filter lokasi, daftar unit di form kontak. Unit **SOLD** disembunyikan; *Coming soon* / *Reserved* tampil sebagai tag fasilitas |
| Bunga KPR acuan | `GET /api/public/settings` | Mengisi default "Suku Bunga" di kalkulator KPR (pengunjung tetap bisa mengubahnya) |
| Booking survey / pesan | `POST /api/public/inquiries` | Form kontak mengirim lead ke dashboard (muncul di Deals, Tasks, Leads) lalu tetap membuka WhatsApp |

**Lokal**: jalankan dashboard (`cd ../fortis-dashboard/web && npm start` -> port 8766) lalu `npm run dev`. Di `localhost` situs otomatis memakai
`http://localhost:8766`; ganti dengan `FORTIS_API=http://host:port npm run dev`.

**Produksi (GitHub Pages)**:
1. Repo Settings -> Secrets and variables -> Actions -> **Variables**: `FORTIS_API` = `https://<alamat-dashboard>` (wajib https).
2. Di dashboard set env `PUBLIC_SITE_ORIGIN=https://fortis.frel.cloud` (origin yang boleh memanggil API) dan `PUBLIC_API_ORIGIN=https://<alamat-dashboard>`.
3. Tanpa `FORTIS_API` build berjalan dalam mode statis.

Foto: poster `catalog-N` tetap dilayani situs ini; foto yang diunggah dari dashboard dilayani dashboard lewat URL absolut.

## Deploy (GitHub Pages + GitHub Actions)

`.github/workflows/pages.yml` runs on every push to `main`: it builds `dist/` with the correct base path
(`actions/configure-pages` provides it, so a custom domain just works) and publishes it with `actions/deploy-pages`.

In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Things to fill in (top of `fortis/fortis.js`)

* `WA_NUMBER` – WhatsApp Concierge number (placeholder `6281234567890`)
* `EMAIL`, `PHONE`, `ADDRESS` – contact details in the footer
* Listing data (`const P = [...]`): prices, sizes and descriptions that are not on the posters are dummy values
* `ELFSIGHT_APP_ID` – Instagram widget

## Tema warna (brand tokens)

Semua token ada di `:root` pada `fortis/fortis.css`.

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--fr-gold-100` | `#E8D5B5` | permukaan **gelap**: teks utama, highlight, tombol primer |
| `--fr-gold-muted` | `rgba(232,213,181,.28)` | permukaan gelap: border & aksen halus |
| `--fr-gold-soft` | `rgba(232,213,181,.72)` | permukaan gelap: teks sekunder |
| `--fr-maroon` (`--fr-dark`) | `#271418` | permukaan **terang**: teks utama, aksen brand, juga warna latar section gelap |
| `--fr-maroon-2` | `#381F23` | permukaan terang: elemen sekunder (nomor, aksen) |
| `--fr-maroon-soft` | `rgba(39,20,24,.74)` | permukaan terang: teks isi (kontras AA di atas krem `#f6f3eb`) |

Contoh pemakaian:

```css
/* terang */  .fr-light { background:#f6f3eb; color:var(--fr-maroon); }
              .fr-light .fr-btn  { background:var(--fr-maroon); color:var(--fr-gold-100); }            /* primer  */
              .fr-light .fr-btn.ghost { background:transparent; color:var(--fr-maroon); border:1px solid var(--fr-maroon); } /* outline */
/* gelap  */  .fr-dark  { background:var(--fr-maroon); color:var(--fr-gold-100); }
              .fr-dark .fr-btn   { background:var(--fr-gold-100); color:var(--fr-maroon); }            /* primer  */
              .fr-dark .fr-btn.ghost { background:transparent; color:var(--fr-gold-100); border:1px solid var(--fr-gold-muted); }
```

Warna token bawaan template (putih/hitam) dipetakan ulang ke emas champagne / maroon di akhir `fortis.css`.
