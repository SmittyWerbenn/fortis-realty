// Preview dist/ the way GitHub Pages serves it:  node preview.mjs   (BASE_PATH must match the build)
//   BASE_PATH=/fortis-realty node build.mjs && BASE_PATH=/fortis-realty node preview.mjs  -> http://localhost:8090/fortis-realty/
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const BASE = (process.env.BASE_PATH ?? '/fortis-realty').replace(/\/+$/, '');
const PORT = process.env.PORT || 8090;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.gif': 'image/gif', '.ico': 'image/x-icon' };

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  let p = decodeURIComponent(u.pathname);
  if (BASE) { if (p === BASE) { res.writeHead(301, { Location: BASE + '/' + u.search }); return res.end(); } if (!p.startsWith(BASE + '/')) { res.writeHead(404); return res.end('not found'); } p = p.slice(BASE.length); }
  let file = path.join(DIST, p);
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(301, { Location: BASE + p + '/' + u.search }); return res.end(); } // like GitHub Pages
    file = path.join(file, 'index.html');
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    const nf = path.join(DIST, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'not found');
  }
  const ext = path.extname(file).toLowerCase();
  const size = fs.statSync(file).size, range = req.headers.range;
  const headers = { 'Content-Type': (MIME[ext] || 'application/octet-stream') + (['.html', '.js', '.mjs', '.css', '.json'].includes(ext) ? '; charset=utf-8' : ''), 'Accept-Ranges': 'bytes' };
  if (range) { const [a, b] = range.replace('bytes=', '').split('-'); const s = +a, e = b ? +b : size - 1; res.writeHead(206, { ...headers, 'Content-Range': `bytes ${s}-${e}/${size}`, 'Content-Length': e - s + 1 }); return fs.createReadStream(file, { start: s, end: e }).pipe(res); }
  res.writeHead(200, { ...headers, 'Content-Length': size });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`preview: http://localhost:${PORT}${BASE}/`));
