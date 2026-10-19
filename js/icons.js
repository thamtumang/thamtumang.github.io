/* =========================================================
   BỘ ICON & AVATAR (SVG tự vẽ, không dùng ảnh ngoài)
   ========================================================= */
(function () {
  'use strict';
  let uid = 0;
  const nid = p => p + (++uid);

  // Ô icon bo góc có nền gradient và hình vẽ trắng bên trong
  function tile(c1, c2, glyph, size) {
    const g = nid('g'), s = nid('s');
    return '<svg class="ico" viewBox="0 0 48 48" width="' + (size || 48) + '" height="' + (size || 48) + '" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>' +
      '<linearGradient id="' + s + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<rect x="2" y="2" width="44" height="44" rx="11" fill="url(#' + g + ')"/>' +
      '<rect x="2" y="2" width="44" height="44" rx="11" fill="url(#' + s + ')"/>' +
      '<rect x="2.5" y="2.5" width="43" height="43" rx="10.5" fill="none" stroke="#000" stroke-opacity=".12"/>' +
      '<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' + glyph + '</g></svg>';
  }
  // Hình vẽ đơn sắc (dùng currentColor) cho nút nhỏ
  function glyph(paths, size, sw) {
    return '<svg class="gly" viewBox="0 0 24 24" width="' + (size || 18) + '" height="' + (size || 18) + '" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }

  const G = {
    inbox: '<rect x="9" y="14" width="30" height="21" rx="3"/><path d="M10 16l14 10 14-10"/>',
    vietbook: '<path d="M14 11h20a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H22l-7 6v-6h-1a4 4 0 0 1-4-4V15a4 4 0 0 1 4-4z"/><path d="M18 17l6 10 6-10" stroke-width="3.4"/>',
    link: '<circle cx="21" cy="21" r="10"/><path d="M28.5 28.5L37 37" stroke-width="5"/><path d="M18 21h6"/><path d="M17 18.5a3 3 0 0 0 0 5M25 18.5a3 3 0 0 1 0 5"/>',
    image: '<rect x="9" y="11" width="30" height="24" rx="3"/><circle cx="18" cy="19" r="3"/><path d="M10 33l9-8 6 5 4-3 9 6"/>',
    account: '<path d="M9 19L24 10l15 9z" fill="#fff"/><path d="M13 22v10M20 22v10M28 22v10M35 22v10"/><path d="M9 36h30"/>',
    profile: '<rect x="8" y="12" width="32" height="24" rx="3"/><circle cx="17" cy="21" r="3.5"/><path d="M11.5 31c1.5-4 9.5-4 11 0"/><path d="M27 20h8M27 26h6"/>',
    badges: '<path d="M17 8l-3 12M31 8l3 12"/><circle cx="24" cy="29" r="10"/><path d="M24 23.5l1.7 3.5 3.8.5-2.8 2.6.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.6 3.8-.5z" fill="#fff" stroke-width="1.2"/>',
    shop: '<path d="M10 20l3-9h22l3 9"/><path d="M10 20a4.7 4.7 0 0 0 9.3 0 4.7 4.7 0 0 0 9.4 0 4.7 4.7 0 0 0 9.3 0"/><path d="M12 24v13h24V24"/><path d="M21 37v-7h6v7"/>',
    quiz: '<path d="M24 37s-13-7.5-13-16a7 7 0 0 1 13-3.5A7 7 0 0 1 37 21c0 8.5-13 16-13 16z"/><path d="M24 20v8M20 24h8"/>',
    boss: '<path d="M30 10a14 14 0 1 0 8 23 11 11 0 0 1-8-23z" fill="#fff"/><circle cx="36" cy="14" r="1.2" fill="#fff"/><circle cx="31" cy="21" r="1" fill="#fff"/>',
    leaderboard: '<path d="M16 11h16v8a8 8 0 0 1-16 0z"/><path d="M16 14h-5a5 5 0 0 0 6 6M32 14h5a5 5 0 0 1-6 6"/><path d="M24 27v5M18 37h12M20 37l1-5h6l1 5"/>',
    settings: '<circle cx="24" cy="24" r="5"/><path d="M24 9v5M24 34v5M9 24h5M34 24h5M13.4 13.4l3.5 3.5M31.1 31.1l3.5 3.5M13.4 34.6l3.5-3.5M31.1 16.9l3.5-3.5"/>',
    // Kiểu lừa đảo
    prize: '<rect x="10" y="19" width="28" height="8" rx="2"/><path d="M12 27v10h24V27M24 19v18"/><path d="M24 19c-3-6-10-6-8-1s8 1 8 1 6 4 8-1-5-5-8 1z"/>',
    cart: '<path d="M8 11h5l4 18h17l4-12H15"/><circle cx="19" cy="35" r="2.4" fill="#fff"/><circle cx="32" cy="35" r="2.4" fill="#fff"/>',
    hack: '<circle cx="18" cy="17" r="5"/><path d="M8 35c0-6 4.5-9 10-9s10 3 10 9"/><circle cx="32" cy="18" r="4"/><path d="M30 26c5 0 9 2.5 9 8"/><path d="M36 9l4 4M40 9l-4 4" stroke-width="2.4"/>',
    job: '<rect x="9" y="16" width="30" height="20" rx="3"/><path d="M19 16v-3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3M9 25h30"/><path d="M22 25v3h4v-3"/>',
    shield: '<path d="M24 9l13 5v9c0 8-5.5 13-13 16-7.5-3-13-8-13-16v-9z"/><path d="M24 17l1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z" fill="#fff" stroke-width="1.2"/>',
    camera: '<rect x="8" y="16" width="32" height="20" rx="4"/><path d="M18 16l2-4h8l2 4"/><circle cx="24" cy="26" r="5"/><path d="M36 9l-4 4" stroke-width="2.4"/>',
    hook: '<path d="M30 9v17a8 8 0 0 1-16 0v-3"/><path d="M14 23l-4 4M14 23l4 4"/><circle cx="30" cy="9" r="2" fill="#fff"/><path d="M33 31l5 5M38 31l-5 5" stroke-width="2.4"/>',
    otp: '<rect x="13" y="8" width="22" height="32" rx="4"/><path d="M21 12h6"/><path d="M17 24h2M23 24h2M29 24h2" stroke-width="3.6"/><path d="M20 34h8"/>',
    school: '<path d="M6 19l18-8 18 8-18 8z" fill="#fff" fill-opacity=".25"/><path d="M13 23v8c3 3 7 4 11 4s8-1 11-4v-8"/><path d="M42 19v9"/>',
    loan: '<circle cx="24" cy="24" r="13"/><path d="M28 18.5c-1-1.3-2.5-2-4.4-2-2.6 0-4.3 1.4-4.3 3.4 0 4.6 9.2 2.5 9.2 7.4 0 2-1.9 3.6-4.7 3.6-2 0-3.8-.8-4.8-2.3M24 13.5v3M24 31v3"/>',
    logo: '<path d="M9 22c0-2 6-3.5 15-3.5S39 20 39 22" stroke-width="2.6"/><path d="M14 19l2-8c2.5 1.5 5.5 1.5 8 0 2.5 1.5 5.5 1.5 8 0l2 8" fill="#fff" stroke-width="2"/><circle cx="20" cy="30" r="6"/><path d="M24.5 34.5L31 41" stroke-width="4"/><path d="M28 28c2 0 4 1 5 3"/>'
  };

  const APP_ICONS = {
    inbox: ['#ffb84d', '#f27121', G.inbox],
    vietbook: ['#3b82f6', '#1d4ed8', G.vietbook],
    link: ['#22d3ee', '#0e7490', G.link],
    image: ['#a78bfa', '#6d28d9', G.image],
    account: ['#34d399', '#047857', G.account],
    profile: ['#94a3b8', '#334155', G.profile],
    badges: ['#fcd34d', '#d97706', G.badges],
    shop: ['#fb7185', '#be123c', G.shop],
    quiz: ['#f87171', '#b91c1c', G.quiz],
    boss: ['#4338ca', '#0f0a2e', G.boss],
    leaderboard: ['#fde047', '#ca8a04', G.leaderboard],
    logo: ['#1e293b', '#0b1220', G.logo]
  };
  const TYPE_ICONS = {
    prize: ['#fbbf24', '#d97706', G.prize],
    impersonate: ['#f87171', '#dc2626', G.hack],
    job: ['#a78bfa', '#7c3aed', G.job],
    phishing: ['#38bdf8', '#0369a1', G.hook],
    otp: ['#34d399', '#047857', G.otp],
    school: ['#60a5fa', '#1d4ed8', G.school],
    loan: ['#f472b6', '#be185d', G.loan]
  };

  function appIcon(name, size) {
    const d = APP_ICONS[name] || APP_ICONS.logo;
    return tile(d[0], d[1], d[2], size);
  }
  function typeIcon(id, size) {
    const d = TYPE_ICONS[id] || APP_ICONS.logo;
    return tile(d[0], d[1], d[2], size);
  }

  /* ---------- Avatar người (tự sinh từ tên) ---------- */
  const SKINS = ['#f9d5b5', '#f1c19c', '#e0a97e', '#c98d62', '#a86f48'];
  const HAIRS = ['#2b1d16', '#3d2817', '#5a3a22', '#1c1c1c', '#7a4a2a', '#b07a3a'];
  const BGS = ['#dbeafe', '#fce7f3', '#dcfce7', '#fef3c7', '#ede9fe', '#ffe4e6', '#cffafe', '#e0e7ff'];
  const SHIRTS = ['#2563eb', '#db2777', '#059669', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#475569'];
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  const pick = (arr, h, k) => arr[(h >>> (k * 3)) % arr.length];

  // style: 'short' | 'long' | 'bun' | 'police' | 'old' | 'unknown' | 'cap'
  function face(seed, style, size, opts) {
    opts = opts || {};
    const h = hash(String(seed));
    const skin = opts.skin || pick(SKINS, h, 1);
    const hair = opts.hair || (style === 'old' ? '#cbd5e1' : pick(HAIRS, h, 2));
    const bg = opts.bg || pick(BGS, h, 3);
    const shirt = opts.shirt || (style === 'police' ? '#1e3a8a' : pick(SHIRTS, h, 4));
    const cid = nid('c');
    let back = '', front = '', extra = '';
    if (style === 'unknown') {
      return '<svg class="avatar" viewBox="0 0 64 64" width="' + (size || 40) + '" height="' + (size || 40) + '"><circle cx="32" cy="32" r="32" fill="#cbd5e1"/><circle cx="32" cy="26" r="11" fill="#94a3b8"/><path d="M12 56c3-11 11-15 20-15s17 4 20 15" fill="#94a3b8"/></svg>';
    }
    if (style === 'long') {
      back = '<path d="M17 30c-2-14 6-20 15-20s17 6 15 20l2 20H15z" fill="' + hair + '"/>';
      front = '<path d="M20 26c3-7 9-9 12-9s10 2 12 9c-6-1-12-4-14-8-2 4-6 7-10 8z" fill="' + hair + '"/>';
    } else if (style === 'bun') {
      back = '<circle cx="32" cy="9" r="6" fill="' + hair + '"/>';
      front = '<path d="M20 27c0-9 5-13 12-13s12 4 12 13c-4-3-9-6-12-6s-8 3-12 6z" fill="' + hair + '"/>';
    } else if (style === 'police') {
      front = '<path d="M17 22c2-8 9-11 15-11s13 3 15 11z" fill="#1e3a8a"/><rect x="18" y="20" width="28" height="4" rx="2" fill="#0f1f4d"/><circle cx="32" cy="16" r="2.2" fill="#facc15"/>';
    } else if (style === 'cap') {
      front = '<path d="M19 24c1-8 6-11 13-11s12 3 13 11z" fill="' + shirt + '"/><path d="M40 23h10c0 2-3 3-10 3z" fill="' + shirt + '"/>';
    } else if (style === 'old') {
      front = '<path d="M20 25c0-6 3-9 6-10M44 25c0-6-3-9-6-10" stroke="' + hair + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
      extra = '<path d="M26 37c2 2 10 2 12 0" stroke="' + hair + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    } else {
      front = '<path d="M20 27c-1-9 5-14 12-14s13 5 12 14c-2-4-6-6-9-6-5 0-10 2-15 6z" fill="' + hair + '"/>';
    }
    const glasses = opts.glasses ? '<g fill="none" stroke="#1f2937" stroke-width="1.6"><circle cx="27" cy="29" r="3.6"/><circle cx="37" cy="29" r="3.6"/><path d="M30.6 29h2.8"/></g>' : '';
    const hat = opts.hat ? '<path d="M14 21c4-2 32-2 36 0-2 2-34 2-36 0z" fill="#3f2d20"/><path d="M20 20c1-8 5-11 12-11s11 3 12 11z" fill="#5b4330"/><rect x="20" y="16" width="24" height="3" fill="#2a1d14"/>' : '';
    return '<svg class="avatar" viewBox="0 0 64 64" width="' + (size || 40) + '" height="' + (size || 40) + '" aria-hidden="true">' +
      '<defs><clipPath id="' + cid + '"><circle cx="32" cy="32" r="32"/></clipPath></defs>' +
      '<g clip-path="url(#' + cid + ')"><rect width="64" height="64" fill="' + bg + '"/>' + back +
      '<path d="M10 66c2-13 11-19 22-19s20 6 22 19z" fill="' + shirt + '"/>' +
      '<path d="M27 42h10v7c-2 2-8 2-10 0z" fill="' + skin + '"/>' +
      '<ellipse cx="32" cy="29" rx="12" ry="13.5" fill="' + skin + '"/>' +
      '<circle cx="27" cy="29.5" r="1.6" fill="#1f2937"/><circle cx="37" cy="29.5" r="1.6" fill="#1f2937"/>' +
      '<path d="M28.5 35.5c2 1.6 5 1.6 7 0" stroke="#9a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>' +
      '<circle cx="23.5" cy="33.5" r="2" fill="#f87171" opacity=".25"/><circle cx="40.5" cy="33.5" r="2" fill="#f87171" opacity=".25"/>' +
      front + extra + glasses + hat + '</g></svg>';
  }

  // Logo trang / thương hiệu: chữ cái đầu trên nền màu
  function brand(name, color, size, verified) {
    const words = String(name).replace(/[^\p{L}\p{N} ]/gu, ' ').trim().split(/\s+/);
    const ini = ((words[0] || '?')[0] + (words[1] ? words[1][0] : '')).toUpperCase();
    const g = nid('b');
    return '<svg class="avatar brand" viewBox="0 0 64 64" width="' + (size || 40) + '" height="' + (size || 40) + '" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + color + '"/><stop offset="1" stop-color="' + color + '" stop-opacity=".72"/></linearGradient></defs>' +
      '<circle cx="32" cy="32" r="32" fill="url(#' + g + ')"/><circle cx="32" cy="32" r="27" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>' +
      '<text x="32" y="40.5" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="' + (ini.length > 1 ? 22 : 26) + '" fill="#fff">' + ini + '</text></svg>';
  }

  // Chọn avatar cho một nhân vật trong tình huống dựa vào biểu tượng gốc
  const PERSON = { '👧': 'long', '👩': 'long', '🧒': 'short', '👦': 'short', '👨‍🏫': 'old', '👮': 'police', '👤': 'unknown', '⚽': 'cap', '📷': 'short', '🔐': 'unknown' };
  function forEntity(e, size) {
    const st = PERSON[e.avatar];
    if (st) return face(e.name, st, size, st === 'old' ? { glasses: true } : null);
    return brand(e.name, e.color || '#64748b', size, e.verified);
  }
  // Người bình luận: kiểu tóc ngẫu nhiên theo tên
  function commenter(name, size) {
    const styles = ['short', 'long', 'bun', 'short', 'long'];
    return face(name, styles[hash(name) % styles.length], size);
  }

  // Bác Tư: thám tử già, tóc bạc, đeo kính, đội mũ
  function bacTu(size) {
    return face('Bác Tư', 'old', size, { skin: '#f1c19c', hair: '#e5e7eb', bg: '#fde68a', shirt: '#7c5a3a', glasses: true, hat: true });
  }

  // Avatar người chơi để chọn khi tạo tài khoản
  const PLAYER_AVATARS = [
    { style: 'short', opts: { bg: '#dbeafe', shirt: '#2563eb', hair: '#2b1d16' } },
    { style: 'long', opts: { bg: '#fce7f3', shirt: '#db2777', hair: '#3d2817' } },
    { style: 'cap', opts: { bg: '#dcfce7', shirt: '#059669', hair: '#1c1c1c' } },
    { style: 'bun', opts: { bg: '#fef3c7', shirt: '#d97706', hair: '#5a3a22' } },
    { style: 'short', opts: { bg: '#ede9fe', shirt: '#7c3aed', hair: '#7a4a2a', glasses: true } },
    { style: 'long', opts: { bg: '#cffafe', shirt: '#0891b2', hair: '#1c1c1c', glasses: true } },
    { style: 'short', opts: { bg: '#fee2e2', shirt: '#dc2626', hair: '#b07a3a', skin: '#c98d62' } },
    { style: 'long', opts: { bg: '#e0e7ff', shirt: '#4338ca', hair: '#5a3a22', skin: '#e0a97e' } }
  ];
  function player(i, size) {
    const a = PLAYER_AVATARS[(i | 0) % PLAYER_AVATARS.length];
    return face('player' + i, a.style, size, a.opts);
  }

  // Huy hiệu kim loại cho Sổ Huy hiệu
  function medal(typeId, got, size) {
    const d = TYPE_ICONS[typeId] || APP_ICONS.boss;
    const g = nid('m'), r = nid('r');
    const c1 = got ? '#fde68a' : '#e5e7eb', c2 = got ? '#d97706' : '#9ca3af';
    return '<svg class="medal' + (got ? ' got' : '') + '" viewBox="0 0 96 110" width="' + (size || 96) + '" height="' + ((size || 96) * 110 / 96) + '" aria-hidden="true">' +
      '<defs><linearGradient id="' + g + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>' +
      '<linearGradient id="' + r + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (got ? d[0] : '#cbd5e1') + '"/><stop offset="1" stop-color="' + (got ? d[1] : '#94a3b8') + '"/></linearGradient></defs>' +
      '<path d="M30 60L18 104l14-6 9 12 9-38z" fill="url(#' + r + ')"/><path d="M66 60l12 44-14-6-9 12-9-38z" fill="url(#' + r + ')"/>' +
      '<circle cx="48" cy="46" r="40" fill="url(#' + g + ')"/><circle cx="48" cy="46" r="33" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-dasharray="3 4"/>' +
      '<g transform="translate(24 22)">' + (got ? tile(d[0], d[1], d[2], 48) : tile('#cbd5e1', '#94a3b8', d[2], 48)) + '</g></svg>';
  }

  const UI = {
    search: glyph('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
    power: glyph('<path d="M12 3v8"/><path d="M6.3 7.5a8 8 0 1 0 11.4 0"/>'),
    wifi: glyph('<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/>', 16),
    volume: glyph('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>', 16),
    battery: glyph('<rect x="2" y="7" width="18" height="10" rx="2"/><path d="M22 10v4"/><rect x="4" y="9" width="11" height="6" rx="1" fill="currentColor" stroke="none"/>', 16),
    heart: '<svg class="gly" viewBox="0 0 24 24" width="16" height="16"><path d="M12 21s-8-4.6-8-10.4A4.6 4.6 0 0 1 12 8a4.6 4.6 0 0 1 8 2.6C20 16.4 12 21 12 21z" fill="#ef4444"/></svg>',
    coin: '<svg class="gly" viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="9" fill="#f59e0b"/><circle cx="12" cy="12" r="6.5" fill="none" stroke="#fde68a" stroke-width="1.5"/><path d="M12 8.5v7M10 10.5h3.2a1.3 1.3 0 0 1 0 2.6h-2.4a1.3 1.3 0 0 0 0 2.6H14" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>',
    star: '<svg class="gly" viewBox="0 0 24 24" width="16" height="16"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" fill="#facc15" stroke="#d97706" stroke-width="1"/></svg>',
    min: glyph('<path d="M6 12h12"/>', 14, 1.4),
    max: glyph('<rect x="6" y="6" width="12" height="12" rx="1.5"/>', 14, 1.4),
    restore: glyph('<rect x="5" y="9" width="10" height="10" rx="1.5"/><path d="M9 9V6.5A1.5 1.5 0 0 1 10.5 5H17.5A1.5 1.5 0 0 1 19 6.5v7a1.5 1.5 0 0 1-1.5 1.5H15"/>', 14, 1.4),
    close: glyph('<path d="M6 6l12 12M18 6L6 18"/>', 14, 1.4),
    lock: glyph('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 14),
    check: glyph('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 18, 2.6),
    question: glyph('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><circle cx="12" cy="17" r=".8" fill="currentColor"/>', 18),
    block: glyph('<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>', 18),
    arrow: glyph('<path d="M5 12h14M13 6l6 6-6 6"/>', 18),
    user: glyph('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>', 18)
  };

  window.ICONS = { appIcon, typeIcon, face, brand, forEntity, commenter, bacTu, player, PLAYER_AVATARS, medal, UI, hash };
})();
