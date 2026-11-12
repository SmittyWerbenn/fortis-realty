// Jalankan: node server.mjs   -> buka http://localhost:8080
import http from 'http'; import fs from 'fs'; import path from 'path';
import { fileURLToPath } from 'url';
import { brandHead, TITLE_GUARD, FADE } from './head.mjs';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'full');
const FORTIS = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fortis');
const PORT = process.env.PORT || 8080;
const hosts = fs.readdirSync(ROOT).filter(h => h !== '_rendered');
const MIME = {'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json',
 '.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif',
 '.woff2':'font/woff2','.woff':'font/woff','.mp4':'video/mp4','.gif':'image/gif'};
const isText = e => ['.html','.js','.mjs','.css','.json'].includes(e);
function rewrite(s, origin, route){
  for (const h of hosts) {
    const to = h === 'lumura.framer.website' ? origin + '/' : origin + '/' + h + '/';
    s = s.split('https://'+h+'/').join(to).split('//'+h+'/').join(to.slice(to.indexOf('//')));
  }
  s = brandHead(s, { origin, base: '', route: route || '/' });
  s = s.split('https://api.framer.com/').join(origin + '/__blocked/').split('https://events.framer.com/').join(origin + '/__blocked/');
  s = s.replace(/<link[^>]*rel="(?:shortcut )?icon"[^>]*>/g,'').replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/g,'');
  s = s.replace('</head>','<link rel="icon" type="image/png" sizes="64x64" href="/__fortis/favicon.png"><link rel="apple-touch-icon" href="/__fortis/apple-touch-icon.png"><link rel="stylesheet" href="/__fortis/fortis.css"><script>if(location.pathname.replace(/[/]+$/,"")==="/project")document.documentElement.classList.add("fr-proj")</script><script>'+TITLE_GUARD+'</script>'+FADE+'<script defer src="/__fortis/fortis.js"></script><style>#__framer-badge-container,.__framer-badge{display:none!important}</style></head>');
  if (process.env.FORTIS_API !== undefined) s = s.replace('<head>', '<head><script>window.__FR_API=' + JSON.stringify(process.env.FORTIS_API.replace(/\/+$/, '')) + '</script>');   // optional; on localhost fortis.js defaults to http://localhost:8766
  return s.replace(/<script[^>]*(events\.framer\.com|framer\.com\/edit)[^>]*><\/script>/g,'');
}
function find(pathname, search){
  const cand = [];
  for (const h of ['lumura.framer.website', ...hosts]) {
    let p = pathname; if (p.endsWith('/')) p += 'index.html';
    if (search) { const hs = Buffer.from(search).toString('base64url').slice(0,16); const e = path.extname(p); cand.push(path.join(ROOT,h,p.slice(0,p.length-e.length)+'__'+hs+e)); }
    cand.push(path.join(ROOT,h,p));
  }
  return cand;
}
http.createServer((req,res)=>{
  const u = new URL(req.url,'http://x'); let pn = decodeURIComponent(u.pathname);
  if (pn.startsWith('/__fortis/')) { const fp = path.join(FORTIS, pn.slice(10)); if (fp.startsWith(FORTIS) && fs.existsSync(fp) && fs.statSync(fp).isFile()) { res.writeHead(200,{'Content-Type':MIME[path.extname(fp)]||'application/octet-stream','Cache-Control':'no-cache'}); return fs.createReadStream(fp).pipe(res); } res.writeHead(404); return res.end('not found'); }
  let files = []; if (pn.startsWith('/__blocked/')) { res.writeHead(204,{'Access-Control-Allow-Origin':'*'}); return res.end(); }
  const first = pn.split('/')[1];
  if (hosts.includes(first)) files = [path.join(ROOT,pn.replace(/\/$/,'/index.html'))].concat(u.search ? find(pn.slice(first.length+1)||'/',u.search).filter(f=>f.includes('/'+first+'/')) : []);
  if (hosts.includes(first) && u.search) { const hs=Buffer.from(u.search).toString('base64url').slice(0,16); const e=path.extname(pn); files.unshift(path.join(ROOT,pn.slice(0,pn.length-e.length)+'__'+hs+e)); }
  if (!hosts.includes(first)) files = [path.join(ROOT,'_rendered',pn.endsWith('/')?pn:pn+'/','index.html'), ...find(pn,u.search)];
  let f = files.find(x=>x.startsWith(ROOT)&&fs.existsSync(x)&&fs.statSync(x).isFile());
  // mirror gap: a size variant (?scale-down-to=…) was never saved -> serve any saved variant of the same image
  if (!f && /\/images\/[^/]+\.(jpg|jpeg|png|webp)$/i.test(pn)) {
    const dir = path.join(ROOT,'framerusercontent.com','images'), id = path.basename(pn).replace(/\.[^.]+$/,'');
    try { const m = fs.readdirSync(dir).filter(n=>n.startsWith(id+'__')||n.startsWith(id+'.')).sort((a,b)=>fs.statSync(path.join(dir,b)).size-fs.statSync(path.join(dir,a)).size)[0]; if (m) f = path.join(dir,m); } catch {}
  }
  if (!f) { res.writeHead(404); return res.end('not found'); }
  let e = path.extname(f); if (!MIME[e]) { const h = fs.readFileSync(f).subarray(0,200).toString('utf8').trimStart().toLowerCase(); if (h.startsWith('<!doctype html')||h.startsWith('<html')) e='.html'; }
  const type = MIME[e] || 'application/octet-stream';
  const headers = {'Content-Type':type+(isText(e)?'; charset=utf-8':''),'Access-Control-Allow-Origin':'*','Content-Disposition':'inline'};
  if (isText(e)) { res.writeHead(200,headers); return res.end(rewrite(fs.readFileSync(f,'utf8'), 'http://'+req.headers.host, pn)); }
  const size = fs.statSync(f).size, range = req.headers.range;
  if (range) { const [a,b]=range.replace('bytes=','').split('-'); const s=+a, en=b?+b:size-1;
    res.writeHead(206,{...headers,'Content-Range':`bytes ${s}-${en}/${size}`,'Accept-Ranges':'bytes','Content-Length':en-s+1}); return fs.createReadStream(f,{start:s,end:en}).pipe(res); }
  res.writeHead(200,{...headers,'Content-Length':size,'Accept-Ranges':'bytes'}); fs.createReadStream(f).pipe(res);
}).listen(PORT,()=>console.log('http://localhost:'+PORT));
