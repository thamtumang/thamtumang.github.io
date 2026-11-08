(() => {
  'use strict';
  const host = document.getElementById('app');
  const key = 'vietbook.preview.vy.v2';
  const qa = new URLSearchParams(location.search).has('kiem-thu');
  const blank = () => ({transfer:'pending',post:'',chat:'',receiptPick:false,transferPick:false,independent:false,asked:false,reported:'',basis:'',messages:[],finished:false,history:'',stopped:false,bank:false,code:false,receipt:false,chatSaved:false,prepared:false});
  let state = blank();
  try { state = {...state,...JSON.parse(localStorage.getItem(key) || '{}')}; } catch {}
  const views = ['inbox','post','page','compare','receipt','transfer','recruiter','intro','search','school','club','report','confirm','result','recover','bank','call','qa'];
  const current = () => {
    const name = location.hash.slice(1);
    return views.includes(name) && (name!=='qa' || qa) ? name : 'inbox';
  };
  let notice = '';
  let search = '';
  let wantsTransfer = false;
  let chatOpen = false;
  const openingMessage = 'Tớ nhận 45k thật rồi. Giờ họ bảo nạp 500k. Cậu coi giúp tớ với.';
  const e = x => String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const B = (label, action, id='', cls='', extra='') => '<button type="button" class="'+cls+'" data-action="'+action+'" data-id="'+id+'" '+extra+'>'+e(label)+'</button>';
  const go = (name,label,cls='') => '<a class="button '+cls+'" href="#'+name+'">'+e(label)+'</a>';
  const pill = label => '<span class="pill">'+e(label)+'</span>';
  const status = () => ({pending:'Chờ xác nhận',waiting:'Đang chờ · Chưa chuyển',cancelled:'Đã hủy',paid:'Đã chuyển'})[state.transfer];
  const unsettled = () => state.transfer==='pending'||state.transfer==='waiting';
  const art = () => state.transfer==='pending'?'lo-lang':unsettled()||state.transfer==='paid'&&!state.prepared?'dang-nghe':'nhe-nhom';
  function save() { try { localStorage.setItem(key,JSON.stringify(state)); } catch {} }
  function navigate(view) {
    if (current()===view) render();
    else location.hash=view;
  }
  const choices = {
    post:[['rate','15.000đ/lượt. Làm tại nhà.'],['advance','Không cần ứng tiền.'],['contact','Nhắn trang để nhận việc.']],
    chat:[['claim','Chị là cộng tác viên của CLB Truyền thông Sao Mai.'],['paid','Em nhận được 45.000đ rồi đó.'],['deposit','Nạp 500.000đ để làm tiếp.']]
  };
  function pickLines(group) {
    return choices[group].map(([id,label])=>B(label,'pick',group+'-'+id,'line','aria-pressed="'+(state[group]===id)+'"')).join('');
  }
  function portrait() {
    return '<figure class="scene '+art()+'"><div class="scene-caption"><span class="live-dot"></span> Thảo Vy</div></figure>';
  }
  function transaction(incoming=false, selectable=false) {
    const amount=incoming?'+45.000đ':'500.000đ';
    const field=incoming?'receiptPick':'transferPick';
    return '<article class="slip"><header><span class="seal">'+(incoming?'↙':'↗')+'</span><b>Ví học đường</b><small>Mô phỏng</small></header>'+
      (selectable&&unsettled()?B(amount,'pick-amount',field,'amount','aria-pressed="'+state[field]+'"'):'<strong class="amount">'+amount+'</strong>')+
      pill(incoming?'Đã nhận':status())+
      '<dl><dt>Nội dung</dt><dd>'+(incoming?'Thanh toán nhiệm vụ 1–3':'Nhiệm vụ VIP')+
      '</dd><dt>'+(incoming?'Nguồn tiền':'Người nhận')+'</dt><dd>LE THI H</dd></dl></article>';
  }
  function publisher(name='Việc làm thêm Sao Mai',school=false) {
    const mark=school?'SM':'VL';
    return '<div class="publisher"><span class="mark '+(school?'school':'')+'">'+mark+'</span><b>'+e(name)+'</b></div>';
  }
  function postCard() {
    return '<article class="artifact post"><header>'+go('page','VL · Việc làm thêm Sao Mai','publisher-link')+
      '<small>18:25 · Bài đăng công khai</small></header><img src="assets/bai-tuyen.jpg" alt="Laptop trên bàn làm việc trong bài tuyển mô phỏng" width="960" height="636">'+
      '<div class="artifact-body"><h3>Tuyển CTV tương tác online</h3>'+pickLines('post')+'</div></article>';
  }
  function chatCard() {
    return '<article class="artifact recruiter"><header>'+publisher('Hương Giang · Người tuyển')+
      '<small>Đoạn trò chuyện Vy chia sẻ</small></header><div class="artifact-body">'+pickLines('chat')+'</div></article>';
  }
  function vyDock(pair = false) {
    const groups = pair ? ['post','chat'] : ['post'];
    const drafts = groups.flatMap(group => {
      const quote = selected(group);
      if (!quote) return [];
      const title = group==='post' ? 'Bài tuyển' : 'Đoạn chat';
      return ['<div class="vy-draft"><div><small>'+title+'</small><blockquote>'+e(quote)+'</blockquote></div>'+
        B('Bỏ chọn','pick',group+'-'+state[group],'draft-remove','aria-label="Bỏ chọn đoạn từ '+title.toLowerCase()+'"')+'</div>'];
    });
    const latest = state.stopped ? 'Tớ dừng nạp thêm rồi.' : state.transfer==='paid'
      ? 'Tớ chuyển rồi. Họ lại đòi nạp thêm để hoàn tiền.'
      : [...state.messages].reverse().find(message=>message.who==='vy')?.text || openingMessage;
    return '<aside class="vy-dock'+(chatOpen?' expanded':'')+'" aria-label="Chat với Vy">'+
      '<div class="vy-head"><span class="vy-avatar '+art()+'" aria-hidden="true"></span><div><b>Thảo Vy</b><small>500.000đ · '+e(status())+'</small></div>'+
      B(chatOpen?'Thu gọn':'Mở chat','toggle-vy','','vy-toggle','aria-controls="vy-chat" aria-expanded="'+chatOpen+'"')+'</div>'+
      '<div class="vy-content" id="vy-chat"><p class="vy-reply">'+e(latest)+'</p>'+
      (unsettled()?'<div class="vy-compose"><small>Sắp gửi cho Vy</small>'+
        (drafts.length?drafts.join(''):'<p>Chưa chọn đoạn nào.</p>')+
        (pair&&drafts.length===1?'<small>Chọn thêm một đoạn ở nguồn còn lại.</small>':'')+'</div>':'')+'</div>'+
      sendBar('Gửi Vy',pair?'pair':'post',drafts.length===groups.length)+'</aside>';
  }
  function recruitment(pair = false) {
    const title = pair ? 'Đối chiếu hai nguồn' : 'Bài tuyển';
    const hint = pair ? 'Chọn một đoạn ở mỗi nguồn để gửi Vy.' : 'Chọn đoạn muốn gửi Vy.';
    const postActions = '<div class="actions">'+go('compare','Đặt cạnh đoạn chat','primary')+
      (state.reported?pill('Đã gửi báo cáo · Chờ xem xét'):go('report','Báo cáo bài viết'))+
      go('inbox','Về hộp thư')+'</div>';
    return '<h1>'+title+'</h1><p>'+hint+'</p><div class="evidence-layout"><div class="evidence-sources">'+
      (pair?'<div class="comparison">'+postCard()+chatCard()+'</div>'+sourceLinks():postCard()+postActions)+
      '</div>'+vyDock(pair)+'</div>';
  }
  function sourceLinks() {
    return '<div class="actions">'+go('post','Bài gốc')+go('recruiter','Đoạn chat')+go('inbox','Về hộp thư','primary')+'</div>';
  }
  function selected(group) {
    return choices[group].find(([id])=>id===state[group])?.[1];
  }
  function sendBar(label, id, enabled=true) {
    return unsettled()?B(label,'send',id,'primary',enabled?'':'disabled'):'';
  }
  function advice() {
    if (!unsettled()) {
      const needsHelp = state.transfer==='paid'&&!state.prepared;
      return '<div class="actions">'+go(needsHelp?'recover':'result',needsHelp?'Mở hồ sơ hỗ trợ':'Xem kết quả','primary')+'</div>';
    }
    return '<div class="actions inbox-actions">'+
      (state.transfer==='waiting'?B('Tạm dừng và kiểm tra thêm','finish-wait'):'')+
      B('Khuyên Vy chuyển','choose-transfer','','quiet')+'</div>';
  }
  function attachment(view, label, caption, symbol, type) {
    return '<a class="attachment '+type+'" href="#'+view+'"><span class="attachment-icon" aria-hidden="true">'+symbol+
      '</span><span><strong>'+e(label)+'</strong><small>'+e(caption)+'</small></span><span class="attachment-open" aria-hidden="true">›</span></a>';
  }
  function inbox() {
    const chat = state.messages.map((message,index)=>{
      const latest = index===state.messages.length-1?' latest':'';
      if(message.who==='vy') return '<p class="bubble'+latest+'"><span class="speaker">Vy</span>'+e(message.text)+'</p>';
      return '<div class="bubble sent'+latest+'"><span class="speaker">Bạn</span>'+e(message.text)+
        (message.quotes?'<div class="sent-quotes">'+message.quotes.map(([source,quote])=>
          '<blockquote><small>'+e(source)+'</small>'+e(quote)+'</blockquote>').join('')+'</div>':'')+'</div>';
    }).join('');
    return '<div class="inbox-layout"><aside class="portrait">'+portrait()+'<div class="actions">'+go('call','▣ Gọi Vy')+'</div></aside>'+
      '<section class="conversation"><div class="contact-title"><span class="mark vy">V</span><div><h1>Thảo Vy</h1><small>Hộp thư · Bạn cùng trường</small></div>'+pill(status())+'</div>'+
      '<p class="bubble">Tớ nhận 45k thật rồi. Giờ họ bảo nạp 500k. Cậu coi giúp tớ với.</p>'+
      '<div class="inbox-quick">'+(state.transfer==='pending'?B('Khoan chuyển','pause','','primary'):'')+
      go('recruiter','Đoạn chat người tuyển')+'</div>'+
      '<div class="attachments">'+attachment('receipt','+45.000đ','Đã nhận','↙','incoming')+
      attachment('transfer','500.000đ',status(),'↗','outgoing')+
      '<a class="attachment shared-post" href="#post"><img src="assets/bai-tuyen.jpg" width="960" height="636" alt="">'+
      '<span><strong>Mở bài đăng</strong><small>Việc làm thêm Sao Mai · Vy chia sẻ</small></span><span class="attachment-open" aria-hidden="true">›</span></a></div>'+
      '<div class="chat-thread" aria-label="Tin nhắn mới">'+chat+
      (state.transfer==='paid'?'<p class="bubble"><span class="speaker">Vy</span>Tớ chuyển rồi. Họ lại đòi nạp thêm để hoàn tiền.</p>':'')+
      (state.stopped?'<p class="bubble"><span class="speaker">Vy</span>Tớ dừng nạp thêm rồi.</p>':'')+'</div>'+
      advice()+'</section></div>';
  }
  function message(who,text,quotes) {
    state.messages.push({who,text,quotes});
  }
  function sendToVy(id) {
    const post = selected('post'), chat = selected('chat');
    const clubReply = 'CLB mình không đăng bài này và không tổ chức nhiệm vụ đó.';
    const options = {
      post:post&&[['Bài tuyển',post]],
      chat:chat&&[['Đoạn chat',chat]],
      pair:post&&chat&&[['Bài tuyển',post],['Đoạn chat',chat]],
      receipt:state.receiptPick&&[['Biên lai','+45.000đ · Đã nhận']],
      transfer:state.transferPick&&[['Giao dịch','500.000đ · '+status()]],
      club:state.independent&&[['Phản hồi từ CLB',clubReply]]
    };
    if(!options[id]||!unsettled())return;
    message('player','',options[id]);
    if(id==='pair'&&state.post==='advance'&&state.chat==='deposit') {
      state.transfer='cancelled';state.basis='pair';
      message('vy','Bài đăng bảo không ứng tiền mà giờ lại đòi nạp trước. Ừ, tớ hủy khoản này.');
    } else if(id==='club') {
      state.transfer='cancelled';state.basis='club';
      message('vy','CLB không đăng bài đó à? Ừ, tớ hủy khoản này.');
    } else {
      state.transfer='waiting';
      message('vy',id==='receipt'?'Ừ, tiền về thật mà. Còn khoản 500k thì sao?':
        'Tớ khoan chuyển. Mình còn kiểm tra được gì nữa?');
    }
    state.finished=false;
    save();
    if (id==='post'||id==='pair') {
      chatOpen = true;
      render();
      const reply = host.querySelector('.vy-reply');
      reply?.setAttribute('tabindex','-1');
      reply?.focus({preventScroll:true});
      return;
    }
    navigate('inbox');
  }
  const panels = {
    inbox,
    post:()=>recruitment(),
    page:()=>'<div class="cover"></div>'+publisher()+'<h1>Việc làm thêm Sao Mai</h1><p>Trang giới thiệu việc cộng tác online. Trang tự giới thiệu có liên hệ với CLB Truyền thông Sao Mai.</p><small>Thông tin do trang tự khai.</small><div class="actions">'+go('post','Mở bài tuyển gốc')+go('recruiter','Hỏi người tuyển')+go('search','Tìm trên ViệtBook')+go('inbox','Về hộp thư','primary')+'</div>',
    compare:()=>recruitment(true),
    receipt:()=>'<h1>Biên lai Vy gửi</h1>'+transaction(true,true)+'<div class="actions">'+sendBar('Gửi +45.000đ cho Vy','receipt',state.receiptPick)+go('inbox','Về hộp thư','primary')+'</div>',
    transfer:()=>'<h1>Ảnh giao dịch Vy gửi</h1>'+transaction(false,true)+'<div class="actions">'+sendBar('Gửi chi tiết giao dịch cho Vy','transfer',state.transferPick)+go('inbox','Về hộp thư','primary')+'</div>',
    recruiter:()=>'<h1>Hộp thư · Hương Giang</h1>'+chatCard()+'<div class="actions">'+sendBar('Gửi đoạn đã chọn cho Vy','chat',Boolean(selected('chat')))+(state.asked?go('intro','Mở ảnh tự giới thiệu'):B('Hỏi chị có liên hệ với CLB không','ask'))+go('compare','Đặt cạnh bài tuyển')+go('inbox','Về hộp thư','primary')+'</div>',
    intro:()=>'<h1>Ảnh người tuyển gửi</h1><article class="idcard">'+publisher('Hương Giang')+'<h3>CTV · CLB Truyền thông Sao Mai</h3><p>Ảnh giới thiệu do Hương Giang gửi trong hội thoại.</p></article><div class="actions">'+go('recruiter','Về hội thoại')+go('search','Tìm trang trường')+go('inbox','Về hộp thư','primary')+'</div>',
    search:()=>'<h1>Tìm trên ViệtBook</h1><form id="search"><label for="query">Tìm trang hoặc tên trường</label><div class="searchrow"><input id="query" name="query" type="search" value="'+e(search)+'" placeholder="Ví dụ: Sao Mai"><button class="primary">Tìm</button></div></form>'+
      (!search?'<p>Nhập tên hoặc từ khóa để xem các trang.</p>':/sao|mai|clb|trường|truong|thpt|việc|viec/i.test(search)?
        '<div class="results">'+go('page','VL · Việc làm thêm Sao Mai')+go('school','SM · THPT Sao Mai · Trang trường')+'</div>':'<p>Chưa tìm thấy trang phù hợp. Thử tên trường hoặc tên CLB.</p>')+go('inbox','Về hộp thư','primary'),
    school:()=>'<div class="cover school-cover"></div>'+publisher('THPT Sao Mai',true)+'<h1>THPT Sao Mai</h1><p>Trang nhà trường trong ViệtBook. Xem danh bạ các câu lạc bộ.</p><div class="actions">'+go('club','Liên hệ · CLB Truyền thông')+go('search','Về tìm kiếm')+go('inbox','Về hộp thư','primary')+'</div>',
    club:()=>'<h1>Liên hệ CLB Truyền thông</h1>'+publisher('Đầu mối từ trang THPT Sao Mai',true)+
      (state.independent?'<p class="bubble sent">▧ Bài gốc · Tuyển CTV tương tác online</p><p class="bubble latest">CLB mình không đăng bài này và không tổ chức nhiệm vụ đó.</p>'+
        sendBar('Chuyển phản hồi cho Vy','club'):
      go('post','Xem bài gốc')+B('Gửi bài gốc cho CLB','verify','','primary'))+'<div class="actions">'+go('school','Về trang trường')+go('inbox','Về hộp thư','primary')+'</div>',
    report:()=>'<h1>Báo cáo bài viết</h1>'+(state.reported?pill('Đã gửi báo cáo · Chờ xem xét'):
      '<form id="report"><fieldset><legend>Lý do báo cáo</legend><label><input type="radio" name="reason" value="fraud" required> Nghi ngờ lừa đảo hoặc yêu cầu nạp tiền</label><label><input type="radio" name="reason" value="irrelevant" required> Không liên quan đến tôi</label><label><input type="radio" name="reason" value="violence" required> Nội dung bạo lực</label></fieldset><button class="primary">Gửi báo cáo</button></form>')+
      '<div class="actions">'+go('post','Về bài gốc')+go('inbox','Về hộp thư','primary')+'</div>',
    confirm:()=>'<h1>Xác nhận lựa chọn mô phỏng</h1>'+transaction()+'<p>Vy chỉ chuyển sau khi bạn xác nhận lời khuyên này.</p><div class="actions">'+
      (unsettled()&&wantsTransfer?B('Xác nhận khuyên chuyển','confirm','','danger'):'')+go('inbox','Quay lại, chưa chuyển','primary')+'</div>',
    call:()=>'<h1>Cuộc gọi với Vy</h1><div class="call-view">'+portrait()+'</div><p class="bubble">'+(state.transfer==='pending'?'Tớ đang giữ điện thoại. Cậu muốn xem bài tuyển không?':state.transfer==='waiting'?'Ừ, tớ hạ máy rồi. Mình kiểm tra thêm nhé.':state.transfer==='cancelled'?'Tớ hủy rồi. Cảm ơn cậu đã giải thích.':'Tớ đã chuyển rồi. Cậu giúp tớ lưu lại giao dịch nhé.')+'</p><div class="actions">'+
      (state.transfer==='pending'?B('Khoan chuyển','pause','','primary'):'')+go('inbox','Về hộp thư')+'</div>',
    recover:()=>'<h1>Hồ sơ hỗ trợ</h1>'+pill(state.prepared?'Đã chuẩn bị':state.bank||state.code||state.receipt||state.chatSaved?'Đang bổ sung':'Chưa chuẩn bị')+
      (state.transfer!=='paid'?'<p>Giao dịch này chưa phát sinh.</p>':state.prepared?'<p>Khoản tiền đang chờ xử lý.</p>':
      '<div class="actions">'+B(state.stopped?'✓ Đã nhắn dừng nạp':'Nhắn Vy dừng nạp thêm','stop','','',state.stopped?'disabled':'')+go('bank','Mở hỗ trợ chính thức của ngân hàng')+'</div>'+
      '<h3>Lịch sử giao dịch</h3><div class="history">'+
      [['incoming','↙ +45.000đ · Tiền đến'],['sent','↗ −500.000đ · Nhiệm vụ VIP'],['other','↗ −32.000đ · Ăn trưa']].map(([id,label])=>B(label,'history',id,'','aria-pressed="'+(state.history===id)+'"')).join('')+'</div>'+
      (state.history==='sent'?transaction()+'<div class="actions">'+B(state.code?'✓ Đã lưu MP-500-042':'Lưu mã MP-500-042','keep','code','',state.code?'disabled':'')+
        B(state.receipt?'✓ Đã lưu biên lai':'Lưu ảnh biên lai','keep','receipt','',state.receipt?'disabled':'')+'</div>':'')+
      '<details><summary>Xem đoạn chat đòi nạp thêm</summary><p class="bubble">Nạp thêm phí mở khóa rồi hệ thống mới hoàn tiền.</p>'+B(state.chatSaved?'✓ Đã lưu đoạn chat':'Lưu đoạn chat','keep','chatSaved','',state.chatSaved?'disabled':'')+'</details>'+
      '<div class="actions">'+B('Hoàn tất hồ sơ','prepare','','primary',state.stopped&&state.bank&&state.code&&state.receipt&&state.chatSaved?'':'disabled')+'</div>')+go('inbox','Về hộp thư'),
    bank:()=>'<h1>Hỗ trợ chính thức · Ví học đường</h1><p>Kênh ngân hàng trong mô phỏng. Bạn có thể mở hỗ trợ ngay và bổ sung mã giao dịch, biên lai và đoạn chat sau.</p><div class="actions">'+
      (state.transfer==='paid'?B(state.bank?'✓ Đã mở yêu cầu hỗ trợ':'Mở yêu cầu hỗ trợ','bank','','primary',state.bank?'disabled':''):'')+go('recover','Về hồ sơ hỗ trợ')+go('inbox','Về hộp thư')+'</div>',
    result:()=>'<h1>Tóm tắt ca Vy</h1>'+portrait()+'<dl class="result"><dt>Vy đã làm gì?</dt><dd>'+e(status())+
      (state.prepared?' · Đã dừng nạp thêm và chuẩn bị hồ sơ (mã MP-500-042, ảnh biên lai và đoạn chat). Khoản tiền đang chờ xử lý.':'')+
      '</dd><dt>Đã xác minh</dt><dd>'+(state.independent?'CLB không đăng bài hoặc tổ chức chương trình.':state.post==='advance'&&state.chat==='deposit'?'Bài tuyển và đoạn chat mâu thuẫn về tiền ứng.':'Chưa xác minh đủ về chương trình.')+
      '</dd><dt>Còn bỏ ngỏ</dt><dd>Danh tính thật của người tuyển.'+(state.finished&&unsettled()?' Có thể quay lại đối chiếu hoặc hỏi CLB.':'')+
      '</dd><dt>Bài đăng</dt><dd>'+(state.reported?'Đã gửi báo cáo · Chờ xem xét':'Chưa báo cáo')+'</dd></dl>'+
      '<div class="actions">'+go('inbox',unsettled()?'Quay lại điều tra':'Về hộp thư','primary')+go('post','Mở bài gốc')+'</div>',
    qa:()=>'<h1>Điều phối kiểm thử</h1><p>Các nút sau chỉ đặt lại dữ liệu bản thử trên trình duyệt này.</p><div class="actions">'+B('Mở lượt sạch','seed','clean')+B('Mở thẳng nhánh đã chuyển','seed','paid')+'</div>'
  };
  function render() {
    const view=current();
    host.innerHTML='<header class="top"><a class="brand" href="#inbox">ViệtBook <small>Ca trực an toàn số</small></a><nav>'+
      go('inbox','▤ Hộp thư',view==='inbox'?'active':'')+go('search','⌕ Tìm kiếm',view==='search'?'active':'')+
      (qa?go('qa','Kiểm thử'):'')+B('Chơi lại','reset','','reset')+'</nav></header>'+
      '<div class="shell"><div class="case-label">BẢN THỬ · CA 01 <strong>Vy sắp chuyển 500k</strong></div>'+
      '<section class="surface '+view+'" aria-label="Nội dung ca">'+
      '<div class="notice" role="status">'+e(notice)+'</div>'+panels[view]()+'</section>'+
      '<footer>ViệtBook là mạng xã hội giả lập. Nhân vật và giao dịch đều là mô phỏng.</footer></div>';
  }
  function act(action,id) {
    notice='';
    if (action==='pause'&&state.transfer==='pending') {
      state.transfer='waiting'; message('player','Khoan chuyển.'); message('vy','Ừ, tớ để đây.');
    } else if(action==='pick') {
      const [group,value]=id.split('-');
      if(choices[group]?.some(([key])=>key===value)) {
        state[group]=state[group]===value?'':value;
        if(state[group]&&['post','compare'].includes(current())) chatOpen=true;
      }
    } else if(action==='toggle-vy') {
      chatOpen=!chatOpen;
    } else if(action==='pick-amount'&&['receiptPick','transferPick'].includes(id)) {
      state[id]=!state[id];
    } else if(action==='ask') {state.asked=true;save();navigate('intro');return;}
    else if(action==='verify') state.independent=true;
    else if(action==='send') {sendToVy(id);return;}
    else if(action==='finish-wait'&&unsettled()) {
      state.transfer='waiting';state.finished=true;save();navigate('result');return;
    } else if(action==='choose-transfer'&&unsettled()) {
      wantsTransfer=true;navigate('confirm');return;
    } else if(action==='confirm'&&unsettled()&&wantsTransfer) {
      wantsTransfer=false;state.transfer='paid';state.finished=false;save();navigate('recover');return;
    } else if(action==='stop'&&state.transfer==='paid') state.stopped=true;
    else if(action==='bank'&&state.transfer==='paid') state.bank=true;
    else if(action==='history'&&state.transfer==='paid') {
      state.history=id;
      if(id==='incoming') notice='Vy: “Đây là khoản tiền đến. Mình cần tìm khoản 500.000đ đã chuyển đi.”';
      if(id==='other') notice='Khoản này không phải khoản nạp cho người tuyển.';
    } else if(action==='keep'&&state.transfer==='paid'&&
      (id==='chatSaved'||(state.history==='sent'&&['code','receipt'].includes(id)))) {
      state[id]=true;notice='Đã lưu vào hồ sơ hỗ trợ.';
    } else if(action==='prepare'&&state.transfer==='paid'&&state.stopped&&state.bank&&state.code&&state.receipt&&state.chatSaved) {
      state.prepared=true;save();navigate('result');return;
    } else if(action==='reset'||(action==='seed'&&qa)) {
      if(!window.confirm('Đặt lại lượt chơi bản thử này?'))return;
      state=blank();
      if(id==='paid')state.transfer='paid';
      search='';chatOpen=false;save();navigate(id==='paid'?'recover':'inbox');return;
    }
    save();render();
    const same=[...host.querySelectorAll('[data-action]')].find(b=>b.dataset.action===action&&b.dataset.id===id);
    if(same&&!same.disabled)same.focus({preventScroll:true});
    else if(action==='pick') host.querySelector('.vy-toggle')?.focus({preventScroll:true});
  }
  host.addEventListener('click',ev=>{
    const button=ev.target.closest('button[data-action]');
    if(button)act(button.dataset.action,button.dataset.id);
  });
  host.addEventListener('submit',ev=>{
    ev.preventDefault();
    if(ev.target.id==='search') {
      search=new FormData(ev.target).get('query').trim();render();document.getElementById('query')?.focus();
    }
    if(ev.target.id==='report'&&!state.reported) {
      const reason=new FormData(ev.target).get('reason');
      if(reason==='fraud'){state.reported=reason;save();navigate('post');}
      else {notice='Lý do này chưa phản ánh yêu cầu nạp tiền. Xem lại bài trước khi báo cáo.';render();}
    }
  });
  addEventListener('hashchange',()=>{
    if(current()!=='confirm') wantsTransfer=false;
    notice='';render();window.scrollTo(0,0);
    const heading=host.querySelector('h1');
    heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});
    if(current()==='inbox'&&state.messages.length)host.querySelector('.chat-thread .latest')?.scrollIntoView({block:'nearest'});
  });
  render();
})();
