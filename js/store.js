/* =========================================================
   TÀI KHOẢN, LƯU TIẾN TRÌNH, BẢNG XẾP HẠNG
   - Chế độ "local": lưu trong localStorage của trình duyệt.
   - Chế độ "online": dùng Firebase (Authentication + Firestore)
     khi js/config.js có FIREBASE_CONFIG.
   ========================================================= */
(function () {
  'use strict';
  const USERS_KEY = 'ttm_users';
  const SESSION_KEY = 'ttm_session';
  const SAVE_PREFIX = 'ttm_save_';
  const GUEST = '__khach__';
  const EMAIL_DOMAIN = '@thamtumang.game';
  const FB_VER = '10.12.2';

  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  // Băm mật khẩu (đủ cho game ở chế độ trên máy, không phải bảo mật ngân hàng)
  function hashPw(user, pw) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    const str = user.toLowerCase() + '|' + pw + '|ttm';
    for (let i = 0; i < str.length; i++) {
      const ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16);
  }

  function validUsername(u) { return /^[a-z0-9_.]{3,20}$/.test(u); }
  function normUser(u) { return String(u || '').trim().toLowerCase(); }

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = () => rej(new Error('Không tải được ' + src));
      document.head.appendChild(s);
    });
  }

  const FB_ERRORS = {
    'auth/email-already-in-use': 'Tên đăng nhập này đã có người dùng.',
    'auth/invalid-credential': 'Sai tên đăng nhập hoặc mật khẩu.',
    'auth/wrong-password': 'Sai mật khẩu.',
    'auth/user-not-found': 'Không tìm thấy tài khoản này.',
    'auth/weak-password': 'Mật khẩu cần ít nhất 6 ký tự.',
    'auth/too-many-requests': 'Thử sai quá nhiều lần. Đợi một lát rồi thử lại.',
    'auth/network-request-failed': 'Không có kết nối mạng.'
  };
  const fbMsg = e => FB_ERRORS[e && e.code] || (e && e.message) || 'Có lỗi xảy ra.';

  let mode = 'local';
  let fb = null; // { auth, db }
  let user = null; // { id, username, name, avatar, guest }
  let saveTimer = null;

  const Store = {
    get mode() { return mode; },
    get user() { return user; },

    async init() {
      const cfg = window.FIREBASE_CONFIG;
      if (cfg && cfg.apiKey) {
        try {
          const base = 'https://www.gstatic.com/firebasejs/' + FB_VER + '/';
          await loadScript(base + 'firebase-app-compat.js');
          await loadScript(base + 'firebase-auth-compat.js');
          await loadScript(base + 'firebase-firestore-compat.js');
          firebase.initializeApp(cfg);
          fb = { auth: firebase.auth(), db: firebase.firestore() };
          mode = 'online';
          // Khôi phục phiên đăng nhập cũ
          const fu = await new Promise(r => { const off = fb.auth.onAuthStateChanged(u => { off(); r(u); }); });
          if (fu) user = await this._profile(fu.uid);
        } catch (e) {
          console.warn('Firebase lỗi, dùng chế độ trên máy:', e);
          mode = 'local';
        }
      }
      if (mode === 'local') {
        const sid = ls.get(SESSION_KEY, null);
        const users = ls.get(USERS_KEY, {});
        if (sid && users[sid]) user = { id: sid, username: sid, name: users[sid].name, avatar: users[sid].avatar };
      }
      return user;
    },

    // Danh sách tài khoản trên máy (hiện ở màn hình đăng nhập)
    localAccounts() {
      if (mode !== 'local') return [];
      const users = ls.get(USERS_KEY, {});
      return Object.keys(users).map(k => ({ username: k, name: users[k].name, avatar: users[k].avatar }));
    },

    async register(username, password, name, avatar) {
      username = normUser(username);
      name = String(name || '').trim().slice(0, 24);
      if (!name) throw new Error('Hãy nhập tên hiển thị.');
      if (!validUsername(username)) throw new Error('Tên đăng nhập dài 3 đến 20 ký tự, chỉ gồm chữ thường không dấu, số, dấu chấm hoặc gạch dưới.');
      if (String(password).length < 6) throw new Error('Mật khẩu cần ít nhất 6 ký tự.');
      if (mode === 'online') {
        try {
          const cred = await fb.auth.createUserWithEmailAndPassword(username + EMAIL_DOMAIN, password);
          await fb.db.collection('players').doc(cred.user.uid).set({
            username, name, avatar, score: 0, stars: 0, badges: 0, bossDone: false, save: null,
            updated: firebase.firestore.FieldValue.serverTimestamp()
          });
          user = { id: cred.user.uid, username, name, avatar };
          return user;
        } catch (e) { throw new Error(fbMsg(e)); }
      }
      const users = ls.get(USERS_KEY, {});
      if (users[username]) throw new Error('Tên đăng nhập này đã có người dùng trên máy này.');
      users[username] = { name, avatar, pw: hashPw(username, password), created: Date.now() };
      ls.set(USERS_KEY, users);
      ls.set(SESSION_KEY, username);
      user = { id: username, username, name, avatar };
      return user;
    },

    async login(username, password) {
      username = normUser(username);
      if (!username || !password) throw new Error('Hãy nhập tên đăng nhập và mật khẩu.');
      if (mode === 'online') {
        try {
          const cred = await fb.auth.signInWithEmailAndPassword(username + EMAIL_DOMAIN, password);
          user = await this._profile(cred.user.uid);
          return user;
        } catch (e) { throw new Error(fbMsg(e)); }
      }
      const users = ls.get(USERS_KEY, {});
      const u = users[username];
      if (!u || u.pw !== hashPw(username, password)) throw new Error('Sai tên đăng nhập hoặc mật khẩu.');
      ls.set(SESSION_KEY, username);
      user = { id: username, username, name: u.name, avatar: u.avatar };
      return user;
    },

    guest() {
      user = { id: GUEST, username: GUEST, name: 'Khách', avatar: 0, guest: true };
      return user;
    },

    async logout() {
      await this.flush();
      if (mode === 'online' && fb) await fb.auth.signOut();
      ls.del(SESSION_KEY);
      user = null;
    },

    async _profile(uid) {
      const doc = await fb.db.collection('players').doc(uid).get();
      const d = doc.exists ? doc.data() : {};
      this._remote = d.save || null;
      return { id: uid, username: d.username || '', name: d.name || 'Thám tử', avatar: d.avatar || 0 };
    },

    async loadSave() {
      if (!user) return null;
      if (mode === 'online' && !user.guest) {
        if (this._remote === undefined) await this._profile(user.id);
        return this._remote || null;
      }
      return ls.get(SAVE_PREFIX + user.id, null);
    },

    // summary: { score, stars, badges, bossDone }
    save(state, summary) {
      if (!user) return;
      if (user.guest || mode === 'local') {
        ls.set(SAVE_PREFIX + user.id, state);
        if (!user.guest) {
          const users = ls.get(USERS_KEY, {});
          if (users[user.id]) { users[user.id].summary = summary; ls.set(USERS_KEY, users); }
        }
        return;
      }
      this._pending = { state, summary };
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => this.flush(), 1500);
    },

    async flush() {
      clearTimeout(saveTimer);
      if (mode !== 'online' || !this._pending || !user || user.guest) return;
      const { state, summary } = this._pending;
      this._pending = null;
      try {
        await fb.db.collection('players').doc(user.id).set(Object.assign({
          username: user.username, name: user.name, avatar: user.avatar,
          save: JSON.parse(JSON.stringify(state)),
          updated: firebase.firestore.FieldValue.serverTimestamp()
        }, summary), { merge: true });
      } catch (e) { console.warn('Lưu online lỗi:', e); }
    },

    async resetSave() {
      if (!user) return;
      if (mode === 'online' && !user.guest) {
        this._pending = null;
        this._remote = null;
        await fb.db.collection('players').doc(user.id).set({ save: null, score: 0, stars: 0, badges: 0, bossDone: false }, { merge: true });
      } else {
        ls.del(SAVE_PREFIX + user.id);
        const users = ls.get(USERS_KEY, {});
        if (users[user.id]) { delete users[user.id].summary; ls.set(USERS_KEY, users); }
      }
    },

    // Trả về [{ id, name, avatar, score, stars, badges, bossDone }]
    async leaderboard() {
      if (mode === 'online') {
        await this.flush();
        const snap = await fb.db.collection('players').orderBy('score', 'desc').limit(50).get();
        return snap.docs.map(d => Object.assign({ id: d.id }, d.data())).map(p => ({
          id: p.id, name: p.name, avatar: p.avatar, score: p.score || 0, stars: p.stars || 0, badges: p.badges || 0, bossDone: !!p.bossDone
        }));
      }
      const users = ls.get(USERS_KEY, {});
      return Object.keys(users).map(k => {
        const s = users[k].summary || {};
        return { id: k, name: users[k].name, avatar: users[k].avatar, score: s.score || 0, stars: s.stars || 0, badges: s.badges || 0, bossDone: !!s.bossDone };
      }).sort((a, b) => b.score - a.score);
    }
  };

  window.addEventListener('beforeunload', () => { Store.flush(); });
  window.Store = Store;
})();
