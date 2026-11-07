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
    } else if (action === 'pin') {
      if (!evidence[picked]) {
        feedback = 'Chi tiết này cho biết bối cảnh. Thử tìm một câu hoặc trạng thái giúp cậu giải thích chuyện đang xảy ra.';
      } else if (s.pinned.includes(picked)) {
        feedback = 'Mảnh này đã có trong khay bằng chứng.';
      } else {
        s.pinned.push(picked);
        feedback = 'Đã ghim vào khay bằng chứng.';
      }
    } else if (action === 'claim' && !s.claimed) {
      s.claimed = true;
      feedback = '';
    } else if (action === 'call' && !s.called) {
      s.called = true;
      feedback = '';
    } else if (action === 'select' && s.pinned.includes(id)) {
      if (s.selected.includes(id)) s.selected = s.selected.filter(item => item !== id);
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
      feedback = 'Đã lưu ảnh giao dịch trong mô phỏng.';
    } else if (action === 'submit' && s.stopped && s.code && s.proof) {
      s.submitted = true;
      say('vy', 'Tớ có mã và ảnh giao dịch rồi. Tớ sẽ nhờ người lớn hỗ trợ liên hệ ngân hàng qua kênh chính thức.');
      open('');
    }
    save();
    render(action === 'open' || action === 'close' || action === 'send' || action === 'proceed' || action === 'submit' || action === 'reset' ? '' : action + ':' + id);
  }

  function btn(label, action, id = '', extra = '') {
    return '<button type="button" data-act="'+action+'" data-id="'+id+'" '+extra+'>'+esc(label)+'</button>';
  }
  function line(id, text) {
    return btn(text, 'pick', id, 'class="hotspot" aria-pressed="'+(picked === id)+'"');
  }
  function pinBar() {
    return '<div class="pinbar">'+btn('Ghim chi tiết', 'pin', '', picked ? '' : 'disabled')+
      '<span role="status">'+esc(feedback)+'</span></div>';
  }
  function transaction(kind = 'draft') {
    const status = {pending:'Chờ xác nhận',paused:'Đã tạm dừng',cancelled:'Đã hủy',paid:'Đã chuyển'}[s.status];
    const incoming = kind === 'incoming';
    return '<article class="receipt"><div class="receipt-head">◈ Ví học đường <small>Mô phỏng</small></div>'+
      '<div class="amount">'+(incoming?'+45.000đ':'500.000đ')+'</div><span class="pill">'+
      (incoming?'Tiền vào':status)+'</span><dl><dt>'+(incoming?'Nội dung':'Người nhận')+'</dt><dd>'+
      (incoming?'Thanh toán nhiệm vụ 1–3':'LE THI H')+'</dd>'+
      (!incoming?'<dt>Nội dung</dt><dd>Nhiệm vụ VIP</dd>':'')+'</dl>'+
      (kind==='paid'?line('paid-code','Mã giao dịch · MP-500-042'):'')+
      (incoming?line('receipt', evidence.receipt[1]):'')+'</article>';
  }
  function album() {
    return '<p class="guide">Chạm vào chi tiết muốn giữ. Có thể đặt bài tuyển và đoạn chat cạnh nhau.</p>'+
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
      (s.called?'<blockquote>“Chào em, đây là tổ tư vấn học sinh.”</blockquote>'+line('school', evidence.school[1]):'')+
      '</article></div>'+pinBar();
  }
  function sendPanel() {
    return '<p class="guide">Chọn tối đa hai mảnh rồi gửi cho Vy.</p>'+
      (s.pinned.length?'<div class="evidence">'+s.pinned.map(id =>
        btn(evidence[id].join(' · '),'select',id,'aria-pressed="'+s.selected.includes(id)+'"')).join('')+
      '</div>'+btn('Gửi '+s.selected.length+' mảnh cho Vy','send','','class="primary" '+(s.selected.length?'':'disabled')):
      '<p>Chưa có mảnh nào. Mở ảnh hoặc danh bạ để kiểm tra trước.</p>');
  }
  function recover() {
    if (s.submitted) return '<p>Đã chuẩn bị mã giao dịch và ảnh để nhờ hỗ trợ.</p>';
    return '<p class="guide">Dừng nạp thêm, rồi tìm giao dịch cần lưu.</p><div class="history">'+
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
      '<section class="phone" aria-label="Cuộc trò chuyện với Vy"><header><span class="avatar">V</span>'+
      '<div><b>Thảo Vy</b><small>Bạn cùng trường</small></div><span class="pill" role="status">'+statusText+'</span></header>'+
      '<div class="messages">'+s.messages.map(([who,text])=>'<p class="bubble '+who+'">'+
      '<small>'+(who==='vy'?'Vy':'Bạn')+'</small>'+esc(text)+'</p>').join('')+
      btn('▧  Ảnh chuyển 500.000đ · '+statusText,'open','transfer','class="attachment"')+
      (s.status==='cancelled'?'<p class="outcome"><b>Vy đã hủy giao dịch.</b><br>'+esc(s.verifiedWith)+'.</p>':'')+
      (s.submitted?'<p class="outcome"><b>Đã chuẩn bị hồ sơ hỗ trợ.</b><br>Vy đã dừng chuyển thêm. Chưa có kết quả thu hồi tiền.</p>':'')+
      '</div><div class="actions">'+
      (s.status==='pending'?btn('Khoan chuyển','pause','','class="primary"'):'')+
      (active?btn('Album','open','album')+btn('Danh bạ','open','contacts')+
        btn('Biên lai 45k','open','receipt')+btn('Gửi bằng chứng · '+s.pinned.length,'open','send','class="primary"')+
        btn('Khuyên chuyển (mô phỏng)','proceed','','class="quiet"'):'')+
      (s.status==='paid'?btn('Mở hồ sơ hỗ trợ','open','recover','class="primary"'):'')+
      '</div></section><section class="desk'+(panel?' open':'')+'" aria-label="Hiện vật đang xem"><header><h2 tabindex="-1">'+
      esc(titles[panel]||'Bàn làm việc')+'</h2>'+(panel?btn('← Về chat','close','','class="quiet"'):'')+
      '</header><div class="desk-body">'+(panel?views[panel]():
      '<div class="desk-empty"><span aria-hidden="true">▧</span><h3>'+(active?'Xem ảnh Vy vừa gửi':'Ca đã khép lại')+'</h3>'+
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
  render();
})();
