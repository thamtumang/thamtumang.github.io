(() => {
  'use strict';
  const key = 'thamtumang.ca-truc.progress.v1';
  const host = document.getElementById('shift-game');
  const read = () => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  };
  const write = value => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      if (document.querySelector('.shift-save-warning')) return;
      const warning = document.createElement('p');
      warning.className = 'shift-save-warning';
      warning.setAttribute('role', 'status');
      warning.textContent = 'Trình duyệt không lưu được tiến trình. Bạn vẫn có thể chơi trong lượt này.';
      host.before(warning);
    }
  };
  window.ShiftGame.mount(host, { read, write });
})();
