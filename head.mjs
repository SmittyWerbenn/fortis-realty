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

// Smooth first paint: the page stays hidden (dark, same as the hero) until fortis.js has branded it, then fades in.
// Pure CSS + a 6 s failsafe, so nothing can stay hidden if the script never runs.
export const FADE = `<style id="fr-fade-css">html{background:#271418}body{transition:opacity .7s ease}html:not(.fr-ready) body,html.fr-unitpage:not(.fr-unit-ready) body{opacity:0}html.fr-nofade body{opacity:1!important}</style><script>setTimeout(function(){document.documentElement.classList.add("fr-nofade")},6000)</script>`;
