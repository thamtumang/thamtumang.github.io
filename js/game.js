/* =========================================================
   THÁM TỬ MẠNG - LOGIC GAME
   Không cần build. Tài khoản và tiến trình xem js/store.js.
   ========================================================= */
(function () {
  'use strict';

  /* ---------------- Cấu hình ---------------- */
  const MAX_HP = 100;
  const DMG_WRONG = 25;      // chọn sai Tin / Báo cáo
  const DMG_TYPE = 15;       // xác định sai kiểu lừa đảo
  const DMG_BOSS = 20;
  const HEAL_QUIZ = 20;
  const REWARD_BASE = 40;
  const REWARD_CLUE = 10;
  const STARS_PER_TYPE = 5;
  const UNLOCK_NEXT = 2;     // số sao cần để mở chương tiếp theo
  const BOSS_NEED = 3;       // mỗi kiểu cần ít nhất 3 sao để mở trùm cuối
  // Điểm xếp hạng
  const SCORE_STAR = 100, SCORE_BADGE = 200, SCORE_BOSS = 1000;

  const TOOLS = {
    link:    { name: 'Kính lúp soi link', short: 'Soi link', ev: 'link',    prices: [60, 120, 220], desc: 'Soi đường link, phát hiện tên miền giả mạo.' },
    image:   { name: 'Máy tra ảnh',       short: 'Tra ảnh', ev: 'image',   prices: [100, 160, 260], desc: 'Kiểm tra ảnh có bị lấy từ trên mạng không (như tìm kiếm ảnh ngược của Google).' },
    account: { name: 'Sổ tra số tài khoản', short: 'Tra STK', ev: 'account', prices: [120, 180, 280], desc: 'Tra số tài khoản có bị cảnh báo lừa đảo không (như canhbao.ncsc.gov.vn).' },
    profile: { name: 'Máy soi hồ sơ',     short: 'Soi hồ sơ', ev: 'profile', prices: [80, 140, 240], desc: 'Xem ngày tạo tài khoản, bạn bè, lịch sử đổi tên.' }
  };
  const LEVEL_TEXT = [
    'Chưa sở hữu',
    'Cấp 1: Cho kết luận An toàn / Nguy hiểm',
    'Cấp 2: Hiện chi tiết và tự đánh dấu manh mối',
    'Cấp 3: Quét siêu tốc, +15 tiền mỗi lần soi trúng'
  ];
  const CHOICES = {
    trust:   { label: 'Tin tưởng', icon: 'check' },
    suspect: { label: 'Nghi ngờ & xác minh', icon: 'question' },
    report:  { label: 'Chặn & báo cáo', icon: 'block' }
  };
  const RANKS = [
    { need: 0, name: 'Thực tập sinh', cls: 'r0' },
    { need: 5, name: 'Thám tử Tập sự', cls: 'r1' },
    { need: 12, name: 'Thám tử Đồng', cls: 'r2' },
    { need: 20, name: 'Thám tử Bạc', cls: 'r3' },
    { need: 999, name: 'Thám tử hạng Vàng', cls: 'r4' }
  ];

  const I = window.ICONS;
  const U = I.UI;
  const typeById = {};
  SCAM_TYPES.forEach(t => (typeById[t.id] = t));
  const scById = {};
  SCENARIOS.forEach(s => (scById[s.id] = s));

  /* ---------------- Trạng thái & lưu ---------------- */
  function freshState() {
    return {
      hp: MAX_HP, money: 100,
      solved: {}, rules: [],
      tools: { link: 1, image: 0, account: 0, profile: 0 },
      tutorialDone: false, bossDone: false, letterSeen: 0
    };
  }
  let S = freshState();
  function badgesCount() { return SCAM_TYPES.filter(t => starsOf(t.id) >= STARS_PER_TYPE).length; }
  function summary() {
    const stars = totalStars(), badges = badgesCount();
    return { stars, badges, bossDone: !!S.bossDone, score: stars * SCORE_STAR + badges * SCORE_BADGE + (S.bossDone ? SCORE_BOSS : 0) };
  }
  function save() { Store.save(S, summary()); }

  // Vụ án đang điều tra (không lưu)
  let C = null; // { id, found:Set, scanned:Set, phase:'investigate'|'type'|'done', result }
  let inboxView = { mode: 'list', id: null };
  let bossState = null;

  /* ---------------- Tiện ích ---------------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => n.toLocaleString('vi-VN');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const isMobile = () => window.innerWidth <= 760;
  const plain = s => String(s).replace(/\[\[[\w-]+\|(.+?)\]\]/g, '$1');

  function starsOf(typeId) {
    return SCENARIOS.filter(s => s.type === typeId && S.solved[s.id]).length;
  }
  function totalStars() { return Object.keys(S.solved).filter(id => scById[id]).length; }
  function typeUnlocked(i) { return i === 0 || starsOf(SCAM_TYPES[i - 1].id) >= UNLOCK_NEXT; }
  function bossUnlocked() { return SCAM_TYPES.every(t => starsOf(t.id) >= BOSS_NEED); }
  function rank() {
    if (S.bossDone) return RANKS[RANKS.length - 1];
    let r = RANKS[0];
    RANKS.forEach(x => { if (totalStars() >= x.need) r = x; });
    return r;
  }
  function me() { return Store.user || { name: 'Khách', avatar: 0, guest: true }; }

  // Chuyển [[id|chữ]] thành manh mối bấm được
  function clueText(text) {
    return esc(text)
      .replace(/\[\[([\w-]+)\|(.+?)\]\]/g, (m, id, label) => {
        const found = C && C.found.has(id) ? ' found' : '';
        return '<span class="clue' + found + '" data-clue="' + id + '">' + label + '</span>';
      })
      .replace(/\n/g, '<br>');
  }

  function toast(html, kind) {
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.innerHTML = html;
    const box = $('#toasts');
    box.appendChild(t);
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3100);
  }

  function modal(html, buttons) {
    const m = $('#modal');
    m.innerHTML = html + '<div class="modal-btns"></div>';
    const box = $('.modal-btns', m);
    (buttons || [{ label: 'Đóng' }]).forEach(b => {
      const btn = document.createElement('button');
      btn.className = 'btn ' + (b.cls || 'primary');
      btn.textContent = b.label;
      btn.onclick = () => { closeModal(); b.onClick && b.onClick(); };
      box.appendChild(btn);
    });
    $('#modal-bg').classList.remove('hidden');
  }
  function closeModal() { $('#modal-bg').classList.add('hidden'); }

  function floatText(text, cls) {
    const f = document.createElement('div');
    f.className = 'float ' + (cls || '');
    f.textContent = text;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1400);
  }

  /* ---------------- Sự kiện (cho hướng dẫn) ---------------- */
  function emit(evt) { Tutorial.on(evt); }

  /* ---------------- Quản lý cửa sổ ---------------- */
  const WM = {
    wins: {}, z: 20, order: [],
    open(app) {
      const def = APPS[app];
      if (def.locked && def.locked()) { def.onLocked && def.onLocked(); return; }
      let w = this.wins[app];
      const isNew = !w;
      if (!w) {
        const el = document.createElement('div');
        el.className = 'window';
        el.dataset.win = app;
        el.innerHTML =
          '<div class="titlebar"><span class="t-icon">' + I.appIcon(def.icon, 18) + '</span><span class="t-title">' + def.title + '</span>' +
          '<button class="t-btn t-min" title="Thu nhỏ">' + U.min + '</button>' +
          '<button class="t-btn t-max" title="Phóng to">' + U.max + '</button>' +
          '<button class="t-btn t-close" title="Đóng">' + U.close + '</button></div>' +
          '<div class="win-body"></div>';
        $('#windows').appendChild(el);
        w = this.wins[app] = { el, body: $('.win-body', el), max: false, def };
        this.order.push(app);
        $('.t-close', el).onclick = e => { e.stopPropagation(); this.close(app); };
        $('.t-min', el).onclick = e => { e.stopPropagation(); this.minimize(app); };
        $('.t-max', el).onclick = e => { e.stopPropagation(); this.toggleMax(app); };
        $('.titlebar', el).addEventListener('dblclick', e => { if (!e.target.closest('.t-btn')) this.toggleMax(app); });
        el.addEventListener('pointerdown', () => this.focus(app));
        makeDraggable(el, $('.titlebar', el), app);
      }
      const wasMin = w.el.classList.contains('minimized');
      w.el.classList.remove('minimized');
      this.focus(app);
      def.render(w.body);
      if (isNew || wasMin) this.layout();
      renderTaskbar();
      emit('open:' + app);
      Tutorial.highlight();
    },
    close(app) {
      const w = this.wins[app];
      if (!w) return;
      w.el.remove();
      delete this.wins[app];
      this.order = this.order.filter(a => a !== app);
      this.layout();
      renderTaskbar();
    },
    closeAll() { Object.keys(this.wins).forEach(a => { this.wins[a].el.remove(); }); this.wins = {}; this.order = []; renderTaskbar(); },
    minimize(app) {
      const w = this.wins[app];
      if (!w) return;
      w.el.classList.add('minimized');
      this.layout();
      renderTaskbar();
    },
    toggleMax(app) {
      const w = this.wins[app];
      if (!w || isMobile()) return;
      w.max = !w.max;
      $('.t-max', w.el).innerHTML = w.max ? U.restore : U.max;
      $('.t-max', w.el).title = w.max ? 'Thu về' : 'Phóng to';
      this.layout();
    },
    focus(app) {
      const w = this.wins[app];
      if (!w) return;
      w.el.style.zIndex = ++this.z;
      $$('.window').forEach(x => x.classList.remove('active'));
      w.el.classList.add('active');
      renderTaskbar();
    },
    // Vùng trống của desktop (trừ cột icon và taskbar)
    area() {
      const icons = $('#icons');
      const left = icons.offsetWidth ? icons.offsetLeft + icons.offsetWidth + 10 : 10;
      const W = window.innerWidth, H = window.innerHeight - 48;
      return { x: left, y: 10, w: Math.max(320, W - left - 10), h: H - 20 };
    },
    // Xếp các cửa sổ cạnh nhau, không chồng lên nhau
    layout() {
      if (isMobile()) return;
      const A = this.area();
      const vis = this.order.filter(a => !this.wins[a].el.classList.contains('minimized'));
      const tiled = vis.filter(a => !this.wins[a].max);
      vis.filter(a => this.wins[a].max).forEach(a => place(this.wins[a].el, A.x, A.y, A.w, A.h));
      const n = tiled.length;
      if (!n) return;
      const gap = 10;
      if (n === 1) {
        const d = this.wins[tiled[0]].def;
        const w = Math.min(d.w || 640, A.w), h = Math.min(d.h || 560, A.h);
        return place(this.wins[tiled[0]].el, A.x + (A.w - w) / 2, A.y + (A.h - h) / 2, w, h);
      }
      let cols = n === 2 ? 2 : n <= 4 ? 2 : 3;
      cols = Math.max(1, Math.min(cols, Math.floor((A.w + gap) / (380 + gap))));
      const cells = [];
      if (n === 3 && cols >= 2) {
        const cw = (A.w - gap) / 2, ch = (A.h - gap) / 2;
        cells.push([A.x, A.y, cw, A.h], [A.x + cw + gap, A.y, cw, ch], [A.x + cw + gap, A.y + ch + gap, cw, ch]);
      } else {
        const rows = Math.ceil(n / cols);
        const ch = (A.h - gap * (rows - 1)) / rows;
        if (ch < 260) {
          // Quá nhiều cửa sổ: xếp bậc thang
          tiled.forEach((a, i) => {
            const d = this.wins[a].def;
            const w = Math.min(d.w || 640, A.w - 160), h = Math.min(d.h || 560, A.h - 160);
            cells.push([A.x + 30 + (i % 6) * 34, A.y + 10 + (i % 6) * 30, w, h]);
          });
        } else {
          for (let i = 0; i < n; i++) {
            const r = Math.floor(i / cols), c = i % cols;
            const inRow = Math.min(cols, n - r * cols);
            const cw = (A.w - gap * (inRow - 1)) / inRow;
            cells.push([A.x + c * (cw + gap), A.y + r * (ch + gap), cw, ch]);
          }
        }
      }
      tiled.forEach((a, i) => place(this.wins[a].el, ...cells[i]));
    },
    refresh(app) {
      const w = this.wins[app];
      if (!w) return;
      const inner = $('.scroll', w.body);
      const st = inner ? inner.scrollTop : 0;
      APPS[app].render(w.body);
      const inner2 = $('.scroll', w.body);
      if (inner2) inner2.scrollTop = st;
    },
    refreshAll() {
      Object.keys(this.wins).forEach(a => this.refresh(a));
      renderTray();
      renderIcons();
      Tutorial.highlight();
    }
  };

  function place(el, x, y, w, h) {
    el.classList.add('anim');
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y) + 'px';
    el.style.width = Math.round(w) + 'px';
    el.style.height = Math.round(h) + 'px';
    clearTimeout(el._anim);
    el._anim = setTimeout(() => el.classList.remove('anim'), 260);
  }

  function makeDraggable(win, handle, app) {
    let sx, sy, ox, oy, drag = false;
    handle.addEventListener('pointerdown', e => {
      if (isMobile() || e.target.closest('.t-btn')) return;
      const w = WM.wins[app];
      if (w && w.max) return;
      drag = true; sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', e => {
      if (!drag) return;
      const x = Math.min(window.innerWidth - 80, Math.max(-win.offsetWidth + 80, ox + e.clientX - sx));
      const y = Math.min(window.innerHeight - 90, Math.max(0, oy + e.clientY - sy));
      win.style.left = x + 'px';
      win.style.top = y + 'px';
    });
    handle.addEventListener('pointerup', () => (drag = false));
  }

  /* ---------------- Desktop, taskbar, menu Start ---------------- */
  const DESKTOP_APPS = ['inbox', 'vietbook', 'link', 'image', 'account', 'profile', 'badges', 'shop', 'leaderboard'];
  const PINNED = ['inbox', 'vietbook', 'badges', 'shop', 'leaderboard'];

  function renderIcons() {
    $('#icons').innerHTML = DESKTOP_APPS.map(a => {
      const d = APPS[a];
      const lock = d.locked && d.locked() ? '<span class="lock">' + U.lock + '</span>' : '';
      const badge = a === 'inbox' && newLetter() ? '<span class="dot"></span>' : '';
      return '<button class="icon" data-app="' + a + '"><span class="i-img">' + I.appIcon(d.icon, 44) + lock + badge +
        '</span><span class="i-label">' + d.short + '</span></button>';
    }).join('');
    $$('#icons .icon').forEach(b => (b.onclick = () => WM.open(b.dataset.app)));
  }

  function renderTaskbar() {
    const list = PINNED.slice();
    WM.order.forEach(a => { if (list.indexOf(a) < 0) list.push(a); });
    $('#task-apps').innerHTML = list.map(a => {
      const w = WM.wins[a];
      const open = !!w;
      const act = open && w.el.classList.contains('active') && !w.el.classList.contains('minimized');
      return '<button class="task-app' + (open ? ' open' : '') + (act ? ' active' : '') + '" data-task="' + a + '" title="' + APPS[a].title + '">' + I.appIcon(APPS[a].icon, 26) + '</button>';
    }).join('');
    $$('#task-apps .task-app').forEach(b => (b.onclick = () => {
      const a = b.dataset.task;
      const w = WM.wins[a];
      if (!w) return WM.open(a);
      if (w.el.classList.contains('active') && !w.el.classList.contains('minimized')) WM.minimize(a);
      else WM.open(a);
    }));
  }

  function renderTray() {
    $('#hp-fill').style.width = (S.hp / MAX_HP * 100) + '%';
    $('#hp-fill').className = S.hp <= 25 ? 'low' : S.hp <= 50 ? 'mid' : '';
    $('#hp-text').textContent = S.hp;
    $('#money-text').textContent = money(S.money);
    $('#star-text').textContent = totalStars();
  }

  function tickClock() {
    const d = new Date();
    const t = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    $('#clock').textContent = t;
    $('#date').textContent = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    const lt = $('#lock-time');
    if (lt) {
      lt.textContent = t;
      $('#lock-date').textContent = d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
    }
  }

  function toggleStart(force) {
    const m = $('#start-menu');
    const show = force !== undefined ? force : m.classList.contains('hidden');
    if (show) renderStartMenu();
    m.classList.toggle('hidden', !show);
    if (show) { const i = $('#sm-search'); if (i && !isMobile()) i.focus(); }
  }

  function renderStartMenu(filter) {
    const u = me();
    const r = rank();
    const all = ['inbox', 'vietbook', 'badges', 'shop', 'leaderboard', 'quiz', 'link', 'image', 'account', 'profile'];
    if (bossUnlocked()) all.push('boss');
    const q = (filter || '').toLowerCase();
    const apps = all.filter(a => !q || APPS[a].title.toLowerCase().indexOf(q) >= 0);
    const next = SCENARIOS.find((s, i) => !S.solved[s.id] && typeUnlocked(SCAM_TYPES.findIndex(t => t.id === s.type)));
    $('#start-menu').innerHTML =
      '<div class="sm-search"><span>' + U.search + '</span><input id="sm-search" placeholder="Tìm ứng dụng" value="' + esc(filter || '') + '"></div>' +
      '<div class="sm-sec"><b>Đã ghim</b></div>' +
      '<div class="sm-grid">' + apps.map(a => '<button class="sm-app" data-sm-app="' + a + '">' + I.appIcon(APPS[a].icon, 36) + '<span>' + APPS[a].short + '</span></button>').join('') +
      (apps.length ? '' : '<p class="muted small">Không tìm thấy ứng dụng.</p>') + '</div>' +
      '<div class="sm-sec"><b>Đề xuất</b></div><div class="sm-rec">' +
      (next ? '<button class="sm-recitem" data-sm-case="' + next.id + '">' + I.typeIcon(next.type, 32) + '<span><b>' + esc(next.title) + '</b><small>Vụ án tiếp theo · ' + esc(typeById[next.type].name) + '</small></span></button>' : '') +
      '<button class="sm-recitem" data-sm="tutorial">' + I.appIcon('logo', 32) + '<span><b>Hướng dẫn "Ngày đầu đi làm"</b><small>Chơi lại hướng dẫn cùng Bác Tư</small></span></button>' +
      '</div>' +
      '<div class="sm-foot"><div class="sm-user">' + I.player(u.avatar, 32) + '<span><b>' + esc(u.name) + '</b><small class="rank ' + r.cls + '">' + r.name + '</small></span></div>' +
      '<div class="sm-power"><button class="sm-pbtn" id="sm-power" title="Tài khoản">' + U.power + '</button>' +
      '<div class="sm-pmenu hidden" id="sm-pmenu">' +
      '<button data-sm="about">Giới thiệu game</button>' +
      '<button data-sm="reset">Xóa tiến trình, chơi lại từ đầu</button>' +
      '<button data-sm="logout">' + (u.guest ? 'Thoát chế độ khách' : 'Đăng xuất') + '</button></div></div></div>';
    const inp = $('#sm-search');
    inp.oninput = () => { const v = inp.value; renderStartMenu(v); const i2 = $('#sm-search'); i2.focus(); i2.setSelectionRange(v.length, v.length); };
    $$('[data-sm-app]').forEach(b => (b.onclick = () => { toggleStart(false); WM.open(b.dataset.smApp); }));
    $$('[data-sm-case]').forEach(b => (b.onclick = () => { toggleStart(false); inboxView = { mode: 'case', id: b.dataset.smCase }; WM.open('inbox'); WM.refresh('inbox'); }));
    $('#sm-power').onclick = e => { e.stopPropagation(); $('#sm-pmenu').classList.toggle('hidden'); };
    $$('[data-sm]').forEach(b => (b.onclick = () => {
      toggleStart(false);
      const k = b.dataset.sm;
      if (k === 'tutorial') Tutorial.start();
      if (k === 'about') modal('<div class="about">' + I.appIcon('logo', 64) + '<h2>Thám Tử Mạng</h2><p class="muted">Hồ Sơ Lừa Đảo</p><p>Game giáo dục giúp học sinh nhận biết và phòng tránh lừa đảo trên mạng.</p><p>Nội dung và nhân vật trong game là hư cấu, dựa trên các thủ đoạn lừa đảo có thật ở Việt Nam.</p><p>Gặp chuyện thật? Kể ngay với bố mẹ, thầy cô. Gọi <b>111</b> (bảo vệ trẻ em) hoặc <b>113</b> (công an).</p></div>');
      if (k === 'reset') modal('<h2>Xóa tiến trình?</h2><p>Toàn bộ sao, huy hiệu, tiền và thiết bị của <b>' + esc(u.name) + '</b> sẽ mất. Điểm trên bảng xếp hạng về 0.</p>', [
        { label: 'Hủy', cls: 'ghost' },
        { label: 'Xóa và chơi lại', cls: 'danger', onClick: async () => { await Store.resetSave(); S = freshState(); save(); WM.closeAll(); C = null; inboxView = { mode: 'list' }; WM.refreshAll(); Tutorial.start(); } }
      ]);
      if (k === 'logout') logout();
    }));
  }

  /* ---------------- Các ứng dụng ---------------- */
  const APPS = {
    inbox: { title: 'Hộp thư vụ án', short: 'Hộp thư', icon: 'inbox', w: 640, h: 600, render: renderInbox },
    vietbook: { title: 'ViệtBook', short: 'ViệtBook', icon: 'vietbook', w: 720, h: 660, render: renderVietBook },
    badges: { title: 'Sổ Huy hiệu', short: 'Sổ Huy hiệu', icon: 'badges', w: 700, h: 620, render: renderBadges },
    shop: { title: 'Cửa hàng thiết bị', short: 'Cửa hàng', icon: 'shop', w: 640, h: 600, render: renderShop },
    quiz: { title: 'Ôn tập hồi máu', short: 'Ôn tập', icon: 'quiz', w: 520, h: 480, render: renderQuiz },
    boss: { title: 'Hồ sơ cuối: Bóng Đêm', short: 'Bóng Đêm', icon: 'boss', w: 600, h: 580, render: renderBoss },
    leaderboard: { title: 'Bảng xếp hạng', short: 'Xếp hạng', icon: 'leaderboard', w: 560, h: 620, render: renderLeaderboard }
  };
  Object.keys(TOOLS).forEach(k => {
    APPS[k] = {
      title: TOOLS[k].name, short: TOOLS[k].short, icon: k, w: 480, h: 500,
      render: body => renderTool(k, body),
      locked: () => S.tools[k] === 0,
      onLocked: () => modal('<div class="about">' + I.appIcon(k, 56) + '<h2>' + TOOLS[k].name + '</h2><p>Bạn chưa có thiết bị này. Hãy mua ở <b>Cửa hàng</b> bằng tiền thưởng phá án.</p></div>', [
        { label: 'Để sau', cls: 'ghost' }, { label: 'Mở Cửa hàng', onClick: () => WM.open('shop') }
      ])
    };
  });

  /* ---------- Hộp thư ---------- */
  function visibleLetters() {
    return LETTERS.filter(l => (l.boss ? bossUnlocked() : totalStars() >= l.need));
  }
  function newLetter() { return visibleLetters().length > S.letterSeen; }

  function renderInbox(body) {
    if (inboxView.mode === 'case') return renderCaseBrief(body, inboxView.id);
    const letters = visibleLetters();
    const latest = letters[letters.length - 1];
    if (S.letterSeen !== letters.length) { S.letterSeen = letters.length; save(); setTimeout(renderIcons, 0); }

    let h = '<div class="scroll pad">';
    h += '<div class="letter"><div class="letter-head">' + I.bacTu(44) + '<div><div class="letter-from">Thư từ Bác Tư</div><h3>' + esc(latest.title) + '</h3></div></div><p>' + esc(latest.text) + '</p>';
    if (letters.length > 1) {
      h += '<details><summary>Xem thư cũ (' + (letters.length - 1) + ')</summary>' +
        letters.slice(0, -1).reverse().map(l => '<div class="old-letter"><b>' + esc(l.title) + '</b><p>' + esc(l.text) + '</p></div>').join('') + '</details>';
    }
    h += '</div>';

    if (bossUnlocked()) {
      h += '<button class="case-item boss-item" data-boss="1"><span class="ci-icon">' + I.appIcon('boss', 36) + '</span><span class="ci-main"><b>HỒ SƠ CUỐI: Lật mặt "Bóng Đêm"</b><small>' +
        (S.bossDone ? 'Đã phá án' : 'Tối mật. Chỉ dành cho thám tử giỏi nhất.') + '</small></span></button>';
    }

    SCAM_TYPES.forEach((t, i) => {
      const open = typeUnlocked(i);
      h += '<div class="chapter' + (open ? '' : ' locked') + '"><div class="ch-head" style="--c:' + t.color + '">' + I.typeIcon(t.id, 28) + '<span class="ch-name">Chương ' + (i + 1) + ': ' + t.name + '</span><span class="ch-stars">' + starRow(starsOf(t.id)) + '</span></div>';
      if (!open) {
        h += '<p class="muted small lockline">' + U.lock + ' Cần ' + UNLOCK_NEXT + ' sao ở chương ' + i + ' để mở.</p>';
      } else {
        SCENARIOS.filter(s => s.type === t.id).forEach(s => {
          const done = S.solved[s.id];
          h += '<button class="case-item' + (done ? ' done' : '') + '" data-case="' + s.id + '"><span class="ci-icon">' + (done ? U.star : '<span class="folder"></span>') +
            '</span><span class="ci-main"><b>' + esc(s.title) + '</b><small>' + esc(s.reporter) + '</small></span><span class="ci-go">' + (done ? 'Đã phá' : 'Mở') + '</span></button>';
        });
      }
      h += '</div>';
    });
    h += '</div>';
    body.innerHTML = h;
    $$('[data-case]', body).forEach(b => (b.onclick = () => { inboxView = { mode: 'case', id: b.dataset.case }; WM.refresh('inbox'); emit('case:open'); Tutorial.highlight(); }));
    const bb = $('[data-boss]', body);
    if (bb) bb.onclick = () => WM.open('boss');
  }

  function starRow(n) {
    let s = '';
    for (let i = 0; i < STARS_PER_TYPE; i++) s += '<i class="' + (i < n ? 'on' : '') + '">★</i>';
    return s;
  }

  function renderReport(s) {
    const r = s.report;
    if (!r) return '<blockquote>' + esc(s.brief || '') + '</blockquote>';
    const body = r.msgs.map(m => {
      if (typeof m === 'string') return '<div class="r-msg">' + esc(m) + '</div>';
      if (m.time) return '<div class="r-time">' + esc(m.time) + '</div>';
      if (m.shot) return '<div class="r-shot"><div class="rs-bar"><span>' + esc(m.app || '') + '</span><span>9:41</span></div><div class="rs-body">' +
        m.shot.map(l => '<div class="rs-line">' + esc(l) + '</div>').join('') + '</div></div>';
      return '';
    }).join('');
    return '<div class="report"><div class="report-head">' + I.commenter(r.from, 36) + '<div><b>' + esc(r.from) + '</b><small>' + esc(r.sub || '') + ' · nhắn tới Văn phòng Thám tử Mạng</small></div></div>' +
      '<div class="report-body">' + body + '</div></div>';
  }

  function renderCaseBrief(body, id) {
    const s = scById[id];
    const t = typeById[s.type];
    body.innerHTML =
      '<div class="scroll pad">' +
      '<button class="btn ghost small" id="back-inbox">← Hộp thư</button>' +
      '<div class="case-file">' +
      '<div class="cf-chapter" style="color:' + t.color + '">' + I.typeIcon(t.id, 22) + ' Hồ sơ: ' + esc(s.title) + '</div>' +
      renderReport(s) +
      '<div class="cf-boss">' + I.bacTu(36) + '<span><b>Bác Tư:</b> Mở ViệtBook xem tận mắt. Chạm vào những chỗ đáng ngờ, dùng thiết bị dò tìm, rồi đưa ra kết luận.</span></div>' +
      (S.solved[s.id] ? '<p class="muted small">Bạn đã phá vụ này. Chơi lại để ôn tập (không nhận thêm tiền).</p>' : '') +
      '<button class="btn primary big" id="btn-investigate">Bắt đầu điều tra</button>' +
      '</div></div>';
    $('#back-inbox', body).onclick = () => { inboxView = { mode: 'list' }; WM.refresh('inbox'); Tutorial.highlight(); };
    $('#btn-investigate', body).onclick = () => startCase(id);
  }

  /* ---------- Vụ án ---------- */
  function startCase(id) {
    C = { id, found: new Set(), scanned: new Set(), phase: 'investigate', result: null };
    Object.keys(TOOLS).forEach(k => WM.wins[k] && WM.refresh(k));
    WM.open('vietbook');
    if (isMobile() && WM.wins.inbox) WM.close('inbox');
  }

  function findClue(id, silent) {
    if (!C || C.phase === 'done') return;
    const s = scById[C.id];
    if (!s.clues[id]) return;
    if (!C.found.has(id)) {
      C.found.add(id);
      if (!silent) toast('<b>Manh mối mới!</b> ' + esc(s.clues[id]));
      emit('clue');
    } else if (!silent) {
      toast(esc(s.clues[id]));
    }
    WM.refresh('vietbook');
    Tutorial.highlight();
  }

  function renderVietBook(body) {
    let h = '<div class="vb"><div class="vb-top"><span class="vb-logo">ViệtBook</span><input class="vb-search" placeholder="Tìm kiếm trên ViệtBook" disabled><span class="vb-me">' + I.player(me().avatar, 32) + '</span></div>';
    if (!C) {
      h += '<div class="scroll vb-feed">' +
        '<div class="vb-card empty-case">' + I.appIcon('inbox', 48) + '<p>Chưa có vụ án nào đang mở.</p><button class="btn primary" id="go-inbox">Mở Hộp thư vụ án</button></div>' +
        demoPost('Văn phòng Thám tử Mạng', '#0f172a', 'Mỗi ngày hãy dành 1 phút kiểm tra lại cài đặt bảo mật tài khoản của mình nhé!') +
        demoPost('CLB Bóng rổ trường', '#ea580c', 'Chiều thứ Năm tập luyện tại sân trường lúc 16h30. Mọi người nhớ mang nước nha!') +
        '</div></div>';
      body.innerHTML = h;
      $('#go-inbox', body).onclick = () => WM.open('inbox');
      return;
    }
    const s = scById[C.id];
    const v = s.view;
    h += '<div class="scroll vb-feed">';
    h += '<div class="vb-hint">' + U.search + ' Chạm vào chỗ bạn thấy đáng ngờ. Đã tìm <b>' + C.found.size + '/' + Object.keys(s.clues).length + '</b> manh mối.</div>';
    if (v.kind === 'post') {
      h += '<div class="vb-card post">' +
        '<div class="post-head">' + I.forEntity(v.author, 42) + '<div><b>' + esc(v.author.name) + (v.author.verified ? ' <span class="tick">✔</span>' : '') + '</b><small>' + clueText(v.author.meta) + '</small></div></div>' +
        '<div class="post-text">' + clueText(v.text) + '</div>';
      if (v.image) {
        h += '<div class="post-img' + (v.image.clue ? ' clue' : '') + (v.image.clue && C.found.has(v.image.clue) ? ' found' : '') + '"' + (v.image.clue ? ' data-clue="' + v.image.clue + '"' : '') + ' style="--c:' + (v.author.color || '#6366f1') + '"><span>' + v.image.emoji + '</span><small>' + esc(v.image.caption) + '</small></div>';
      }
      if (v.link) {
        h += '<div class="post-link clue' + (C.found.has(v.link.clue) ? ' found' : '') + '" data-clue="' + v.link.clue + '"><small>' + esc(v.link.url.toUpperCase()) + '</small><b>' + esc(v.link.title) + '</b></div>';
      }
      h += '<div class="post-stats">' + esc(v.stats || '') + '</div><div class="post-actions"><span>Thích</span><span>Bình luận</span><span>Chia sẻ</span></div>';
      if (v.comments) {
        h += '<div class="comments">' + v.comments.map(c => '<div class="cmt">' + I.commenter(plain(c.name), 32) + '<div><b>' + clueText(c.name) + '</b><p>' + clueText(c.text) + '</p></div></div>').join('') + '</div>';
      }
      h += '</div>';
    } else if (v.kind === 'email') {
      h += '<div class="vb-card mail"><div class="mail-bar"><span class="m-logo">M</span> Hộp thư đến</div>' +
        '<div class="mail-subject">' + clueText(v.subject) + '</div>' +
        '<div class="mail-from">' + I.forEntity(v.from, 40) + '<div><b>' + esc(v.from.name) + '</b> <small>&lt;' + clueText(v.from.addr) + '&gt;</small><small>tới ' + esc(v.to || 'tôi') + ' · ' + esc(v.date || '') + '</small></div></div>' +
        '<div class="mail-body">' + clueText(v.body) +
        (v.button ? '<div><span class="mail-btn clue' + (C.found.has(v.button.clue) ? ' found' : '') + '" data-clue="' + v.button.clue + '">' + esc(v.button.text) + '</span></div>' : '') +
        (v.sig ? '<div class="mail-sig">' + clueText(v.sig) + '</div>' : '') + '</div></div>';
    } else {
      const app = v.app || 'messenger';
      const appName = { messenger: 'Messenger', zalo: 'Zalo', sms: 'Tin nhắn' }[app] || app;
      h += '<div class="vb-card chat ' + app + '"><div class="chat-head">' + I.forEntity(v.contact, 42) + '<div><b>' + esc(v.contact.name) + '</b><small>' + clueText(v.contact.sub || '') + '</small></div><span class="chat-app ' + app + '">' + appName + '</span></div><div class="chat-body">' +
        v.messages.map(m => m.who === 'sys'
          ? '<div class="sms-time">' + clueText(m.text) + '</div>'
          : '<div class="msg-row ' + m.who + '">' + (m.who === 'them' ? (app === 'sms' ? '' : I.forEntity(v.contact, 28)) : '') + '<div class="msg ' + m.who + '">' + clueText(m.text) + '</div></div>').join('') + '</div></div>';
    }
    if (C.found.size) {
      h += '<div class="vb-card notes"><b>Sổ manh mối</b><ul>' + Array.from(C.found).map(id => '<li>' + esc(s.clues[id]) + '</li>').join('') + '</ul></div>';
    }
    h += '</div>';
    h += '<div class="panel">' + renderPanel(s) + '</div></div>';
    body.innerHTML = h;

    $$('.clue', body).forEach(el => (el.onclick = e => { e.stopPropagation(); findClue(el.dataset.clue); }));
    $$('[data-tool]', body).forEach(b => (b.onclick = () => WM.open(b.dataset.tool)));
    $$('[data-decide]', body).forEach(b => (b.onclick = () => decide(b.dataset.decide)));
    $$('[data-type]', body).forEach(b => (b.onclick = () => pickType(b.dataset.type)));
    const nx = $('#btn-next', body); if (nx) nx.onclick = nextCase;
    const bi = $('#btn-back', body); if (bi) bi.onclick = () => { C = null; inboxView = { mode: 'list' }; WM.refresh('vietbook'); WM.open('inbox'); WM.refresh('inbox'); };
  }

  function demoPost(name, color, text) {
    return '<div class="vb-card post"><div class="post-head">' + I.brand(name, color, 42) + '<div><b>' + esc(name) + '</b><small>Hôm nay · Công khai</small></div></div><div class="post-text">' + esc(text) + '</div></div>';
  }

  function typeButtons(attr, disabled) {
    return SCAM_TYPES.map(t => {
      const off = disabled && disabled.indexOf(t.id) >= 0;
      return '<button class="type-pick' + (off ? ' used' : '') + '" ' + attr + '="' + t.id + '" style="--c:' + t.color + '"' + (off ? ' disabled' : '') + '>' + I.typeIcon(t.id, 26) + '<span>' + t.name + '</span></button>';
    }).join('');
  }

  function renderPanel(s) {
    if (C.phase === 'investigate') {
      const tools = Object.keys(TOOLS).map(k => {
        const has = s.evidence && s.evidence[TOOLS[k].ev];
        const owned = S.tools[k] > 0;
        return '<button class="tool-chip' + (has ? ' has' : '') + (owned ? '' : ' off') + (C.scanned.has(k) ? ' done' : '') + '" data-tool="' + k + '" title="' + TOOLS[k].name + '">' +
          I.appIcon(k, 26) + '<span>' + TOOLS[k].short + '</span>' + (owned ? '' : '<em>' + U.lock + '</em>') + '</button>';
      }).join('');
      return '<div class="panel-row tools-row">' + tools + '</div>' +
        '<div class="panel-row decide">' + Object.keys(CHOICES).map(k =>
          '<button class="btn decide-' + k + '" data-decide="' + k + '">' + U[CHOICES[k].icon] + ' ' + CHOICES[k].label + '</button>').join('') + '</div>';
    }
    if (C.phase === 'type') {
      return '<div class="panel-q">Chính xác! Đây là kiểu lừa đảo nào?</div><div class="type-grid">' + typeButtons('data-type') + '</div>';
    }
    const r = C.result;
    const t = typeById[s.type];
    return '<div class="result">' +
      '<div class="res-head">' + (r.first ? '<span class="big-star">' + U.star + '</span>' : U.check) + '<div><b>Phá án thành công!</b><small>' + (r.first ? '+1 sao ' + t.name + ' · +' + r.reward + ' tiền' : 'Ôn tập xong (đã nhận thưởng trước đó)') + '</small></div></div>' +
      '<p>' + esc(s.explain) + '</p>' +
      '<div class="golden"><b>Quy tắc vàng:</b> ' + esc(s.rule) + '</div>' +
      '<div class="panel-row"><button class="btn ghost" id="btn-back">Về hộp thư</button><button class="btn primary" id="btn-next">Vụ tiếp theo →</button></div></div>';
  }

  function decide(choice) {
    if (!C || C.phase !== 'investigate') return;
    const s = scById[C.id];
    if (choice === s.answer) {
      emit('decide:correct');
      if (s.answer === 'trust') return solve();
      C.phase = 'type';
      WM.refresh('vietbook');
      Tutorial.highlight();
      return;
    }
    const wrong = (choice === 'trust') !== (s.answer === 'trust');
    if (wrong) {
      emit('decide:wrong');
      const ok = damage(DMG_WRONG);
      if (ok) modal('<div class="fb bad"><h2>Chưa đúng rồi! -' + DMG_WRONG + ' máu</h2><p><b>Hậu quả:</b> ' + esc(s.consequence) + '</p><p class="muted">' +
        (s.answer === 'trust' ? 'Gợi ý: hãy tìm những dấu hiệu AN TOÀN trong vụ này.' : 'Gợi ý: xem lại các manh mối đáng ngờ và dùng thiết bị dò tìm.') + '</p></div>', [{ label: 'Điều tra tiếp', onClick: () => Tutorial.highlight() }]);
    } else {
      let note;
      if (s.partialNote) note = s.partialNote;
      else if (s.answer === 'report') note = 'Nghi ngờ là đúng hướng! Nhưng dấu hiệu lừa đảo ở đây đã quá rõ. Hãy chặn và báo cáo để bảo vệ cả những người khác.';
      else note = 'Cẩn thận là tốt! Nhưng vụ này có nhiều dấu hiệu an toàn. Thử soi kỹ lại xem.';
      modal('<div class="fb mid"><h2>Gần đúng rồi!</h2><p>' + esc(note) + '</p><p class="muted">Không bị trừ máu. Hãy chọn lại.</p></div>', [{ label: 'Chọn lại' }]);
    }
  }

  function pickType(typeId) {
    if (!C || C.phase !== 'type') return;
    const s = scById[C.id];
    if (typeId === s.type) return solve();
    const ok = damage(DMG_TYPE);
    if (ok) {
      toast('Chưa đúng kiểu lừa đảo. -' + DMG_TYPE + ' máu. Đọc lại manh mối nhé!', 'bad');
      const b = $('[data-type="' + typeId + '"]');
      if (b) { b.classList.add('shake', 'used'); b.disabled = true; }
    }
  }

  // Trả về false nếu hết máu (vụ án bắt đầu lại)
  function damage(n, inBoss) {
    S.hp = Math.max(0, S.hp - n);
    floatText('-' + n + ' máu', 'bad');
    document.body.classList.add('hurt');
    setTimeout(() => document.body.classList.remove('hurt'), 450);
    if (S.hp <= 0) {
      S.hp = MAX_HP;
      save();
      if (inBoss) {
        bossState = null;
        WM.refresh('boss');
      } else if (C) {
        C = { id: C.id, found: new Set(), scanned: new Set(), phase: 'investigate', result: null };
      }
      WM.refreshAll();
      modal('<div class="fb bad"><h2>Hết máu!</h2><p>Bác Tư: "Nghỉ một chút rồi làm lại nhé cháu. Không sao đâu, ai cũng có lúc sai."</p><p>Máu đã hồi đầy. ' +
        (inBoss ? 'Hồ sơ Bóng Đêm' : 'Vụ án này') + ' sẽ bắt đầu lại từ đầu.</p></div>', [{ label: 'Làm lại' }]);
      return false;
    }
    save();
    WM.refreshAll();
    return true;
  }

  function solve() {
    const s = scById[C.id];
    const first = !S.solved[s.id];
    const bossWasOpen = bossUnlocked();
    let reward = 0;
    if (first) {
      reward = REWARD_BASE + REWARD_CLUE * C.found.size;
      S.money += reward;
      S.solved[s.id] = true;
      if (S.rules.indexOf(s.id) < 0) S.rules.push(s.id);
    }
    C.phase = 'done';
    C.result = { first, reward };
    save();
    if (first) { floatText('+1 sao  +' + reward + ' tiền', 'good'); confetti(); }
    WM.refreshAll();
    emit('case:solved');
    if (first && starsOf(s.type) === STARS_PER_TYPE) {
      const t = typeById[s.type];
      setTimeout(() => modal('<div class="badge-pop">' + I.medal(t.id, true, 110) + '<h2>Mở khóa huy hiệu!</h2><h3>' + esc(t.badge) + '</h3><p>Bạn đã thu thập đủ 5 sao kiểu lừa "' + esc(t.name) + '". Bí kíp phòng tránh đã được thêm vào Sổ Huy hiệu.</p></div>',
        [{ label: 'Xem Sổ Huy hiệu', onClick: () => WM.open('badges') }]), 900);
    }
    if (first && !bossWasOpen && bossUnlocked()) {
      setTimeout(() => toast('Hộp thư có thư tối mật mới từ Bác Tư!'), 1500);
    }
  }

  function nextCase() {
    const order = [];
    SCAM_TYPES.forEach((t, i) => { if (typeUnlocked(i)) SCENARIOS.filter(s => s.type === t.id).forEach(s => order.push(s.id)); });
    const next = order.find(id => !S.solved[id]);
    C = null;
    WM.refresh('vietbook');
    if (!next) {
      if (bossUnlocked() && !S.bossDone) return WM.open('boss');
      modal('<h2>Hết vụ án!</h2><p>Bạn đã phá hết các vụ đang mở. Hãy xem lại Sổ Huy hiệu để ôn tập nhé.</p>');
      return;
    }
    inboxView = { mode: 'case', id: next };
    WM.open('inbox');
    WM.refresh('inbox');
  }

  function confetti() {
    const box = document.createElement('div');
    box.className = 'confetti';
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'][i % 5];
      p.style.animationDelay = Math.random() * 0.4 + 's';
      p.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(p);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 2200);
  }

  /* ---------- Thiết bị dò tìm ---------- */
  function renderTool(k, body) {
    const tool = TOOLS[k];
    const lv = S.tools[k];
    let h = '<div class="scroll pad tool"><div class="tool-head">' + I.appIcon(k, 48) + '<div><b>' + tool.name + '</b><small>' + LEVEL_TEXT[lv] + '</small></div></div>';
    if (!C) {
      h += '<p class="muted">Chưa có vụ án nào đang mở. Hãy nhận vụ án trong Hộp thư trước.</p></div>';
      body.innerHTML = h;
      return;
    }
    const s = scById[C.id];
    const ev = s.evidence && s.evidence[tool.ev];
    if (!ev) {
      h += '<div class="scan-box empty">Vụ "' + esc(s.title) + '" không có ' + { link: 'đường link', image: 'hình ảnh', account: 'số tài khoản', profile: 'hồ sơ' }[tool.ev] + ' nào cần soi.<br><small>Thử thiết bị khác nhé!</small></div>' +
        '<button class="btn ghost small back-vb">← Quay lại ViệtBook</button></div>';
      body.innerHTML = h;
      $('.back-vb', body).onclick = () => (isMobile() ? WM.close(k) : WM.open('vietbook'));
      return;
    }
    const target = k === 'link' ? ev.url : k === 'account' ? ev.number + ' · ' + ev.bank : k === 'image' ? 'Ảnh trong vụ "' + s.title + '"' : 'Tài khoản trong vụ "' + s.title + '"';
    h += '<div class="scan-input"><span>' + esc(target) + '</span><button class="btn primary" id="scan-btn">' + (C.scanned.has(k) ? 'Soi lại' : 'Soi') + '</button></div>';
    h += '<div id="scan-out">' + (C.scanned.has(k) ? toolResult(k, ev, lv) : '<div class="scan-box empty">Bấm "Soi" để bắt đầu phân tích.</div>') + '</div>';
    h += '<button class="btn ghost small back-vb">← Quay lại ViệtBook</button></div>';
    body.innerHTML = h;
    $('.back-vb', body).onclick = () => (isMobile() ? WM.close(k) : WM.open('vietbook'));
    $('#scan-btn', body).onclick = async () => {
      const out = $('#scan-out', body);
      out.innerHTML = '<div class="scan-box scanning"><div class="scanline"></div>Đang phân tích...</div>';
      await sleep(lv >= 3 ? 300 : lv === 2 ? 700 : 1200);
      if (!C || C.id !== s.id) return;
      const firstScan = !C.scanned.has(k);
      C.scanned.add(k);
      if (lv >= 2 && ev.clue) findClue(ev.clue, true);
      if (lv >= 3 && firstScan && ev.bad) { S.money += 15; save(); floatText('+15 tiền', 'good'); renderTray(); }
      WM.refresh(k);
      WM.refresh('vietbook');
      emit('tool:' + k);
      Tutorial.highlight();
    };
  }

  function toolResult(k, ev, lv) {
    let h = '<div class="scan-box ' + (ev.bad ? 'bad' : 'good') + '"><div class="verdict">' + (ev.bad ? '⚠ NGUY HIỂM' : '✔ AN TOÀN') + '</div>';
    if (k === 'link') {
      let url = esc(ev.url);
      if (ev.highlight) url = url.replace(esc(ev.highlight), '<mark>' + esc(ev.highlight) + '</mark>');
      h += '<div class="url">' + url + '</div>';
    }
    if (k === 'account') h += '<div class="kv"><span>Chủ tài khoản</span><b>' + esc(ev.owner) + '</b></div><div class="kv"><span>Số cảnh báo</span><b>' + ev.reports + '</b></div>';
    if (k === 'profile') h += '<div class="kv"><span>Ngày tạo</span><b>' + esc(ev.created) + '</b></div><div class="kv"><span>Bạn bè</span><b>' + esc(ev.friends) + '</b></div>';
    if (lv >= 2) h += '<p>' + esc(ev.detail) + '</p>';
    else h += '<p class="muted small">Nâng cấp lên cấp 2 ở Cửa hàng để xem chi tiết và tự động ghi manh mối.</p>';
    return h + '</div>';
  }

  /* ---------- Sổ Huy hiệu ---------- */
  let badgeTab = 0;
  function renderBadges(body) {
    const r = rank();
    let h = '<div class="bb"><div class="bb-tabs">' + SCAM_TYPES.map((t, i) =>
      '<button class="bb-tab' + (i === badgeTab ? ' on' : '') + '" data-tab="' + i + '" style="--c:' + t.color + '">' + I.typeIcon(t.id, 30) + '<small>' + starsOf(t.id) + '/5</small></button>').join('') +
      '</div><div class="scroll pad">';
    h += '<div class="rank-line"><span class="rank ' + r.cls + '">' + r.name + '</span> ' + U.star + ' ' + totalStars() + '/' + SCENARIOS.length + ' · ' + badgesCount() + ' huy hiệu</div>';
    const t = SCAM_TYPES[badgeTab];
    const n = starsOf(t.id);
    const full = n >= STARS_PER_TYPE;
    h += '<div class="bb-page" style="--c:' + t.color + '"><div class="bb-medal">' + I.medal(t.id, full, 100) + '</div>' +
      '<h2>' + esc(t.name) + '</h2><div class="bb-stars">' + starRow(n) + '</div>' +
      (t.sign ? '<p class="bb-sign"><b>Dấu hiệu nhận biết:</b> ' + esc(t.sign) + '</p>' : '') +
      '<p class="muted center">' + (full ? 'Huy hiệu: <b>' + esc(t.badge) + '</b>' : 'Thu thập đủ 5 sao để nhận huy hiệu "' + esc(t.badge) + '" và mở Bí kíp phòng tránh.') + '</p>';
    h += '<h3>Quy tắc vàng đã học</h3>';
    const learned = SCENARIOS.filter(s => s.type === t.id);
    h += '<ul class="rules">' + learned.map(s => S.solved[s.id] ? '<li class="got">' + U.star + '<span><b>' + esc(s.title) + ':</b> ' + esc(s.rule) + '</span></li>' : '<li class="muted">☆ <span>??? (chưa phá vụ này)</span></li>').join('') + '</ul>';
    h += '<h3>Bí kíp phòng tránh</h3>' + (full ? '<ol class="tips">' + t.tips.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>' : '<div class="locked-tips">' + U.lock + ' Mở khóa khi đủ 5 sao</div>');
    h += '</div>';
    if (typeof HELP !== 'undefined') {
      h += '<div class="bb-page help-card"><h2>Khi gặp dấu hiệu lừa đảo</h2><ol class="tips">' + HELP.steps.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>' +
        '<h3>Chặn số lạ, báo tin rác</h3><ul class="help-list">' + HELP.block.map(x => '<li><b>' + esc(x.os) + ':</b> ' + esc(x.text) + '</li>').join('') + '</ul>' +
        '<h3>Tìm trợ giúp đáng tin cậy</h3><ul class="help-list">' + HELP.contacts.map(x => '<li><b>' + esc(x.who) + ':</b> ' + esc(x.when) + '</li>').join('') + '</ul></div>';
    }
    if (S.bossDone) h += '<div class="bb-page boss-badge"><div class="bb-medal">' + I.medal('boss', true, 100) + '</div><h2>Kẻ phá đường dây Bóng Đêm</h2><p>Huy hiệu đặc biệt dành cho thám tử đã lật mặt "Bóng Đêm".</p></div>';
    h += '</div></div>';
    body.innerHTML = h;
    $$('[data-tab]', body).forEach(b => (b.onclick = () => { badgeTab = +b.dataset.tab; WM.refresh('badges'); }));
  }

  /* ---------- Cửa hàng ---------- */
  function renderShop(body) {
    let h = '<div class="scroll pad"><div class="shop-head">' + U.coin + ' Bạn có <b>' + money(S.money) + '</b> tiền thưởng</div>';
    Object.keys(TOOLS).forEach(k => {
      const t = TOOLS[k];
      const lv = S.tools[k];
      const max = lv >= 3;
      const price = max ? 0 : t.prices[lv];
      h += '<div class="shop-item">' + I.appIcon(k, 48) + '<div class="si-main"><b>' + t.name + '</b> <span class="lv">' + (lv ? 'Cấp ' + lv : 'Chưa có') + '</span><small>' + t.desc + '</small>' +
        (max ? '' : '<small class="next">Tiếp theo: ' + LEVEL_TEXT[lv + 1] + '</small>') + '</div>' +
        (max ? '<span class="maxed">TỐI ĐA</span>' : '<button class="btn primary" data-buy="' + k + '"' + (S.money < price ? ' disabled' : '') + '>' + (lv ? 'Nâng cấp' : 'Mua') + '<br><small>' + price + ' tiền</small></button>') + '</div>';
    });
    h += '<div class="shop-item heal">' + I.appIcon('quiz', 48) + '<div class="si-main"><b>Ôn tập hồi máu</b><small>Trả lời đúng câu hỏi ôn tập để hồi +' + HEAL_QUIZ + ' máu. Miễn phí!</small></div><button class="btn" id="go-quiz">Ôn tập</button></div>';
    h += '<p class="muted small">Thiết bị giúp tìm manh mối nhanh hơn, nhưng quyết định cuối cùng vẫn là của bạn. Ngoài đời, các công cụ tương tự là: tìm kiếm ảnh ngược (Google Lens), trang canhbao.ncsc.gov.vn, và hỏi người lớn.</p></div>';
    body.innerHTML = h;
    $$('[data-buy]', body).forEach(b => (b.onclick = () => buy(b.dataset.buy)));
    $('#go-quiz', body).onclick = () => WM.open('quiz');
  }

  function buy(k) {
    const lv = S.tools[k];
    if (lv >= 3) return;
    const price = TOOLS[k].prices[lv];
    if (S.money < price) return toast('Chưa đủ tiền. Phá thêm vụ án nhé!', 'bad');
    S.money -= price;
    S.tools[k] = lv + 1;
    save();
    toast((lv ? 'Đã nâng cấp ' : 'Đã mua ') + TOOLS[k].name + ' lên cấp ' + (lv + 1) + '!', 'good');
    WM.refreshAll();
    emit('shop:buy');
  }

  /* ---------- Ôn tập hồi máu ---------- */
  let quizQ = null;
  function renderQuiz(body) {
    if (!quizQ) quizQ = { q: QUIZ[Math.floor(Math.random() * QUIZ.length)], answered: null };
    const { q, answered } = quizQ;
    let h = '<div class="scroll pad quiz"><div class="muted small">' + U.heart + ' Máu hiện tại: ' + S.hp + '/' + MAX_HP + '</div><h3>' + esc(q.q) + '</h3>';
    h += q.options.map((o, i) => {
      let cls = '';
      if (answered !== null) cls = i === q.correct ? ' right' : i === answered ? ' wrongans' : '';
      return '<button class="quiz-opt' + cls + '" data-opt="' + i + '"' + (answered !== null ? ' disabled' : '') + '>' + esc(o) + '</button>';
    }).join('');
    if (answered !== null) {
      h += '<div class="fb ' + (answered === q.correct ? 'good' : 'mid') + '"><p>' + (answered === q.correct ? 'Chính xác! ' : 'Chưa đúng. ') + esc(q.explain) + '</p></div><button class="btn primary" id="quiz-next">Câu khác</button>';
    }
    h += '</div>';
    body.innerHTML = h;
    $$('[data-opt]', body).forEach(b => (b.onclick = () => {
      quizQ.answered = +b.dataset.opt;
      if (quizQ.answered === q.correct) {
        const before = S.hp;
        S.hp = Math.min(MAX_HP, S.hp + HEAL_QUIZ);
        if (S.hp > before) floatText('+' + (S.hp - before) + ' máu', 'good');
        save();
      }
      WM.refreshAll();
    }));
    const nx = $('#quiz-next', body);
    if (nx) nx.onclick = () => {
      let q2;
      do { q2 = QUIZ[Math.floor(Math.random() * QUIZ.length)]; } while (QUIZ.length > 1 && q2 === q);
      quizQ = { q: q2, answered: null };
      WM.refresh('quiz');
    };
  }

  /* ---------- Bảng xếp hạng ---------- */
  let lbCache = null, lbLoading = false;
  function renderLeaderboard(body) {
    const u = me();
    const head = '<div class="lb-head">' + I.appIcon('leaderboard', 40) + '<div><b>Bảng xếp hạng thám tử</b><small>' +
      (Store.mode === 'online' ? 'Trực tuyến · mọi người chơi' : 'Các tài khoản trên máy này') + '</small></div><button class="btn ghost small" id="lb-refresh">Làm mới</button></div>';
    if (!lbCache) {
      body.innerHTML = '<div class="scroll pad">' + head + '<p class="muted center">Đang tải...</p></div>';
      if (!lbLoading) loadLeaderboard();
      return;
    }
    const list = lbCache;
    let h = '<div class="scroll pad lb">' + head;
    h += '<div class="lb-rule muted small">Điểm = sao × ' + SCORE_STAR + ' + huy hiệu × ' + SCORE_BADGE + ' + phá đường dây Bóng Đêm ' + SCORE_BOSS + '</div>';
    if (!list.length) {
      h += '<p class="muted center">Chưa có ai trên bảng xếp hạng. Hãy phá án để ghi điểm!</p>';
    } else {
      const top = list.slice(0, 3);
      const podium = [top[1], top[0], top[2]];
      h += '<div class="podium">' + podium.map((p, i) => {
        if (!p) return '<div class="pod empty"></div>';
        const place = [2, 1, 3][i];
        return '<div class="pod p' + place + (p.id === u.id ? ' me' : '') + '">' + (place === 1 ? '<div class="crown">♛</div>' : '') + I.player(p.avatar, place === 1 ? 64 : 52) +
          '<b>' + esc(p.name) + '</b><span>' + money(p.score) + ' điểm</span><div class="pod-base">' + place + '</div></div>';
      }).join('') + '</div>';
      h += '<div class="lb-list">' + list.map((p, i) =>
        '<div class="lb-row' + (p.id === u.id ? ' me' : '') + '"><span class="lb-pos">' + (i + 1) + '</span>' + I.player(p.avatar, 34) +
        '<span class="lb-name"><b>' + esc(p.name) + (p.id === u.id ? ' (bạn)' : '') + '</b><small>' + U.star + ' ' + p.stars + ' · ' + p.badges + ' huy hiệu' + (p.bossDone ? ' · Phá Bóng Đêm' : '') + '</small></span>' +
        '<span class="lb-score">' + money(p.score) + '</span></div>').join('') + '</div>';
    }
    if (u.guest) h += '<p class="muted small center">Bạn đang chơi chế độ khách nên không có tên trên bảng xếp hạng. Tạo tài khoản để ghi điểm.</p>';
    else if (Store.mode === 'local') h += '<p class="muted small center">Muốn xếp hạng chung với cả lớp trên mạng? Xem README, mục "Bảng xếp hạng trực tuyến".</p>';
    h += '</div>';
    body.innerHTML = h;
    $('#lb-refresh', body).onclick = () => { lbCache = null; WM.refresh('leaderboard'); };
  }
  async function loadLeaderboard() {
    lbLoading = true;
    try { lbCache = await Store.leaderboard(); }
    catch (e) { lbCache = []; toast('Không tải được bảng xếp hạng: ' + esc(e.message), 'bad'); }
    lbLoading = false;
    WM.refresh('leaderboard');
  }

  /* ---------- Trùm cuối ---------- */
  function renderBoss(body) {
    if (!bossUnlocked()) {
      body.innerHTML = '<div class="pad">Cần ít nhất ' + BOSS_NEED + ' sao ở mọi kiểu lừa đảo.</div>';
      return;
    }
    if (!bossState) {
      body.innerHTML = '<div class="scroll pad boss intro"><div class="boss-moon">' + I.appIcon('boss', 96) + '</div><h2>Lật mặt "Bóng Đêm"</h2>' +
        '<p>Đường dây "Bóng Đêm" vừa tung ra hàng loạt tin nhắn lừa đảo cùng lúc. Hãy nhận diện đúng từng chiêu trò. Sai sẽ bị trừ ' + DMG_BOSS + ' máu.</p>' +
        (S.bossDone ? '<p class="muted">Bạn đã phá đường dây này. Có thể chơi lại để ôn tập.</p>' : '') +
        '<button class="btn primary big" id="boss-go">Bắt đầu đột kích</button></div>';
      $('#boss-go', body).onclick = () => { bossState = { i: 0, done: false, wrong: [] }; WM.refresh('boss'); };
      return;
    }
    if (bossState.done) {
      body.innerHTML = '<div class="scroll pad boss intro"><div class="boss-moon win">' + I.medal('boss', true, 110) + '</div><h2>Đường dây "Bóng Đêm" đã bị lật mặt!</h2>' +
        '<p>Nhờ bằng chứng số tài khoản ' + esc(BONG_DEM_ACC) + ' mà bạn thu thập, công an đã bắt giữ kẻ cầm đầu và chặn hàng trăm tài khoản lừa đảo.</p>' +
        '<div class="boss-quote">' + I.bacTu(44) + '<p><b>Bác Tư:</b> "Ta tự hào về cháu. Từ hôm nay cháu là <b>Thám tử hạng Vàng</b>. Nhớ chia sẻ những gì đã học với bạn bè và gia đình nhé!"</p></div>' +
        '<div class="golden">Quy tắc vàng của mọi quy tắc: <b>Dừng lại, kiểm tra, hỏi người lớn</b> trước khi chuyển tiền hay gửi thông tin.</div>' +
        '<button class="btn primary" id="boss-badges">Xem Sổ Huy hiệu</button> <button class="btn" id="boss-lb">Xem bảng xếp hạng</button></div>';
      $('#boss-badges', body).onclick = () => WM.open('badges');
      $('#boss-lb', body).onclick = () => { lbCache = null; WM.open('leaderboard'); };
      return;
    }
    const r = BOSS_ROUNDS[bossState.i];
    let h = '<div class="scroll pad boss"><div class="boss-progress">' + BOSS_ROUNDS.map((x, i) => '<span class="' + (i < bossState.i ? 'ok' : i === bossState.i ? 'cur' : '') + '"></span>').join('') + '</div>';
    h += '<div class="boss-msg"><small>Tin nhắn từ: <b>' + esc(r.from) + '</b></small><p>' + esc(r.text) + '</p></div>';
    if (r.kind === 'choice') {
      h += r.options.map((o, i) => '<button class="quiz-opt" data-bopt="' + i + '">' + esc(o) + '</button>').join('');
    } else {
      h += '<div class="panel-q">Đây là chiêu lừa đảo nào?</div><div class="type-grid">' + typeButtons('data-btype', bossState.wrong) + '</div>';
    }
    h += '</div>';
    body.innerHTML = h;
    const advance = () => {
      bossState.i++; bossState.wrong = [];
      if (bossState.i >= BOSS_ROUNDS.length) {
        bossState.done = true;
        const first = !S.bossDone;
        S.bossDone = true;
        if (first) S.money += 300;
        save();
        confetti();
        WM.refreshAll();
        if (first) floatText('+300 tiền · Thám tử hạng Vàng', 'good');
        return;
      }
      floatText('✔', 'good');
      WM.refresh('boss');
    };
    $$('[data-btype]', body).forEach(b => (b.onclick = () => {
      if (b.dataset.btype === r.type) return advance();
      bossState.wrong.push(b.dataset.btype);
      if (damage(DMG_BOSS, true)) WM.refresh('boss');
    }));
    $$('[data-bopt]', body).forEach(b => (b.onclick = () => {
      if (+b.dataset.bopt === r.correct) {
        modal('<div class="fb good"><h2>Chính xác!</h2><p>' + esc(r.explain) + '</p></div>', [{ label: 'Kết thúc vụ án', onClick: advance }]);
      } else if (damage(DMG_BOSS, true)) {
        b.disabled = true; b.classList.add('wrongans');
      }
    }));
  }

  /* ---------------- Hướng dẫn "Ngày đầu đi làm" ---------------- */
  const Tutorial = (function () {
    const STEPS = [
      { text: 'Chào cháu, ta là <b>Bác Tư</b>! Hôm nay là ngày đầu cháu làm thực tập sinh ở Văn phòng Thám tử Mạng. Ta sẽ chỉ cháu cách làm việc nhé.', next: true },
      { text: 'Đầu tiên, chạm vào <b>Hộp thư vụ án</b> trên màn hình để nhận vụ án.', target: '#icons [data-app="inbox"]', on: { 'open:inbox': 2 } },
      { text: 'Đây là các hồ sơ học sinh gửi tới. Mở hồ sơ <b>"Vòng quay iPhone"</b>.', target: '[data-case="prize-1"]', on: { 'case:open': 3 } },
      { text: 'Đọc đơn trình báo, rồi bấm <b>Bắt đầu điều tra</b> để mở ViệtBook.', target: '#btn-investigate', on: { 'open:vietbook': 4 } },
      { text: 'Đây là ViệtBook. Những chỗ đáng ngờ có thể <b>chạm vào được</b>. Thử chạm vào một chỗ bạn thấy lạ, ví dụ dòng "Thanh toán 50.000đ phí vận chuyển".', target: '.vb .clue', on: { clue: 5 } },
      { text: 'Giỏi lắm! Giờ dùng <b>Kính lúp soi link</b> ở thanh thiết bị phía dưới để soi đường link trong bài. Cửa sổ mới sẽ tự mở cạnh ViệtBook.', target: '.panel [data-tool="link"]', on: { 'open:link': 6, 'tool:link': 7 } },
      { text: 'Bấm nút <b>Soi</b> để kính lúp phân tích đường link.', target: '#scan-btn', on: { 'tool:link': 7 } },
      { text: 'Thấy chữ bị tô đỏ chưa? Đó là phần tên miền giả. (Trên điện thoại, bấm "Quay lại ViệtBook".) Giờ ta thử chọn sai một lần nhé: bấm <b>Tin tưởng</b> xem chuyện gì xảy ra.', target: '[data-decide="trust"]', on: { 'decide:wrong': 8, 'decide:correct': 9 } },
      { text: 'Chọn sai thì bị <b>trừ máu</b> (xem ở thanh dưới cùng) và thấy hậu quả. Hết máu thì phải chơi lại vụ đó. Giờ chọn đúng nào: <b>Chặn & báo cáo</b>.', target: '[data-decide="report"]', on: { 'decide:correct': 9 } },
      { text: 'Bước cuối: chọn đúng <b>kiểu lừa đảo</b>. Bài đăng tặng iPhone bắt trả phí là kiểu gì nhỉ?', target: '.panel [data-type="prize"]', on: { 'case:solved': 10 } },
      { text: 'Tuyệt vời! Cháu nhận được <b>1 sao</b> và <b>tiền thưởng</b>. Tìm được càng nhiều manh mối thì càng nhiều tiền. Giờ mở <b>Cửa hàng</b>.', target: '#icons [data-app="shop"]', on: { 'open:shop': 11 } },
      { text: 'Dùng tiền để mua hoặc nâng cấp thiết bị dò tìm. Thử <b>mua Máy soi hồ sơ</b> nhé. Nó giúp xem tài khoản được tạo khi nào.', target: '[data-buy="profile"]', on: { 'shop:buy': 12 }, next: true },
      { text: 'Mở <b>Sổ Huy hiệu</b>. Mỗi kiểu lừa đảo có 5 sao. Đủ 5 sao sẽ nhận huy hiệu và mở <b>Bí kíp phòng tránh</b>.', target: '#icons [data-app="badges"]', on: { 'open:badges': 13 } },
      { text: 'Cuối cùng là <b>Bảng xếp hạng</b>. Mỗi sao, mỗi huy hiệu đều được cộng điểm. Cố gắng đứng đầu nhé!', target: '#icons [data-app="leaderboard"]', on: { 'open:leaderboard': 14 }, next: true },
      { text: 'Cháu đã sẵn sàng rồi! Mỗi vụ án chỉ cần: <b>Xem, chạm, chọn</b>. Ta đã hồi đầy máu cho cháu. Vào Hộp thư nhận vụ tiếp theo nhé. Chúc may mắn, thám tử!', next: true, last: true }
    ];
    let step = -1;
    let collapsed = false;
    const box = () => $('#tutor');

    function start() {
      step = 0; collapsed = false;
      WM.closeAll();
      C = null; inboxView = { mode: 'list' };
      WM.refreshAll();
      render();
    }
    function stop() { step = -1; box().classList.add('hidden'); clearHL(); document.body.classList.remove('tut-bottom'); }
    function finish() {
      stop();
      S.tutorialDone = true;
      S.hp = MAX_HP;
      save();
      WM.refreshAll();
    }
    function render() {
      if (step < 0) return;
      const st = STEPS[step];
      const b = box();
      b.classList.remove('hidden');
      b.classList.toggle('collapsed', collapsed);
      b.innerHTML = collapsed
        ? '<button class="tut-open">' + I.bacTu(28) + ' Bác Tư</button>'
        : '<div class="tut-av">' + I.bacTu(52) + '</div><div class="tut-body"><div class="tut-name">Bác Tư <small>Hướng dẫn ' + (step + 1) + '/' + STEPS.length + '</small></div><div class="tut-text">' + st.text + '</div>' +
          '<div class="tut-btns">' + (st.next ? '<button class="btn primary small" id="tut-next">' + (st.last ? 'Bắt đầu!' : 'Tiếp') + '</button>' : '') +
          (st.last ? '' : '<button class="btn ghost small" id="tut-skip">Bỏ qua hướng dẫn</button>') + '<button class="btn ghost small" id="tut-min" title="Thu gọn">▾</button></div></div>';
      const n = $('#tut-next'); if (n) n.onclick = () => (st.last ? finish() : go(step + 1));
      const sk = $('#tut-skip'); if (sk) sk.onclick = () => modal('<h2>Bỏ qua hướng dẫn?</h2><p>Bạn có thể chơi lại hướng dẫn bất cứ lúc nào trong menu Bắt đầu.</p>', [{ label: 'Tiếp tục học', cls: 'ghost' }, { label: 'Bỏ qua', onClick: finish }]);
      const mn = $('#tut-min'); if (mn) mn.onclick = () => { collapsed = true; render(); };
      const op = $('.tut-open'); if (op) op.onclick = () => { collapsed = false; render(); };
      highlight();
    }
    function go(i) { step = i; collapsed = false; render(); }
    function clearHL() { $$('.tut-pulse').forEach(e => e.classList.remove('tut-pulse')); }
    function highlight() {
      clearHL();
      if (step < 0) return;
      const st = STEPS[step];
      if (!st.target) { place(null); return; }
      requestAnimationFrame(() => {
        clearHL();
        const els = $$(st.target).filter(e => e.offsetParent !== null);
        els.slice(0, st.target === '.vb .clue' ? 99 : 1).forEach(e => e.classList.add('tut-pulse'));
        // Cuộn tới chỗ cần bấm nếu nó đang nằm ngoài màn hình (hay gặp trên điện thoại)
        if (els[0]) {
          const r = els[0].getBoundingClientRect();
          if (r.top < 60 || r.bottom > window.innerHeight - 70) els[0].scrollIntoView({ block: 'center' });
        }
        place(els[0]);
      });
    }
    // Đặt Bác Tư ở góc màn hình không che mất chỗ cần bấm
    function place(target) {
      const b = box();
      if (collapsed) { b.style.cssText = ''; document.body.classList.remove('tut-bottom'); return; }
      const W = window.innerWidth, H = window.innerHeight, tb = 56, m = 12;
      const bw = b.offsetWidth, bh = b.offsetHeight;
      const corners = isMobile()
        ? [[m, 46], [m, H - tb - bh - m]]
        : [[W - bw - m, H - tb - bh - m], [m, H - tb - bh - m], [W - bw - m, m], [m, m]];
      let pick = corners[0];
      if (target) {
        const r = target.getBoundingClientRect();
        const pad = 10;
        pick = corners.find(([x, y]) => !(x < r.right + pad && x + bw > r.left - pad && y < r.bottom + pad && y + bh > r.top - pad)) || corners[0];
      }
      b.style.left = pick[0] + 'px';
      b.style.top = pick[1] + 'px';
      document.body.classList.toggle('tut-bottom', pick[1] > H / 2);
      b.style.right = 'auto';
      b.style.bottom = 'auto';
    }
    function on(evt) {
      if (step < 0) return;
      const st = STEPS[step];
      if (st.on && st.on[evt] !== undefined) setTimeout(() => go(st.on[evt]), 350);
    }
    return { start, stop, on, highlight, active: () => step >= 0 };
  })();

  /* ---------------- Màn hình khóa & đăng nhập ---------------- */
  let lockView = 'lock';
  let regAvatar = 0;
  let loginPrefill = '';

  function showLock(view) {
    lockView = view || 'lock';
    document.body.classList.add('locked');
    $('#lock').classList.remove('hidden');
    renderLock();
  }

  function renderLock(err) {
    const el = $('#lock');
    const modeNote = Store.mode === 'online'
      ? '<span class="mode on">● Trực tuyến: đăng nhập ở máy nào cũng được</span>'
      : '<span class="mode">● Tài khoản lưu trên trình duyệt của máy này</span>';
    const sys = '<div class="lock-sys">' + U.wifi + U.volume + U.battery + '</div>';
    if (lockView === 'lock') {
      el.className = 'lock-screen';
      el.innerHTML = '<div class="lock-clock"><div id="lock-time"></div><div id="lock-date"></div></div>' +
        '<div class="lock-brand">' + I.appIcon('logo', 40) + '<span><b>Thám Tử Mạng</b><small>Hồ Sơ Lừa Đảo</small></span></div>' +
        '<div class="lock-hint">Nhấn vào màn hình hoặc phím bất kỳ để đăng nhập</div>' + sys;
      tickClock();
      el.onclick = () => { lockView = 'login'; renderLock(); };
      return;
    }
    el.onclick = null;
    el.className = 'lock-screen blur';
    const accounts = Store.localAccounts();
    let card = '';
    if (lockView === 'login') {
      const pre = accounts.find(a => a.username === loginPrefill);
      card = '<div class="login-card">' +
        (pre ? I.player(pre.avatar, 120) : '<div class="login-logo">' + I.appIcon('logo', 120) + '</div>') +
        '<h1>' + (pre ? esc(pre.name) : 'Thám Tử Mạng') + '</h1>' +
        '<form id="login-form" autocomplete="on">' +
        '<input id="li-user" placeholder="Tên đăng nhập" autocomplete="username" value="' + esc(loginPrefill) + '"' + (pre ? ' class="hidden"' : '') + '>' +
        '<div class="pw-row"><input id="li-pass" type="password" placeholder="Mật khẩu" autocomplete="current-password"><button type="submit" class="pw-go" title="Đăng nhập">' + U.arrow + '</button></div>' +
        (err ? '<div class="login-err">' + esc(err) + '</div>' : '') +
        '</form>' +
        (pre ? '<button class="link-btn" id="li-other">Đăng nhập tài khoản khác</button>' : '') +
        '<button class="link-btn" id="li-new">Chưa có tài khoản? <b>Tạo tài khoản mới</b></button>' +
        '<button class="link-btn dim" id="li-guest">Chơi thử không cần tài khoản</button>' +
        modeNote + '</div>';
    } else {
      card = '<div class="login-card reg">' +
        '<h1>Tạo tài khoản thám tử</h1>' +
        '<div class="av-pick">' + I.PLAYER_AVATARS.map((a, i) => '<button type="button" class="av-opt' + (i === regAvatar ? ' on' : '') + '" data-av="' + i + '">' + I.player(i, 52) + '</button>').join('') + '</div>' +
        '<form id="reg-form">' +
        '<input id="rg-name" placeholder="Tên hiển thị (ví dụ: Minh Anh 7A)" maxlength="24">' +
        '<input id="rg-user" placeholder="Tên đăng nhập (chữ thường, không dấu)" autocomplete="username" maxlength="20">' +
        '<input id="rg-pass" type="password" placeholder="Mật khẩu (ít nhất 6 ký tự)" autocomplete="new-password">' +
        '<input id="rg-pass2" type="password" placeholder="Nhập lại mật khẩu" autocomplete="new-password">' +
        (err ? '<div class="login-err">' + esc(err) + '</div>' : '') +
        '<button type="submit" class="btn primary big">Tạo tài khoản</button></form>' +
        '<button class="link-btn" id="rg-back">← Quay lại đăng nhập</button>' +
        '<p class="tiny">Không dùng tên thật đầy đủ hay mật khẩu giống tài khoản mạng xã hội của bạn.</p>' +
        modeNote + '</div>';
    }
    const users = accounts.length && lockView === 'login'
      ? '<div class="user-list">' + accounts.map(a => '<button class="ul-item' + (a.username === loginPrefill ? ' on' : '') + '" data-acc="' + esc(a.username) + '">' + I.player(a.avatar, 36) + '<span>' + esc(a.name) + '</span></button>').join('') +
        '<button class="ul-item" data-acc="">' + '<span class="ul-new">' + U.user + '</span><span>Tài khoản khác</span></button></div>'
      : '';
    el.innerHTML = card + users + sys;

    if (lockView === 'login') {
      const f = $('#login-form');
      f.onsubmit = async e => {
        e.preventDefault();
        const u = $('#li-user').value, p = $('#li-pass').value;
        setBusy(true);
        try { await Store.login(u, p); await startSession(); }
        catch (er) { setBusy(false); loginPrefill = String(u).trim().toLowerCase(); renderLock(er.message); }
      };
      setTimeout(() => { const t = loginPrefill ? $('#li-pass') : $('#li-user'); if (t && !isMobile()) t.focus(); }, 30);
      const o = $('#li-other'); if (o) o.onclick = () => { loginPrefill = ''; renderLock(); };
      $('#li-new').onclick = () => { lockView = 'register'; renderLock(); };
      $('#li-guest').onclick = async () => { Store.guest(); await startSession(); };
      $$('[data-acc]').forEach(b => (b.onclick = () => { loginPrefill = b.dataset.acc; renderLock(); }));
    } else {
      $$('[data-av]').forEach(b => (b.onclick = () => {
        regAvatar = +b.dataset.av;
        $$('.av-opt').forEach(x => x.classList.toggle('on', +x.dataset.av === regAvatar));
      }));
      $('#rg-back').onclick = () => { lockView = 'login'; renderLock(); };
      $('#reg-form').onsubmit = async e => {
        e.preventDefault();
        const name = $('#rg-name').value, user = $('#rg-user').value, p1 = $('#rg-pass').value, p2 = $('#rg-pass2').value;
        if (p1 !== p2) return keepReg('Hai mật khẩu không giống nhau.');
        setBusy(true);
        try { await Store.register(user, p1, name, regAvatar); await startSession(true); }
        catch (er) { setBusy(false); keepReg(er.message); }
        function keepReg(msg) {
          renderLock(msg);
          $('#rg-name').value = name; $('#rg-user').value = user;
        }
      };
    }
  }

  function setBusy(b) { $('#lock').classList.toggle('busy', b); }

  async function startSession(isNew) {
    const data = await Store.loadSave();
    S = Object.assign(freshState(), data || {});
    if (!data) save();
    C = null; inboxView = { mode: 'list' }; bossState = null; lbCache = null; quizQ = null;
    $('#lock').classList.add('hidden');
    $('#lock').classList.remove('busy');
    document.body.classList.remove('locked');
    WM.closeAll();
    renderIcons();
    renderTray();
    renderTaskbar();
    const u = me();
    if (!S.tutorialDone) setTimeout(Tutorial.start, 500);
    else toast('Chào mừng trở lại, <b>' + esc(u.name) + '</b>!', 'good');
    if (isNew) toast('Đã tạo tài khoản <b>' + esc(u.name) + '</b>.', 'good');
  }

  async function logout() {
    Tutorial.stop();
    WM.closeAll();
    C = null;
    const last = me();
    await Store.logout();
    loginPrefill = last.guest ? '' : last.username;
    showLock('login');
  }

  /* ---------------- Khởi động ---------------- */
  async function boot() {
    $('#start-btn').innerHTML = I.appIcon('logo', 28);
    $('.tbs-ico').innerHTML = U.search;
    $('#hp-ico').innerHTML = U.heart;
    $('#money-ico').innerHTML = U.coin;
    $('#star-ico').innerHTML = U.star;
    $('#tray-sys').innerHTML = U.wifi + U.volume + U.battery;
    tickClock();
    setInterval(tickClock, 15000);
    $('#start-btn').onclick = e => { e.stopPropagation(); toggleStart(); };
    $('#tb-search').onclick = e => { e.stopPropagation(); toggleStart(true); };
    document.addEventListener('click', e => {
      if (!e.target.closest('#start-menu')) $('#start-menu').classList.add('hidden');
    });
    document.addEventListener('keydown', e => {
      if (lockView === 'lock' && !$('#lock').classList.contains('hidden')) { lockView = 'login'; renderLock(); }
      if (e.key === 'Escape') { toggleStart(false); closeModal(); }
    });
    $('#modal-bg').addEventListener('click', e => { if (e.target.id === 'modal-bg') closeModal(); });
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => WM.layout(), 120); });

    document.body.classList.add('locked');
    const user = await Store.init();
    if (user) await startSession();
    else showLock('lock');
  }

  // Cho phép kiểm thử từ console
  window.ThamTuMang = { state: () => S, Tutorial, WM };

  boot();
})();
