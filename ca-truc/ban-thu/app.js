(() => {
  'use strict';
  const host = document.getElementById('app');
  const storage = window.frameElement?.caTrucStorage;
  const fresh = () => ({view:'inbox', transfer:'pending', messages:[], shared:[], seen:[], guide:true,
    giangContacted:false, clubAsked:[], transferPrompt:false, verifiedDecision:false, reported:false, linkSent:false, finished:false,
    stopped:false, bank:false, receipt:false, chatSaved:false});
  const saved = storage?.load();
  let state = {...fresh(), ...saved};
  let resume = Boolean(storage?.canResume && saved);
  // Older saves used the link action to record a simulated registration.
  if (saved?.vyRegistered) {
    state.linkSent = true;
    state.messages = state.messages.map(message => message.text === 'Tớ gửi đăng ký ca chiều rồi'
      ? {...message, text:'Để tớ xem form nha.'} : message);
  }
  if (saved && !Object.hasOwn(saved,'verifiedDecision')) {
    state.verifiedDecision = state.transfer==='cancelled' &&
      state.messages.some(message => message.text==='Hủy khoản 500k đi. Nếu vẫn muốn làm ca chiều thì đăng ký qua bài CLB nha');
  }
  // The former combined question answered both topics in one message.
  if (saved?.policyAsked) state.clubAsked = ['club-post','club-fee'];
  if (state.shared.includes('club')) {
    state.shared = state.shared.flatMap(id=>id==='club'?['club-post','club-fee']:id);
  }
  delete state.policyAsked;
  delete state.vyRegistered;
  delete state.verified;
  delete state.clubWait;
  delete state.code;
  delete state.prepared;
  delete state.history;
  let notice = '';
  const clb = 'CLB Truyền thông Sao Mai';
  const event = 'Tuyển cộng tác viên · Ngày hội Sao Mai';
  const publicComment = 'Em làm ca chiều được không ạ?';
  const giangQuestion = 'Bạn em là Vy, chị có phụ trách ca chiều không ạ?';
  const giangAnswer = 'Form chỉ nhận đăng ký chung thôi em. Ca chiều chị chốt riêng.';
  const holdAdvice = 'Khoan chuyển nha, để tớ xem';
  const riskAdvice = 'Chị ấy đã trả cậu 45k rồi, chắc ổn đó';
  const refusalAdvice = 'Thôi, cậu đừng chuyển khoản này';
  const transferQuestion = 'Vậy tớ chuyển 500k để giữ chỗ nha?';
  const rethinkAdvice = 'Khoan, để tớ kiểm tra lại';
  const proceedAdvice = 'Ừ, cậu chuyển đi';
  const clubQuestions = {
    'club-post': {
      question:'Bài tuyển này của CLB mình đăng hả?',
      answer:'Ừ, bài tuyển này do CLB mình đăng.',
      forward:'Chuyển xác nhận về bài tuyển cho Vy',
      summary:'CLB xác nhận họ đăng bài tuyển.',
      reply:'Vậy bài tuyển đúng là của CLB. Còn khoản giữ ca thì sao cậu?'
    },
    'club-fee': {
      question:'Bạn em được nhắn yêu cầu chuyển 500k để giữ ca chiều. CLB có thu khoản này không, và đăng ký ở đâu ạ?',
      answer:'Không em. Ca chiều đăng ký qua form trong bài. CLB không thu tiền giữ chỗ.',
      forward:'Chuyển xác nhận về khoản 500k cho Vy',
      summary:'CLB xác nhận ca chiều đăng ký qua biểu mẫu trong bài và không thu tiền giữ chỗ.',
      reply:'Vậy tớ không chuyển nữa. Cậu gửi tớ bài gốc với.'
    }
  };
  const reportStatus = 'Đã gửi báo cáo · Chờ xem xét';
  const guide = 'Bạn là bạn của Vy. Mở nội dung Vy gửi, kiểm tra lời mời rồi nhắn lại cho Vy.';
  const e = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const B = (label, action, id='', cls='', extra='') =>
    '<button type="button" class="'+cls+'" data-action="'+action+'" data-id="'+id+'" '+extra+'>'+e(label)+'</button>';
  const go = (view,label,cls='') => '<a class="button '+cls+'" href="#'+view+'">'+e(label)+'</a>';
  const pill = label => '<span class="pill">'+e(label)+'</span>';
  const actions = (...items) => '<div class="actions">'+items.join('')+'</div>';
  const status = () => ({pending:'Chưa chuyển',waiting:'Chưa chuyển',declined:'Chưa chuyển',cancelled:'Đã hủy',paid:'Đã chuyển'})[state.transfer];
  const unsettled = () => state.transfer==='pending'||state.transfer==='waiting';
  const refused = () => state.transfer==='cancelled'||state.transfer==='declined';
  const feeShared = () => state.shared.includes('club-fee');
  const canSuggestTransfer = () => unsettled() && !state.finished && !feeShared() &&
    !state.messages.some(message=>message.text===riskAdvice);
  const resultReady = () => state.finished || !unsettled();
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
    const pose = state.transfer==='pending'?'lo-lang':refused()?'nhe-nhom':'dang-nghe';
    return '<figure class="scene '+pose+'"><figcaption class="scene-caption">Thảo Vy</figcaption></figure>';
  }
  function publisher(name,initials,caption,view='') {
    const content='<span class="mark '+(initials==='SM'?'school':'')+'">'+initials+'</span><span><b>'+e(name)+'</b><small>'+e(caption)+'</small></span>';
    return view?'<a class="publisher source" href="#'+view+'">'+content+'</a>':'<div class="publisher source">'+content+'</div>';
  }
  function bubble(name,text,attachment=null,sent=false,postLink=false) {
    return '<article class="bubble'+(sent?' sent':'')+'"><small class="speaker">'+e(name)+'</small><p>'+e(text)+'</p>'+
      (attachment?'<blockquote><small>'+e(attachment.source)+'</small>'+e(attachment.quote)+'</blockquote>':'')+
      (postLink?postPreview():'')+'</article>';
  }
  function card(view,title,caption,img='') {
    return '<a class="share-card" href="#'+view+'">'+(img?'<img src="'+img+'" alt="">':'')+
      '<span><strong>'+e(title)+'</strong><small>'+e(caption)+'</small></span><span aria-hidden="true">›</span></a>';
  }
  const postPreview = (label=event) => card('post',label,clb,'assets/ngay-hoi.svg');
  const details = {
    comment:{source:'Bình luận công khai · Vy',quote:publicComment,text:'Tớ thấy câu hỏi của cậu ngay dưới bài.',reply:'À, tớ có hỏi ca chiều ngay dưới bài. Ai mở bài cũng đọc được ha.'},
    receipt:{source:'Biên lai · Ví học đường',quote:'+45.000đ · Đã nhận',text:'Đây là khoản 45k cậu nhận nè.',reply:'Ừ, tiền đó tớ nhận rồi. Mà cậu có biết chị ấy có làm bên CLB thật không?'},
    giang:{source:'Hội thoại của bạn · Lời Hương Giang',quote:giangAnswer,text:'Tớ hỏi chị Giang từ tài khoản của tớ. Chị ấy bảo form nhận đăng ký chung, còn ca chiều chị chốt riêng.',reply:'Ủa, vậy ca chiều đăng ký trong form hay nhắn riêng? Hỏi bên CLB thử nha.'}
  };
  function share(id,label='Gửi chi tiết cho Vy') {
    return state.shared.includes(id)?pill('Đã gửi cho Vy'):B(label,'share',id,'primary');
  }
  function chat(text,reply,attachment=null) {
    state.messages.push({name:'Bạn · Đã gửi',text,attachment,sent:true},{name:'Vy',text:reply});
  }
  function inbox() {
    const conversation = state.messages.map(m=>bubble(m.name,m.text,m.attachment,m.sent,m.postLink)+
      (state.transferPrompt&&m.text===transferQuestion?
        actions(B(rethinkAdvice,'rethink','','primary'),B(proceedAdvice,'proceed')):'')+
      (!feeShared()&&m.text===clubQuestions['club-post'].reply?
        actions(go('club','Quay lại hội thoại CLB','primary')):'')).join('');
    const clubShared = feeShared();
    return '<div class="inbox-layout"><aside class="portrait">'+portrait()+'</aside>'+
      '<section class="conversation"><div class="contact-title"><h1>Hộp thư · Thảo Vy</h1>'+pill('500.000đ · '+status())+'</div>'+
      (state.transfer==='waiting'&&!state.finished?'<p>Vy đang chờ xác minh</p>':'')+
      '<details class="first-guide" '+(state.guide?'open':'')+'><summary>Cách chơi</summary><p>'+e(guide)+'</p></details>'+
      bubble('Vy','Ê, chị nhắn tớ vụ ca chiều hôm qua trả tớ 45k thật nè.')+
      bubble('Vy','Giờ chị bảo chuyển 500k giữ chỗ, hết ca trả lại. Tớ muốn làm ca này mà thấy hơi cấn. Cậu coi giúp tớ với.')+
      '<div class="shared-list">'+postPreview('Mở bài tuyển Vy gửi')+
      card('recruiter','Đoạn chat Vy chia sẻ','Vy và Hương Giang · Bản xem lại')+
      card('receipt','Biên lai +45.000đ','Tiền đến · Đã nhận')+
      card('transfer','Giao dịch 500.000đ',status())+'</div>'+
      '<div class="chat-thread">'+conversation+'</div>'+
      (state.transferPrompt?'':actions(
        unsettled()&&state.transfer==='pending'?B(holdAdvice,'pause','','primary'):'',
        unsettled()?B(refusalAdvice,'cancel'):'',
        canSuggestTransfer()?B(riskAdvice,'risk'):'',
        state.transfer==='waiting'&&!state.finished?B('Kết thúc tại đây · Chưa chuyển','finish-wait'):'',
        state.transfer==='paid'?go('recover',state.stopped?'Quay lại hồ sơ hỗ trợ':'Mở hồ sơ hỗ trợ','primary'):'',
        state.linkSent?pill('Đã gửi link bài gốc'):
          clubShared&&refused()?B('Gửi đường dẫn bài gốc cho Vy','send-registration-link','','primary'):'',
        resultReady()?resultLink():''))+'</section></div>';
  }
  function post() {
    return '<h1>Bài đăng</h1><article class="artifact event-post"><header>'+
      publisher(clb,'SM','Bài đăng công khai · Hôm qua','page')+'</header>'+
      '<img src="assets/ngay-hoi.svg" alt="Bìa minh họa Ngày hội Sao Mai tại sân trường">'+
      '<div class="artifact-body"><h2>'+e(event)+'</h2><p>Tụi mình cần cộng tác viên đón khách, hướng dẫn các gian và hỗ trợ khu truyền thông tại sân trường.</p>'+
      '<ul><li>Ca sáng: 07:30–11:00</li><li>Ca chiều: 13:00–16:30</li></ul>'+
      actions(go('register','Mở biểu mẫu đăng ký'),go('page','Ghé trang CLB','primary'))+
      '<details id="comments"><summary>3 bình luận công khai</summary><ul class="comments">'+
      '<li><b>Minh Anh</b><p>Ca sáng còn chỗ không ạ?</p></li>'+
      '<li><b>Thảo Vy</b><p>'+e(publicComment)+'</p>'+share('comment','Gửi bình luận này cho Vy')+'</li>'+
      '<li><b>Gia Bảo</b><p>Em đăng ký bên khu đón khách ạ.</p></li></ul></details></div></article>'+
      actions(go('recruiter','Xem chat Hương Giang'),inboxLink());
  }
  function recruiter() {
    return '<h1>Đoạn chat Vy chia sẻ</h1><section class="conversation source-chat">'+
      publisher('Vy và Hương Giang','HG','Bản xem lại · Chỉ đọc')+
      '<p class="chat-date">Hôm qua</p>'+
      bubble('Hương Giang','Chị phụ trách ca chiều. Em rà lỗi bản nháp lịch sự kiện giúp chị nhé.')+
      bubble('Vy','Em rà xong rồi ạ. Mục mở cửa bị nhầm 13:30 thành 13:00.')+
      bubble('Hương Giang','Chị gửi em 45k tiền làm thử rồi nha.')+
      bubble('Vy','Em nhận được rồi ạ.')+
      '<p class="chat-date">Hôm nay</p>'+
      bubble('Hương Giang','Em chuyển 500k để giữ ca chiều nha.')+
      bubble('Hương Giang','Hết ca chị trả lại khoản đó.')+
      '</section>'+actions(go('giang','Mở hội thoại riêng với Hương Giang','primary'),
        state.reported?pill(reportStatus):go('report','Báo cáo tài khoản Hương Giang'),go('post','Mở bài gốc'),inboxLink());
  }
  function giang() {
    return '<h1>Hội thoại riêng · Hương Giang</h1><section class="conversation source-chat">'+
      publisher('Hương Giang','HG','Hội thoại từ tài khoản của bạn')+
      (state.giangContacted?bubble('Bạn · Đã gửi',giangQuestion,null,true)+
        bubble('Hương Giang',giangAnswer)+actions(share('giang','Chuyển lời Hương Giang cho Vy')):
        actions(B(giangQuestion,'ask-giang','','primary')))+
      '</section>'+actions(go('recruiter','Xem đoạn chat Vy chia sẻ'),inboxLink());
  }
  function club() {
    const conversation = state.clubAsked.map(id=>{
      const {question,answer,forward} = clubQuestions[id];
      return bubble('Bạn · Đã gửi',question,null,true)+bubble(clb,answer)+actions(share(id,forward));
    }).join('');
    const choices = Object.entries(clubQuestions).filter(([id])=>!state.clubAsked.includes(id))
      .map(([id,{question}])=>B(question,'ask-club',id));
    return '<h1>Hộp thư trang CLB</h1><section class="conversation source-chat">'+publisher(clb,'SM','Hộp thư mở từ trang đăng bài gốc')+
      '<div class="shared-list">'+postPreview()+'</div>'+conversation+actions(...choices)+
      '</section>'+actions(go('page','Về trang CLB'),inboxLink());
  }
  function transaction(incoming=false) {
    return '<article class="slip"><header><span class="seal">'+(incoming?'↙':'↗')+'</span><b>Ví học đường</b><small>Mô phỏng</small></header>'+
      '<strong class="amount">'+(incoming?'+45.000đ':'500.000đ')+'</strong>'+pill(incoming?'Đã nhận':status())+
      '<dl><dt>Nội dung</dt><dd>'+(incoming?'Tiền làm thử':'Giữ ca chiều')+'</dd><dt>'+(incoming?'Nguồn tiền':'Người nhận')+'</dt><dd>LE THI H</dd></dl></article>';
  }
  function summary() {
    if(!resultReady()) return '<h1>Ca đang diễn ra</h1>'+actions(inboxLink());
    const paid = state.transfer==='paid';
    const verified = state.verifiedDecision;
    const evidenceSaved = state.chatSaved && state.receipt;
    const checked = [];
    if(state.seen.includes('post')) checked.push('Đã mở bài tuyển của CLB có biểu mẫu đăng ký.');
    if(state.seen.includes('comments')) checked.push('Vy đã hỏi về ca chiều trong bình luận công khai. Ai mở bài cũng có thể đọc bình luận này.');
    if(state.seen.includes('receipt')) checked.push('Biên lai ghi nhận 45.000đ đã vào ví Vy.');
    if(state.seen.includes('recruiter')) checked.push('Đã đọc đoạn chat Vy chia sẻ có yêu cầu chuyển 500.000đ.');
    if(state.giangContacted) checked.push('Hương Giang tự nhận chị chốt riêng ca chiều, còn form chỉ nhận đăng ký chung. Danh tính và vai trò thật vẫn chưa được xác minh.');
    if(state.shared.includes('giang')) checked.push('Đã chuyển lời tự nhận của Hương Giang cho Vy.');
    for (const id of state.clubAsked) {
      const {summary} = clubQuestions[id];
      checked.push(summary+(state.shared.includes(id)?' Đã chuyển xác nhận này cho Vy.':''));
    }
    if(state.clubAsked.length && !state.giangContacted) checked.push('Danh tính và vai trò thật của Hương Giang vẫn chưa được xác minh.');
    if(state.linkSent) checked.push('Đã gửi link bài gốc cho Vy. Việc đăng ký chưa được xác nhận.');
    if(state.reported) checked.push('Đã báo cáo tài khoản Hương Giang trong mô phỏng.');
    if(state.bank) checked.push('Đã mở yêu cầu hỗ trợ qua Ví học đường trong mô phỏng.');
    const outcome = paid?'Vy đã chuyển 500.000đ. Khoản tiền chưa được thu hồi.':
      state.transfer==='cancelled'?'Vy đã hủy khoản chuyển 500.000đ.':
      state.transfer==='declined'?'Vy quyết định không chuyển 500.000đ.':'Vy đã tạm dừng và chưa chuyển 500.000đ.';
    const reply = paid?(state.stopped?'Tớ không chuyển thêm nữa.':'Tớ chưa biết xử lý khoản này sao nữa.'):
      verified?(state.linkSent?'Tớ sẽ xem form trong bài gốc.':'May quá, tớ vẫn có thể đăng ký ca chiều.'):
      state.transfer==='cancelled'?'Tớ hủy rồi. Để tớ tìm hiểu thêm.':
      state.transfer==='declined'?'Tớ không chuyển nữa. Để tớ tìm hiểu thêm.':'Ừ, tớ sẽ chờ, chưa chuyển đâu.';
    const lesson = paid?'Khoản trả thử 45k đã khiến lời mời có vẻ đáng tin. Khi họ đòi thêm phí để hoàn tiền, hãy dừng chuyển và giữ bằng chứng.':
      verified?'Khoản 45k đã nhận không chứng minh người nhắn có quyền tuyển. Hộp thư CLB xác nhận cách đăng ký và việc CLB không thu phí giữ chỗ.':
      state.clubAsked.includes('club-fee')?'Dừng lại giúp Vy giữ được tiền. Hộp thư CLB đã xác nhận cách đăng ký và việc không thu phí.':
      state.clubAsked.includes('club-post')?'CLB xác nhận bài tuyển là của họ. Khoản 500k vẫn cần hỏi riêng.':
      'Dừng lại giúp Vy giữ được tiền. Yêu cầu chuyển 500k vẫn cần được kiểm tra với CLB.';
    return '<h1>Tóm tắt ca Vy</h1><div class="outcome">'+e(outcome)+'</div>'+
      (paid?'<ul><li>'+(state.stopped?'Vy đã dừng chuyển thêm.':'Chưa nhắn Vy dừng chuyển thêm.')+'</li><li>'+
        (evidenceSaved?'Đã lưu tin nhắn đòi thêm tiền và biên lai.':state.chatSaved?'Đã lưu tin nhắn đòi thêm tiền. Còn thiếu biên lai.':
          state.receipt?'Đã lưu biên lai. Còn thiếu tin nhắn đòi thêm tiền.':'Chưa lưu tin nhắn đòi thêm tiền và biên lai.')+'</li></ul>':'')+
      bubble('Vy',reply)+'<p>'+e(lesson)+'</p>'+
      '<details><summary>Những việc bạn đã làm</summary><dl class="result">'+
      '<dt>Nhận diện yêu cầu cần kiểm tra</dt><dd>'+
        (verified?'Đã chuyển cho Vy căn cứ về khoản giữ ca.':
          state.transfer==='waiting'?'Đã nhắn Vy khoan chuyển.':refused()?'Đã khuyên Vy từ chối yêu cầu chuyển tiền.':
          state.messages.some(message=>[holdAdvice,rethinkAdvice].includes(message.text))?'Đã nhắn Vy khoan chuyển trước khi gửi lời khuyên rủi ro.':'Đã khuyên Vy tin vào khoản trả thử.')+'</dd>'+
      '<dt>Chọn nguồn độc lập</dt><dd>'+(state.clubAsked.length?'Đã hỏi qua hộp thư trang CLB.':'Chưa hỏi qua hộp thư trang CLB.')+'</dd>'+
      '</dl>'+
      (checked.length?'<ul>'+checked.map(item=>'<li>'+e(item)+'</li>').join('')+'</ul>':'')+'</details>'+
      actions(inboxLink(),paid?go('recover','Về hồ sơ hỗ trợ'):'',go('post','Mở bài gốc'));
  }
  const panels = {
    inbox,post,recruiter,giang,club,
    page:()=>'<h1>Trang CLB</h1>'+publisher(clb,'SM','Trang câu lạc bộ · THPT Sao Mai')+
      '<p>Kênh của CLB Truyền thông, nơi đăng thông tin và lịch hoạt động của trường.</p>'+
      actions(go('club','Mở hộp thư trang CLB','primary'),go('post','Xem bài tuyển'),inboxLink()),
    receipt:()=>'<h1>Biên lai Vy gửi</h1>'+transaction(true)+actions(share('receipt','Gửi biên lai cho Vy'),inboxLink()),
    transfer:()=>'<h1>Giao dịch Vy chia sẻ</h1>'+transaction()+actions(inboxLink()),
    register:()=>'<h1>Biểu mẫu đăng ký · Ngày hội Sao Mai</h1><p>Biểu mẫu mô phỏng do '+e(clb)+' đăng trong bài gốc.</p>'+
      '<article class="idcard"><h3>Thông tin trong biểu mẫu</h3><p>Họ tên, lớp và ca muốn tham gia.</p>'+
      '<ul><li>Ca sáng · 07:30–11:00</li><li>Ca chiều · 13:00–16:30</li></ul><p>Bản xem trước. Vy tự điền khi muốn đăng ký.</p></article>'+
      actions(go('post','Về bài gốc'),inboxLink(),resultReady()?resultLink():''),
    report:()=>'<h1>Báo cáo tài khoản nhắn riêng</h1>'+publisher('Hương Giang','HG','Tài khoản nhắn riêng')+
      (state.reported?'<p class="outcome" role="status">'+reportStatus+'</p>':
        '<p>Lý do: yêu cầu chuyển tiền giữ chỗ qua tin nhắn riêng.</p>'+B('Gửi báo cáo','report','','primary'))+
      actions(go('recruiter','Về cuộc trò chuyện'),inboxLink(),resultReady()?resultLink():''),
    result:summary,
    recover:()=>'<h1>Hồ sơ hỗ trợ</h1>'+
      (state.transfer!=='paid'?'<p>Giao dịch này chưa phát sinh.</p>':
        '<p>Vy đã chuyển 500.000đ. Hương Giang đang đòi thêm phí để hoàn tiền.</p>'+
        actions(B(state.stopped?'✓ Vy đã dừng chuyển thêm':'Nhắn Vy dừng chuyển thêm','stop','','primary',state.stopped?'disabled':''),
          go('bank','Mở hỗ trợ của Ví học đường'))+
        '<details '+(state.receipt?'open':'')+'><summary>Biên lai giao dịch 500.000đ</summary>'+transaction()+
        B(state.receipt?'✓ Đã lưu biên lai':'Lưu biên lai','keep','receipt','',state.receipt?'disabled':'')+'</details>'+
        '<details '+(state.chatSaved?'open':'')+'><summary>Tin nhắn đòi thêm phí</summary>'+
        bubble('Hương Giang','Em chuyển thêm phí thì chị mới hoàn tiền được nha.')+
        B(state.chatSaved?'✓ Đã lưu tin nhắn':'Lưu tin nhắn đòi thêm phí','keep','chatSaved','',state.chatSaved?'disabled':'')+'</details>'+
        actions(state.reported?pill(reportStatus):go('report','Báo cáo tài khoản Hương Giang'),resultLink()))+
      actions(inboxLink()),
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
      state=fresh();resume=false;navigate('inbox');return;
    }
    if(action==='share' && Object.hasOwn(details,id) && !state.shared.includes(id)) {
      if(id==='giang'&&!state.giangContacted) return;
      const {source,quote,text,reply}=details[id];
      state.shared.push(id);
      chat(text,reply,{source,quote});
      save();navigate('inbox');return;
    }
    if(action==='share'&&current()==='club'&&state.clubAsked.includes(id)&&!state.shared.includes(id)) {
      const {answer,reply} = clubQuestions[id];
      state.shared.push(id);
      let vyReply = reply;
      if(id==='club-fee') {
        state.transferPrompt=false;
        if(state.transfer==='paid') {
          vyReply='Vậy khoản tớ chuyển không phải phí của CLB. Cậu giúp tớ xử lý với.';
        } else if(refused()) {
          vyReply='Giờ tớ biết ca chiều đăng ký qua form. Cậu gửi tớ bài gốc với.';
        } else {
          state.transfer='declined';
          state.verifiedDecision=true;
          state.finished=true;
        }
      } else if(feeShared()||!unsettled()) {
        vyReply='Ừ, vậy đúng là bài CLB đăng.';
      }
      chat('Tớ gửi cậu tin CLB trả lời nè.',vyReply,{source:clb,quote:answer});
      save();navigate('inbox');return;
    }
    if(action==='pause'&&current()==='inbox'&&state.transfer==='pending'&&!state.transferPrompt) {
      state.transfer='waiting';
      chat(holdAdvice,'Ừ, tớ chờ. Mà nếu chị ấy nói thật thì tớ đăng ký ca chiều ở đâu?');
    } else if(action==='ask-giang'&&current()==='giang'&&!state.giangContacted) state.giangContacted=true;
    else if(action==='ask-club'&&current()==='club'&&Object.hasOwn(clubQuestions,id)&&!state.clubAsked.includes(id)) {
      state.clubAsked.push(id);
    }
    else if(action==='cancel'&&current()==='inbox'&&unsettled()&&!state.transferPrompt) {
      chat(refusalAdvice,'Ừ, tớ quyết định không chuyển.');
      state.transfer='declined';
      state.finished=true;
    } else if(action==='send-registration-link'&&current()==='inbox'&&refused()&&feeShared()&&!state.linkSent) {
      state.messages.push({name:'Bạn · Đã gửi',text:'Đây, đường dẫn bài gốc của CLB nè.',sent:true,postLink:true},
        {name:'Vy',text:'Để tớ xem form nha.'});
      state.linkSent=true;
    } else if(action==='finish-wait'&&current()==='inbox'&&state.transfer==='waiting'&&!state.finished&&!state.transferPrompt) {
      state.finished=true;save();navigate('result');return;
    } else if(action==='risk'&&current()==='inbox'&&canSuggestTransfer()) {
      state.transferPrompt=true;
      chat(riskAdvice,transferQuestion);
    } else if(action==='rethink'&&current()==='inbox'&&state.transferPrompt&&unsettled()) {
      state.transferPrompt=false;
      state.transfer='waiting';
      chat(rethinkAdvice,'Ừ, tớ chưa chuyển. Cậu xem lại giúp tớ nha.');
    } else if(action==='proceed'&&current()==='inbox'&&state.transferPrompt&&unsettled()&&!feeShared()) {
      state.transferPrompt=false;
      chat(proceedAdvice,'Ừ, tớ chuyển để giữ ca.');

      state.messages.push({name:'Vy',text:'Tớ vừa chuyển 500k rồi.'},
        {name:'Vy',text:'Ơ, chị ấy lại bảo chuyển thêm phí thì mới hoàn tiền.'});
      state.transfer='paid';
    } else if(action==='report'&&current()==='report'&&!state.reported) state.reported=true;
    else if(action==='stop'&&current()==='recover'&&state.transfer==='paid'&&!state.stopped) {
      chat('Cậu đừng chuyển thêm nha','Ừ, tớ dừng ở đây. Tớ không chuyển thêm nữa.');
      state.stopped=true;
      save();navigate('inbox');return;
    } else if(action==='bank'&&current()==='bank'&&state.transfer==='paid'&&!state.bank) state.bank=true;
    else if(action==='keep'&&current()==='recover'&&state.transfer==='paid'&&['receipt','chatSaved'].includes(id)&&!state[id]) {
      state[id]=true;notice='Đã lưu vào hồ sơ hỗ trợ.';
    } else return;
    render();
    const feedback={pause:'.chat-thread .bubble:last-child',cancel:'.chat-thread .bubble:last-child',risk:'.chat-thread [data-action="rethink"]',
      rethink:'.chat-thread .bubble:last-child',proceed:'.chat-thread .bubble:last-child',
      'send-registration-link':'.chat-thread .bubble:last-child',
      'ask-giang':'.source-chat .bubble:last-of-type','ask-club':'.source-chat .bubble:last-of-type',report:'.outcome',bank:'.bank .actions'};
    focusLatest(feedback[action] || (notice?'.notice':'.surface h1'));
  }
  host.addEventListener('click',event=>{
    const button=event.target.closest('button[data-action]');
    if(button) act(button.dataset.action,button.dataset.id);
  });
  addEventListener('hashchange',()=>{
    notice='';render();window.scrollTo(0,0);
    focusLatest(current()==='inbox'&&state.messages.length?'.chat-thread .bubble:last-child':'.surface h1');
  });
  const savedView = saved?.view==='confirm'?'transfer':saved?.view;
  if (savedView && !location.hash && Object.hasOwn(panels,savedView) && savedView!=='inbox') {
    history.replaceState(null,'','#'+savedView);
  }
  render();
})();
