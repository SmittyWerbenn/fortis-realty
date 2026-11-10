// Fortis Realty <head> branding, applied to the template's HTML before it is served (server.mjs) or published (build.mjs).
// Without this the browser tab says "Lumura – Interior Design …" until the page's JavaScript has run.
export const SITE = 'Fortis Realty';
export const TITLE = 'Fortis Realty – Konsultan &amp; Broker Properti Tepercaya';
export const DESC = 'Fortis Realty – konsultan dan broker properti tepercaya. Temukan rumah, ruko, apartemen, dan kavling pilihan dengan legalitas jelas, proses transparan, dan pendampingan agen profesional.';

export function brandHead(html, { origin = '', base = '', route = '/' } = {}) {
  if (!html.includes('<title>')) return html;
  const isProject = /^\/project\/?$/.test(route);
  let title = TITLE;
  html = html.replace(/<title>([^<]*)<\/title>/, (m, t) => {
    const mm = t.match(/^(.*) - Lumura$/);              // detail pages: "<name> - Lumura"
    title = mm ? `${mm[1]} - ${SITE}` : (isProject ? `Properti Kami – ${SITE}` : TITLE);
    return `<title>${title}</title>`;
  });
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
