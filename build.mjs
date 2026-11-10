// Static build for GitHub Pages.
//   node build.mjs                      -> dist/ for a project site at /fortis-realty
//   BASE_PATH=  node build.mjs          -> dist/ for a domain root (custom domain / user site)
//   BASE_PATH=/other node build.mjs     -> dist/ for another sub-path
//   ORIGIN=https://example.com          -> absolute origin written into the pages (Framer calls new URL(x) on them,
//                                          so they must be absolute; CI passes the Pages origin automatically)
//
// It reproduces what server.mjs does at request time (host rewriting, injecting the Fortis layer,
// size-variant fallbacks) but once, ahead of time, so the result can be served by any static host.
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { brandHead, TITLE_GUARD } from './head.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'full');
const OUT = path.join(ROOT, 'dist');
const FORTIS = path.join(ROOT, 'fortis');
const BASE = (process.env.BASE_PATH ?? '/fortis-realty').replace(/\/+$/, ''); // '' = domain root
// actions/configure-pages reports http:// for a custom domain while "Enforce HTTPS" is off; real sites are served over
// HTTPS (e.g. through Cloudflare), and http:// URLs inside an https page are blocked as mixed content -> always upgrade.
const ORIGIN = (process.env.ORIGIN ?? 'http://localhost:8090').replace(/\/+$/, '').replace(/^http:\/\/(?!localhost|127\.0\.0\.1)/, 'https://');
const MAIN = 'lumura.framer.website';

const hosts = fs.readdirSync(SRC).filter(h => h !== '_rendered');
const prefix = h => (h === MAIN ? '' : h + '/');
const TEXT = new Set(['.html', '.js', '.mjs', '.css', '.json']);

// ---- text rewriting (same rules as server.mjs, but to a path instead of an origin) ----
function rewrite(s) {
  for (const h of hosts) {
    const to = ORIGIN + (h === MAIN ? BASE + '/' : BASE + '/' + h + '/');
    s = s.split('https://' + h + '/').join(to).split('//' + h + '/').join(to.slice(to.indexOf('//')));
  }
  return s;
}
const HEAD_SCRIPT = `<script>window.__FR_BASE=${JSON.stringify(BASE)};(function(){var p=location.pathname;if(${JSON.stringify(BASE)}&&p.indexOf(${JSON.stringify(BASE)})===0)p=p.slice(${BASE.length})||"/";if(p.replace(/[/]+$/,"")==="/project")document.documentElement.classList.add("fr-proj")})()</script>`;
// Cloudflare (Email Address Obfuscation) rewrites raw e-mail addresses in HTML, which makes Framer's hydration fail.
// Encoding the "@" keeps the DOM text identical but is not matched by Cloudflare.
const EMAIL = /([A-Za-z0-9._%+-]+)@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})/g;
function protectEmails(html) {
  return html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/i).map((part, i) => (i % 2 ? part : part.replace(EMAIL, '$1&#64;$2'))).join('');
}
function injectHtml(s, route) {
  s = rewrite(s);
  s = brandHead(s, { origin: ORIGIN, base: BASE, route });
  s = s.replace(/<link[^>]*rel="(?:shortcut )?icon"[^>]*>/g, '').replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/g, '');
  s = s.replace('</head>',
    `<link rel="icon" type="image/png" sizes="64x64" href="${BASE}/__fortis/favicon.png"><link rel="apple-touch-icon" href="${BASE}/__fortis/apple-touch-icon.png">` +
    `<link rel="stylesheet" href="${BASE}/__fortis/fortis.css?v=${V_CSS}">${HEAD_SCRIPT}<script>${TITLE_GUARD}</script><script defer src="${BASE}/__fortis/fortis.js?v=${V_JS}"></script>` +
    `<style>#__framer-badge-container,.__framer-badge{display:none!important}</style></head>`);
  s = s.replace(/<script[^>]*(events\.framer\.com|framer\.com\/edit)[^>]*><\/script>/g, '');
  return protectEmails(s);
}

// ---- Framer CMS: the runtime asks for  <file>.framercms?range=a-b,c-d  (server-side byte ranges).
// A static host ignores the query and returns the whole file, which Framer rejects ("Unexpected response length").
// server.mjs stores every captured query as  <file>__<base64url(?query)[0..16]>.<ext>, so the runtime is patched to
// request that variant file directly. (The variants are copied below.)
const RANGE_CALL = /a\.searchParams\.set\(`range`,o\);let s=await (\w+)\(a\)/g;
const RANGE_URL = '((v)=>{let h=btoa(unescape(encodeURIComponent(v.search))).replace(/\\+/g,"-").replace(/\\//g,"_").replace(/=+$/,"").slice(0,16),u=new URL(v);u.search="";u.pathname=u.pathname.replace(/(\\.[^./]*)?$/,m=>"__"+h+m);return u})(a)';
function patchRange(js) { return js.replace(RANGE_CALL, (m, fn) => `a.searchParams.set(\`range\`,o);let s=await ${fn}(${RANGE_URL})`); }

// ---- helpers ----
// cache-busting: Cloudflare/browsers keep fortis.js / fortis.css for ~10 minutes, so the URL carries a content hash
const ver = f => crypto.createHash('sha1').update(fs.readFileSync(path.join(FORTIS, f))).digest('hex').slice(0, 10);
const V_JS = ver('fortis.js'), V_CSS = ver('fortis.css');
const mkdirp = d => fs.mkdirSync(d, { recursive: true });
function write(file, data) { mkdirp(path.dirname(file)); fs.writeFileSync(file, data); }
function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p)); else out.push(p);
  }
  return out;
}
// server.mjs stores "?query" variants as  name__<base64url(query)[0..16]>.ext ; static hosts ignore queries,
// so the largest variant becomes the plain file (same fallback as server.mjs).
const VARIANT = /^(.*)__[A-Za-z0-9_-]{1,16}(\.[A-Za-z0-9]+)?$/;

let count = 0, rewritten = 0;
fs.rmSync(OUT, { recursive: true, force: true });
mkdirp(OUT);

// 1) rendered pages  (_rendered/<route>/index.html  ->  dist/<route>/index.html)
const RENDERED = path.join(SRC, '_rendered');
for (const f of walk(RENDERED)) {
  if (path.basename(f) !== 'index.html') continue;
  const rel = path.relative(RENDERED, f).split(path.sep).join('/');
  const html = injectHtml(fs.readFileSync(f, 'utf8'), '/' + rel.replace(/index\.html$/, ''));
  write(path.join(OUT, rel), html);
  if (rel === '404/index.html') write(path.join(OUT, '404.html'), html); // GitHub Pages fallback page
  count++;
}

// 2) mirrored assets (never overwrite a rendered page: the raw template HTML is not what server.mjs serves)
for (const h of hosts) {
  const hostDir = path.join(SRC, h);
  const groups = new Map(); // plain relative path -> { plain?: file, variants: [file] }
  for (const f of walk(hostDir)) {
    const rel = path.relative(hostDir, f).split(path.sep).join('/');
    const dir = path.posix.dirname(rel), base = path.posix.basename(rel);
    const m = base.match(VARIANT);
    const plainRel = m ? path.posix.join(dir, m[1] + (m[2] || '')) : rel;
    const g = groups.get(plainRel) || { variants: [] };
    if (m) g.variants.push(f); else g.plain = f;
    groups.set(plainRel, g);
  }
  for (const [rel, g] of groups) {
    const chosen = g.plain || g.variants.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0];
    const target = path.join(OUT, prefix(h), rel);
    if (fs.existsSync(target)) continue; // rendered page already there, or e.g. framer.com/edit (file vs folder)
    if (fs.existsSync(path.dirname(target)) && !fs.statSync(path.dirname(target)).isDirectory()) continue;
    const ext = path.extname(rel).toLowerCase();
    if (TEXT.has(ext)) { let txt = rewrite(fs.readFileSync(chosen, 'utf8')); if (ext === '.mjs' || ext === '.js') txt = patchRange(txt); write(target, txt); rewritten++; }
    else { mkdirp(path.dirname(target)); fs.copyFileSync(chosen, target); }
    count++;
    // CMS byte-range variants are served by exact file name (see patchRange)
    if (h === 'framerusercontent.com' && rel.startsWith('cms/')) {
      for (const v of g.variants) { const t2 = path.join(OUT, prefix(h), path.posix.dirname(rel), path.basename(v)); mkdirp(path.dirname(t2)); fs.copyFileSync(v, t2); count++; }
    }
  }
}

// 3) the Fortis layer (CSS, JS, logo, favicon, listing photos)
for (const f of walk(FORTIS)) {
  const target = path.join(OUT, '__fortis', path.relative(FORTIS, f));
  mkdirp(path.dirname(target)); fs.copyFileSync(f, target);
}

// 3b) the admin dashboard  ->  dist/admin/   (static app; reads/writes ../__fortis/properties.json through the GitHub API)
const ADMIN = path.join(ROOT, 'admin');
if (fs.existsSync(ADMIN)) for (const f of walk(ADMIN)) {
  const target = path.join(OUT, 'admin', path.relative(ADMIN, f));
  mkdirp(path.dirname(target)); fs.copyFileSync(f, target); count++;
}
write(path.join(OUT, 'robots.txt'), 'User-agent: *\nDisallow: /admin/\n');

// 4) Pages housekeeping: do not run Jekyll (it would drop folders starting with "_")
write(path.join(OUT, '.nojekyll'), '');

console.log(`built ${count} files (${rewritten} text files rewritten) -> ${path.relative(ROOT, OUT)}/  base="${BASE}"`);
