(function () {
  'use strict';
  const KEY = 'fortis.admin.v1';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const fmt = (n) => Math.round(n).toLocaleString('id-ID');
  const today = () => new Date().toISOString().slice(0, 10);
  const nowStamp = () => { const d = new Date(); return d.toISOString().slice(0, 10) + ' ' + d.toTimeString().slice(0, 5); };
  function compact(n) { const a = Math.abs(n); const f = (x) => String(+x.toFixed(1)).replace('.', ','); if (a >= 1e12) return f(n / 1e12) + ' T'; if (a >= 1e9) return f(n / 1e9) + ' M'; if (a >= 1e6) return f(n / 1e6) + ' jt'; if (a >= 1e3) return f(n / 1e3) + ' rb'; return String(Math.round(n)); }
  const rpc = (n) => 'Rp ' + compact(n);
  function parseBudget(b) { const t = String(b || ''); const n = parseFloat(t.replace(/\./g, '').replace(',', '.').replace(/[^0-9.]/g, '')) || 0; return n * (/\bM\b|miliar/i.test(t) ? 1e9 : /jt|juta/i.test(t) ? 1e6 : /rb|ribu/i.test(t) ? 1e3 : 1); }
  function fdate(s) { if (!s) return '—'; const d = new Date(s + 'T00:00:00'); return isNaN(d) ? s : d.getDate() + ' ' + d.toLocaleString('en-US', { month: 'short' }) + ' ' + d.getFullYear(); }

  /* ---------- constants ---------- */
  const STAGES = [
    { id: 'new', name: 'New', color: '#d8b4fe', label: 'Reservation' },
    { id: 'viewing', name: 'Viewing Scheduled', color: '#fdba74', label: 'Pending' },
    { id: 'negotiation', name: 'Negotiation', color: '#93c5fd', label: 'Reservation' },
    { id: 'legal', name: 'Legal & Documentation', color: '#86efac', label: 'Reservation' },
    { id: 'won', name: 'Closed Won', color: '#5eead4', label: 'Closed' },
  ];
  const COUNTRIES = [{ code: 'ID', name: 'Indonesia', cur: 'IDR', flag: '🇮🇩', rate: 1, pre: 'FRT' }];
  const cc = (code) => COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
  const PRI = { High: 3, Medium: 2, Low: 1 };
  const PAGES = ['properties', 'deals', 'leads', 'tasks', 'contacts', 'messages', 'sales', 'agents', 'funnel', 'integrations', 'settings', 'help'];
  const TITLES = { properties: 'Properties', deals: 'Deals pipeline', leads: 'Leads', tasks: 'Tasks', contacts: 'Contacts', messages: 'Messages', sales: 'Sales Analytics', agents: 'Agent Performance', funnel: 'Conversion Funnel', integrations: 'Link Integration', settings: 'Settings', help: 'Help Center' };

  /* ---------- icons ---------- */
  const ICON = {
    building: '<path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>',
    dollar: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5c-.5-1-1.500-1.500-2.500-1.500-1.500 0-2.500.8-2.500 2s1 1.700 2.500 2 2.500.8 2.500 2-1 2-2.500 2c-1 0-2-.5-2.500-1.500M12 6.500V8M12 16v1.500"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M21 21v-2a4 4 0 0 0-3-3.870M16 3.130a4 4 0 0 1 0 7.750"/>',
    clip: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3h6v3H9zM9 12l2 2 4-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M20 21v-1a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v1"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    chart: '<path d="M3 3v18h18M7 14l4-4 3 3 5-6"/>',
    bar: '<path d="M18 20V10M12 20V4M6 20v-6"/>',
    funnel: '<path d="M22 3H2l8 9.500V19l4 2v-8.500z"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.540.540l3-3a5 5 0 0 0-7.070-7.070l-1.720 1.710M14 11a5 5 0 0 0-7.540-.540l-3 3a5 5 0 0 0 7.070 7.070l1.710-1.710"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.100 9a3 3 0 0 1 5.800 1c0 2-3 3-3 3M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.300-4.300"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.700 21a2 2 0 0 1-3.400 0"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    dots: '<circle cx="5" cy="12" r="1.200" fill="currentColor"/><circle cx="12" cy="12" r="1.200" fill="currentColor"/><circle cx="19" cy="12" r="1.200" fill="currentColor"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    updown: '<path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>',
    kanban: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 7v7M15 7v4"/>',
    table: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    sort: '<path d="M11 5h10M11 9h7M11 13h4M3 17l3 3 3-3M6 18V4"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    grip: '<circle cx="9" cy="6" r="1.300" fill="currentColor"/><circle cx="15" cy="6" r="1.300" fill="currentColor"/><circle cx="9" cy="12" r="1.300" fill="currentColor"/><circle cx="15" cy="12" r="1.300" fill="currentColor"/><circle cx="9" cy="18" r="1.300" fill="currentColor"/><circle cx="15" cy="18" r="1.300" fill="currentColor"/>',
    up: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    dn: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
    menu: '<path d="M3 12h18M3 6h18M3 18h18"/>',
    send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    comment: '<rect x="3" y="4" width="18" height="14" rx="3"/><path d="M8 10h.01M12 10h.01M16 10h.01"/>',
    moon: '<path d="M21 12.800A9 9 0 1 1 11.200 3a7 7 0 0 0 9.800 9.800z"/>',
  };
  const I = (n, sz) => '<svg class="i" width="' + (sz || 16) + '" height="' + (sz || 16) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + (ICON[n] || '') + '</svg>';

  /* ---------- state ---------- */
  let S;
  function load() { try { const r = JSON.parse(localStorage.getItem(KEY)); if (r && r.db && r.db.deals) return r; } catch (e) { /* ignore */ } return null; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ db: S.db, view: S.ui.view, country: S.ui.country })); } catch (e) { /* ignore */ } }
  function init() {
    const st = load();
    S = { db: st ? st.db : clone(window.SEED), ui: { page: 'deals', view: (st && st.view) || 'kanban', country: 'ID', sort: 'manual', propQ: '', propStatus: 'All', propType: 'all', propsState: 'loading', propsError: '', draftPhoto: null, publishing: false, filter: { pri: [], src: '', member: [] }, pop: null, modal: null, q: '', taskTab: 'all', thread: 1, propFilter: 'All', contactQ: '', leadQ: '', faq: 0, menu: false, chatList: false } };
    S.db.integrations = S.db.integrations || clone(window.SEED.integrations);
    S.db.pending = S.db.pending || {}; S.db.published = S.db.published || ''; S.db.properties = S.db.properties || [];
    if (S.db.properties.length) S.ui.propsState = 'ready';
  }
  function resetData() { const keep = { properties: S.db.properties, pending: S.db.pending, published: S.db.published, settings: S.db.settings }; S.db = clone(window.SEED); Object.assign(S.db, keep); S.ui.sort = 'manual'; S.ui.filter = { pri: [], src: '', member: [] }; save(); render(); toast('Demo data restored'); }
  function toast(msg) {
    const r = document.getElementById('toast-root'); const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; r.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }
  function notify(text) { S.db.notifs.unshift({ id: Date.now(), text: text, at: 'Just now', read: false }); S.db.notifs = S.db.notifs.slice(0, 30); }

  /* ---------- visuals (floor plan + building, generated) ---------- */
  function rng(seed) {
    let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    return function () { h = (h + 0x6D2B79F5) >>> 0; let t = h; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function floorPlan(seed) {
    const r = rng(seed + 'f'); const x0 = 20, y0 = 26, w = 120, h = 112; let s = '<svg viewBox="0 0 160 180" preserveAspectRatio="xMidYMid slice"><rect width="160" height="180" fill="#f2f2f1"/>';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + h + '" fill="#fff" stroke="#1f1f1f" stroke-width="2.4"/>';
    for (let i = 0; i < 5; i++) {
      if (r() > 0.5) { const x = x0 + w * (0.2 + r() * 0.6), a = y0, b = y0 + h * (0.4 + r() * 0.6); s += '<path d="M' + x + ' ' + a + 'V' + b + '" stroke="#1f1f1f" stroke-width="2"/>'; }
      else { const y = y0 + h * (0.2 + r() * 0.6), a = x0, b = x0 + w * (0.4 + r() * 0.6); s += '<path d="M' + a + ' ' + y + 'H' + b + '" stroke="#1f1f1f" stroke-width="2"/>'; }
    }
    for (let i = 0; i < 10; i++) { const x = x0 + 6 + r() * (w - 24), y = y0 + 6 + r() * (h - 22); s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (6 + r() * 12).toFixed(1) + '" height="' + (5 + r() * 9).toFixed(1) + '" fill="none" stroke="#777" stroke-width=".8"/>'; }
    for (let i = 0; i < 3; i++) { const x = x0 + 8 + r() * (w - 16), y = y0 + 8 + r() * (h - 16); s += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'a7 7 0 0 1 7 7" fill="none" stroke="#999" stroke-width=".8"/>'; }
    s += '<text x="12" y="168" font-size="8" fill="#b4b4b4" font-family="Inter,sans-serif" font-weight="600">■ Fortis</text></svg>';
    return s;
  }
  function building(seed) {
    const r = rng(seed + 'b'); const k = Math.floor(r() * 3); const id = 'g' + Math.abs(seed.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7)) % 99999;
    let s = '<svg viewBox="0 0 160 180" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (k === 1 ? '#8fb8e8' : '#7db1e6') + '"/><stop offset="1" stop-color="#e6f1fb"/></linearGradient></defs><rect width="160" height="180" fill="url(#' + id + ')"/>';
    if (k === 0) {
      s += '<rect x="46" y="8" width="70" height="172" fill="#4f7396"/><rect x="46" y="8" width="70" height="172" fill="none" stroke="#3a5873" stroke-width="1"/>';
      for (let y = 14; y < 176; y += 9) for (let x = 50; x < 112; x += 8) s += '<rect x="' + x + '" y="' + y + '" width="5.500" height="6" fill="' + (r() > 0.2 ? '#b8d4ea' : '#e8f3fb') + '"/>';
    } else if (k === 1) {
      s += '<rect x="22" y="38" width="124" height="142" fill="#f4efe7"/>';
      for (let y = 46; y < 176; y += 22) { s += '<rect x="18" y="' + y + '" width="132" height="5" fill="#fff"/><rect x="26" y="' + (y + 6) + '" width="116" height="13" fill="#8a7b6a" opacity=".85"/>'; for (let x = 30; x < 138; x += 17) s += '<rect x="' + x + '" y="' + (y + 8) + '" width="10" height="9" fill="#cfe4f3"/>'; }
    } else {
      s += '<rect x="0" y="120" width="160" height="60" fill="#d9c9a3"/><rect x="20" y="82" width="100" height="58" fill="#fbfaf6"/><rect x="14" y="76" width="112" height="8" fill="#e9e3d5"/><rect x="30" y="96" width="30" height="30" fill="#8fb5d4"/><rect x="72" y="96" width="38" height="44" fill="#3a3f46"/>';
      s += '<path d="M138 140C136 110 140 80 138 52" stroke="#6b4f33" stroke-width="3" fill="none"/>';
      for (let i = 0; i < 7; i++) { const a = (i / 7) * Math.PI * 2; s += '<path d="M138 52Q' + (138 + Math.cos(a) * 16) + ' ' + (44 + Math.sin(a) * 10) + ' ' + (138 + Math.cos(a) * 26) + ' ' + (54 + Math.sin(a) * 16) + '" stroke="#2f7a3a" stroke-width="4" fill="none" stroke-linecap="round"/>'; }
    }
    s += '</svg>'; return s;
  }
  const media = (seed) => '<div class="media">' + floorPlan(seed) + building(seed) + '</div>';
  const thumb = (seed) => '<div class="media" style="height:170px">' + floorPlan(seed) + building(seed) + '</div>';

  /* ---------- helpers ---------- */
  const T = (i) => S.db.team.find((t) => t.i === i) || { i: i, name: i, color: '#e5e7eb', fg: '#374151' };
  const av = (i, cls) => { const t = T(i); return '<span class="av ' + (cls || '') + '" style="background:' + t.color + ';color:' + t.fg + '" title="' + esc(t.name) + '">' + esc(i) + '</span>'; };
  const dealMoney = (d) => 'Rp ' + fmt(d.price);
  const stageOf = (id) => STAGES.find((s) => s.id === id) || STAGES[0];
  const dispCur = () => 'IDR';
  const conv = (d) => d.price;
  const inScope = () => S.db.deals;
  function visible() {
    const f = S.ui.filter; let a = inScope().filter((d) => (!f.pri.length || f.pri.includes(d.pri)) && (!f.src || d.source === f.src) && (!f.member.length || f.member.some((m) => d.team.includes(m))));
    const k = S.ui.sort;
    if (k !== 'manual') a = a.slice().sort((x, y) => k === 'price-desc' ? conv(y) - conv(x) : k === 'price-asc' ? conv(x) - conv(y) : k === 'date-asc' ? x.date.localeCompare(y.date) : k === 'date-desc' ? y.date.localeCompare(x.date) : k === 'priority' ? PRI[y.pri] - PRI[x.pri] : x.id.localeCompare(y.id));
    return a;
  }
  const filterCount = () => S.ui.filter.pri.length + (S.ui.filter.src ? 1 : 0) + S.ui.filter.member.length;
  const openTasks = () => S.db.tasks.filter((t) => !t.done).length;
  const unread = () => S.db.threads.reduce((a, t) => a + t.unread, 0);
  const cap = (n) => (n > 99 ? '99+' : n);
  function stats() {
    const ds = inScope(); const act = ds.filter((d) => d.stage !== 'won'); const vol = act.reduce((a, d) => a + conv(d), 0);
    const won = ds.filter((d) => d.stage === 'won');
    const days = won.map((d) => Math.max(1, Math.round((new Date(d.date) - new Date(d.created)) / 864e5)));
    return {
      vol: vol, com: vol * 0.02,
      view: ds.filter((d) => d.stage !== 'new').length, offers: ds.filter((d) => ['negotiation', 'legal', 'won'].includes(d.stage)).length,
      days: days.length ? Math.round(days.reduce((a, b) => a + b, 0) / days.length) : 0,
      win: ds.length ? Math.round((won.length / ds.length) * 100) : 0,
    };
  }
  const chip = (v) => '<span class="chip ' + (v >= 0 ? 'up' : 'dn') + '">' + I(v >= 0 ? 'up' : 'dn', 11) + Math.abs(v) + '%</span>';
  function nextId(code) { const c = cc(code); let m = 100; S.db.deals.forEach((d) => { if (d.id.indexOf(c.pre) === 1) m = Math.max(m, parseInt(d.id.split('-')[1], 10) || 0); }); return '#' + c.pre + '-' + String(m + 1).padStart(5, '0'); }
  const nextNum = (arr) => arr.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;

  /* ---------- views ---------- */
  function layout() {
    const u = S.db.settings; const p = S.ui.pop; const ct = S.ui.country === 'ALL' ? { flag: '🌍', name: 'All countries' } : cc(S.ui.country);
    const nb = (page, ic, label, extra) => '<button class="nav ' + (S.ui.page === page ? 'on' : '') + '" data-action="nav" data-page="' + page + '">' + I(ic, 17) + '<span class="lbl">' + label + '</span>' + (extra || '') + '</button>';
    const conn = S.db.integrations.filter((x) => x.on);
    const ints = '<span class="ints">' + conn.slice(0, 3).map((x) => '<span style="background:' + x.color + '">' + esc(x.name[0]) + '</span>').join('') + (conn.length > 3 ? '<span class="more">+' + (conn.length - 3) + '</span>' : '') + '</span>';
    const dc = changeCount(), t = openTasks(), un = unread(), nun = S.db.notifs.filter((n) => !n.read).length;
    return '<div class="app ' + (S.ui.menu ? 'menu' : '') + '"><header class="top">' +
      '<div class="top-l"><button class="btn icon-btn menu-btn" data-action="menu">' + I('menu') + '</button><div class="logo"><img src="../__fortis/favicon.png" alt="" onerror="this.replaceWith(\'F\')"></div>' +
      '<div class="pop-wrap" style="flex:1;min-width:0"><button class="user" data-action="pop" data-pop="user">' + av(u.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), 'r') + '<span class="nm">' + esc(u.name) + '</span>' + I('updown', 14) + '</button>' +
      (p === 'user' ? '<div class="pop l" style="min-width:240px"><div class="pad"><b>' + esc(u.name) + '</b><div class="muted">' + esc(u.email) + '</div></div><h6>Workspace</h6><button class="it on">' + esc(u.workspace) + '<span class="ck">' + I('check') + '</span></button><h6>Account</h6><button class="it" data-action="nav" data-page="settings">' + I('sliders') + ' Settings</button><button class="it" data-action="theme">' + I('moon') + ' ' + (u.theme === 'dark' ? 'Light mode' : 'Dark mode') + '</button><button class="it" data-action="nav" data-page="help">' + I('help') + ' Help Center</button></div>' : '') + '</div></div>' +
      '<div class="top-search"><div class="box">' + I('search') + '<input id="gs" placeholder="Search by client, phone or property ID" value="' + esc(S.ui.q) + '" autocomplete="off"><span class="kbd">⌘K</span></div><div class="sr" id="sr"></div></div>' +
      '<div class="top-r">' + (dc ? '<button class="btn sm warn" data-action="nav" data-page="properties">● ' + dc + ' unpublished</button>' : '') + '<a class="btn" href="../" target="_blank" rel="noopener">' + I('globe') + ' <span class="nm">View site</span></a>' +
      '<div class="pop-wrap"><button class="btn icon-btn" data-action="pop" data-pop="notif" aria-label="Notifications">' + I('bell') + (nun ? '<span class="dot-n"></span>' : '') + '</button>' +
      (p === 'notif' ? '<div class="pop" style="min-width:340px"><h6>Notifications</h6>' + S.db.notifs.slice(0, 8).map((n) => '<div class="notif ' + (n.read ? '' : 'un') + '"><div><p>' + esc(n.text) + '</p><small>' + esc(n.at) + '</small></div></div>').join('') + '<div class="pad" style="padding-top:8px"><button class="btn sm" data-action="read-all">Mark all as read</button></div></div>' : '') + '</div>' +
      '<div class="pop-wrap"><button class="btn icon-btn" data-action="pop" data-pop="more" aria-label="More">' + I('dots') + '</button>' +
      (p === 'more' ? '<div class="pop"><button class="it" data-action="export-csv">' + I('download') + ' Export deals (CSV)</button><button class="it" data-action="export-json">' + I('download') + ' Backup data (JSON)</button><button class="it" data-action="theme">' + I('moon') + ' Toggle dark mode</button><button class="it" data-action="reset" style="color:var(--red)">' + I('trash') + ' Reset demo data</button></div>' : '') + '</div></div></header>' +
      '<aside class="side"><div class="sec">CRM</div>' + nb('properties', 'building', 'Properties') + nb('deals', 'dollar', 'Deals') + nb('leads', 'users', 'Leads') +
      nb('tasks', 'clip', 'Tasks', t ? '<span class="badge o">' + cap(t) + '</span>' : '') + nb('contacts', 'user', 'Contacts') + nb('messages', 'msg', 'Messages', un ? '<span class="badge o">' + cap(un) + '</span>' : '') +
      '<div class="sec">ANALYTICS</div>' + nb('sales', 'chart', 'Sales Analytics', '<span class="tag">BETA</span>') + nb('agents', 'bar', 'Agent Performance') + nb('funnel', 'funnel', 'Conversion Funnel') +
      '<div class="spacer"></div><div class="sec">SYSTEM SETTINGS</div>' + nb('integrations', 'link', 'Link Integration', ints) + nb('settings', 'sliders', 'Settings') + nb('help', 'help', 'Help Center') + '</aside>' +
      '<main class="content" id="content">' + page() + '</main></div>' + modal();
  }
  function page() {
    return ({ properties: pProps, deals: pDeals, leads: pLeads, tasks: pTasks, contacts: pContacts, messages: pMessages, sales: pSales, agents: pAgents, funnel: pFunnel, integrations: pInteg, settings: pSettings, help: pHelp }[S.ui.page] || pDeals)();
  }
  const head = (title, right, sub) => '<div class="page-head"><div><h1>' + title + '</h1>' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div><div class="head-r">' + (right || '') + '</div></div>';

  /* deals */
  function teamStack() {
    const t = S.db.team; const shown = t.slice(0, 4);
    return '<div class="stack">' + shown.map((m) => av(m.i, 'r')).join('') + (t.length > 4 ? '<span class="av more r">+' + (t.length - 4) + '</span>' : '') + '</div>';
  }
  function pDeals() {
    const s = stats(); const cur = dispCur();
    const sc = (l, v, d) => '<div class="sc"><div class="l">' + l + '</div><div class="v">' + v + '</div><div class="d">' + chip(d) + 'vs last month</div></div>';
    const grp = (t, a, b) => '<div class="sg"><h3>' + t + I('info', 15) + '</h3><div class="pair">' + a + b + '</div></div>';
    const U = S.ui;
    const popSort = U.pop === 'sort' ? '<div class="pop"><h6>Sort by</h6>' + [['manual', 'Manual'], ['price-desc', 'Price: high to low'], ['price-asc', 'Price: low to high'], ['date-asc', 'Date: earliest'], ['date-desc', 'Date: latest'], ['priority', 'Priority'], ['id', 'Deal ID']].map((o) => '<button class="it ' + (U.sort === o[0] ? 'on' : '') + '" data-action="sort" data-k="' + o[0] + '">' + o[1] + (U.sort === o[0] ? '<span class="ck">' + I('check') + '</span>' : '') + '</button>').join('') + '</div>' : '';
    const srcs = Array.from(new Set(S.db.deals.map((d) => d.source))).sort();
    const popFilter = U.pop === 'filter' ? '<div class="pop" style="min-width:260px"><h6>Priority</h6><div class="pad">' + ['High', 'Medium', 'Low'].map((p) => '<label class="chk"><input type="checkbox" data-change="f-pri" value="' + p + '" ' + (U.filter.pri.includes(p) ? 'checked' : '') + '> ' + p + '</label>').join('') + '</div><h6>Source</h6><div class="pad"><select class="f" data-change="f-src"><option value="">All sources</option>' + srcs.map((x) => '<option ' + (U.filter.src === x ? 'selected' : '') + '>' + esc(x) + '</option>').join('') + '</select></div><h6>Assigned to</h6><div class="pad">' + S.db.team.map((m) => '<label class="chk"><input type="checkbox" data-change="f-mem" value="' + m.i + '" ' + (U.filter.member.includes(m.i) ? 'checked' : '') + '> ' + av(m.i) + ' ' + esc(m.name) + '</label>').join('') + '</div><div class="pad"><button class="btn sm" data-action="f-clear">Clear filters</button></div></div>' : '';
    let body;
    const vis = visible();
    if (U.view === 'kanban') body = '<div class="board">' + STAGES.map((st) => col(st, vis.filter((d) => d.stage === st.id))).join('') + '</div>';
    else if (U.view === 'table') body = dealTable(vis);
    else body = STAGES.map((st) => { const a = vis.filter((d) => d.stage === st.id); return '<div class="lgroup"><h3><span class="dot" style="width:8px;height:8px;border-radius:50%;background:' + st.color + '"></span>' + st.name + ' <span class="muted">' + a.length + '</span></h3>' + (a.length ? a.map((d) => '<div class="lrow" data-action="open-deal" data-id="' + esc(d.id) + '"><span class="id">' + esc(d.id) + '</span><span class="tt">' + esc(d.title) + '</span><span class="pri-b pri-' + d.pri + '">' + d.pri + '</span><span class="muted" style="width:130px">' + esc(d.client) + '</span><span class="pr">' + dealMoney(d) + '</span></div>').join('') : '<div class="muted" style="padding:4px 2px 8px">No deals</div>') + '</div>'; }).join('');
    return head('Deals pipeline', teamStack() + '<button class="btn" data-action="modal" data-m="invite">' + I('plus') + ' Invite Member</button>') +
      '<div class="stats">' + grp('Pipeline Value', sc('Total Asset Volume', rpc(s.vol), 14), sc('Commission', rpc(s.com), 5)) +
      grp('Deal Activity', sc('Viewings Booked', s.view, 12), sc('Offers Sent', s.offers, -20)) + grp('Conversion & Speed', sc('Avg. Days to Close', s.days, 5), sc('Win Rate', s.win + '%', 2)) + '</div>' +
      '<div class="toolbar"><div class="l"><button class="btn" data-action="modal" data-m="deal" data-stage="new">' + I('plus') + ' New Deals</button><div class="seg">' + [['kanban', 'kanban'], ['table', 'table'], ['list', 'list']].map((v) => '<button class="' + (U.view === v[0] ? 'on' : '') + '" data-action="view" data-v="' + v[0] + '" title="' + v[0] + '">' + I(v[1]) + '</button>').join('') + '</div></div>' +
      '<div class="r"><div class="pop-wrap"><button class="btn" data-action="pop" data-pop="sort">' + I('sort') + ' Sort' + (U.sort !== 'manual' ? ' <span class="badge">1</span>' : '') + '</button>' + popSort + '</div><div class="pop-wrap"><button class="btn" data-action="pop" data-pop="filter">' + I('funnel') + ' Filter' + (filterCount() ? ' <span class="badge">' + filterCount() + '</span>' : '') + '</button>' + popFilter + '</div></div></div>' + body;
  }
  function col(st, ds) {
    return '<section class="col" data-stage="' + st.id + '" style="--cc:' + st.color + '"><div class="col-h"><span class="dot"></span><span>' + st.name + '</span><span class="ct">' + ds.length + '</span><button class="ib" data-action="modal" data-m="deal" data-stage="' + st.id + '" title="Add deal">' + I('plus') + '</button><button class="ib" data-action="col-sort" data-stage="' + st.id + '" title="Sort this column by price">' + I('dots') + '</button></div>' +
      (ds.length ? ds.map(card).join('') : '<div class="col-empty">Drop deals here</div>') + '</section>';
  }
  function card(d) {
    const st = stageOf(d.stage);
    return '<article class="card" draggable="true" data-action="open-deal" data-id="' + esc(d.id) + '"><div class="card-top"><span class="muted">' + esc(d.id) + '</span><span class="pri-b pri-' + d.pri + '">' + d.pri + '</span><span class="grip">' + I('grip', 16) + '</span></div>' + dealMedia(d) +
      '<h4>' + esc(d.title) + '</h4><div class="price">' + dealMoney(d) + '</div>' +
      '<div class="kv"><span class="k">' + I('cal', 15) + st.label + '</span><span class="v">' + fdate(d.date) + '</span></div>' +
      '<div class="kv"><span class="k">' + I('user', 15) + 'Client</span><span class="v">' + esc(d.client) + '</span></div>' +
      '<div class="kv"><span class="k">' + I('globe', 15) + 'Source</span><span class="v">' + esc(d.source) + '</span></div>' +
      '<div class="card-f"><div class="stack" style="margin-left:0">' + d.team.map((m) => av(m)).join('') + '</div><div class="m"><span>' + I('comment', 14) + (d.cb + d.comments.length) + ' Comments</span><span>' + I('file', 14) + d.files + ' Files</span></div></div></article>';
  }
  function dealTable(ds) {
    return '<table class="tbl"><thead><tr><th>ID</th><th>Property</th><th>Client</th><th>Stage</th><th>Priority</th><th>Price</th><th>Date</th><th>Source</th></tr></thead><tbody>' +
      (ds.length ? ds.map((d) => { const st = stageOf(d.stage); return '<tr class="click" data-action="open-deal" data-id="' + esc(d.id) + '"><td class="muted nowrap">' + esc(d.id) + '</td><td class="t">' + esc(d.title) + '</td><td class="nowrap">' + esc(d.client) + '</td><td><span class="pill" style="--cc:' + st.color + '"><span class="dot"></span>' + st.name + '</span></td><td><span class="pri-b pri-' + d.pri + '">' + d.pri + '</span></td><td class="nowrap"><b style="font-weight:600">' + dealMoney(d) + '</b></td><td class="nowrap">' + fdate(d.date) + '</td><td class="muted">' + esc(d.source) + '</td></tr>'; }).join('') : '<tr><td colspan="8" class="empty">No deals match your filters</td></tr>') + '</tbody></table>';
  }

  /* properties (the same list the landing page shows) */
  const propImg = (q) => S.db.pending[q.img] || ('../__fortis/img/' + q.img + '.webp');
  function dealMedia(d) { const q = S.db.properties.find((x) => x.id === d.propId); return q ? '<div class="media photo"><img src="' + propImg(q) + '" alt="" loading="lazy"></div>' : media(d.id); }
  const TYPE_LABEL = { rumah: 'Rumah', ruko: 'Ruko', apartemen: 'Apartemen', tanah: 'Tanah/Kavling' };
  function pProps() {
    const U = S.ui, st = U.propsState;
    const dc = changeCount(); const all = S.db.properties; const q = U.propQ.toLowerCase();
    const a = all.filter((x) => (U.propStatus === 'All' || x.status === U.propStatus.toLowerCase()) && (U.propType === 'all' || x.type === U.propType) && (!q || (x.name + x.loc + x.city).toLowerCase().includes(q)));
    const cnt = (f) => all.filter((x) => f === 'All' || x.status === f.toLowerCase()).length;
    const right = '<button class="btn" data-action="prop-reload" ' + (U.publishing ? 'disabled' : '') + '>' + I('download') + ' Reload from website</button>' +
      '<button class="btn pri" data-action="publish" ' + (!dc || U.publishing ? 'disabled style="opacity:.5;cursor:not-allowed"' : '') + '>' + (U.publishing ? 'Publishing…' : 'Publish to website' + (dc ? ' (' + dc + ')' : '')) + '</button><button class="btn" data-action="prop-new">' + I('plus') + ' Add property</button>';
    let body;
    if (st === 'loading' && !all.length) body = '<div class="empty">Loading listings from the website…</div>';
    else if (st === 'error' && !all.length) body = '<div class="empty">Could not load the listings (' + esc(U.propsError) + ').<br><button class="btn" style="margin-top:12px" data-action="prop-reload">Try again</button></div>';
    else body = '<div class="toolbar"><div class="l"><div class="tabs" style="margin:0">' + ['All', 'Dijual', 'Disewa'].map((x) => '<button class="' + (U.propStatus === x ? 'on' : '') + '" data-action="prop-filter" data-f="' + x + '">' + x + ' (' + cnt(x) + ')</button>').join('') + '</div></div>' +
      '<div class="r"><select class="f" data-change="prop-type" style="width:170px"><option value="all">All types</option>' + Object.keys(TYPE_LABEL).map((k) => '<option value="' + k + '" ' + (U.propType === k ? 'selected' : '') + '>' + TYPE_LABEL[k] + '</option>').join('') + '</select><input class="f" id="propq" data-live="propQ" placeholder="Search listings…" value="' + esc(U.propQ) + '" style="width:220px"></div></div>' +
      (a.length ? '<div class="grid">' + a.map((x) => '<div class="pcard"><div class="pphoto"><img src="' + propImg(x) + '" alt="" loading="lazy">' + (x.hot ? '<span class="hot">Hot</span>' : '') + '<span class="pill s-' + (x.status === 'dijual' ? 'Available' : 'Reserved') + '">' + (x.status === 'dijual' ? 'Dijual' : 'Disewa') + '</span>' + (S.db.pending[x.img] ? '<span class="newph">new photo</span>' : '') + '</div><h4>' + esc(x.name) + '</h4><div class="meta">' + esc(x.loc) + ', ' + esc(x.city) + ' · ' + (TYPE_LABEL[x.type] || x.type) + '</div><div class="meta" style="margin-top:-6px">' + [x.lt ? 'LT ' + x.lt + ' m²' : '', x.lb ? 'LB ' + x.lb + ' m²' : '', x.kt ? x.kt + ' KT' : '', x.km ? x.km + ' KM' : ''].filter(Boolean).join(' · ') + '</div><div class="pf"><b>Rp ' + fmt(x.price) + '</b><span class="muted">' + (x.per ? esc(x.per) : x.from ? 'mulai' : '') + '</span></div><div class="pact"><button class="btn sm" data-action="prop-edit" data-id="' + x.id + '">Edit</button><button class="btn sm" data-action="prop-deal" data-id="' + x.id + '">' + I('plus', 14) + ' Deal</button><button class="btn sm" data-action="prop-top" data-id="' + x.id + '" title="Show first on the website">' + I('up', 14) + '</button><button class="btn sm danger" data-action="prop-del" data-id="' + x.id + '">' + I('trash', 14) + '</button></div></div>').join('') + '</div>' : '<div class="empty">No properties match</div>');
    const banner = dc ? '<div class="banner">● ' + changeSummary() + ' — not on the website yet. Click <b>Publish to website</b> to make it live.</div>' : '';
    return head('Properties', right, all.length + ' listings on fortis.frel.cloud · the same list as the landing page') + banner + body;
  }
  /* leads */
  function pLeads() {
    const q = S.ui.leadQ.toLowerCase(); const a = S.db.leads.filter((l) => !q || (l.name + l.phone + l.interest + l.source).toLowerCase().includes(q));
    return head('Leads', '<input class="f" id="leadq" data-live="leadQ" placeholder="Search leads…" value="' + esc(S.ui.leadQ) + '" style="width:220px"><button class="btn pri" data-action="modal" data-m="lead">' + I('plus') + ' Add lead</button>', S.db.leads.length + ' leads · ' + S.db.leads.filter((l) => l.status === 'New').length + ' new') +
      '<table class="tbl"><thead><tr><th>Name</th><th>Interest</th><th>Budget</th><th>Source</th><th>Agent</th><th>Status</th><th></th></tr></thead><tbody>' +
      (a.length ? a.map((l) => '<tr><td><b style="font-weight:600">' + esc(l.name) + '</b><div class="muted">' + esc(l.phone) + '</div></td><td>' + esc(l.interest) + '</td><td class="nowrap">' + esc(l.budget) + '</td><td class="muted">' + esc(l.source) + '</td><td>' + av(l.agent) + '</td><td><select class="f" style="height:30px;width:120px" data-change="lead-status" data-id="' + l.id + '">' + ['New', 'Contacted', 'Qualified', 'Lost'].map((s) => '<option ' + (l.status === s ? 'selected' : '') + '>' + s + '</option>').join('') + '</select></td><td class="nowrap" style="text-align:right"><button class="btn sm" data-action="lead-convert" data-id="' + l.id + '">Convert to deal</button> <button class="btn sm icon-btn danger" style="width:30px" data-action="lead-del" data-id="' + l.id + '">' + I('trash', 14) + '</button></td></tr>').join('') : '<tr><td colspan="7" class="empty">No leads found</td></tr>') + '</tbody></table>';
  }
  /* tasks */
  function pTasks() {
    const tab = S.ui.taskTab; const a = S.db.tasks.filter((t) => tab === 'all' || (tab === 'open' ? !t.done : t.done)).sort((x, y) => x.done - y.done || x.due.localeCompare(y.due));
    return head('Tasks', '', openTasks() + ' open · ' + S.db.tasks.filter((t) => t.done).length + ' done') +
      '<form class="inline-form" data-form="task"><input class="f" name="title" placeholder="Add a task…" required><input class="f" type="date" name="due" value="' + today() + '" style="width:160px;flex:none"><select class="f" name="pri" style="width:120px;flex:none"><option>Low</option><option selected>Medium</option><option>High</option></select><button class="btn pri">' + I('plus') + ' Add task</button></form>' +
      '<div class="tabs">' + [['all', 'All'], ['open', 'Open'], ['done', 'Done']].map((x) => '<button class="' + (tab === x[0] ? 'on' : '') + '" data-action="task-tab" data-t="' + x[0] + '">' + x[1] + '</button>').join('') + '</div>' +
      '<div class="tlist">' + (a.length ? a.map((t) => '<div class="task ' + (t.done ? 'done' : '') + '"><input type="checkbox" data-change="task-toggle" data-id="' + t.id + '" ' + (t.done ? 'checked' : '') + '><span class="tt">' + esc(t.title) + '</span><span class="pri-b pri-' + t.pri + '">' + t.pri + '</span><span class="' + (!t.done && t.due < today() ? 'over-due' : 'muted') + '" style="width:100px;text-align:right">' + fdate(t.due) + '</span><button class="btn sm icon-btn danger" style="width:30px" data-action="task-del" data-id="' + t.id + '">' + I('trash', 14) + '</button></div>').join('') : '<div class="empty">Nothing here</div>') + '</div>';
  }
  /* contacts */
  function pContacts() {
    const q = S.ui.contactQ.toLowerCase(); const a = S.db.contacts.filter((c) => !q || (c.name + c.phone + c.email + c.company).toLowerCase().includes(q));
    return head('Contacts', '<input class="f" id="contactq" data-live="contactQ" placeholder="Search contacts…" value="' + esc(S.ui.contactQ) + '" style="width:220px"><button class="btn pri" data-action="modal" data-m="contact">' + I('plus') + ' Add contact</button>', S.db.contacts.length + ' contacts') +
      '<table class="tbl"><thead><tr><th>Name</th><th>Company</th><th>Phone</th><th>Email</th><th>Type</th><th></th></tr></thead><tbody>' +
      (a.length ? a.map((c) => '<tr><td><div style="display:flex;gap:10px;align-items:center">' + '<span class="av lg" style="background:#e0e7ff;color:#3e5bf6">' + esc(c.name.split(' ').map((w) => w[0]).join('').slice(0, 2)) + '</span><div><b style="font-weight:600">' + esc(c.name) + '</b><div class="muted">' + esc(c.country) + '</div></div></div></td><td>' + esc(c.company) + '</td><td class="nowrap">' + esc(c.phone) + '</td><td>' + esc(c.email) + '</td><td><span class="pill s-' + esc(c.type) + '">' + esc(c.type) + '</span></td><td style="text-align:right"><button class="btn sm icon-btn danger" style="width:30px" data-action="contact-del" data-id="' + c.id + '">' + I('trash', 14) + '</button></td></tr>').join('') : '<tr><td colspan="6" class="empty">No contacts found</td></tr>') + '</tbody></table>';
  }
  /* messages */
  function pMessages() {
    const th = S.db.threads.find((t) => t.id === S.ui.thread) || S.db.threads[0];
    return head('Messages', '', unread() + ' unread') +
      '<div class="msgs ' + (S.ui.chatList ? 'list' : '') + '"><div class="tl">' + S.db.threads.map((t) => '<button class="' + (th && th.id === t.id ? 'on' : '') + '" data-action="thread" data-id="' + t.id + '"><span class="av lg" style="background:#e0e7ff;color:#3e5bf6">' + esc(t.name.split(' ').map((w) => w[0]).join('').slice(0, 2)) + '</span><div class="bx"><div class="nm">' + esc(t.name) + '</div><div class="pv">' + esc(t.msgs[t.msgs.length - 1].text) + '</div></div>' + (t.unread ? '<span class="badge o">' + t.unread + '</span>' : '') + '</button>').join('') + '</div>' +
      (th ? '<div class="chat"><div class="chat-h"><button class="btn sm menu-btn" data-action="chat-back">←</button>' + esc(th.name) + '</div><div class="chat-b" id="chatb">' + th.msgs.map((m) => '<div class="bub ' + m.from + '">' + esc(m.text) + '<small>' + esc(m.at) + '</small></div>').join('') + '</div><form class="chat-f" data-form="msg"><input class="f" name="text" placeholder="Write a message…" autocomplete="off" required><button class="btn pri">' + I('send') + ' Send</button></form></div>' : '<div class="empty">No conversations</div>') + '</div>';
  }
  /* analytics */
  function pSales() {
    const ds = inScope(); const won = ds.filter((d) => d.stage === 'won'); const rev = won.reduce((a, d) => a + conv(d), 0); const tot = ds.reduce((a, d) => a + conv(d), 0);
    const cur = dispCur(); const scale = S.ui.country === 'ALL' || S.ui.country === 'AE' ? 1 : 0; const mo = S.db.months.slice(); const nowM = won.filter((d) => d.date >= '2026-11-01').reduce((a, d) => a + conv(d), 0) / 1e9;
    mo.push(['Nov', +nowM.toFixed(1)]); const mx = Math.max.apply(null, mo.map((m) => m[1]).concat([1]));
    const bars = mo.map((m, i) => { const h = (m[1] / mx) * 170, x = 30 + i * 74; return '<rect x="' + x + '" y="' + (200 - h) + '" width="44" height="' + h + '" rx="8" fill="' + (i === mo.length - 1 ? '#3e5bf6' : '#c7d0fb') + '"/><text x="' + (x + 22) + '" y="222" text-anchor="middle" font-size="12" fill="#667085">' + m[0] + '</text><text x="' + (x + 22) + '" y="' + (192 - h) + '" text-anchor="middle" font-size="11" fill="#0b0d12" font-weight="600">' + m[1] + ' M</text>'; }).join('');
    const bySrc = {}; ds.forEach((d) => { bySrc[d.source] = (bySrc[d.source] || 0) + conv(d); }); const srcs = Object.keys(bySrc).sort((a, b) => bySrc[b] - bySrc[a]).slice(0, 6); const smx = Math.max.apply(null, srcs.map((s) => bySrc[s]).concat([1]));
    const kp = (l, v) => '<div class="sc"><div class="l">' + l + '</div><div class="v">' + v + '</div></div>';
    const top = ds.slice().sort((a, b) => conv(b) - conv(a)).slice(0, 5);
    return head('Sales Analytics <span class="tag">BETA</span>', '', 'All figures in Rupiah') +
      '<div class="kpis">' + kp('Closed revenue', rpc(rev)) + kp('Pipeline value', rpc(tot - rev)) + kp('Avg. deal size', rpc(ds.length ? tot / ds.length : 0)) + kp('Deals won', won.length + ' / ' + ds.length) + '</div>' +
      '<div class="two"><div class="panel"><h3>Revenue by month (miliar Rp)</h3><svg viewBox="0 0 560 235" width="100%"><path d="M20 200H540" stroke="#e7e9ee"/>' + bars + '</svg></div><div class="panel"><h3>Volume by source</h3>' + srcs.map((s, i) => '<div class="hbar"><div class="t"><span>' + esc(s) + '</span><b style="font-weight:600">' + compact(bySrc[s]) + '</b></div><div class="bar"><i style="width:' + (bySrc[s] / smx) * 100 + '%;--c:' + ['#3e5bf6', '#22c3a6', '#f5a524', '#ef5da8', '#8b5cf6', '#0ea5e9'][i % 6] + '"></i></div></div>').join('') + '</div></div>' +
      '<div class="panel"><h3>Top deals</h3><table class="tbl" style="border:0;box-shadow:none"><tbody>' + top.map((d) => '<tr class="click" data-action="open-deal" data-id="' + esc(d.id) + '"><td class="muted">' + esc(d.id) + '</td><td>' + esc(d.title) + '</td><td>' + esc(d.client) + '</td><td style="text-align:right"><b style="font-weight:600">' + dealMoney(d) + '</b></td></tr>').join('') + '</tbody></table></div>' + (scale ? '' : '');
  }
  function pAgents() {
    const ds = inScope(); const rows = S.db.team.map((m) => { const mine = ds.filter((d) => d.team.includes(m.i)); const won = mine.filter((d) => d.stage === 'won'); return { m: m, n: mine.length, won: won.length, rev: won.reduce((a, d) => a + conv(d), 0), pipe: mine.filter((d) => d.stage !== 'won').reduce((a, d) => a + conv(d), 0), rate: mine.length ? Math.round((won.length / mine.length) * 100) : 0, tasks: S.db.tasks.filter((t) => t.done).length }; });
    const mxp = Math.max.apply(null, rows.map((r) => r.pipe).concat([1]));
    return head('Agent Performance', '', 'Deals each team member is assigned to') +
      '<table class="tbl"><thead><tr><th>Agent</th><th>Deals</th><th>Won</th><th>Win rate</th><th>Closed revenue</th><th style="width:28%">Open pipeline</th></tr></thead><tbody>' + rows.map((r) => '<tr><td><div style="display:flex;gap:10px;align-items:center">' + av(r.m.i, 'lg') + '<b style="font-weight:600">' + esc(r.m.name) + '</b></div></td><td>' + r.n + '</td><td>' + r.won + '</td><td>' + r.rate + '%</td><td class="nowrap">' + rpc(r.rev) + '</td><td><div class="hbar" style="margin:0"><div class="t"><span></span><b style="font-weight:600">' + compact(r.pipe) + '</b></div><div class="bar"><i style="width:' + (r.pipe / mxp) * 100 + '%"></i></div></div></td></tr>').join('') + '</tbody></table>';
  }
  function pFunnel() {
    const ds = inScope(); const cnt = (ids) => ds.filter((d) => ids.includes(d.stage)).length;
    const leads = S.db.leads.length + ds.length; const steps = [['Leads', leads, '#c7d0fb'], ['Deals created', ds.length, '#d8b4fe'], ['Viewing scheduled', cnt(['viewing', 'negotiation', 'legal', 'won']), '#fdba74'], ['Negotiation', cnt(['negotiation', 'legal', 'won']), '#93c5fd'], ['Legal & documentation', cnt(['legal', 'won']), '#86efac'], ['Closed won', cnt(['won']), '#5eead4']];
    return head('Conversion Funnel', '', 'How leads progress through your pipeline') + '<div class="panel maxw"><div class="fun">' + steps.map((s, i) => { const pct = Math.round((s[1] / leads) * 100); const prev = i ? steps[i - 1][1] : 0; return (i ? '<div class="dr">' + (prev ? Math.round(((prev - s[1]) / prev) * 100) : 0) + '% drop-off</div>' : '') + '<div class="st" style="--c:' + s[2] + ';width:' + Math.max(38, pct) + '%"><span>' + s[0] + '</span><span>' + s[1] + ' · ' + pct + '%</span></div>'; }).join('') + '</div></div>';
  }
  /* integrations / settings / help */
  function pInteg() {
    return head('Link Integration', '', S.db.integrations.filter((x) => x.on).length + ' of ' + S.db.integrations.length + ' connected') + '<div class="grid">' + S.db.integrations.map((x) => '<div class="panel ic"><div class="lg" style="background:' + x.color + '">' + esc(x.name[0]) + '</div><div class="bx"><b>' + esc(x.name) + '</b><p>' + esc(x.desc) + '</p><div style="display:flex;align-items:center;gap:10px"><button class="sw ' + (x.on ? 'on' : '') + '" data-action="integ" data-id="' + x.id + '" aria-label="toggle"></button><span class="' + (x.on ? 'up' : 'muted') + '">' + (x.on ? 'Connected' : 'Not connected') + '</span></div></div></div>').join('') + '</div>';
  }
  function pSettings() {
    const u = S.db.settings; const row = (t, p, c) => '<div class="set-row"><div><b style="font-weight:600">' + t + '</b><p>' + p + '</p></div>' + c + '</div>'; const sw = (k) => '<button class="sw ' + ((k === 'themeDark' ? u.theme === 'dark' : u[k]) ? 'on' : '') + '" data-action="set-toggle" data-k="' + k + '"></button>';
    return head('Settings') + '<div class="maxw"><div class="panel" style="margin-bottom:16px"><h3>Profile</h3><div class="row2"><div class="fld"><label class="fl">Full name</label><input class="f" data-change="set" data-k="name" value="' + esc(u.name) + '"></div><div class="fld"><label class="fl">Email</label><input class="f" data-change="set" data-k="email" value="' + esc(u.email) + '"></div></div><div class="fld"><label class="fl">Workspace</label><input class="f" data-change="set" data-k="workspace" value="' + esc(u.workspace) + '"></div></div>' +
      '<div class="panel" style="margin-bottom:16px"><h3>Preferences</h3>' + row('Dark mode', 'Use a dark interface.', sw('themeDark')) + row('Email notifications', 'Deal updates and mentions.', sw('notifyEmail')) + row('Push notifications', 'Real-time alerts in the browser.', sw('notifyPush')) + row('Weekly digest', 'Summary of your pipeline every Monday.', sw('notifyDigest')) + '</div>' +
      '<div class="panel" style="margin-bottom:16px"><h3>Website sync (GitHub)</h3><p class="muted" style="margin-bottom:12px;line-height:1.5">Publishing commits <code>fortis/properties.json</code> (and new photos) to the repository; GitHub Actions then rebuilds fortis.frel.cloud. Create a <b>fine-grained token</b> limited to this repository with <b>Contents: Read and write</b>.</p><div class="row2"><div class="fld"><label class="fl">Repository</label><input class="f" data-change="set" data-k="ghRepo" value="' + esc(u.ghRepo) + '"></div><div class="fld"><label class="fl">Branch</label><input class="f" data-change="set" data-k="ghBranch" value="' + esc(u.ghBranch) + '"></div></div><div class="fld"><label class="fl">Access token (kept only for this browser tab)</label><input class="f" type="password" autocomplete="off" data-change="set-token" placeholder="github_pat_…" value="' + esc(getToken()) + '"></div><button class="btn" data-action="gh-test">Test connection</button></div><div class="panel"><h3>Data</h3>' + row('Backup', 'Download all CRM data as JSON.', '<button class="btn" data-action="export-json">' + I('download') + ' Export</button>') + row('Reset demo data', 'Restore the original sample data.', '<button class="btn danger" data-action="reset">Reset</button>') + '</div></div>';
  }
  function pHelp() {
    const f = [['How do I move a deal to another stage?', 'Drag the card to another column on the Deals pipeline, or open the deal and change its Stage.'], ['How is Commission calculated?', 'Commission is 2% of the total asset volume of all open deals.'], ['What is Win Rate?', 'The share of deals that reached Closed Won.'], ['How do properties sync with the website?', 'The Properties page edits the same list the landing page shows (fortis/properties.json). Changes stay as a draft until you click Publish; then GitHub Actions rebuilds the site (about 1–2 minutes).'], ['Where is my data stored?', 'Properties live in the website repository. Deals, leads, tasks, contacts and messages are demo CRM data stored only in this browser (localStorage).'], ['Keyboard shortcuts', '⌘K / Ctrl+K or / focuses the search box. Esc closes dialogs and menus.']];
    return head('Help Center', '', 'Answers to common questions') + '<div class="panel maxw">' + f.map((x, i) => '<div class="faq ' + (S.ui.faq === i ? 'on' : '') + '"><button data-action="faq" data-i="' + i + '">' + x[0] + I('down') + '</button>' + (S.ui.faq === i ? '<p>' + esc(x[1]) + '</p>' : '') + '</div>').join('') + '<div style="margin-top:18px"><button class="btn pri" data-action="support">Contact support</button></div></div>';
  }

  /* ---------- modals ---------- */
  const fld = (l, inner) => '<div class="fld"><label class="fl">' + l + '</label>' + inner + '</div>';
  function modal() {
    const m = S.ui.modal; if (!m) return '';
    const wrap = (title, body, foot, wide) => '<div class="ov" data-action="ov"><div class="modal ' + (wide ? 'wide' : '') + '"><div class="modal-h"><h2>' + title + '</h2><button class="btn sm icon-btn" style="width:30px" data-action="close">' + I('x') + '</button></div>' + body + foot + '</div></div>';
    const foot = (label, extra) => '<div class="modal-f">' + (extra || '') + '<button type="button" class="btn" data-action="close">Cancel</button><button class="btn pri">' + label + '</button></div>';
    if (m.type === 'deal') {
      const d = m.id ? S.db.deals.find((x) => x.id === m.id) : null; const v = d || { title: '', price: '', pri: 'Medium', stage: m.stage || 'new', cc: 'ID', client: '', phone: '', source: '', date: today(), type: 'Apartment', team: [] };
      const opts = '<option value="">— Custom / not listed —</option>' + S.db.properties.map((q) => '<option value="' + q.id + '" ' + (v.propId === q.id ? 'selected' : '') + '>' + esc(q.name) + ' — ' + esc(q.loc) + '</option>').join('');
      const form = fld('Listing', '<select class="f" name="propId" data-change="deal-prop">' + opts + '</select>') + fld('Title', '<input class="f" name="title" required value="' + esc(v.title) + '">') +
        '<div class="row2">' + fld('Price (Rp)', '<input class="f" name="price" type="number" min="0" step="any" required value="' + esc(v.price) + '">') + fld('Stage', '<select class="f" name="stage">' + STAGES.map((st) => '<option value="' + st.id + '" ' + (v.stage === st.id ? 'selected' : '') + '>' + st.name + '</option>').join('') + '</select>') + '</div>' +
        '<div class="row2">' + fld('Priority', '<select class="f" name="pri">' + ['Low', 'Medium', 'High'].map((q) => '<option ' + (v.pri === q ? 'selected' : '') + '>' + q + '</option>').join('') + '</select>') + fld('Date', '<input class="f" type="date" name="date" value="' + esc(v.date) + '">') + '</div>' +
        '<div class="row2">' + fld('Client', '<input class="f" name="client" required value="' + esc(v.client) + '">') + fld('Phone', '<input class="f" name="phone" value="' + esc(v.phone) + '">') + '</div>' + fld('Source', '<input class="f" name="source" placeholder="e.g. Instagram" value="' + esc(v.source) + '">') +
        fld('Assigned team', '<div class="chips">' + S.db.team.map((t) => '<label><input type="checkbox" name="team" value="' + t.i + '" ' + (v.team.includes(t.i) ? 'checked' : '') + '><span>' + av(t.i) + esc(t.name) + '</span></label>').join('') + '</div>');
      if (!d) return wrap('New deal', '<form data-form="deal"><div class="modal-b">' + form + '</div>' + foot('Create deal') + '</form>');
      const cm = '<div class="cm"><div class="cm-list">' + (d.comments.length ? d.comments.map((c) => '<div class="cmt"><b>' + esc(c.by) + '</b><small>' + esc(c.at) + '</small><p>' + esc(c.text) + '</p></div>').join('') : '<div class="muted">No comments yet. ' + d.cb + ' earlier comments archived.</div>') + '</div><form class="cm-f" data-form="comment"><input class="f" name="text" placeholder="Add a comment…" required autocomplete="off"><button class="btn pri icon-btn">' + I('send') + '</button></form></div>';
      return wrap(esc(d.id), '<div class="split"><form data-form="deal" id="dealform"><div class="modal-b">' + form + '</div></form>' + cm + '</div>', '<div class="modal-f"><button type="button" class="btn danger l" data-action="del-deal" data-id="' + esc(d.id) + '">' + I('trash', 15) + ' Delete</button><button type="button" class="btn" data-action="close">Close</button><button type="submit" form="dealform" class="btn pri">Save changes</button></div>', true);
    }
    if (m.type === 'invite') return wrap('Invite member', '<form data-form="invite"><div class="modal-b">' + fld('Full name', '<input class="f" name="name" required>') + fld('Email', '<input class="f" type="email" name="email" required>') + fld('Role', '<select class="f" name="role"><option>Agent</option><option>Manager</option><option>Admin</option></select>') + '</div>' + foot('Send invite') + '</form>');
    if (m.type === 'lead') return wrap('Add lead', '<form data-form="lead"><div class="modal-b">' + fld('Name', '<input class="f" name="name" required>') + '<div class="row2">' + fld('Phone', '<input class="f" name="phone">') + fld('Budget', '<input class="f" name="budget" placeholder="e.g. 2M AED">') + '</div>' + fld('Interest', '<input class="f" name="interest" placeholder="e.g. 2-bedrooms, Marina">') + '<div class="row2">' + fld('Source', '<input class="f" name="source" placeholder="bayut.com">') + fld('Agent', '<select class="f" name="agent">' + S.db.team.map((t) => '<option value="' + t.i + '">' + esc(t.name) + '</option>').join('') + '</select>') + '</div></div>' + foot('Add lead') + '</form>');
    if (m.type === 'contact') return wrap('Add contact', '<form data-form="contact"><div class="modal-b">' + fld('Name', '<input class="f" name="name" required>') + '<div class="row2">' + fld('Phone', '<input class="f" name="phone">') + fld('Email', '<input class="f" type="email" name="email">') + '</div><div class="row2">' + fld('Company', '<input class="f" name="company">') + fld('Type', '<select class="f" name="type">' + ['Buyer', 'Seller', 'Investor', 'Partner'].map((x) => '<option>' + x + '</option>').join('') + '</select>') + '</div>' + fld('Country', '<input class="f" name="country">') + '</div>' + foot('Add contact') + '</form>');
    if (m.type === 'property') return propModal(m, wrap, foot);
    return '';
  }

  /* ---------- property helpers + GitHub sync ---------- */
  const TOKEN_KEY = 'fortis.admin.token';
  function getToken() { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } }
  function setToken(t) { try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch (e) { /* ignore */ } }
  function canon(o) { return JSON.stringify(o, (k, v) => (v && typeof v === 'object' && !Array.isArray(v) ? Object.keys(v).sort().reduce((r, x) => { r[x] = v[x]; return r; }, {}) : v)); }
  function diff() {
    let base = []; try { base = JSON.parse(S.db.published || '[]'); } catch (e) { base = []; }
    const bm = new Map(base.map((x) => [x.id, canon(x)])); const cur = S.db.properties; let added = 0, changed = 0;
    cur.forEach((x) => { if (!bm.has(x.id)) added++; else if (bm.get(x.id) !== canon(x)) changed++; });
    const removed = base.filter((x) => !cur.some((y) => y.id === x.id)).length;
    const order = base.length && !added && !removed && !changed && base.map((x) => x.id).join() !== cur.map((x) => x.id).join() ? 1 : 0;
    return { added: added, changed: changed, removed: removed, order: order };
  }
  function changeCount() { if (!S.db.published && !S.db.properties.length) return 0; const d = diff(); return d.added + d.changed + d.removed + d.order; }
  function changeSummary() { const d = diff(); return [d.added && d.added + ' added', d.changed && d.changed + ' edited', d.removed && d.removed + ' removed', d.order && 'order changed'].filter(Boolean).join(', '); }
  function setBaseline(list) { S.db.properties = list; S.db.published = JSON.stringify(list); }
  async function fetchRemote() {
    const t = getToken(), repo = S.db.settings.ghRepo, br = S.db.settings.ghBranch || 'main';
    if (t && repo) { try { const r = await fetch('https://api.github.com/repos/' + repo + '/contents/fortis/properties.json?ref=' + encodeURIComponent(br), { headers: { Authorization: 'Bearer ' + t, Accept: 'application/vnd.github.raw+json' }, cache: 'no-store' }); if (r.ok) return await r.json(); } catch (e) { /* fall back to the deployed file */ } }
    const r = await fetch('../__fortis/properties.json?_=' + Date.now(), { cache: 'no-store' }); if (!r.ok) throw new Error('HTTP ' + r.status); return await r.json();
  }
  async function loadProps(force) {
    S.ui.propsState = 'loading'; if (force) render();
    try {
      const remote = await fetchRemote(); if (!Array.isArray(remote)) throw new Error('unexpected format');
      const justPublished = !force && Date.now() - (S.db.lastPublish || 0) < 10 * 60 * 1000 && canon(remote) !== canon(S.db.properties.map((x) => x)) && JSON.stringify(remote) !== S.db.published; /* the site is still rebuilding: keep what we published */
      if (justPublished) { S.ui.propsState = 'ready'; render(); return; }
      if (force || !changeCount()) { setBaseline(remote); S.db.pending = force ? {} : S.db.pending; if (!force) S.db.pending = {}; } else if (!S.db.published) S.db.published = JSON.stringify(remote);
      S.ui.propsState = 'ready'; save(); render(); if (force) toast('Reloaded ' + remote.length + ' listings from the website');
    } catch (e) { S.ui.propsState = S.db.properties.length ? 'ready' : 'error'; S.ui.propsError = e.message; render(); }
  }
  async function gh(token, path, opt) {
    opt = opt || {}; const r = await fetch('https://api.github.com' + path, { method: opt.method || 'GET', headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }, body: opt.body ? JSON.stringify(opt.body) : undefined });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error((j && j.message) || ('HTTP ' + r.status)); return j;
  }
  async function ghTest() {
    const s2 = S.db.settings, t = getToken(); if (!t || !s2.ghRepo) { toast('Enter the repository and token first'); return; }
    try { const r = await gh(t, '/repos/' + s2.ghRepo); toast(r.permissions && r.permissions.push ? 'Connected — you can publish to ' + r.full_name : 'Connected, but this token cannot write (needs Contents: Read and write)'); } catch (e) { toast('GitHub: ' + e.message); }
  }
  async function publish() {
    const s2 = S.db.settings, t = getToken();
    if (!t || !s2.ghRepo) { toast('Add your GitHub token in Settings first'); S.ui.page = 'settings'; location.hash = '#/settings'; render(); return; }
    if (!changeCount()) return;
    if (!confirm('Publish ' + changeSummary() + ' to fortis.frel.cloud?\n\nThis commits to ' + s2.ghRepo + ' (' + (s2.ghBranch || 'main') + ') and the site rebuilds in ~1–2 minutes.')) return;
    S.ui.publishing = true; render();
    try {
      const repo = s2.ghRepo, br = s2.ghBranch || 'main', base = '/repos/' + repo;
      const head = (await gh(t, base + '/git/ref/heads/' + encodeURIComponent(br))).object.sha; const parent = await gh(t, base + '/git/commits/' + head);
      const files = [{ path: 'fortis/properties.json', content: JSON.stringify(S.db.properties, null, 2) + '\n', enc: 'utf-8' }];
      Object.keys(S.db.pending).forEach((k) => { if (S.db.properties.some((x) => x.img === k)) files.push({ path: 'fortis/img/' + k + '.webp', content: S.db.pending[k].split(',')[1], enc: 'base64' }); });
      const tree = []; for (const f of files) { const bl = await gh(t, base + '/git/blobs', { method: 'POST', body: { content: f.content, encoding: f.enc } }); tree.push({ path: f.path, mode: '100644', type: 'blob', sha: bl.sha }); }
      const nt = await gh(t, base + '/git/trees', { method: 'POST', body: { base_tree: parent.tree.sha, tree: tree } });
      const msg = 'Admin: update properties (' + changeSummary() + ')';
      const nc = await gh(t, base + '/git/commits', { method: 'POST', body: { message: msg, tree: nt.sha, parents: [head] } });
      await gh(t, base + '/git/refs/heads/' + encodeURIComponent(br), { method: 'PATCH', body: { sha: nc.sha } });
      S.db.published = JSON.stringify(S.db.properties); S.db.lastPublish = Date.now(); notify('Published: ' + changeSummary()); S.ui.publishing = false; commit(); toast('Published — the website updates in about 1–2 minutes');
    } catch (e) { S.ui.publishing = false; render(); toast('Publish failed: ' + e.message); }
  }
  function compressImage(file) {
    return new Promise((res, rej) => { const fr = new FileReader(); fr.onerror = rej; fr.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => { const sc = Math.min(1, 1280 / Math.max(im.width, im.height)); const c = document.createElement('canvas'); c.width = Math.round(im.width * sc); c.height = Math.round(im.height * sc); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL('image/webp', 0.82)); }; im.src = fr.result; }; fr.readAsDataURL(file); });
  }
  function propModal(m, wrap, foot) {
    const q = m.id ? S.db.properties.find((x) => x.id === m.id) : null;
    const v = q || { name: '', loc: '', city: '', type: 'rumah', status: 'dijual', hot: false, from: true, price: '', lt: '', lb: '', kt: '', km: '', cert: 'SHGB', listrik: '', fac: [], facEn: [], desc: '', descEn: '' };
    const sel = (name, opts, cur) => '<select class="f" name="' + name + '">' + opts.map((o) => '<option value="' + o[0] + '" ' + (cur === o[0] ? 'selected' : '') + '>' + o[1] + '</option>').join('') + '</select>';
    const body = '<div class="modal-b"><div class="row2">' + fld('Name', '<input class="f" name="name" required value="' + esc(v.name) + '">') + fld('Photo' + (q ? ' (leave empty to keep)' : ''), '<input class="f" type="file" accept="image/*" data-change="prop-photo" style="padding-top:8px">') + '</div>' +
      '<img id="pp-prev" alt="" style="' + (q ? '' : 'display:none;') + 'height:110px;border-radius:10px;margin-bottom:12px;object-fit:cover" src="' + (q ? esc(propImg(q)) : '') + '">' +
      '<div class="row2">' + fld('Area / location', '<input class="f" name="loc" required value="' + esc(v.loc) + '" placeholder="e.g. Gading Serpong">') + fld('City', '<input class="f" name="city" required value="' + esc(v.city) + '" placeholder="e.g. Tangerang">') + '</div>' +
      '<div class="row2">' + fld('Type', sel('type', [['rumah', 'Rumah Residensial'], ['ruko', 'Ruko Komersial'], ['apartemen', 'Apartemen'], ['tanah', 'Tanah/Kavling']], v.type)) + fld('Status', sel('status', [['dijual', 'Dijual'], ['disewa', 'Disewa']], v.status)) + '</div>' +
      '<div class="row2">' + fld('Price (Rp)', '<input class="f" type="number" name="price" min="0" step="any" required value="' + esc(v.price) + '">') + fld('Price suffix (rent, e.g. /tahun)', '<input class="f" name="per" value="' + esc(v.per || '') + '">') + '</div>' +
      '<div class="row2">' + fld('Land area LT (m²)', '<input class="f" type="number" name="lt" min="0" value="' + esc(v.lt) + '">') + fld('Building area LB (m²)', '<input class="f" type="number" name="lb" min="0" value="' + esc(v.lb) + '">') + '</div>' +
      '<div class="row2">' + fld('Bedrooms (KT)', '<input class="f" type="number" name="kt" min="0" value="' + esc(v.kt) + '">') + fld('Bathrooms (KM)', '<input class="f" type="number" name="km" min="0" value="' + esc(v.km) + '">') + '</div>' +
      '<div class="row2">' + fld('Certificate', '<input class="f" name="cert" value="' + esc(v.cert) + '">') + fld('Electricity', '<input class="f" name="listrik" value="' + esc(v.listrik) + '" placeholder="e.g. 5.500 VA">') + '</div>' +
      '<div style="display:flex;gap:18px;margin-bottom:12px"><label class="chk"><input type="checkbox" name="hot" ' + (v.hot ? 'checked' : '') + '> “Hot” badge</label><label class="chk"><input type="checkbox" name="from" ' + (v.from ? 'checked' : '') + '> Show “harga mulai” (starting price)</label></div>' +
      fld('Description (Indonesian)', '<textarea class="f" name="desc" rows="3">' + esc(v.desc) + '</textarea>') + fld('Description (English)', '<textarea class="f" name="descEn" rows="3">' + esc(v.descEn) + '</textarea>') +
      '<div class="row2">' + fld('Highlights — Indonesian (one per line)', '<textarea class="f" name="fac" rows="4">' + esc((v.fac || []).join('\n')) + '</textarea>') + fld('Highlights — English (same order)', '<textarea class="f" name="facEn" rows="4">' + esc((v.facEn || []).join('\n')) + '</textarea>') + '</div></div>';
    return wrap(q ? 'Edit property' : 'Add property', '<form data-form="property">' + body + foot(q ? 'Save changes' : 'Add property') + '</form>', '', true);
  }
  function saveProperty(fd, v) {
    const m = S.ui.modal; const lines = (k) => v(k).split('\n').map((x) => x.trim()).filter(Boolean);
    const fac = lines('fac'); let facEn = lines('facEn'); while (facEn.length < fac.length) facEn.push(fac[facEn.length]); facEn = facEn.slice(0, fac.length);
    const data = { name: v('name'), loc: v('loc'), city: v('city'), type: v('type'), status: v('status'), hot: fd.get('hot') === 'on', price: parseFloat(v('price')) || 0, from: fd.get('from') === 'on', lt: +v('lt') || 0, lb: +v('lb') || 0, kt: +v('kt') || 0, km: +v('km') || 0, cert: v('cert') || 'SHGB', listrik: v('listrik'), fac: fac, facEn: facEn, desc: v('desc'), descEn: v('descEn') || v('desc') };
    let q = m.id ? S.db.properties.find((x) => x.id === m.id) : null;
    if (!q && !S.ui.draftPhoto) { toast('Please choose a photo for the new property'); return; }
    const isNew = !q; if (isNew) q = { id: S.db.properties.reduce((a, x) => Math.max(a, x.id), 0) + 1 };
    Object.assign(q, data); if (v('per')) q.per = v('per'); else delete q.per;
    if (S.ui.draftPhoto) { const key = 'catalog-' + q.id + '-' + Math.random().toString(36).slice(2, 6); if (q.img && S.db.pending[q.img]) delete S.db.pending[q.img]; S.db.pending[key] = S.ui.draftPhoto; q.img = key; }
    if (isNew) S.db.properties.unshift(q);
    S.ui.draftPhoto = null; S.ui.modal = null; commit(); toast(isNew ? 'Added — publish to put it on the website' : 'Saved — publish to update the website');
  }

  /* ---------- render ---------- */
  function render() {
    const root = document.getElementById('root'); const old = document.getElementById('content'); const board = root.querySelector('.board');
    const st = old ? old.scrollTop : 0, bl = board ? board.scrollLeft : 0, bd = document.getElementById('chatb');
    document.documentElement.dataset.theme = S.db.settings.theme;
    root.innerHTML = layout();
    const c = document.getElementById('content'); if (c) c.scrollTop = st; const nb = root.querySelector('.board'); if (nb) nb.scrollLeft = bl;
    const cb = document.getElementById('chatb'); if (cb) cb.scrollTop = cb.scrollHeight;
    if (S.ui.q) updateSearch();
  }
  const commit = () => { save(); render(); };

  /* ---------- search ---------- */
  function updateSearch() {
    const q = S.ui.q.trim().toLowerCase(); const sr = document.getElementById('sr'); if (!sr) return; if (!q) { sr.innerHTML = ''; return; }
    const ds = S.db.deals.filter((d) => (d.id + d.title + d.client + d.phone).toLowerCase().includes(q)).slice(0, 5);
    const cs = S.db.contacts.filter((c) => (c.name + c.phone + c.email).toLowerCase().includes(q)).slice(0, 4);
    const ls = S.db.leads.filter((l) => (l.name + l.phone).toLowerCase().includes(q)).slice(0, 4);
    const ps = S.db.properties.filter((x) => (x.name + x.loc + x.city).toLowerCase().includes(q)).slice(0, 4);
    let h = '';
    if (ps.length) h += '<h6>Properties</h6>' + ps.map((x) => '<button data-action="sr-prop" data-q="' + esc(x.name) + '">' + I('building') + '<span>' + esc(x.name) + '</span><small>' + esc(x.loc) + '</small></button>').join('');
    if (ds.length) h += '<h6>Deals</h6>' + ds.map((d) => '<button data-action="sr-deal" data-id="' + esc(d.id) + '">' + I('dollar') + '<span>' + esc(d.id) + ' — ' + esc(d.client) + '</span><small>' + dealMoney(d) + '</small></button>').join('');
    if (cs.length) h += '<h6>Contacts</h6>' + cs.map((c) => '<button data-action="sr-contact" data-q="' + esc(c.name) + '">' + I('user') + '<span>' + esc(c.name) + '</span><small>' + esc(c.phone) + '</small></button>').join('');
    if (ls.length) h += '<h6>Leads</h6>' + ls.map((l) => '<button data-action="sr-lead" data-q="' + esc(l.name) + '">' + I('users') + '<span>' + esc(l.name) + '</span><small>' + esc(l.status) + '</small></button>').join('');
    sr.innerHTML = h || '<div class="muted" style="padding:14px">No results for “' + esc(S.ui.q) + '”</div>';
  }

  /* ---------- actions ---------- */
  const A = {
    nav: (t) => { S.ui.page = t.dataset.page; S.ui.pop = null; S.ui.menu = false; location.hash = '#/' + S.ui.page; if (S.ui.page === 'messages') S.ui.chatList = false; render(); },
    menu: () => { S.ui.menu = !S.ui.menu; render(); },
    pop: (t) => { S.ui.pop = S.ui.pop === t.dataset.pop ? null : t.dataset.pop; render(); },
    country: (t) => { S.ui.country = t.dataset.c; S.ui.pop = null; commit(); },
    view: (t) => { S.ui.view = t.dataset.v; commit(); },
    sort: (t) => { S.ui.sort = t.dataset.k; S.ui.pop = null; render(); },
    'f-clear': () => { S.ui.filter = { pri: [], src: '', member: [] }; S.ui.pop = null; render(); },
    'col-sort': (t, e) => { e.stopPropagation(); S.ui.sort = S.ui.sort === 'price-desc' ? 'manual' : 'price-desc'; render(); toast(S.ui.sort === 'manual' ? 'Manual order restored' : 'Sorted by price (high to low)'); },
    theme: () => { S.db.settings.theme = S.db.settings.theme === 'dark' ? 'light' : 'dark'; S.ui.pop = null; commit(); },
    'read-all': () => { S.db.notifs.forEach((n) => { n.read = true; }); commit(); },
    'export-csv': () => { const rows = [['ID', 'Title', 'Country', 'Price', 'Stage', 'Priority', 'Client', 'Phone', 'Source', 'Date']].concat(S.db.deals.map((d) => [d.id, d.title, d.cc, d.price, stageOf(d.stage).name, d.pri, d.client, d.phone, d.source, d.date])); dl('fortis-deals.csv', 'text/csv', rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n')); S.ui.pop = null; render(); },
    'export-json': () => { dl('fortis-backup.json', 'application/json', JSON.stringify(Object.assign({}, S.db, { pending: {} }), null, 2)); S.ui.pop = null; render(); },
    reset: () => { if (confirm('Restore the original demo data? Your changes will be lost.')) { S.ui.pop = null; resetData(); } },
    modal: (t) => { S.ui.pop = null; S.ui.modal = { type: t.dataset.m, stage: t.dataset.stage }; render(); },
    close: () => { S.ui.modal = null; render(); },
    ov: (t, e) => { if (e.target === t) { S.ui.modal = null; render(); } },
    'open-deal': (t) => { S.ui.modal = { type: 'deal', id: t.dataset.id }; S.ui.pop = null; render(); },
    'del-deal': (t) => { if (confirm('Delete this deal?')) { S.db.deals = S.db.deals.filter((d) => d.id !== t.dataset.id); S.ui.modal = null; commit(); toast('Deal deleted'); } },
    'prop-filter': (t) => { S.ui.propStatus = t.dataset.f; render(); },
    'prop-del': (t) => { const q = S.db.properties.find((x) => String(x.id) === t.dataset.id); const n = S.db.deals.filter((d) => d.propId === q.id).length; if (confirm('Remove "' + q.name + '" from the website listing?' + (n ? '\n' + n + ' deal(s) reference it and will be kept.' : '') + '\nThe change goes live when you publish.')) { S.db.properties = S.db.properties.filter((x) => x !== q); commit(); toast('Removed — publish to update the website'); } },
    'prop-edit': (t) => { S.ui.draftPhoto = null; S.ui.modal = { type: 'property', id: +t.dataset.id }; render(); },
    'prop-top': (t) => { const i = S.db.properties.findIndex((x) => String(x.id) === t.dataset.id); if (i > 0) { S.db.properties.unshift(S.db.properties.splice(i, 1)[0]); commit(); toast('Moved to the top'); } },
    'prop-new': () => { S.ui.draftPhoto = null; S.ui.modal = { type: 'property' }; render(); },
    'prop-reload': () => { if (!changeCount() || confirm('Discard your unpublished changes and reload from the website?')) loadProps(true); },
    publish: () => publish(),
    'gh-test': () => ghTest(),
    'prop-deal': (t) => { const q = S.db.properties.find((x) => String(x.id) === t.dataset.id); const d = { id: nextId('ID'), propId: q.id, title: q.name + ' — ' + q.loc, price: q.price, pri: 'Medium', stage: 'new', cc: 'ID', date: today(), client: '', phone: '', source: 'Direct', team: ['K'], cb: 0, files: 0, created: today(), type: q.type, comments: [] }; S.db.deals.unshift(d); S.ui.modal = { type: 'deal', id: d.id }; commit(); toast('Deal created — add the client'); },
    'sr-prop': (t) => { S.ui.q = ''; S.ui.page = 'properties'; S.ui.propQ = t.dataset.q; location.hash = '#/properties'; render(); },
    'lead-convert': (t) => { const l = S.db.leads.find((x) => x.id === t.dataset.id); const code = 'ID'; const d = { id: nextId(code), title: l.interest || 'New opportunity', price: parseBudget(l.budget), pri: 'Medium', stage: 'new', cc: code, date: today(), client: l.name, phone: l.phone, source: l.source, team: [l.agent], cb: 0, files: 0, created: today(), type: 'Apartment', comments: [] }; S.db.deals.unshift(d); l.status = 'Qualified'; notify('Lead ' + l.name + ' converted to deal ' + d.id); commit(); toast('Converted to deal ' + d.id); },
    'lead-del': (t) => { S.db.leads = S.db.leads.filter((x) => x.id !== t.dataset.id); commit(); },
    'task-tab': (t) => { S.ui.taskTab = t.dataset.t; render(); },
    'task-del': (t) => { S.db.tasks = S.db.tasks.filter((x) => String(x.id) !== t.dataset.id); commit(); },
    'contact-del': (t) => { S.db.contacts = S.db.contacts.filter((x) => String(x.id) !== t.dataset.id); commit(); },
    thread: (t) => { S.ui.thread = +t.dataset.id; const th = S.db.threads.find((x) => x.id === S.ui.thread); if (th) th.unread = 0; S.ui.chatList = false; commit(); },
    'chat-back': () => { S.ui.chatList = true; render(); },
    integ: (t) => { const x = S.db.integrations.find((i) => i.id === t.dataset.id); x.on = !x.on; notify(x.name + (x.on ? ' connected' : ' disconnected')); commit(); toast(x.name + (x.on ? ' connected' : ' disconnected')); },
    'set-toggle': (t) => { const k = t.dataset.k; if (k === 'themeDark') S.db.settings.theme = S.db.settings.theme === 'dark' ? 'light' : 'dark'; else S.db.settings[k] = !S.db.settings[k]; commit(); },
    faq: (t) => { S.ui.faq = S.ui.faq === +t.dataset.i ? -1 : +t.dataset.i; render(); },
    support: () => toast('Support request sent — we will reply by email'),
    'sr-deal': (t) => { S.ui.q = ''; S.ui.page = 'deals'; location.hash = '#/deals'; S.ui.modal = { type: 'deal', id: t.dataset.id }; render(); },
    'sr-contact': (t) => { S.ui.q = ''; S.ui.page = 'contacts'; S.ui.contactQ = t.dataset.q; location.hash = '#/contacts'; render(); },
    'sr-lead': (t) => { S.ui.q = ''; S.ui.page = 'leads'; S.ui.leadQ = t.dataset.q; location.hash = '#/leads'; render(); },
  };
  function dl(name, type, text) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: type })); a.download = name; document.body.appendChild(a); a.click(); a.remove(); }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!e.target.closest('.top-search')) { const sr = document.getElementById('sr'); if (sr && sr.innerHTML) sr.innerHTML = ''; }
    if (!t) { if (S.ui.pop && !e.target.closest('.pop')) { S.ui.pop = null; render(); } return; }
    if (e.target.closest('.pop') && !t.closest('.pop')) return;
    const fn = A[t.dataset.action]; if (fn) { fn(t, e); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target.closest('[data-change]'); if (!t) return; const k = t.dataset.change;
    if (k === 'f-pri') { const a = S.ui.filter.pri; t.checked ? a.push(t.value) : a.splice(a.indexOf(t.value), 1); render(); }
    else if (k === 'f-mem') { const a = S.ui.filter.member; t.checked ? a.push(t.value) : a.splice(a.indexOf(t.value), 1); render(); }
    else if (k === 'f-src') { S.ui.filter.src = t.value; render(); }
    else if (k === 'task-toggle') { const x = S.db.tasks.find((y) => String(y.id) === t.dataset.id); x.done = t.checked; commit(); }
    else if (k === 'lead-status') { const x = S.db.leads.find((y) => y.id === t.dataset.id); x.status = t.value; commit(); }
    else if (k === 'deal-prop') { const q = S.db.properties.find((x) => String(x.id) === t.value); const f = t.closest('form'); if (q && f) { f.elements.title.value = q.name + ' — ' + q.loc; f.elements.price.value = q.price; } }
    else if (k === 'prop-photo') { const fl = t.files && t.files[0]; if (!fl) return; compressImage(fl).then((dd) => { S.ui.draftPhoto = dd; const im = document.getElementById('pp-prev'); if (im) { im.src = dd; im.style.display = 'block'; } }).catch(() => toast('Could not read that image')); }
    else if (k === 'prop-type') { S.ui.propType = t.value; render(); }
    else if (k === 'set-token') { setToken(t.value.trim()); toast(t.value.trim() ? 'Token kept for this browser tab only' : 'Token cleared'); }
    else if (k === 'set') { S.db.settings[t.dataset.k] = t.value; save(); if (t.dataset.k === 'name') render(); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'gs') { S.ui.q = e.target.value; updateSearch(); return; }
    const t = e.target.closest('[data-live]'); if (!t) return; S.ui[t.dataset.live] = t.value; const id = t.id, pos = t.selectionStart; render(); const n = document.getElementById(id); if (n) { n.focus(); n.setSelectionRange(pos, pos); }
  });
  document.addEventListener('submit', (e) => {
    const f = e.target.closest('[data-form]'); if (!f) return; e.preventDefault(); const fd = new FormData(f); const v = (k) => String(fd.get(k) || '').trim(); const kind = f.dataset.form;
    if (kind === 'deal') {
      const team = fd.getAll('team'); const m = S.ui.modal; const data = { propId: v('propId') ? +v('propId') : null, title: v('title'), price: parseFloat(v('price')) || 0, cc: 'ID', stage: v('stage'), pri: v('pri'), client: v('client'), phone: v('phone'), source: v('source') || 'Direct', date: v('date') || today(), team: team };
      if (m.id) { const d = S.db.deals.find((x) => x.id === m.id); const moved = d.stage !== data.stage; Object.assign(d, data); if (moved) notify(d.id + ' moved to ' + stageOf(d.stage).name); toast('Deal saved'); }
      else { const d = Object.assign({ id: nextId(data.cc), cb: 0, files: 0, created: today(), type: 'Apartment', comments: [] }, data); S.db.deals.unshift(d); notify('New deal created: ' + d.id); toast('Deal ' + d.id + ' created'); }
      S.ui.modal = null; commit();
    } else if (kind === 'comment') { const d = S.db.deals.find((x) => x.id === S.ui.modal.id); d.comments.push({ by: S.db.settings.name, text: v('text'), at: nowStamp() }); commit(); }
    else if (kind === 'invite') { const nm = v('name'); let ini = nm[0].toUpperCase(); const used = S.db.team.map((t) => t.i); if (used.includes(ini)) ini = (nm.slice(0, 2).toUpperCase()); const pal = [['#bbf7d0', '#15803d'], ['#fed7aa', '#c2410c'], ['#a5f3fc', '#0e7490'], ['#e9d5ff', '#7e22ce']]; const c = pal[S.db.team.length % pal.length]; S.db.team.push({ i: ini, name: nm, color: c[0], fg: c[1] }); S.ui.modal = null; notify(nm + ' was invited as ' + v('role')); commit(); toast('Invite sent to ' + v('email')); }
    else if (kind === 'lead') { S.db.leads.unshift({ id: 'L-' + (200 + S.db.leads.length + 1 + Math.floor(Math.random() * 90)), name: v('name'), phone: v('phone'), interest: v('interest'), budget: v('budget'), source: v('source') || 'Direct', status: 'New', agent: v('agent'), created: today() }); S.ui.modal = null; notify('New lead: ' + v('name')); commit(); }
    else if (kind === 'contact') { S.db.contacts.unshift({ id: nextNum(S.db.contacts), name: v('name'), phone: v('phone'), email: v('email'), company: v('company') || '—', type: v('type'), country: v('country') || '—' }); S.ui.modal = null; commit(); }
    else if (kind === 'property') { saveProperty(fd, v); }
    else if (kind === 'task') { S.db.tasks.unshift({ id: nextNum(S.db.tasks), title: v('title'), due: v('due') || today(), pri: v('pri'), done: false }); commit(); }
    else if (kind === 'msg') { const th = S.db.threads.find((x) => x.id === S.ui.thread); const hm = new Date().toTimeString().slice(0, 5); th.msgs.push({ from: 'me', text: v('text'), at: hm }); commit(); }
  });

  /* drag & drop */
  let dragId = null;
  document.addEventListener('dragstart', (e) => { const c = e.target.closest && e.target.closest('.card'); if (!c) return; dragId = c.dataset.id; e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragId); } catch (x) { /* ignore */ } setTimeout(() => c.classList.add('dragging'), 0); });
  document.addEventListener('dragend', () => { dragId = null; document.querySelectorAll('.dragging').forEach((x) => x.classList.remove('dragging')); document.querySelectorAll('.col.over').forEach((x) => x.classList.remove('over')); });
  document.addEventListener('dragover', (e) => { const c = e.target.closest && e.target.closest('.col'); if (!c || !dragId) return; e.preventDefault(); document.querySelectorAll('.col.over').forEach((x) => { if (x !== c) x.classList.remove('over'); }); c.classList.add('over'); });
  document.addEventListener('drop', (e) => {
    const c = e.target.closest && e.target.closest('.col'); if (!c || !dragId) return; e.preventDefault();
    const d = S.db.deals.find((x) => x.id === dragId); if (!d) return; const stage = c.dataset.stage; const before = e.target.closest('.card'); const moved = d.stage !== stage;
    S.db.deals = S.db.deals.filter((x) => x !== d); d.stage = stage;
    const target = before && before.dataset.id !== d.id ? S.db.deals.findIndex((x) => x.id === before.dataset.id) : -1;
    if (target >= 0) S.db.deals.splice(target, 0, d); else { let last = -1; S.db.deals.forEach((x, i) => { if (x.stage === stage) last = i; }); S.db.deals.splice(last + 1, 0, d); }
    if (moved) { notify(d.id + ' moved to ' + stageOf(stage).name); toast(d.id + ' → ' + stageOf(stage).name); }
    dragId = null; commit();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); const g = document.getElementById('gs'); if (g) g.focus(); return; }
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); const g = document.getElementById('gs'); if (g) g.focus(); return; }
    if (e.key === 'Escape') { if (S.ui.modal || S.ui.pop || S.ui.q) { S.ui.modal = null; S.ui.pop = null; S.ui.q = ''; render(); } }
  });
  window.addEventListener('hashchange', () => { const p = location.hash.replace('#/', ''); if (PAGES.includes(p) && p !== S.ui.page) { S.ui.page = p; render(); } });

  init();
  const hp = location.hash.replace('#/', ''); if (PAGES.includes(hp)) S.ui.page = hp;
  render();
  loadProps(false);
})();
