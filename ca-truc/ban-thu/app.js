(() => {
  'use strict';
  const host = document.getElementById('app');
  const storage = window.frameElement?.caTrucStorage;
  const fresh = () => ({view:'inbox', messages:[], seen:[], sent:[], asked:[], draft:null,
    sharedReturn:'inbox', paused:false, stopped:false, verifiedShared:false, extraPaid:false,
    transferPrompt:false, finished:false, receiptSaved:false, chatSaved:false, reported:false,
    dossier:false, giangAsked:false});
  const saved = storage?.load();
  let state = {...fresh(), ...saved};
  const studio = 'Sao Mai Studio';
  const postQuestion = 'Bài tuyển hỗ trợ nội dung này bên mình đăng phải không ạ?';
  const processQuestion = 'Bạn em được hướng dẫn ứng tiền làm nhiệm vụ, đã chuyển 500k rồi. Bên mình có quy trình này không ạ?';
  const postAnswer = 'Đúng em, bài tuyển hỗ trợ nội dung này do bên mình đăng.';
  const processAnswer = 'Bên mình không tổ chức chương trình ứng tiền làm nhiệm vụ. Cộng tác viên không phải chuyển tiền để được thanh toán.';
  const processReply = 'Ừ, tớ không chuyển thêm nữa. Tớ giữ lại tin nhắn với biên lai để nhờ hỗ trợ.';
  const sources = [
    ['Sức khỏe & Đời sống · 01/04/2024','https://suckhoedoisong.vn/bi-lua-240-trieu-dong-khi-lam-cong-tac-vien-online-169240401084106032.htm'],
    ['Sở Tư pháp Quảng Ngãi · 08/08/2023','https://stp.quangngai.gov.vn/danh-muc-cot-phai/tin-tuc/trat-tu-an-toan-xa-hoi/-viec-nhe-luong-cao-va-cu-lua-tien-ty.html'],
    ['Cảnh báo NCSC · 05/06/2022','https://mst.gov.vn/canh-giac-voi-thu-doan-lua-dao-tuyen-cong-tac-vien-cho-san-thuong-mai-dien-tu-197153805.htm']
  ];
  const evidence = {
    receipt:{source:'Ví học đường · Biên lai',quote:'+45.000đ · Đã nhận',options:[
      'Họ từng trả tiền rồi, chắc làm tiếp được.',
      '45k đã về, nhưng khoản đang đòi thêm vẫn cần kiểm tra.'
    ]},
    post:{source:'Hộp thư Sao Mai Studio',quote:postAnswer,options:[
      'Bài tuyển là thật, chắc lời mời cũng ổn.',
      'Bài là thật. Tớ hỏi tiếp về việc ứng tiền nha.'
    ]}
  };
  const e = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button = (label,action,id='',cls='') => '<button type="button" data-action="'+action+'" data-id="'+id+'" class="'+cls+'">'+e(label)+'</button>';
  const go = (view,label,cls='') => '<a class="button '+cls+'" href="#'+view+'">'+e(label)+'</a>';
  const actions = (...items) => '<div class="actions">'+items.join('')+'</div>';
  const bubble = (name,text,sent=false,attachment=null) => '<article class="bubble'+(sent?' sent':'')+'"><small class="speaker">'+e(name)+'</small><p>'+e(text)+'</p>'+
    (attachment?'<blockquote><small>'+e(attachment.source)+'</small>'+e(attachment.quote)+'</blockquote>':'')+'</article>';
  const pill = text => '<span class="pill">'+e(text)+'</span>';
  const back = () => go(state.sharedReturn==='club'?'club':'inbox',state.sharedReturn==='club'?'Về hội thoại Sao Mai':'Về hộp thư Vy','primary');
  const save = () => storage?.save(state);
  const current = () => Object.hasOwn(panels,location.hash.slice(1))?location.hash.slice(1):'inbox';
  const total = () => state.extraPaid?'1.500.000đ':'500.000đ';
  const canContinue = () => !state.extraPaid&&!state.stopped&&!state.finished;
  const ready = () => state.finished||state.stopped||state.extraPaid;
  const resultLink = () => ready()?go('result','Xem tổng kết'):'';
  function navigate(view) {
    if(current()===view) render();
    else location.hash=view;
  }
  function chat(text,reply,attachment=null) {
    state.messages.push({name:'Bạn · Đã gửi',text,sent:true,attachment},{name:'Vy',text:reply});
  }
  function publisher(name,caption,view='') {
    const content='<span class="mark school">SM</span><span><b>'+e(name)+'</b><small>'+e(caption)+'</small></span>';
    return view?'<a class="publisher source" href="#'+view+'">'+content+'</a>':'<div class="publisher source">'+content+'</div>';
  }
  function card(view,title,caption) {
    return '<a class="share-card" href="#'+view+'"><span><strong>'+e(title)+'</strong><small>'+e(caption)+'</small></span><span aria-hidden="true">›</span></a>';
  }
  function draft() {
    if(!state.draft) return '';
    const {id,choice} = state.draft, item=evidence[id];
    return '<section class="draft-box"><h3>Bản nháp · Chưa gửi</h3>'+bubble('Bạn · Sắp gửi',item.options[choice],true,item)+
      actions(button('Gửi cho Vy','send-draft','','primary'),button('Đổi nhận định','change-draft'),button('Bỏ bản nháp','discard-draft'))+'</section>';
  }
  function evidenceChoices(id) {
    const item=evidence[id];
    return '<p>Chọn lời nhắn gửi kèm căn cứ</p>'+actions(...item.options.map((label,i)=>
      state.sent.includes(id+'-'+i)?pill('Đã gửi · '+label):button(label,'draft',id+'-'+i)))+draft();
  }
  function inbox() {
    const thread=state.messages.map(m=>bubble(m.name,m.text,m.sent,m.attachment)).join('');
    return '<div class="inbox-layout"><aside class="portrait"><figure class="scene '+(state.stopped?'nhe-nhom':'lo-lang')+'"><figcaption class="scene-caption">Thảo Vy</figcaption></figure></aside>'+
      '<section class="conversation"><div class="contact-title"><h1>Hộp thư · Thảo Vy</h1>'+pill('Đã chuyển · '+total())+'</div>'+
      bubble('Vy','Tớ chuyển 500k rồi mà chưa nhận lại được. Bên đó bảo còn một bước nữa.')+
      bubble('Vy','Tớ thấy không ổn, nhưng bỏ bây giờ thì mất luôn tiền à? Cậu xem giúp tớ với.')+
      '<div class="shared-list">'+card('recruiter','Đoạn chat Vy chia sẻ','Vy và Hương Giang · Chỉ đọc')+
      card('transactions','Lịch sử giao dịch','Tiền thực nhận và tiền đã chuyển')+
      card('tasks','Bảng nhiệm vụ','Số hiển thị do bên tuyển dụng cung cấp')+
      card('post','Bài tuyển gốc','Sao Mai Studio · Hỗ trợ nội dung')+'</div>'+
      '<div class="chat-thread">'+thread+'</div>'+draft()+
      (state.transferPrompt?actions(button('Khoan, để tớ kiểm tra lại','rethink','','primary'),button('Ừ, cậu chuyển tiếp đi','proceed')):
      actions(!state.paused&&canContinue()?button('Khoan chuyển thêm, để tớ kiểm tra','pause','','primary'):'',
        canContinue()?button('Tớ nghĩ cậu có thể làm tiếp','risk'):'',
        state.paused&&!state.finished&&!state.stopped?button('Kết thúc tại đây · Đang chờ xác minh','finish'):'',
        go('recover','Mở hồ sơ hỗ trợ'),resultLink()))+
      (state.asked.length?actions(go('club','Quay lại hội thoại Sao Mai')):'')+'</section></div>';
  }
  function recruiter() {
    return '<h1>Đoạn chat Vy chia sẻ</h1><section class="conversation source-chat">'+publisher('Vy và Hương Giang','Bản xem lại · Chỉ đọc')+
      '<p class="chat-date">Hôm qua</p>'+bubble('Hương Giang','Chị tuyển cộng tác viên nội dung cho Sao Mai Studio.')+
      bubble('Hương Giang','Em rà lỗi bản nháp nội dung này giúp chị nha.')+bubble('Vy','Em rà xong rồi ạ.')+
      bubble('Hương Giang','Chị trả em 45k tiền làm thử rồi nhé.')+bubble('Vy','Em nhận được rồi ạ.')+
      '<p class="chat-date">Hôm nay</p>'+bubble('Hương Giang','Nhiệm vụ tiếp theo em ứng trước 500k.')+
      bubble('Hương Giang','Hoàn thành thì hệ thống thanh toán cả tiền ứng và tiền công.')+bubble('Vy','Em chuyển 500k rồi. Sao tiền chưa về ạ?')+
      bubble('Hương Giang','Em cần làm tiếp bước 1 triệu mới thanh toán được.')+
      (state.extraPaid?bubble('Vy','Em chuyển thêm 1 triệu rồi mà vẫn chưa nhận lại tiền.')+bubble('Hương Giang','Hồ sơ còn thiếu phí xử lý. Em chuyển thêm rồi chị hỗ trợ.'): '')+
      '</section>'+actions(back(),go('giang','Hỏi riêng Hương Giang'),go('report','Báo cáo tài khoản Hương Giang'),go('post','Xem bài tuyển gốc'));
  }
  function transactions() {
    return '<h1>Lịch sử giao dịch Vy chia sẻ</h1><div class="history">'+
      card('receipt','+45.000đ · Đã nhận','Tiền làm thử · Tiền đã vào ví')+
      '<article class="slip"><strong>−500.000đ · Đã chuyển</strong><p>Ứng tiền làm nhiệm vụ · MP-500-042</p></article>'+
      '<article class="slip"><strong>'+(state.extraPaid?'−1.000.000đ · Đã chuyển':'1.000.000đ · Chưa chuyển')+'</strong><p>Bước tiếp theo do Hương Giang yêu cầu</p></article></div>'+
      '<p>Tổng đã chuyển '+total()+'. Chưa có khoản hoàn lại. Khoản 45.000đ là tiền công nhận trước đó.</p>'+actions(back());
  }
  function receipt() {
    return '<h1>Biên lai 45k</h1><article class="slip">'+publisher('Ví học đường','Giao dịch mô phỏng')+
      '<strong class="amount">+45.000đ</strong>'+pill('Đã nhận')+'<p>Tiền làm thử · Đã vào ví Vy</p></article>'+
      evidenceChoices('receipt')+actions(go('transactions','Về lịch sử giao dịch'),back());
  }
  function tasks() {
    return '<h1>Bảng nhiệm vụ Vy chia sẻ</h1><article class="artifact artifact-body"><h2>Nội dung do bên tuyển dụng cung cấp</h2>'+
      '<p>Đây là số hiển thị trên bảng của họ. Tiền chưa vào ví Vy.</p><dl class="result"><dt>Tiền ứng đã ghi nhận</dt><dd>'+total()+
      '</dd><dt>Trạng thái</dt><dd>Chờ thanh toán</dd><dt>Yêu cầu tiếp theo</dt><dd>'+
      (state.extraPaid?'Bổ sung phí xử lý':'Hoàn thành bước ứng thêm 1.000.000đ')+'</dd></dl></article>'+actions(back(),go('transactions','Đối chiếu lịch sử giao dịch'));
  }
  function post() {
    return '<h1>Bài tuyển gốc</h1><article class="artifact event-post"><header>'+publisher(studio,'Bài đăng công khai','page')+'</header>'+
      '<div class="artifact-body"><h2>Tuyển cộng tác viên hỗ trợ nội dung</h2><p>Rà lỗi bài viết, sắp xếp hình và hỗ trợ biên tập nội dung trực tuyến.</p>'+
      '<p>Gửi mẫu bài qua hộp thư trang. Nhóm nội dung trao đổi yêu cầu và thù lao theo phần việc được nhận.</p>'+
      '<p>Bài này không mô tả chương trình ứng tiền làm nhiệm vụ.</p>'+actions(go('page','Ghé trang Sao Mai Studio','primary'))+'</div></article>'+
      actions(back());
  }
  function club() {
    const thread=state.asked.map(id=>bubble('Bạn · Đã gửi',id==='post'?postQuestion:processQuestion,true)+bubble(studio,id==='post'?postAnswer:processAnswer)+
      (id==='post'?evidenceChoices('post'):actions(state.verifiedShared?pill('Đã gửi phản hồi và lời khuyên dừng'):button('Gửi phản hồi và khuyên Vy dừng','share-process','','primary')))).join('');
    return '<h1>Hộp thư Sao Mai Studio</h1><section class="conversation source-chat">'+publisher(studio,'Hộp thư mở từ bài tuyển gốc')+thread+
      actions(!state.asked.includes('post')?button(postQuestion,'ask','post'):'',
        !state.asked.includes('process')?button(processQuestion,'ask','process'):'')+'</section>'+
      actions(go('recruiter','Xem đoạn chat Vy chia sẻ'),go('inbox','Về hộp thư Vy'));
  }
  function recover() {
    return '<h1>Hồ sơ hỗ trợ</h1><p>Đã chuyển '+total()+'. Khoản tiền chưa được thu hồi.</p>'+
      actions(state.stopped?pill('Vy đã dừng chuyển thêm'):button('Nhắn Vy dừng chuyển thêm','stop','','primary'))+
      '<details '+(state.receiptSaved?'open':'')+'><summary>Chứng từ chuyển tiền</summary><p>MP-500-042 · 500.000đ · Đã chuyển</p>'+
      (state.extraPaid?'<p>MP-1000-043 · 1.000.000đ · Đã chuyển</p>':'')+
      (state.receiptSaved?pill('Đã lưu chứng từ'):button('Lưu chứng từ chuyển tiền','keep','receiptSaved'))+'</details>'+
      '<details '+(state.chatSaved?'open':'')+'><summary>Tin nhắn yêu cầu chuyển thêm</summary>'+
      bubble('Hương Giang',state.extraPaid?'Em chuyển thêm phí xử lý rồi chị hỗ trợ.':'Em cần làm tiếp bước 1 triệu mới thanh toán được.')+
      (state.chatSaved?pill('Đã lưu tin nhắn'):button('Lưu tin nhắn yêu cầu chuyển thêm','keep','chatSaved'))+'</details>'+
      actions(go('report','Báo cáo tài khoản Hương Giang'),
        state.dossier?pill('Đã chuẩn bị hồ sơ · Chưa trình báo'):
          state.receiptSaved&&state.chatSaved?button('Cùng Vy chuẩn bị thông tin để trình báo','dossier'):'',resultLink(),go('inbox','Về hộp thư Vy'))+
      '<p class="small">Hồ sơ mô phỏng gồm tin nhắn và chứng từ. Chuẩn bị hồ sơ chưa phải đã trình báo. Việc báo cáo trên ViệtBook được ghi riêng.</p>';
  }
  function summary() {
    if(!ready()) return '<h1>Ca đang diễn ra</h1>'+actions(go('inbox','Về hộp thư Vy'));
    const group=state.extraPaid?'Đã chuyển thêm':state.verifiedShared&&state.stopped?'Đã xác minh và dừng chuyển thêm':'Đã tạm dừng, chưa xác minh đầy đủ';
    const reply=state.stopped?'Tớ không chuyển thêm nữa.':state.extraPaid?'Tớ chuyển thêm rồi mà tiền vẫn chưa về.':'Ừ, tớ chờ. Tớ chưa chuyển thêm.';
    const weakPost=state.sent.includes('post-0'), weakReceipt=state.sent.includes('receipt-0');
    const lesson=weakPost?'Bài tuyển thật chưa xác nhận người nhắn riêng đại diện cho đơn vị.':
      weakReceipt?'Những lần nhận tiền trước không xác nhận độ an toàn của yêu cầu tiếp theo.':
      'Khoản tiền đã chuyển không làm cho lần chuyển tiếp theo an toàn hơn.';
    return '<h1>'+group+'</h1><div class="outcome">Vy đã chuyển '+total()+'. Khoản tiền chưa được thu hồi.</div>'+
      '<p>45.000đ tiền công đã nhận trước đó được ghi riêng.</p>'+bubble('Vy',reply)+'<p>'+lesson+'</p>'+
      '<ul><li>'+(state.stopped?'Vy đã dừng chuyển thêm.':'Chưa chốt dừng chuyển thêm.')+'</li><li>'+
      (state.receiptSaved&&state.chatSaved?'Đã lưu tin nhắn và chứng từ chuyển tiền.':state.receiptSaved?'Đã lưu chứng từ. Còn thiếu tin nhắn.':
        state.chatSaved?'Đã lưu tin nhắn. Còn thiếu chứng từ.':'Chưa lưu tin nhắn và chứng từ.')+'</li></ul>'+
      '<details><summary>Những việc bạn đã làm</summary><ul>'+
      state.seen.map(id=>'<li>Đã mở '+e(({recruiter:'đoạn chat Vy chia sẻ',post:'bài tuyển gốc',receipt:'biên lai 45k',tasks:'bảng nhiệm vụ',transactions:'lịch sử giao dịch'})[id]||id)+'.</li>').join('')+
      state.sent.map(key=>{const [id,choice]=key.split('-');return '<li>Đã gửi '+e(evidence[id].quote)+' cùng nhận định “'+e(evidence[id].options[Number(choice)])+'”.</li>';}).join('')+
      (state.asked.includes('post')?'<li>Đơn vị xác nhận bài tuyển do họ đăng.</li>':'')+
      (state.asked.includes('process')?'<li>Đơn vị xác nhận không tổ chức ứng tiền làm nhiệm vụ và không yêu cầu chuyển tiền để thanh toán.</li>':'')+
      (state.verifiedShared?'<li>Đã gửi phản hồi về quy trình và lời khuyên dừng cho Vy.</li>':'')+
      (state.asked.length?'<li>Danh tính và vai trò thật của Hương Giang chưa được xác minh.</li>':'')+
      (state.reported?'<li>Đã báo cáo tài khoản Hương Giang trên ViệtBook. Chờ xem xét.</li>':'')+
      (state.dossier?'<li>Đã chuẩn bị hồ sơ mô phỏng. Chưa trình báo.</li>':'')+'</ul></details>'+
      '<details><summary>Cơ sở tình huống</summary><p>Cơ chế trả công ban đầu, yêu cầu ứng tiền và giữ thanh toán được chuyển thể từ các cảnh báo dưới đây. Tên người, tổ chức và mọi diễn biến cụ thể trong ca đều hư cấu.</p><ul>'+
      sources.map(([label,url])=>'<li><a href="'+url+'" target="_blank" rel="noopener">'+label+'</a></li>').join('')+'</ul></details>'+
      actions(go('recover','Tiếp tục hỗ trợ Vy','primary'),go('inbox','Về hộp thư Vy'));
  }
  const panels={
    inbox,recruiter,transactions,receipt,tasks,post,club,recover,result:summary,
    page:()=>'<h1>Trang Sao Mai Studio</h1>'+publisher(studio,'Đơn vị truyền thông trong thế giới game')+
      '<p>Nội dung số, hình ảnh và biên tập.</p>'+actions(go('club','Nhắn tin Sao Mai Studio','primary'),go('post','Xem bài tuyển gốc'),go('inbox','Về hộp thư Vy')),
    giang:()=>'<h1>Hội thoại riêng · Hương Giang</h1>'+publisher('Hương Giang','Hội thoại từ tài khoản người chơi')+
      (state.giangAsked?bubble('Bạn · Đã gửi','Bạn em là Vy, đã ứng tiền mà chưa được thanh toán. Vì sao phải chuyển thêm ạ?',true)+
      bubble('Hương Giang','Chương trình này chị phụ trách riêng. Vy làm nốt bước tiếp theo thì hệ thống mới trả gộp.'):
      actions(button('Hỏi vì sao Vy phải chuyển thêm','ask-giang')))+actions(go('recruiter','Về đoạn chat Vy chia sẻ'),go('inbox','Về hộp thư Vy')),
    report:()=>'<h1>Báo cáo tài khoản Hương Giang</h1>'+publisher('Hương Giang','Tài khoản gửi yêu cầu ứng tiền')+
      (state.reported?pill('Đã gửi báo cáo · Chờ xem xét'):button('Gửi báo cáo trên ViệtBook','report','','primary'))+
      actions(go('recover','Về hồ sơ hỗ trợ'),go('recruiter','Về đoạn chat Vy chia sẻ'))
  };
  function render() {
    const view=current();state.view=view;
    if(['recruiter','post','receipt','transactions','tasks'].includes(view)&&!state.seen.includes(view)) state.seen.push(view);
    save();
    host.innerHTML='<header class="top"><a class="brand" href="#inbox">ViệtBook <small>Ca trực an toàn số</small></a><nav>'+
      go('inbox','Hộp thư Vy')+button('Chơi lại','reset')+'</nav></header><div class="shell"><div class="case-label">CA CỦA VY <strong>Khoản tiền chưa về</strong></div>'+
      (window.frameElement?.caTrucRevised?'<p class="notice">Ca Vy có kịch bản mới. Lượt giữ ca cũ được lưu riêng, lượt này bắt đầu lại.</p>':'')+
      '<section class="surface '+view+'">'+panels[view]()+'</section><footer>Mạng xã hội giả lập. Mọi giao dịch, báo cáo và liên hệ trong ca đều là mô phỏng.</footer></div>';
  }
  function act(action,id) {
    if(action==='reset') {
      if(!window.confirm('Chơi lại riêng ca Vy từ đầu?')) return;
      state=fresh();save();navigate('inbox');return;
    }
    if(action==='ask'&&current()==='club'&&['post','process'].includes(id)&&!state.asked.includes(id)) state.asked.push(id);
    else if(action==='draft') {
      const [key,choice]=id.split('-');
      if(!Object.hasOwn(evidence,key)||!['0','1'].includes(choice)||(key==='post'&&!state.asked.includes('post'))) return;
      if(state.sent.includes(id)) return;
      state.draft={id:key,choice:Number(choice)};
    } else if(action==='discard-draft'&&state.draft) state.draft=null;
    else if(action==='change-draft'&&state.draft) {
      const key=state.draft.id;state.draft=null;save();navigate(key==='post'?'club':'receipt');return;
    } else if(action==='send-draft'&&state.draft) {
      const {id:key,choice}=state.draft,item=evidence[key],token=key+'-'+choice;
      if(state.sent.includes(token)) return;
      state.sent.push(token);state.draft=null;
      let reply=choice===0?'Vậy khoản 500k chưa về mà họ đòi thêm thì sao?':
        key==='post'?'Ừ, hỏi kỹ giúp tớ chuyện ứng tiền nha.':'Ừ, tớ chờ cậu kiểm tra khoản họ đang đòi.';
      if(state.stopped||state.extraPaid||state.finished) reply='Ừ, tớ ghi nhận. Mình xem lại việc đã xảy ra nha.';
      chat(item.options[choice],reply,item);save();navigate('inbox');return;
    } else if(action==='pause'&&canContinue()&&!state.paused) {
      state.paused=true;chat('Khoan chuyển thêm, để tớ kiểm tra','Ừ, tớ chưa chuyển thêm. Cậu xem giúp tớ.');
    } else if(action==='finish'&&state.paused&&!state.transferPrompt&&!state.finished) {
      state.finished=true;save();navigate('result');return;
    } else if(action==='share-process'&&current()==='club'&&state.asked.includes('process')&&!state.verifiedShared) {
      state.verifiedShared=true;state.stopped=true;state.transferPrompt=false;state.finished=true;
      chat('Bên Sao Mai nói không có quy trình này. Cậu dừng chuyển thêm nha.',processReply,{source:studio,quote:processAnswer});
      save();navigate('inbox');return;
    } else if(action==='risk'&&canContinue()&&!state.transferPrompt) {
      state.transferPrompt=true;chat('Tớ nghĩ cậu có thể làm tiếp','Vậy tớ chuyển thêm 1 triệu để lấy lại khoản trước nha?');
    } else if(action==='rethink'&&state.transferPrompt&&canContinue()) {
      state.transferPrompt=false;state.paused=true;chat('Khoan, để tớ kiểm tra lại','Ừ, tớ vẫn chưa chuyển thêm.');
    } else if(action==='proceed'&&state.transferPrompt&&canContinue()) {
      state.transferPrompt=false;state.extraPaid=true;state.finished=false;
      state.receiptSaved=false;state.chatSaved=false;state.dossier=false;
      chat('Ừ, cậu chuyển tiếp đi','Tớ quyết định thử làm nốt bước này.');
      state.messages.push({name:'Vy',text:'Tớ vừa chuyển thêm 1 triệu rồi.'},{name:'Vy',text:'Vẫn chưa được thanh toán. Giờ họ lại đòi phí xử lý.'});
    } else if(action==='stop'&&!state.stopped&&current()==='recover') {
      state.stopped=true;state.transferPrompt=false;
      chat('Cậu đừng chuyển thêm nha.','Ừ, tớ dừng ở đây. Tớ không chuyển thêm nữa.');
      save();navigate('inbox');return;
    } else if(action==='keep'&&current()==='recover'&&['receiptSaved','chatSaved'].includes(id)) state[id]=true;
    else if(action==='dossier'&&current()==='recover'&&state.chatSaved&&state.receiptSaved) state.dossier=true;
    else if(action==='report'&&current()==='report') state.reported=true;
    else if(action==='ask-giang'&&current()==='giang'&&!state.giangAsked) state.giangAsked=true;
    else return;
    render();
    host.querySelector(action==='risk'?'.conversation .actions button':'.chat-thread .bubble:last-child')?.focus();
  }
  host.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');
    if(link&&['#recruiter','#transactions','#tasks','#post'].includes(link.hash)&&!['recruiter','giang','report'].includes(current())) {
      state.sharedReturn=current()==='club'?'club':'inbox';save();
    }
    const target=event.target.closest('button[data-action]');
    if(target) act(target.dataset.action,target.dataset.id);
  });
  addEventListener('hashchange',()=>{render();window.scrollTo(0,0);host.querySelector('.chat-thread .bubble:last-child')?.scrollIntoView({block:'nearest'});});
  if(saved&&Object.hasOwn(panels,saved.view)) history.replaceState(null,'','#'+saved.view);
  render();
})();
