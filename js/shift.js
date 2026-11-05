/* Ca trực an toàn số. Bộ trạng thái thuần dùng chung cho giao diện và kiểm thử. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ShiftGame = api;
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const CASES = {
    vy: {
      title: '45 nghìn đầu tiên', person: 'Thảo Vy', sub: 'Lớp 11A4 · Bạn cùng trường',
      hook: 'Vy đã nhận tiền thật từ một việc làm online. Giờ bạn ấy đang cân nhắc nạp tiền để làm nhiệm vụ tiếp theo.',
      opening: ['Cậu xem giúp tớ với. Tớ like video với đánh giá shop, làm 3 lượt được chuyển 45k thật rồi.', 'Giờ chị quản lý bảo nạp 500k, xong nhiệm vụ nhận lại 650k. Tớ đang mở app ngân hàng. Có nên làm tiếp không?'],
      ad: { title: 'Bài tuyển cộng tác viên', source: 'Bài đăng trong nhóm Việc làm thêm Sao Mai', text: 'CTV tương tác online. 15.000đ/lượt. Không cần kinh nghiệm, chỉ cần điện thoại. Hoàn thành nhiệm vụ là nhận tiền. Không phải ứng tiền hoặc mua hàng để nhận việc. Liên hệ Hương Giang qua tin nhắn riêng.', image: 'img/posts/recruitment-ad.svg' },
      task: { title: 'Hướng dẫn nhiệm vụ số 4', source: 'Ảnh trao đổi Vy gửi', text: 'Để nhận nhiệm vụ VIP: chuyển trước 500.000đ vào tài khoản cá nhân LE THI H. Sau khi hoàn thành sẽ nhận 650.000đ. Xác nhận trong 15 phút. Không thực hiện thì chưa được nhận nhiệm vụ tiếp theo.' },
      receipt: { title: 'Khoản 45.000đ đã nhận', source: 'Lịch sử giao dịch do Vy cung cấp', text: 'Giao dịch nhận +45.000đ · Nội dung: Thanh toan nhiem vu 1-3 · Người chuyển: tài khoản cá nhân LE THI H. Khoản tiền đã vào tài khoản. Giao dịch này không cung cấp thông tin pháp nhân của bên tuyển dụng.' },
      claim: { title: 'Lời giới thiệu của người tuyển', source: 'Tin nhắn Hương Giang gửi Vy', text: 'Bên chị liên kết với tổ hỗ trợ việc làm của trường THPT Sao Mai. Nhiều bạn trường em đang làm. Cần gì nhắn chị, đừng hỏi ngoài nhóm vì mỗi nơi một quy trình.' },
      school: { title: 'Phản hồi từ kênh nhà trường', source: 'Liên hệ theo danh bạ nhà trường đã lưu trước đó', text: 'Tổ tư vấn học sinh xác nhận: trường không liên kết với tài khoản Hương Giang hay chương trình CTV tương tác này. Những hoạt động do trường phối hợp được đăng trong mục Hoạt động học sinh và xác nhận qua giáo viên phụ trách.' },
      profile: { title: 'Lịch sử tài khoản Hương Giang', source: 'Thông tin tài khoản trong hồ sơ mô phỏng', text: 'Tạo năm 2018 · Có ảnh sinh hoạt và bạn bè · Tên hiển thị đổi từ “Giang Nguyễn” sang “Hương Giang Tuyển Dụng” tuần trước. Lịch sử này chưa xác minh ai đang điều khiển tài khoản.' },
      followup: 'Chị quản lý nhắn: “Suất VIP sắp hết. Em đã nhận lương rồi thì còn lo gì? Nạp xong chị xử lý ngay.”',
      legitimate: false,
      sources: [
        ['Cảnh sát QLHC: tuyển CTV online “việc nhẹ, lương cao”', 'https://www.canhsatquanlyhanhchinh.gov.vn/phong-chong-toi-pham/canh-giac-thu-doan-lua-dao-tuyen-cong-tac-vien-lam-online-viec-nhe-luong-cao-2681'],
        ['Công an TP.HCM: bẫy “xem video cũng có tiền”', 'https://congan.com.vn/vu-an/canh-giac/cam-bay-xem-video-cung-co-tien-nhieu-phu-nu-bi-lua-tien-ty_160420.html']
      ]
    },
    event: {
      title: 'Một lời mời khác', person: 'Minh Anh', sub: 'Lớp 11A2 · Thành viên CLB truyền thông',
      hook: 'Minh Anh nhận lời mời hỗ trợ ngày hội của trường. Bài đăng không có dấu xác minh; liệu nên nhận lời, hỏi thêm hay báo cáo?',
      opening: ['Tớ được rủ phụ gian sách ở ngày hội trường, hỗ trợ 80k một buổi. Bài đăng do tài khoản cá nhân, chẳng có tích xanh.', 'Họ hẹn đến gặp cô phụ trách trước khi đăng ký. Tớ chưa gửi thông tin gì. Cậu kiểm tra với tớ nhé?'],
      ad: { title: 'Lời mời hỗ trợ ngày hội', source: 'Bài đăng tài khoản cá nhân của thành viên CLB', text: 'CLB Ánh Dương cần 4 bạn hỗ trợ gian sách sáng thứ Bảy, 8h–11h tại sân trường. Hỗ trợ 80.000đ/buổi. Gặp cô phụ trách để nghe công việc trước khi đăng ký. Không thu phí.' },
      task: { title: 'Phân công gửi trước buổi gặp', source: 'Tin nhắn người phụ trách gửi Minh Anh', text: 'Hỗ trợ sắp sách và hướng dẫn đổi sách tại trường. Cô Lan, giáo viên phụ trách CLB, xác nhận đăng ký tại phòng Đoàn. Nhận hỗ trợ sau buổi hoạt động. Không yêu cầu chuyển tiền hay gửi CCCD.' },
      receipt: { title: 'Ảnh nhận hỗ trợ của người tham gia cũ', source: 'Ảnh do một thành viên nhóm gửi', text: 'Ảnh giao dịch +80.000đ, nội dung “ho tro ngay hoi”. Ảnh chưa được đối chiếu với ngân hàng hoặc người chuyển; không tự chứng minh danh tính bên mời tham gia.' },
      claim: { title: 'Người đăng tự giới thiệu', source: 'Tin nhắn người đăng', text: 'Mình là thành viên CLB Ánh Dương. Cô Lan phụ trách hoạt động. Bạn có thể hỏi trực tiếp cô qua danh bạ trường hoặc đến phòng Đoàn để kiểm tra trước.' },
      school: { title: 'Xác nhận hoạt động từ trường', source: 'Liên hệ theo danh bạ nhà trường đã lưu trước đó', text: 'Giáo viên phụ trách xác nhận CLB Ánh Dương có gian sách sáng thứ Bảy, 8h–11h; cần 4 bạn hỗ trợ, mức hỗ trợ 80.000đ/buổi. Đăng ký trực tiếp tại phòng Đoàn. Không thu phí và không nhận CCCD qua tin nhắn.' },
      profile: { title: 'Thông tin tài khoản người đăng', source: 'Thông tin công khai trong hồ sơ mô phỏng', text: 'Tài khoản cá nhân không có dấu xác minh. Có bài sinh hoạt CLB từ năm trước. Không có yêu cầu chuyển khoản. Những thông tin này chưa thay thế xác nhận từ đơn vị tổ chức.' },
      followup: 'Bạn phụ trách trả lời: “Cậu cứ hỏi cô trước nhé. Nếu lịch học không tiện thì không sao, tụi mình còn nhận đăng ký đến thứ Sáu.”',
      legitimate: true, sources: []
    }
  };
  const LABELS = { ad:'Bài đăng', task:'Hướng dẫn công việc', receipt:'Thông tin thanh toán', claim:'Lời giới thiệu', school:'Kênh nhà trường', profile:'Hồ sơ người đăng' };
  const PLANS = {
    prevent: [
      ['halt','Không nạp thêm, dừng làm nhiệm vụ yêu cầu ứng tiền',true],
      ['proof','Lưu bài đăng, tin nhắn và thông tin giao dịch',true],
      ['adult','Nhờ người lớn hoặc giáo viên đáng tin hỗ trợ',true],
      ['report','Báo cáo tài khoản và cảnh báo bạn bè bằng dữ kiện, che thông tin riêng',true],
      ['expose','Đăng công khai số điện thoại và toàn bộ thông tin cá nhân',false],
      ['fee','Nạp thử một khoản nhỏ nữa để chắc chắn',false]
    ],
    recover: [
      ['bank','Liên hệ ngân hàng qua kênh chính thức, trình bày giao dịch và đề nghị hỗ trợ',true],
      ['proof','Giữ mã giao dịch, tin nhắn và bài đăng làm bằng chứng',true],
      ['adult','Báo người lớn đáng tin, nhờ hỗ trợ trình báo cơ quan chức năng',true],
      ['halt','Dừng chuyển thêm; báo cáo tài khoản và cảnh báo bạn bè phù hợp',true],
      ['fee','Chuyển “phí mở khóa” để được rút lại tiền',false],
      ['delete','Xóa sạch tin nhắn vì quá xấu hổ',false]
    ],
    legit: [
      ['channel','Đăng ký qua phòng Đoàn hoặc giáo viên đã xác minh',true],
      ['terms','Xác nhận công việc, thời gian và khoản hỗ trợ trước khi nhận',true],
      ['privacy','Chỉ cung cấp thông tin cần thiết, không gửi OTP hoặc giấy tờ qua tin nhắn',true],
      ['fee','Chuyển phí giữ chỗ nếu người nhắn yêu cầu thêm',false],
      ['expose','Báo cáo người đăng chỉ vì không có tích xanh',false]
    ]
  };
  function fresh(id) {
    id = CASES[id] ? id : 'vy';
    return {version:1,id,phase:'play',tab:'chat',known:[],notes:[],checks:[],actions:[],pairs:[],log:[],messages:CASES[id].opening.map(text=>({who:'them',text})),paused:false,transferred:false,firstAdvice:null,finalAdvice:null,plan:[],notice:'',query:'',visited:[],ack:false};
  }
  const unique = (a,x) => { if (!a.includes(x)) a.push(x); };
  function tell(s,text,who) { s.messages.push({who:who || 'them',text}); }
  function reveal(s,id) { unique(s.known,id); }
  function compare(s,a,b,relation) {
    if (!a || a === b || !s.notes.includes(a) || !s.notes.includes(b)) return false;
    const pair=[a,b].sort().join('+');
    const expected=CASES[s.id].legitimate
      ? {'ad+school':'confirm','ad+task':'confirm','claim+school':'confirm','school+task':'confirm'}
      : {'ad+task':'conflict','claim+school':'conflict','receipt+task':'insufficient'};
    return expected[pair] === relation;
  }
  function step(input, action, payload) {
    const s=JSON.parse(JSON.stringify(input)), c=CASES[s.id];
    if(s.phase==='review' && !['tab','trail','ack'].includes(action)) return s;
    payload=payload || {};
    s.notice='';
    if(action==='tab') { if(['chat','sources','notebook','plan'].includes(payload.tab)) s.tab=payload.tab; return s; }
    if(action==='query') { s.query=String(payload.query||'').slice(0,100); return s; }
    if(action==='note') {
      if(!s.known.includes(payload.id)) return s;
      s.notes=s.notes.includes(payload.id)?s.notes.filter(id=>id!==payload.id):s.notes.concat(payload.id);
      s.notice=s.notes.includes(payload.id)?'Đã giữ thông tin trong sổ. Hãy đối chiếu trước khi dùng để kết luận.':'Đã bỏ khỏi sổ.';
    }
    if(action==='inspect') {
      if(!LABELS[payload.id]) return s;
      reveal(s,payload.id); unique(s.visited,payload.id);
      if(payload.id==='school') unique(s.checks,'independent');
      s.notice='Đã mở '+LABELS[payload.id].toLowerCase()+'. Bạn có thể giữ dữ kiện này trong sổ.';
    }
    if(action==='pause' && !s.actions.includes('pause')) {s.paused=true;unique(s.actions,'pause');tell(s,'Khoan chuyển hoặc gửi thông tin nhé. Mình kiểm tra cùng cậu.','me');tell(s,c.legitimate?'Ừ, tớ sẽ hỏi rõ trước khi đăng ký.':'Ừ, tớ đóng màn hình chuyển tiền rồi. Cậu cần xem gì cứ nói.');}
    const asks={ad:['Cho mình xem bài đăng gốc nhé.','Đây là bài tớ đã xem.'],task:['Gửi mình hướng dẫn công việc, nhất là bước tiếp theo.','Tớ gửi lại nguyên nội dung hướng dẫn đây.'],receipt:['Cho mình xem thông tin khoản tiền đã nhận hoặc ảnh thanh toán.','Đây là thông tin tớ có.'],claim:['Họ giới thiệu thuộc đơn vị nào?','Đây là đoạn người đăng tự giới thiệu.'],profile:['Mình kiểm tra hồ sơ người đăng cùng nhé.','Mình chỉ có những thông tin công khai này.']};
    if(action==='ask' && asks[payload.id] && !s.actions.includes('ask:'+payload.id)) {
      unique(s.actions,'ask:'+payload.id);reveal(s,payload.id);tell(s,asks[payload.id][0],'me');tell(s,asks[payload.id][1], 'them');
      s.messages.push({who:'document',id:payload.id});
      if(payload.id==='task')tell(s,c.followup);
    }
    if(action==='pair') {
      if(compare(s,payload.a,payload.b,payload.relation)) {
        const key=[payload.a,payload.b].sort().join('+');
        if(!s.pairs.some(p=>p.key===key))s.pairs.push({key,a:payload.a,b:payload.b,relation:payload.relation});
        s.notice='Đối chiếu hợp lý. Bạn có thể dùng mối liên hệ này khi tư vấn.';
      } else {s.notice='Mối liên hệ này chưa được dữ kiện hỗ trợ. Xem lại hai nguồn và điều chúng thực sự chứng minh.';}
    }
    if(action==='advice') {
      if(!['stop','wait','proceed'].includes(payload.choice))return s;
      if(s.firstAdvice===null)s.firstAdvice=payload.choice;
      if(payload.choice==='wait') {s.paused=true;tell(s,'Mình chưa đủ căn cứ kết luận. Tạm dừng để xác minh qua kênh khác nhé.','me');tell(s,'Được. Mình cùng kiểm tra thêm.');s.tab='sources';}
      else if(payload.choice==='proceed'&&!c.legitimate) {
        if(!s.transferred){s.transferred=true;tell(s,'Mình nghĩ cậu có thể tiếp tục nạp 500k.','me');tell(s,'Tớ vừa chuyển 500k. Nhưng họ báo sai cú pháp, yêu cầu thêm 2 triệu để mở khóa. Giờ sao đây?');}
        s.finalAdvice='proceed';s.phase='plan';s.tab='plan';s.notice='Tình huống đã thay đổi: Vy đã chuyển tiền trong mô phỏng. Vẫn còn việc bạn có thể giúp.';
      } else if((payload.choice==='stop'&&c.legitimate)||(payload.choice==='proceed'&&!s.checks.includes('independent'))) {
        tell(s,payload.choice==='stop'?'Đừng tham gia, mình nghĩ nên báo cáo người đăng.':'Mình nghĩ có thể nhận lời.','me');
        tell(s,c.legitimate?'Cậu dựa vào thông tin nào? Mình muốn kiểm tra qua giáo viên trước khi quyết định.':'Mình vẫn chưa rõ bên tuyển dụng là ai. Cậu kiểm tra thêm giúp nhé.');
        s.notice='Lời khuyên chưa có căn cứ phù hợp. Hãy kiểm tra kênh độc lập và đối chiếu.';s.tab='sources';
      } else if(!s.pairs.length) {
        tell(s,'Cậu chỉ giúp mình hai thông tin nào dẫn đến nhận định đó được không?');s.tab='notebook';s.notice='Bạn đã chọn hướng xử lý. Hãy đối chiếu ít nhất một cặp dữ kiện để giải thích cho bạn mình.';
      } else {
        s.finalAdvice=payload.choice;s.phase='plan';s.tab='plan';
        const used=s.pairs[s.pairs.length-1];
        tell(s,'Mình đã đối chiếu “'+c[used.a].title+'” với “'+c[used.b].title+'”: '+({conflict:'hai nguồn mâu thuẫn.',confirm:'hai nguồn xác nhận cùng thông tin.',insufficient:'khoản thanh toán ban đầu chưa chứng minh bên tuyển dụng đáng tin.'}[used.relation]),'me');
        tell(s,payload.choice==='stop'?'Không nạp thêm. Mình có dữ kiện để giải thích cho cậu.':'Mình đã kiểm tra qua kênh trường. Cậu có thể đăng ký đúng kênh, với các điều kiện vừa xác nhận.','me');
        tell(s,c.legitimate?'Ừ, mình sẽ gặp cô tại phòng Đoàn. Cần chú ý thêm gì không?':'Tớ hiểu vì sao 45k lúc đầu chưa chứng minh họ đáng tin rồi. Giờ mình nên làm những gì?');
      }
    }
    if(action==='planToggle') {
      if(!planOptions(s).some(x=>x[0]===payload.id))return s;
      s.plan=s.plan.includes(payload.id)?s.plan.filter(x=>x!==payload.id):s.plan.concat(payload.id);
    }
    if(action==='finish') {
      if(s.phase!=='plan')return s;
      const opts=planOptions(s),bad=s.plan.filter(id=>opts.some(x=>x[0]===id&&!x[2]));
      if(bad.length){s.notice='Kế hoạch còn hành động gây rủi ro: '+bad.map(id=>opts.find(x=>x[0]===id)[1]).join('; ')+'. Hãy sửa trước khi gửi.';return s;}
      if(s.transferred&&!s.plan.includes('halt')){s.notice='Vy vẫn có thể bị yêu cầu nạp tiếp. Hãy đưa việc dừng chuyển thêm vào kế hoạch.';return s;}
      if(s.plan.length<2){s.notice='Chọn ít nhất hai việc cụ thể để bạn có thể thực hiện tiếp. Các việc còn thiếu sẽ được chỉ ra trong phần nhìn lại.';return s;}
      if(s.transferred&&s.plan.includes('halt'))s.finalAdvice='stop';
      s.phase='review';s.tab='plan';
      tell(s,c.legitimate?'Tớ đã gặp cô để xác nhận công việc rồi. Cảm ơn cậu vì đã kiểm tra cùng tớ.':s.transferred?'Tớ đã dừng chuyển thêm và nhận kế hoạch của cậu. Chưa biết có thu hồi được tiền không. Mình sẽ thực hiện những việc vừa chọn.':'Tớ không nạp tiền nữa. Tớ nhận được kế hoạch rồi, mình cùng thực hiện nhé.');
    }
    if(action==='trail') {s.tab='trail';}
    if(action==='ack') {s.ack=payload.relation==='lead';s.notice=s.ack?'Đúng: đây là đầu mối cần xác minh thêm, chưa đủ kết luận hai trang cùng chủ.':'Một mẫu câu giống nhau có thể do sao chép. Nó tạo đầu mối, chưa chứng minh cùng một người.';}
    s.log.push({n:s.log.length+1,action,...payload});
    return s;
  }
  function planOptions(s) {return PLANS[CASES[s.id].legitimate?'legit':s.transferred?'recover':'prevent'];}
  function score(s) {
    const c=CASES[s.id];
    const useful=c.legitimate?['ad','task','school','claim']:['task','ad','school','claim'];
    const relevant=s.notes.filter(id=>useful.includes(id)||s.pairs.some(p=>p.a===id||p.b===id)).length;
    const recognition=Math.min(10,relevant*5)+(s.pairs.length?15:0);
    const analysis=(s.checks.includes('independent')?20:0)+(s.pairs.length?15:0);
    const initiallySafe=s.firstAdvice==='wait'||s.firstAdvice===(c.legitimate?'proceed':'stop');
    const decision=(initiallySafe&&!s.transferred?10:0)+(s.finalAdvice===(c.legitimate?'proceed':'stop')?10:0);
    const opts=planOptions(s),valid=opts.filter(x=>x[2]),bad=s.plan.some(id=>opts.some(x=>x[0]===id&&!x[2]));
    const response=bad?0:Math.round(20*s.plan.filter(id=>valid.some(x=>x[0]===id)).length/valid.length);
    return {recognition,analysis,decision,response,total:recognition+analysis+decision+response};
  }
  const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
  function mount(host, opts) {
    let saved=opts.read();
    let s=saved&&saved.version===1&&CASES[saved.id]?JSON.parse(JSON.stringify(saved)):null;
    let pairDraft={};
    let lastMessageCount=-1;
    function persist(){opts.write(s);}
    function act(type,p){
      const workspace=host.querySelector('.shift-workspace'), panel=host.querySelector('.shift-panel'), thread=host.querySelector('.shift-thread');
      const positions={workspace:workspace?.scrollTop||0,panel:panel?.scrollTop||0,thread:thread?.scrollTop||0};
      const keep=['note','planToggle','pair','query','ack'].includes(type);
      s=step(s,type,p);persist();render();
      if(keep){
        const w=host.querySelector('.shift-workspace'),v=host.querySelector('.shift-panel'),t=host.querySelector('.shift-thread');
        if(w)w.scrollTop=positions.workspace;if(v)v.scrollTop=positions.panel;if(t)t.scrollTop=positions.thread;
        const focus=type==='planToggle'?host.querySelector('[data-plan="'+p.id+'"]'):type==='pair'?host.querySelector('#shift-pair button'):null;
        if(focus)focus.focus({preventScroll:true});
      }
      if(type==='inspect')host.querySelector('.shift-panel .shift-document')?.scrollIntoView({block:'nearest'});
    }
    function button(label,action,p,cls,disabled) {
      return '<button class="shift-button '+(cls||'')+'" data-shift="'+action+'" data-payload="'+esc(JSON.stringify(p||{}))+'"'+(disabled?' disabled':'')+'>'+esc(label)+'</button>';
    }
    function doc(id,compact){const d=CASES[s.id][id];return '<article class="shift-document'+(compact?' compact':'')+'"><small>'+esc(d.source)+'</small><h3>'+esc(d.title)+'</h3><p>'+esc(d.text)+'</p>'+(d.image?'<img class="shift-ad" src="'+esc(d.image)+'" alt="Ảnh tuyển cộng tác viên trong hồ sơ mô phỏng">':'')+(s.phase==='review'?'':button(s.notes.includes(id)?'Bỏ khỏi sổ':'Giữ trong sổ điều tra','note',{id},'subtle'))+'</article>';}
    function intro(){
      host.innerHTML='<div class="shift-app"><div class="shift-intro scroll"><p class="shift-eyebrow">VĂN PHÒNG THÁM TỬ MẠNG / CA TRỰC</p><h1>Một người bạn<br>đang cần lời khuyên.</h1><p>Trò chuyện với bạn học, tìm nguồn xác minh, đối chiếu dữ kiện rồi cùng xử lý. Bạn có thể tạm dừng bất cứ lúc nào.</p><div class="shift-case-list">'+Object.entries(CASES).map(([id,c],i)=>'<article><span>CA 0'+(i+1)+'</span><h2>'+esc(c.title)+'</h2><p>'+esc(c.hook)+'</p><button class="shift-button primary" data-start="'+id+'">Nhận ca của '+esc(c.person)+'</button></article>').join('')+'</div><details class="shift-guide"><summary>Cách chơi</summary><p>1. Chọn lời đáp hoặc hỏi thêm trong Tin nhắn.<br>2. Mở Tra cứu để tìm nguồn kiểm chứng. Các tài liệu đều là dữ liệu mô phỏng.<br>3. Giữ dữ kiện cần dùng vào Sổ điều tra, chọn hai dữ kiện và mối liên hệ.<br>4. Gửi lời khuyên và kế hoạch xử lý. Không cần mở mọi đầu mối để hoàn thành.</p></details><small>Nhân vật, giao dịch, trường và trang web trong ca chơi là hư cấu. Không có giao dịch hay tin nhắn nào được gửi ra ngoài.</small></div></div>';
      host.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{s=fresh(b.dataset.start);persist();render();});
    }
    function notebook(){
      if(s.phase==='review') return '<h2>Sổ đã ghi trong ca trực</h2>'+s.notes.map(id=>doc(id,true)).join('')+'<p>Ca đã kết thúc; các dữ kiện và điểm của lượt này được giữ nguyên.</p>';
      const options='<option value="">Chọn dữ kiện…</option>'+s.notes.map(id=>'<option value="'+id+'">'+esc(CASES[s.id][id].title)+'</option>').join('');
      return '<h2>Sổ điều tra</h2><p class="shift-muted">Giữ những dữ kiện cần dùng, rồi giải thích mối liên hệ giữa chúng. Không có điểm cho việc mở hết hồ sơ.</p>'+(s.notes.length?s.notes.map(id=>doc(id,true)).join(''):'<p class="shift-empty">Sổ còn trống. Trong Tin nhắn hoặc Tra cứu, mở tài liệu rồi chọn “Giữ trong sổ điều tra”.</p>')+'<form class="shift-pair" id="shift-pair"><h3>Đối chiếu hai dữ kiện</h3><label>Dữ kiện thứ nhất<select name="a" required>'+options+'</select></label><label>Dữ kiện thứ hai<select name="b" required>'+options+'</select></label><label>Mối liên hệ<select name="relation" required><option value="">Chọn mối liên hệ…</option><option value="confirm">Hai nguồn xác nhận cùng thông tin</option><option value="conflict">Hai nguồn mâu thuẫn</option><option value="insufficient">Dữ kiện này chưa chứng minh bên kia đáng tin</option></select></label><button class="shift-button primary"'+(s.notes.length<2?' disabled':'')+'>Ghi nhận đối chiếu</button></form>'+(s.pairs.length?'<h3>Đối chiếu đã ghi</h3>'+s.pairs.map(p=>'<p class="shift-pair-result">'+esc(LABELS[p.a])+' ↔ '+esc(LABELS[p.b])+': '+esc({confirm:'xác nhận cùng thông tin',conflict:'có mâu thuẫn',insufficient:'chưa chứng minh độ tin cậy'}[p.relation])+'</p>').join(''):'');
    }
    function sources(){
      const resources=[['school','Danh bạ và xác nhận nhà trường','Kênh liên hệ đã lưu từ trước · Sao Mai · CLB · giáo viên'],['profile','Hồ sơ người đăng','Tài khoản · lịch sử · tên hiển thị'],['claim','Lời tự giới thiệu của người tuyển','Tự nhận liên kết · tổ chức · công ty']];
      const q=norm(s.query.trim()),found=resources.filter(r=>!q||norm(r.join(' ')).includes(q));
      return '<h2>Tra cứu hồ sơ</h2><p class="shift-muted">Chọn nguồn theo câu hỏi bạn muốn kiểm tra. Lời người tuyển tự nói và xác nhận từ một kênh độc lập có giá trị khác nhau.</p><form id="shift-search" class="shift-search"><label for="shift-query">Tên đơn vị hoặc đầu mối</label><div><input id="shift-query" name="q" maxlength="100" value="'+esc(s.query)+'" placeholder="Ví dụ: Sao Mai, tài khoản, CLB"><button class="shift-button">Tìm</button></div></form><div class="shift-resources">'+(found.length?found.map(r=>'<button data-resource="'+r[0]+'"><b>'+esc(r[1])+'</b><small>'+esc(r[2])+'</small><span>Mở hồ sơ →</span></button>').join(''):'<p>Không có hồ sơ khớp. Thử “Sao Mai”, “tài khoản” hoặc để trống để xem các nguồn.</p>')+'</div>'+s.visited.slice().reverse().map(id=>doc(id,false)).join('');
    }
    function chatActions(){
      return '<h2>Bạn muốn làm gì?</h2><div class="shift-choices">'+button('Đề nghị bạn tạm dừng để kiểm tra','pause',{},'',s.actions.includes('pause'))+Object.entries({ad:'Xin bài đăng gốc',task:'Hỏi rõ công việc và bước tiếp theo',receipt:'Kiểm tra thông tin thanh toán',claim:'Hỏi đơn vị đứng sau',profile:'Xem hồ sơ người đăng'}).map(([id,l])=>button(l,'ask',{id},'',s.actions.includes('ask:'+id))).join('')+'</div><h3>Gửi lời khuyên</h3><div class="shift-choices">'+button('Chưa đủ căn cứ: tạm dừng và xác minh','advice',{choice:'wait'})+button('Không tiếp tục; giữ bằng chứng và cảnh báo','advice',{choice:'stop'})+button(CASES[s.id].legitimate?'Nhận lời qua kênh đã xác minh':'Khuyên Vy nạp 500.000đ để làm tiếp','advice',{choice:'proceed'})+'</div>';
    }
    function plan(){
      if(s.phase!=='plan')return '<h2>Việc cần làm tiếp</h2><p>Hãy tìm hiểu và gửi lời khuyên trong Tin nhắn. Kế hoạch ở đây sẽ thay đổi theo tình huống thực tế của nhân vật.</p>';
      return '<h2>'+ (s.transferred?'Sau khi đã chuyển tiền':CASES[s.id].legitimate?'Tham gia có kiểm chứng':'Giúp bạn dừng lại an toàn')+'</h2><p>Chọn các việc bạn sẽ cùng '+esc(CASES[s.id].person)+' thực hiện.</p>'+planOptions(s).map(x=>'<label class="shift-plan-item"><input type="checkbox" data-plan="'+x[0]+'"'+(s.plan.includes(x[0])?' checked':'')+'><span>'+esc(x[1])+'</span></label>').join('')+button('Gửi kế hoạch và xem kết quả','finish',{},'primary')+button('Quay lại điều tra thêm','tab',{tab:'chat'},'subtle');
    }
    function review(){
      const sc=score(s),correct=planOptions(s).filter(x=>x[2]),missing=correct.filter(x=>!s.plan.includes(x[0]));
      return '<h2>Nhìn lại ca trực</h2><p class="shift-outcome">'+esc(CASES[s.id].legitimate?'Minh Anh xác nhận được hoạt động hợp lệ và có kênh đăng ký rõ ràng.':s.transferred?'Vy đã dừng chuyển thêm. Khoản 500.000đ chưa được xác nhận thu hồi; liên hệ hỗ trợ không bảo đảm được hoàn tiền.':'Vy đã dừng trước khoản nạp 500.000đ.')+'</p><div class="shift-score"><strong>'+sc.total+'<small>/100</small></strong><span>Điểm quá trình của ca này<br>Không cộng sao hoặc tiền vào 42 hồ sơ cũ.</span></div><table class="shift-rubric"><thead><tr><th>Năng lực</th><th>Điểm</th></tr></thead><tbody><tr><td>Nhận diện: chọn dữ kiện có ích và có đối chiếu hợp lý</td><td>'+sc.recognition+'/25</td></tr><tr><td>Xác minh: kênh độc lập (20) + đối chiếu (15)</td><td>'+sc.analysis+'/35</td></tr><tr><td>Quyết định: tránh khuyên chuyển sai (10) + quyết định cuối phù hợp (10)</td><td>'+sc.decision+'/20</td></tr><tr><td>Ứng phó: các hành động phù hợp trong kế hoạch</td><td>'+sc.response+'/20</td></tr></tbody></table>'+(missing.length?'<div class="shift-feedback"><b>Có thể bổ sung</b><ul>'+missing.map(x=>'<li>'+esc(x[1])+'</li>').join('')+'</ul></div>':'<p class="shift-feedback">Kế hoạch đã bao quát các việc cần thiết của nhánh này.</p>')+(!s.checks.includes('independent')?'<p>Ca này bạn chưa kiểm chứng qua kênh nhà trường đã lưu. Lần sau, hãy kiểm tra lời tự giới thiệu bằng một nguồn độc lập.</p>':'')+(!s.pairs.length?'<p>Bạn chưa có đối chiếu hợp lý trong sổ. Việc khắc phục vẫn có ích, nhưng chưa cho thấy đầy đủ cách bạn đánh giá bằng chứng.</p>':'')+'<details><summary>Xem cách tính điểm và nhật ký</summary><p>Nhận diện: giữ dữ kiện có ích được 5 điểm mỗi dữ kiện, tối đa 10; có đối chiếu hợp lý thêm 15. Hai dữ kiện phù hợp đã đủ đạt tối đa, không cần nhặt hết. Không chấm số lượt click. Quyết định: 10 điểm nếu lời khuyên đầu tiên an toàn và không khuyên Vy chuyển tiền sai trong cả ca; 10 điểm nếu quyết định cuối phù hợp. Chuyển sang nhánh khắc phục không xóa lựa chọn trước. Điểm ứng phó chia đều theo các hành động phù hợp của nhánh.</p><ol>'+s.log.filter(x=>!['tab','query'].includes(x.action)).map(x=>'<li>'+esc({ask:'Hỏi thêm',inspect:'Mở nguồn',note:'Chọn dữ kiện',pair:'Đối chiếu',pause:'Đề nghị tạm dừng',advice:'Gửi lời khuyên',planToggle:'Chọn hành động xử lý',finish:'Gửi kế hoạch'}[x.action]||x.action)+(x.id?' · '+esc(LABELS[x.id]||x.id):'')+'</li>').join('')+'</ol></details><details><summary>Nguồn và phần chuyển thể</summary><p>Đây là ca chơi hư cấu cho học sinh THPT. Tên người, nhà trường và khoản tiền không phải hồ sơ vụ án thật. '+(CASES[s.id].legitimate?'Ca hoạt động CLB là ví dụ hư cấu để luyện kiểm chứng cả thông tin hợp lệ.':'Tham khảo thủ đoạn trả công ban đầu rồi yêu cầu ứng tiền trong các nguồn sau:')+'</p>'+CASES[s.id].sources.map(([l,u])=>'<p><a target="_blank" rel="noopener noreferrer" href="'+esc(u)+'">'+esc(l)+'</a></p>').join('')+'</details>'+(!CASES[s.id].legitimate?button('Theo đầu mối tới Bóng Đêm','trail',{},'primary'):'')+button('Chọn ca khác hoặc chơi lại','choose',{},'subtle');
    }
    function trail(){return '<h2>Một dấu vết chưa khép lại</h2><article class="shift-document"><small>Hồ sơ CTV của Vy</small><p>“Chuyển trước 500.000đ để nhận nhiệm vụ; hoàn thành nhận 650.000đ.”</p></article><article class="shift-document"><small>Mẩu tin từ hồ sơ Bóng Đêm</small><p>“Nạp tiền làm nhiệm vụ, nhận lại tiền gốc và hoa hồng 30%.”</p></article><p>Hai lời nhắn gần giống nhau cho phép kết luận gì?</p>'+button('Đây là đầu mối để kiểm tra thêm','ack',{relation:'lead'})+button('Chắc chắn hai tài khoản cùng một chủ','ack',{relation:'same'})+(s.ack?'<p class="shift-feedback">Đã ghi đầu mối. Cần xác minh thêm tài khoản nhận tiền, lịch sử và mối liên hệ giữa các hồ sơ. Chuyên án cũ vẫn ở Hộp thư.</p>':'')+button('Về kết quả ca trực','tab',{tab:'plan'},'subtle');}
    function render(){
      const previousThread=host.querySelector('.shift-thread'),previousThreadTop=previousThread?.scrollTop||0;
      if(!s)return intro();
      const c=CASES[s.id],tabs=s.phase==='review'?[['notebook','Sổ đã ghi'],['plan','Kết quả']]:[['chat','Tin nhắn'],['sources','Tra cứu'],['notebook','Sổ điều tra'],['plan',s.phase==='review'?'Kết quả':'Xử lý']];
      const panel=s.tab==='trail'?trail():s.phase==='review'&&s.tab==='plan'?review():s.tab==='sources'?sources():s.tab==='notebook'?notebook():s.tab==='plan'?plan():chatActions();
      host.innerHTML='<div class="shift-app"><header class="shift-header"><div><small>CA TRỰC / '+(s.id==='vy'?'01':'02')+'</small><h1>'+esc(c.title)+'</h1></div><span class="shift-status">'+(s.phase==='review'?'Đã kết thúc ca':s.transferred?'Đã chuyển tiền · cần hỗ trợ':s.paused?'Đã tạm dừng để kiểm tra':'Đang chờ lời khuyên')+'</span></header><div class="shift-nav" role="navigation" aria-label="Các khu vực ca trực">'+tabs.map(([id,l])=>button(l,'tab',{tab:id},s.tab===id?'selected':'')).join('')+'</div><div class="shift-workspace"><section class="shift-conversation"><div class="shift-contact"><span>'+esc(c.person.split(' ').map(w=>w[0]).join(''))+'</span><div><b>'+esc(c.person)+'</b><small>'+esc(c.sub)+'</small></div></div><div class="shift-thread" aria-label="Cuộc trò chuyện với '+esc(c.person)+'">'+s.messages.map(m=>m.who==='document'?'<div class="shift-shared">'+doc(m.id,true)+'</div>':'<div class="shift-message '+m.who+'"><small>'+esc(m.who==='me'?'Bạn':c.person)+'</small><p>'+esc(m.text)+'</p></div>').join('')+'</div><small class="shift-simulation">Tin nhắn và giao dịch đều là mô phỏng.</small></section><section class="shift-panel scroll" aria-label="Bàn điều tra">'+(s.notice?'<p class="shift-notice" role="status">'+esc(s.notice)+'</p>':'')+panel+'<details class="shift-guide"><summary>Hướng dẫn thao tác</summary><p>Hỏi thêm ở Tin nhắn. Mở Tra cứu để tìm nguồn. Giữ dữ kiện vào sổ, rồi chọn hai dữ kiện và mối liên hệ. Gửi lời khuyên trong Tin nhắn; hoàn thiện kế hoạch ở Xử lý. Bạn có thể quay lại các khu vực mà không mất tiến trình.</p></details></section></div><footer class="shift-footer"><span>Đã lưu theo tài khoản hiện tại · '+s.notes.length+' dữ kiện trong sổ</span><button class="shift-text-button" data-choose>Chọn ca / chơi lại</button></footer></div>';
      bind();
      const thread=host.querySelector('.shift-thread');thread.scrollTop=s.messages.length!==lastMessageCount?thread.scrollHeight:previousThreadTop;lastMessageCount=s.messages.length;
    }
    function bind(){
      host.querySelectorAll('[data-shift]').forEach(b=>b.onclick=()=>{if(b.dataset.shift==='choose'){choose();return;}act(b.dataset.shift,JSON.parse(b.dataset.payload));});
      host.querySelectorAll('[data-resource]').forEach(b=>b.onclick=()=>act('inspect',{id:b.dataset.resource}));
      host.querySelectorAll('[data-plan]').forEach(b=>b.onchange=()=>act('planToggle',{id:b.dataset.plan}));
      const search=host.querySelector('#shift-search');if(search)search.onsubmit=e=>{e.preventDefault();act('query',{query:new FormData(search).get('q')});};
      const pair=host.querySelector('#shift-pair');if(pair){Object.entries(pairDraft).forEach(([key,value])=>{if(pair.elements[key])pair.elements[key].value=value;});pair.onchange=()=>{pairDraft=Object.fromEntries(new FormData(pair));};pair.onsubmit=e=>{e.preventDefault();act('pair',Object.fromEntries(new FormData(pair)));};}
      const chooseButton=host.querySelector('[data-choose]');if(chooseButton)chooseButton.onclick=choose;
    }
    function choose(){host.innerHTML='<div class="shift-app"><div class="shift-intro scroll"><h2>Đổi ca trực?</h2><p>Tiến trình hiện tại vẫn được giữ cho đến khi bạn nhận một ca mới. Chơi lại sẽ bắt đầu một lượt mới; tiến trình 42 hồ sơ cũ không thay đổi.</p><button class="shift-button" data-resume>Tiếp tục ca hiện tại</button>'+Object.entries(CASES).map(([id,c])=>'<button class="shift-button" data-start="'+id+'">Bắt đầu lại: '+esc(c.title)+'</button>').join('')+'</div></div>';host.querySelector('[data-resume]').onclick=render;host.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{s=fresh(b.dataset.start);pairDraft={};persist();render();});}
    render();
  }
  return {CASES,LABELS,fresh,step,score,compare,planOptions,mount};
});
