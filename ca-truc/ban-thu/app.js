(() => {
  'use strict';
  const host = document.getElementById('app');
  const storage = window.frameElement?.caTrucStorage;
  const fresh = () => ({view:'inbox', selected:[], taskReturn:'recruiter', messages:[], seen:[], sent:[], asked:[], draft:null,
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
  const originalWork = 'Rà lỗi bài viết, sắp xếp hình và hỗ trợ biên tập nội dung trực tuyến.';
  const newWork = 'Ứng tiền thực hiện nhiệm vụ đơn hàng.';
  const excerpts = [
    {source:'Bài tuyển gốc · Sao Mai Studio',quote:originalWork},
    {source:'Thẻ nhiệm vụ · Hương Giang gửi cho Vy',quote:newWork}
  ];
  const evidence = {
    receipt:{source:'Ví học đường · Biên lai',quote:'+45.000đ · Đã nhận',options:[
      'Họ từng trả tiền rồi, chắc làm tiếp được.',
      '45k đã về, nhưng khoản đang đòi thêm vẫn cần kiểm tra.'
    ],replies:[
      '45k thì tớ nhận thật. Nhưng 500k ứng sau đó vẫn chưa về. Hai khoản này có giống nhau không?',
      'Ừ, tớ chưa chuyển thêm. Cậu kiểm tra giúp tớ.'
    ]},
    post:{source:'Hộp thư Sao Mai Studio',quote:postAnswer,options:[
      'Bài tuyển là thật, chắc lời mời cũng ổn.',
      'Bài là thật. Tớ hỏi tiếp về việc ứng tiền nha.'
    ],replies:[
      'Studio xác nhận bài đăng thôi hay họ xác nhận cả người nhắn cho tớ nữa?',
      'Ừ, hỏi giúp tớ xem bên họ có yêu cầu đó không nha.'
    ]},
    compare:{source:'Đối chiếu hai phần việc',quote:'Bài tuyển gốc và thẻ nhiệm vụ',excerpts,options:[
      'Phần việc mới khác bài tuyển. Tớ hỏi Studio về khoản ứng trước nha.',
      'Cùng nhắc Sao Mai thì chắc vẫn là việc của họ.'
    ],replies:[
      'Ừ, lúc đầu tớ chỉ nhận rà bài. Cậu hỏi giúp tớ phần ứng tiền với.',
      'Tên thì giống, nhưng ai xác nhận phần ứng tiền này là của Studio vậy cậu?'
    ]}
  };
  const e = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button = (label,action,id='',cls='') => '<button type="button" data-action="'+action+'" data-id="'+id+'" class="'+cls+'">'+e(label)+'</button>';
  const go = (view,label,cls='') => '<a class="button '+cls+'" href="#'+view+'">'+e(label)+'</a>';
  const actions = (...items) => '<div class="actions">'+items.join('')+'</div>';
  const bubble = (name,text,sent=false,attachment=null) => '<article class="bubble'+(sent?' sent':'')+'"><small class="speaker">'+e(name)+'</small><p>'+e(text)+'</p>'+
    (attachment?(attachment.excerpts||[attachment]).map(item=>'<blockquote><small>'+e(item.source)+'</small>'+e(item.quote)+'</blockquote>').join(''):'')+'</article>';
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
  function selectExcerpt(id) {
    const selected=state.selected.includes(id);
    return actions(button(selected?'✓ Đã chọn · Bỏ chọn':'Chọn để đối chiếu','select-excerpt',id,selected?'primary':''));
  }
  function comparison() {
    return '<section class="comparison-box"><h3>Đối chiếu phần việc</h3><p>Đang chọn '+state.selected.length+'/2 nội dung</p>'+
      '<ul>'+state.selected.map(id=>'<li>'+e(excerpts[Number(id)].source)+'</li>').join('')+'</ul>'+
      actions(!state.selected.includes('0')?go('post','Chọn nội dung bài tuyển'):'',
        !state.selected.includes('1')?go('task','Chọn nội dung nhiệm vụ'):'',
        state.selected.length?button('Bỏ chọn tất cả','clear-excerpts'):'')+
      (state.selected.length===2?evidenceChoices('compare'):
        draft())+'</section>';
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
      '<div class="chat-thread">'+thread+'</div>'+
      (state.selected.length?comparison():draft())+
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
      '<p class="chat-date">Hôm nay</p>'+bubble('Hương Giang','Chị gửi em phần việc tiếp theo.')+
      card('task','Nhiệm vụ hỗ trợ đơn hàng','Hương Giang gửi cho Vy')+
      bubble('Vy','Ủa, phần này phải chuyển tiền trước hả chị? Em tưởng mình làm nội dung.')+
      bubble('Hương Giang','Đây là phần hỗ trợ đơn hàng bên chị giao thêm.')+
      bubble('Vy','Em chuyển 500k rồi. Sao tiền chưa về ạ?')+
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
    return '<h1>Bảng nhiệm vụ Hương Giang gửi cho Vy</h1>'+
      card('task','Nhiệm vụ hỗ trợ đơn hàng','Hương Giang gửi cho Vy')+
      '<article class="artifact artifact-body"><h2>Bảng nhiệm vụ</h2><dl class="result"><dt>Tiền ứng đã ghi nhận</dt><dd>'+total()+
      '</dd><dt>Trạng thái</dt><dd>Chờ thanh toán</dd><dt>Yêu cầu tiếp theo</dt><dd>'+
      (state.extraPaid?'Bổ sung phí xử lý':'Hoàn thành bước ứng thêm 1.000.000đ')+'</dd></dl></article>'+actions(back(),go('transactions','Đối chiếu lịch sử giao dịch'));
  }
  function task() {
    const returnView=Object.hasOwn(panels,state.taskReturn)?state.taskReturn:'recruiter';
    const returnLabels={recruiter:'Về đoạn chat Vy chia sẻ',tasks:'Về bảng nhiệm vụ',post:'Về bài tuyển gốc',inbox:'Về hộp thư Vy',club:'Về hội thoại Sao Mai'};
    return '<h1>Nhiệm vụ hỗ trợ đơn hàng</h1><article class="artifact artifact-body">'+
      publisher('Hương Giang gửi cho Vy','Thẻ nhiệm vụ · Mô phỏng')+
      '<h2>Phần việc</h2><p>'+e(newWork)+'</p>'+selectExcerpt('1')+
      '<dl class="result"><dt>Khoản ứng</dt><dd>500.000đ</dd><dt>Thanh toán bên gửi mô tả</dt>'+
      '<dd>Hoàn khoản ứng và tiền công sau khi hoàn thành.</dd></dl></article>'+
      comparison()+actions(go(returnView,returnLabels[returnView]||'Quay lại','primary'));
  }
  function post() {
    return '<h1>Bài tuyển gốc</h1><article class="artifact event-post"><header>'+publisher(studio,'Bài đăng công khai','page')+'</header>'+
      '<div class="artifact-body"><h2>Tuyển cộng tác viên hỗ trợ nội dung</h2><p>'+e(originalWork)+'</p>'+selectExcerpt('0')+
      '<p>Gửi mẫu bài qua hộp thư trang. Nhóm nội dung trao đổi yêu cầu và thù lao theo phần việc được nhận.</p>'+
      actions(go('page','Ghé trang Sao Mai Studio','primary'))+'</div></article>'+
      comparison()+actions(back());
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
    const weakPost=state.sent.includes('post-0')||state.sent.includes('compare-1'), weakReceipt=state.sent.includes('receipt-0');
    const verifiedAt=state.messages.findIndex(message=>message.text===processReply);
    const weakReceiptAt=state.messages.findIndex(message=>message.sent&&message.text===evidence.receipt.options[0]);
    const weakPostAt=state.messages.findIndex(message=>message.sent&&message.text===evidence.post.options[0]);
    const correctedReceipt=weakReceiptAt>=0&&verifiedAt>weakReceiptAt;
    const correctedPost=weakPostAt>=0&&verifiedAt>weakPostAt;
    const lesson=weakPost?'Bài tuyển thật chưa xác nhận người nhắn riêng đại diện cho đơn vị.':
      weakReceipt?'Những lần nhận tiền trước không xác nhận độ an toàn của yêu cầu tiếp theo.':
      'Khoản tiền đã chuyển không làm cho lần chuyển tiếp theo an toàn hơn.';
    return '<h1>'+group+'</h1><div class="outcome">Vy đã chuyển '+total()+'. Khoản tiền chưa được thu hồi.</div>'+
      '<p>45.000đ tiền công đã nhận trước đó được ghi riêng.</p>'+bubble('Vy',reply)+'<p>'+lesson+'</p>'+
      '<ul><li>'+(state.stopped?'Vy đã dừng chuyển thêm.':'Chưa chốt dừng chuyển thêm.')+'</li><li>'+
      (state.receiptSaved&&state.chatSaved?'Đã lưu tin nhắn và chứng từ chuyển tiền.':state.receiptSaved?'Đã lưu chứng từ. Còn thiếu tin nhắn.':
        state.chatSaved?'Đã lưu tin nhắn. Còn thiếu chứng từ.':'Chưa lưu tin nhắn và chứng từ.')+'</li></ul>'+
      '<details><summary>Những việc bạn đã làm</summary><ul>'+
      state.seen.map(id=>'<li>Đã mở '+e(({recruiter:'đoạn chat Vy chia sẻ',post:'bài tuyển gốc',receipt:'biên lai 45k',task:'thẻ nhiệm vụ hỗ trợ đơn hàng',tasks:'bảng nhiệm vụ',transactions:'lịch sử giao dịch'})[id]||id)+'.</li>').join('')+
      state.sent.map(key=>{const [id,choice]=key.split('-');return '<li>'+(id==='compare'?'Đã đối chiếu phần việc bằng hai trích đoạn':'Đã gửi '+e(evidence[id].quote))+' cùng nhận định “'+e(evidence[id].options[Number(choice)])+'”.</li>';}).join('')+
      (correctedReceipt?'<li>Ban đầu dựa vào biên lai 45k để khuyên tin. Sau đó hỏi Studio và giúp Vy dừng chuyển thêm.</li>':'')+
      (correctedPost?'<li>Ban đầu coi bài tuyển thật là căn cứ tin lời mời. Sau đó hỏi đúng về ứng tiền và giúp Vy dừng chuyển thêm.</li>':'')+
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
    inbox,recruiter,transactions,receipt,tasks,task,post,club,recover,result:summary,
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
    if(['recruiter','post','receipt','transactions','tasks','task'].includes(view)&&!state.seen.includes(view)) state.seen.push(view);
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
    else if(action==='select-excerpt'&&['0','1'].includes(id)&&
      ((id==='0'&&current()==='post')||(id==='1'&&current()==='task'))) {
      state.selected=state.selected.includes(id)?state.selected.filter(value=>value!==id):[...state.selected,id];
      if(state.selected.length<2&&state.draft?.id==='compare') state.draft=null;
    } else if(action==='clear-excerpts') {
      state.selected=[];
      if(state.draft?.id==='compare') state.draft=null;
    } else if(action==='draft') {
      const [key,choice]=id.split('-');
      if(!Object.hasOwn(evidence,key)||!['0','1'].includes(choice)||(key==='post'&&!state.asked.includes('post'))||(key==='compare'&&state.selected.length!==2)) return;
      if(state.sent.includes(id)) return;
      state.draft={id:key,choice:Number(choice)};
    } else if(action==='discard-draft'&&state.draft) state.draft=null;
    else if(action==='change-draft'&&state.draft) {
      const key=state.draft.id;state.draft=null;save();navigate(key==='post'?'club':key==='compare'?'task':'receipt');return;
    } else if(action==='send-draft'&&state.draft) {
      const {id:key,choice}=state.draft,item=evidence[key],token=key+'-'+choice;
      if(state.sent.includes(token)||(key==='compare'&&state.selected.length!==2)) return;
      state.sent.push(token);state.draft=null;
      let reply=item.replies[choice];
      if(state.verifiedShared) reply='Studio đã nói không có quy trình ứng tiền này. Tớ không chuyển thêm nữa.';
      else if(state.stopped) reply='Tớ đã dừng chuyển thêm. Mình vẫn cần kiểm tra phần ứng tiền với Studio.';
      else if(state.extraPaid) reply='Tớ đã chuyển thêm rồi mà chưa được thanh toán. Mình kiểm tra lại với Studio nha.';
      else if(state.finished) reply='Tớ vẫn đang chờ, chưa chuyển thêm. Mình kiểm tra tiếp nha.';
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
    if(link?.hash==='#task'&&current()!=='task') {
      state.taskReturn=current();save();
    }
    if(link&&['#recruiter','#transactions','#tasks','#post'].includes(link.hash)&&!['recruiter','giang','report','task'].includes(current())) {
      state.sharedReturn=current()==='club'?'club':'inbox';save();
    }
    const target=event.target.closest('button[data-action]');
    if(target) act(target.dataset.action,target.dataset.id);
  });
  addEventListener('hashchange',()=>{render();window.scrollTo(0,0);if(current()==='inbox') host.querySelector('.chat-thread .bubble:last-child')?.scrollIntoView({block:'nearest'});});
  if(saved&&Object.hasOwn(panels,saved.view)) history.replaceState(null,'','#'+saved.view);
  render();
})();
