(() => {
  'use strict';
  const host = document.getElementById('app');
  const storage = window.frameElement?.caTrucStorage;
  const fresh = () => ({view:'inbox', scrolls:{}, disclosures:{}, pendingTurn:null, studioVisited:false, review:null, taskReflection:false, reflectionUnread:false, timeline:[], legacy:null, selected:[], taskReturn:'recruiter', messages:[], seen:[], sent:[], asked:[], draft:null,
    sharedReturn:'inbox', paused:false, stopped:false, verifiedShared:false, extraPaid:false,
    transferPrompt:false, finished:false, receiptSaved:false, chatSaved:false, reported:false,
    dossier:false, giangAsked:false});
  const saved = storage?.load();
  let state = {...fresh(), ...saved};
  // Older payment-v1 saves have no ordered event log. Keep their facts separate.
  if(saved && !Object.hasOwn(saved,'timeline')) state.legacy=JSON.parse(JSON.stringify(saved));
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
  const groupNames={receipt:'biên lai 45k',post:'xác nhận bài tuyển của Studio',compare:'đối chiếu bài tuyển với thẻ nhiệm vụ'};
  const viewNames={recruiter:'đoạn chat Vy chia sẻ',post:'bài tuyển gốc',receipt:'biên lai 45k',task:'thẻ nhiệm vụ hỗ trợ đơn hàng',tasks:'bảng nhiệm vụ',transactions:'lịch sử giao dịch'};
  function log(text) { state.timeline.push(text); }
  function currentOpinion(id) {
    for(let i=state.messages.length-1;i>=0;i--) {
      const m=state.messages[i];
      if(m.sent && m.evidenceId===id) return m.choice;
      if(m.sent && m.attachment?.source===evidence[id].source) {
        const choice=evidence[id].options.findIndex(text=>m.text===text||m.text==='Tớ xem lại rồi… '+text);
        if(choice>=0) return choice;
      }
    }
    // A single legacy token is unambiguous; never infer order from two flags.
    const choices=[0,1].filter(choice=>state.sent.includes(id+'-'+choice));
    return choices.length===1?choices[0]:null;
  }
  const hasOpinion=id=>state.sent.some(token=>token.startsWith(id+'-'))||state.messages.some(m=>m.sent&&m.evidenceId===id);
  if(state.draft&&hasOpinion(state.draft.id)) {
    if(currentOpinion(state.draft.id)===state.draft.choice) state.draft=null;
    else state.review=state.draft.id;
  }
  function legacyFacts() {
    const old=state.legacy;if(!old) return [];
    return [
      ...(old.seen||[]).map(id=>'Đã mở '+(viewNames[id]||id)+'.'),
      ...(old.sent||[]).filter(token=>Object.hasOwn(evidence,token.split('-')[0])).map(token=>{
        const [id,choice]=token.split('-');return 'Đã gửi '+groupNames[id]+' kèm nhận định “'+evidence[id].options[Number(choice)]+'”.';
      }),
      ...(old.asked||[]).map(id=>id==='post'?'Đã hỏi Studio và nhận xác nhận bài tuyển do họ đăng.':'Đã hỏi Studio và nhận xác nhận không có quy trình ứng tiền.'),
      ...(old.verifiedShared?['Đã chuyển phản hồi Studio về quy trình và khuyên Vy dừng.']:[]),
      ...(old.paused?['Đã khuyên Vy tạm dừng chuyển thêm.']:[]),
      ...(old.extraPaid?['Vy đã chuyển thêm 1.000.000đ.']:[]),
      ...(old.stopped?['Vy đã xác nhận dừng chuyển thêm.']:[]),
      ...(old.receiptSaved?['Đã lưu chứng từ chuyển tiền.']:[]),
      ...(old.chatSaved?['Đã lưu tin nhắn yêu cầu chuyển thêm.']:[]),
      ...(old.reported?['Đã báo cáo tài khoản Hương Giang trên ViệtBook.']:[]),
      ...(old.dossier?['Đã chuẩn bị hồ sơ mô phỏng, chưa trình báo.']:[])
    ];
  }
  const e = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const button = (label,action,id='',cls='') => '<button type="button" data-action="'+action+'" data-id="'+id+'" class="'+cls+'">'+e(label)+'</button>';
  const go = (view,label,cls='') => '<a class="button '+cls+'" href="#'+view+'">'+e(label)+'</a>';
  const actions = (...items) => '<div class="actions">'+items.join('')+'</div>';
  const quotes = attachment => (attachment.excerpts||[attachment]).map(item=>'<blockquote><small>'+e(item.source)+'</small>'+e(item.quote)+'</blockquote>').join('');
  function attachmentView(attachment,compact,disclosure) {
    if(!compact) return quotes(attachment);
    const items=attachment.excerpts||[attachment];
    return '<div class="attachment-preview">'+items.map(item=>'<div><small>'+e(item.source)+'</small><p>'+e(item.quote.length>62?item.quote.slice(0,59)+'…':item.quote)+'</p></div>').join('')+'</div>'+
      '<details class="chat-evidence" data-disclosure="'+disclosure+'" '+(state.disclosures[disclosure]?'open':'')+'><summary>Xem căn cứ'+(items.length>1?' · 2 nguồn':'')+'</summary>'+quotes(attachment)+
      actions(button('Đóng căn cứ','close-evidence'))+'</details>';
  }
  const bubble = (name,text,sent=false,attachment=null,compact=false,disclosure='') => '<article class="bubble'+(sent?' sent':'')+'"><small class="speaker">'+e(name)+'</small><p>'+e(text)+'</p>'+
    (attachment?attachmentView(attachment,compact,disclosure):'')+'</article>';
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
    state.pendingTurn=state.messages.length;
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
    const revising=hasOpinion(id);
    return '<section class="draft-box"><h3>Bản nháp · Chưa gửi</h3>'+bubble(revising?'Bạn · Sắp gửi sửa ý':'Bạn · Sắp gửi',(revising?'Tớ xem lại rồi… ':'')+item.options[choice],true,item)+
      actions(button('Gửi cho Vy','send-draft','','primary'),button('Đổi nhận định','change-draft'),button('Bỏ bản nháp','discard-draft'))+'</section>';
  }
  function evidenceChoices(id) {
    const item=evidence[id],sent=hasOpinion(id),active=state.review===id;
    if(sent&&!active) return actions(button('Xem lại nhận định','review',id));
    const choice=currentOpinion(id);
    if(state.draft?.id===id) return draft()+(sent?actions(button('Đóng bộ soạn','close-review',id)):'');
    return (sent?'<h3>Sửa nhận định · '+e(groupNames[id])+'</h3>'+bubble('Căn cứ đã gửi','',false,item):'')+
      '<p>Chọn lời nhắn gửi kèm căn cứ</p>'+actions(...item.options.map((label,i)=>
        sent&&choice===i?pill('Nhận định hiện tại · '+label):button(label,'draft',id+'-'+i)))+
      (state.draft?.id===id?draft():'')+
      (sent?actions(button('Đóng bộ soạn','close-review',id)):'');
  }
  function selectExcerpt(id) {
    const selected=state.selected.includes(id);
    return actions(button(selected?'✓ Đã chọn · Bỏ chọn':'Chọn để đối chiếu','select-excerpt',id,selected?'primary':''));
  }
  function comparison() {
    if(state.draft?.id==='compare') return draft()+(hasOpinion('compare')?actions(button('Đóng bộ soạn','close-review','compare')):'');
    if(hasOpinion('compare')) return evidenceChoices('compare');
    return '<section class="comparison-box"><h3>Đối chiếu phần việc</h3><p>Đang chọn '+state.selected.length+'/2 nội dung</p>'+
      '<ul>'+state.selected.map(id=>'<li>'+e(excerpts[Number(id)].source)+'</li>').join('')+'</ul>'+
      actions(!state.selected.includes('0')?go('post','Chọn nội dung bài tuyển'):'',
        !state.selected.includes('1')?go('task','Chọn nội dung nhiệm vụ'):'',
        state.selected.length?button('Bỏ chọn tất cả','clear-excerpts'):'')+
      (state.selected.length===2?evidenceChoices('compare'):
        (state.draft?.id==='compare'?draft():''))+'</section>';
  }
  function messageEvidence(message) {
    return message.evidenceId||Object.keys(evidence).find(id=>message.sent&&message.attachment?.source===evidence[id].source)||null;
  }
  function nextActions() {
    if(state.transferPrompt) return actions(button('Khoan, để tớ kiểm tra lại','rethink','','primary'),button('Ừ, cậu chuyển tiếp đi','proceed'));
    if(state.stopped||state.extraPaid) return actions(go('recover','Mở hồ sơ hỗ trợ','primary'),resultLink());
    return actions(
      !state.paused&&canContinue()?button('Khoan chuyển thêm, để tớ kiểm tra','pause','','primary'):'',
      state.messages.length?(state.studioVisited||state.asked.length?go('club','Quay lại hội thoại Sao Mai'):go('post','Mở bài tuyển gốc')):'',
      canContinue()?button('Tớ nghĩ cậu có thể làm tiếp','risk'):'',
      state.paused&&!state.finished?button('Kết thúc tại đây · Đang chờ xác minh','finish'):'',
      ready()?resultLink():go('recover','Mở hồ sơ hỗ trợ'));
  }
  function thread() {
    let html='';
    for(let i=0;i<state.messages.length;i++) {
      const start=i, group=[state.messages[i]];
      if(group[0].sent) while(i+1<state.messages.length&&!state.messages[i+1].sent) group.push(state.messages[++i]);
      html+='<section class="message-turn" data-start="'+start+'" tabindex="-1" aria-label="Lượt trò chuyện">';
      group.forEach((m,offset)=>{
        html+=bubble(m.name,m.text,m.sent,m.attachment,true,'message-'+(start+offset));
        const id=messageEvidence(m),index=start+offset;
        if(id&&!state.messages.slice(index+1).some(later=>messageEvidence(later)===id)) {
          html+='<div class="opinion-tools">'+button('Xem lại nhận định','review',id)+'</div>';
        }
      });
      if(i===state.messages.length-1) html+='<div class="next-actions">'+nextActions()+'</div>';
      html+='</section>';
    }
    return html;
  }
  function inbox() {
    const opening=bubble('Vy','Tớ chuyển 500k rồi mà chưa nhận lại được. Bên đó bảo còn một bước nữa.')+
      bubble('Vy','Tớ thấy không ổn, nhưng bỏ bây giờ thì mất luôn tiền à? Cậu xem giúp tớ với.');
    const cards=card('recruiter','Đoạn chat với Hương Giang','Vy chia sẻ · Chỉ đọc')+
      card('transactions','Lịch sử giao dịch','Tiền đã nhận và đã chuyển')+
      card('tasks','Bảng nhiệm vụ','Hương Giang gửi cho Vy')+
      card('post','Bài tuyển gốc','Sao Mai Studio');
    const long=state.messages.length>0;
    let composer='';
    if(state.review) composer='<section class="opinion-editor">'+evidenceChoices(state.review)+'</section>';
    else if(state.draft) composer=draft();
    else if(state.selected.length&&!hasOpinion('compare')) composer=comparison();
    return '<div class="inbox-layout"><aside class="portrait"><figure class="scene '+(state.stopped?'nhe-nhom':'lo-lang')+'"><figcaption class="scene-caption">Thảo Vy</figcaption></figure></aside>'+
      '<section class="conversation"><div class="contact-title"><h1>Hộp thư · Thảo Vy</h1>'+pill('Đã chuyển · '+total())+'</div>'+
      (long?'<details class="opening-history" data-disclosure="opening" '+(state.disclosures.opening?'open':'')+'><summary>Tin nhắn mở đầu</summary>'+opening+'</details>':
        '<p class="role-hint">Bạn là bạn của Vy. Mở nội dung bạn ấy gửi để kiểm tra, hoặc nhắn lại ngay.</p>'+opening)+
      '<details class="shared-content" data-disclosure="shared" '+((state.disclosures.shared??!long)?'open':'')+'><summary>Nội dung Vy đã gửi · 4 mục</summary><div class="shared-list">'+cards+'</div></details>'+
      '<div class="chat-thread">'+thread()+'</div>'+(long?'':nextActions())+
      '<div class="composer-zone">'+composer+'</div></section></div>';
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
    const lesson=weakPost?'Bài tuyển thật chưa xác nhận người nhắn riêng đại diện cho đơn vị.':
      weakReceipt?'Những lần nhận tiền trước không xác nhận độ an toàn của yêu cầu tiếp theo.':
      'Khoản tiền đã chuyển không làm cho lần chuyển tiếp theo an toàn hơn.';
    return '<h1>'+group+'</h1><div class="outcome">Vy đã chuyển '+total()+'. Khoản tiền chưa được thu hồi.</div>'+
      '<p>45.000đ tiền công đã nhận trước đó được ghi riêng.</p>'+bubble('Vy',reply)+'<p>'+lesson+'</p>'+
      '<ul><li>'+(state.stopped?'Vy đã dừng chuyển thêm.':'Chưa chốt dừng chuyển thêm.')+'</li><li>'+
      (state.receiptSaved&&state.chatSaved?'Đã lưu tin nhắn và chứng từ chuyển tiền.':state.receiptSaved?'Đã lưu chứng từ. Còn thiếu tin nhắn.':
        state.chatSaved?'Đã lưu tin nhắn. Còn thiếu chứng từ.':'Chưa lưu tin nhắn và chứng từ.')+'</li></ul>'+
      '<details><summary>Những việc bạn đã làm</summary><ul>'+
      (state.legacy?'<li>Thông tin từ lượt đã lưu trước bản cập nhật (không xác định đầy đủ thứ tự):<ul>'+legacyFacts().map(text=>'<li>'+e(text)+'</li>').join('')+'</ul></li>':'')+
      state.timeline.map(text=>'<li>'+e(text)+'</li>').join('')+
      (state.draft?'<li>Chưa gửi: bản nháp nhận định về '+e(groupNames[state.draft.id])+'.</li>':'')+
      (!hasOpinion('compare')&&state.selected.length?'<li>Đang chọn '+state.selected.length+'/2 trích đoạn; chưa gửi đối chiếu.</li>':'')+
      (state.asked.length?'<li>Danh tính và vai trò thật của Hương Giang chưa được xác minh.</li>':'')+
'</ul></details>'+
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
  let focusAfterRender=null;
  function render() {
    const view=current(),restoreY=state.scrolls[view]||0;state.view=view;
    if(view==='club') state.studioVisited=true;
    if(Object.hasOwn(viewNames,view)&&!state.seen.includes(view)) {state.seen.push(view);log('Đã mở '+viewNames[view]+'.');}
    if(view==='task'&&!state.taskReflection) {
      state.taskReflection=true;state.reflectionUnread=true;
      state.pendingTurn=state.messages.length;
      state.messages.push({name:'Vy',text:'Hồi đó tớ nghĩ chị ấy đã trả tiền lần trước, chắc lần này cũng trả. Nhìn lại mới thấy phần việc khác hẳn.',reflection:true});
    }
    if(view==='inbox') state.reflectionUnread=false;
    save();
    host.innerHTML='<header class="top"><a class="brand" href="#inbox">ViệtBook <small>Ca trực an toàn số</small></a><nav>'+
      go('inbox','Hộp thư Vy'+(state.reflectionUnread?' · Có tin nhắn của Vy':''))+button('Chơi lại','reset')+'</nav></header><div class="shell"><div class="case-label">CA CỦA VY <strong>Khoản tiền chưa về</strong></div>'+
      (window.frameElement?.caTrucRevised?'<p class="notice">Ca Vy có kịch bản mới. Lượt giữ ca cũ được lưu riêng, lượt này bắt đầu lại.</p>':'')+
      '<section class="surface '+view+'">'+panels[view]()+'</section><footer>Mạng xã hội giả lập. Mọi giao dịch, báo cáo và liên hệ trong ca đều là mô phỏng.</footer></div>';
    requestAnimationFrame(()=>{
      if(view==='inbox'&&state.pendingTurn!==null) {
        const target=host.querySelector('.message-turn[data-start="'+state.pendingTurn+'"]');
        if(target) {target.focus({preventScroll:true});target.scrollIntoView({block:'start'});}
        state.pendingTurn=null;save();
      } else if(focusAfterRender) {
        const target=host.querySelector(focusAfterRender);focusAfterRender=null;
        target?.focus({preventScroll:true});target?.scrollIntoView({block:'nearest'});
      } else window.scrollTo(0,restoreY);
    });
  }
  function act(action,id) {
    state.scrolls[current()]=window.scrollY;
    if(action==='draft') focusAfterRender='.draft-box [data-action="send-draft"]';
    else if(action==='review'||action==='change-draft') focusAfterRender='.opinion-editor [data-action="draft"], [data-action="draft"]';
    else if(action==='close-review') focusAfterRender='.opinion-tools [data-id="'+id+'"]';
    else if(action==='discard-draft') focusAfterRender='[data-action="draft"], [data-action="review"]';
    else if(action==='select-excerpt') focusAfterRender='[data-action="select-excerpt"][data-id="'+id+'"]';

    if(action==='reset') {
      if(!window.confirm('Chơi lại riêng ca Vy từ đầu?')) return;
      state=fresh();save();navigate('inbox');return;
    }
    if(action==='ask'&&current()==='club'&&['post','process'].includes(id)&&!state.asked.includes(id)) {
      state.asked.push(id);log(id==='post'?'Đã hỏi Studio và nhận xác nhận bài tuyển do họ đăng.':'Đã hỏi Studio và nhận xác nhận không tổ chức ứng tiền, không yêu cầu chuyển tiền để thanh toán.');
    } else if(action==='review'&&Object.hasOwn(evidence,id)&&hasOpinion(id)) state.review=id;
    else if(action==='close-review'&&state.review===id) {
      state.review=null;if(state.draft?.id===id) state.draft=null;
    }
    else if(action==='select-excerpt'&&['0','1'].includes(id)&&
      ((id==='0'&&current()==='post')||(id==='1'&&current()==='task'))) {
      state.selected=state.selected.includes(id)?state.selected.filter(value=>value!==id):[...state.selected,id];
      if(state.selected.length<2&&state.draft?.id==='compare') state.draft=null;
    } else if(action==='clear-excerpts') {
      state.selected=[];
      if(state.draft?.id==='compare') state.draft=null;
    } else if(action==='draft') {
      const [key,choice]=id.split('-');
      if(!Object.hasOwn(evidence,key)||!['0','1'].includes(choice)||(key==='post'&&!state.asked.includes('post'))||(key==='compare'&&!hasOpinion(key)&&state.selected.length!==2)) return;
      if(hasOpinion(key)&&(state.review!==key||currentOpinion(key)===Number(choice))) return;
      state.draft={id:key,choice:Number(choice)};
    } else if(action==='discard-draft'&&state.draft) state.draft=null;
    else if(action==='change-draft'&&state.draft) {
      const key=state.draft.id;state.draft=null;
      if(hasOpinion(key)) {state.review=key;render();return;}
      save();navigate(key==='post'?'club':key==='compare'?'task':'receipt');return;
    } else if(action==='send-draft'&&state.draft) {
      const {id:key,choice}=state.draft,item=evidence[key],token=key+'-'+choice;
      const revising=hasOpinion(key);
      if((revising&&(state.review!==key||currentOpinion(key)===choice))||(!revising&&key==='compare'&&state.selected.length!==2)) return;
      if(!state.sent.includes(token)) state.sent.push(token);
      state.draft=null;state.review=null;
      let reply=item.replies[choice];
      if(state.verifiedShared) reply='Studio đã nói không có quy trình ứng tiền này. Tớ không chuyển thêm nữa.';
      else if(state.stopped) reply='Tớ đã dừng chuyển thêm. Mình vẫn cần kiểm tra phần ứng tiền với Studio.';
      else if(state.extraPaid) reply='Tớ đã chuyển thêm rồi mà chưa được thanh toán. Mình kiểm tra lại với Studio nha.';
      else if(state.finished) reply='Tớ vẫn đang chờ, chưa chuyển thêm. Mình kiểm tra tiếp nha.';
      chat((revising?'Tớ xem lại rồi… ':'')+item.options[choice],reply,item);
      Object.assign(state.messages[state.messages.length-2],{evidenceId:key,choice,revised:revising});
      log((revising?'Đã sửa nhận định về ':'Đã gửi ')+groupNames[key]+(key==='compare'?' (hai trích đoạn)':'')+' kèm nhận định “'+item.options[choice]+'”.');
      save();navigate('inbox');return;
    } else if(action==='pause'&&canContinue()&&!state.paused) {
      log('Đã khuyên Vy tạm dừng chuyển thêm.');state.paused=true;chat('Khoan chuyển thêm, để tớ kiểm tra','Ừ, tớ chưa chuyển thêm. Cậu xem giúp tớ.');
    } else if(action==='finish'&&state.paused&&!state.transferPrompt&&!state.finished) {
      state.finished=true;log('Đã kết thúc tạm dừng, chưa xác minh đầy đủ.');save();navigate('result');return;
    } else if(action==='share-process'&&current()==='club'&&state.asked.includes('process')&&!state.verifiedShared) {
      log('Đã chuyển phản hồi Studio về quy trình ứng tiền; Vy xác nhận dừng chuyển thêm.');state.verifiedShared=true;state.stopped=true;state.transferPrompt=false;state.finished=true;
      chat('Bên Sao Mai nói không có quy trình này. Cậu dừng chuyển thêm nha.',processReply,{source:studio,quote:processAnswer});
      save();navigate('inbox');return;
    } else if(action==='risk'&&canContinue()&&!state.transferPrompt) {
      log('Đã khuyên Vy tiếp tục; Vy hỏi lại trước khi quyết định.');state.transferPrompt=true;chat('Tớ nghĩ cậu có thể làm tiếp','Vậy tớ chuyển thêm 1 triệu để lấy lại khoản trước nha?');
    } else if(action==='rethink'&&state.transferPrompt&&canContinue()) {
      log('Đã đổi ý trước khi chuyển thêm và tiếp tục kiểm tra.');state.transferPrompt=false;state.paused=true;chat('Khoan, để tớ kiểm tra lại','Ừ, tớ vẫn chưa chuyển thêm.');
    } else if(action==='proceed'&&state.transferPrompt&&canContinue()) {
      log('Đã xác nhận lời khuyên; Vy chuyển thêm 1.000.000đ. Tổng đã chuyển 1.500.000đ, chưa thu hồi.');state.transferPrompt=false;state.extraPaid=true;state.finished=false;
      state.receiptSaved=false;state.chatSaved=false;state.dossier=false;
      chat('Ừ, cậu chuyển tiếp đi','Tớ quyết định thử làm nốt bước này.');
      state.messages.push({name:'Vy',text:'Tớ vừa chuyển thêm 1 triệu rồi.'},{name:'Vy',text:'Vẫn chưa được thanh toán. Giờ họ lại đòi phí xử lý.'});
    } else if(action==='stop'&&!state.stopped&&current()==='recover') {
      log('Đã nhắn Vy dừng; Vy xác nhận không chuyển thêm.');state.stopped=true;state.transferPrompt=false;
      chat('Cậu đừng chuyển thêm nha.','Ừ, tớ dừng ở đây. Tớ không chuyển thêm nữa.');
      save();navigate('inbox');return;
    } else if(action==='keep'&&current()==='recover'&&['receiptSaved','chatSaved'].includes(id)&&!state[id]) {state[id]=true;log(id==='receiptSaved'?'Đã lưu chứng từ chuyển tiền.':'Đã lưu tin nhắn yêu cầu chuyển thêm.');}
    else if(action==='dossier'&&current()==='recover'&&state.chatSaved&&state.receiptSaved&&!state.dossier) {state.dossier=true;log('Đã chuẩn bị hồ sơ mô phỏng. Chưa trình báo.');}
    else if(action==='report'&&current()==='report'&&!state.reported) {state.reported=true;log('Đã báo cáo tài khoản Hương Giang trên ViệtBook. Chờ xem xét.');}
    else if(action==='ask-giang'&&current()==='giang'&&!state.giangAsked) {state.giangAsked=true;log('Đã hỏi riêng Hương Giang; đây là lời của bên đang yêu cầu tiền.');}
    else return;
    render();

  }
  host.addEventListener('click',event=>{
    const summary=event.target.closest('summary');
    if(summary?.parentElement.dataset.disclosure) {
      const details=summary.parentElement;state.disclosures[details.dataset.disclosure]=!details.open;save();
    }
    const link=event.target.closest('a[href^="#"]');
    if(link) {state.scrolls[current()]=window.scrollY;save();}
    if(link?.hash==='#task'&&current()!=='task') {
      state.taskReturn=current();save();
    }
    if(link&&['#recruiter','#transactions','#tasks','#post'].includes(link.hash)&&!['recruiter','giang','report','task'].includes(current())) {
      state.sharedReturn=current()==='club'?'club':'inbox';save();
    }
    const target=event.target.closest('button[data-action]');
    if(target?.dataset.action==='close-evidence') {
      const details=target.closest('details');state.disclosures[details.dataset.disclosure]=false;save();details.open=false;details.querySelector('summary').focus({preventScroll:true});details.querySelector('summary').scrollIntoView({block:'nearest'});return;
    }
    if(target) act(target.dataset.action,target.dataset.id);
  });
  addEventListener('hashchange',render);
  addEventListener('scroll',()=>{state.scrolls[current()]=window.scrollY;save();},{passive:true});
  if(saved&&Object.hasOwn(panels,saved.view)) history.replaceState(null,'','#'+saved.view);
  render();
})();
