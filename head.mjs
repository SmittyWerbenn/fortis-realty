// Fortis Realty <head> branding, applied to the template's HTML before it is served (server.mjs) or published (build.mjs).
// Without this the browser tab says "Lumura – Interior Design …" until the page's JavaScript has run.
export const SITE = 'Fortis Realty';
export const TITLE = 'Fortis Realty';
export const DESC = 'Fortis Realty – konsultan dan broker properti tepercaya. Temukan rumah, ruko, apartemen, dan kavling pilihan dengan legalitas jelas, proses transparan, dan pendampingan agen profesional.';

export function brandHead(html, { origin = '', base = '' } = {}) {
  if (!html.includes('<title>')) return html;
  let title = TITLE;
  html = html.replace(/<title>([^<]*)<\/title>/, () => `<title>${TITLE}</title>`);   // every page: just "Fortis Realty"
  const set = (re, value) => { html = html.replace(re, `$1${value}$2`); };
  set(/(<meta property="og:title" content=")[^"]*(")/, title);
  set(/(<meta name="twitter:title" content=")[^"]*(")/, title);
  set(/(<meta name="description" content=")[^"]*(")/, DESC);
  set(/(<meta property="og:description" content=")[^"]*(")/, DESC);
  set(/(<meta name="twitter:description" content=")[^"]*(")/, DESC);
  const og = `${origin}${base}/__fortis/og-image.png`;
  set(/(<meta property="og:image" content=")[^"]*(")/, og);
  set(/(<meta name="twitter:image" content=")[^"]*(")/, og);
  return html;
}

// Framer's runtime rewrites document.title with the template's own title shortly after load ("Lumura – …").
// This tiny script (runs first, in <head>) puts the Fortis title straight back, before it is ever painted in the tab.
export const TITLE_GUARD = `(function(){var t=document.querySelector("title");if(!t)return;window.__frTitle=document.title;var busy=false;function fix(){if(busy)return;var c=document.title,n=c;if(n!==window.__frTitle)n=window.__frTitle;if(n!==c){busy=true;document.title=n;busy=false}}new MutationObserver(fix).observe(document.head,{childList:true,characterData:true,subtree:true})})()`;

// Page loader: a circular progress ring over the Fortis logo, painted from the very first frame (inline, no extra request)
// and removed once fortis.js has branded the page (html.fr-ready, or html.fr-unit-ready on a unit page).
export const LOADER = `<style id="fr-loader-css">#fr-loader{position:fixed;inset:0;z-index:2147483000;background:#0f0e0e;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;transition:opacity .55s ease,visibility .55s}#fr-loader.out{opacity:0;visibility:hidden}#fr-loader .ring{position:relative;width:112px;height:112px}#fr-loader svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}#fr-loader circle{fill:none;stroke-width:2}#fr-loader .bg{stroke:rgba(246,243,235,.16)}#fr-loader .fg{stroke:#f6f3eb;stroke-linecap:round;stroke-dasharray:314.16;stroke-dashoffset:314.16;transition:stroke-dashoffset .25s linear}#fr-loader img{position:absolute;left:50%;top:50%;width:46px;height:46px;object-fit:contain;transform:translate(-50%,-50%);animation:frLoadPulse 1.8s ease-in-out infinite}#fr-loader b{font:500 12px/1 Inter,system-ui,sans-serif;letter-spacing:.18em;color:rgba(246,243,235,.7);font-variant-numeric:tabular-nums}@keyframes frLoadPulse{50%{opacity:.55;transform:translate(-50%,-50%) scale(.92)}}</style><script>(function(){var d=document,h=d.documentElement,B=window.__FR_BASE||"",t0=Date.now(),p=0,done=false;var el=d.createElement("div");el.id="fr-loader";el.setAttribute("role","progressbar");el.setAttribute("aria-label","Loading");el.innerHTML='<div class="ring"><svg viewBox="0 0 112 112"><circle class="bg" cx="56" cy="56" r="50"/><circle class="fg" cx="56" cy="56" r="50"/></svg><img alt="" src="'+B+'/__fortis/logo-fortis.png"></div><b>0%</b>';h.appendChild(el);var fg=el.querySelector(".fg"),tx=el.querySelector("b");function set(v){p=v;fg.style.strokeDashoffset=314.16*(1-v/100);tx.textContent=Math.round(v)+"%"}function ready(){var c=h.classList;return c.contains("fr-unit-ready")||(c.contains("fr-ready")&&!c.contains("fr-unitpage"))}var iv=setInterval(function(){if(done)return;if(ready()&&Date.now()-t0>700)return finish();set(p+(92-p)*.05)},60);function finish(){if(done)return;done=true;clearInterval(iv);set(100);setTimeout(function(){el.classList.add("out");setTimeout(function(){el.remove();var s=d.getElementById("fr-loader-css");s&&s.remove()},650)},320)}setTimeout(finish,10000)})()</script>`;
