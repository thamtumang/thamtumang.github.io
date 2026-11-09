(() => {
  'use strict';
  const host = document.getElementById('app');
  // The desktop owns guest progress across window close/reopen. The legacy
  // browser-wide save has no account owner, so it is deliberately ignored.
  const storage = window.frameElement?.caTrucStorage;
  const qa = new URLSearchParams(location.search).has('kiem-thu');
  const blank = () => ({transfer:'pending',post:'',chat:'',receiptPick:false,transferPick:false,independent:false,asked:false,reported:'',basis:'',messages:[],finished:false,history:'',stopped:false,bank:false,code:false,receipt:false,chatSaved:false,prepared:false});
  const saved = storage?.load();
  let state = {...blank(), ...saved};
  let offerResume = Boolean(storage?.canResume && saved);
  const views = ['inbox','post','page','compare','receipt','transfer','recruiter','intro','search','school','club','report','confirm','result','recover','bank','call','qa'];
  const current = () => {
    const name = location.hash.slice(1);
    return views.includes(name) && (name!=='qa' || qa) ? name : 'inbox';
  };
  let notice = '';
  let search = '';
  let wantsTransfer = false;
  let compareHelp = true;
  let chatOpen = state.transfer==='cancelled';
  const clubReply = 'CLB mình không đăng bài này và không tổ chức nhiệm vụ đó.';
  const reportStatus = 'Đã gửi báo cáo · Chờ xem xét';
  const openingRequest = 'Cậu xem giúp tớ bài tuyển này với.';
  const openingMessage = 'Họ trả tớ 45k rồi. Giờ họ đòi nạp 500k để làm tiếp. Tớ nhập số tiền rồi, chưa bấm chuyển.';
  const draftChoices = {};
  const cancelAdvice = 'Tớ nghĩ cậu nên hủy khoản chuyển này.';
  const pauseReply = 'Ừ, tớ chưa bấm chuyển. Cậu xem giúp tớ bài tuyển nha.';
  const pairReply = 'À, bài đăng bảo không cần ứng tiền mà giờ lại đòi nạp 500k. Thôi, tớ hủy đây.';
  for (const message of state.messages) {
    if (message.who!=='vy') continue;
    if (message.text==='Ừ, tớ chờ') message.text=pauseReply;
    if (message.text==='Bài đăng bảo không ứng tiền mà giờ lại đòi nạp trước. Ừ, tớ hủy khoản này.') message.text=pairReply;
  }
  const e = x => String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const B = (label, action, id='', cls='', extra='') => '<button type="button" class="'+cls+'" data-action="'+action+'" data-id="'+id+'" '+extra+'>'+e(label)+'</button>';
  const go = (name,label,cls='') => '<a class="button '+cls+'" href="#'+name+'">'+e(label)+'</a>';
  const pill = label => '<span class="pill">'+e(label)+'</span>';
  const status = () => ({pending:'Chờ xác nhận',waiting:'Đang chờ',cancelled:'Đã hủy',paid:'Đã chuyển'})[state.transfer];
  const unsettled = () => state.transfer==='pending'||state.transfer==='waiting';
  const hasResult = () => state.transfer==='cancelled'||state.finished||state.prepared;
  const art = () => state.transfer==='pending'?'lo-lang':unsettled()||state.transfer==='paid'&&!state.prepared?'dang-nghe':'nhe-nhom';
  function save() {
    const serialized = JSON.stringify(state);
    storage?.save(serialized===JSON.stringify(blank()) ? null : JSON.parse(serialized));
  }
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
  function resultActions(includeReport = false) {
    return '<div class="actions case-end">'+go('result','Xem kết quả ca','primary')+
      (includeReport&&!state.reported?go('post','Mở bài để báo cáo'):'')+'</div>';
  }
  function verificationResult() {
    const verified = [];
    if (state.independent) verified.push('CLB Truyền thông qua trang THPT Sao Mai: CLB không đăng bài và không tổ chức nhiệm vụ này.');
    if (state.basis==='pair') verified.push('Bài tuyển và đoạn chat người tuyển: bài ghi không cần ứng tiền, nhưng người tuyển yêu cầu nạp 500.000đ.');
    return verified.length ? verified.join(' ') : 'Chưa xác minh đủ về bài tuyển.';
  }
  function searchResult(view, title, source) {
    return '<a class="button search-result" href="#'+view+'"><b>'+e(title)+'</b><small>'+e(source)+'</small></a>';
  }
  function lastEvidence(...sources) {
    const index = state.messages.findLastIndex(message =>
      message.who==='player' && message.quotes?.length===sources.length &&
      sources.every((source,i)=>message.quotes[i][0]===source));
    if(index<0) return null;
    return {...state.messages[index], reply:state.messages[index+1]?.text};
  }
  function postReply() {
    return state.post==='advance'
      ? 'Ủa, bài đăng ghi không cần ứng tiền hả? Cậu xem lại đoạn chị ấy nhắn tớ với.'
      : 'Ừ, tớ thấy đoạn đó. Mà nó có nói gì về khoản phải nạp không?';
  }
  function draftMessages(id) {
    const first = {
      post:state.post==='advance'?'Tớ thấy bài này ghi không cần ứng tiền.':'Tớ gửi cậu đoạn này xem thử.',
      receipt:'Đây là khoản 45k cậu nhận đúng không?',
      pair:'Cậu xem hai đoạn này cạnh nhau thử nha.',
      transfer:'Tớ đang xem khoản 500k cậu định chuyển.',
      chat:'Tớ để ý đoạn người tuyển nhắn cậu.',
      club:'Tớ hỏi CLB qua trang trường rồi.'
    };
    return id==='pair'?[first.pair,cancelAdvice]:[first[id],'Cậu xem giúp tớ chi tiết này nha.'];
  }
  function draftText(id) {
    return draftMessages(id)[draftChoices[id] ?? 0];
  }
  function quoteCards(quotes) {
    return '<div class="sent-quotes">'+quotes.map(([source,quote])=>
      '<blockquote><small>'+e(source)+'</small>'+e(quote)+'</blockquote>').join('')+'</div>';
  }
  function sentBubble(message, extra='') {
    return '<div class="bubble sent'+extra+'"><span class="speaker">'+(message.quotes?'Bạn · Đã gửi':'Bạn')+'</span>'+e(message.text)+
      (message.quotes?quoteCards(message.quotes):'')+'</div>';
  }
  function composer(id, quotes, extra='') {
    return '<div class="vy-compose"><small>Sắp gửi cho Vy</small><label>Câu nhắn<select data-draft="'+id+'">'+
      draftMessages(id).map((line,i)=>'<option value="'+i+'" '+(i===(draftChoices[id]??0)?'selected':'')+'>'+e(line)+'</option>').join('')+
      '</select></label>'+quoteCards(quotes)+extra+'</div>';
  }
  function postMessageState() {
    const sent=lastEvidence('Bài tuyển');
    const quote=selected('post');
    const draft=unsettled() && quote && quote!==sent?.quotes[0][1];
    return {sent,quote,draft,showSent:unsettled() && sent && !draft};
  }
  function compareLink() {
    return go('compare','So với tin nhắn người tuyển','primary');
  }
  function vyDock({sent,quote,draft,showSent}) {
    const latest = state.stopped ? 'Tớ dừng nạp thêm rồi.' : state.transfer==='paid'
      ? 'Tớ chuyển rồi. Họ lại đòi nạp thêm để hoàn tiền.'
      : state.messages.findLast(message=>message.who==='vy')?.text || openingMessage;
    return '<aside class="vy-dock'+(chatOpen?' expanded':'')+(showSent||draft?' vy-active':'')+'" aria-label="Chat với Vy">'+
      '<div class="vy-head"><span class="vy-avatar '+art()+'" aria-hidden="true"></span><div><b>Thảo Vy</b><small>500.000đ · '+e(status())+'</small></div>'+
      (showSent||draft?'':B(chatOpen?'Thu gọn':'Mở chat','toggle-vy','','vy-toggle','aria-controls="vy-chat" aria-expanded="'+chatOpen+'"'))+'</div>'+
      '<div class="vy-content" id="vy-chat">'+(showSent?sentBubble(sent):'')+
      '<div class="case-reply"><p class="vy-reply">'+e(showSent?sent.reply:latest)+'</p>'+(showSent?compareLink():'')+'</div>'+
      (draft?composer('post',[['Bài tuyển',quote]],B('Bỏ chọn','pick','post-'+state.post,'draft-remove','aria-label="Bỏ chọn đoạn từ bài tuyển"')):'')+'</div>'+
      (state.transfer==='cancelled'?resultActions(true):draft?sendBar('Gửi Vy','post'):'')+'</aside>';
  }
  function recruitment() {
    const thread=postMessageState();
    const postActions = '<div class="actions">'+(thread.showSent?'':go('compare','Đặt cạnh đoạn chat','primary'))+
      (state.reported?pill(reportStatus):go('report','Báo cáo bài viết'))+go('inbox','Về hộp thư')+'</div>';
    return '<h1>Bài tuyển</h1><p>Chọn đoạn muốn gửi Vy.</p><div class="evidence-layout"><div class="evidence-sources">'+
      postCard()+postActions+'</div>'+vyDock(thread)+'</div>';
  }
  function comparison() {
    const post = selected('post'), chat = selected('chat');
    const count = Number(Boolean(post)) + Number(Boolean(chat));
    const missing = post ? 'Còn thiếu đoạn từ tin nhắn người tuyển.' : 'Còn thiếu đoạn từ bài tuyển.';
    const sent = lastEvidence('Bài tuyển','Đoạn chat');
    const alreadySent = sent && sent.quotes[0][1]===post && sent.quotes[1][1]===chat && sent.text===draftText('pair');
    const composing = unsettled() && count===2;
    const reply = state.transfer==='cancelled'
      ? state.messages.findLast(message=>message.who==='vy')?.text
      : sent?.reply;
    return '<h1>Đối chiếu hai nguồn</h1><div class="compare-help">'+
      (compareHelp?'<p id="compare-instructions">Bài tuyển và tin nhắn nói gì về khoản nạp trước? Chọn một đoạn ở mỗi bên để gửi Vy.</p>':'')+
      B(compareHelp?'Ẩn chỉ dẫn':'Xem chỉ dẫn','compare-help','','','aria-expanded="'+compareHelp+'"')+'</div>'+
      '<div class="comparison evidence-sources">'+postCard()+chatCard()+'</div>'+
      '<aside class="compare-send'+(composing||sent?' compare-expanded':'')+'" aria-label="Gửi đoạn đối chiếu cho Vy">'+
      '<div class="compare-send-head"><div><strong>Đã chọn '+count+'/2 đoạn</strong>'+
      (unsettled()&&count===1?'<small>'+missing+'</small>':'')+'</div></div>'+
      (sent?sentBubble(sent):'')+
      (reply?'<p class="vy-reply"><strong>Vy</strong> · '+e(reply)+'</p>':'')+
      '<small class="compare-status">500.000đ · '+e(status())+'</small>'+
      (composing?composer('pair',[['Bài tuyển',post],['Đoạn chat',chat]])+sendBar('Gửi Vy','pair',!alreadySent):'')+
      (unsettled()&&alreadySent?'<small>Đã gửi tin này. Đổi câu nhắn hoặc đoạn trích để gửi tiếp.</small>':'')+
      (state.transfer==='cancelled'?resultActions(true):'')+'</aside>'+
      '<div class="actions">'+go('post','Bài gốc')+go('recruiter','Đoạn chat')+go('inbox','Về hộp thư')+'</div>';
  }
  function selected(group) {
    return choices[group].find(([id])=>id===state[group])?.[1];
  }
  function sendBar(label, id, enabled=true) {
    return unsettled()?B(label,'send',id,'primary',enabled?'':'disabled'):'';
  }
  function advice() {
    if (state.transfer==='cancelled') return '';
    if (!unsettled()) {
      const needsHelp = state.transfer==='paid'&&!state.prepared;
      return '<div class="actions">'+go(needsHelp?'recover':'result',needsHelp?'Xử lý sau khi chuyển':'Xem kết quả','primary')+'</div>';
    }
    return '<div class="actions inbox-actions">'+
      (state.transfer==='waiting'?B('Kết thúc ca — chưa chuyển','finish-wait','','quiet'):'')+'</div>';
  }
  function attachment(view, label, caption, symbol, type) {
    return '<a class="attachment '+type+'" href="#'+view+'"><span class="attachment-icon" aria-hidden="true">'+symbol+
      '</span><span><strong>'+e(label)+'</strong><small>'+e(caption)+'</small></span><span class="attachment-open" aria-hidden="true">›</span></a>';
  }
  function inbox() {
    const justPaused = state.transfer==='waiting'&&!state.finished&&state.messages.at(-1)?.text===pauseReply;
    const chat = state.messages.map((message,index)=>{
      const latest = index===state.messages.length-1?' latest':'';
      if(message.who==='vy') {
        const bubble = '<p class="bubble'+latest+'"><span class="speaker">Vy</span>'+e(message.text)+'</p>';
        if(latest&&justPaused) return '<div class="case-reply">'+bubble+'<div class="actions">'+go('post','Mở bài tuyển','primary')+'</div></div>';
        if(latest&&unsettled()&&state.messages[index-1]?.quotes?.[0]?.[0]==='Bài tuyển'&&state.messages[index-1].quotes.length===1) {
          return '<div class="case-reply">'+bubble+compareLink()+'</div>';
        }
        return latest&&state.transfer==='cancelled'?'<div class="case-reply">'+bubble+resultActions(true)+'</div>':bubble;
      }
      return sentBubble(message,latest);
    }).join('');
    return '<div class="inbox-layout"><aside class="portrait">'+portrait()+
      '<div class="actions">'+go('call','Gọi Vy')+'</div></aside>'+
      '<section class="conversation"><h1 class="case-task">Tin nhắn từ Vy</h1>'+
      (state.transfer==='pending'?'<p class="case-task">Vy sắp chuyển 500.000đ. Hãy giúp Vy kiểm tra trước khi quyết định.</p>':'')+
      '<div class="opening-message"><div class="contact-title"><b>Thảo Vy</b>'+pill('500.000đ · '+status())+'</div>'+
      '<p class="bubble">'+e(openingRequest)+'</p><p class="bubble">'+e(openingMessage)+'</p>'+
      '<div class="inbox-quick">'+(state.transfer==='pending'?B('Bảo Vy khoan chuyển','pause','','primary'):'')+'</div>'+
      '<div class="attachments">'+attachment('post','Mở bài tuyển Vy gửi','Việc làm thêm Sao Mai','<img src="assets/bai-tuyen.jpg" alt="">','shared-post')+'</div></div>'+
      '<div class="chat-thread" aria-label="Tin nhắn mới">'+chat+
      (state.transfer==='paid'?'<p class="bubble"><span class="speaker">Vy</span>Tớ chuyển rồi. Họ lại đòi nạp thêm để hoàn tiền.</p>':'')+
      (state.stopped?'<p class="bubble"><span class="speaker">Vy</span>Tớ dừng nạp thêm rồi.</p>':'')+'</div>'+
      (state.transfer==='paid'?advice()+go('transfer','Xem giao dịch 500.000đ'):'')+
      (state.transfer==='waiting'&&!justPaused?'<div class="inbox-quick">'+go('post','Mở bài tuyển','primary')+'</div>':'')+
      '<section class="vy-shared"><h2>Vy đã gửi</h2><div class="attachments">'+
      attachment('receipt','Biên lai +45.000đ','Đã nhận','↙','incoming')+
      attachment('recruiter','Đoạn chat người tuyển','Tin nhắn','↗','recruiter-link')+'</div></section>'+
      (state.transfer==='paid'?'':go('transfer','Xem giao dịch 500.000đ')+advice())+'</section></div>';
  }
  function message(who,text,quotes) {
    state.messages.push({who,text,quotes});
  }
  function sendToVy(id) {
    const post = selected('post'), chat = selected('chat');
    const options = {
      post:post&&[['Bài tuyển',post]],
      chat:chat&&[['Đoạn chat',chat]],
      pair:post&&chat&&[['Bài tuyển',post],['Đoạn chat',chat]],
      receipt:state.receiptPick&&[['Biên lai','+45.000đ · Đã nhận']],
      transfer:state.transferPick&&[['Giao dịch','500.000đ · '+status()]],
      club:state.independent&&[['Phản hồi từ CLB',clubReply]]
    };
    const quotes = options[id];
    if(!quotes||!unsettled())return;
    if(id==='post'||id==='pair') {
      const sent = lastEvidence(...quotes.map(([source])=>source));
      if(sent && quotes.every(([,quote],i)=>sent.quotes[i][1]===quote) && (id==='post'||sent.text===draftText(id)))return;
    }
    message('player',draftText(id),quotes);
    if(id==='pair'&&draftText(id)===cancelAdvice&&state.post==='advance'&&state.chat==='deposit') {
      state.transfer='cancelled';state.basis='pair';
      message('vy',pairReply);
    } else if(id==='club') {
      state.transfer='cancelled';state.basis='club';
      message('vy','CLB không đăng bài đó à? Ừ, tớ hủy khoản này.');
    } else {
      state.transfer='waiting';
      message('vy',id==='post'?postReply():id==='receipt'?'Ừ, 45k thì tớ nhận rồi. Mà 500k có nên chuyển không?':
        id==='pair'?(state.post==='advance'&&state.chat==='deposit'
          ? 'Ừ, hai chỗ nói khác nhau thật. Vậy cậu nghĩ tớ nên làm gì?'
          : 'Tớ vẫn chưa rõ vì sao họ bắt nạp 500k. Tớ cứ chờ nhé.'):
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
      reply?.scrollIntoView({block:'nearest'});
      return;
    }
    navigate('inbox');
  }
  function receiptPanel() {
    const draft=unsettled() && state.receiptPick;
    return '<h1>Biên lai Vy gửi</h1>'+transaction(true,true)+
      (draft?composer('receipt',[['Biên lai','+45.000đ · Đã nhận']]):'')+
      '<div class="actions">'+(draft?sendBar('Gửi Vy','receipt'):'')+go('inbox','Về hộp thư','primary')+'</div>';
  }
  const panels = {
    inbox,
    post:()=>recruitment(),
    page:()=>'<div class="cover"></div>'+publisher()+'<h1>Việc làm thêm Sao Mai</h1><p>Trang giới thiệu việc cộng tác online. Trang tự giới thiệu có liên hệ với CLB Truyền thông Sao Mai.</p><small>Thông tin do trang tự khai.</small><div class="actions">'+go('post','Mở bài tuyển gốc')+go('recruiter','Hỏi người tuyển')+go('search','Tìm trên ViệtBook')+go('inbox','Về hộp thư','primary')+'</div>',
    compare:comparison,
    receipt:receiptPanel,
    transfer:()=>'<h1>Ảnh giao dịch Vy gửi</h1>'+transaction(false,true)+'<div class="actions">'+sendBar('Gửi chi tiết giao dịch cho Vy','transfer',state.transferPick)+(unsettled()?B('Khuyên Vy chuyển','choose-transfer','','quiet'):'')+go('inbox','Về hộp thư','primary')+'</div>',
    recruiter:()=>'<h1>Hộp thư · Hương Giang</h1>'+chatCard()+'<div class="actions">'+sendBar('Gửi đoạn đã chọn cho Vy','chat',Boolean(selected('chat')))+(state.asked?go('intro','Mở ảnh tự giới thiệu'):B('Hỏi chị có liên hệ với CLB không','ask'))+go('compare','Đặt cạnh bài tuyển')+go('inbox','Về hộp thư','primary')+'</div>',
    intro:()=>'<h1>Ảnh người tuyển gửi</h1><article class="idcard">'+publisher('Hương Giang')+'<h3>CTV · CLB Truyền thông Sao Mai</h3><p>Ảnh giới thiệu do Hương Giang gửi trong hội thoại.</p></article><div class="actions">'+go('recruiter','Về hội thoại')+go('search','Tìm trang trường')+go('inbox','Về hộp thư','primary')+'</div>',
    search:()=>'<h1>Tìm trên ViệtBook</h1><form id="search"><label for="query">Tìm trang hoặc tên trường</label><div class="searchrow"><input id="query" name="query" type="search" value="'+e(search)+'" placeholder="Ví dụ: Sao Mai"><button class="primary">Tìm</button></div></form>'+
      (!search?'<p>Nhập tên hoặc từ khóa để xem các trang.</p>':/sao|mai|clb|trường|truong|thpt|việc|viec/i.test(search)?
        '<div class="results">'+searchResult('page','Việc làm thêm Sao Mai','Trang tuyển dụng · Liên hệ CLB do trang tự khai')+searchResult('school','THPT Sao Mai','Trang nhà trường · Danh bạ câu lạc bộ')+'</div>':'<p>Chưa tìm thấy trang phù hợp. Thử tên trường hoặc tên CLB.</p>')+go('inbox','Về hộp thư','primary'),
    school:()=>'<div class="cover school-cover"></div>'+publisher('THPT Sao Mai',true)+'<h1>THPT Sao Mai</h1><p>Trang nhà trường trong ViệtBook. Xem danh bạ các câu lạc bộ.</p><div class="actions">'+go('club','Liên hệ · CLB Truyền thông')+go('search','Về tìm kiếm')+go('inbox','Về hộp thư','primary')+'</div>',
    club:()=>'<h1>Liên hệ CLB Truyền thông</h1>'+publisher('Đầu mối từ trang THPT Sao Mai',true)+
      '<article class="idcard club-post"><small>Bài gốc · Việc làm thêm Sao Mai</small><h3>Tuyển CTV tương tác online</h3>'+
      '<a href="#post">Xem bài gốc</a></article>'+
      (state.independent?'<p class="bubble latest" role="status">'+e(clubReply)+'</p>'+sendBar('Chuyển cho Vy','club'):
      B('Hỏi CLB về bài này','verify','','primary'))+'<div class="actions">'+go('school','Về trang trường')+go('inbox','Về hộp thư','primary')+'</div>',
    report:()=>'<h1>Báo cáo bài viết</h1>'+(state.reported?'<p class="report-confirmation" role="status" tabindex="-1">'+pill(reportStatus)+'</p>':
      '<form id="report"><fieldset><legend>Lý do báo cáo</legend><label><input type="radio" name="reason" value="fraud" required> Nghi ngờ lừa đảo hoặc yêu cầu nạp tiền</label><label><input type="radio" name="reason" value="irrelevant" required> Không liên quan đến tôi</label><label><input type="radio" name="reason" value="violence" required> Nội dung bạo lực</label></fieldset><button class="primary">Gửi báo cáo</button></form>')+
      (hasResult()?resultActions():'')+'<div class="actions">'+go('post','Về bài gốc')+go('inbox','Về hộp thư')+'</div>',
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
    result:()=>'<h1>Tóm tắt ca Vy</h1>'+portrait()+'<dl class="result"><dt>Vy đã làm gì?</dt><dd>'+e(state.transfer==='cancelled'?'Vy đã hủy giao dịch 500.000đ':state.finished&&unsettled()?'Chưa chuyển':status())+
      (state.prepared?' · Đã dừng nạp thêm và chuẩn bị hồ sơ (mã MP-500-042, ảnh biên lai và đoạn chat). Khoản tiền đang chờ xử lý.':'')+
      '</dd><dt>'+ (state.basis==='pair'?'Vì sao Vy hủy?':state.basis==='club'?'CLB xác nhận gì?':'Nguồn xác minh') +'</dt><dd>'+e(verificationResult())+'</dd><dt>Bài đăng</dt><dd>'+
      (state.reported?reportStatus:'Chưa báo cáo')+'</dd></dl>'+
      '<div class="actions">'+go('inbox',unsettled()?'Quay lại điều tra':'Về hộp thư','primary')+go('post','Mở bài gốc')+'</div>',
    qa:()=>'<h1>Điều phối kiểm thử</h1><p>Các nút sau chỉ đặt lại dữ liệu bản thử trên trình duyệt này.</p><div class="actions">'+B('Mở lượt sạch','seed','clean')+B('Mở thẳng nhánh đã chuyển','seed','paid')+'</div>'
  };
  function savedCase() {
    const summary = {
      pending: 'Vy chưa chuyển 500.000đ. Tiếp tục kiểm tra trước khi quyết định.',
      waiting: 'Vy đang chờ và chưa chuyển 500.000đ.',
      cancelled: 'Vy đã hủy giao dịch 500.000đ.',
      paid: state.prepared ? 'Vy đã chuyển 500.000đ. Hồ sơ hỗ trợ đã được chuẩn bị.' :
        'Vy đã chuyển 500.000đ. Tiếp tục để xử lý yêu cầu nạp thêm.'
    };
    return '<h1>Ca của Vy có tiến trình đã lưu</h1><p>'+e(summary[state.transfer])+'</p>'+
      '<div class="actions">'+B('Tiếp tục ca','resume','','primary')+B('Chơi lại từ đầu','reset')+'</div>';
  }
  function revealLatestInbox() {
    const latest = host.querySelector('.chat-thread .bubble:last-child, .chat-thread .case-reply:last-child');
    if (!latest) return;
    const followUp = state.transfer==='paid' ? host.querySelector('a[href="#recover"]') : null;
    (followUp || latest).scrollIntoView({block:'nearest'});
  }
  function render() {
    const view=current();
    host.innerHTML='<header class="top"><a class="brand" href="#inbox">ViệtBook <small>Ca trực an toàn số</small></a><nav>'+
      (offerResume?'':go('inbox','▤ Hộp thư',view==='inbox'?'active':'')+go('search','⌕ Tìm kiếm',view==='search'?'active':'')+
      (qa?go('qa','Kiểm thử'):'')+B('Chơi lại','reset','','reset'))+'</nav></header>'+
      '<div class="shell"><div class="case-label">BẢN THỬ · CA 01 <strong>Ca của Vy</strong></div>'+
      '<section class="surface '+view+'" aria-label="Nội dung ca">'+
      '<div class="notice" role="status">'+e(notice)+'</div>'+(offerResume?savedCase():panels[view]())+'</section>'+
      '<footer>ViệtBook là mạng xã hội giả lập. Nhân vật và giao dịch đều là mô phỏng.</footer></div>';
  }
  function act(action,id) {
    notice='';
    if(offerResume && action!=='resume' && action!=='reset') return;
    if(action==='resume'&&offerResume) {
      offerResume=false;
      const alreadyInbox = current()==='inbox';
      navigate('inbox');
      if(alreadyInbox) {
        const latest = host.querySelector('.chat-thread .bubble:last-child, .chat-thread .case-reply:last-child, .case-task');
        latest?.setAttribute('tabindex','-1');
        latest?.focus({preventScroll:true});
        revealLatestInbox();
      }
      return;
    }
    if (action==='pause'&&state.transfer==='pending') {
      state.transfer='waiting'; message('player','Khoan chuyển.'); message('vy',pauseReply);
    } else if(action==='pick') {
      const [group,value]=id.split('-');
      if(choices[group]?.some(([key])=>key===value)) {
        state[group]=state[group]===value?'':value;
        delete draftChoices[group];
        delete draftChoices.pair;
        if(state[group]&&['post','compare'].includes(current())) chatOpen=true;
      }
    } else if(action==='compare-help') {
      compareHelp=!compareHelp;
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
      if(!window.confirm(offerResume?'Chơi lại từ đầu? Tiến trình ca này sẽ được đặt lại.':'Đặt lại lượt chơi bản thử này?'))return;
      offerResume=false;state=blank();
      for (const key of Object.keys(draftChoices)) delete draftChoices[key];
      if(id==='paid')state.transfer='paid';
      search='';chatOpen=false;compareHelp=true;save();navigate(id==='paid'?'recover':'inbox');return;
    }
    save();render();
    const same=[...host.querySelectorAll('[data-action]')].find(b=>b.dataset.action===action&&b.dataset.id===id);
    if(same&&!same.disabled)same.focus({preventScroll:true});
    else if(action==='pick') host.querySelector('.vy-toggle')?.focus({preventScroll:true});
    else if(action==='pause'&&current()==='inbox') host.querySelector('.conversation a[href="#post"]')?.focus({preventScroll:true});
  }
  host.addEventListener('click',ev=>{
    const button=ev.target.closest('button[data-action]');
    if(button)act(button.dataset.action,button.dataset.id);
  });
  host.addEventListener('change',ev=>{
    const id=ev.target.dataset.draft;
    if(!id)return;
    draftChoices[id]=Number(ev.target.value);
    if(id==='pair') {
      render();
      host.querySelector('[data-draft="pair"]')?.focus({preventScroll:true});
    }
  });
  host.addEventListener('submit',ev=>{
    ev.preventDefault();
    if(ev.target.id==='search') {
      search=new FormData(ev.target).get('query').trim();render();document.getElementById('query')?.focus();
    }
    if(ev.target.id==='report'&&!state.reported) {
      const reason=new FormData(ev.target).get('reason');
      if(reason==='fraud'){
        state.reported=reason;notice='';save();render();
        host.querySelector('.report-confirmation')?.focus();
      }
      else {notice='Lý do này chưa phản ánh yêu cầu nạp tiền. Xem lại bài trước khi báo cáo.';render();}
    }
  });
  addEventListener('hashchange',()=>{
    if(current()!=='confirm') wantsTransfer=false;
    notice='';render();window.scrollTo(0,0);
    const heading=host.querySelector('h1');
    heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});
    if(!offerResume&&current()==='inbox'&&(state.messages.length||state.transfer==='paid')) revealLatestInbox();
  });
  render();
})();
