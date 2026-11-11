/* Fortis Realty — rebrand layer for the existing site (keeps fonts, palette, hero layout & animations). */
(() => {
'use strict';

/* Base path: '' when served from a domain root, '/fortis-realty' on GitHub Pages (set by the build via window.__FR_BASE) */
const BASE = (typeof window.__FR_BASE === 'string') ? window.__FR_BASE : '';
const U = p => (typeof p === 'string' && p.charAt(0) === '/' && p.charAt(1) !== '/') ? BASE + p : p;
const ROUTE = () => { let p = location.pathname; if (BASE && p.indexOf(BASE) === 0) p = p.slice(BASE.length) || '/'; return p; };

/* ================= CONFIG (ganti sesuai data asli) ================= */
const CFG = {
  WA_NUMBER: '6281234567890',               // TODO: nomor WhatsApp Concierge Fortis Realty (format 62…)
  IG_USER: 'fortisrealty.id',
  IG_URL: 'https://www.instagram.com/fortisrealty.id/',
  ELFSIGHT_APP_ID: '4261e254-ba62-40fa-a839-a7723d22bc22',                     // TODO (opsi Elfsight): isi dengan ID dari kode embed, mis. '1a2b3c4d-....'
  IG_FEED_URL: '',                           // TODO: tempel "Feed URL" dari Behold, contoh: https://feeds.behold.so/XXXXXXXX
  EMAIL: 'hello@fortisrealty.id',            // TODO
  PHONE: '+62 812-3456-7890',                // TODO
  ADDRESS: 'Jakarta, Indonesia',             // TODO
  LOGO: U('/__fortis/logo-fortis.png')
};

const TYPES = { rumah: 'Rumah Residensial', ruko: 'Ruko Komersial', apartemen: 'Apartemen', tanah: 'Tanah/Kavling' };
const EN_LIST = [];
const P = [
  { id: 1, name: "Cluster Hollywood Vibes", loc: "Gading Serpong", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 3000000000, from: true, lt: 150, lb: 260, kt: 4, km: 4, img: "catalog-1", cert: "SHGB", listrik: "5.500 VA", fac: ["3 lantai", "Developer: Summarecon Serpong", "Segera hadir (Coming Soon)", "Desain bergaya Hollywood"], facEn: ["3 floors", "Developer: Summarecon Serpong", "Coming soon", "Hollywood-style design"], desc: "Cluster mewah bergaya Hollywood di Gading Serpong dari Summarecon Serpong. Hunian 3 lantai dengan desain modern dan akses mudah ke pusat kota.", descEn: "A luxury Hollywood-style cluster in Gading Serpong by Summarecon Serpong. A 3-storey home with a modern design and easy access to the city center." },
  { id: 2, name: "Cluster American Vibes", loc: "Gading Serpong", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 2000000000, from: true, lt: 120, lb: 180, kt: 3, km: 3, img: "catalog-2", cert: "SHGB", listrik: "4.400 VA", fac: ["2 lantai", "Developer: Paramount Land", "Di Boulevard Gading Serpong", "Gaya American classic"], facEn: ["2 floors", "Developer: Paramount Land", "On Gading Serpong Boulevard", "American classic style"], desc: "Cluster baru bergaya American di Boulevard Gading Serpong dari Paramount Land. Rumah 2 lantai dengan fasad klasik yang elegan.", descEn: "A new American-style cluster on Gading Serpong Boulevard by Paramount Land. A 2-storey home with an elegant classic facade." },
  { id: 3, name: "Navapark Premium Residence", loc: "BSD City", city: "Tangerang Selatan", type: "rumah", status: "dijual", hot: false, price: 15000000000, from: true, lt: 300, lb: 450, kt: 5, km: 5, img: "catalog-3", cert: "SHGB", listrik: "13.200 VA", fac: ["3 lantai", "Developer: Navapark BSD City", "Kawasan premium Navapark 2", "Hunian mewah terbaik"], facEn: ["3 floors", "Developer: Navapark BSD City", "Premium Navapark 2 area", "Top-tier luxury living"], desc: "Hunian mewah terbaik di kawasan premium Navapark 2, BSD City. Rumah 3 lantai dengan arsitektur modern dan lingkungan eksklusif.", descEn: "Top-tier luxury living in the premium Navapark 2 area of BSD City. A 3-storey home with modern architecture in an exclusive neighborhood." },
  { id: 4, name: "BSD Premium Launching", loc: "BSD City", city: "Tangerang Selatan", type: "rumah", status: "dijual", hot: true, price: 7000000000, from: true, lt: 200, lb: 320, kt: 5, km: 4, img: "catalog-4", cert: "SHGB", listrik: "7.700 VA", fac: ["3 lantai", "Developer: Sinarmas Land", "Free DP", "New launching"], facEn: ["3 floors", "Developer: Sinarmas Land", "No down payment", "New launching"], desc: "Peluncuran baru hunian premium di BSD City oleh Sinarmas Land. Rumah 3 lantai dengan promo free DP untuk pembelian awal.", descEn: "A new launch of premium homes in BSD City by Sinarmas Land. A 3-storey home with a free-DP promo for early buyers." },
  { id: 5, name: "Eastvara Luxury Cluster", loc: "BSD City", city: "Tangerang Selatan", type: "rumah", status: "dijual", hot: false, price: 6000000000, from: true, lt: 180, lb: 300, kt: 4, km: 4, img: "catalog-5", cert: "SHGB", listrik: "7.700 VA", fac: ["3 lantai", "Developer: Sinarmas Land", "Dekat Mall Eastvara", "Cluster mewah terbaru"], facEn: ["3 floors", "Developer: Sinarmas Land", "Near Eastvara Mall", "Newest luxury cluster"], desc: "Cluster mewah terbaru dekat Mall Eastvara, BSD City, dari Sinarmas Land. Rumah 3 lantai dengan akses cepat ke pusat belanja dan tol.", descEn: "The newest luxury cluster near Eastvara Mall in BSD City by Sinarmas Land. A 3-storey home with quick access to shopping and the toll road." },
  { id: 6, name: "Boulevard Luxury Residence", loc: "Gading Serpong", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 4000000000, from: true, lt: 160, lb: 250, kt: 4, km: 4, img: "catalog-6", cert: "SHGB", listrik: "5.500 VA", fac: ["3 lantai", "Developer: Paramount Land", "Bebas PPN", "Di Boulevard Gading Serpong"], facEn: ["3 floors", "Developer: Paramount Land", "VAT-free", "On Gading Serpong Boulevard"], desc: "Rumah mewah bebas PPN di Boulevard Gading Serpong dari Paramount Land. Hunian 3 lantai dengan desain megah dan lokasi strategis.", descEn: "A VAT-free luxury home on Gading Serpong Boulevard by Paramount Land. A 3-storey residence with a grand design and strategic location." },
  { id: 7, name: "Legok Lakeview Residence", loc: "Legok", city: "Tangerang", type: "rumah", status: "dijual", hot: true, price: 550000000, from: true, lt: 72, lb: 60, kt: 2, km: 2, img: "catalog-7", pos: "50% 50%", cert: "SHGB", listrik: "2.200 VA", fac: ["Cicilan mulai 2 juta-an", "View depan danau", "15 menit ke Kota BSD", "Bebas PPN", "Free biaya KPR hingga Rp 10 juta"], facEn: ["Installments from 2 million", "Lake view", "15 min to BSD City", "VAT-free", "Free mortgage fees up to Rp 10 million"], desc: "Rumah dengan cicilan mulai 2 juta-an, view depan danau di Legok, 15 menit ke Kota BSD. Bebas PPN dan free biaya KPR hingga Rp 10 juta.", descEn: "A home with installments from around 2 million, facing a lake in Legok, 15 minutes to BSD City. VAT-free with free mortgage fees up to Rp 10 million." },
  { id: 8, name: "Summarecon Bitung Residence", loc: "Summarecon Tangerang", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 950000000, from: true, lt: 84, lb: 70, kt: 3, km: 2, img: "catalog-8", pos: "50% 50%", cert: "SHGB", listrik: "2.200 VA", fac: ["Cicilan mulai 4 juta-an", "10 menit ke Tol Bitung", "Bebas PPN", "Free biaya KPR hingga Rp 10 juta"], facEn: ["Installments from 4 million", "10 min to Bitung toll gate", "VAT-free", "Free mortgage fees up to Rp 10 million"], desc: "Rumah di Summarecon Tangerang dengan lokasi strategis, 10 menit ke Tol Bitung. Cicilan mulai 4 juta-an, bebas PPN, free biaya KPR.", descEn: "A home in Summarecon Tangerang with a strategic location, 10 minutes to the Bitung toll gate. Installments from around 4 million, VAT-free, free mortgage fees." },
  { id: 9, name: "Sawangan Luxury Residence", loc: "Sawangan", city: "Depok", type: "rumah", status: "dijual", hot: false, price: 3000000000, from: true, lt: 150, lb: 240, kt: 4, km: 4, img: "catalog-9", cert: "SHGB", listrik: "5.500 VA", fac: ["3 lantai", "Developer: Shila Sawangan", "Subsidi DP, BPHTB & biaya akad", "Rumah mewah di Sawangan"], facEn: ["3 floors", "Developer: Shila Sawangan", "DP, BPHTB & closing-fee subsidy", "Luxury home in Sawangan"], desc: "Rumah mewah di Sawangan dari Shila Sawangan dengan subsidi DP, BPHTB, dan biaya akad. Hunian 3 lantai berdesain modern tropis.", descEn: "A luxury home in Sawangan by Shila Sawangan with DP, BPHTB, and closing-fee subsidies. A 3-storey residence with a modern tropical design." },
  { id: 10, name: "CBD Serpong Luxury Home", loc: "Gading Serpong", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 3900000000, from: true, lt: 150, lb: 240, kt: 4, km: 4, img: "catalog-10", cert: "SHGB", listrik: "5.500 VA", fac: ["3 lantai", "Developer: Summarecon Serpong", "Siap huni 2026", "Lokasi strategis CBD"], facEn: ["3 floors", "Developer: Summarecon Serpong", "Ready to live in 2026", "Strategic CBD location"], desc: "Rumah mewah siap huni 2026 di CBD Gading Serpong dari Summarecon Serpong. Hunian 3 lantai dengan lokasi sangat strategis.", descEn: "A luxury home ready to live in 2026 in the Gading Serpong CBD by Summarecon Serpong. A 3-storey residence in a highly strategic location." },
  { id: 11, name: "Giantara Affordable Home", loc: "Serpong", city: "Tangerang Selatan", type: "rumah", status: "dijual", hot: true, price: 700000000, from: true, lt: 72, lb: 70, kt: 3, km: 2, img: "catalog-11", cert: "SHGB", listrik: "2.200 VA", fac: ["2 lantai", "Developer: Giantara Serpong City", "Bebas PPN, DP & BPHTB", "Dekat BSD"], facEn: ["2 floors", "Developer: Giantara Serpong City", "No VAT, DP & BPHTB", "Near BSD"], desc: "Rumah affordable dekat BSD dari Giantara Serpong City. Bebas PPN, DP, dan BPHTB untuk hunian 2 lantai yang terjangkau.", descEn: "An affordable home near BSD by Giantara Serpong City. No VAT, DP, or BPHTB for a budget-friendly 2-storey residence." },
  { id: 12, name: "Sinarmas BSD Affordable Home", loc: "BSD City", city: "Tangerang Selatan", type: "rumah", status: "dijual", hot: true, price: 1800000000, from: true, lt: 90, lb: 100, kt: 3, km: 3, img: "catalog-12", cert: "SHGB", listrik: "3.500 VA", fac: ["2 lantai", "Developer: Sinarmas Land", "Promo DP 0%", "New launching"], facEn: ["2 floors", "Developer: Sinarmas Land", "0% down payment promo", "New launching"], desc: "Peluncuran baru rumah affordable di BSD City dari Sinarmas Land. Promo DP 0% untuk hunian 2 lantai berdesain modern.", descEn: "A new launch of affordable homes in BSD City by Sinarmas Land. A 0% down payment promo for a modern 2-storey residence." },
  { id: 13, name: "Paramount Petals Cluster", loc: "Paramount Petals", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 1500000000, from: true, lt: 90, lb: 110, kt: 3, km: 3, img: "catalog-13", cert: "SHGB", listrik: "3.500 VA", fac: ["Cicilan mulai 8 juta-an", "2 lantai", "Developer: Paramount Petals", "Unit terbatas"], facEn: ["Installments from 8 million", "2 floors", "Developer: Paramount Petals", "Limited units"], desc: "Cluster terbaru di kota mandiri Paramount Petals dengan unit terbatas. Rumah 2 lantai bergaya klasik dengan cicilan mulai 8 juta-an.", descEn: "The newest cluster in the Paramount Petals self-contained city with limited units. A classic-style 2-storey home with installments from around 8 million." },
  { id: 14, name: "Praja Nirbana Residence", loc: "Serpong", city: "Tangerang Selatan", type: "rumah", status: "dijual", hot: true, price: 1400000000, from: true, lt: 84, lb: 100, kt: 3, km: 2, img: "catalog-14", cert: "SHGB", listrik: "3.500 VA", fac: ["Cicilan mulai 6 juta-an", "2 lantai", "Developer: Praja Nirbana Serpong", "10 juta all-in (DP, akad, surat)"], facEn: ["Installments from 6 million", "2 floors", "Developer: Praja Nirbana Serpong", "10 million all-in (DP, closing, documents)"], desc: "Rumah siap huni di Tangsel dengan program 10 juta all-in: gratis DP, akad, dan surat. Cicilan mulai 6 juta-an, 2 lantai.", descEn: "A move-in-ready home in South Tangerang with a 10-million all-in program: free DP, closing, and documents. Installments from around 6 million, 2 storeys." },
  { id: 15, name: "Tresor BSD", loc: "BSD City", city: "Tangerang Selatan", type: "rumah", status: "dijual", hot: false, price: 11600000000, from: true, lt: 300, lb: 420, kt: 5, km: 5, img: "catalog-15", cert: "SHGB", listrik: "13.200 VA", fac: ["3 lantai", "Developer: Sinarmasland", "Eksklusif, hanya 61 unit", "Hunian prestisius"], facEn: ["3 floors", "Developer: Sinarmasland", "Exclusive, only 61 units", "Prestigious residence"], desc: "Hunian prestisius dan eksklusif di BSD City, hanya tersedia 61 unit, oleh Sinarmasland. Rumah 3 lantai berkelas.", descEn: "A prestigious and exclusive residence in BSD City, only 61 units available, by Sinarmasland. A premium 3-storey home." },
  { id: 16, name: "Paramount Boulevard Residence", loc: "Gading Serpong", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 4000000000, from: true, lt: 160, lb: 250, kt: 4, km: 4, img: "catalog-16", cert: "SHGB", listrik: "5.500 VA", fac: ["3 lantai", "Developer: Paramount Land", "Bebas PPN", "Di Boulevard Gading Serpong"], facEn: ["3 floors", "Developer: Paramount Land", "VAT-free", "On Gading Serpong Boulevard"], desc: "Rumah mewah terbaru bebas PPN di Boulevard Gading Serpong dari Paramount Land dengan fasad megah dan 3 lantai.", descEn: "The newest VAT-free luxury home on Gading Serpong Boulevard by Paramount Land with a grand facade and 3 storeys." },
  { id: 17, name: "Alam Sutera Ultimate Prestige", loc: "Alam Sutera", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 29000000000, from: true, lt: 600, lb: 650, kt: 6, km: 6, img: "catalog-17", cert: "SHM", listrik: "23.000 VA", fac: ["2 lantai", "Eksklusif oleh Alam Sutera", "Hunian paling prestisius", "Halaman luas & carport besar"], facEn: ["2 floors", "Exclusively by Alam Sutera", "Most prestigious residence", "Large garden & carport"], desc: "Pengalaman puncak prestise: The Final Luxury di Alam Sutera. Rumah mewah 2 lantai dengan lahan luas, eksklusif oleh Alam Sutera.", descEn: "The ultimate prestige experience: The Final Luxury in Alam Sutera. A 2-storey luxury home on a large plot, exclusively by Alam Sutera." },
  { id: 18, name: "Alam Sutera New Cluster", loc: "Alam Sutera", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 1100000000, from: true, lt: 84, lb: 100, kt: 3, km: 2, img: "catalog-18", cert: "SHGB", listrik: "3.500 VA", fac: ["Cicilan mulai 6 juta-an", "2 lantai", "Developer: Alam Sutera", "Harga start 1 M-an"], facEn: ["Installments from 6 million", "2 floors", "Developer: Alam Sutera", "Starting around 1 billion"], desc: "Cluster terbaru di kawasan Alam Sutera dengan harga mulai 1 M-an dan cicilan mulai 6 juta-an. Rumah 2 lantai berdesain modern.", descEn: "The newest cluster in the Alam Sutera area, starting from around 1 billion with installments from around 6 million. A modern 2-storey home." },
  { id: 19, name: "Grand Boulevard Shophouse", loc: "Gading Serpong", city: "Tangerang", type: "ruko", status: "dijual", hot: false, price: 3200000000, from: true, lt: 84, lb: 210, kt: 0, km: 3, img: "catalog-19", cert: "SHGB", listrik: "10.600 VA", fac: ["2-3 lantai", "Developer: Paramount Land", "Kawasan CBD", "Area komersial ramai"], facEn: ["2-3 floors", "Developer: Paramount Land", "CBD area", "Busy commercial area"], desc: "Ruko baru di kawasan CBD Grand Boulevard Gading Serpong dari Paramount Land. Bangunan 2-3 lantai di area komersial yang ramai.", descEn: "A new shophouse in the Grand Boulevard CBD area of Gading Serpong by Paramount Land. A 2-3 storey building in a busy commercial area." },
  { id: 20, name: "Summarecon Lakeview Residence", loc: "Summarecon Tangerang", city: "Tangerang", type: "rumah", status: "dijual", hot: false, price: 2000000000, from: true, lt: 120, lb: 160, kt: 3, km: 3, img: "catalog-20", cert: "SHGB", listrik: "4.400 VA", fac: ["Cicilan mulai 10 juta-an", "2 & 3 lantai", "Developer: Summarecon Tangerang", "View danau langsung"], facEn: ["Installments from 10 million", "2 & 3 floors", "Developer: Summarecon Tangerang", "Direct lake view"], desc: "Rumah dengan view danau langsung di Summarecon Tangerang. Pilihan 2 dan 3 lantai dengan cicilan mulai 10 juta-an.", descEn: "A home with a direct lake view in Summarecon Tangerang. 2- and 3-storey options with installments from around 10 million." },
  { id: 21, name: "Park Serpong Affordable Home", loc: "Serpong", city: "Tangerang Selatan", type: "rumah", status: "dijual", hot: true, price: 600000000, from: true, lt: 66, lb: 60, kt: 2, km: 2, img: "catalog-21", cert: "SHGB", listrik: "2.200 VA", fac: ["Cicilan mulai 4 juta-an", "2-3 lantai", "Developer: Lippoland (Park Serpong)", "Bebas PPN & subsidi DP"], facEn: ["Installments from 4 million", "2-3 floors", "Developer: Lippoland (Park Serpong)", "VAT-free & DP subsidy"], desc: "Fase baru rumah affordable di Park Serpong dari Lippoland. Bebas PPN dan subsidi DP dengan cicilan mulai 4 juta-an.", descEn: "A new phase of affordable homes in Park Serpong by Lippoland. VAT-free with a DP subsidy and installments from around 4 million." }
];
// register the English text that travels with each listing
P.forEach(p => { EN_LIST.push([p.desc, p.descEn]); p.fac.forEach((f, i) => EN_LIST.push([f, p.facEn[i]])); });
function igCard(p) {
  const cap = (p.cap || '').replace(/\s+/g, ' ').trim() || 'Lihat postingan di Instagram';
  const stats = (p.likes != null || p.com != null) ? `<span>${p.likes != null ? '♥ ' + p.likes : ''}${p.likes != null && p.com != null ? ' &nbsp; ' : ''}${p.com != null ? '💬 ' + p.com : ''}</span>` : '';
  return `<a class="fr-post" href="${esc(p.url || CFG.IG_URL)}" target="_blank" rel="noopener" aria-label="Lihat di Instagram: ${esc(cap)}"><img src="${esc(p.src || IMG(p.img))}" alt="${esc(cap)}" loading="lazy" referrerpolicy="no-referrer">${ICO.ig}<div class="fr-cap">${esc(cap)}</div><div class="fr-ov">${stats}<u>Lihat di Instagram</u></div></a>`;
}
// Live feed: Behold (behold.so) JSON feed -> same cards. Leave CFG.IG_FEED_URL empty to keep the sample cards.
async function loadInstagram() {
  if (CFG.ELFSIGHT_APP_ID) {
    // Elfsight widget: paste only the id from <div class="elfsight-app-ID">
    $('#fr-ig').innerHTML = `<div class="elfsight-app-${CFG.ELFSIGHT_APP_ID.replace(/[^\w-]/g, '')}" data-elfsight-app-lazy style="grid-column:1/-1"></div>`;
    $('#fr-ig').style.display = 'block';
    if (!$('script[src*="elfsightcdn.com/platform.js"]')) { const s = document.createElement('script'); s.src = 'https://elfsightcdn.com/platform.js'; s.async = true; document.body.appendChild(s); }
    return;
  }
  if (!CFG.IG_FEED_URL) return;
  try {
    const r = await fetch(CFG.IG_FEED_URL, { cache: 'no-cache' }); if (!r.ok) throw new Error(r.status);
    const txt = await r.text(); let posts = [];
    const strip = h => { const d = document.createElement('div'); d.innerHTML = h || ''; return d.textContent; };
    if (/^\s*[\[{]/.test(txt)) {
      // Behold ({posts:[…]}) or JSON Feed / RSS.app ({items:[…]})
      const d = JSON.parse(txt); const list = Array.isArray(d) ? d : (d.posts || d.items || d.data || []);
      posts = list.map(x => ({
        src: x.sizes?.medium?.mediaUrl || x.thumbnailUrl || x.mediaUrl || x.media_url || x.thumbnail_url || x.image || x.thumbnail || x.attachments?.[0]?.url,
        cap: x.prunedCaption || x.caption || x.content_text || x.title || strip(x.content_html), url: x.permalink || x.url || x.link,
        likes: x.likeCount ?? x.like_count ?? null, com: x.commentsCount ?? x.comments_count ?? x.commentCount ?? null
      }));
    } else {
      // RSS / Atom XML
      const xml = new DOMParser().parseFromString(txt, 'text/xml');
      posts = [...xml.querySelectorAll('item, entry')].map(it => {
        const g = s => it.querySelector(s); const desc = g('description')?.textContent || g('content')?.textContent || '';
        const tmp = document.createElement('div'); tmp.innerHTML = desc;
        return {
          src: g('enclosure')?.getAttribute('url') || g('media\\:content, content')?.getAttribute?.('url') || tmp.querySelector('img')?.src,
          cap: (g('title')?.textContent || '').trim() || tmp.textContent, url: g('link')?.textContent?.trim() || g('link')?.getAttribute('href'),
          likes: null, com: null
        };
      });
    }
    posts = posts.filter(x => x.src && x.url && /instagram\.com/.test(x.url)).slice(0, 8);
    if (!posts.length) return;
    $('#fr-ig').innerHTML = posts.map(igCard).join('');
  } catch (e) { console.warn('[fortis] Instagram feed gagal, memakai kartu contoh', e); }
}
const IG = [
  ['p1', 'Open house Fortis Prime Residence, BSD City ✨', 312, 24], ['p3', 'Unit sewa Skyline Apartment, siap huni 🏙️', 248, 17],
  ['p2', 'Ruko strategis untuk bisnis Anda 📍', 190, 12], ['p4', 'Kavling Sentul dengan view pegunungan 🌄', 405, 31],
  ['p5', 'Tips pertama kali beli rumah lewat KPR 🏡', 276, 40], ['p6', 'Behind the scene survey lokasi bersama klien', 158, 9],
  ['p4-sq', 'Hot deal minggu ini — hubungi agen kami 🔥', 521, 48], ['p1-sq', 'Serah terima kunci! Selamat untuk keluarga baru 🔑', 689, 63]
].map(a => ({ img: a[0], cap: a[1], likes: a[2], com: a[3] }));

/* ================= helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rp = n => 'Rp ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wa = text => `https://wa.me/${CFG.WA_NUMBER}?text=${encodeURIComponent(text)}`;
const IMG = k => U(`/__fortis/img/${k}.${k.startsWith('catalog-') ? 'webp' : 'jpg'}`);
const ICO = {
  fire: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.5 2c.6 3.6-1.6 5.2-3.2 7.6-1.3 2-.6 4 1 5.1-.1-2.2 1.4-3.3 2.4-4.4 2.1 2 4.3 3.6 4.3 6.5a6.5 6.5 0 1 1-13 0c0-3.4 1.8-5.600 3.600-7.600C9.200 6.300 11 4.600 12.500 2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>',
  wa: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.1 14.9l-.3-.2-2.7.7.7-2.6-.2-.3A8 8 0 0 1 12 4zM8.700 7.500c-.3 0-.6.1-.8.4-.3.3-1 1-1 2.400s1 2.700 1.200 2.900c.1.2 2 3.100 4.900 4.200 2.400.9 2.900.7 3.400.7.500-.1 1.700-.7 1.900-1.400.2-.7.2-1.200.2-1.400-.1-.1-.3-.2-.6-.3l-1.800-.9c-.2-.1-.5-.1-.7.2l-.8 1c-.1.200-.3.200-.5.1-1-.5-2.100-1-3-2.400-.1-.2 0-.3.100-.4l.5-.6.200-.4c.1-.1 0-.3 0-.4l-.8-1.900c-.2-.5-.4-.5-.6-.5z"/></svg>',
  ig: '<svg viewBox="0 0 24 24"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.500A4.500 4.500 0 1 1 7.500 12 4.500 4.500 0 0 1 12 7.500zm0 2A2.500 2.500 0 1 0 14.500 12 2.500 2.500 0 0 0 12 9.500zM17.300 5.800a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>'
};
const ukuran = p => [p.lt ? `LT ${p.lt} m²` : '', p.lb ? `LB ${p.lb} m²` : ''].filter(Boolean).join(' · ');
const priceHTML = p => `${rp(p.price)}${p.per ? ` <em>${p.per}</em>` : p.from ? ' <em>harga mulai</em>' : ''}`;
const waUnit = p => `Halo Fortis Realty, saya tertarik dengan unit ${p.name} di ${p.loc}${p.city ? ', ' + p.city : ''} (${priceHTMLText(p)}). Mohon info lebih lanjut.`;
const priceHTMLText = p => (p.from ? 'harga mulai ' : '') + rp(p.price) + (p.per || '');

/* ================= i18n (Bahasa Indonesia <-> English) ================= */
let LANG = 'id';
try { const s = localStorage.getItem('fr-lang'); if (s === 'en' || s === 'id') LANG = s; } catch (e) {}
const EN = {
  // hero / nav / footer / titles
  'Temukan Hunian Impian Anda': 'Find Your Dream Home',
  'Koleksi listing properti terkurasi mulai dari hunian premium, ruko komersial, hingga lahan strategis dengan legalitas terjamin, proses transparan, dan pendampingan agen profesional.': 'A curated collection of property listings, from premium homes and commercial shophouses to strategic land, with guaranteed legal status, a transparent process, and professional agent support.',
  'Jelajahi Listing Properti': 'Explore Property Listings', 'Hitung KPR / Booking Survey': 'Calculate Mortgage / Book a Survey',
  'Unit terjual': 'Units sold', 'Klien puas': 'Happy clients',
  'Katalog': 'Catalog', 'Kalkulator KPR': 'Mortgage Calculator', 'Kontak': 'Contact',
  'Properti Kami': 'Our Properties',
  'Koleksi hunian, ruko, apartemen, dan lahan pilihan dari Fortis Realty, dengan legalitas jelas, proses transparan, dan pendampingan agen profesional.': 'A selection of homes, shophouses, apartments, and land from Fortis Realty, with clear legal status, a transparent process, and professional agent support.',
  // catalog
  'Tentang Kami': 'About Us', 'Langkah Tepat': 'The Right Step', 'Menuju Properti Idaman': 'Toward Your Ideal Property',
  'Fortis Realty adalah agen penjualan properti primer yang bekerja sama langsung dengan developer ternama, melayani Gading Serpong, BSD, dan sekitarnya.': 'Fortis Realty is a primary-market property sales agency working directly with leading developers, serving Gading Serpong, BSD, and surrounding areas.',
  'Kami mendampingi Anda mulai dari memilih unit hingga serah terima kunci: informasi yang jelas, proses yang transparan, dan agen yang memahami kawasan. Setiap listing berasal dari developer resmi, sehingga Anda mendapatkan unit baru dengan legalitas yang dapat dipertanggungjawabkan.': 'We guide you from choosing a unit to receiving the keys: clear information, a transparent process, and agents who know the area. Every listing comes from an official developer, so you get a brand-new unit with legalities you can rely on.',
  'Listing Primer Resmi': 'Official Primary Listings', 'Unit baru langsung dari developer mitra, dengan informasi harga dan legalitas yang jelas.': 'New units straight from partner developers, with clear pricing and legal information.',
  'Pendampingan Menyeluruh': 'End-to-End Guidance', 'Dari konsultasi, survei lokasi, simulasi KPR, hingga serah terima kunci.': 'From consultation and site surveys to mortgage simulation and key handover.',
  'Paham Kawasan': 'Local Expertise', 'Fokus di Gading Serpong, BSD, dan sekitarnya sehingga rekomendasi kami relevan dan terukur.': 'Focused on Gading Serpong, BSD, and surroundings, so our recommendations are relevant and well-founded.',
  'Developer Mitra': 'Partner Developers', 'Kawasan Utama': 'Main Areas', 'Properti Primer': 'Primary Properties', 'Gading Serpong & BSD': 'Gading Serpong & BSD',
  'Siap menemukan hunian Anda?': 'Ready to find your home?', 'Ceritakan kebutuhan Anda, agen kami siap membantu.': 'Tell us what you need and our agents are ready to help.', 'Hubungi Kami via WhatsApp': 'Chat with Us on WhatsApp',
  'Katalog Properti': 'Property Catalog', 'Listing properti': 'Property listings', 'pilihan kami': 'selected for you',
  'Unit terkurasi dengan legalitas jelas. Filter berdasarkan tipe, status, dan lokasi, lalu hubungi agen langsung via WhatsApp.': 'Curated units with clear legal status. Filter by type, status, and location, then contact an agent directly via WhatsApp.',
  'Tipe': 'Type', 'Semua': 'All', 'Rumah Residensial': 'Residential House', 'Ruko Komersial': 'Commercial Shophouse', 'Apartemen': 'Apartment', 'Tanah/Kavling': 'Land / Plot',
  'Dijual': 'For Sale', 'Disewa': 'For Rent', 'Semua Lokasi': 'All Locations', 'Lokasi': 'Location',
  'Belum ada unit yang cocok dengan filter ini. Coba ubah kriteria pencarian.': 'No units match this filter yet. Try changing your search criteria.',
  'Hubungi Sales': 'Contact Sales', 'Detail Unit': 'Unit Details', 'Detail unit': 'Unit details', 'Tutup': 'Close', 'Kembali': 'Back',
  'Sertifikat': 'Certificate', 'Luas Tanah': 'Land Area', 'Luas Bangunan': 'Building Area', 'Kamar Tidur': 'Bedrooms', 'Kamar Mandi': 'Bathrooms', 'Listrik': 'Electricity',
  'Galeri': 'Gallery', 'Galeri Properti': 'Property Gallery', 'Rekomendasi': 'Recommended', 'Properti Lainnya': 'More Properties', 'Katalog': 'Catalog', 'Foto': 'Photo',
  'Booking Survey': 'Book a Survey', 'Simulasi KPR unit ini': 'Simulate mortgage for this unit',
  // facilities
  'Carport 2 mobil': '2-car carport', 'Taman': 'Garden', 'One gate system': 'One-gate system', '3 lantai': '3 floors', '2 lantai': '2 floors', 'Parkir depan': 'Front parking', 'Dekat mall': 'Near the mall', 'Area komersial': 'Commercial area',
  'Kolam renang': 'Swimming pool', 'Security 24 jam': '24-hour security', 'Siap bangun': 'Ready to build', 'View pegunungan': 'Mountain view', 'Jalan lebar 8 m': '8 m wide road', 'Dekat tol': 'Near the toll road',
  'Cluster 24 jam': '24-hour cluster', 'Dekat sekolah': 'Near schools', 'Taman bermain': 'Playground', 'Muka lebar': 'Wide frontage', 'Parkir luas': 'Spacious parking', 'Area kuliner': 'Culinary area',
  'Dekat stasiun': 'Near the station', 'Retail lantai dasar': 'Ground-floor retail', 'Lokasi premium': 'Premium location', 'Bebas banjir': 'Flood-free', 'Akses tol Jagorawi': 'Jagorawi toll road access', 'Lingkungan elit': 'Upscale neighborhood',
  // descriptions
  'Hunian premium dua lantai di kawasan BSD City dengan desain modern tropis, akses tol dan fasilitas pendidikan di sekitar.': 'A premium two-storey home in BSD City with a modern tropical design, toll road access, and nearby educational facilities.',
  'Ruko tiga lantai di jalan utama Alam Sutera, cocok untuk kantor, klinik, atau retail dengan traffic tinggi.': 'A three-storey shophouse on a main road in Alam Sutera, suitable for offices, clinics, or high-traffic retail.',
  'Apartemen 2 kamar fully furnished di jantung CBD Kuningan, akses langsung ke MRT dan perkantoran.': 'A fully furnished 2-bedroom apartment in the heart of the Kuningan CBD, with direct access to the MRT and offices.',
  'Kavling siap bangun di kawasan Sentul dengan udara sejuk, legalitas SHM, dan jalan lingkungan yang lebar.': 'Build-ready plot in Sentul with cool air, SHM title, and wide neighborhood roads.',
  'Rumah cluster nyaman untuk keluarga, lingkungan asri dan aman dengan akses mudah ke pusat perbelanjaan.': 'A comfortable cluster home for families in a green, safe neighborhood with easy access to shopping centers.',
  'Ruko sewa di boulevard utama Gading Serpong, ramai pengunjung dan cocok untuk F&B maupun retail.': 'A shophouse for rent on the main boulevard of Gading Serpong, busy with visitors and ideal for F&B or retail.',
  'Studio modern berpotensi sewa tinggi, strategis dekat stasiun dan kawasan bisnis. Pilihan investasi entry-level.': 'A modern studio with high rental potential, strategically close to the station and business district. An entry-level investment choice.',
  'Lahan 500 m² di lokasi strategis Cibubur, ideal untuk hunian mewah atau pengembangan townhouse.': 'A 500 m² plot in a strategic Cibubur location, ideal for a luxury home or a townhouse development.',
  // mortgage
  'Simulasi cicilan': 'Estimate your', 'KPR Anda': 'monthly mortgage',
  'Perkiraan angsuran bulanan dengan metode anuitas. Hasil bersifat estimasi dan dapat berbeda dengan ketentuan bank.': "Estimated monthly installments using the annuity method. Results are estimates and may differ from the bank's terms.",
  'Harga Properti (Rp)': 'Property Price (Rp)', 'Uang Muka / DP (%)': 'Down Payment (%)', 'Jangka Waktu / Tenor': 'Loan Term', 'Suku Bunga Tahunan (%) — fixed': 'Annual Interest Rate (%) — fixed',
  'Estimasi Angsuran / Bulan': 'Estimated Monthly Installment', 'Total Uang Muka (DP)': 'Total Down Payment', 'Pokok Pinjaman': 'Loan Principal', 'Total Pembayaran Pinjaman': 'Total Loan Repayment',
  'Konsultasi KPR via WhatsApp': 'Mortgage Consultation via WhatsApp', 'Slider harga': 'Price slider', 'Slider DP': 'Down payment slider',
  // instagram
  'Ikuti update & listing terbaru di Instagram': 'Follow the latest updates & listings on Instagram',
  // contact form
  'Nama': 'Name', 'Nama Anda': 'Your name', 'Email Anda (opsional)': 'Your email (optional)', 'Nomor telepon': 'Phone number', 'Nomor telepon / WhatsApp Anda': 'Your phone / WhatsApp number',
  'Layanan': 'Service', 'Pilih layanan…': 'Select a service…', 'Booking survey unit': 'Book a unit survey', 'Beli properti': 'Buy a property', 'Sewa properti': 'Rent a property',
  'Jual / titip jual properti': 'Sell / list a property', 'Konsultasi KPR': 'Mortgage consultation', 'Lainnya': 'Other',
  'Unit properti': 'Property unit', 'Pilih unit properti…': 'Select a property unit…', 'Tanggal survey': 'Survey date', 'Waktu survey': 'Survey time',
  'Pesan': 'Message', 'Tulis pesan atau catatan tambahan (opsional)…': 'Write a message or additional notes (optional)…', 'Kirim Pesan': 'Send Message',
  'Membuka WhatsApp Concierge…': 'Opening WhatsApp Concierge…',
  'Masukkan nama Anda (min. 3 karakter).': 'Enter your name (min. 3 characters).', 'Format email tidak valid.': 'Invalid email format.',
  'Nomor tidak valid, contoh: 0812xxxxxxxx.': 'Invalid number, e.g. 0812xxxxxxxx.', 'Pilih layanan yang Anda butuhkan.': 'Select the service you need.',
  'Pilih unit properti.': 'Select a property unit.', 'Pilih tanggal.': 'Select a date.', 'Tanggal sudah lewat.': 'That date has passed.', 'Pilih waktu.': 'Select a time.',
  // chrome
  'Fortis Realty — Konsultan & Broker Properti Pilihan Anda': 'Fortis Realty — Your Trusted Property Consultant & Broker',
  'Ikuti kami:': 'Follow us:', 'Tautan Cepat': 'Quick Links',
  'Temukan Properti Impian Anda Sekarang': 'Find Your Dream Property Now',
  '/bulan': '/month', '/tahun': '/year',
  'Fortis Realty – Konsultan & Broker Properti Tepercaya': 'Fortis Realty – Trusted Property Consultant & Broker'
};
const PAT = [
  [/^Menampilkan (\d+) dari (\d+) unit$/, m => `Showing ${m[1]} of ${m[2]} units`],
  [/^(\d+) unit ditemukan$/, m => `${m[1]} ${m[1] === '1' ? 'unit' : 'units'} found`],
  [/^Nominal DP: (.+)$/, m => `Down payment: ${m[1]}`],
  [/^(\d+) tahun$/, m => `${m[1]} years`],
  [/^Follow @(.+) di Instagram$/, m => `Follow @${m[1]} on Instagram`],
  [/^Detail (.+)$/, m => `Details: ${m[1]}`],
  [/^(.+) — (.+) \((dijual|disewa)\)$/, m => `${m[1]} — ${m[2]} (${m[3] === 'dijual' ? 'for sale' : 'for rent'})`],
  [/^LT (.+)$/, m => `Land ${m[1]}`], [/^LB (.+)$/, m => `Building ${m[1]}`], [/^(\d+) KT$/, m => `${m[1]} BR`], [/^(\d+) KM$/, m => `${m[1]} BA`]
];
EN_LIST.forEach(([k, v]) => { EN[k] = v; });
EN['harga mulai'] = 'starting price';
const tr = s => (LANG === 'en' && EN[s] !== undefined ? EN[s] : s);
function trAny(s) {
  const core = s.replace(/\s+/g, ' ').trim(); if (!core) return s;
  let out;
  if (EN[core] !== undefined) out = EN[core];
  else if (core.includes(' · ')) out = core.split(' · ').map(x => (EN[x] !== undefined ? EN[x] : (PAT.map(([re, f]) => { const m = x.match(re); return m ? f(m) : null; }).find(Boolean) || x))).join(' · ');
  else { out = core; for (const [re, f] of PAT) { const m = core.match(re); if (m) { out = f(m); break; } } }
  return out === core ? s : s.replace(s.trim(), out);
}
// my own markup only (template-owned text is handled with tr()/textSwap): remember each original and swap on language change
const I18N_ROOTS = '.fr-sec, #fr-modal, .fr-pmeta, #fr-contact';
const ORIG = new WeakMap();
function i18nDom() {
  const en = LANG === 'en';
  $$(I18N_ROOTS).forEach(root => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      if (n.parentElement.closest('#fr-ig,script,style')) continue;
      if (!n.nodeValue.trim()) continue;
      let rec = ORIG.get(n); if (!rec || n.nodeValue !== rec.shown) { rec = { orig: n.nodeValue, shown: n.nodeValue }; ORIG.set(n, rec); }
      const target = en ? trAny(rec.orig) : rec.orig;
      if (n.nodeValue !== target) n.nodeValue = target; rec.shown = target;
    }
    [root, ...root.querySelectorAll('[placeholder],[aria-label],[title],[alt]')].forEach(el => {
      if (el.closest('#fr-ig')) return;
      ['placeholder', 'aria-label', 'title', 'alt'].forEach(at => {
        if (!el.hasAttribute(at)) return;
        el.__i18n = el.__i18n || {}; let rec = el.__i18n[at]; const cur = el.getAttribute(at);
        if (!rec || cur !== rec.shown) { rec = { orig: cur, shown: cur }; el.__i18n[at] = rec; }
        const target = en ? trAny(rec.orig) : rec.orig; if (cur !== target) el.setAttribute(at, target); rec.shown = target;
      });
    });
  });
  DD_SYNC.forEach(f => f());
}
const DD_SYNC = [];
function setLang(l) {
  if (l !== 'en' && l !== 'id') return; LANG = l;
  try { localStorage.setItem('fr-lang', l); } catch (e) {}
  document.documentElement.lang = l; apply();
}

/* ================= global rebrand (all pages) ================= */
const TS_RULES = [
  { from: ['Transforming spaces into lasting expressions of beauty, comfort, and quality.', 'Transforming spaces into lasting expressions of beauty, comfort, and quality'], id: 'Fortis Realty — Konsultan & Broker Properti Pilihan Anda', en: 'Fortis Realty — Your Trusted Property Consultant & Broker' },
  { from: ['Follow us on:', 'Follow us on'], id: 'Ikuti kami:', en: 'Follow us:' },
  { from: ['Quick Link'], id: 'Tautan Cepat', en: 'Quick Links' },
  { from: ['Others Link'], id: 'Lainnya', en: 'More' },
  { from: ['Contact us'], id: 'Kontak', en: 'Contact' },
  { from: ['Let’s Bring Your Ideas to Life', "Let's Bring Your Ideas to Life", 'Wujudkan Properti Impian Anda', 'Turn Your Dream Property into Reality'], id: 'Temukan Properti Impian Anda Sekarang', en: 'Find Your Dream Property Now' }
];
TS_RULES.forEach(r => { r.all = [...r.from, r.id, r.en].map(x => x.toLowerCase()); });
function textSwap() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    if (n.parentElement.closest('.fr-sec,.fr-modal,#fr-contact,script,style')) continue;
    let v = n.nodeValue, o = v;
    v = v.replace(/lumura/gi, m => m === m.toUpperCase() ? 'FORTIS REALTY' : 'Fortis Realty')
         .replace(/hello@fortisrealty\.id|hello@fortis realty\.com|hello@[\w.]*lumura[\w.]*/gi, CFG.EMAIL)
         .replace(/\+1 \(\d+\) [\d-]+/, CFG.PHONE)
         .replace(/\d+ Fifth Avenue.*?\d{5}/, CFG.ADDRESS)
         .replace(/Framedev/g, 'Rextrim');
    const core = v.trim().toLowerCase();
    if (core) { const r = TS_RULES.find(x => x.all.includes(core)); if (r) v = v.replace(v.trim(), LANG === 'en' ? r.en : r.id); }
    if (v !== o) n.nodeValue = v;
  }
    const T = 'Fortis Realty';
  window.__frTitle = T; if (document.title !== T) document.title = T;
  document.documentElement.lang = LANG;
}

function setLink(a, label, href) {
  if (!a) return;
  a.dataset.frLink = href;
  a.setAttribute('href', U(href));
  a.removeAttribute('target');
  $$('p', a).forEach(p => { if (p.textContent !== label) p.textContent = label; });
}

function brandChrome() {
  // logos (navbar + footer)
  $$('a[data-framer-name="Desktop"] img, nav a img, footer a img').forEach(img => {
    const a = img.closest('a'); if (!a || a.getAttribute('href') !== './' && a.getAttribute('href') !== '/') return;
    if (a.dataset.frLogo) return;
    a.dataset.frLogo = '1'; a.dataset.frLink = '/';
    a.setAttribute('href', U('/'));
    const wrap = img.closest('[data-framer-background-image-wrapper]') || img.parentElement;
    const host = wrap.parentElement;
    img.removeAttribute('srcset'); img.removeAttribute('sizes');
    img.src = CFG.LOGO; img.alt = 'Fortis Realty Logo';
    Object.assign(img.style, { height: '40px', width: 'auto', objectFit: 'contain', position: 'static', inset: 'auto', display: 'block' });
    Object.assign(wrap.style, { overflow: 'visible', minWidth: 'max-content', position: 'static', width: 'auto', height: '40px', inset: 'auto', display: 'flex', alignItems: 'center', gap: '10px' });
    Object.assign(a.style, { width: 'max-content', minWidth: 'max-content', height: '40px', overflow: 'visible' });
    if (host) { host.style.width = 'max-content'; host.style.minWidth = 'max-content'; host.style.height = '40px'; host.style.overflow = 'visible'; }
    const t = document.createElement('span'); t.className = 'fr-logo-t';
    t.textContent = 'Fortis Realty';
    t.style.cssText = 'font:600 22px/1 TikTok Sans,Inter,sans-serif;text-transform:uppercase;white-space:nowrap';
    wrap.appendChild(t);
    if (a.closest('nav')) for (let el = wrap.parentElement; el && !/Content|Container/.test(el.dataset.framerName || ''); el = el.parentElement) { el.style.overflow = 'visible'; el.style.width = 'auto'; el.style.minWidth = 'max-content'; if (el.dataset.framerName === 'Logo') { el.style.height = '40px'; el.style.display = 'flex'; el.style.alignItems = 'center'; el.style.alignSelf = 'center'; } }
  });
  const ref = $('nav a[data-framer-name="Desktop 01"] p'); 
  const burger = $('nav [data-framer-name="Burger Lines"]');
  const refEl = ref || burger;
  if (refEl) { const col = ref ? getComputedStyle(ref).color : getComputedStyle(burger).backgroundColor; $$('.fr-logo-t').forEach(t => { if (t.style.color !== col) t.style.color = col; }); }
  // nav menu
  const nav = $('nav'); if (nav) {
    const box = nav.closest('[class*="-container"]'); if (box) box.classList.add('fr-nav-fixed');
    // map by position inside the menu wrapper (the first item flips between variants on hover, so don't select by variant name)
    const wrap = $('[data-framer-name="Menu Wrapper"]', nav);
    // the template's first item ("Pages") is a dropdown with hover state we can't disable, so hide it and use a plain link
    const kids = wrap ? [...wrap.children] : [];
    const dd = kids.find(c => /gf9md2/.test(c.className)); if (dd) dd.style.display = 'none';
    if (wrap && !$('.fr-navitem', wrap)) {
      const d = document.createElement('div'); d.className = 'fr-navitem';
      d.innerHTML = `<a href="${U('/#katalog')}" data-fr-link="/#katalog"><span></span><span></span></a>`;
      wrap.insertBefore(d, wrap.firstChild);
    }
    $$('.fr-navitem span', nav).forEach(s => { if (s.textContent !== tr('Katalog')) s.textContent = tr('Katalog'); });
    // language toggle (ID | EN)
    $$('.fr-lang').slice(1).forEach(x => x.remove());
    if (!$('.fr-lang')) {
      const t = document.createElement('div'); t.className = 'fr-lang' + (wrap ? '' : ' mobile'); t.setAttribute('role', 'group'); t.setAttribute('aria-label', 'Language');
      t.innerHTML = '<button type="button" data-lang="id" aria-label="Bahasa Indonesia">ID</button><button type="button" data-lang="en" aria-label="English">EN</button>';
      (wrap || box || nav).appendChild(t);
    }
    $$('.fr-lang button').forEach(b => { const on = b.dataset.lang === LANG; if (b.getAttribute('aria-pressed') !== String(on)) b.setAttribute('aria-pressed', on); });
    const ni = $('.fr-navitem a', nav); const refp = wrap && $$('a p', wrap).find(p => !p.closest('.fr-navitem') && !p.closest('[class*="gf9md2"]'));
    if (ni && refp) { const cs = getComputedStyle(refp); if (ni.style.color !== cs.color) ni.style.color = cs.color; }
    const items = kids.filter(c => c !== dd && !c.classList.contains('fr-navitem')).map(c => $('a', c)).filter(Boolean);
    // slot 1 is the (removed) Instagram menu entry: kept in the list so positions stay stable, but hidden
    const map = [null, null, [tr('Kalkulator KPR'), '/#kpr'], [tr('Kontak'), '/#kontak']];
    items.forEach((a, i) => { const c = a.closest('[class*="-container"]') || a.parentElement; if (map[i]) { setLink(a, map[i][0], map[i][1]); a.removeAttribute('target'); c.style.display = ''; } else c.style.display = 'none'; });
    // phone / tablet burger menu: same entries, template-only pages hidden
    const mob = mobileLinks();
    const map5 = [[tr('Katalog'), '/#katalog'], ...map];
    mob.forEach((a, i) => {
      if (map5[i]) { setLink(a, map5[i][0], map5[i][1]); a.removeAttribute('target'); const c = a.parentElement; if (c && c.style.display === 'none') c.style.display = ''; }
      else { const c = a.parentElement; if (c) c.style.display = 'none'; }
    });
  }
  // footer links
  const f = $('footer'); if (f) {
    const lists = $$('[data-framer-name="Menu List"]', f);
    const m1 = [[tr('Katalog'), '/#katalog'], ['Booking Survey', '/#booking'], ['Instagram', '/#instagram'], [tr('Kalkulator KPR'), '/#kpr']];
    lists.forEach((ul, li) => $$('a', ul).forEach((a, i) => {
      if (li === 0 && (i === 1 || i === 2)) { const c = a.closest('[class*="-container"]') || a.parentElement; c.style.display = 'none'; }
      else if (li === 0 && m1[i]) setLink(a, m1[i][0], m1[i][1]);
      if (li === 1) { if (i === 0) setLink(a, 'WhatsApp', wa('Halo Fortis Realty, saya ingin bertanya.')); else if (i === 1) setLink(a, 'Instagram', CFG.IG_URL); else a.closest('div') && (a.closest('div').style.display = 'none'); }
    }));
    $$('a[target="_blank"]', f).forEach(a => { if (/facebook|x\.com|youtube|linkedin/.test(a.href)) a.style.display = 'none'; });
    if (!$('.fr-foot-extra', f)) {
      const t = $$('p', f).find(p => /Ikuti kami|Follow us/.test(p.textContent));
      if (t) { const d = document.createElement('div'); d.className = 'fr-foot-extra'; d.innerHTML = `<a href="${CFG.IG_URL}" target="_blank" rel="noopener">Instagram @${CFG.IG_USER}</a><a href="${wa('Halo Fortis Realty')}" target="_blank" rel="noopener">WhatsApp Concierge</a>`; t.parentElement.appendChild(d); $$('a', d).forEach(a => { a.style.color = '#f6f3eb'; a.style.textDecoration = 'underline'; }); }
    }
  }
}

/* ================= hero (home) ================= */
function brandHero() {
  const hero = $('section[data-framer-name="Hero Section"]'); if (!hero) return;
  const set = (el, txt) => { if (el && el.textContent !== txt) el.textContent = txt; };
  const h1 = $('h1', hero), HEAD = 'You Dream It, We Find It';
  let built = false;
  if (h1 && h1.textContent !== HEAD) {
    // same structure as the template's split-text: nowrap word > inline-block letters
    h1.textContent = '';
    HEAD.split(' ').forEach((w, i) => {
      if (i) h1.appendChild(/,$/.test(HEAD.split(' ')[i - 1]) ? document.createElement('br') : document.createTextNode(' '));
      const ws = document.createElement('span'); ws.style.whiteSpace = 'nowrap';
      [...w].forEach(ch => { const l = document.createElement('span'); l.style.display = 'inline-block'; l.textContent = ch; ws.appendChild(l); });
      h1.appendChild(ws);
    });
    built = true;
  }
  const sub = $('[data-framer-name="Title"] p', hero);
  set(sub, tr('Koleksi listing properti terkurasi mulai dari hunian premium, ruko komersial, hingga lahan strategis dengan legalitas terjamin, proses transparan, dan pendampingan agen profesional.'));
  const tag = $('a[data-framer-name="Tag"]', hero);
  if (tag) {
    set($('p', tag), tr('Jelajahi Listing Properti')); setLink(tag, tr('Jelajahi Listing Properti'), '/#katalog');
    $$('.fr-hero-cta', hero).forEach(e => e.remove());   // the secondary hero button was removed
  }
  $$('.fr-badge-hero', hero).forEach(e => e.remove());
  const lab = $$('p', $('[data-framer-name="Stats"]', hero) || hero).filter(p => /Projects completed|Client Satisfaction|Unit terjual|Klien puas|Units sold|Happy clients/.test(p.textContent));
  lab.forEach(p => set(p, /Projects|Unit terjual|Units sold/.test(p.textContent) ? tr('Unit terjual') : tr('Klien puas')));
  if (built && !window.__frIntro) { window.__frIntro = true; playIntro(hero, h1); }
}

// entrance animation like the template: headline letters rise in one by one, the rest fades up after
function playIntro(hero, h1) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // timings measured from the original template: letters slide in from the right (20px) one by one,
  // paragraph / buttons / stats rise 64px while fading in.
  const ease = 'cubic-bezier(.12,.23,.5,1)';
  const rise = (el, delay) => el && el.animate([{ opacity: 0, transform: 'translateY(64px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay, easing: ease, fill: 'backwards' });
  const badge = $('.fr-badge-hero', hero);
  if (badge) badge.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out', fill: 'backwards' });
  const letters = $$('span > span', h1);
  letters.forEach((l, i) => l.animate([{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: i * 26, easing: ease, fill: 'backwards' }));
  rise($('[data-framer-name="Title"] p', hero), 0);
  rise($('a[data-framer-name="Tag"]', hero), 100);
  rise($('.fr-hero-cta', hero), 160);
  rise($('[data-framer-name="Stats"]', hero), 200);
}

/* ================= /project page -> "Properti Kami" ================= */
function splitHeading(h, text) {
  if (!h || h.textContent === text) return false;
  h.textContent = '';
  text.split(' ').forEach((w, i) => {
    if (i) h.appendChild(document.createTextNode(' '));
    const ws = document.createElement('span'); ws.style.whiteSpace = 'nowrap';
    [...w].forEach(ch => { const l = document.createElement('span'); l.style.display = 'inline-block'; l.textContent = ch; ws.appendChild(l); });
    h.appendChild(ws);
  });
  return true;
}
function brandProjects() {
  const set = (el, txt) => { if (el && el.textContent !== txt) el.textContent = txt; };
  const h1 = $('h1');
  if (h1 && splitHeading(h1, tr('Properti Kami')) && !window.__frProjIntro && !REDUCED) {
    window.__frProjIntro = true;
    $$('span > span', h1).forEach((l, i) => l.animate([{ opacity: 0, transform: 'translateX(20px)' }, { opacity: 1, transform: 'none' }], { duration: 400, delay: i * 26, easing: 'cubic-bezier(.12,.23,.5,1)', fill: 'backwards' }));
  }
  const sub = h1 && $$('p', h1.closest('section') || document).find(p => /Thoughtfully|Koleksi hunian|A selection of homes/.test(p.textContent));
  set(sub, tr('Koleksi hunian, ruko, apartemen, dan lahan pilihan dari Fortis Realty, dengan legalitas jelas, proses transparan, dan pendampingan agen profesional.'));
  // the template only has 6 cards: clone the last card wrapper until there is one per listing
  const firstCard = $('a[href*="project/"], a[data-fr-go]');
  if (firstCard) {
    let item = firstCard; while (item.parentElement && item.parentElement.children.length < 2) item = item.parentElement;
    const grid = item.parentElement;
    const cards = () => $$('a[href*="project/"], a[data-fr-go]').filter(a => $('[data-framer-name="Card Content"]', a));
    let guard = 0;
    while (cards().length < P.length && guard++ < 40) {
      const last = [...grid.children].filter(c => $('[data-framer-name="Card Content"]', c)).pop();
      if (!last) break;
      const clone = last.cloneNode(true); $$('.fr-pmeta', clone).forEach(x => x.remove()); grid.appendChild(clone);
    }
  }
  $$('a[href*="project/"], a[data-fr-go]').forEach((a, i) => {
    const pr = P[i]; if (!pr || !$('[data-framer-name="Card Content"]', a)) return;
    a.dataset.frGo = `/?unit=${pr.id}#katalog`; a.setAttribute('href', U(`/?unit=${pr.id}`));
    const img = $('img', a); if (img && !img.src.includes('/__fortis/')) { img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.src = IMG(pr.img); img.alt = pr.name; img.style.objectPosition = 'center'; const fr = $('[data-framer-name="Image"]', a); if (fr) { fr.style.height = 'auto'; fr.style.aspectRatio = '4 / 5'; } }
    const dp = $$('[data-framer-name="Date"] p, [data-framer-name="Location"] p', a);
    set(dp[0], tr(pr.status === 'dijual' ? 'Dijual' : 'Disewa')); set(dp[1], pr.loc);
    set($('h4', a), pr.name);
    const oldMeta = $('.fr-pmeta', a); if (oldMeta && oldMeta.dataset.pid !== String(pr.id)) oldMeta.remove();
    if (!$('.fr-pmeta', a)) {
      const m = document.createElement('div'); m.className = 'fr-pmeta'; m.dataset.pid = pr.id;
      m.innerHTML = `<div class="fr-pprice">${priceHTML(pr)}</div><div class="fr-pspec">${TYPES[pr.type]} · ${ukuran(pr)}${pr.kt ? ' · ' + pr.kt + ' KT' : ''}${pr.km ? ' · ' + pr.km + ' KM' : ''}</div>`;
      $('[data-framer-name="Card Content"]', a).appendChild(m);
    }
  });
  decorateProjectImages();
  // the template's "Load More" button is not needed here: hide it (and never let Framer paginate the CMS list)
  $$('button, a, [role="button"]').filter(e => /^\s*load more\s*$/i.test(e.textContent)).forEach(more => {
    const box = more.closest('[class*="-container"]') || more; box.setAttribute('data-fr-hide', '');
    let up = box.parentElement; if (up && up.children.length === 1 && up.tagName === 'DIV' && !/Hero|Container/.test(up.dataset.framerName || '')) up.setAttribute('data-fr-hide', '');
  });
  const cs = $$('section').find(s => /bring your ideas|wujudkan|turn your dream|temukan rumah impian|find your dream home now/i.test(s.textContent) && $('form', s));
  if (cs && !$('#fr-contact', cs)) { setupContact(cs); $$('select.fr-select', cs).forEach(enhanceSelect); }
}

/* ================= sections ================= */
const state = { type: 'all', status: 'all', loc: 'all', unit: '' };

function aboutSec() {
  const pill = [['01', 'Listing Primer Resmi', 'Unit baru langsung dari developer mitra, dengan informasi harga dan legalitas yang jelas.'],
    ['02', 'Pendampingan Menyeluruh', 'Dari konsultasi, survei lokasi, simulasi KPR, hingga serah terima kunci.'],
    ['03', 'Paham Kawasan', 'Fokus di Gading Serpong, BSD, dan sekitarnya sehingga rekomendasi kami relevan dan terukur.']];
  const devs = [['Sinarmas Land', 'sinarmas'], ['Summarecon', 'summarecon'], ['Paramount Land', 'paramount'], ['Alam Sutera', 'alamsutera']];
  return `<section class="fr-sec fr-light" id="tentang" data-fr="1"><div class="fr-wrap">
  <div class="fr-head"><div><div class="fr-tag">Tentang Kami</div><h2 class="fr-h2">Langkah Tepat<br>Menuju Properti Idaman</h2></div>
  <p class="fr-lead">Fortis Realty adalah agen penjualan properti primer yang bekerja sama langsung dengan developer ternama, melayani Gading Serpong, BSD, dan sekitarnya.</p></div>
  <div class="fr-about">
    <div class="fr-about-media">
      <div class="fr-about-img"><img src="${IMG('p1')}" alt="" loading="lazy"></div>
      <div class="fr-about-img sm"><img src="${IMG('p5')}" alt="" loading="lazy"></div>
      <div class="fr-about-quote"><img src="${CFG.LOGO}" alt="" width="34" height="34"><span>You Dream It, We Find It</span></div>
    </div>
    <div class="fr-about-body">
      <p class="fr-about-p">Kami mendampingi Anda mulai dari memilih unit hingga serah terima kunci: informasi yang jelas, proses yang transparan, dan agen yang memahami kawasan. Setiap listing berasal dari developer resmi, sehingga Anda mendapatkan unit baru dengan legalitas yang dapat dipertanggungjawabkan.</p>
      <div class="fr-pill">${pill.map(([n, t, d]) => `<div class="fr-pill-i"><span class="fr-pill-n">${n}</span><div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div>
      <div class="fr-devs"><b>Developer Mitra</b><div>${devs.map(([n, f]) => `<span class="fr-dev" title="${n}"><img src="${U('/__fortis/img/partners/' + f + '.png')}" alt="${n}" loading="lazy"></span>`).join('')}</div></div>
    </div>
  </div>
  <div class="fr-astats"><div><strong>4</strong><span>Developer Mitra</span></div><div><strong>2</strong><span>Kawasan Utama</span><small>Gading Serpong &amp; BSD</small></div><div><strong>100%</strong><span>Properti Primer</span></div></div>
  <div class="fr-acta"><div><h3>Siap menemukan hunian Anda?</h3><p>Ceritakan kebutuhan Anda, agen kami siap membantu.</p></div><a class="fr-btn wa" target="_blank" rel="noopener" href="${wa('Halo Fortis Realty, saya ingin berkonsultasi mengenai properti.')}">${ICO.wa}Hubungi Kami via WhatsApp</a></div>
</div></section>

`;
}
function sections() {
  const locs = [...new Set(P.map(p => p.loc))];
  return aboutSec() + `
<section class="fr-sec fr-light" id="katalog" data-fr="1"><div class="fr-wrap">
  <div class="fr-head"><div><div class="fr-tag">Katalog Properti</div><h2 class="fr-h2">Listing properti<br>pilihan kami</h2></div>
  <p class="fr-lead">Unit terkurasi dengan legalitas jelas. Filter berdasarkan tipe, status, dan lokasi, lalu hubungi agen langsung via WhatsApp.</p></div>
  <div class="fr-filters">
    <div class="fr-frow"><b>Tipe</b>${[['all', 'Semua'], ...Object.entries(TYPES)].map(([k, v]) => `<button class="fr-chip" data-ft="${k}" aria-pressed="${k === 'all'}">${v}</button>`).join('')}</div>
    <div class="fr-frow"><b>Status</b>${[['all', 'Semua'], ['dijual', 'Dijual'], ['disewa', 'Disewa']].map(([k, v]) => `<button class="fr-chip" data-fs="${k}" aria-pressed="${k === 'all'}">${v}</button>`).join('')}
      <select class="fr-select" id="fr-loc" aria-label="Lokasi"><option value="all">Semua Lokasi</option>${locs.map(l => `<option>${esc(l)}</option>`).join('')}</select>
    </div>
    <div class="fr-frow fr-countrow"><span class="fr-count" id="fr-count"></span></div>
  </div>
  <div class="fr-grid" id="fr-grid"></div>
  <div class="fr-center"><a class="fr-btn fr-more" href="${U('/project')}" id="fr-loadmore"><span class="fr-more-t">Load More</span><span class="fr-more-n" aria-hidden="true"></span><span class="fr-more-ico" aria-hidden="true"></span></a></div>
</div></section>

<section class="fr-sec fr-dark" id="kpr" data-fr="1"><div class="fr-wrap">
  <div class="fr-head"><div><div class="fr-tag">Kalkulator KPR</div><h2 class="fr-h2">Simulasi cicilan<br>KPR Anda</h2></div><p class="fr-lead">Perkiraan angsuran bulanan dengan metode anuitas. Hasil bersifat estimasi dan dapat berbeda dengan ketentuan bank.</p></div>
  <div class="fr-kpr">
    <div class="fr-kin">
      <div class="fr-field"><label for="k-harga">Harga Properti (Rp)</label><input class="fr-input" id="k-harga" inputmode="numeric" value="1.000.000.000"><input type="range" id="k-harga-r" min="100000000" max="10000000000" step="50000000" value="1000000000" aria-label="Slider harga"></div>
      <div class="fr-field"><label for="k-dp">Uang Muka / DP (%)</label><input class="fr-input" id="k-dp" type="number" min="0" max="90" step="1" value="20"><input type="range" id="k-dp-r" min="0" max="90" step="1" value="20" aria-label="Slider DP"><div class="fr-hint" id="k-dp-n"></div></div>
      <div class="fr-krow">
        <div class="fr-field"><label for="k-tenor">Jangka Waktu / Tenor</label><select class="fr-select" id="k-tenor">${[5, 10, 15, 20, 25].map(t => `<option value="${t}"${t === 15 ? ' selected' : ''}>${t} tahun</option>`).join('')}</select></div>
        <div class="fr-field"><label for="k-bunga">Suku Bunga Tahunan (%) — fixed</label><input class="fr-input" id="k-bunga" type="number" min="0" max="30" step="0.1" value="5.5"></div>
      </div>
    </div>
    <div class="fr-kout" aria-live="polite">
      <div><div class="fr-big-l">Estimasi Angsuran / Bulan</div><div class="fr-big" id="k-cicil"></div></div>
      <div class="fr-brk"><div><span>Total Uang Muka (DP)</span><b id="k-dpv"></b></div><div><span>Pokok Pinjaman</span><b id="k-pokok"></b></div><div><span>Total Pembayaran Pinjaman</span><b id="k-total"></b></div></div>
      <a class="fr-btn wa" id="k-wa" href="#" target="_blank" rel="noopener">${ICO.wa}Konsultasi KPR via WhatsApp</a>
    </div>
  </div>
</div></section>

<section class="fr-sec fr-light" id="instagram" data-fr="1"><div class="fr-wrap">
  <div class="fr-head"><div><div class="fr-tag">Media</div><h2 class="fr-h2">Ikuti update &amp; listing terbaru di Instagram</h2></div></div>
  <div class="fr-ig" id="fr-ig">${IG.map(igCard).join('')}</div>
  <div class="fr-center"><a class="fr-btn fr-follow" href="${CFG.IG_URL}" target="_blank" rel="noopener"><img class="fr-follow-ico" src="${U('/__fortis/instagram.png')}" alt="" width="46" height="46"><span class="fr-follow-txt">Follow @${CFG.IG_USER} di Instagram</span><span class="fr-follow-arr" aria-hidden="true"></span></a></div>
</div></section>

<div class="fr-modal" id="fr-modal" role="dialog" aria-modal="true" aria-label="Detail unit"></div>`;
}

/* ---- catalog ---- */
function renderGrid() {
  const list = P.filter(p => (state.type === 'all' || p.type === state.type) && (state.status === 'all' || p.status === state.status) && (state.loc === 'all' || p.loc === state.loc));
  const HOME_MAX = 6, shown = list.slice(0, HOME_MAX);
  $('#fr-count').textContent = list.length > HOME_MAX ? `Menampilkan ${shown.length} dari ${list.length} unit` : `${list.length} unit ditemukan`;
  const lm = $('#fr-loadmore'); if (lm) { lm.parentElement.hidden = list.length <= HOME_MAX; const nn = $('.fr-more-n', lm), v = '+' + (list.length - HOME_MAX); if (nn && nn.textContent !== v) nn.textContent = v; }
  $('#fr-grid').innerHTML = list.length ? shown.map(p => `
  <article class="fr-card"><div class="fr-img" data-detail="${p.id}" role="button" tabindex="0" aria-label="Detail ${esc(p.name)}"><img src="${IMG(p.img)}" alt="${esc(p.name)}" loading="lazy">${p.hot ? '<div class="fr-badges"><span class="fr-badge hot">' + ICO.fire + 'Hot Deal</span></div>' : ''}</div>
    <div class="fr-cbody"><div class="fr-tags"><span>${p.status === 'dijual' ? 'Dijual' : 'Disewa'}</span><span>${esc(p.loc)}</span></div>
    <h3>${esc(p.name)}</h3>
    <div class="fr-pmeta"><div class="fr-pprice">${priceHTML(p)}</div><div class="fr-pspec">${TYPES[p.type]} · ${ukuran(p)}${p.kt ? ' · ' + p.kt + ' KT' : ''}${p.km ? ' · ' + p.km + ' KM' : ''}</div></div>
    <div class="fr-actions"><button class="fr-btn ghost" data-detail="${p.id}">Detail Unit</button><a class="fr-btn wa" target="_blank" rel="noopener" href="${wa(waUnit(p))}">${ICO.wa}<span class="fr-wa-d">Hubungi Sales</span><span class="fr-wa-m">Hubungi Sales</span></a></div></div></article>`).join('')
    : '<div class="fr-empty">Belum ada unit yang cocok dengan filter ini. Coba ubah kriteria pencarian.</div>';
  i18nDom(); observeCardImages();
}



/* ---- catalog photo reveal: the frame opens from the centre towards left and right ---- */
let imgIO;
function observeCardImages() {
  if (REDUCED || !('IntersectionObserver' in window)) return;
  if (!imgIO) imgIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const card = en.target; imgIO.unobserve(card); const el = $('.fr-img', card);
    const i = [...card.parentElement.children].indexOf(card);
    el.classList.remove('fr-clip');
    el.animate([{ clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)' }], { duration: 1100, delay: (i % 2) * 140, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' });
    const im = $('img', el); if (im) im.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 1400, delay: (i % 2) * 140, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('#fr-grid .fr-card').forEach(c => { $('.fr-img', c).classList.add('fr-clip'); imgIO.observe(c); });
  setTimeout(() => $$('.fr-clip').forEach(el => el.classList.remove('fr-clip')), 15000);
}


/* ---- section tags: broken frame whose lines draw around the label whenever it scrolls into view (as in the template's "Kontak" tag) ---- */
let tagIO;
function decorateTags() {
  const tags = $$('.fr-tag').filter(t => !t.dataset.frTag);
  if (!tags.length) return;
  tags.forEach(t => { t.dataset.frTag = '1'; ['b', 'l', 'r', 't'].forEach(k => { const i = document.createElement('i'); i.className = 'fr-tl ' + k; i.setAttribute('aria-hidden', 'true'); t.appendChild(i); }); });
  if (REDUCED || !('IntersectionObserver' in window)) return;
  if (!tagIO) tagIO = new IntersectionObserver(es => es.forEach(en => {
    const t = en.target;
    if (!en.isIntersecting) { t.__played = false; return; }
    if (t.__played) return; t.__played = true;
    const run = (el, prop) => el.animate([{ [prop]: '6px' }, { [prop]: '100%', offset: 0.36 }, { [prop]: '100%', offset: 0.5 }, { [prop]: '6px' }], { duration: 750, delay: 150, easing: 'ease-in-out' });
    run($('.fr-tl.b', t), 'width'); run($('.fr-tl.t', t), 'width'); run($('.fr-tl.l', t), 'height'); run($('.fr-tl.r', t), 'height');
  }), { threshold: 0.9 });
  tags.forEach(t => tagIO.observe(t));
}

/* ---- /project: card photos open from the centre to both sides, like the home catalog ---- */
let pimgIO;
function decorateProjectImages() {
  if (REDUCED || !('IntersectionObserver' in window)) return;
  const cards = $$('a[data-fr-go]').filter(a => !a.dataset.frImg && $('[data-framer-name="Image"]', a));
  if (!cards.length) return;
  if (!pimgIO) pimgIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const a = en.target; pimgIO.unobserve(a); const fr = $('[data-framer-name="Image"]', a); if (!fr) return;
    const i = $$('a[data-fr-go]').indexOf(a);
    fr.classList.remove('fr-pclip');
    fr.animate([{ clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)' }], { duration: 1100, delay: (i % 2) * 140, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'backwards' });
    const im = $('img', fr); if (im) im.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 1400, delay: (i % 2) * 140, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  cards.forEach(a => { a.dataset.frImg = '1'; $('[data-framer-name="Image"]', a).classList.add('fr-pclip'); pimgIO.observe(a); });
  setTimeout(() => $$('.fr-pclip').forEach(el => el.classList.remove('fr-pclip')), 15000);
}
/* ---- scroll reveal (same feel as the template: fade + rise as objects enter the viewport) ---- */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
function riseIn(el, delay = 0) {
  el.animate([{ opacity: 0, transform: 'translateY(48px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay, easing: 'cubic-bezier(.12,.23,.5,1)', fill: 'backwards' });
}
function setupReveal() {
  window.__frRevealReady = true;
  if (REDUCED || !('IntersectionObserver' in window)) return;
  const sel = '#fr-root .fr-tag,#fr-root .fr-h2,#fr-root .fr-lead,#fr-root .fr-filters,#fr-root .fr-list,#fr-root .fr-panel,#fr-root .fr-center,#fr-root .fr-kpr,#fr-root .fr-post,#fr-root .fr-about,#fr-root .fr-astats,#fr-root .fr-acta';
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; io.unobserve(el);
    const sibs = [...el.parentElement.children]; const i = sibs.indexOf(el);
    const cols = el.classList.contains('fr-post') ? 4 : el.classList.contains('fr-card') ? 2 : 1;
    el.classList.remove('fr-rv'); riseIn(el, (i % cols) * 90);
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$(sel).forEach(el => { el.classList.add('fr-rv'); io.observe(el); });
  // never leave content hidden if something goes wrong
  setTimeout(() => $$('.fr-rv').forEach(el => el.classList.remove('fr-rv')), 15000);
}

function galleryOf(p) { const k = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']; return Array.from({ length: 5 }, (_, i) => k[(p.id + i) % 6]); }   // placeholder photos until real unit photos are added
let LB = { list: [], i: 0 };
function openLb(i) {
  const m = $('#fr-lb') || (() => { const d = document.createElement('div'); d.id = 'fr-lb'; d.className = 'fr-lb'; d.innerHTML = '<button class="fr-lb-x" data-lb-x aria-label="Tutup">×</button><button class="fr-lb-n prev" data-lb-n="-1" aria-label="Sebelumnya"></button><img alt=""><button class="fr-lb-n next" data-lb-n="1" aria-label="Berikutnya"></button><div class="fr-lb-c"></div>'; document.body.appendChild(d); return d; })();
  LB.i = (i + LB.list.length) % LB.list.length; $('img', m).src = LB.list[LB.i]; $('.fr-lb-c', m).textContent = (LB.i + 1) + ' / ' + LB.list.length; m.classList.add('open');
}
function closeLb() { const m = $('#fr-lb'); if (m) m.classList.remove('open'); }
function openModal(id) {
  const p = P.find(x => x.id === id); if (!p) return;
  const m = $('#fr-modal'), st = p.status === 'dijual' ? 'Dijual' : 'Disewa';
  const gal = galleryOf(p).map(IMG); LB = { list: gal, i: 0 };
  const rel = P.filter(x => x.id !== p.id).sort((a, b) => (b.type === p.type) - (a.type === p.type) || (b.status === p.status) - (a.status === p.status) || a.id - b.id).slice(0, 3);
  const spec = [['Luas Tanah', p.lt && p.lt + ' m²'], ['Luas Bangunan', p.lb && p.lb + ' m²'], ['Kamar Tidur', p.kt], ['Kamar Mandi', p.km]].filter(x => x[1]);
  m.innerHTML = `<div class="fr-mbar"><button class="fr-back" data-back type="button"><span class="fr-back-i" aria-hidden="true"></span><span data-fr-t>Kembali</span></button><div class="fr-crumb"><a href="${U('/#katalog')}" data-fr-go="/#katalog">Katalog</a><i>/</i><span>${esc(p.name)}</span></div></div>
  <div class="fr-dwrap">
   <div class="fr-dtop">
    <div class="fr-dposter"><img src="${IMG(p.img)}" alt="${esc(p.name)}"></div>
    <div class="fr-dinfo">
      <div class="fr-badges" style="position:static"><span class="fr-badge ${p.status === 'disewa' ? 'rent' : ''}" style="border:1px solid #0f0e0e33">${st}</span>${p.hot ? '<span class="fr-badge hot">' + ICO.fire + 'Hot Deal</span>' : ''}</div>
      <h1 class="fr-dh">${esc(p.name)}</h1><div class="fr-loc" style="margin:0">${ICO.pin}${esc(p.loc)}, ${esc(p.city)}</div>
      <div class="fr-dprice"><div class="fr-price">${priceHTML(p)}</div></div>
      <p class="fr-ddesc">${esc(p.desc)}</p>
      ${spec.length ? `<div class="fr-dspec">${spec.map(([l, v]) => `<div><strong>${v}</strong><span>${l}</span></div>`).join('')}</div>` : ''}
      <div class="fr-dl"><div><b>Tipe</b>${TYPES[p.type]}</div><div><b>Sertifikat</b>${p.cert}</div><div><b>Listrik</b>${p.listrik}</div><div><b>Status</b>${st}</div></div>
      <div class="fr-fac">${p.fac.map(f => `<span>${esc(f)}</span>`).join('')}</div>
      <div class="fr-actions"><button class="fr-btn" data-book="${p.id}">Booking Survey</button>${p.status === 'dijual' ? `<button class="fr-btn" data-kpr="${p.id}">Simulasi KPR unit ini</button>` : ''}<a class="fr-btn wa" target="_blank" rel="noopener" href="${wa(waUnit(p))}">${ICO.wa}Hubungi Sales</a></div>
    </div>
   </div>
   <section class="fr-dsec"><div class="fr-tag">Galeri</div><h2 class="fr-h2">Galeri Properti</h2>
    <div class="fr-gal">${gal.map((g, i) => `<button type="button" class="fr-gal-i g${i}" data-lb="${i}" aria-label="Foto ${i + 1}"><img src="${g}" alt="${esc(p.name)}" loading="lazy"></button>`).join('')}</div></section>
   <section class="fr-dsec"><div class="fr-tag">Rekomendasi</div><h2 class="fr-h2">Properti Lainnya</h2>
    <div class="fr-rel">${rel.map(r => `<a class="fr-rel-i" href="${U('/?unit=' + r.id)}" data-fr-go="/?unit=${r.id}"><div class="fr-rel-img"><img src="${IMG(r.img)}" alt="${esc(r.name)}" loading="lazy"></div><div class="fr-rel-b"><h3>${esc(r.name)}</h3><div class="fr-loc" style="margin:0">${ICO.pin}${esc(r.loc)}</div><div class="fr-rel-p">${priceHTML(r)}</div></div></a>`).join('')}</div></section>
  </div>
  <div class="fr-dbar"><div><small>${p.from ? 'harga mulai' : ''}</small><b>${rp(p.price)}${p.per || ''}</b></div><a class="fr-btn wa" target="_blank" rel="noopener" href="${wa(waUnit(p))}">${ICO.wa}Hubungi Sales</a></div>`;
  i18nDom(); m.classList.add('open'); m.scrollTop = 0; document.documentElement.classList.add('fr-unit-ready'); document.documentElement.style.overflow = 'hidden';
}
function closeModal() { $('#fr-modal').classList.remove('open'); const h = document.documentElement; h.classList.remove('fr-unitpage', 'fr-unit-ready'); h.style.overflow = ''; if (/[?&]unit=/.test(location.search)) history.replaceState(null, '', U('/') + location.hash); }
function goBack() {
  let same = false; try { same = document.referrer && new URL(document.referrer).origin === location.origin; } catch {}
  if (same && history.length > 1) history.back(); else location.href = U('/#katalog');
}

function goTo(id) { const el = document.getElementById(id); if (el) { closeModal(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } else location.href = U('/#' + id); }

/* ---- KPR ---- */
function initKPR() {
  const g = id => $('#' + id);
  const num = s => +String(s).replace(/[^\d]/g, '') || 0;
  function calc() {
    const harga = num(g('k-harga').value);
    const dp = Math.min(90, Math.max(0, parseFloat(g('k-dp').value) || 0));
    const tenor = +g('k-tenor').value, bunga = Math.max(0, parseFloat(g('k-bunga').value) || 0);
    const dpv = harga * dp / 100, pokok = harga - dpv, i = bunga / 100 / 12, n = tenor * 12;
    const cicil = pokok <= 0 ? 0 : i === 0 ? pokok / n : pokok * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = cicil * n;
    g('k-dp-n').textContent = `Nominal DP: ${rp(dpv)}`;
    g('k-cicil').textContent = rp(cicil); g('k-dpv').textContent = rp(dpv); g('k-pokok').textContent = rp(pokok); g('k-total').textContent = rp(total);
    const msg = `Halo Fortis Realty, saya ingin konsultasi KPR. Simulasi saya: Harga properti ${rp(harga)}, DP ${dp}% (${rp(dpv)}), pokok pinjaman ${rp(pokok)}, tenor ${tenor} tahun, bunga ${bunga}% fixed. Estimasi cicilan ${rp(cicil)}/bulan, total pembayaran pinjaman ${rp(total)}.`;
    g('k-wa').href = wa(msg);
  }
  g('k-harga').addEventListener('input', e => { const n = num(e.target.value); e.target.value = n ? rp(n).slice(3) : ''; g('k-harga-r').value = Math.min(Math.max(n, 1e8), 1e10); calc(); });
  g('k-harga-r').addEventListener('input', e => { g('k-harga').value = rp(+e.target.value).slice(3); calc(); });
  g('k-dp').addEventListener('input', e => { g('k-dp-r').value = e.target.value; calc(); });
  g('k-dp-r').addEventListener('input', e => { g('k-dp').value = e.target.value; calc(); });
  g('k-tenor').addEventListener('change', calc); g('k-bunga').addEventListener('input', calc);
  calc();
  window.__frSetKpr = price => { g('k-harga').value = rp(price).slice(3); g('k-harga-r').value = Math.min(Math.max(price, 1e8), 1e10); calc(); };
}

/* ---- mount ---- */

// small line icons for the contact form's service dropdown
const SVC_ICON = (() => {
  const s = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  return {
    'Booking survey unit': s('<rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    'Beli properti': s('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 10v9.500h13V10"/><path d="M10 19.500v-5h4v5"/>'),
    'Sewa properti': s('<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l3 3M14 9l2 2"/>'),
    'Jual / titip jual properti': s('<path d="M3.500 12.500 12 4h8v8l-8.500 8.500z"/><circle cx="16" cy="8" r="1.300"/>'),
    'Konsultasi KPR': s('<rect x="5" y="3" width="14" height="18" rx="1.500"/><path d="M8.500 7h7M8.500 12h.01M12 12h.01M15.500 12h.01M8.500 16h.01M12 16h.01M15.500 16h.01"/>'),
    'Lainnya': s('<circle cx="6" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18" cy="12" r="1"/>')
  };
})();
/* ---- dropdown styled like the template's own dropdown panel (cream panel, uppercase TikTok Sans items) ---- */
function enhanceSelect(sel) {
  if (sel.dataset.frDd) return; sel.dataset.frDd = '1';
  const wrap = document.createElement('div'); wrap.className = 'fr-dd' + (sel.closest('.fr-filters') ? ' inline' : '');
  const btn = document.createElement('button'); btn.type = 'button'; btn.className = sel.className + ' fr-dd-btn'; btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
  const panel = document.createElement('ul'); panel.className = 'fr-dd-panel'; panel.setAttribute('role', 'listbox'); panel.hidden = true;
  const lab = sel.id ? $(`label[for="${sel.id}"]`) : null; if (lab) btn.setAttribute('aria-labelledby', lab.id || (lab.id = sel.id + '-lbl'));
  sel.parentNode.insertBefore(wrap, sel); wrap.append(btn, panel, sel);
  sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true'); sel.classList.add('fr-dd-native');
  const opts = () => [...sel.options];
  let active = -1;
  const sync = () => { const o = sel.options[sel.selectedIndex]; const lbl = o ? o.textContent : ''; if (btn.textContent !== lbl) btn.textContent = lbl; btn.classList.toggle('is-placeholder', !sel.value); $$('li', panel).forEach((li, i) => li.setAttribute('aria-selected', i === sel.selectedIndex)); };
  const rich = !!sel.closest('#fr-contact'); if (rich) wrap.classList.add('rich');
  panel.innerHTML = opts().map((o, i) => `<li role="option" data-i="${i}"${o.value === '' ? ' data-ph="1"' : ''}>${rich && SVC_ICON[o.value] ? `<i aria-hidden="true">${SVC_ICON[o.value]}</i>` : ''}<span>${esc(o.textContent)}</span></li>`).join('');
  const close = () => { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); wrap.classList.remove('open'); active = -1; };
  const open = () => { $$('.fr-dd.open').forEach(w => w !== wrap && $('.fr-dd-btn', w).dispatchEvent(new Event('fr-close'))); panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); wrap.classList.add('open'); active = sel.selectedIndex; mark();
    // open upwards when the panel would be cut off by a clipping ancestor (e.g. the contact card)
    wrap.classList.remove('up');
    { const pr = panel.getBoundingClientRect(); let lim = Infinity;
      for (let a = wrap.parentElement; a && a !== document.body; a = a.parentElement) { if (/(clip|hidden)/.test(getComputedStyle(a).overflowY)) lim = Math.min(lim, a.getBoundingClientRect().bottom); }
      if (pr.bottom > lim && !wrap.classList.contains('rich')) wrap.classList.add('up'); }
    // contact card: the list opens downwards inside the card (pushing the fields below), so make sure it is in view
    if (wrap.classList.contains('rich')) setTimeout(() => panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 30); const li = $$('li', panel)[active]; if (li) li.scrollIntoView({ block: 'nearest' }); };
  const mark = () => $$('li', panel).forEach((li, i) => li.classList.toggle('active', i === active));
  const pick = i => { if (i < 0 || i >= sel.options.length) return; const ch = sel.selectedIndex !== i; sel.selectedIndex = i; sync(); close(); if (ch) { sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); } btn.focus(); };
  btn.addEventListener('click', () => (panel.hidden ? open() : close()));
  btn.addEventListener('fr-close', close);
  panel.addEventListener('click', e => { const li = e.target.closest('li'); if (li) pick(+li.dataset.i); });
  panel.addEventListener('mousemove', e => { const li = e.target.closest('li'); if (li) { active = +li.dataset.i; mark(); } });
  btn.addEventListener('keydown', e => {
    const n = sel.options.length;
    if (e.key === 'Escape') { close(); return; }
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      if (panel.hidden) { open(); return; }
      if (e.key === 'ArrowDown') active = Math.min(n - 1, active + 1); else if (e.key === 'ArrowUp') active = Math.max(0, active - 1); else { pick(active); return; }
      mark(); const li = $$('li', panel)[active]; if (li) li.scrollIntoView({ block: 'nearest' });
    }
  });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
  // keep label in sync when code sets sel.value programmatically (e.g. "Booking Survey" button on a listing)
  const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  Object.defineProperty(sel, 'value', { get() { return d.get.call(sel); }, set(v) { d.set.call(sel, v); sync(); } });
  sync(); DD_SYNC.push(sync);
}

function mount() {
  const hero = $('section[data-framer-name="Hero Section"]');
  if (!hero || $('#katalog')) return false;
  const host = document.createElement('div'); host.id = 'fr-root'; host.innerHTML = sections();
  hero.insertAdjacentElement('afterend', host);
  // keep the template's "Contact us" section (background video + white card); everything else from the old site is hidden
  const cs = $$('section').find(s => /bring your ideas|wujudkan|turn your dream|temukan rumah impian|find your dream home now/i.test(s.textContent));
  let keep = cs; while (keep && keep.parentElement && keep.parentElement !== hero.parentElement) keep = keep.parentElement;
  $$('section').forEach(s => { if (s !== hero && s !== cs && !s.dataset.fr) s.setAttribute('data-fr-hide', ''); });
  [...hero.parentElement.children].forEach(c => { if (c !== hero && c !== host && c !== keep) c.setAttribute('data-fr-hide', ''); });
  if (cs) setupContact(cs);
  renderGrid(); initKPR(); $$('#fr-root select.fr-select, #kontak select.fr-select').forEach(enhanceSelect); decorateTags(); setupReveal(); loadInstagram(); return true;
}

/* ---- contact section (template's "Let's bring your ideas to life" card) -> form that sends to WhatsApp ---- */
const SERVICES = ['Booking survey unit', 'Beli properti', 'Sewa properti', 'Jual / titip jual properti', 'Konsultasi KPR', 'Lainnya'];
function setupContact(sec) {
  sec.id = 'kontak'; sec.style.scrollMarginTop = '0';
  const old = $('form', sec); if (!old || $('#fr-contact', sec)) return;
  old.setAttribute('data-fr-hide', '');
  const f = document.createElement('form'); f.id = 'fr-contact'; f.className = 'fr-cform'; f.noValidate = true;
  f.innerHTML = `
    <div class="fr-field"><label class="fr-sr" for="fc-nama">Nama</label><input class="fr-input" id="fc-nama" name="nama" autocomplete="name" placeholder="Nama Anda"><div class="fr-err"></div></div>
    <div class="fr-field"><label class="fr-sr" for="fc-email">Email</label><input class="fr-input" id="fc-email" name="email" type="email" autocomplete="email" placeholder="Email Anda (opsional)"><div class="fr-err"></div></div>
    <div class="fr-field"><label class="fr-sr" for="fc-hp">Nomor telepon</label><input class="fr-input" id="fc-hp" name="hp" type="tel" inputmode="tel" autocomplete="tel" placeholder="Nomor telepon / WhatsApp Anda"><div class="fr-err"></div></div>
    <div class="fr-field"><label class="fr-sr" for="fc-layanan">Layanan</label><select class="fr-select" id="fc-layanan" name="layanan"><option value="">Pilih layanan…</option>${SERVICES.map(s => `<option value="${s}">${s}</option>`).join('')}</select><div class="fr-err"></div></div>
    <div class="fr-survey" id="fc-survey" hidden>
      <div class="fr-field"><label class="fr-sr" for="fc-unit">Unit properti</label><select class="fr-select" id="fc-unit" name="unit"><option value="">Pilih unit properti…</option>${P.map(p => `<option value="${p.id}">${esc(p.name)} — ${esc(p.loc)} (${p.status})</option>`).join('')}</select><div class="fr-err"></div></div>
      <div class="fr-row2">
        <div class="fr-field"><label class="fr-lab" for="fc-tgl">Tanggal survey</label><input class="fr-input" id="fc-tgl" name="tgl" type="date"><div class="fr-err"></div></div>
        <div class="fr-field"><label class="fr-lab" for="fc-jam">Waktu survey</label><input class="fr-input" id="fc-jam" name="jam" type="time"><div class="fr-err"></div></div>
      </div>
    </div>
    <div class="fr-field"><label class="fr-sr" for="fc-pesan">Pesan</label><textarea class="fr-textarea" id="fc-pesan" name="pesan" placeholder="Tulis pesan atau catatan tambahan (opsional)…"></textarea></div>
    <div><button class="fr-btn" type="submit">Kirim Pesan</button><div class="fr-status" id="fr-cstatus" role="status"></div></div>`;
  old.insertAdjacentElement('afterend', f);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10); f.elements.tgl.min = today;
  const survey = $('#fc-survey', f);
  const toggle = () => { survey.hidden = f.elements.layanan.value !== SERVICES[0]; };
  f.elements.layanan.addEventListener('change', toggle);
  // used by the "Booking Survey" button on listings: preselect service + unit
  window.__frBook = id => { f.elements.layanan.value = SERVICES[0]; toggle(); f.elements.unit.value = String(id); };
  const fail = (name, msg) => { const fld = f.elements[name].closest('.fr-field'); fld.classList.add('bad'); $('.fr-err', fld).textContent = msg; return false; };
  f.addEventListener('input', e => { const fld = e.target.closest('.fr-field'); if (fld) { fld.classList.remove('bad'); const er = $('.fr-err', fld); if (er) er.textContent = ''; } });
  f.addEventListener('submit', e => {
    e.preventDefault(); $$('.fr-field', f).forEach(x => { x.classList.remove('bad'); const er = $('.fr-err', x); if (er) er.textContent = ''; });
    const v = Object.fromEntries(new FormData(f)); let ok = true; const ph = (v.hp || '').replace(/[\s().-]/g, '');
    const isSurvey = v.layanan === SERVICES[0];
    if ((v.nama || '').trim().length < 3) ok = fail('nama', 'Masukkan nama Anda (min. 3 karakter).');
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) ok = fail('email', 'Format email tidak valid.');
    if (!/^\+?\d{9,15}$/.test(ph)) ok = fail('hp', 'Nomor tidak valid, contoh: 0812xxxxxxxx.');
    if (!v.layanan) ok = fail('layanan', 'Pilih layanan yang Anda butuhkan.');
    if (isSurvey) {
      if (!v.unit) ok = fail('unit', 'Pilih unit properti.');
      if (!v.tgl) ok = fail('tgl', 'Pilih tanggal.'); else if (v.tgl < today) ok = fail('tgl', 'Tanggal sudah lewat.');
      if (!v.jam) ok = fail('jam', 'Pilih waktu.');
    }
    if (!ok) { const bad = $('.bad', f); if (bad) bad.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    let msg;
    if (isSurvey) {
      const pr = P.find(x => x.id === +v.unit), [y, m, d] = v.tgl.split('-');
      msg = `Halo Fortis Realty, saya ingin booking jadwal survey lokasi untuk unit ${pr.name} pada tanggal ${d}-${m}-${y} pukul ${v.jam}. Nama: ${v.nama.trim()}.`;
    } else msg = `Halo Fortis Realty, saya ${v.nama.trim()} ingin ${v.layanan.toLowerCase()}.`;
    msg += ` No. HP: ${v.hp.trim()}.`; if (v.email) msg += ` Email: ${v.email.trim()}.`; if ((v.pesan || '').trim()) msg += ` Catatan: ${v.pesan.trim()}`;
    $('#fr-cstatus').textContent = 'Membuka WhatsApp Concierge…'; window.open(wa(msg), '_blank', 'noopener');
  });
}

// Where each menu entry goes is decided by its POSITION (Framer re-renders hovered links and resets href/data attributes)
const WA_GENERAL = () => '/#kontak';
function mobileLinks() {
  return $$('nav a').filter(a => !a.dataset.frLogo && !a.closest('[data-framer-name="Menu Wrapper"]') && !a.closest('.fr-navitem') && (a.getAttribute('data-framer-name') || '') !== 'Desktop');
}
function menuDest(t) {
  if (!t.closest) return null;
  const ma = t.closest('nav a');
  if (ma && !t.closest('[data-framer-name="Menu Wrapper"]') && !ma.dataset.frLogo && ma.getAttribute('data-framer-name') !== 'Desktop') {
    const i = mobileLinks().indexOf(ma);
    if (i >= 0) return ['/#katalog', null, null, '/#kpr', WA_GENERAL()][i] || '/';
  }
  const nv = t.closest('nav [data-framer-name="Menu Wrapper"] > *');
  if (nv) {
    const kids = [...nv.parentElement.children].filter(c => !/gf9md2/.test(c.className));
    return ['/#katalog', null, null, '/#kpr', WA_GENERAL()][kids.indexOf(nv)] || null;
  }
  const fl = t.closest('footer [data-framer-name="Menu List"] > *');
  if (fl) {
    const lists = $$('footer [data-framer-name="Menu List"]');
    const li = lists.indexOf(fl.parentElement), i = [...fl.parentElement.children].indexOf(fl);
    if (li === 0) return ['/#katalog', null, null, '/#kpr'][i] || null;
    if (li === 1) return [wa('Halo Fortis Realty, saya ingin bertanya.'), CFG.IG_URL][i] || null;
  }
  return t.closest('a[data-fr-logo]') ? '/' : null;
}
window.addEventListener('click', e => {
  const t = e.target;
  const ft = t.closest('[data-ft]'), fs = t.closest('[data-fs]');
  if (ft) { state.type = ft.dataset.ft; $$('[data-ft]').forEach(b => b.setAttribute('aria-pressed', b === ft)); renderGrid(); return; }
  if (fs) { state.status = fs.dataset.fs; $$('[data-fs]').forEach(b => b.setAttribute('aria-pressed', b === fs)); renderGrid(); return; }
  const d = t.closest('[data-detail]'); if (d) { e.preventDefault(); location.href = U(`/?unit=${+d.dataset.detail}`); return; }
  const b = t.closest('[data-book]'); if (b) { if (window.__frBook) window.__frBook(b.dataset.book); goTo('kontak'); return; }
  const k = t.closest('[data-kpr]'); if (k) { window.__frSetKpr(P.find(x => x.id === +k.dataset.kpr).price); goTo('kpr'); return; }
  const lbn = t.closest('[data-lb-n]'); if (lbn) { openLb(LB.i + +lbn.dataset.lbN); return; }
  if (t.closest('[data-lb-x]') || t.id === 'fr-lb') { closeLb(); return; }
  const lb = t.closest('[data-lb]'); if (lb) { openLb(+lb.dataset.lb); return; }
  if (t.closest('[data-back]')) { e.preventDefault(); return goBack(); }
  const lg = t.closest && t.closest('[data-lang]');
  if (lg) { e.preventDefault(); e.stopImmediatePropagation(); setLang(lg.dataset.lang); return; }
  const go = t.closest && t.closest('[data-fr-go]');
  if (go) { e.preventDefault(); e.stopImmediatePropagation(); location.href = U(go.dataset.frGo); return; }
  const h = menuDest(t);
  if (h) {
    e.preventDefault(); e.stopImmediatePropagation();
    if (/^https?:/.test(h)) { window.open(h, '_blank', 'noopener'); return; }
    const m = h.match(/^\/#(\w+)$/);
    if (m) { if (document.getElementById(m[1])) goTo(m[1]); else location.href = U(h); } else location.href = U(h);
  }
}, true);
document.addEventListener('change', e => { if (e.target.id === 'fr-loc') { state.loc = e.target.value; renderGrid(); } });
// the first nav item was a dropdown ("Pages") in the template; it is now a plain link, so swallow its hover/focus events
['pointerover', 'pointerenter', 'mouseover', 'mouseenter', 'pointermove', 'mousemove', 'focusin', 'touchstart'].forEach(t =>
  window.addEventListener(t, e => { if (e.target.closest && e.target.closest('nav [class*="gf9md2"]')) e.stopImmediatePropagation(); }, true));
document.addEventListener('keydown', e => { const l = $('#fr-lb.open'); if (l) { if (e.key === 'Escape') closeLb(); else if (e.key === 'ArrowRight') openLb(LB.i + 1); else if (e.key === 'ArrowLeft') openLb(LB.i - 1); return; } if (e.key === 'Escape' && $('#fr-modal.open')) goBack(); });

/* ---- boot: wait for Framer hydration, then keep branding stable ---- */
addEventListener('scroll', () => document.documentElement.classList.toggle('fr-scrolled', scrollY > 30), { passive: true });
let timer;
function apply() {
  try { if (ROUTE() === '/' || ROUTE() === '/index.html') { mount(); brandHero(); } else if (/^\/project\/?$/.test(ROUTE())) brandProjects(); brandChrome(); textSwap(); i18nDom(); document.documentElement.classList.add('fr-ready'); } catch (err) { console.error('[fortis]', err); }
}
if (/[?&]unit=\d+/.test(location.search)) { document.documentElement.classList.add('fr-unitpage'); setTimeout(() => document.documentElement.classList.remove('fr-unitpage'), 8000); }
function boot() {
  setTimeout(() => document.documentElement.classList.add('fr-ready'), 4000);
  setTimeout(() => {
    apply();
    if (location.hash && $(location.hash)) setTimeout(() => $(location.hash).scrollIntoView(), 100);
    const uid = +new URLSearchParams(location.search).get('unit'); if (uid && $('#fr-grid')) setTimeout(() => openModal(uid), 100);
    new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(apply, 40); }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }, 1200);
}
if (document.readyState === 'complete') boot(); else addEventListener('load', boot);
})();
