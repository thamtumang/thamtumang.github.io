const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function fixture(online = false) {
  const memory = new Map();
  const calls = { signIn: 0, writes: 0 };
  const auth = {
    onAuthStateChanged(cb) { queueMicrotask(() => cb(null)); return () => {}; },
    async signInWithEmailAndPassword() { calls.signIn++; throw { code: 'auth/invalid-credential' }; },
    async signOut() {}
  };
  const context = {
    window: { addEventListener() {}, FIREBASE_CONFIG: online ? { apiKey: 'local-fixture' } : undefined },
    localStorage: { getItem: k => memory.get(k) ?? null, setItem: (k, v) => memory.set(k, v), removeItem: k => memory.delete(k) },
    document: { createElement: () => ({}), head: { appendChild: s => queueMicrotask(() => s.onload()) } },
    firebase: { initializeApp() {}, auth: () => auth, firestore: () => ({ collection() { calls.writes++; throw Error('Unexpected Firestore access'); } }) },
    setTimeout, clearTimeout, console
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('js/store.js', 'utf8'), context);
  return { store: context.window.Store, memory, calls };
}
(async () => {
  const { store, memory } = fixture();
  await store.init();
  await store.register('student_demo', 'Student123', 'Học sinh', 0);
  store.save({ hp: 72, solved: { 'prize-1': true } }, { stars: 1, score: 10 });
  const normalSave = memory.get('ttm_save_student_demo');
  store.guest();
  store.save({ hp: 55 }, {});
  const guestSave = memory.get('ttm_save___khach__');
  await assert.rejects(store.login('admin_test', 'wrong'));
  assert.equal(store.user.id, '__khach__');
  await store.login(' ADMIN_TEST ', 'Test@12345');
  assert.equal(store.user.test, true);
  assert.equal(store.user.guest, true);
  assert.equal(store.user.id, '__admin_test__');
  assert.equal(await store.loadSave(), null);
  store.save({ hp: 100, solved: { 'loan-6': true } }, { stars: 1, score: 10 });
  assert.equal(memory.get('ttm_save_student_demo'), normalSave);
  assert.equal(memory.get('ttm_save___khach__'), guestSave);
  assert.equal((await store.leaderboard()).length, 1);
  await store.resetSave();
  assert.equal(await store.loadSave(), null);
  assert.equal(memory.get('ttm_save_student_demo'), normalSave);
  await store.login('student_demo', 'Student123');
  assert.equal(store.user.test, undefined);
  assert.equal((await store.loadSave()).hp, 72);
  await assert.rejects(store.register('admin_test', 'Anything123', 'Other', 0));

  const cloud = fixture(true);
  await cloud.store.init();
  assert.equal(cloud.store.mode, 'online');
  await assert.rejects(cloud.store.login('admin_test', 'wrong'));
  assert.equal(cloud.calls.signIn, 0);
  await cloud.store.login('admin_test', 'Test@12345');
  cloud.store.save({ hp: 100 }, {});
  await cloud.store.flush();
  await cloud.store.resetSave();
  assert.equal(cloud.calls.signIn, 0);
  assert.equal(cloud.calls.writes, 0);
  await assert.rejects(cloud.store.login('ordinary_user', 'wrong'));
  assert.equal(cloud.calls.signIn, 1);
  console.log('PASS: demo login, wrong password, reserved name, isolated saves, leaderboard exclusion, normal login, cloud bypass without Firestore writes.');
})().catch(error => { console.error(error); process.exitCode = 1; });
