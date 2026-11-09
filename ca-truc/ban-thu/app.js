(() => {
  'use strict';
  const host = document.getElementById('app');
  const storage = window.frameElement?.caTrucStorage;
  const fresh = () => ({view:'inbox', transfer:'pending', messages:[], shared:[], seen:[], guide:true,
    asked:false, verified:false, reported:false, registered:false, finished:false, history:'',
    stopped:false, bank:false, code:false, receipt:false, chatSaved:false, prepared:false});
  const saved = storage?.load();
  let state = {...fresh(), ...saved};
  let resume = Boolean(storage?.canResume && saved);
  let confirmTransfer = false;
  let notice = '';
  const clb = 'CLB Truyền thông Sao Mai';
  const event = 'Tuyển cộng tác viên · Ngày hội Sao Mai';
  const publicComment = 'Em làm ca chiều được không ạ?';
  const giangAnswer = 'Form đó để đăng ký chung thôi em. Ca chiều chị giữ riêng. Em chuyển xong gửi chị biên lai nha.';
  const clbAnswer = 'Bài tuyển này của tụi mình. Ca chiều đăng ký qua form trong bài nha. Bên mình không thu tiền giữ chỗ.';
  const reportStatus = 'Đã gửi báo cáo · Chờ xem xét';
  const clubQuestion = 'Cho em hỏi người này có phụ trách ca chiều không ạ? Bạn em được yêu cầu chuyển 500k để giữ chỗ.';
  const guide = 'Bạn là bạn của Vy. Mở nội dung Vy gửi, kiểm tra người đứng sau lời mời rồi nhắn lại cho Vy.';
  const e = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const B = (label, action, id='', cls='', extra='') =>
    '<button type="button" class="'+cls+'" data-action="'+action+'" data-id="'+id+'" '+extra+'>'+e(label)+'</button>';
  const go = (view,label,cls='') => '<a class="button '+cls+'" href="#'+view+'">'+e(label)+'</a>';
  const pill = label => '<span class="pill">'+e(label)+'</span>';
  const actions = (...items) => '<div class="actions">'+items.join('')+'</div>';
  const status = () => ({pending:'Chưa chuyển',waiting:'Đang chờ',cancelled:'Đã hủy',paid:'Đã chuyển'})[state.transfer];
  const unsettled = () => state.transfer==='pending'||state.transfer==='waiting';
  const resultReady = () => state.finished || state.transfer==='cancelled' || state.prepared;
  const save = () => storage?.save(JSON.stringify(state)===JSON.stringify(fresh()) ? null : state);
  const inboxLink = () => go('inbox','Về hộp thư Vy');
  const resultLink = () => go('result','Xem tổng kết');
  function current() {
    const view = location.hash.slice(1);
    return Object.hasOwn(panels,view) ? view : 'inbox';
  }
  function navigate(view) {
    if (current()===view) render();
    else location.hash=view;
  }
  function portrait() {
    const pose = state.transfer==='pending'?'lo-lang':state.transfer==='cancelled'?'nhe-nhom':'dang-nghe';
    return '<figure class="scene '+pose+'"><figcaption class="scene-caption">Thảo Vy</figcaption></figure>';
  }
  function publisher(name,initials,caption,view='') {
    const content='<span class="mark '+(initials==='SM'?'school':'')+'">'+initials+'</span><span><b>'+e(name)+'</b><small>'+e(caption)+'</small></span>';
    return view?'<a class="publisher source" href="#'+view+'">'+content+'</a>':'<div class="publisher source">'+content+'</div>';
  }
  function bubble(name,text,attachment=null,sent=false) {
    return '<article class="bubble'+(sent?' sent':'')+'"><small class="speaker">'+e(name)+'</small><p>'+e(text)+'</p>'+
      (attachment?'<blockquote><small>'+e(attachment.source)+'</small>'+e(attachment.quote)+'</blockquote>':'')+'</article>';
  }
  function card(view,title,caption,img='') {
    return '<a class="share-card" href="#'+view+'">'+(img?'<img src="'+img+'" alt="">':'')+
      '<span><strong>'+e(title)+'</strong><small>'+e(caption)+'</small></span><span aria-hidden="true">›</span></a>';
  }
  const postPreview = (label=event) => card('post',label,clb,'assets/ngay-hoi.svg');
  const details = {
    post:{source:clb,quote:event,text:'Tớ gửi lại bài tuyển để mình xem cùng nha.',reply:'Ừ, đúng bài tớ đã bình luận nè.'},
    comment:{source:'Bình luận công khai · Vy',quote:publicComment,text:'Tớ thấy câu hỏi của cậu ngay dưới bài.',reply:'À, tớ có hỏi ca chiều ngay dưới bài. Ai mở bài cũng đọc được ha.'},
    receipt:{source:'Biên lai · Ví học đường',quote:'+45.000đ · Đã nhận',text:'Đây là khoản 45k cậu nhận nè.',reply:'Ừ, tiền đó tớ nhận rồi. Mà cậu có biết chị ấy có làm bên CLB thật không?'},
    invite:{source:'Tin nhắn riêng · Hương Giang',quote:'Chị phụ trách ca chiều. Em chuyển 500.000đ để giữ ca nhé.',text:'Tớ đang xem lời mời của chị Giang.',reply:'Ừ, chị ấy cũng nói vậy với tớ. Bên CLB có ai xác nhận chưa cậu?'},
    giang:{source:'Tin nhắn riêng · Hương Giang',quote:giangAnswer,text:'Tớ hỏi chị Giang về cách đăng ký rồi.',reply:'Vậy là chị ấy vẫn bảo chuyển trước ha. Bên CLB có ai xác nhận chưa cậu?'},
    club:{source:'Hộp thư trang CLB Truyền thông Sao Mai',quote:clbAnswer,text:'Tớ hỏi qua hộp thư của CLB rồi. Đây là tin họ trả lời.',reply:'Vậy vẫn có ca chiều, mà đăng ký trong bài là được hả?'}
  };
  function share(id,label='Gửi chi tiết cho Vy') {
    return state.shared.includes(id)?pill('Đã gửi cho Vy'):B(label,'share',id,'primary');
  }
  function chat(text,reply,attachment=null) {
    state.messages.push({name:'Bạn · Đã gửi',text,attachment,sent:true},{name:'Vy',text:reply});
  }
  function inbox() {
    const conversation = state.messages.map(m=>bubble(m.name,m.text,m.attachment,m.sent)).join('');
    return '<div class="inbox-layout"><aside class="portrait">'+portrait()+'</aside>'+
      '<section class="conversation"><div class="contact-title"><h1>Hộp thư · Thảo Vy</h1>'+pill('500.000đ · '+status())+'</div>'+
      '<details class="first-guide" '+(state.guide?'open':'')+'><summary>Cách chơi</summary><p>'+e(guide)+'</p></details>'+
      bubble('Vy','Ê, có chị nhắn tớ làm thử cho cái sự kiện của trường hôm qua á. Chị ấy biết tớ muốn làm ca chiều, mà làm xong chị trả tớ 45k thật.')+
      bubble('Vy','Giờ chị bảo chuyển 500k giữ ca, xong việc sẽ trả lại. Tớ thấy hơi cấn. Cậu coi giúp tớ với.')+
      postPreview('Mở bài tuyển Vy gửi')+
      '<div class="chat-thread">'+conversation+'</div>'+
      (unsettled()?actions(
        state.transfer==='pending'?B('Khoan bấm nha, để tớ xem','pause','','primary'):'',
        state.shared.includes('club')?B('Đăng ký qua bài gốc nha','register-advice','','primary'):'',
        B('Thôi, cậu hủy khoản này đi','cancel'),
        state.transfer==='waiting'?B('Kết thúc tại đây · Chưa chuyển','finish-wait'):''):
        actions(state.transfer==='paid'&&!state.prepared?go('recover','Mở hồ sơ hỗ trợ','primary'):'',
          state.registered?pill('Đã gửi đăng ký'):state.shared.includes('club')&&state.transfer==='cancelled'?go('register','Mở biểu mẫu đăng ký','primary'):'',
          resultReady()?resultLink():''))+
      '<div class="shared-list">'+card('recruiter','Chat với Hương Giang','Lời mời Vy chia sẻ')+
      card('receipt','Biên lai +45.000đ','Tiền đến · Đã nhận')+
      card('transfer','Giao dịch 500.000đ',status())+'</div></section></div>';
  }
  function post() {
    return '<h1>Bài đăng</h1><article class="artifact event-post"><header>'+
      publisher(clb,'SM','Bài đăng công khai · Hôm qua','page')+'</header>'+
      '<img src="assets/ngay-hoi.svg" alt="Bìa minh họa Ngày hội Sao Mai tại sân trường">'+
      '<div class="artifact-body"><h2>'+e(event)+'</h2><p>Tụi mình cần cộng tác viên đón khách, hướng dẫn các gian và hỗ trợ khu truyền thông tại sân trường.</p>'+
      '<ul><li>Ca sáng: 07:30–11:00</li><li>Ca chiều: 13:00–16:30</li></ul>'+
      actions(go('register','Mở biểu mẫu đăng ký','primary'),share('post','Chia sẻ bài cho Vy'))+
      '<details id="comments"><summary>3 bình luận công khai</summary><ul class="comments">'+
      '<li><b>Minh Anh</b><p>Ca sáng còn chỗ không ạ?</p></li>'+
      '<li><b>Thảo Vy</b><p>'+e(publicComment)+'</p>'+share('comment','Gửi bình luận này cho Vy')+'</li>'+
      '<li><b>Gia Bảo</b><p>Em đăng ký bên khu đón khách ạ.</p></li></ul></details></div></article>'+
      actions(go('page','Ghé trang CLB'),go('recruiter','Xem chat Hương Giang'),inboxLink());
  }
  function recruiter() {
    return '<h1>Chat · Hương Giang</h1><section class="conversation source-chat">'+
      publisher('Hương Giang','HG','Tài khoản nhắn riêng · Chat Vy chia sẻ')+
      bubble('Hương Giang','Chị phụ trách ca chiều. Thấy em muốn làm ca đó, em thử rà danh sách khách mời giúp chị nhé.')+
      bubble('Hương Giang','Chị gửi em 45.000đ tiền làm thử rồi. Em chuyển 500.000đ để giữ ca, hết ca chị trả lại nha.')+
      actions(share('invite','Gửi lời mời riêng cho Vy'))+
      (state.asked?bubble('Bạn · Đã gửi','Em đăng ký qua bài của CLB được không chị?',null,true)+
        bubble('Hương Giang',giangAnswer)+actions(share('giang','Chuyển lời Hương Giang cho Vy')):
        actions(B('Em đăng ký qua bài của CLB được không chị?','ask-giang','','primary')))+
      '</section>'+actions(state.reported?pill(reportStatus):go('report','Báo cáo tài khoản Hương Giang'),go('post','Mở bài gốc'),inboxLink());
  }
  function club() {
    return '<h1>Hộp thư trang CLB</h1><section class="conversation source-chat">'+publisher(clb,'SM','Hộp thư mở từ trang đăng bài gốc')+
      '<div class="shared-list">'+postPreview()+card('recruiter','Lời mời riêng của Hương Giang','Yêu cầu chuyển 500.000đ để giữ ca')+'</div>'+
      (state.verified?bubble('Bạn · Đã gửi',clubQuestion,null,true)+
        bubble(clb,clbAnswer)+actions(share('club','Chuyển phản hồi của CLB cho Vy')):
        '<div class="question-preview"><small>Câu hỏi gửi kèm hai nội dung trên</small><p>'+e(clubQuestion)+'</p></div>'+actions(B('Hỏi CLB kèm bài và lời mời riêng','ask-club','','primary')))+
      '</section>'+actions(go('page','Về trang CLB'),inboxLink());
  }
  function transaction(incoming=false) {
    return '<article class="slip"><header><span class="seal">'+(incoming?'↙':'↗')+'</span><b>Ví học đường</b><small>Mô phỏng</small></header>'+
      '<strong class="amount">'+(incoming?'+45.000đ':'500.000đ')+'</strong>'+pill(incoming?'Đã nhận':status())+
      '<dl><dt>Nội dung</dt><dd>'+(incoming?'Tiền làm thử':'Giữ ca chiều')+'</dd><dt>'+(incoming?'Nguồn tiền':'Người nhận')+'</dt><dd>LE THI H</dd></dl></article>';
  }
  function summary() {
    const checked = [];
    if(state.seen.includes('post')) checked.push('Đã mở bài tuyển của CLB và thấy biểu mẫu đăng ký trong bài.');
    if(state.seen.includes('comments')) checked.push('Câu hỏi của Vy về ca chiều nằm trong bình luận công khai.');
    if(state.seen.includes('receipt')) checked.push('Biên lai ghi nhận khoản 45.000đ đã vào ví Vy.');
    if(state.seen.includes('recruiter')) checked.push('Đã đọc lời mời riêng yêu cầu chuyển 500.000đ để giữ ca.');
    if(state.asked) checked.push('Hương Giang nói mình giữ ca riêng và vẫn yêu cầu chuyển tiền.');
    if(state.verified) checked.push('CLB xác nhận bài tuyển là thật, ca chiều đăng ký qua biểu mẫu và không thu tiền giữ ca.');
    if(!resultReady()) return '<h1>Ca đang diễn ra</h1>'+actions(inboxLink());
    const outcome = state.prepared?'Vy đã chuyển 500.000đ, dừng nạp thêm và gửi hồ sơ hỗ trợ. Khoản tiền đang chờ xử lý.':
      state.transfer==='cancelled'?'Vy đã hủy khoản chuyển 500.000đ.':
      'Vy chưa chuyển 500.000đ. Tạm dừng là cách xử lý an toàn khi lời mời riêng còn cần kiểm tra.';
    return '<h1>Tóm tắt ca Vy</h1><div class="outcome">'+e(outcome)+'</div><dl class="result"><dt>Đã kiểm tra</dt><dd>'+
      (checked.length?'<ul>'+checked.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>':'Chưa kiểm tra nguồn nào.')+
      '</dd><dt>Chưa biết</dt><dd>Danh tính thật của người nhắn riêng vẫn chưa rõ.'+
      (!state.verified?' Vai trò người nhắn và điều kiện đăng ký vẫn cần được kiểm tra với CLB.':'')+
      '</dd><dt>Đăng ký qua bài gốc</dt><dd>'+(state.registered?'Đã gửi đăng ký. CLB chưa xác nhận kết quả.':'Chưa gửi đăng ký.')+
      '</dd><dt>Báo cáo tài khoản nhắn riêng</dt><dd>'+(state.reported?reportStatus:'Chưa báo cáo.')+'</dd></dl>'+
      actions(go('inbox',unsettled()?'Quay lại kiểm tra tiếp':'Về hộp thư Vy','primary'),go('post','Mở bài gốc'));
  }
  const panels = {
    inbox,post,recruiter,club,
    page:()=>'<h1>Trang CLB</h1>'+publisher(clb,'SM','Trang câu lạc bộ · THPT Sao Mai')+
      '<p>Kênh của CLB Truyền thông, nơi đăng thông tin và lịch hoạt động của trường.</p>'+
      actions(go('club','Mở hộp thư trang CLB','primary'),go('post','Xem bài tuyển'),inboxLink()),
    receipt:()=>'<h1>Biên lai Vy gửi</h1>'+transaction(true)+actions(share('receipt','Gửi biên lai cho Vy'),inboxLink()),
    transfer:()=>'<h1>Giao dịch Vy chia sẻ</h1>'+transaction()+actions(
      unsettled()?B('Khuyên Vy chuyển','choose-transfer','','danger'):state.transfer==='paid'?go('recover','Mở hồ sơ hỗ trợ','primary'):'',
      inboxLink()),
    confirm:()=>'<h1>Xác nhận lời khuyên</h1>'+transaction()+'<p>Trong mô phỏng, Vy sẽ chuyển 500.000đ nếu bạn xác nhận.</p>'+
      actions(unsettled()&&confirmTransfer?B('Xác nhận khuyên chuyển','confirm','','danger'):'',go('transfer','Quay lại, chưa chuyển','primary')),
    register:()=>'<h1>Biểu mẫu đăng ký · Ngày hội Sao Mai</h1><p>Biểu mẫu mô phỏng do '+e(clb)+' đăng trong bài gốc.</p>'+
      (state.registered?'<p role="status" class="outcome">Đã gửi đăng ký · '+(state.registered==='afternoon'?'Ca chiều':'Ca sáng')+' · Chờ CLB phản hồi</p>':
        '<form id="register-form"><fieldset><legend>Ca của Thảo Vy</legend><label><input type="radio" name="shift" value="morning" required> Ca sáng · 07:30–11:00</label>'+
        '<label><input type="radio" name="shift" value="afternoon" required> Ca chiều · 13:00–16:30</label></fieldset><button class="primary">Gửi đăng ký</button></form>')+
      actions(go('post','Về bài gốc'),inboxLink(),resultReady()?resultLink():''),
    report:()=>'<h1>Báo cáo tài khoản nhắn riêng</h1>'+publisher('Hương Giang','HG','Tài khoản nhắn riêng')+
      (state.reported?'<p class="outcome" role="status">'+reportStatus+'</p>':
        '<p>Lý do: yêu cầu chuyển tiền giữ chỗ qua tin nhắn riêng.</p>'+B('Gửi báo cáo','report','','primary'))+
      actions(go('recruiter','Về cuộc trò chuyện'),inboxLink(),resultReady()?resultLink():''),
    result:summary,
    recover:()=>'<h1>Hồ sơ hỗ trợ</h1><p>Hương Giang lại đòi nạp thêm để hoàn tiền.</p>'+pill(state.prepared?'Đã chuẩn bị':state.bank||state.code||state.receipt||state.chatSaved?'Đang bổ sung':'Chưa chuẩn bị')+
      (state.transfer!=='paid'?'<p>Giao dịch này chưa phát sinh.</p>':state.prepared?'<p>Khoản tiền đang chờ xử lý.</p>':
      '<div class="actions">'+B(state.stopped?'✓ Đã nhắn dừng nạp':'Nhắn Vy dừng nạp thêm','stop','','',state.stopped?'disabled':'')+go('bank','Mở hỗ trợ chính thức của ngân hàng')+'</div>'+
      '<h3>Lịch sử giao dịch</h3><div class="history">'+
      [['incoming','↙ +45.000đ · Tiền đến'],['sent','↗ −500.000đ · Giữ ca chiều'],['other','↗ −32.000đ · Ăn trưa']].map(([id,label])=>B(label,'history',id,'','aria-pressed="'+(state.history===id)+'"')).join('')+'</div>'+
      (state.history==='sent'?transaction()+'<div class="actions">'+B(state.code?'✓ Đã lưu MP-500-042':'Lưu mã MP-500-042','keep','code','',state.code?'disabled':'')+
        B(state.receipt?'✓ Đã lưu biên lai':'Lưu ảnh biên lai','keep','receipt','',state.receipt?'disabled':'')+'</div>':'')+
      '<details '+(state.chatSaved?'open':'')+'><summary>Xem đoạn chat đòi nạp thêm</summary><p class="bubble">Em nạp thêm phí mở khóa thì chị mới hoàn tiền được nha.</p>'+B(state.chatSaved?'✓ Đã lưu đoạn chat':'Lưu đoạn chat','keep','chatSaved','',state.chatSaved?'disabled':'')+'</details>'+
      '<div class="actions">'+B('Hoàn tất hồ sơ','prepare','','primary',state.stopped&&state.bank&&state.code&&state.receipt&&state.chatSaved?'':'disabled')+'</div>')+actions(inboxLink(),state.prepared?resultLink():''),
    bank:()=>'<h1>Hỗ trợ chính thức · Ví học đường</h1><p>Kênh ngân hàng trong mô phỏng. Bạn có thể mở hỗ trợ ngay và bổ sung mã giao dịch, biên lai và đoạn chat sau.</p><div class="actions">'+
      (state.transfer==='paid'?B(state.bank?'✓ Đã mở yêu cầu hỗ trợ':'Mở yêu cầu hỗ trợ','bank','','primary',state.bank?'disabled':''):'')+go('recover','Về hồ sơ hỗ trợ')+go('inbox','Về hộp thư')+'</div>',
  };
  function markSeen(id) {
    if (!state.seen.includes(id)) state.seen.push(id);
  }
  function render() {
    const view=current();
    if (!resume) {
      state.view=view;
      if(['post','receipt','recruiter'].includes(view)) markSeen(view);
      save();
    }
    host.innerHTML='<header class="top"><a class="brand" href="#inbox">ViệtBook <small>Ca trực an toàn số</small></a><nav>'+
      (resume?'':go('inbox','Hộp thư Vy')+B('Cách chơi','help')+B('Chơi lại','reset'))+'</nav></header>'+
      '<div class="shell"><div class="case-label">CA 01 <strong>Ca của Vy</strong></div>'+
      '<section class="surface '+view+'"><div class="notice" role="status">'+e(notice)+'</div>'+
      (resume?'<h1>Ca của Vy có tiến trình đã lưu</h1><p>500.000đ · '+e(status())+'</p>'+
        actions(B('Tiếp tục ca','resume','','primary'),B('Chơi lại từ đầu','reset')):panels[view]())+
      '</section><footer>ViệtBook là mạng xã hội giả lập. Nhân vật, biểu mẫu và giao dịch đều là mô phỏng.</footer></div>'+
      '<dialog class="case-guide guide-dialog" aria-labelledby="guide-title"><h2 id="guide-title">Cách chơi</h2><p>'+e(guide)+'</p>'+
      '<form method="dialog"><button class="primary">Đóng hướng dẫn</button></form></dialog>';
    const comments=host.querySelector('#comments');
    comments?.addEventListener('toggle',()=>{
      if(comments.open && current()==='post' && !resume) {markSeen('comments');save();}
    });
    host.querySelector('.first-guide')?.addEventListener('toggle',event=>{
      if(!event.target.isConnected) return;
      state.guide=event.target.open;
      save();
    });
  }
  function focusLatest(selector) {
    const target=host.querySelector(selector);
    target?.setAttribute('tabindex','-1');
    target?.focus();
  }
  function act(action,id) {
    notice='';
    if(resume && !['resume','reset'].includes(action)) return;
    if(action==='help') {host.querySelector('dialog').showModal();return;}
    if(action==='resume') {
      resume=false;
      render();
      focusLatest('.surface h1');
      return;
    }
    if(action==='reset') {
      if(!window.confirm('Chơi lại từ đầu? Tiến trình ca này sẽ được đặt lại.')) return;
      state=fresh();resume=false;confirmTransfer=false;navigate('inbox');return;
    }
    if(action==='share' && Object.hasOwn(details,id) && !state.shared.includes(id)) {
      if((id==='club'&&!state.verified)||(id==='giang'&&!state.asked)) return;
      const {source,quote,text,reply}=details[id];
      state.shared.push(id);
      chat(text,reply,{source,quote});
      save();navigate('inbox');return;
    }
    if(action==='pause'&&state.transfer==='pending') {
      state.transfer='waiting';
      chat('Khoan bấm nha, để tớ xem','Ừ, tớ để đó. Mà nếu chị ấy không phụ trách thật thì tớ đăng ký ca chiều ở đâu ta?');
    } else if(action==='ask-giang'&&!state.asked) state.asked=true;
    else if(action==='ask-club'&&!state.verified) state.verified=true;
    else if(action==='cancel'&&unsettled()) {
      state.transfer='cancelled';state.finished=true;
      chat('Thôi, cậu hủy khoản này đi','Ừ, tớ hủy khoản 500k nha.');
    } else if(action==='register-advice'&&unsettled()&&state.shared.includes('club')) {
      state.transfer='cancelled';state.finished=true;
      chat('Đăng ký qua bài gốc nha','Ừ, tớ hủy khoản 500k. Mở lại bài để tớ đăng ký ca chiều nha.');
    } else if(action==='finish-wait'&&state.transfer==='waiting') {
      state.finished=true;save();navigate('result');return;
    } else if(action==='choose-transfer'&&unsettled()) {
      confirmTransfer=true;navigate('confirm');return;
    } else if(action==='confirm'&&unsettled()&&confirmTransfer) {
      confirmTransfer=false;state.transfer='paid';state.finished=false;
      chat('Cậu thử chuyển khoản giữ ca đi.','Tớ chuyển rồi. Giờ chị ấy bảo nạp thêm phí thì mới hoàn lại.');
      save();navigate('inbox');return;
    } else if(action==='report'&&!state.reported) state.reported=true;
    else if(action==='stop'&&state.transfer==='paid'&&!state.stopped) {
      state.stopped=true;
      chat('Cậu dừng nạp thêm nha.','Ừ, tớ không chuyển thêm nữa.');
      notice='Đã nhắn Vy dừng nạp thêm.';
    } else if(action==='bank'&&state.transfer==='paid') state.bank=true;
    else if(action==='history'&&state.transfer==='paid') {
      state.history=id;
      if(id==='incoming') notice='Đây là khoản 45.000đ tiền đến. Hãy chọn giao dịch 500.000đ đã chuyển đi.';
      if(id==='other') notice='Khoản này không phải khoản giữ ca.';
    } else if(action==='keep'&&state.transfer==='paid'&&(id==='chatSaved'||(state.history==='sent'&&['code','receipt'].includes(id)))) {
      state[id]=true;notice='Đã lưu vào hồ sơ hỗ trợ.';
    } else if(action==='prepare'&&state.transfer==='paid'&&state.stopped&&state.bank&&state.code&&state.receipt&&state.chatSaved) {
      state.prepared=true;save();navigate('result');return;
    } else return;
    render();
    const feedback={pause:'.chat-thread .bubble:last-child',cancel:'.chat-thread .bubble:last-child','register-advice':'.chat-thread .bubble:last-child',
      'ask-giang':'.source-chat .bubble:last-of-type','ask-club':'.source-chat .bubble:last-of-type',report:'.outcome',history:'.notice',bank:'.bank .actions'};
    focusLatest(feedback[action] || (notice?'.notice':'.surface h1'));
  }
  host.addEventListener('click',event=>{
    const button=event.target.closest('button[data-action]');
    if(button) act(button.dataset.action,button.dataset.id);
  });
  host.addEventListener('submit',event=>{
    if(event.target.id!=='register-form') return;
    event.preventDefault();
    if(state.registered || !new FormData(event.target).get('shift')) return;
    state.registered=new FormData(event.target).get('shift');render();focusLatest('.outcome');
  });
  addEventListener('hashchange',()=>{
    if(current()!=='confirm') confirmTransfer=false;
    notice='';render();window.scrollTo(0,0);
    focusLatest(current()==='inbox'&&state.messages.length?'.chat-thread .bubble:last-child':'.surface h1');
  });
  if (saved && !location.hash && Object.hasOwn(panels,saved.view) && saved.view!=='inbox') {
    history.replaceState(null,'','#'+(saved.view==='confirm'?'transfer':saved.view));
  }
  render();
})();
