(() => {
  'use strict';
  const host = document.getElementById('case');
  const storageKey = 'thamtumang.ca-truc.vy-phien-moi.v1';
  const opening = [
    ['vy', 'Tớ làm ba lượt được 45k thật rồi. Chị ấy bảo nạp 500k mới mở nhiệm vụ tiếp.'],
    ['vy', 'Tớ nhập số tiền rồi. Cậu xem giúp tớ với.']
  ];
  const evidence = {
    post: ['Bài tuyển', 'Không phải ứng tiền hoặc mua hàng để nhận việc.'],
    task: ['Tin nhắn', 'Chuyển trước 500.000đ để mở nhiệm vụ VIP.'],
    receipt: ['Biên lai', '45.000đ đã vào tài khoản.'],
    school: ['Xác nhận của trường', 'Trường không liên kết với nhóm tuyển này.']
  };
  const fresh = () => ({
    status: 'pending', messages: opening.slice(), pinned: [], selected: [],
    called: false, claimed: false, verifiedWith: '', code: false, proof: false,
    stopped: false, submitted: false
  });
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved?.version === 1) return saved.state;
    } catch {}
    return fresh();
  }
  let s = load();
  let panel = '';
  let picked = '';
  let feedback = '';
  let historyItem = '';
  let motion = '';
  const esc = text => String(text).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({version: 1, state: s})); } catch {}
  }
  function say(who, text) { s.messages.push([who, text]); }
  function open(view) { panel = view; picked = ''; feedback = ''; historyItem = ''; }
  function replyWithEvidence() {
    const selected = s.selected;
    if (!selected.length) return;
    say('me', 'Mình gửi cậu: ' + selected.map(id => evidence[id][0]).join(' + ') + '.');
    const mismatch = selected.includes('post') && selected.includes('task');
    const verified = selected.includes('school') && s.called && s.claimed;
    if (mismatch || verified) {
      s.status = 'cancelled';
      s.verifiedWith = mismatch ? 'Hai điều kiện mâu thuẫn' : 'Đã xác minh với trường';
      say('vy', mismatch
        ? 'Bài tuyển bảo không ứng tiền mà giờ lại đòi nạp trước. Ừ, tớ hủy giao dịch đây.'
        : 'Chị ấy nói làm với trường mình, mà trường vừa xác nhận không có. Tớ hủy giao dịch nhé.');
    } else {
      s.status = 'paused';
      say('vy', selected.includes('receipt')
        ? 'Ừ, 45k vào thật. Nhưng biên lai đó có nói được nạp 500k rồi sẽ lấy lại không? Tớ khoan chuyển.'
        : 'Tớ khoan chuyển. Mình còn kiểm tra được điều họ nói ở đâu nữa?');
    }
    s.selected = [];
    open('');
  }
  function dispatch(action, id) {
    motion = '';
    const previousStatus = s.status;
    if (action === 'reset') {
      if (!window.confirm('Bắt đầu lại ca Vy? Lượt ca Vy hiện tại sẽ được thay thế.')) return;
      s = fresh(); open('');
    } else if (action === 'open') {
      open(id);
    } else if (action === 'close') {
      open('');
    } else if (action === 'pause' && s.status === 'pending') {
      s.status = 'paused';
      say('me', 'Khoan chuyển. Để mình kiểm tra với cậu.');
      say('vy', 'Ừ, tớ để đấy. Tớ gửi cậu mấy ảnh lúc đăng ký nhé.');
    } else if (action === 'pick') {
      picked = id;
      feedback = '';
    } else if (action === 'pin' || action === 'drop-pin') {
      const clue = action === 'drop-pin' ? id : picked;
      if (!evidence[clue]) {
        feedback = 'Chi tiết này cho biết bối cảnh. Thử tìm một câu hoặc trạng thái giúp cậu giải thích chuyện đang xảy ra.';
      } else if (s.pinned.includes(clue)) {
        feedback = 'Mảnh này đã có trong khay bằng chứng.';
      } else {
        s.pinned.push(clue);
        motion = 'pin';
        feedback = 'Đã ghim vào khay bằng chứng.';
      }
    } else if (action === 'claim' && !s.claimed) {
      s.claimed = true;
      feedback = '';
    } else if (action === 'call' && !s.called) {
      s.called = true;
      motion = 'call';
      feedback = '';
    } else if ((action === 'select' || action === 'attach') && s.pinned.includes(id)) {
      if (s.selected.includes(id)) {
        if (action === 'select') s.selected = s.selected.filter(item => item !== id);
      }
      else s.selected = [...s.selected.slice(-1), id];
    } else if (action === 'send' && ['pending','paused'].includes(s.status)) {
      replyWithEvidence();
    } else if (action === 'proceed' && ['pending','paused'].includes(s.status)) {
      s.status = 'paid';
      say('me', 'Cậu cứ thử chuyển 500k đi.');
      say('vy', 'Tớ chuyển rồi. Giờ họ bảo nạp thêm phí mở khóa mới rút được. Tớ phải làm sao?');
      open('recover');
    } else if (action === 'stop' && s.status === 'paid' && !s.stopped) {
      s.stopped = true;
      say('me', 'Dừng chuyển thêm nhé. Mình lưu lại thông tin giao dịch.');
      say('vy', 'Tớ dừng rồi. Mình tìm lại khoản 500k nhé.');
    } else if (action === 'history') {
      historyItem = id; picked = '';
      feedback = id === 'sent' ? '' : 'Đây là khoản khác. Tìm khoản 500.000đ đã chuyển cho người tuyển.';
    } else if (action === 'copy-code' && picked === 'paid-code') {
      s.code = true;
      feedback = 'Đã ghi mã giao dịch vào hồ sơ hỗ trợ.';
    } else if (action === 'save-proof' && s.status === 'paid') {
      s.proof = true;
      motion = 'snapshot';
      feedback = 'Đã lưu ảnh giao dịch trong mô phỏng.';
    } else if (action === 'submit' && s.stopped && s.code && s.proof) {
      s.submitted = true;
      say('vy', 'Tớ có mã và ảnh giao dịch rồi. Tớ sẽ nhờ người lớn hỗ trợ liên hệ ngân hàng qua kênh chính thức.');
      open('');
    }
    if (previousStatus !== s.status || action === 'submit') motion = 'reaction';
    save();
    render(action === 'open' || action === 'close' || action === 'send' || action === 'proceed' || action === 'submit' || action === 'reset' ? '' : action + ':' + id);
  }

  function btn(label, action, id = '', extra = '') {
    return '<button type="button" data-act="'+action+'" data-id="'+id+'" '+extra+'>'+esc(label)+'</button>';
  }
  const glyphs = {
    album: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="m4 17 5-5 4 4 3-3 4 4"/>',
    contacts: '<path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6zM3 8h5m-5 8h5"/><circle cx="13" cy="9" r="2"/><path d="M10 16c0-4 6-4 6 0"/>',
    receipt: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2zM8 8h8m-8 4h8m-8 4h5"/>',
    send: '<path d="m3 10 18-7-7 18-3-8-8-3Zm8 3 5-5"/>',
    pause: '<path d="M9 5v14m6-14v14"/>',
    phone: '<path d="M7 3 4 5c-3 4 7 16 12 16l4-4-4-4-3 2-4-4 2-3-4-5Z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    camera: '<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/>',
    pin: '<path d="m8 3 8 0-1 6 4 4v2H5v-2l4-4-1-6Zm4 12v6"/>'
  };
  function icon(name) {
    return '<svg class="glyph" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+glyphs[name]+'</svg>';
  }
  function portrait() {
    const mood = s.status === 'cancelled' || s.submitted ? 'relief' : s.status === 'paid' && !s.stopped ? 'alarm' :
      s.status === 'paused' || s.stopped ? 'focus' : 'worry';
    const mouths = {relief:'M38 55q7 9 14 0',alarm:'M42 57q3-8 6 0q-3 3-6 0',focus:'M40 57h10',worry:'M40 58q5-5 10 0'};
    return '<svg class="vy-portrait '+mood+'" viewBox="0 0 90 90" aria-hidden="true">'+
      '<rect width="90" height="90" rx="25" fill="#eddcc1"/><path d="M66 29q15 5 9 29l-11-3Z" fill="#27343a"/>'+
      '<path d="M19 84q3-17 19-20h14q17 3 19 20v6H19Z" fill="#426e67"/><path d="M37 65l8 10 8-10 7 4-10 12-5-4-5 4-10-12Z" fill="#fff9e8"/>'+
      '<path d="M38 59h14v10l-7 5-7-5Z" fill="#db9d7d"/><ellipse cx="45" cy="42" rx="21" ry="25" fill="#27343a"/>'+
      '<circle cx="25" cy="46" r="4.5" fill="#e9af8f"/><circle cx="65" cy="46" r="4.5" fill="#e9af8f"/>'+
      '<path d="M28 40q18 0 25-12 3 9 9 12v9a17 17 0 0 1-34 0Z" fill="#f3bf9e"/>'+
      '<path d="M32 38q12-3 20-14 1 10 11 16l-1-10q-13-14-28-4Z" fill="#27343a"/>'+
      '<ellipse cx="34" cy="52" rx="3.6" ry="1.8" fill="#e89487"/><ellipse cx="56" cy="52" rx="3.6" ry="1.8" fill="#e89487"/>'+
      (mood==='relief'?'<path d="M34 46q3-4 6 0m10 0q3-4 6 0" stroke="#27343a" fill="none" stroke-width="2" stroke-linecap="round"/>':
      '<g fill="#27343a"><circle cx="37" cy="46" r="2"/><circle cx="53" cy="46" r="2"/></g>')+
      '<path d="'+mouths[mood]+'" fill="none" stroke="#8a4e48" stroke-width="2.2" stroke-linecap="round"/></svg>';
  }
  function toolButton(label, image, action, id='', extra='') {
    return '<button type="button" class="visual-tool '+extra+'" data-act="'+action+'" data-id="'+id+'">'+
      icon(image)+'<span>'+esc(label)+'</span></button>';
  }
  function line(id, text) {
    return btn(text, 'pick', id, 'class="hotspot" aria-pressed="'+(picked === id)+'"'+
      (evidence[id]?' draggable="true" data-drag-clue="'+id+'"':''));
  }
  function clueTile(id, interactive) {
    const image = {post:'album',task:'contacts',receipt:'receipt',school:'phone'}[id];
    const content = icon(image)+'<span><b>'+esc(evidence[id][0])+'</b>'+
      (interactive?'<small>'+esc(evidence[id][1])+'</small>':'')+'</span>';
    return interactive ?
      '<button class="clue-tile kind-'+id+'" data-act="select" data-id="'+id+'" data-drag-card="'+id+
      '" draggable="true" aria-pressed="'+s.selected.includes(id)+'">'+content+'</button>' :
      '<span class="clue-chip kind-'+id+'">'+content+'</span>';
  }
  function pinBar() {
    return '<div class="pinbar"><div class="clue-tray'+(motion==='pin'?' pop':'')+'" data-drop="pin">'+
      icon('pin')+'<div><b>Khay bằng chứng</b><small>'+ (s.pinned.length?'Đã ghim '+s.pinned.length+' mảnh':'Chạm một chi tiết hoặc kéo vào đây')+
      '</small></div><div class="chips">'+s.pinned.map(id=>clueTile(id,false)).join('')+'</div></div>'+
      '<div class="pin-actions">'+btn('Ghim chi tiết', 'pin', '', picked ? '' : 'disabled')+
      '<span role="status">'+esc(feedback)+'</span></div></div>';
  }
  function transaction(kind = 'draft') {
    const status = {pending:'Chờ xác nhận',paused:'Đã tạm dừng',cancelled:'Đã hủy',paid:'Đã chuyển'}[s.status];
    const incoming = kind === 'incoming';
    return '<article class="receipt'+(motion==='snapshot'?' snapshot':'')+'"><div class="receipt-head">'+icon('receipt')+' Ví học đường <small>Mô phỏng</small></div>'+
      '<div class="amount">'+(incoming?'+45.000đ':'500.000đ')+'</div><span class="pill">'+
      (incoming?'Tiền vào':status)+'</span><dl><dt>'+(incoming?'Nội dung':'Người nhận')+'</dt><dd>'+
      (incoming?'Thanh toán nhiệm vụ 1–3':'LE THI H')+'</dd>'+
      (!incoming?'<dt>Nội dung</dt><dd>Nhiệm vụ VIP</dd>':'')+'</dl>'+
      (kind==='paid'?line('paid-code','Mã giao dịch · MP-500-042'):'')+
      (incoming?line('receipt', evidence.receipt[1]):'')+'</article>';
  }
  function album() {
    return '<p class="guide">Chạm vào chi tiết để ghim, hoặc kéo thẳng xuống khay.</p>'+
      '<div class="documents"><article class="post"><header><span class="avatar alt">HG</span><div><b>Hương Giang</b><small>Việc làm thêm Sao Mai · 18:25</small></div></header>'+
      '<h3>Tuyển CTV tương tác online</h3><p>15.000đ/lượt · Làm tại nhà</p>'+
      '<img src="../img/posts/online-work.jpg" alt="Laptop trên bàn làm việc trong bài tuyển mô phỏng" width="960" height="636">'+
      line('post-info','Không cần kinh nghiệm. Chỉ cần điện thoại.')+
      line('post',evidence.post[1])+'<footer>♡ 24 lượt thích</footer></article>'+
      '<article class="chat-artifact"><header><span class="avatar alt">HG</span><div><b>Hương Giang</b><small>Đoạn chat Vy gửi · 19:41</small></div></header>'+
      line('chat-info','Em làm xong 3 lượt rồi đúng không?')+
      line('task',evidence.task[1])+line('chat-pay','Xong nhiệm vụ chị trả 650.000đ.')+
      '</article></div>'+pinBar();
  }
  function contacts() {
    return '<p class="guide">Hỏi người tuyển hoặc kiểm tra qua số trường Vy đã lưu.</p>'+
      '<div class="documents"><article class="contact"><header><span class="avatar alt">HG</span><div><b>Hương Giang</b><small>Người đăng bài tuyển</small></div></header>'+
      btn(s.claimed?'Đã hỏi về liên kết':'Hỏi về liên kết với trường','claim','',s.claimed?'disabled':'')+
      (s.claimed?'<blockquote>“Chị tuyển với trường em. Em nhận được 45k rồi mà, cứ làm tiếp đi.”</blockquote>':'')+'</article>'+
      '<article class="contact"><header><span class="avatar school">SM</span><div><b>THPT Sao Mai</b><small>Liên hệ trường đã lưu</small></div></header>'+
      btn(s.called?'Đã gọi số trường':'Gọi số trường đã lưu','call','',s.called?'disabled':'')+
      (s.called?'<div class="call-strip'+(motion==='call'?' calling':'')+'">'+icon('phone')+
        '<span>Đã kết nối · Tổ tư vấn</span><span class="wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div>'+line('school', evidence.school[1]):'')+
      '</article></div>'+pinBar();
  }
  function sendPanel() {
    return '<p class="guide">Chạm thẻ hoặc kéo vào khung tin nhắn. Gửi tối đa hai mảnh.</p>'+
      (s.pinned.length?'<div class="evidence">'+s.pinned.map(id=>clueTile(id,true)).join('')+'</div>':
        '<p>Chưa có mảnh nào. Mở ảnh hoặc danh bạ để kiểm tra trước.</p>')+
      '<div class="composer" data-drop="attach">'+icon('send')+'<div><b>Tin nhắn gửi Vy</b><div class="chips">'+
      (s.selected.length?s.selected.map(id=>clueTile(id,false)).join(''):'<small>Thả thẻ bằng chứng vào đây</small>')+
      '</div></div></div>'+btn('Gửi '+s.selected.length+' mảnh cho Vy','send','','class="primary" '+(s.selected.length?'':'disabled'));
  }
  function recover() {
    if (s.submitted) return '<p>Đã chuẩn bị mã giao dịch và ảnh để nhờ hỗ trợ.</p>';
    return '<div class="recovery-meter" aria-label="Tiến độ hồ sơ">'+
      [[s.stopped,'pause','Dừng nạp'],[s.code,'receipt','Mã giao dịch'],[s.proof,'camera','Ảnh giao dịch']].map(([done,image,label])=>
        '<span class="'+(done?'done':'')+'">'+icon(done?'check':image)+esc(label)+'</span>').join('')+
      '</div><p class="guide">Dừng nạp thêm, rồi tìm giao dịch cần lưu.</p><div class="history">'+
      [['incoming','19:10 · +45.000đ · Nhiệm vụ 1–3'],['sent','19:43 · −500.000đ · Nhiệm vụ VIP'],
       ['other','12:15 · −32.000đ · Ăn trưa']].map(([id,label])=>
        btn(label,'history',id,'aria-pressed="'+(historyItem===id)+'"')).join('')+'</div>'+
      (historyItem==='sent'?transaction('paid'):'')+
      '<div class="recovery">'+btn(s.stopped?'✓ Đã nhắn Vy dừng nạp':'Nhắn Vy dừng nạp thêm','stop','',s.stopped?'disabled':'')+
      btn(s.code?'✓ Đã ghi mã':'Ghi mã đã chọn','copy-code','',picked==='paid-code'&&!s.code?'':'disabled')+
      btn(s.proof?'✓ Đã lưu ảnh':'Lưu ảnh giao dịch','save-proof','',s.proof||historyItem!=='sent'?'disabled':'')+
      btn('Hoàn tất hồ sơ hỗ trợ','submit','','class="primary" '+(s.stopped&&s.code&&s.proof?'':'disabled'))+
      '<p role="status">'+esc(feedback)+'</p></div>';
  }
  function render(focusKey) {
    const priorChat = host.querySelector('.messages');
    const previousCount = priorChat?.querySelectorAll('.bubble').length;
    const chatTop = priorChat?.scrollTop || 0;
    const deskTop = host.querySelector('.desk-body')?.scrollTop || 0;
    const titles = {album:'Album của Vy', contacts:'Danh bạ', receipt:'Biên lai 45.000đ',
      transfer:'Ảnh chuyển tiền', send:'Gửi bằng chứng', recover:'Lịch sử giao dịch'};
    const views = {album, contacts, receipt:()=>transaction('incoming')+pinBar(),
      transfer:()=>transaction(), send:sendPanel, recover};
    const active = ['pending','paused'].includes(s.status);
    const statusText = {pending:'Chờ xác nhận',paused:'Đã tạm dừng',cancelled:'Đã hủy chuyển tiền',paid:'Đã chuyển 500.000đ'}[s.status];
    host.innerHTML = '<div class="case-heading"><div><small>CA 01 · VIỆC LÀM ONLINE</small><h1>Vy sắp chuyển 500k</h1></div>'+
      btn('Chơi lại','reset','','class="quiet"')+'</div><div class="stage'+(panel?' viewing':'')+'">'+
      '<section class="phone '+(motion==='reaction'?'reacting':'')+'" aria-label="Cuộc trò chuyện với Vy"><header>'+portrait()+
      '<div><b>Thảo Vy</b><small>Bạn cùng trường</small></div><span class="pill" role="status">'+statusText+'</span></header>'+
      '<div class="messages">'+s.messages.map(([who,text],i)=>'<p class="bubble '+who+(motion==='reaction'&&i===s.messages.length-1?' fresh-bubble':'')+'">'+
      '<small>'+(who==='vy'?'Vy':'Bạn')+'</small>'+esc(text)+'</p>').join('')+
      '<button class="attachment transfer-preview" data-act="open" data-id="transfer">'+icon(s.status==='cancelled'?'check':'receipt')+
      '<span><small>Ảnh giao dịch · Mở xem</small><strong>500.000đ</strong><span>'+statusText+'</span></span></button>'+
      (s.status==='cancelled'?'<p class="outcome"><b>Vy đã hủy giao dịch.</b><br>'+esc(s.verifiedWith)+'.</p>':'')+
      (s.submitted?'<p class="outcome"><b>Đã chuẩn bị hồ sơ hỗ trợ.</b><br>Vy đã dừng chuyển thêm. Chưa có kết quả thu hồi tiền.</p>':'')+
      '</div><div class="actions">'+
      (s.status==='pending'?toolButton('Khoan chuyển','pause','pause','','primary'):'')+
      (active?toolButton('Album','album','open','album')+toolButton('Danh bạ','contacts','open','contacts')+
        toolButton('Biên lai 45k','receipt','open','receipt')+toolButton('Gửi bằng chứng · '+s.pinned.length,'send','open','send','primary')+
        btn('Khuyên chuyển (mô phỏng)','proceed','','class="quiet"'):'')+
      (s.status==='paid'?btn('Mở hồ sơ hỗ trợ','open','recover','class="primary"'):'')+
      '</div></section><section class="desk'+(panel?' open':'')+'" aria-label="Hiện vật đang xem"><header><h2 tabindex="-1">'+
      esc(titles[panel]||'Bàn làm việc')+'</h2>'+(panel?btn('← Về chat','close','','class="quiet"'):'')+
      '</header><div class="desk-body">'+(panel?views[panel]():
      '<div class="desk-empty">'+portrait()+'<h3>'+(active?'Xem ảnh Vy vừa gửi':'Ca đã khép lại')+'</h3>'+
      '<p>'+(active?'Mở ảnh trong cuộc chat, hoặc chọn Khoan chuyển để Vy chờ mình kiểm tra.':'Bạn có thể chơi lại để thử một hướng xử lý khác.')+'</p></div>')+
      '</div></section></div><p class="simulation">Nhân vật, tin nhắn và giao dịch đều là mô phỏng.</p>';
    const chat = host.querySelector('.messages');
    chat.scrollTop = previousCount === s.messages.length ? chatTop : chat.scrollHeight;
    if (focusKey) {
      host.querySelector('.desk-body').scrollTop = deskTop;
      [...host.querySelectorAll('[data-act]')].find(button =>
        button.dataset.act+':'+button.dataset.id===focusKey)?.focus({preventScroll:true});
    } else if (panel) {
      host.querySelector('.desk h2').focus({preventScroll:true});
    } else if (priorChat) {
      host.querySelector('.phone .attachment').focus({preventScroll:true});
    }
  }
  host.addEventListener('click', event => {
    const button = event.target.closest('button[data-act]');
    if (button) dispatch(button.dataset.act, button.dataset.id);
  });
  let drag = null;
  host.addEventListener('dragstart', event => {
    const source = event.target.closest('[data-drag-clue],[data-drag-card]');
    if (!source) return;
    drag = source.dataset.dragClue ? {target:'pin', id:source.dataset.dragClue} :
      {target:'attach', id:source.dataset.dragCard};
    event.dataTransfer.setData('text/plain', drag.id);
    event.dataTransfer.effectAllowed = 'copy';
  });
  host.addEventListener('dragover', event => {
    const target = event.target.closest('[data-drop]');
    if (target?.dataset.drop !== drag?.target || !drag) return;
    event.preventDefault();
    target.classList.add('drop-ready');
  });
  host.addEventListener('dragleave', event => {
    const target = event.target.closest('[data-drop]');
    if (target && !target.contains(event.relatedTarget)) target.classList.remove('drop-ready');
  });
  host.addEventListener('drop', event => {
    const target = event.target.closest('[data-drop]');
    if (!drag || target?.dataset.drop !== drag.target) return;
    event.preventDefault();
    const {target: kind, id} = drag;
    drag = null;
    dispatch(kind === 'pin' ? 'drop-pin' : 'attach', id);
  });
  host.addEventListener('dragend', () => {
    drag = null;
    host.querySelectorAll('.drop-ready').forEach(element=>element.classList.remove('drop-ready'));
  });
  render();
})();
