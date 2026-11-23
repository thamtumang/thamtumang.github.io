(() => {
  'use strict';
  const host = document.getElementById('app');
  const storage = window.frameElement?.caTrucStorage;
  const fresh = () => ({view:'inbox', dossierOpened:false, dossierIntro:null, dossierIntroOpen:false, dossierSelection:[], dossierDraft:null, dossierSent:[], dossierArchive:[], dossierSeen:[], receiptSavedTotal:null, supportIntro:null, supportOpened:false, supportFeedback:null, helpSeen:[], helpShared:[], helpDraft:null, reportDraft:null, reportSnapshot:null, dossierSnapshot:null, scrolls:{}, disclosures:{}, pendingTurn:null, studioVisited:false, review:null, taskReflection:false, reflectionUnread:false, timeline:[], legacy:null, selected:[], taskReturn:'recruiter', messages:[], seen:[], sent:[], asked:[], draft:null,
    sharedReturn:'inbox', paused:false, stopped:false, verifiedShared:false, extraPaid:false,
    transferPrompt:false, finished:false, receiptSaved:false, chatSaved:false, reported:false,
    dossier:false, giangAsked:false});
  const saved = storage?.load();
  let state = {...fresh(), ...saved};
  // Older payment-v1 saves have no ordered event log. Keep their facts separate.
  if(saved && !Object.hasOwn(saved,'timeline')) state.legacy=JSON.parse(JSON.stringify(saved));
  if(saved?.dossier&&!Object.hasOwn(saved,'dossierOpened')) state.dossierOpened=true;
  if(saved?.receiptSaved&&!state.receiptSavedTotal) state.receiptSavedTotal=saved.extraPaid?'1.500.000đ':'500.000đ';
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
  const helpSources={
    bankHelp:{title:'Ngân hàng nơi Vy đã chuyển tiền',organization:'Vietcombank',date:'05/04/2024',
      url:'https://vietcombank.com.vn/vi-VN/KHCN/Truy-cap-nhanh/Tin-noi-bat/Articles/2024/04/08/CANH-BAO-GIAO-DICH-AN-TOAN',
      label:'Hướng dẫn giao dịch an toàn · Mục tình huống khẩn cấp',
      purpose:'Báo giao dịch nghi bị lừa và hỏi ngân hàng hướng xử lý.',
      quote:'Khi nghi bị lừa, liên hệ ngân hàng qua kênh chính thức để được hướng dẫn; đồng thời trình báo cơ quan Công an.',
      advice:'Mình tìm kênh chính thức của ngân hàng để báo khoản đã chuyển và hỏi cách xử lý nha.',
      reply:'Ừ, tớ sẽ xem kênh của ngân hàng tớ dùng. Mình chưa biết khoản tiền có lấy lại được không.'},
    policeHelp:{title:'Cơ quan Công an nơi lưu trú',organization:'Cục An toàn thông tin · Bộ TT&TT',date:'06/2023',
      url:'https://cdannd1.bocongan.gov.vn/api/Resources/File/2023/cam_nang_nhan_dien_va_phong_tranh_ldtt_7493280830.pdf',
      label:'Cẩm nang nhận diện và phòng chống lừa đảo trực tuyến · Mục IV, trang 39',
      purpose:'Chuẩn bị nội dung sự việc và bằng chứng để trình báo.',
      quote:'Giữ lại bằng chứng, chuẩn bị nội dung sự việc để làm đơn tố giác gửi cơ quan Công an nơi lưu trú.',
      advice:'Mình giữ chứng cứ và chuẩn bị nội dung sự việc để trình báo nha.',
      reply:'Ừ, mình ghi lại sự việc trước. Chuẩn bị xong vẫn còn bước trình báo.'}
  };
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
      '<details class="chat-evidence" data-disclosure="'+disclosure+'" '+(state.disclosures[disclosure]?'open':'')+'><summary>'+e(attachment.kind==='dossier'?'Xem bản đã gửi'+(attachment.itemCount?' · '+attachment.itemCount+' nội dung đính kèm':' · chưa đính kèm'):'Xem căn cứ'+(items.length>1?' · '+items.length+' nguồn':''))+'</summary>'+quotes(attachment)+
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
    const follow=dossierFollowup();
    if(state.transferPrompt) return follow+actions(button('Khoan, để tớ kiểm tra lại','rethink','','primary'),button('Ừ, cậu chuyển tiếp đi','proceed'));
    if(state.stopped||state.extraPaid) return follow+actions(go('recover','Mở hồ sơ hỗ trợ','primary'),resultLink());
    return follow+actions(
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
  function supportChat(text,reply,kind,attachment=null) {
    chat(text,reply,attachment);
    state.messages[state.messages.length-1].supportKind=kind;
    state.supportFeedback=state.messages.length-1;
  }
  function supportReaction() {
    const m=state.messages[state.supportFeedback];
    return m?.supportKind?'<section class="support-reaction" tabindex="-1"><small>Phản hồi gần nhất · Hộp thư Vy</small>'+bubble('Vy',m.text)+
      actions(go('inbox','Xem trong hộp thư Vy'))+'</section>':'';
  }
  function supportExit() {
    return actions(go('recover','Về hỗ trợ Vy'),button(ready()?'Xem tổng kết':'Kết thúc lượt tại đây','support-finish'),go('inbox','Về hộp thư Vy'));
  }
  function recover() {
    const intro=state.messages[state.supportIntro];
    return '<h1>Giúp Vy xử lý khoản đã chuyển</h1><p>Đã chuyển '+total()+'. Chưa xác nhận thu hồi.</p>'+
      (state.supportFeedback===null&&intro?bubble('Vy',intro.text):supportReaction())+
      (state.supportFeedback!==null&&intro?'<details class="support-intro"><summary>Xem lại lời Vy lúc vào hỗ trợ</summary>'+bubble('Vy',intro.text)+'</details>':'')+
      actions(state.stopped?pill('Vy đã xác nhận dừng chuyển thêm'):button('Nhắn Vy dừng chuyển thêm','stop','','primary'))+
      '<div class="support-paths">'+
      card('proofs',state.receiptSaved||state.chatSaved?'Xem lại tin nhắn và giao dịch':'Cùng Vy xem lại tin nhắn và giao dịch','Giữ yêu cầu tiền và chứng từ')+
      card('help',state.helpSeen.length?'Xem lại nơi hỗ trợ khoản đã chuyển':'Tìm nơi hỗ trợ khoản đã chuyển','Đọc hướng dẫn từ nguồn độc lập')+
      card('report',state.reported?'Xem lại báo cáo ViệtBook':'Báo cáo tài khoản trên ViệtBook','Đối tượng: tài khoản Hương Giang')+'</div>'+
      actions(state.dossier?go('dossier','Xem lại bản chuẩn bị thông tin'):'',button(ready()?'Xem tổng kết':'Kết thúc lượt tại đây','support-finish'),go('inbox','Về hộp thư Vy'));
  }
  function proofs() {
    return '<h1>Tin nhắn và giao dịch Vy chia sẻ</h1><p>Đã chuyển '+total()+'. Chưa xác nhận thu hồi.</p>'+supportReaction()+
      '<article class="support-artifact"><h2>Chứng từ chuyển tiền</h2><p>500.000đ đã chuyển'+(state.extraPaid?' · thêm 1.000.000đ đã chuyển':'')+'</p>'+
      '<details><summary>Đọc chứng từ đầy đủ</summary><p>MP-500-042 · 500.000đ · Ứng tiền làm nhiệm vụ · Đã chuyển</p>'+
      (state.extraPaid?'<p>MP-1000-043 · 1.000.000đ · Bước tiếp theo · Đã chuyển</p>':'')+
      '<p>Chưa có khoản hoàn lại. 45.000đ là tiền công đã nhận trước, được ghi riêng.</p></details>'+
      actions(state.receiptSaved?pill('Đã lưu chứng từ'):button('Lưu chứng từ chuyển tiền','keep','receiptSaved'))+'</article>'+
      '<article class="support-artifact"><h2>Tin nhắn yêu cầu tiền</h2><p>Hương Giang đòi '+(state.extraPaid?'thêm phí xử lý.':'ứng thêm 1.000.000đ để thanh toán.')+'</p>'+
      '<details><summary>Đọc tin nhắn đầy đủ</summary>'+bubble('Hương Giang','Em cần làm tiếp bước 1 triệu mới thanh toán được.')+
      (state.extraPaid?bubble('Vy','Em chuyển thêm 1 triệu rồi mà vẫn chưa nhận lại tiền.')+bubble('Hương Giang','Hồ sơ còn thiếu phí xử lý. Em chuyển thêm rồi chị hỗ trợ.'):'')+
      actions(go('recruiter','Mở đoạn chat Vy chia sẻ'))+'</details>'+
      actions(state.chatSaved?pill('Đã lưu tin nhắn'):button('Lưu tin nhắn yêu cầu chuyển thêm','keep','chatSaved'))+'</article>'+
      actions(go('help','Tìm nơi hỗ trợ khoản đã chuyển'),go('dossier',state.dossier?'Xem lại bản chuẩn bị thông tin':'Cùng Vy chuẩn bị thông tin'))+supportExit();
  }
  function help() {
    return '<h1>Tìm nơi hỗ trợ khoản đã chuyển</h1><p>Chọn kênh để đọc hướng dẫn. Mở thẻ chưa phải đã liên hệ.</p><div class="support-paths">'+
      Object.entries(helpSources).map(([id,item])=>card(id,item.title,item.purpose)).join('')+'</div>'+supportExit();
  }
  function helpSource(id) {
    const item=helpSources[id];
    return '<h1>'+e(item.title)+'</h1>'+pill('Thẻ kênh hỗ trợ · Mô phỏng')+
      '<article class="support-artifact"><h2>Hướng dẫn từ nguồn độc lập</h2><p>'+e(item.quote)+'</p><p>'+e(item.purpose)+'</p>'+
      '<details><summary>Thông tin để cùng Vy xem lại</summary><p>Trong ca này: ghi lại diễn biến, số tiền '+total()+', mã giao dịch và các bằng chứng đã lưu. Đây là bản ghi mô phỏng, không phải danh sách hồ sơ bắt buộc hay đầy đủ của cơ quan tiếp nhận.</p></details>'+
      '<details><summary>Nguồn hướng dẫn</summary><p>'+e(item.organization)+' · '+e(item.date)+'</p><p>'+e(item.label)+'</p>'+
      '<a href="'+item.url+'" target="_blank" rel="noopener">Đọc nguồn chính thức (ngoài game)</a></details></article>'+
      supportReaction()+
      (state.helpShared.includes(id)?pill('Đã gửi hướng dẫn này cho Vy'):
        state.helpDraft===id?'<section class="draft-box"><h2>Nháp hướng dẫn · Chưa gửi</h2>'+bubble('Bạn · Sắp gửi',item.advice,true,{source:item.organization,quote:item.quote})+
          actions(button('Gửi hướng dẫn cho Vy','share-help',id,'primary'),button('Bỏ nháp hướng dẫn','cancel-help',id))+'</section>':
          actions(button('Soạn tin gửi hướng dẫn cho Vy','draft-help',id)))+
      actions(go('dossier',state.dossier?'Xem lại bản chuẩn bị thông tin':'Cùng Vy chuẩn bị thông tin'),go('help','Chọn kênh khác'))+
      '<p class="small">Ca này không gọi điện, gửi biểu mẫu hay xác nhận ngân hàng/cơ quan đã tiếp nhận. Chưa có kết quả về khoản tiền.</p>'+supportExit();
  }
  const dossierLabels={receipt45:'Biên lai nhận 45.000đ',transfers:'Chứng từ khoản đã chuyển',demands:'Tin nhắn yêu cầu tiền',post:'Bài tuyển gốc của Studio',studioPost:'Studio xác nhận bài tuyển',studioProcess:'Studio trả lời về ứng tiền'};
  function dossierItems() {
    const items={
      receipt45:{title:dossierLabels.receipt45,source:'Ví học đường · Tiền công làm thử',quote:'+45.000đ · Đã nhận · Tiền đã vào ví Vy.',
        role:'Thể hiện khoản công Vy từng nhận.',limit:'Không thể hiện khoản đã chuyển hoặc bảo đảm lần tiếp theo được thanh toán.',kept:false},
      transfers:{title:dossierLabels.transfers,source:'Chứng từ Vy chia sẻ · Mô phỏng',
        quote:'MP-500-042 · 500.000đ · Ứng tiền làm nhiệm vụ · Đã chuyển.'+(state.extraPaid?' MP-1000-043 · 1.000.000đ · Bước tiếp theo · Đã chuyển.':''),
        role:'Thể hiện '+total()+' đã chuyển qua '+(state.extraPaid?'hai giao dịch.':'một giao dịch.'),limit:'Riêng chứng từ chưa thể hiện lời mời và điều kiện đòi tiền.',kept:state.receiptSaved},
      demands:{title:dossierLabels.demands,source:'Đoạn chat Vy và Hương Giang · Chỉ đọc',
        quote:'Hương Giang gửi nhiệm vụ ứng 500.000đ, mô tả hoàn khoản ứng và tiền công sau khi hoàn thành. Sau khi Vy chuyển 500.000đ, Giang nhắn: “Em cần làm tiếp bước 1 triệu mới thanh toán được.”'+
          (state.extraPaid?' Vy đã chuyển thêm 1.000.000đ. Giang tiếp tục đòi phí xử lý.':' Khoản 1.000.000đ này chưa chuyển.'),
        role:'Thể hiện yêu cầu tiền và điều kiện gắn với thanh toán.',limit:'Không tự chứng minh tiền đã chuyển hay danh tính thật người đứng sau tài khoản.',kept:state.chatSaved},
      post:{title:dossierLabels.post,source:'Sao Mai Studio · Bài đăng công khai',quote:originalWork+' Gửi mẫu bài qua hộp thư trang.',
        role:'Bổ sung bối cảnh phần việc tuyển công khai.',limit:'Bài thật chưa xác nhận lời mời riêng hoặc quy trình ứng tiền.',kept:false}
    };
    if(state.asked.includes('post')) items.studioPost={title:dossierLabels.studioPost,source:'Hộp thư Sao Mai Studio',quote:postAnswer,
      role:'Xác nhận bài tuyển thuộc Studio.',limit:'Chưa xác nhận người nhắn riêng đại diện Studio hoặc khoản ứng tiền.',kept:false};
    if(state.asked.includes('process')) items.studioProcess={title:dossierLabels.studioProcess,source:'Hộp thư Sao Mai Studio',quote:processAnswer,
      role:'Xác nhận phạm vi quy trình ứng tiền của Studio.',limit:'Chưa xác minh danh tính thật của Hương Giang hoặc thu hồi khoản tiền.',kept:false};
    return items;
  }
  function dossierKey(data,includeKept=false) {
    if(!data) return null;
    return JSON.stringify({amount:data.amount,selected:data.selected,attachments:data.attachments?.map(item=>({id:item.id,quote:item.quote,...(includeKept?{kept:item.kept}:{})}))});
  }
  function dossierData() {
    const items=dossierItems(),selected=Object.keys(items).filter(id=>state.dossierSelection.includes(id));
    return {schema:2,amount:total(),selected,summary:'Vy nhận 45.000đ tiền công làm thử, sau đó ứng 500.000đ theo nhiệm vụ.'+
      (state.extraPaid?' Vy đã chuyển thêm 1.000.000đ nhưng vẫn chưa được thanh toán.':' Vy chưa chuyển khoản 1.000.000đ đang bị yêu cầu.')+
      ' Tổng đã chuyển '+total()+', chưa xác nhận thu hồi. Khoản 45.000đ được ghi riêng.',
      attachments:selected.map(id=>({id,...items[id]}))};
  }
  function dossierCoverage(data) {
    const ids=data.selected||[];
    return ids.includes('transfers')?(ids.includes('demands')?'Có chứng từ khoản đã chuyển và nội dung yêu cầu tiền.':'Có chứng từ khoản đã chuyển; chưa kèm lời yêu cầu tiền.'):
      ids.includes('demands')?'Có lời yêu cầu tiền; chưa kèm chứng từ khoản đã chuyển.':'Chưa kèm chứng từ khoản đã chuyển hoặc lời yêu cầu tiền.';
  }
  function dossierVersions(data) {
    return {
      sent:state.dossierSent.findIndex(record=>dossierKey(record)===dossierKey(data)),
      kept:state.dossier?[...state.dossierArchive,state.dossierSnapshot].findIndex(record=>record&&dossierKey(record,true)===dossierKey(data,true)):-1
    };
  }
  function dossierPreviewLine(item,data) {
    if(item.id==='transfers') return data.amount+' · '+(item.quote.includes('MP-1000-043')?'2 giao dịch':'1 giao dịch')+' mô phỏng';
    if(item.id==='receipt45') return '+45.000đ · Tiền công đã nhận';
    if(item.id==='demands') return data.amount==='1.500.000đ'?'Yêu cầu ứng tiền và phí xử lý tiếp theo':'Ứng 500k rồi bị yêu cầu chuyển tiếp 1 triệu';
    if(item.id==='post') return 'Công việc hỗ trợ nội dung · Bài đăng công khai';
    return item.id==='studioPost'?'Studio xác nhận bài tuyển do họ đăng':'Studio không tổ chức quy trình ứng tiền';
  }
  function dossierBody(data,scope='draft') {
    if(data?.schema!==2) return '<p>Bản từ trước cập nhật; chưa ghi các lựa chọn đính kèm theo cơ chế mới.</p>'+
      (data?'<p>Tổng ghi trong bản: '+e(data.amount||'chưa lưu chi tiết')+'. '+(data.receipts?'Có chứng từ theo trạng thái cũ. ':'')+(data.chat?'Có tin nhắn theo trạng thái cũ.':'')+'</p>':'');
    return '<p class="small">Tóm tắt tự điền từ diễn biến</p><p>'+e(data.summary)+'</p><div class="dossier-documents">'+data.attachments.map(item=>{
      const disclosure='dossier-read-'+scope+'-'+data.amount+'-'+item.id;
      return '<details class="dossier-document" data-disclosure="'+e(disclosure)+'" '+(state.disclosures[disclosure]?'open':'')+'><summary><strong>'+e(item.title)+'</strong><span class="document-preview">'+e(dossierPreviewLine(item,data))+'</span><span class="document-toggle"><span class="when-closed">Xem đầy đủ</span><span class="when-open">Thu gọn</span></span></summary>'+
        '<div class="document-full"><p class="small">'+e(item.source)+'</p><blockquote>'+e(item.quote)+'</blockquote><p><b>Làm rõ:</b> '+e(item.role)+'</p><p><b>Giới hạn:</b> '+e(item.limit)+'</p>'+
        (['transfers','demands'].includes(item.id)?'<p class="small">'+(item.kept?'Đã lưu riêng khi tạo bản này.':'Chưa lưu riêng khi tạo bản này.')+'</p>':'')+
        actions(button('Thu gọn tài liệu','close-evidence'))+'</div></details>';
    }).join('')+'</div>'+(!data.attachments.length?'<p>Chưa đính kèm nội dung nào.</p>':'');
  }
  function dossierSentHistory() {
    if(!state.dossierSent.length) return '';
    const sentMessages=state.messages.map((m,index)=>({m,index})).filter(({m})=>m.dossierVersion);
    return '<details class="dossier-history"><summary>Bản đã gửi trước đó · '+state.dossierSent.length+' bản</summary>'+state.dossierSent.map((record,i)=>{
      const kept=dossierVersions(record).kept;
      const message=sentMessages[i]?.index??-1;
      const reply=message>=0?state.messages[message+1]:null;
      return '<details class="dossier-sent-record"><summary>Bản gửi '+(i+1)+(kept>=0?' · Đã lưu ở bản lưu '+(kept+1):' · Chưa lưu phiên bản này')+'</summary>'+dossierBody(record,'sent-'+i)+
        (reply?.supportKind==='dossier-review'?'<section class="support-reaction"><small>Phản hồi của Vy về bản gửi '+(i+1)+'</small>'+bubble('Vy',reply.text)+'</section>':'')+'</details>';
    }).join('')+actions(go('inbox','Xem lịch sử trong hộp thư Vy'))+'</details>';
  }
  function dossierReply(data) {
    const ids=data.selected;
    if(!ids.includes('transfers')) {
      if(ids.includes('demands')) return 'Có lời yêu cầu rồi. Còn chứng từ khoản đã chuyển nữa.';
      if(ids.includes('receipt45')) return 'Cái này cho thấy lần trước tớ có nhận tiền. Còn khoản tớ đã chuyển thì mình chưa kèm.';
      if(ids.includes('post')) return 'Bài này cho thấy công việc ban đầu. Còn chứng từ khoản đã chuyển thì mình chưa kèm.';
      return 'Bản này chưa kèm chứng từ khoản tớ đã chuyển. Mình xem lại phần đó nha?';
    }
    if(!ids.includes('demands')) return 'Có khoản chuyển rồi. Mình kèm đoạn họ yêu cầu tiền để rõ vì sao tớ chuyển nha?';
    return ids.includes('post')?'Mình có cả khoản đã chuyển và lời yêu cầu tiền rồi. Bài tuyển thêm bối cảnh, chưa xác nhận lời mời riêng.':'Mình có cả khoản đã chuyển và lời yêu cầu tiền rồi.';
  }
  function dossierFollowup() {
    if(state.messages.at(-1)?.supportKind!=='dossier-review') return '';
    const data=state.dossierSent.at(-1);if(!data) return '';
    const missing=!data.selected.includes('transfers')?'transfers':!data.selected.includes('demands')?'demands':null;
    return actions(missing?button(missing==='transfers'?'Bổ sung chứng từ đã chuyển':'Bổ sung tin nhắn yêu cầu tiền','dossier-supplement',missing):'',
      go('dossier','Xem bản đã gửi'),dossierVersions(data).kept>=0?pill('Bản gửi '+state.dossierSent.length+' · Đã lưu ở bản lưu '+(dossierVersions(data).kept+1)):
      data.amount===total()?button('Lưu bản đã gửi này','dossier-save',String(state.dossierSent.length-1)):'');
  }
  function dossierStatus() {
    const latest=state.dossierSent.at(-1),saved=state.dossierSnapshot;
    return '<details class="dossier-status"><summary>Chi tiết bản chuẩn bị</summary>'+
      '<p>Đang chọn: '+e(state.dossierSelection.map(id=>dossierLabels[id]).join('; ')||'chưa chọn nội dung')+'. Việc chọn chưa phải gửi hoặc lưu.</p>'+
      (state.dossierDraft&&dossierKey(state.dossierDraft)!==dossierKey(latest)?'<p>Có bản nháp chưa gửi Vy.</p>':'')+
      (latest?'<p>Đã gửi Vy xem: '+e(latest.selected.map(id=>dossierLabels[id]).join('; ')||'bản chưa đính kèm')+'. '+e(dossierCoverage(latest))+'</p>':'<p>Chưa gửi Vy bản nháp theo cơ chế đính kèm mới.</p>')+
      (state.dossierSent.length>1?'<p>Có '+(state.dossierSent.length-1)+' lần sửa/bổ sung đã gửi Vy.</p>':'')+
      (saved||state.dossier?'<p>Bản đã lưu '+(saved?.amount?e(saved.amount):'từ lượt cũ')+(saved?.amount&&saved.amount!==total()?' khác tổng hiện tại '+total():'')+'.</p>':'<p>Chưa lưu bản chuẩn bị.</p>')+
      '<p>Các bản này chưa gửi ngân hàng hoặc cơ quan Công an.</p></details>';
  }
  function dossier() {
    const items=dossierItems(),data=state.dossierDraft,latest=state.dossierSent.at(-1),saved=state.dossierSnapshot;
    const stale=data&&data.amount!==total();
    const intro=state.messages[state.dossierIntro];
    const selection=Object.entries(items).map(([id,item])=>'<article class="dossier-item" data-item="'+id+'"><h3>'+e(item.title)+'</h3><p class="small">'+e(item.source)+'</p>'+
      '<details data-disclosure="dossier-'+id+'" data-dossier-item="'+id+'" '+(state.disclosures['dossier-'+id]?'open':'')+'><summary>Xem nội dung</summary><p>'+e(item.quote)+'</p></details>'+
      '<p class="small">'+(item.kept?'Đã lưu riêng.':id==='transfers'&&state.receiptSavedTotal?'Đã lưu riêng chứng từ ở mốc '+e(state.receiptSavedTotal)+'; có khoản mới chưa lưu.':'Chưa lưu riêng; có thể dùng từ nội dung Vy chia sẻ.')+'</p>'+
      '<label class="dossier-check"><input type="checkbox" data-action="dossier-toggle" data-id="'+id+'" '+(state.dossierSelection.includes(id)?'checked':'')+' aria-label="Đính kèm '+e(item.title)+'">Đính kèm nội dung này</label></article>').join('');
    return '<h1>Cùng Vy chuẩn bị thông tin</h1><p>Chọn nội dung giúp làm rõ khoản Vy đã chuyển và yêu cầu chuyển thêm.</p>'+
      (intro?(state.dossierIntroOpen?bubble('Vy',intro.text):'<details><summary>Xem lời Vy khi bắt đầu</summary>'+bubble('Vy',intro.text)+'</details>'):'')+
      '<p class="small">Đính kèm không đồng nghĩa lưu riêng chứng cứ. Phần chuẩn bị này chưa gửi ngân hàng hoặc cơ quan Công an.</p>'+
      (saved&&saved.amount!==total()?'<p class="notice">Bản đã lưu ghi '+e(saved.amount)+'. Lượt hiện tại đã chuyển '+total()+'. Bản cũ được giữ nguyên; hãy xem lại số tiền và chứng từ khi cập nhật.</p>':'')+
      (state.dossier&&saved?.schema!==2?'<p class="notice">Bản từ trước cập nhật vẫn được giữ. Chưa có lựa chọn đính kèm mới được tự gán.</p>':'')+
      '<details class="dossier-sources" '+(!data?'open':'')+'><summary>Chọn hoặc bỏ nội dung đính kèm</summary><div class="dossier-grid">'+selection+'</div></details>'+
      (!data?actions(button('Xem bản nháp','dossier-preview','','primary')):(()=>{
        const versions=dossierVersions(data),sent=versions.sent>=0,kept=versions.kept>=0;
        return '<section class="draft-box dossier-preview" tabindex="-1"><header class="dossier-state"><h2>'+(!sent&&!kept?'Bản nháp mới':'Bản chuẩn bị đang xem')+'</h2><p>'+ (sent?'Đã gửi Vy · Bản gửi '+(versions.sent+1):'Chưa gửi Vy')+' · '+(kept?'Đã lưu · Bản lưu '+(versions.kept+1):'Chưa lưu phiên bản này')+'</p></header>'+dossierBody(data)+
          (!stale&&dossierKey(data,true)!==dossierKey(dossierData(),true)?'<p class="small">Nội dung hoặc trạng thái lưu riêng hiện tại đã khác nháp này.</p>'+actions(button('Lấy thay đổi hiện tại vào nháp','dossier-preview')):'')+
          (stale?'<p class="notice">Bản đang xem ghi '+e(data.amount)+'; tổng hiện tại là '+total()+'. Cần cập nhật nháp trước khi gửi hoặc lưu.</p>'+actions(button('Cập nhật nháp theo lượt hiện tại','dossier-preview','','primary')):
            actions(!sent?button('Gửi Vy xem bản nháp','dossier-send','','primary'):'',!kept?button(state.dossier?'Lưu thành phiên bản mới':'Lưu phiên bản này','dossier-save'):''))+
          actions(button('Đổi lựa chọn','dossier-edit'),button(sent||kept?'Đóng phần xem':'Hủy bản nháp','dossier-cancel'))+'</section>';
      })())+
      dossierSentHistory()+
      (state.dossier?'<details class="dossier-saved"><summary>Bản đã lưu · '+(state.dossierArchive.length+1)+' phiên bản</summary>'+[...state.dossierArchive,saved].map((record,i)=>'<article><h3>Bản lưu '+(i+1)+(i===state.dossierArchive.length?' · gần nhất':' · trước đó')+'</h3><p class="small">'+(record&&dossierVersions(record).sent>=0?'Đã gửi Vy ở bản gửi '+(dossierVersions(record).sent+1):'Chưa ghi nhận gửi Vy phiên bản này')+'</p>'+dossierBody(record,'saved-'+i)+'</article>').join('')+'</details>':'')+
      actions(go('proofs','Xem lại chứng cứ'),go('help','Xem hướng dẫn hỗ trợ'))+supportExit();
  }
  function makeReport() {
    return {amount:total(),text:'Tài khoản Hương Giang tự nhận tuyển cộng tác viên cho Sao Mai Studio, hướng dẫn Vy ứng tiền. Vy đã chuyển '+total()+' nhưng chưa được thanh toán và vẫn bị yêu cầu chuyển thêm. Đề nghị ViệtBook xem xét tài khoản gửi yêu cầu tiền.'};
  }
  function report() {
    const draft=state.reportDraft;
    return '<h1>Báo cáo tài khoản Hương Giang</h1>'+publisher('Hương Giang','Tài khoản gửi lời mời và yêu cầu ứng tiền')+
      (state.reported?'<p>'+pill('Đã gửi báo cáo mô phỏng · Chưa có kết quả xử lý')+'</p><details><summary>Xem nội dung đã báo cáo</summary><p>'+e(state.reportSnapshot?.text||'Báo cáo từ lượt đã lưu trước cập nhật; chưa có nội dung chi tiết lưu kèm.')+'</p></details>':
        draft?'<section class="draft-box"><h2>Xem trước báo cáo · Chưa gửi</h2><p><b>Đối tượng:</b> tài khoản Hương Giang, không phải bài tuyển của Studio.</p><p>'+e(draft.text)+'</p>'+
          (draft.amount!==total()?'<p>Lượt chơi đã có giao dịch mới. Cần cập nhật nháp trước khi gửi.</p>'+actions(button('Cập nhật nháp báo cáo','draft-report')):
          actions(button('Xác nhận gửi báo cáo mô phỏng','report','','primary')))+actions(button('Hủy báo cáo','cancel-report'))+'</section>':
          actions(button('Soạn báo cáo tài khoản','draft-report','','primary')))+
      supportReaction()+'<p class="small">Báo cáo ViệtBook khác với trình báo cơ quan chức năng và không xác nhận thu hồi tiền.</p>'+supportExit();
  }
  function endingState() {
    const kind=state.extraPaid?'extra':state.verifiedShared&&state.stopped?'verified':state.stopped?'stopped':state.paused?'paused':'undecided';
    const outcomes={
      extra:{title:'Vy đã chuyển thêm 1 triệu',reply:state.stopped?'Tớ không chuyển thêm nữa. Mình xem cách xử lý khoản đã chuyển nha.':'Tớ vẫn chưa biết phải xử lý thế nào.',
        lesson:'Khoản đã chuyển trước đó không làm yêu cầu chuyển tiếp trở nên an toàn.'},
      verified:{title:'Vy dừng sau khi kiểm tra với Studio',reply:'Ừ, tớ không chuyển thêm nữa.',
        lesson:'Bài tuyển có thật không tự xác nhận lời mời riêng. Cần kiểm tra đúng yêu cầu đang được đưa ra.'},
      stopped:{title:'Vy đã dừng chuyển thêm',reply:'Tớ không chuyển thêm nữa. Nhưng khoản đã chuyển thì vẫn chưa lấy lại được.',
        lesson:state.asked.includes('process')?'Dừng chuyển thêm giúp tránh tăng thiệt hại. Phản hồi Studio vẫn cần được chuyển cho Vy.':'Dừng chuyển thêm giúp tránh tăng thiệt hại. Yêu cầu ứng tiền vẫn chưa được kiểm tra qua Studio.'},
      paused:{title:'Vy đang chờ kiểm tra',reply:'Ừ, tớ chờ. Tớ chưa chuyển thêm.',
        lesson:'Tạm dừng tạo thời gian kiểm tra yêu cầu trước khi quyết định.'},
      undecided:{title:'Vy vẫn đang phân vân',reply:'Tớ vẫn chưa biết nên làm gì tiếp.',
        lesson:'Giữ chứng cứ hoặc báo cáo tài khoản chưa thay cho quyết định về lần chuyển tiếp theo.'}
    };
    return {kind,...outcomes[kind],amount:total(),stopped:state.stopped,verified:state.verifiedShared};
  }
  function endingInvitation() {
    if(!state.stopped) return {view:'recover',label:'Nhắn Vy về việc dừng chuyển thêm'};
    const seen=state.helpSeen.filter(id=>Object.hasOwn(helpSources,id));
    if(!seen.length) return {view:'help',label:'Tìm nơi hỗ trợ khoản đã chuyển'};
    if(!state.helpShared.length) return {view:seen.length===1?seen[0]:'help',label:'Xem lại hướng dẫn để gửi Vy'};
    if(!state.receiptSaved||!state.chatSaved) return {view:'proofs',label:'Cùng Vy xem lại chứng cứ'};
    return {view:'recover',label:'Xem lại phần hỗ trợ'};
  }
  function summary() {
    if(!ready()) return '<h1>Ca đang diễn ra</h1>'+actions(go('inbox','Về hộp thư Vy'));
    const ending=endingState(),invitation=endingInvitation();
    return '<section class="ending-main"><p class="ending-label">Kết ca · Lượt này</p><h1>'+ending.title+'</h1>'+bubble('Vy',ending.reply)+
      '<div class="ending-money"><p><b>Tổng đã chuyển: '+ending.amount+'.</b> Chưa xác nhận thu hồi.</p><p class="small">45.000đ tiền công đã nhận trước được ghi riêng, không trừ vào tổng đã chuyển.</p></div>'+
      (!state.stopped?'<p class="ending-limit">Vy chưa xác nhận dừng chuyển thêm.</p>':'')+
      (state.verifiedShared?'<p class="ending-limit">Studio xác nhận không tổ chức quy trình ứng tiền làm nhiệm vụ. Danh tính thật của Hương Giang chưa được xác minh.</p>':'')+
      '<p class="ending-lesson">'+ending.lesson+'</p>'+
      actions(typeof window.frameElement?.caTrucClose==='function'?button('Về desktop','leave-case','','primary'):'',go('inbox','Về hộp thư Vy'))+
      '<aside class="ending-invitation"><p>Bạn có thể dừng lượt tại đây, hoặc tiếp tục cùng Vy.</p>'+actions(go(invitation.view,invitation.label))+'</aside></section>'+
      '<details class="ending-support"><summary>Xem tình trạng chứng cứ và hỗ trợ</summary>'+
      '<ul><li>'+(state.stopped?'Vy đã dừng chuyển thêm.':state.paused?'Vy đang chờ kiểm tra; chưa chốt dừng.':'Chưa chốt dừng chuyển thêm.')+'</li><li>'+
      (state.receiptSaved&&state.chatSaved?'Đã lưu tin nhắn và chứng từ chuyển tiền.':state.receiptSaved?'Đã lưu chứng từ. Còn thiếu tin nhắn.':
        state.chatSaved?'Đã lưu tin nhắn. Còn thiếu chứng từ hiện tại.':state.receiptSavedTotal?'Đã lưu chứng từ ở mốc '+state.receiptSavedTotal+'; khoản chuyển mới và tin nhắn chưa được lưu riêng.':'Chưa lưu tin nhắn và chứng từ.')+'</li><li>'+
      (state.verifiedShared?'Vy đã nhận căn cứ Studio về quy trình ứng tiền.':state.asked.includes('process')?'Đã hỏi Studio về ứng tiền; chưa chuyển phản hồi cho Vy.':'Chưa xác minh quy trình ứng tiền với Studio.')+'</li><li>'+
      (state.helpSeen.length?'Đã mở kênh: '+state.helpSeen.map(id=>e(helpSources[id].title)).join('; ')+'.':'Chưa mở kênh hỗ trợ khoản tiền.')+'</li><li>'+
      (state.helpShared.length?'Đã gửi hướng dẫn cho Vy: '+state.helpShared.map(id=>e(helpSources[id].title)).join('; ')+'.':'Chưa gửi hướng dẫn hỗ trợ cho Vy.')+'</li><li>'+
      (state.dossier?'Đã lưu bản chuẩn bị mô phỏng; chưa trình báo.':state.dossierSent.length?'Đã gửi Vy xem nháp; chưa lưu bản chuẩn bị.':'Chưa chuẩn bị thông tin.')+'</li><li>'+
      (state.reported?'Đã gửi báo cáo ViệtBook; chưa có kết quả xử lý.':'Chưa gửi báo cáo ViệtBook.')+'</li><li>Chưa có xác nhận Vy đã liên hệ ngân hàng hoặc trình báo cơ quan Công an.</li></ul>'+
      dossierStatus()+actions(go('dossier','Xem các bản chuẩn bị thông tin'))+'</details>'+
      '<details class="ending-history"><summary>Xem diễn biến và những việc đã làm</summary><ul>'+
      (state.legacy?'<li>Thông tin từ lượt đã lưu trước bản cập nhật (không xác định đầy đủ thứ tự):<ul>'+legacyFacts().map(text=>'<li>'+e(text)+'</li>').join('')+'</ul></li>':'')+
      state.timeline.map(text=>'<li>'+e(text)+'</li>').join('')+
      (state.helpDraft?'<li>Nháp hướng dẫn chưa gửi.</li>':'')+(state.reportDraft?'<li>Nháp báo cáo chưa gửi.</li>':'')+
      (state.draft?'<li>Chưa gửi: bản nháp nhận định về '+e(groupNames[state.draft.id])+'.</li>':'')+
      (!hasOpinion('compare')&&state.selected.length?'<li>Đang chọn '+state.selected.length+'/2 trích đoạn; chưa gửi đối chiếu.</li>':'')+
      (state.asked.length?'<li>Danh tính và vai trò thật của Hương Giang chưa được xác minh.</li>':'')+
'</ul></details>'+
      '<details class="ending-sources"><summary>Cơ sở tình huống</summary><p>Cơ chế trả công ban đầu, yêu cầu ứng tiền và giữ thanh toán được chuyển thể từ các cảnh báo dưới đây. Tên người, tổ chức và mọi diễn biến cụ thể trong ca đều hư cấu.</p><ul>'+
      sources.map(([label,url])=>'<li><a href="'+url+'" target="_blank" rel="noopener">'+label+'</a></li>').join('')+'</ul><h3>Cơ sở ứng phó</h3><ul>'+
      Object.values(helpSources).map(item=>'<li><a href="'+item.url+'" target="_blank" rel="noopener">'+e(item.organization)+' · '+item.date+'</a> — '+e(item.label)+'. Áp dụng: '+e(item.purpose)+'</li>').join('')+'</ul></details>'+
      '';
  }
  const panels={
    inbox,recruiter,transactions,receipt,tasks,task,post,club,recover,proofs,help,dossier,report,bankHelp:()=>helpSource('bankHelp'),policeHelp:()=>helpSource('policeHelp'),result:summary,
    page:()=>'<h1>Trang Sao Mai Studio</h1>'+publisher(studio,'Đơn vị truyền thông trong thế giới game')+
      '<p>Nội dung số, hình ảnh và biên tập.</p>'+actions(go('club','Nhắn tin Sao Mai Studio','primary'),go('post','Xem bài tuyển gốc'),go('inbox','Về hộp thư Vy')),
    giang:()=>'<h1>Hội thoại riêng · Hương Giang</h1>'+publisher('Hương Giang','Hội thoại từ tài khoản người chơi')+
      (state.giangAsked?bubble('Bạn · Đã gửi','Bạn em là Vy, đã ứng tiền mà chưa được thanh toán. Vì sao phải chuyển thêm ạ?',true)+
      bubble('Hương Giang','Chương trình này chị phụ trách riêng. Vy làm nốt bước tiếp theo thì hệ thống mới trả gộp.'):
      actions(button('Hỏi vì sao Vy phải chuyển thêm','ask-giang')))+actions(go('recruiter','Về đoạn chat Vy chia sẻ'),go('inbox','Về hộp thư Vy')),

  };
  let focusAfterRender=null;
  function render() {
    const view=current(),restoreY=state.scrolls[view]||0;state.view=view;
    if(view==='club') state.studioVisited=true;
    if(view!=='dossier') state.dossierIntroOpen=false;
    if(view==='dossier'&&!state.dossierOpened) {
      state.dossierOpened=true;state.dossierIntroOpen=true;state.dossierIntro=state.messages.length;state.pendingTurn=state.messages.length;
      state.messages.push({name:'Vy',dossierIntro:true,text:'Tớ có cả biên lai lần nhận tiền lẫn lần chuyển tiền. Mình kèm những gì để kể rõ chuyện này?'});
    }
    if(view==='recover'&&!state.supportOpened) {
      state.supportOpened=true;state.supportIntro=state.messages.length;state.pendingTurn=state.messages.length;
      state.messages.push({name:'Vy',supportKind:'intro',text:state.extraPaid?
        (state.stopped?'Tớ không chuyển thêm nữa. Nhưng khoản 1,5 triệu chưa về. Giờ mình bắt đầu từ đâu?':'Tớ đã chuyển thêm mà họ vẫn đòi tiếp. Tớ không biết nên xử lý từ đâu.'):
        state.stopped?'Tớ không chuyển thêm nữa. Nhưng tớ muốn chặn người này ngay cho đỡ sợ. Còn khoản đã chuyển thì giờ làm sao?':
        'Tớ muốn chặn người này quá. Nhưng nếu dừng thì khoản đã chuyển có mất luôn không?'});
    }
    if(Object.hasOwn(helpSources,view)&&!state.helpSeen.includes(view)) {
      state.helpSeen.push(view);log('Đã mở hướng dẫn từ '+helpSources[view].title+'. Chưa gửi hướng dẫn hay liên hệ.');
    }
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
    {
      if(view==='inbox'&&state.pendingTurn!==null) {
        const target=host.querySelector('.message-turn[data-start="'+state.pendingTurn+'"]');
        if(target) {target.focus({preventScroll:true});target.scrollIntoView({block:'start'});}
        state.pendingTurn=null;save();
      } else if(view==='result'&&restoreY===0) {
        host.querySelector('.ending-main')?.scrollIntoView({block:'start'});
      } else if(focusAfterRender) {
        const target=host.querySelector(focusAfterRender);focusAfterRender=null;
        target?.focus({preventScroll:true});target?.scrollIntoView({block:target.classList.contains('dossier-preview')?'start':'nearest'});
      } else window.scrollTo(0,restoreY);
    }
  }
  function act(action,id,checked) {
    const hadDossierDraft=Boolean(state.dossierDraft);
    state.scrolls[current()]=window.scrollY;
    if(action==='dossier-toggle') focusAfterRender='[data-action="dossier-toggle"][data-id="'+id+'"]';
    else if(action==='dossier-preview') focusAfterRender='.dossier-preview';
    else if(action==='dossier-edit'||action==='dossier-cancel') focusAfterRender='[data-action="dossier-toggle"]';
    else if(['keep','report'].includes(action)) focusAfterRender='.support-reaction';
    else if(action==='draft-help'||action==='draft-report') focusAfterRender='.draft-box button';
    else if(action==='cancel-report') focusAfterRender='[data-action="draft-report"]';
    else if(action==='cancel-help') focusAfterRender='[data-action="draft-help"]';
    else if(action==='draft') focusAfterRender='.draft-box [data-action="send-draft"]';
    else if(action==='review'||action==='change-draft') focusAfterRender='.opinion-editor [data-action="draft"], [data-action="draft"]';
    else if(action==='close-review') focusAfterRender='.opinion-tools [data-id="'+id+'"]';
    else if(action==='discard-draft') focusAfterRender='[data-action="draft"], [data-action="review"]';
    else if(action==='select-excerpt') focusAfterRender='[data-action="select-excerpt"][data-id="'+id+'"]';

    if(action==='leave-case'&&current()==='result'&&typeof window.frameElement?.caTrucClose==='function') {
      save();window.frameElement.caTrucClose();return;
    }
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
      state.receiptSaved=false;state.chatSaved=false;
      chat('Ừ, cậu chuyển tiếp đi','Tớ quyết định thử làm nốt bước này.');
      state.messages.push({name:'Vy',text:'Tớ vừa chuyển thêm 1 triệu rồi.'},{name:'Vy',text:'Vẫn chưa được thanh toán. Giờ họ lại đòi phí xử lý.'});
    } else if(action==='stop'&&!state.stopped&&current()==='recover') {
      log('Đã nhắn Vy dừng; Vy xác nhận không chuyển thêm.');state.stopped=true;state.transferPrompt=false;
      supportChat('Cậu đừng chuyển thêm nha.','Ừ, tớ dừng ở đây. Tớ không chuyển thêm nữa.','stop');
      save();navigate('inbox');return;
    } else if(action==='keep'&&['recover','proofs'].includes(current())&&['receiptSaved','chatSaved'].includes(id)&&!state[id]) {
      state[id]=true;if(id==='receiptSaved') state.receiptSavedTotal=total();log(id==='receiptSaved'?'Đã lưu chứng từ chuyển tiền.':'Đã lưu tin nhắn yêu cầu chuyển thêm.');
      supportChat(id==='receiptSaved'?'Tớ lưu lại chứng từ chuyển tiền nha.':'Tớ lưu lại đoạn họ yêu cầu tiền nha.',
        state.receiptSaved&&state.chatSaved?'Mình đã giữ cả tin nhắn và chứng từ rồi.':
        id==='receiptSaved'?'Ừ, mình giữ được chứng từ rồi. Còn đoạn họ yêu cầu chuyển tiền nữa.':'Ừ, mình giữ được tin nhắn rồi. Còn chứng từ khoản đã chuyển nữa.','evidence');
    } else if(action==='draft-help'&&Object.hasOwn(helpSources,id)&&current()===id&&!state.helpShared.includes(id)) state.helpDraft=id;
    else if(action==='cancel-help'&&state.helpDraft===id) state.helpDraft=null;
    else if(action==='share-help'&&state.helpDraft===id&&current()===id&&!state.helpShared.includes(id)) {
      const item=helpSources[id];state.helpShared.push(id);state.helpDraft=null;
      log('Đã gửi hướng dẫn '+item.title+' cho Vy. Chưa xác nhận đã liên hệ.');
      supportChat(item.advice,item.reply,'guidance',{source:item.organization,quote:item.quote});save();navigate('inbox');return;
    } else if(action==='dossier-toggle'&&current()==='dossier'&&Object.hasOwn(dossierItems(),id)) {
      const selected=typeof checked==='boolean'?checked:!state.dossierSelection.includes(id);
      state.dossierSelection=selected?[...new Set([...state.dossierSelection,id])]:state.dossierSelection.filter(value=>value!==id);state.dossierDraft=null;
    } else if(action==='dossier-preview'&&current()==='dossier') state.dossierDraft=dossierData();
    else if(['dossier-edit','dossier-cancel'].includes(action)&&current()==='dossier') state.dossierDraft=null;
    else if(action==='dossier-send'&&current()==='dossier'&&state.dossierDraft&&state.dossierDraft.amount===total()) {
      const data=state.dossierDraft;
      if(dossierVersions(data).sent>=0) return;
      const revision=state.dossierSent.length>0;
      const record=JSON.parse(JSON.stringify(data));state.dossierSent.push(record);state.dossierIntroOpen=false;
      const attachments=[{source:'Tóm tắt tự điền · Bản '+(state.dossierSent.length),quote:data.summary},...data.attachments.map(item=>({source:item.title+' · '+item.source,quote:item.quote}))];
      supportChat((revision?'Tớ bổ sung/sửa bản chuẩn bị rồi. ':'Tớ gửi cậu xem bản chuẩn bị nha. ')+
        'Đính kèm: '+(data.selected.map(id=>dossierLabels[id]).join('; ')||'chưa có nội dung')+'.',dossierReply(data),'dossier-review',
        {kind:'dossier',itemCount:data.selected.length,source:'Bản chuẩn bị · Chưa gửi cơ quan',quote:data.summary,excerpts:attachments});
      state.messages[state.messages.length-2].dossierVersion=record;
      log((revision?'Đã gửi bản bổ sung/sửa':'Đã gửi bản nháp')+' cho Vy: '+data.amount+', '+(data.selected.map(id=>dossierLabels[id]).join('; ')||'chưa đính kèm')+'. '+dossierCoverage(data));
      save();navigate('inbox');return;
    } else if(action==='dossier-supplement'&&['transfers','demands'].includes(id)&&state.dossierSent.length) {
      state.dossierSelection=[...new Set([...state.dossierSent.at(-1).selected,id])];state.dossierDraft=null;
      focusAfterRender='[data-action="dossier-toggle"][data-id="'+id+'"]';save();navigate('dossier');return;
    } else if(action==='dossier-save') {
      const data=id!==undefined&&id!==''?state.dossierSent[Number(id)]:state.dossierDraft;
      if(!data||data.amount!==total()||dossierVersions(data).kept>=0) return;
      const updating=state.dossier;
      if(state.dossier) state.dossierArchive.push(state.dossierSnapshot?JSON.parse(JSON.stringify(state.dossierSnapshot)):null);
      state.dossier=true;state.dossierSnapshot=JSON.parse(JSON.stringify(data));state.dossierIntroOpen=false;
      log((updating?'Đã cập nhật bản đã lưu':'Đã lưu bản chuẩn bị')+': '+data.amount+', '+(data.selected.map(id=>dossierLabels[id]).join('; ')||'chưa đính kèm')+'. Chưa gửi ngân hàng hoặc cơ quan Công an.');
    } else if(action==='draft-report'&&current()==='report'&&!state.reported) state.reportDraft=makeReport();
    else if(action==='cancel-report'&&current()==='report') state.reportDraft=null;
    else if(action==='report'&&current()==='report'&&!state.reported&&state.reportDraft&&state.reportDraft.amount===total()) {
      state.reported=true;state.reportSnapshot=state.reportDraft;state.reportDraft=null;
      log('Đã gửi báo cáo mô phỏng tài khoản Hương Giang trên ViệtBook. Chưa có kết quả xử lý.');
      supportChat('Tớ gửi báo cáo tài khoản Hương Giang trên ViệtBook rồi.',
        'Ừ, báo cáo đã gửi. Mình còn phải theo hướng hỗ trợ khoản tiền; báo cáo này chưa làm tiền về.','report');
    } else if(action==='support-finish'&&['recover','proofs','help','bankHelp','policeHelp','dossier','report'].includes(current())) {
      if(!state.finished) {state.finished=true;log('Đã xem kết thúc tại giai đoạn hỗ trợ.');}
      save();navigate('result');return;
    }
    else if(action==='ask-giang'&&current()==='giang'&&!state.giangAsked) {state.giangAsked=true;log('Đã hỏi riêng Hương Giang; đây là lời của bên đang yêu cầu tiền.');}
    else return;
    // Keep the native checkbox node alive through its change event.
    if(action==='dossier-toggle'&&typeof checked==='boolean'&&!hadDossierDraft) {focusAfterRender=null;save();return;}
    render();

  }
  host.addEventListener('click',event=>{
    const summary=event.target.closest('summary');
    const readId=summary?.parentElement.dataset.dossierItem;
    if(readId&&!summary.parentElement.open&&!state.dossierSeen.includes(readId)) {state.dossierSeen.push(readId);log('Đã mở '+dossierLabels[readId]+' trong phần chuẩn bị.');save();}
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
  host.addEventListener('change',event=>{
    const input=event.target.closest('input[data-action="dossier-toggle"]');if(input) act('dossier-toggle',input.dataset.id,input.checked);
  });
  addEventListener('hashchange',render);
  addEventListener('scroll',()=>{state.scrolls[current()]=window.scrollY;save();},{passive:true});
  if(saved&&Object.hasOwn(panels,saved.view)) history.replaceState(null,'','#'+saved.view);
  render();
})();
