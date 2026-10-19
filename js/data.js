/* =========================================================
   DỮ LIỆU GAME "THÁM TỬ MẠNG"
   ---------------------------------------------------------
   Nội dung dựa trên tài liệu "Phòng tránh lừa đảo nhắm vào
   sinh viên trên môi trường số" (7 hình thức lừa đảo).
   Tên trường, ngân hàng, ví điện tử, nhà mạng trong game
   đều là tên hư cấu. Các đầu số trợ giúp (156, 5656, 113)
   và trang canhbao.ncsc.gov.vn là thật.

   Muốn thêm tình huống mới: copy một mục trong SCENARIOS,
   đổi id (không trùng), sửa nội dung. Xem README.md mục
   "Thêm tình huống mới".
   ========================================================= */

/* ---------- 7 hình thức lừa đảo (7 trang trong Sổ Huy hiệu) ---------- */
const SCAM_TYPES = [
  {
    id: 'prize',
    name: 'Giả mạo trúng thưởng',
    color: '#f59e0b',
    badge: 'Khắc tinh Quà Ảo',
    sign: 'Tin nhắn hoặc email báo trúng thưởng, đòi thông tin cá nhân và tiền "phí vận chuyển".',
    tips: [
      'Không tham gia chương trình nào thì không thể trúng thưởng. Giải thật không bắt nộp phí ship, phí thuế trước.',
      'Không trả lời, không gửi họ tên, số CCCD, địa chỉ cho số lạ báo trúng thưởng.',
      'Chụp màn hình tin nhắn làm bằng chứng.',
      'Chuyển tiếp tin nhắn rác tới 5656 hoặc 156 (miễn phí) để báo cáo.',
      'Chặn số đó (Android: Chi tiết → Chặn & báo cáo spam; iPhone: ⓘ → Chặn Người gọi này).'
    ]
  },
  {
    id: 'impersonate',
    name: 'Giả danh người quen, cơ quan',
    color: '#ef4444',
    badge: 'Mắt thần Xác minh',
    sign: 'Mượn tên người thân hoặc giả làm công an, ngân hàng, gửi link lạ hoặc đòi chuyển tiền.',
    tips: [
      'Người thân nhắn mượn tiền gấp: gọi điện hoặc gọi video cho chính người đó qua số cũ để hỏi.',
      'Công an không làm việc, không đòi chuyển tiền qua điện thoại hay Zalo.',
      'Ngân hàng không gửi link bắt đăng nhập hay đòi mã OTP.',
      'Gặp cuộc gọi đe dọa: tắt máy ngay, không tranh luận, rồi kể với người thân.',
      'Bị đe dọa hoặc mất tiền thật: báo ngay công an địa phương (113).'
    ]
  },
  {
    id: 'job',
    name: 'Đầu tư, việc làm online',
    color: '#8b5cf6',
    badge: 'Không ham việc ảo',
    sign: 'Hứa lợi nhuận cao, "việc nhẹ lương cao", bắt ứng tiền trước hoặc mua "tài khoản".',
    tips: [
      'Việc thật trả lương cho bạn, không bắt bạn nạp tiền, đặt cọc hay mua "tài khoản".',
      '"Làm nhiệm vụ, nạp tiền để rút thưởng" luôn là lừa đảo. Lần đầu được trả tiền chỉ là mồi.',
      'Đầu tư "lãi 30% mỗi tháng, cam kết không lỗ" là dấu hiệu chắc chắn của lừa đảo.',
      'Tìm việc làm thêm qua Trung tâm hỗ trợ sinh viên hoặc nơi có địa chỉ rõ ràng, phỏng vấn trực tiếp.',
      'Không gửi ảnh CCCD, ảnh chân dung cho "nhà tuyển dụng" qua tin nhắn.'
    ]
  },
  {
    id: 'phishing',
    name: 'Link giả mạo (phishing)',
    color: '#0ea5e9',
    badge: 'Kính lúp Thần sầu',
    sign: 'Gửi link giống trang ngân hàng, mạng xã hội để đánh cắp tài khoản đăng nhập.',
    tips: [
      'Đọc kỹ tên miền: sai một chữ, thêm dấu gạch, đuôi lạ (.xyz, .cc, .top) là trang giả.',
      'Muốn đăng nhập ngân hàng hay mạng xã hội: tự mở app chính thức, không bấm link trong tin nhắn.',
      'Trang "bình chọn", "xem ảnh", "nhận quà" mà bắt đăng nhập là bẫy chiếm tài khoản.',
      'Báo cáo link, website nghi ngờ tại canhbao.ncsc.gov.vn.',
      'Lỡ nhập mật khẩu: đổi mật khẩu ngay, bật xác thực 2 lớp, báo người thân.'
    ]
  },
  {
    id: 'otp',
    name: 'Lừa lấy mã OTP',
    color: '#10b981',
    badge: 'Người giữ Chìa khóa',
    sign: 'Đòi bạn đọc hoặc gửi mã OTP để chiếm tài khoản, rút tiền trong ví điện tử.',
    tips: [
      'OTP là chìa khóa tài khoản. Không đưa cho bất kỳ ai, kể cả "nhân viên ngân hàng" hay bạn thân.',
      'Đọc kỹ nội dung tin nhắn OTP: nó ghi rõ mã dùng để làm gì (đăng nhập, chuyển tiền, đổi thiết bị).',
      'Bạn không yêu cầu mà vẫn nhận OTP: có người đang thử vào tài khoản của bạn. Đổi mật khẩu ngay.',
      'Tắt máy với ai gọi tới xin mã. Không tranh luận.',
      'Lỡ đưa mã: gọi ngay tổng đài ngân hàng hoặc ví để khóa tài khoản, rồi báo 113.'
    ]
  },
  {
    id: 'school',
    name: 'Giả danh giảng viên, nhà trường',
    color: '#2563eb',
    badge: 'Sinh viên Tỉnh táo',
    sign: 'Dùng tên, ảnh giảng viên để mượn tiền, nhờ mua thẻ cào hoặc gửi link "đóng học phí", "xem điểm".',
    tips: [
      'Email thật của trường có đuôi .edu.vn. Đuôi @gmail.com hay tên miền lạ là đáng ngờ.',
      'Giảng viên không nhắn sinh viên mượn tiền hay nhờ mua thẻ cào.',
      'Chỉ đóng học phí và xem điểm trên cổng thông tin chính thức trường đã công bố.',
      'Nghi ngờ: hỏi trực tiếp Phòng Công tác sinh viên hoặc cố vấn học tập qua số, email chính thức.',
      'Báo cho lớp trưởng và cả lớp biết tài khoản giả để không ai khác bị lừa.'
    ]
  },
  {
    id: 'loan',
    name: 'Học bổng, vay tiền sinh viên',
    color: '#ec4899',
    badge: 'Ví tiền Vững vàng',
    sign: 'Báo nhận học bổng nhưng đòi phí xử lý hồ sơ trước, hoặc quảng cáo vay sinh viên thực chất là tín dụng đen.',
    tips: [
      'Học bổng thật không bắt nộp "phí xử lý hồ sơ" vào tài khoản cá nhân.',
      'Kiểm tra thông báo học bổng trên trang chính thức của trường hoặc hỏi Phòng Công tác sinh viên.',
      'Vay "chỉ cần CCCD, giải ngân 5 phút, không thẩm định" thường là tín dụng đen, lãi cắt cổ.',
      'Không cho app vay truy cập danh bạ, ảnh. Đó là cách chúng khủng bố người thân khi đòi nợ.',
      'Cần tiền gấp: nói với gia đình, hỏi nhà trường về chương trình vay vốn sinh viên của Ngân hàng Chính sách xã hội.'
    ]
  }
];

/* Nút quyết định:
   trust   = Tin tưởng
   suspect = Nghi ngờ & xác minh
   report  = Chặn & báo cáo
*/

/* Số tài khoản của đường dây "Bóng Đêm" xuất hiện ở nhiều vụ */
const BONG_DEM_ACC = '1903 6688 2468';

/* ---------- Các tình huống ----------
   reporter: tên ngắn hiện trong Hộp thư.
   report: tin nhắn người trình báo gửi Văn phòng.
     from, sub: tên và dòng phụ (lớp, khoa)
     msgs: danh sách tin. Chuỗi = một tin nhắn.
           { time: '21:47' } = mốc thời gian.
           { shot: ['dòng 1', 'dòng 2'], app: 'Zalo' } = ảnh chụp màn hình đính kèm.
   view.kind:
     'post'  : bài đăng ViệtBook
     'chat'  : tin nhắn. view.app = 'messenger' | 'zalo' | 'sms'
     'email' : thư điện tử
   Trong chữ, viết [[id|chữ hiện ra]] để tạo một manh mối bấm được.
   evidence: bằng chứng cho các app dò tìm: link, image, account, profile
*/
const SCENARIOS = [
  /* ===================== GIẢ MẠO TRÚNG THƯỞNG ===================== */
  {
    id: 'prize-1', type: 'prize', title: 'Vòng quay iPhone',
    reporter: 'Minh Anh · K48 Tiếng Anh',
    report: {
      from: 'Nguyễn Minh Anh', sub: 'SV năm 1 · Khoa Tiếng Anh',
      msgs: [
        { time: '21:47' },
        'dạ cho em hỏi xíu ạ',
        'em thấy trang này đang tặng iPhone, chỉ cần share bài với trả 50k tiền ship thôi',
        { shot: ['Thế Giới Điện Thoại - Tri Ân', 'TẶNG 100 iPhone 15 Pro Max', 'Thanh toán 50.000đ phí vận chuyển', 'thegioidienthoai-trian.xyz'], app: 'ViệtBook' },
        'bạn cùng phòng em bảo có người nhận được máy thật rồi 😅 em tính ck luôn mà hơi sợ, ad xem giúp em với'
      ]
    },
    view: {
      kind: 'post',
      author: { name: 'Thế Giới Điện Thoại - Tri Ân', avatar: '📱', color: '#f97316', meta: '[[c-new|Trang tạo 3 ngày trước]] · 🌐' },
      text: '🎉🎉 TRI ÂN KHÁCH HÀNG 🎉🎉\nTặng [[c-free|100 iPhone 15 Pro Max MIỄN PHÍ]] cho 100 bạn may mắn!\n✅ Like + chia sẻ bài viết\n✅ Điền thông tin tại link bên dưới\n✅ [[c-fee|Thanh toán 50.000đ phí vận chuyển]] để nhận máy\n⏰ [[c-rush|Chỉ còn 2 giờ!]]',
      image: { emoji: '📱', caption: 'iPhone 15 Pro Max', clue: 'c-img' },
      link: { url: 'thegioidienthoai-trian.xyz', title: 'Đăng ký nhận quà tri ân', clue: 'c-link' },
      stats: '👍 4,2K · 💬 1,1K · ↗ 900',
      comments: [
        { name: 'Ngọc Hân', text: 'Mình nhận được máy rồi, cảm ơn shop ❤️' },
        { name: 'Tuấn Kiệt', text: 'Mình nhận được máy rồi, cảm ơn shop ❤️' }
      ]
    },
    clues: {
      'c-new': 'Trang "tri ân khách hàng" mà mới lập 3 ngày. Cửa hàng thật đã hoạt động nhiều năm.',
      'c-free': 'Tặng 100 chiếc iPhone đắt tiền chỉ vì một lượt chia sẻ: quá tốt để là thật.',
      'c-fee': 'Quà miễn phí mà bắt trả phí vận chuyển trước. Đây là dấu hiệu điển hình của lừa trúng thưởng.',
      'c-rush': 'Hối thúc "chỉ còn 2 giờ" để bạn không kịp hỏi ai.',
      'c-link': 'Tên miền .xyz lạ, không phải trang chính thức của cửa hàng.',
      'c-img': 'Ảnh sản phẩm được lấy từ trên mạng.'
    },
    evidence: {
      link: { url: 'thegioidienthoai-trian.xyz', bad: true, highlight: '-trian.xyz', detail: 'Trang chính thức của cửa hàng có đuôi .com hoặc .vn. Tên miền này mới đăng ký 4 ngày trước, đuôi .xyz rất rẻ và hay bị dùng để lừa đảo.', clue: 'c-link' },
      image: { bad: true, detail: 'Ảnh này xuất hiện trên hơn 1.200 trang web khác. Bản gốc là ảnh quảng cáo của hãng.', clue: 'c-img' },
      profile: { bad: true, created: '3 ngày trước', friends: '0 bạn bè, 12K người theo dõi (mua ảo)', detail: 'Trang đã đổi tên 2 lần. Tên cũ: "Bán hàng thanh lý giá rẻ".', clue: 'c-new' }
    },
    answer: 'report',
    consequence: 'Minh Anh chuyển 50.000đ, sau đó trang đòi thêm 300.000đ "phí bảo hiểm". Không có chiếc iPhone nào cả.',
    explain: 'Giải thưởng thật không bao giờ bắt người trúng thưởng trả tiền trước.',
    rule: 'Quà miễn phí mà phải trả phí trước: chắc chắn là lừa.'
  },

  {
    id: 'prize-2', type: 'prize', title: 'Quà minigame',
    reporter: 'Bảo Ngọc · K48 Tâm lý học',
    report: {
      from: 'Phạm Bảo Ngọc', sub: 'SV năm 2 · Khoa Tâm lý học',
      msgs: [
        { time: '15:20' },
        'ad ơi tuần trước e có cmt minigame của shop Mộc Len trên ViệtBook',
        'giờ có zalo Giao Nhanh Việt nhắn là quà về rồi',
        { shot: ['Giao Nhanh Việt', 'Đơn quà tặng từ shop Mộc Len', 'Phí COD 32.000đ', 'Bạn ck trước giúp em để em đi đơn nhé'], app: 'Zalo' },
        'e có tham gia thật nên ko biết thật hay giả 😭',
        'mà shop chưa đăng danh sách trúng'
      ]
    },
    view: {
      kind: 'chat', app: 'zalo',
      contact: { name: 'Giao Nhanh Việt - Shipper', avatar: '👤', color: '#ea580c', sub: '[[c-zalo|Tài khoản cá nhân · Không có dấu xác thực]]' },
      messages: [
        { who: 'sys', text: 'Hôm nay 14:52' },
        { who: 'them', text: 'Chào bạn Ngọc, mình bên GNV. Bạn có [[c-shop|đơn quà tặng minigame từ shop Mộc Len]] giao tới KTX ĐH Sao Mai nhé' },
        { who: 'them', text: 'Đơn có [[c-cod|phí COD 32.000đ]] bạn nhé' },
        { who: 'me', text: 'ơ shop chưa báo em trúng mà' },
        { who: 'them', text: 'Shop gửi bên mình rồi bạn ạ, chắc shop chưa kịp nhắn. Mã vận đơn [[c-code|GNV2410187742]]' },
        { who: 'them', text: 'Chiều nay mình chạy tuyến KTX luôn, [[c-prepay|bạn ck trước giúp mình để mình đi đơn]] cho nhanh, STK 1029 4417 0388 SaoVietBank NGO VAN TAI' }
      ]
    },
    clues: {
      'c-zalo': 'Tài khoản cá nhân đặt tên công ty giao hàng. Chưa chắc là giả, nhưng không phải kênh chính thức của GNV.',
      'c-shop': 'Ngọc có tham gia minigame thật, nên quà có thể là thật. Nhưng kẻ gian cũng đọc được bình luận công khai đó.',
      'c-cod': 'Có khi shop gửi quà kèm phí ship thật, số tiền nhỏ. Điều cần hỏi là shop có báo trước không.',
      'c-code': 'Có mã vận đơn: tự tra trên app hoặc trang chính thức của GNV, đừng tra qua link người lạ gửi.',
      'c-prepay': 'COD nghĩa là trả khi nhận hàng. Đòi chuyển khoản trước vào tài khoản cá nhân thì phải dừng lại kiểm tra.'
    },
    evidence: {
      profile: { bad: true, created: '2 tháng trước', friends: '41 bạn bè', detail: 'Tài khoản cá nhân, ảnh đại diện là logo GNV tải trên mạng. Không phải Zalo Official Account của công ty.', clue: 'c-zalo' },
      account: { number: '1029 4417 0388', bank: 'Ngân hàng Sao Việt', owner: 'NGO VAN TAI', reports: 0, bad: false, detail: 'Chưa có lượt tố cáo nào. Không có tố cáo không có nghĩa là an toàn, chỉ là chưa ai báo.', clue: 'c-prepay' }
    },
    answer: 'suspect',
    consequence: 'Nếu chuyển ngay: mã vận đơn tra trên app GNV không tồn tại, shop Mộc Len xác nhận Ngọc không trúng, mất 32.000đ và kẻ gian còn đòi thêm "phí giao lại". Nếu chặn luôn mà không hỏi shop, Ngọc có thể bỏ lỡ một món quà thật.',
    explain: 'Ngọc có tham gia minigame thật nên chưa thể kết luận, nhưng phải hỏi thẳng shop và tra mã vận đơn trên kênh chính thức trước khi trả đồng nào.',
    rule: 'Có tham gia mà nghi ngờ: hỏi thẳng bên tổ chức qua kênh chính thức, chỉ trả COD khi cầm hàng trên tay.'
  },
  {
    id: 'prize-3', type: 'prize', title: 'Tri ân thuê bao',
    reporter: 'Hoàng Long · K47 Toán',
    report: {
      from: 'Trần Hoàng Long', sub: 'SV năm 2 · Khoa Toán',
      msgs: [
        { time: '07:58' },
        'ad ơi',
        'sáng ra nhận dc tin này, brandname SongViet hẳn hoi',
        { shot: ['SongViet: Chuc mung TB 0912xxx845', 'trung giai Nhi tri an 20 nam', 'tri gia 15.000.000d', 'Phi thue TNCN 1.500.000d CK den STK 1903 6688 2468'], app: 'Tin nhắn' },
        'tin nằm chung luồng với tin báo cước nên e tưởng thật',
        'nhưng 1tr5 thì e ko có 🥲 nên chưa ck, cái này thật ko ad'
      ]
    },
    view: {
      kind: 'chat', app: 'sms',
      contact: { name: 'SongViet', avatar: '📶', color: '#16a34a', sub: 'Tin nhắn SMS' },
      messages: [
        { who: 'sys', text: 'Th 5, 10 thg 10, 09:15' },
        { who: 'them', text: 'SongViet: TB 0912xxx845 da dang ky goi cuoc SV70 thanh cong. Chi tiet LH 18008098.' },
        { who: 'sys', text: 'Hôm nay 07:42' },
        { who: 'them', text: 'SongViet: Chuc mung TB 0912xxx845 [[c-nojoin|da trung giai Nhi chuong trinh Tri an 20 nam]] gom xe may Vision tri gia 15.000.000d. [[c-tax|Quy khach vui long nop phi thue TNCN 1.500.000d]] truoc khi nhan giai vao STK [[c-acc|1903 6688 2468 Ngan hang Sao Mai - NGUYEN VAN BONG]]. [[c-rush|Han chot 17h hom nay, qua han giai thuong se bi huy.]]' },
        { who: 'them', text: 'SongViet: Xac nhan nhan giai tai [[c-link|songviet-trian.top]] hoac LH Zalo 0879xxx312 (Ms Linh - phong CSKH).' }
      ]
    },
    clues: {
      'c-nojoin': 'Long có tham gia chương trình nào đâu mà trúng? Không dự thưởng thì không thể có giải.',
      'c-tax': 'Thuế thu nhập từ giải thưởng do bên trao giải khấu trừ khi trao, không bao giờ bắt người trúng chuyển khoản trước.',
      'c-acc': 'Nhà mạng mà thu tiền qua tài khoản cá nhân tên NGUYEN VAN BONG ở một ngân hàng khác? Số này trùng đường dây Bóng Đêm đấy.',
      'c-rush': 'Hạn chót trong ngày, dọa hủy giải: chiêu hối thúc để cháu không kịp hỏi ai.',
      'c-link': 'Tên miền .top có gạch nối, không phải trang của nhà mạng. Kẻ gian giả brandname nên tin nằm chung luồng với tin thật.'
    },
    evidence: {
      account: { number: BONG_DEM_ACC, bank: 'Ngân hàng Sao Mai', owner: 'NGUYEN VAN BONG', reports: 87, bad: true, detail: 'Tài khoản cá nhân, 87 lượt tố cáo lừa đảo. Cùng số với nhiều vụ khác nhưng mỗi vụ một tên chủ khác nhau: dấu hiệu đường dây.', clue: 'c-acc' },
      link: { url: 'songviet-trian.top', bad: true, highlight: '-trian.top', detail: 'Tên miền đăng ký 6 ngày trước, máy chủ ở nước ngoài. Trang của nhà mạng Sóng Việt không có địa chỉ này.', clue: 'c-link' }
    },
    answer: 'report',
    consequence: 'Long gom tiền chuyển 1.500.000đ, hôm sau "Ms Linh" báo cần thêm 3.000.000đ phí trước bạ xe. Chặn liên lạc sau khi nhận tiền, không có xe nào cả.',
    explain: 'Kẻ gian giả brandname nhà mạng, báo trúng giải không dự thưởng và đòi nộp "thuế" vào tài khoản cá nhân.',
    rule: 'Trúng thưởng mà phải nộp phí, nộp thuế trước: chặn và chuyển tin tới 156.'
  },
  {
    id: 'prize-4', type: 'prize', title: 'Bốc thăm Ngày hội',
    reporter: 'Quốc Huy · K49 Tin học',
    report: {
      from: 'Đỗ Quốc Huy', sub: 'SV năm 1 · Khoa Tin học',
      msgs: [
        { time: '19:05' },
        'a ơi',
        'hôm cn e đi Ngày hội tân sinh viên có bỏ phiếu bốc thăm',
        'nay trang Đoàn trường đăng danh sách, có tên e trúng tai nghe',
        { shot: ['Đoàn TNCS HCM Trường ĐH Sao Mai', 'KẾT QUẢ BỐC THĂM MAY MẮN', 'Phiếu 0347 - Đỗ Quốc Huy - K49 Tin học', 'Nhận quà tại Văn phòng Đoàn, P.105 nhà A1'], app: 'ViệtBook' },
        'dạo này lừa trúng thưởng nhiều quá nên e hỏi cho chắc 😅'
      ]
    },
    view: {
      kind: 'post',
      author: { name: 'Đoàn TNCS Hồ Chí Minh Trường ĐH Sao Mai', avatar: '🏫', color: '#2563eb', verified: true, meta: '[[c-page|Trang hoạt động từ 2014 · 18K người theo dõi]] · 🌐' },
      text: '🎉 KẾT QUẢ BỐC THĂM MAY MẮN NGÀY HỘI TÂN SINH VIÊN 2024\n\n[[c-event|Bốc thăm công khai trên sân khấu chiều Chủ nhật 13/10]], từ phiếu các bạn bỏ vào thùng tại cổng hội trường.\n\n🎁 Giải Nhất: 01 xe đạp - Phiếu 0912 - Vũ Thanh Hà - K49 Ngữ văn\n🎁 Giải Nhì: 03 tai nghe bluetooth - Phiếu 0347 - Đỗ Quốc Huy - K49 Tin học; Phiếu 1105 - Lý Minh Châu - K49 Hóa học; Phiếu 0088 - Đinh Gia Bảo - K49 Toán\n\n📍 [[c-office|Nhận quà trực tiếp tại Văn phòng Đoàn, phòng 105 nhà A1]], giờ hành chính từ 14/10 đến 25/10. Mang thẻ sinh viên để đối chiếu.\n✅ [[c-nofee|Không thu bất kỳ khoản phí nào.]] Đoàn trường không nhắn tin riêng đòi chuyển khoản.',
      link: { url: 'doantruong.saomai.edu.vn/ngay-hoi-tan-sv-2024', title: 'Ảnh và video Ngày hội tân sinh viên 2024', clue: 'c-link' },
      stats: '👍 1,3K · 💬 214 · ↗ 56',
      comments: [
        { name: 'Vũ Thanh Hà', text: 'Ôi em trúng xe đạp thật này, mai em qua nhận ạ 😭' },
        { name: 'Lý Minh Châu', text: 'Bạn nào nhận rồi cho mình hỏi có cần mang phiếu gốc không?' }
      ]
    },
    clues: {
      'c-page': 'Trang lâu năm, có dấu xác thực, đúng là trang Đoàn trường mà sinh viên vẫn theo dõi.',
      'c-event': 'Huy có bỏ phiếu thật tại sự kiện có thật, bốc thăm công khai. Có tham gia thì mới có trúng.',
      'c-office': 'Nhận quà trực tiếp tại văn phòng trong trường, đối chiếu thẻ sinh viên: không cần gửi thông tin qua mạng.',
      'c-nofee': 'Không thu phí, còn dặn trước là không nhắn riêng đòi tiền. Dấu hiệu tốt.',
      'c-link': 'Tên miền con của saomai.edu.vn, đúng tên miền chính thức của trường.'
    },
    evidence: {
      link: { url: 'doantruong.saomai.edu.vn/ngay-hoi-tan-sv-2024', bad: false, detail: 'Trang thuộc tên miền saomai.edu.vn của ĐH Sao Mai, đăng ký từ nhiều năm. An toàn.', clue: 'c-link' },
      profile: { bad: false, created: '10 năm trước', friends: '18K người theo dõi', detail: 'Trang chính thức của Đoàn trường, có dấu xác thực, được liên kết từ website saomai.edu.vn.', clue: 'c-page' }
    },
    answer: 'trust',
    consequence: 'Nếu chặn và báo cáo nhầm, Huy bỏ lỡ chiếc tai nghe và báo cáo sai trang chính thức của Đoàn trường. Hạn nhận quà là 25/10.',
    explain: 'Huy có tham gia thật, kết quả đăng trên trang chính thức của trường, nhận quà trực tiếp và không mất phí.',
    rule: 'Không phải giải thưởng nào cũng là lừa: có tham gia, kênh chính thức, không đòi phí thì yên tâm.'
  },
  {
    id: 'prize-5', type: 'prize', title: 'Học bổng laptop',
    reporter: 'Thu Trang · K49 Sinh học',
    report: {
      from: 'Lê Thu Trang', sub: 'SV năm 1 · Khoa Sinh học',
      msgs: [
        { time: '22:31' },
        'dạ em chào anh chị ạ',
        'em mới nhận được email báo em trúng học bổng laptop cho tân sinh viên',
        { shot: ['Quỹ Laptop Cho Em Đến Trường', 'Chúc mừng bạn đã được chọn nhận', '01 laptop trị giá 18.500.000đ', 'Phí vận chuyển và bảo hiểm: 289.000đ'], app: 'Gmail' },
        'họ bảo gửi họ tên, CCCD với địa chỉ rồi ck phí ship là gửi máy',
        'em ko nhớ là có nộp hồ sơ ở đâu ạ 😅 mà em đang cần laptop thật'
      ]
    },
    view: {
      kind: 'email',
      from: { name: 'Quỹ Laptop Cho Em Đến Trường', addr: '[[c-mail|quylaptop.chosinhvien2024@gmail.com]]' },
      to: 'trang.lethu.k49@gmail.com',
      subject: '[CHÚC MỪNG] Bạn được chọn nhận học bổng Laptop 2024 🎓',
      date: 'Th 3, 15 thg 10, 21:06',
      body: 'Chào bạn Lê Thu Trang,\n\nQuỹ Laptop Cho Em Đến Trường xin chúc mừng bạn [[c-random|đã được hệ thống chọn ngẫu nhiên]] trong danh sách 200 tân sinh viên nhận học bổng 01 laptop trị giá 18.500.000đ.\n\nĐể nhận quà, bạn vui lòng phản hồi email này kèm:\n1. Họ và tên, ngày sinh\n2. [[c-id|Ảnh chụp 2 mặt CCCD]]\n3. Địa chỉ nhận hàng, số điện thoại\n\nSau đó [[c-fee|chuyển 289.000đ phí vận chuyển và bảo hiểm thiết bị]] vào STK 0451 2208 7731 PNBank, chủ TK TRUONG THI MY, nội dung: HOTEN + LAPTOP.\n\n[[c-rush|Suất học bổng sẽ được chuyển cho bạn khác nếu không phản hồi trong 24h.]]\n\nTrân trọng!',
      sig: 'Ban điều phối Quỹ Laptop Cho Em Đến Trường\nHotline/Zalo: 0868 xxx 129\n[[c-sig|Không có địa chỉ văn phòng, không có website]]'
    },
    clues: {
      'c-mail': 'Một "quỹ học bổng" mà dùng địa chỉ @gmail.com miễn phí, có cả số năm. Tổ chức thật có tên miền riêng.',
      'c-random': 'Học bổng thật xét hồ sơ, không "chọn ngẫu nhiên" người chưa từng nộp đơn.',
      'c-id': 'Ảnh 2 mặt CCCD đủ để kẻ gian mở tài khoản, vay tiền đứng tên cháu.',
      'c-fee': 'Quà miễn phí mà bắt trả phí ship, phí bảo hiểm trước vào tài khoản cá nhân: dấu hiệu điển hình của quà ảo.',
      'c-rush': 'Dọa chuyển suất cho người khác trong 24h để cháu vội vàng gửi thông tin.',
      'c-sig': 'Chữ ký chỉ có số Zalo, không địa chỉ, không trang web để đối chiếu.'
    },
    evidence: {
      account: { number: '0451 2208 7731', bank: 'Ngân hàng Phương Nam', owner: 'TRUONG THI MY', reports: 23, bad: true, detail: 'Tài khoản cá nhân, 23 lượt tố cáo trong 2 tháng với nội dung "phí ship quà tặng", "học bổng".', clue: 'c-fee' },
      profile: { bad: true, created: '19 ngày trước', friends: 'Không có trang chính thức', detail: 'Địa chỉ gmail mới tạo. Không tìm thấy quỹ nào tên này trên trang của ĐH Sao Mai hay báo chí.', clue: 'c-mail' }
    },
    answer: 'report',
    consequence: 'Trang gửi ảnh CCCD và 289.000đ. Không có laptop, một tháng sau Trang nhận cuộc gọi đòi nợ một khoản vay online đứng tên mình.',
    explain: 'Email gmail báo trúng học bổng không nộp đơn, đòi CCCD và phí ship: lừa cả tiền lẫn thông tin cá nhân.',
    rule: 'Không nộp đơn thì không có học bổng. Không gửi CCCD cho ai báo trúng thưởng.'
  },

  /* ===================== GIẢ DANH NGƯỜI QUEN, CƠ QUAN ===================== */
  {
    id: 'impersonate-1', type: 'impersonate', title: 'Anh họ mượn 3 triệu',
    reporter: 'Quang Huy · K49 Toán',
    report: {
      from: 'Phạm Quang Huy', sub: 'SV năm 2 · Khoa Toán',
      msgs: [
        { time: '22:36' },
        'ad ơi',
        'anh họ e nhắn mess mượn 3tr gấp, bảo mai trả',
        { shot: ['Đức Anh', 'e ck giúp a 3tr vào stk này nhé', '1903 6688 2468 NGUYEN VAN BONG', 'a đang kẹt ko ck được 😥'], app: 'Messenger' },
        'mà stk lại tên người khác, ổng bảo của bạn ổng',
        'e gọi mess thì ổng tắt, nhắn là đang họp ko nghe dc. có nên ck ko ad'
      ]
    },
    view: {
      kind: 'chat', app: 'messenger',
      contact: { name: 'Đức Anh', avatar: '👦', color: '#2563eb', sub: 'Hoạt động 2 phút trước' },
      messages: [
        { who: 'sys', text: 'Hôm nay 22:14' },
        { who: 'them', text: 'Huy ơi ngủ chưa e' },
        { who: 'me', text: 'chưa a, sao z' },
        { who: 'them', text: 'e có tiền ko [[c-borrow|cho a mượn 3tr gấp]], a đang kẹt ở ngoài, [[c-tomorrow|sáng mai a trả luôn]]' },
        { who: 'them', text: 'a ko ck được do app ngân hàng a bị lỗi. e ck giúp a vào stk này nhé' },
        { who: 'them', text: '[[c-acc|1903 6688 2468 NGUYEN VAN BONG]] Ngân hàng Sao Mai. tk của thằng bạn a' },
        { who: 'sys', text: 'Cuộc gọi video nhỡ' },
        { who: 'them', text: '[[c-nocall|a đang họp ko nghe máy được]], e ck nhanh giúp a cái' },
        { who: 'them', text: '[[c-secret|đừng nói với mẹ a nhé]], ck xong chụp bill gửi a 🙏' }
      ]
    },
    clues: {
      'c-borrow': 'Nick người quen bất ngờ hỏi mượn tiền gấp lúc tối muộn: kiểu quen thuộc của nick bị hack.',
      'c-tomorrow': 'Hứa "mai trả luôn" cho bạn yên tâm, nhưng lời hứa trên tin nhắn chẳng đảm bảo gì.',
      'c-acc': 'Người mượn tiền là anh họ mà tài khoản lại đứng tên một người lạ. Số này đã bị báo cáo nhiều lần.',
      'c-nocall': 'Bạn gọi video thì không nghe. Kẻ gian chiếm nick không dám lộ mặt, lộ giọng.',
      'c-secret': 'Dặn giấu người nhà để không ai kịp xác minh giúp bạn.'
    },
    evidence: {
      account: { number: BONG_DEM_ACC, bank: 'Ngân hàng Sao Mai', owner: 'NGUYEN VAN BONG', reports: 41, bad: true, detail: 'Số tài khoản này bị báo cáo 41 lần trong 2 tháng, mỗi lần một tên chủ khác nhau. Dấu vết của đường dây "Bóng Đêm".', clue: 'c-acc' },
      profile: { bad: true, created: '2018 (tài khoản thật của anh Đức Anh)', friends: '612 bạn bè', detail: 'Tài khoản thật nhưng vừa đổi email và số điện thoại đăng nhập lúc 21:50 tối nay. Nhiều khả năng đã bị chiếm.', clue: 'c-nocall' }
    },
    answer: 'report',
    consequence: 'Huy chuyển 3.000.000đ. Sáng hôm sau anh Đức Anh đăng bài báo bị hack nick, 6 người họ hàng khác cũng đã chuyển tiền vào cùng số tài khoản đó.',
    explain: 'Nick người quen mượn tiền gấp, tài khoản tên lạ, gọi không nghe: đây là nick bị chiếm, cần chặn và báo cho chính người thân.',
    rule: 'Người quen nhắn mượn tiền: gọi điện cho chính họ qua số cũ trước khi chuyển một đồng.'
  },
  {
    id: 'impersonate-2', type: 'impersonate', title: '"Công an quận" gọi',
    reporter: 'Thu Trang · K50 Tâm lý học',
    report: {
      from: 'Đỗ Thu Trang', sub: 'SV năm 1 · Khoa Tâm lý học',
      msgs: [
        { time: '10:05' },
        'dạ em chào anh chị ạ',
        'sáng nay có người gọi xưng là công an quận, bảo em liên quan đường dây rửa tiền 😭',
        'xong kết bạn zalo gửi em cái lệnh bắt có dấu đỏ',
        { shot: ['Thượng úy Lê Minh Tuấn', 'chuyển 18.500.000đ vào tài khoản tạm giữ', 'không được kể với bất kỳ ai', 'kể cả bố mẹ, nếu lộ sẽ bị bắt tạm giam'], app: 'Zalo' },
        'em sợ quá, giờ em có nên ck ko ạ, họ bảo 11h mà chưa ck là ra lệnh bắt'
      ]
    },
    view: {
      kind: 'chat', app: 'zalo',
      contact: { name: 'Thượng úy Lê Minh Tuấn', avatar: '👮', color: '#1e3a8a', sub: '[[c-zalo|Tài khoản Zalo cá nhân · Người lạ]]' },
      messages: [
        { who: 'sys', text: 'Cuộc gọi thoại 14 phút · 09:21' },
        { who: 'them', text: 'Chào em Trang. Đây là ảnh lệnh của Cơ quan điều tra, em xem kỹ.' },
        { who: 'them', text: '[[c-paper|📄 QUYETDINH_BATTAMGIAM_DoThuTrang.jpg]]' },
        { who: 'them', text: 'Tài khoản đứng tên em đã nhận tiền của đường dây rửa tiền. Để chứng minh trong sạch em phải [[c-hold|chuyển toàn bộ số dư 18.500.000đ vào tài khoản tạm giữ]] để cơ quan xác minh dòng tiền.' },
        { who: 'them', text: 'STK tạm giữ: [[c-acc|1903 6688 2468 - LE THI HOA]] Ngân hàng Sao Mai. Xác minh xong sẽ hoàn lại trong 24h.' },
        { who: 'me', text: 'dạ sao em ko lên trụ sở làm việc trực tiếp được ạ' },
        { who: 'them', text: 'Vụ án đang trong giai đoạn bí mật điều tra. [[c-secret|Em không được kể với bất kỳ ai, kể cả bố mẹ]], nếu lộ thông tin em sẽ bị xử lý tội cản trở điều tra.' },
        { who: 'them', text: '[[c-deadline|Trước 11h00 em chưa chuyển là bên anh ra lệnh bắt]]. Chuyển xong chụp màn hình gửi anh.' }
      ]
    },
    clues: {
      'c-zalo': 'Công an không làm việc với người dân qua Zalo cá nhân. Giấy mời, lệnh triệu tập được gửi trực tiếp hoặc qua công an phường.',
      'c-paper': 'Ảnh "lệnh bắt" có dấu đỏ ai cũng làm giả được bằng điện thoại. Công an không gửi lệnh qua tin nhắn.',
      'c-hold': 'Không có cái gọi là "tài khoản tạm giữ". Công an không bao giờ đòi chuyển tiền qua điện thoại.',
      'c-acc': 'Tài khoản "của cơ quan điều tra" lại đứng tên một cá nhân. Số này còn bị báo cáo ở nhiều vụ khác.',
      'c-secret': 'Bắt giữ bí mật, cấm kể với bố mẹ để bạn bị cô lập, không ai kịp ngăn.',
      'c-deadline': 'Dọa bắt và đặt giờ chót để bạn hoảng, không còn bình tĩnh suy nghĩ.'
    },
    evidence: {
      account: { number: BONG_DEM_ACC, bank: 'Ngân hàng Sao Mai', owner: 'LE THI HOA', reports: 57, bad: true, detail: 'Cùng số tài khoản với vụ nick anh họ bị hack, chỉ đổi tên chủ. Đã bị báo cáo 57 lần. Cơ quan nhà nước không dùng tài khoản cá nhân.', clue: 'c-acc' },
      image: { bad: true, detail: 'Ảnh "quyết định bắt tạm giam" bị chỉnh sửa: con dấu chép từ ảnh trên mạng, phông chữ lệch dòng, số văn bản không tồn tại.', clue: 'c-paper' },
      profile: { bad: true, created: '5 ngày trước', friends: '3 bạn bè', detail: 'Ảnh đại diện mặc quân phục lấy từ một bài báo cũ. Tài khoản đã đổi tên 4 lần.', clue: 'c-zalo' }
    },
    answer: 'report',
    consequence: 'Trang chuyển 18.500.000đ, tiền học kỳ bố mẹ vừa gửi. Hôm sau "thượng úy" đòi thêm 30 triệu "phí bảo lãnh" rồi chặn Zalo. Không có vụ án nào cả.',
    explain: 'Công an không làm việc qua Zalo, không bắt giữ bí mật và không bao giờ đòi chuyển tiền vào "tài khoản tạm giữ".',
    rule: 'Ai xưng công an đòi chuyển tiền: tắt máy, kể ngay với người nhà, gọi 113.'
  },
  {
    id: 'impersonate-3', type: 'impersonate', title: 'Tin biến động số dư',
    reporter: 'Khánh Linh · K50 Ngữ văn',
    report: {
      from: 'Lê Khánh Linh', sub: 'SV năm 1 · Khoa Ngữ văn',
      msgs: [
        { time: '19:03' },
        'hi ad',
        'mấy hôm nay đọc tin giả ngân hàng nhiều quá giờ thấy tin nào từ SaoVietBank e cũng sợ',
        { shot: ['SaoVietBank', 'TK 0071xxx896 +2,000,000VND', 'luc 18:57 19/10/2026', 'ND: ME CK TIEN AN THANG 10'], app: 'Tin nhắn' },
        'tin này là mẹ e ck tiền ăn thật ko ạ hay lại lừa'
      ]
    },
    view: {
      kind: 'chat', app: 'sms',
      contact: { name: 'SaoVietBank', avatar: '🏦', color: '#b91c1c', sub: '[[c-brand|Tin nhắn SMS · Cùng luồng tin cũ]]' },
      messages: [
        { who: 'sys', text: '12/10 08:15' },
        { who: 'them', text: 'SaoVietBank: TK 0071xxx896 -150,000VND luc 08:14 12/10/2026. SD: 1,235,000VND. ND: NAP TIEN DIEN THOAI' },
        { who: 'sys', text: 'Hôm nay 18:57' },
        { who: 'them', text: 'SaoVietBank: TK [[c-mask|0071xxx896]] +2,000,000VND luc 18:57 19/10/2026. SD: 3,085,000VND. [[c-memo|ND: ME CK TIEN AN THANG 10]]' },
        { who: 'them', text: 'SaoVietBank: [[c-warn|Ngan hang KHONG yeu cau Quy khach cung cap OTP, mat khau qua dien thoai, tin nhan. Hotline 1900 6060]]' }
      ]
    },
    clues: {
      'c-brand': 'Tên người gửi đúng "SaoVietBank", và tin nằm chung luồng với các tin biến động số dư cũ bạn từng nhận. Dấu hiệu tốt.',
      'c-mask': 'Số tài khoản được che bớt và khớp với tài khoản của chính bạn. Tin chỉ báo thông tin, không có link nào.',
      'c-memo': 'Nội dung chuyển khoản khớp với việc mẹ hay gửi tiền ăn. Không đòi bạn làm gì, không đòi trả lại tiền.',
      'c-warn': 'Tin còn nhắc chính bạn đừng đưa OTP và ghi đúng tổng đài 1900 6060. Ngân hàng thật hay nhắc như vậy.'
    },
    evidence: {
      account: { number: '0071xxx896', bank: 'Ngân hàng Sao Việt', owner: 'LE KHANH LINH', reports: 0, bad: false, detail: 'Đây là tài khoản của chính Linh. Mở app SaoViet Mobile thấy đúng giao dịch +2.000.000đ từ tài khoản của mẹ lúc 18:57.', clue: 'c-mask' }
    },
    answer: 'trust',
    consequence: 'Nếu Linh báo cáo và xóa tin, cũng không sao, nhưng Linh sẽ lo lắng vô cớ và có thể bỏ qua cả những thông báo thật quan trọng từ ngân hàng.',
    explain: 'Brandname đúng, nằm chung luồng tin cũ, không có link, không đòi OTP hay tiền, và số dư khớp trong app.',
    rule: 'Tin ngân hàng chỉ báo thông tin, không link, không đòi gì: vẫn tự kiểm tra trong app là yên tâm.'
  },
  {
    id: 'impersonate-4', type: 'impersonate', title: 'Mẹ nhắn từ số mới',
    reporter: 'Hoài An · K49 GD Tiểu học',
    report: {
      from: 'Trần Hoài An', sub: 'SV năm 2 · Khoa Giáo dục Tiểu học',
      msgs: [
        { time: '15:20' },
        'em chào anh chị ạ',
        'mẹ em vừa nhắn zalo bằng số mới, bảo điện thoại cũ hỏng nên mua sim mới',
        { shot: ['Mẹ ❤️', 'An ơi nạp giúp mẹ 500k tiền điện thoại vào số này', 'mẹ đang ở chợ ko ra cây được', 'nạp xong nhắn mẹ'], app: 'Zalo' },
        'ảnh đại diện đúng ảnh mẹ em, cách nói cũng giống',
        'nhưng e gọi số cũ thì thuê bao ko liên lạc được, e hơi phân vân 😅'
      ]
    },
    view: {
      kind: 'chat', app: 'zalo',
      contact: { name: 'Mẹ ❤️', avatar: '👩', color: '#db2777', sub: '[[c-newnum|Số mới · 0879 xxx 451 · Chưa lưu trong danh bạ]]' },
      messages: [
        { who: 'sys', text: 'Hôm nay 14:52' },
        { who: 'them', text: 'An ơi mẹ đây. [[c-broken|Điện thoại cũ của mẹ hỏng rồi]], mẹ dùng số này nhé con' },
        { who: 'me', text: 'dạ mẹ, máy hỏng sao vậy mẹ' },
        { who: 'them', text: 'Rơi xuống nước con ạ. Mà con [[c-topup|nạp giúp mẹ 500 nghìn tiền điện thoại vào số này]] với, mẹ đang ở chợ không ra cây được' },
        { who: 'them', text: 'Nạp qua app ngân hàng của con ấy, xong nhắn mẹ' },
        { who: 'me', text: 'để con gọi mẹ nhé' },
        { who: 'them', text: '[[c-nocall|Mẹ đang ồn lắm không nghe được, con nạp đi]] tối mẹ gọi' }
      ]
    },
    clues: {
      'c-newnum': 'Một số lạ chưa có trong danh bạ tự xưng là mẹ. Có thể thật, nhưng ai cũng lấy được ảnh đại diện của mẹ để đặt cho nick mới.',
      'c-broken': '"Điện thoại hỏng, dùng số mới" là cách mở màn quen thuộc của kẻ giả danh người thân, vì nó giải thích vì sao số cũ không liên lạc được.',
      'c-topup': 'Số tiền nhỏ, việc nghe rất bình thường, nên dễ làm theo. Nhưng tiền nạp vào số lạ thì không lấy lại được.',
      'c-nocall': 'Né cuộc gọi. Người thân thật thường sẽ nghe máy hoặc gọi lại cho con ngay.'
    },
    evidence: {
      profile: { bad: true, created: 'Hôm nay', friends: '2 bạn bè (không có ai trong gia đình)', detail: 'Tài khoản Zalo vừa tạo sáng nay, ảnh đại diện trùng ảnh trên trang cá nhân ViệtBook của mẹ An. Chưa đủ để kết luận, cần hỏi trực tiếp mẹ.', clue: 'c-newnum' }
    },
    answer: 'suspect',
    consequence: 'Nếu An nạp ngay, 500.000đ biến mất và kẻ gian sẽ xin thêm "nạp thêm 1 triệu nữa". Nếu An chặn luôn mà đó đúng là mẹ, mẹ sẽ không liên lạc được với con khi đang cần.',
    explain: 'Tin nhắn có thể là thật nhưng chưa xác minh được. Hãy gọi lại số cũ, hoặc nhờ bố, người nhà ở cạnh mẹ xác nhận rồi mới nạp.',
    rule: 'Người thân đổi số rồi nhờ việc liên quan tiền: xác minh qua người nhà hoặc số cũ trước đã.'
  },
  {
    id: 'impersonate-5', type: 'impersonate', title: 'Tin khóa tài khoản',
    reporter: 'Bảo Ngọc · K48 Hóa học',
    report: {
      from: 'Vũ Bảo Ngọc', sub: 'SV năm 3 · Khoa Hóa học',
      msgs: [
        { time: '07:48' },
        'ad check hộ e tin này vs',
        { shot: ['SaoVietBank', 'Tai khoan cua Quy khach se bi tam khoa', 'trong 24h do chua cap nhat sinh trac hoc', 'saovietbank-xacthuc.top'], app: 'Tin nhắn' },
        'e chưa làm sinh trắc học thật 🥲 mà sao nó ko nằm chung chỗ tin biến động số dư',
        'link vô thì giống y app luôn á'
      ]
    },
    view: {
      kind: 'chat', app: 'sms',
      contact: { name: 'SaoVietBank.', avatar: '🏦', color: '#b91c1c', sub: '[[c-sender|Tin nhắn SMS · Cuộc trò chuyện mới]]' },
      messages: [
        { who: 'sys', text: 'Hôm nay 07:31' },
        { who: 'them', text: 'SaoVietBank: Tai khoan cua Quy khach [[c-lock|se bi tam khoa trong 24h]] do chua cap nhat sinh trac hoc theo quy dinh moi cua NHNN.' },
        { who: 'them', text: 'Quy khach vui long cap nhat ngay tai: [[c-link|https://saovietbank-xacthuc.top]] de tranh gian doan giao dich.' },
        { who: 'them', text: 'Sau khi dang nhap, [[c-otp|nhap ma OTP gui ve dien thoai]] de hoan tat xac thuc. Tran trong!' }
      ]
    },
    clues: {
      'c-sender': 'Tên người gửi thừa một dấu chấm, và tin nằm ở luồng riêng chứ không chung với tin biến động số dư thật: dấu hiệu tin nhắn mạo danh qua trạm phát sóng giả.',
      'c-lock': 'Dọa khóa tài khoản trong 24h để bạn sợ mà bấm link ngay.',
      'c-link': 'Tên miền thêm "-xacthuc" và đuôi .top. Trang thật của ngân hàng chỉ là saovietbank.vn.',
      'c-otp': 'Ngân hàng không bao giờ bảo bạn nhập OTP trên một trang mở từ tin nhắn. Nhập vào là mất tiền.'
    },
    evidence: {
      link: { url: 'https://saovietbank-xacthuc.top', bad: true, highlight: '-xacthuc.top', detail: 'Tên miền đăng ký 2 ngày trước, máy chủ ở nước ngoài. Giao diện chép y hệt SaoViet Mobile để lấy tên đăng nhập, mật khẩu và OTP.', clue: 'c-link' }
    },
    answer: 'report',
    consequence: 'Ngọc nhập tài khoản, mật khẩu rồi OTP. 3 phút sau 9.200.000đ trong tài khoản bị chuyển sạch sang 4 tài khoản lạ.',
    explain: 'Ngân hàng không gửi link bắt đăng nhập hay nhập OTP. Muốn cập nhật sinh trắc học thì tự mở app SaoViet Mobile hoặc ra quầy.',
    rule: 'Tin "ngân hàng" có link: không bấm, tự mở app chính thức hoặc gọi 1900 6060.'
  },

  /* ===================== ĐẦU TƯ, VIỆC LÀM ONLINE ===================== */
  {
    id: 'job-1', type: 'job', title: 'CTV like video 15k',
    reporter: 'Thảo Vy · K49 Hóa học',
    report: {
      from: 'Lê Thảo Vy', sub: 'SV năm 2 · Khoa Hóa học',
      msgs: [
        { time: '22:36' },
        'ad ơi cứu e với 😭',
        'e thấy bài tuyển ctv trong nhóm Việc làm thêm SV Sao Mai, like video vs đánh giá shop 15k/lượt',
        'làm 3 lượt dc ck 45k thật nên e tin',
        'h họ bảo phải làm nhiệm vụ VIP, nạp 500k để nhận lại 650k',
        { shot: ['Nhiệm vụ VIP số 4: nạp 500.000đ', 'STK 1903 6688 2468 - Ngân hàng Sao Mai', 'Chủ TK: LE THI HOA', 'Hoàn thành trong 15p để nhận 650.000đ nha em'], app: 'Zalo' },
        'e chưa ck đâu ạ. có nên làm ko ad 🥲'
      ]
    },
    view: {
      kind: 'post',
      author: { name: 'Hương Giang Tuyển Dụng', avatar: '👩', color: '#db2777', meta: 'Việc làm thêm SV Sao Mai · [[c-acc|Thành viên mới tham gia nhóm]] · 2 giờ' },
      text: '🔥🔥 CẦN GẤP 20 BẠN CTV LÀM ONLINE TẠI NHÀ 🔥🔥\n👉 Công việc: like video, đánh giá 5 sao cho shop, tăng tương tác\n💵 [[c-pay|15k/lượt, làm 10 phút được 150k]]\n✅ Không cần kinh nghiệm, chỉ cần điện thoại\n✅ Làm xong có [[c-vip|nhiệm vụ VIP hoa hồng 30%]]\n📩 [[c-zalo|Ib riêng em qua Zalo 0879.xxx.312 để nhận việc]], không trả lời bình luận nha',
      link: { url: 'ctv-tuongtac-saomai.online', title: 'Đăng ký CTV nhận việc ngay', clue: 'c-link' },
      stats: '👍 312 · 💬 208 · ↗ 45',
      comments: [
        { name: 'Bảo Ngọc', text: 'Mình làm 3 hôm rút được [[c-shill|1tr2 rồi nè]], uy tín nha mọi người' },
        { name: 'Minh Khang', text: 'Ib em với chị ơi' },
        { name: 'Đức Huy', text: 'Ủa sao việc like video mà trả cao z' }
      ]
    },
    clues: {
      'c-acc': 'Người đăng mới vào nhóm, chưa từng tương tác gì. Kẻ gian hay xin vào nhóm sinh viên chỉ để rải bài.',
      'c-pay': 'Bấm like 10 phút được 150k thì ai cũng bỏ học đi làm rồi. Việc nhẹ lương cao là dấu hiệu đầu tiên.',
      'c-vip': '"Nhiệm vụ VIP" chính là chỗ bắt nạp tiền. Làm nhiệm vụ mà phải nạp tiền để rút thưởng luôn là lừa đảo.',
      'c-zalo': 'Kéo bạn ra Zalo riêng, né bình luận công khai để người khác không cảnh báo được bạn.',
      'c-link': 'Tên miền .online gắn chữ "saomai" để trông thân quen, không phải trang của trường hay công ty nào.',
      'c-shill': 'Bình luận khoe rút tiền từ tài khoản ảo, cùng một nhóm người với người đăng bài.'
    },
    evidence: {
      link: { url: 'ctv-tuongtac-saomai.online', bad: true, highlight: '-saomai.online', detail: 'Tên miền đăng ký 6 ngày trước, ẩn thông tin chủ sở hữu. Không liên quan gì tới ĐH Sao Mai.', clue: 'c-link' },
      account: { number: BONG_DEM_ACC, bank: 'Ngân hàng Sao Mai', owner: 'LE THI HOA', reports: 52, bad: true, detail: 'Tài khoản này đã bị báo cáo 52 lần, đổi tên chủ nhiều lần nhưng vẫn cùng một số. Đường dây "Bóng Đêm" đây rồi.', clue: 'c-vip' },
      profile: { bad: true, created: '9 ngày trước', friends: '14 bạn bè', detail: 'Ảnh đại diện lấy từ trang của một người mẫu. Tài khoản tham gia 37 nhóm việc làm sinh viên trong một tuần.', clue: 'c-acc' }
    },
    answer: 'report',
    consequence: 'Vy nạp 500.000đ, được báo "sai cú pháp, nạp thêm 2.000.000đ để mở khóa". Tổng cộng mất 2,5 triệu, không rút được đồng nào.',
    explain: '45k được trả lúc đầu chỉ là mồi để Vy tin rồi nạp số tiền lớn hơn gấp nhiều lần.',
    rule: 'Việc thật trả tiền cho bạn. Việc bắt bạn nạp tiền là lừa đảo.'
  },
  {
    id: 'job-2', type: 'job', title: 'Chuyên gia sàn vàng',
    reporter: 'Quốc Bảo · K47 Toán',
    report: {
      from: 'Phạm Quốc Bảo', sub: 'SV năm 3 · Khoa Toán',
      msgs: [
        { time: '14:05' },
        'ad check giúp cái sàn này',
        'ông này tự kết bạn zalo, bảo là chuyên gia vàng',
        'lãi 30%/tháng, có nhóm 300 ng ngày nào cũng khoe lãi',
        { shot: ['Nạp tối thiểu 3tr, cam kết không lỗ', 'saovang-trade.top', 'Em vào nhóm VIP xem anh em chốt lời nhé', 'Hôm nay còn 5 suất'], app: 'Zalo' },
        'tiền làm thêm cả kỳ của t có 5tr. đang tính bỏ 3tr vào'
      ]
    },
    view: {
      kind: 'chat', app: 'zalo',
      contact: { name: 'Chuyên gia Hoàng Long - Đầu tư Vàng', avatar: '👨‍🏫', color: '#ca8a04', sub: '[[c-stranger|Người lạ · Bạn chưa kết bạn]]' },
      messages: [
        { who: 'sys', text: 'Hôm qua 20:41' },
        { who: 'them', text: 'Chào em, anh thấy em trong nhóm sinh viên Sao Mai. Anh đang hướng dẫn miễn phí các bạn trẻ đầu tư vàng online' },
        { who: 'them', text: 'Sàn anh làm [[c-profit|lãi 30%/tháng, cam kết không lỗ]], vốn ít cũng tham gia được' },
        { who: 'me', text: 'sàn tên gì a' },
        { who: 'them', text: 'Em đăng ký ở [[c-link|saovang-trade.top]] rồi nạp qua tài khoản hỗ trợ của sàn nhé' },
        { who: 'them', text: 'Nhóm VIP anh em [[c-group|hôm nay chốt lời 4tr7, 6tr2]] đó em, ảnh chụp đầy nhóm' },
        { who: 'sys', text: 'Hôm nay 13:52' },
        { who: 'them', text: 'Nạp tối thiểu 3tr vào [[c-acc|STK 0912 4455 7789 PHAM THI THU]]. [[c-rush|Hôm nay còn 5 suất]] thôi em ơi' }
      ]
    },
    clues: {
      'c-stranger': 'Người lạ tự tìm đến mời đầu tư. Chuyên gia thật không đi nhắn từng sinh viên trên Zalo.',
      'c-profit': '"Lãi 30% mỗi tháng, cam kết không lỗ" là dấu hiệu chắc chắn của lừa đảo. Đầu tư thật luôn có rủi ro.',
      'c-link': 'Đuôi .top rẻ tiền, sàn giao dịch hợp pháp không dùng tên miền kiểu này.',
      'c-group': 'Nhóm khoe lãi toàn tài khoản ảo và ảnh chụp chỉnh sửa, dựng lên để bạn sợ bỏ lỡ.',
      'c-acc': 'Sàn đầu tư mà bắt nạp vào tài khoản cá nhân của một người lạ.',
      'c-rush': 'Hối thúc "còn 5 suất" để bạn không kịp suy nghĩ hay hỏi ai.'
    },
    evidence: {
      link: { url: 'saovang-trade.top', bad: true, highlight: '.top', detail: 'Tên miền mới đăng ký 3 tuần, máy chủ đặt ở nước ngoài. Đã có 18 báo cáo trên canhbao.ncsc.gov.vn.', clue: 'c-link' },
      account: { number: '0912 4455 7789', bank: 'Ngân hàng Phương Nam', owner: 'PHAM THI THU', reports: 23, bad: true, detail: 'Tài khoản cá nhân, bị báo cáo 23 lần với nội dung "sàn đầu tư ảo". Không phải tài khoản của công ty nào.', clue: 'c-acc' },
      profile: { bad: true, created: '1 tháng trước', friends: '4.900 bạn bè (gần chạm giới hạn)', detail: 'Ảnh đại diện mặc vest chụp từ một trang tin tài chính nước ngoài. Tài khoản kết bạn hàng loạt với sinh viên.', clue: 'c-stranger' }
    },
    answer: 'report',
    consequence: 'Bảo nạp 3 triệu, tài khoản trên sàn báo lãi 900k sau một tuần. Khi bấm rút, sàn đòi "phí thuế thu nhập" 1,5 triệu. Bảo nạp tiếp rồi sàn đóng cửa, mất 4,5 triệu.',
    explain: 'Không có khoản đầu tư hợp pháp nào cam kết lãi 30% mỗi tháng mà không lỗ.',
    rule: 'Hứa lãi cao, cam kết không lỗ: chắc chắn là lừa.'
  },
  {
    id: 'job-3', type: 'job', title: 'Phục vụ quán cà phê',
    reporter: 'Hoàng Nam · K50 Tin học',
    report: {
      from: 'Đỗ Hoàng Nam', sub: 'SV năm 1 · Khoa Tin học',
      msgs: [
        { time: '19:48' },
        'chào ad, e hỏi chút ạ',
        'e có bình luận "e quan tâm" dưới bài tuyển part time, xong có chị nhắn messenger bảo là quản lý quán Gác Nhỏ Coffee',
        'hẹn e sáng t7 qua phỏng vấn, 22k/h',
        { shot: ['Em gửi chị ảnh CCCD 2 mặt để chị làm hồ sơ trước nhé', 'Quán ở số 18 ngõ 7 đường Hoa Sữa', 'Sáng thứ 7 9h em qua phỏng vấn'], app: 'Messenger' },
        'chưa thấy đòi tiền j. mà e ko biết quán này có thật ko 😅 có nên gửi cccd ko ạ'
      ]
    },
    view: {
      kind: 'chat', app: 'messenger',
      contact: { name: 'Quỳnh Trang', avatar: '👩', color: '#0891b2', sub: '[[c-notfriend|Không phải bạn bè trên ViệtBook]]' },
      messages: [
        { who: 'sys', text: 'Hôm nay 18:30' },
        { who: 'them', text: 'Chào em, chị là Trang quản lý bên [[c-shop|Gác Nhỏ Coffee]], thấy em bình luận dưới bài tuyển nhân viên' },
        { who: 'them', text: 'Quán cần bạn phục vụ ca tối 18h-22h, [[c-pay|22k/h]], tuần làm ít nhất 4 ca nha em' },
        { who: 'me', text: 'dạ vâng chị, em làm được ca tối ạ' },
        { who: 'them', text: 'Ok em, sáng thứ 7 9h em qua phỏng vấn ở [[c-addr|số 18 ngõ 7 đường Hoa Sữa]] nhé' },
        { who: 'them', text: 'À em [[c-cccd|gửi chị ảnh CCCD 2 mặt]] để chị làm hồ sơ trước cho nhanh' }
      ]
    },
    clues: {
      'c-notfriend': 'Một tài khoản cá nhân nhắn tới, chưa có gì cho thấy chị ấy làm ở quán thật.',
      'c-shop': 'Có tên quán cụ thể. Hãy tự tìm trang chính thức hoặc số điện thoại của quán để hỏi lại.',
      'c-pay': 'Mức lương bình thường với việc phục vụ, không phải kiểu "việc nhẹ lương cao". Đây là điểm tốt.',
      'c-addr': 'Hẹn phỏng vấn trực tiếp ở một địa chỉ cụ thể là dấu hiệu tốt, nhưng cần kiểm tra địa chỉ đó có quán thật không.',
      'c-cccd': 'Chưa phỏng vấn đã xin ảnh CCCD qua tin nhắn. Đừng gửi, hãy mang CCCD đến khi phỏng vấn trực tiếp.'
    },
    evidence: {
      profile: { bad: false, created: '4 năm trước', friends: '612 bạn bè', detail: 'Tài khoản có thật, có vài ảnh chụp ở một quán cà phê. Nhưng chưa xác nhận được chị ấy là quản lý, cần gọi số của quán để hỏi.', clue: 'c-notfriend' }
    },
    answer: 'suspect',
    consequence: 'Nếu tin ngay và gửi ảnh CCCD, Nam có thể bị dùng giấy tờ để mở tài khoản ngân hàng hay vay tiền online. Nếu chặn luôn, Nam có thể bỏ lỡ một việc làm thêm thật.',
    explain: 'Chưa đòi tiền và có hẹn phỏng vấn trực tiếp là dấu hiệu tốt, nhưng phải tự kiểm tra quán qua kênh chính thức và không gửi CCCD trước.',
    rule: 'Tự tìm số của quán để hỏi, đến tận nơi phỏng vấn, giấy tờ giữ trong túi.'
  },
  {
    id: 'job-4', type: 'job', title: 'Phí giữ lớp gia sư',
    reporter: 'Ngọc Trâm · K49 GD Tiểu học',
    report: {
      from: 'Trần Ngọc Trâm', sub: 'SV năm 2 · Khoa Giáo dục Tiểu học',
      msgs: [
        { time: '16:20' },
        'dạ em chào anh chị ạ',
        'em có để lại sđt trên một nhóm tìm gia sư, giờ có trung tâm nhắn nhận lớp cho em',
        'lớp toán lớp 4, 3 buổi/tuần, 1tr8/tháng ạ',
        { shot: ['TT Gia su Tri Thuc Viet: Ban duoc nhan lop Toan 4', 'Phi giu lop 50% luong thang dau = 900.000d', 'STK 1903 6688 2468 NGUYEN VAN BONG', 'Truoc 17h hom nay'], app: 'Tin nhắn' },
        'em hỏi đóng sau buổi đầu được không thì họ bảo không ạ. em sắp hết hạn rồi, mong anh chị xem giúp em 😅'
      ]
    },
    view: {
      kind: 'chat', app: 'sms',
      contact: { name: '+84 868 xxx 245', avatar: '👤', color: '#64748b', sub: 'Tin nhắn SMS' },
      messages: [
        { who: 'sys', text: 'Hôm nay 15:02' },
        { who: 'them', text: 'TT Gia su [[c-center|Tri Thuc Viet]]: Chuc mung ban Ngoc Tram da duoc nhan lop Toan 4, 3 buoi/tuan, luong 1.800.000d/thang. Phu huynh can gia su gap.' },
        { who: 'them', text: 'De giu lop ban vui long dong [[c-fee|phi giu lop 50% luong thang dau = 900.000d]] vao [[c-acc|STK 1903 6688 2468 NGUYEN VAN BONG]], noi dung: SDT + ten.' },
        { who: 'me', text: 'Dạ em có thể đóng sau khi dạy buổi đầu được không ạ?' },
        { who: 'them', text: 'Ko dc ban nhe, lop nay [[c-rush|co 5 ban dang cho, truoc 17h hom nay]] ko ck TT se giao cho ban khac.' },
        { who: 'them', text: 'Sau khi ck TT gui [[c-noaddr|so phu huynh qua Zalo]], ban tu lien he di day nhe.' }
      ]
    },
    clues: {
      'c-center': 'Trung tâm không có địa chỉ, không có website, chỉ nhắn từ một số di động cá nhân.',
      'c-fee': 'Chưa dạy buổi nào đã bắt nộp nửa tháng lương. Việc thật không bắt bạn đặt cọc trước.',
      'c-acc': 'Tiền "phí giữ lớp" lại chuyển vào tài khoản cá nhân, không phải tài khoản của một trung tâm.',
      'c-rush': 'Dọa giao lớp cho người khác, hẹn giờ gấp để bạn chuyển tiền trước khi kịp kiểm tra.',
      'c-noaddr': 'Đóng tiền xong mới đưa số phụ huynh. Đóng rồi thì số đó thường không liên lạc được.'
    },
    evidence: {
      account: { number: BONG_DEM_ACC, bank: 'Ngân hàng Sao Mai', owner: 'NGUYEN VAN BONG', reports: 61, bad: true, detail: 'Vẫn là số tài khoản này, lần này đứng tên NGUYEN VAN BONG. Đã bị báo cáo 61 lần trong các vụ việc làm và trúng thưởng.', clue: 'c-acc' },
      profile: { bad: true, created: 'Không tìm thấy', friends: 'Không có trang ViệtBook hay website', detail: 'Không có "Trung tâm Gia sư Trí Thức Việt" nào đăng ký kinh doanh. Số điện thoại này bị nhiều sinh viên phản ánh trong nhóm gia sư.', clue: 'c-center' }
    },
    answer: 'report',
    consequence: 'Trâm chuyển 900.000đ. Số phụ huynh được gửi qua Zalo không ai nghe máy, số "trung tâm" chặn Trâm ngay tối đó.',
    explain: 'Trung tâm gia sư đàng hoàng có địa chỉ, ký hợp đồng và không bắt nộp tiền vào tài khoản cá nhân trước khi dạy.',
    rule: 'Chưa đi làm đã phải nộp tiền: đừng nộp.'
  },
  {
    id: 'job-5', type: 'job', title: 'Ngày hội việc làm',
    reporter: 'Khánh Linh · K47 Tâm lý học',
    report: {
      from: 'Vũ Khánh Linh', sub: 'SV năm 4 · Khoa Tâm lý học',
      msgs: [
        { time: '09:31' },
        'chào văn phòng ạ',
        'mấy hôm nay toàn thấy lừa tuyển dụng nên giờ em sợ luôn cả email của trường 😅',
        { shot: ['Trung tâm Hỗ trợ sinh viên - ĐH Sao Mai', 'Ngày hội Việc làm Sinh viên 2026', 'Thứ Bảy 31/10, Nhà thi đấu đa năng', 'Miễn phí, đăng ký trên online.saomai.edu.vn'], app: 'Gmail' },
        'em sắp tốt nghiệp nên muốn đi lắm. nhờ mọi người xem có đúng của trường không ạ'
      ]
    },
    view: {
      kind: 'email',
      from: { name: 'Trung tâm Hỗ trợ sinh viên - ĐH Sao Mai', addr: '[[c-mail|hotrosinhvien@saomai.edu.vn]]' },
      to: 'linh.vk47@sv.saomai.edu.vn',
      subject: 'Thư mời tham dự Ngày hội Việc làm Sinh viên 2026',
      date: 'Th 4, 14 thg 10, 09:05',
      body: 'Thân gửi các bạn sinh viên năm 3, năm 4,\n\nTrung tâm Hỗ trợ sinh viên trân trọng mời các bạn tham dự Ngày hội Việc làm Sinh viên 2026 với sự tham gia của hơn 40 doanh nghiệp.\n\n🕗 Thời gian: 8h00 - 16h30, Thứ Bảy 31/10/2026\n📍 Địa điểm: [[c-place|Nhà thi đấu đa năng, khuôn viên ĐH Sao Mai]]\n\nSự kiện [[c-free|hoàn toàn miễn phí, không thu bất kỳ khoản phí nào]]. Các bạn mang theo thẻ sinh viên và CV bản in để nộp trực tiếp cho doanh nghiệp.\n\nĐăng ký tham dự tại mục Sự kiện trên [[c-portal|cổng thông tin online.saomai.edu.vn]] (đăng nhập bằng tài khoản sinh viên).\n\nTrân trọng.',
      sig: 'Trung tâm Hỗ trợ sinh viên\nTrường Đại học Sao Mai\nTầng 1, Nhà A2 · [[c-phone|ĐT: (024) 3755 1234]] · saomai.edu.vn'
    },
    clues: {
      'c-mail': 'Gửi từ đúng tên miền saomai.edu.vn của trường, tới email sinh viên của chính bạn. Dấu hiệu tốt.',
      'c-place': 'Tổ chức ngay trong khuôn viên trường, gặp doanh nghiệp trực tiếp. Không có gì phải lén lút.',
      'c-free': 'Nói rõ miễn phí, không đòi chuyển khoản. Ngược hẳn với các vụ việc làm lừa đảo.',
      'c-portal': 'Đăng ký trên cổng thông tin chính thức của trường, không phải một đường link lạ.',
      'c-phone': 'Có địa chỉ văn phòng và số máy bàn để bạn tự gọi hỏi lại khi cần.'
    },
    evidence: {
      link: { url: 'online.saomai.edu.vn', bad: false, detail: 'Đúng cổng thông tin sinh viên chính thức của ĐH Sao Mai. Sự kiện cũng được đăng trên trang saomai.edu.vn.', clue: 'c-portal' }
    },
    answer: 'trust',
    consequence: 'Nếu chặn và báo cáo, Linh bỏ lỡ ngày hội có hơn 40 doanh nghiệp tuyển dụng, đúng lúc sắp tốt nghiệp cần tìm việc.',
    explain: 'Email đến từ tên miền chính thức của trường, sự kiện tổ chức tại trường, miễn phí và đăng ký qua cổng sinh viên.',
    rule: 'Tìm việc qua nhà trường: đúng tên miền, đúng cổng, không mất tiền.'
  },

  /* ===================== LINK GIẢ MẠO (PHISHING) ===================== */
  {
    id: 'phishing-1', type: 'phishing', title: 'Bình chọn ảnh giúp tớ',
    reporter: 'Thu Hà · K49 Sinh học',
    report: {
      from: 'Phạm Thu Hà', sub: 'SV năm 1 · Khoa Sinh học',
      msgs: [
        { time: '22:31' },
        'ad ơi',
        'bạn cùng lớp e nhắn nhờ bình chọn cuộc thi ảnh, e bấm vào thì nó bắt đăng nhập ViệtBook',
        { shot: ['Linh Đan: Hà ơi bình chọn giúp tớ với', 'tớ đang thi ảnh của khoa, thiếu có mấy vote thôi', 'vietbook-binhchon.top/vote?id=2831'], app: 'Messenger' },
        'e nhập rồi mà nó báo sai mật khẩu, e nhập lại lần 2 vẫn sai 😭',
        'giờ e phải làm j ạ'
      ]
    },
    view: {
      kind: 'chat', app: 'messenger',
      contact: { name: 'Linh Đan', avatar: '👧', color: '#ec4899', sub: '[[c-active|Hoạt động 2 phút trước]]' },
      messages: [
        { who: 'sys', text: 'Hôm nay 22:14' },
        { who: 'them', text: 'Hà ơi' },
        { who: 'them', text: '[[c-ask|bình chọn giúp tớ cuộc thi ảnh với]], tớ đang thi ảnh "Mùa thu Sao Mai" của khoa nè' },
        { who: 'them', text: 'thiếu có mấy vote thôi là vào top 3 rồi 🥺 [[c-rush|tối nay 12h đóng cổng]]' },
        { who: 'them', text: '[[c-link|vietbook-binhchon.top/vote?id=2831]]' },
        { who: 'me', text: 'ok để tớ vào' },
        { who: 'me', text: 'ơ sao nó bắt đăng nhập vậy' },
        { who: 'them', text: '[[c-login|đăng nhập bằng vietbook để chống vote ảo ấy, bình thường mà]]' },
        { who: 'them', text: '[[c-style|Bạn vote xong nhắn lại mình nhé, cảm ơn bạn nhiều]]' }
      ]
    },
    clues: {
      'c-active': 'Đan vừa online đã nhắn ngay cho hàng loạt bạn cùng lớp cùng một nội dung. Nick bị hack thường hoạt động bất thường như vậy.',
      'c-ask': 'Nhờ bình chọn là chiêu quen thuộc: dựa vào lòng tốt với bạn bè để dụ bấm link.',
      'c-rush': 'Hối thúc "12h đóng cổng" để cháu bấm vội, không kịp gọi hỏi Đan.',
      'c-link': 'Tên miền vietbook-binhchon.top không phải vietbook.vn. Thêm dấu gạch và đuôi .top là trang giả.',
      'c-login': 'Trang bình chọn mà bắt đăng nhập ViệtBook là bẫy chiếm tài khoản. Mật khẩu cháu gõ vào sẽ về tay kẻ gian.',
      'c-style': 'Đan vẫn xưng "tớ", "cậu" mà câu này đổi sang "mình", "bạn" như văn mẫu. Có người khác đang cầm nick.'
    },
    evidence: {
      link: { url: 'vietbook-binhchon.top/vote?id=2831', bad: true, highlight: '-binhchon.top', detail: 'Tên miền đăng ký 2 ngày trước, máy chủ ở nước ngoài. Trang chỉ có một ô đăng nhập giả giao diện ViệtBook, luôn báo "sai mật khẩu" để bạn gõ lại lần nữa.', clue: 'c-link' },
      profile: { bad: true, created: '4 năm trước', friends: '612 bạn bè', detail: 'Tài khoản thật của Linh Đan nhưng vừa đổi email khôi phục lúc 21:58 tối nay. Trong 30 phút đã gửi cùng một link cho 47 người.', clue: 'c-active' }
    },
    answer: 'report',
    consequence: 'Hà mất nick ViệtBook. Sáng hôm sau, nick của Hà nhắn cả lớp hỏi vay 2 triệu và gửi tiếp link "bình chọn" cho 80 người khác.',
    explain: 'Trang bình chọn thật không bao giờ bắt đăng nhập ViệtBook trên một tên miền lạ.',
    rule: 'Bình chọn mà bắt đăng nhập: đóng tab, gọi bạn hỏi.'
  },
  {
    id: 'phishing-2', type: 'phishing', title: 'Đăng nhập ở thư viện',
    reporter: 'Hải Yến · K49 Tâm lý học',
    report: {
      from: 'Trịnh Hải Yến', sub: 'SV năm 1 · Khoa Tâm lý học',
      msgs: [
        { time: '15:26' },
        'dạ em chào anh chị ạ',
        'em vừa nhận mail ViệtBook báo có đăng nhập mới, em sợ bị hack giống bạn cùng phòng',
        { shot: ['ViệtBook', 'Có lần đăng nhập mới vào tài khoản của bạn', 'Windows · Chrome · Thư viện ĐH Sao Mai', '15:09, 19/10'], app: 'Gmail' },
        'nhưng mà lúc 3h em có mượn laptop ở thư viện để đăng nhập thật ạ',
        'em có cần đổi mật khẩu luôn ko ạ'
      ]
    },
    view: {
      kind: 'email',
      from: { name: 'ViệtBook', addr: '[[c-mail|security@vietbook.vn]]' },
      to: 'haiyen.tlh49@gmail.com',
      subject: 'Có lần đăng nhập mới vào tài khoản ViệtBook của bạn',
      date: 'CN, 19 thg 10, 15:10',
      body: 'Chào Hải Yến,\n\nTài khoản của bạn vừa được đăng nhập trên một thiết bị mới:\n\n[[c-detail|Windows · Chrome · Thư viện ĐH Sao Mai, Hà Nội · 15:09, 19/10/2026]]\n\n[[c-noact|Nếu đây là bạn, bạn không cần làm gì thêm.]]\n\nNếu không phải bạn, [[c-app|hãy tự mở ứng dụng ViệtBook, vào Cài đặt > Bảo mật > Nơi bạn đã đăng nhập]] để đăng xuất thiết bị này và đổi mật khẩu.\n\n[[c-nopass|ViệtBook sẽ không bao giờ hỏi mật khẩu hay mã đăng nhập của bạn qua email.]]',
      sig: 'Đội ngũ ViệtBook\nvietbook.vn'
    },
    clues: {
      'c-mail': 'Địa chỉ gửi đúng đuôi @vietbook.vn, không thêm chữ, không dấu gạch. Đây là tín hiệu tốt.',
      'c-detail': 'Thiết bị, nơi chốn và giờ giấc khớp đúng lúc cháu dùng laptop ở thư viện.',
      'c-noact': 'Thư không hối thúc, không dọa khóa, còn bảo "không cần làm gì" nếu là cháu.',
      'c-app': 'Thư hướng dẫn tự mở app để kiểm tra, không đưa link bắt đăng nhập. Đúng cách làm của dịch vụ thật.',
      'c-nopass': 'Thư nói rõ không bao giờ hỏi mật khẩu. Kẻ lừa đảo thì ngược lại.'
    },
    evidence: {
      link: { url: 'vietbook.vn', bad: false, detail: 'Tên miền chính thức của ViệtBook, đăng ký nhiều năm. Thư không chứa link đăng nhập nào, chỉ ghi tên miền ở chữ ký.', clue: 'c-mail' }
    },
    answer: 'trust',
    consequence: 'Nếu coi thư thật là lừa đảo, Yến bỏ qua thói quen tốt: xem lại thiết bị đã đăng nhập. Lần sau có lần đăng nhập lạ thật, Yến có thể bỏ lỡ cảnh báo.',
    explain: 'Thư gửi từ đúng tên miền vietbook.vn, khớp với lần đăng nhập của chính Yến, không có link và không đòi mật khẩu.',
    rule: 'Cảnh báo đúng tên miền, không link, không đòi mật khẩu: là thư thật. Nhớ đăng xuất máy dùng chung.'
  },
  {
    id: 'phishing-3', type: 'phishing', title: 'Khóa nick sau 24h',
    reporter: 'Quốc Bảo · K47 Tin học',
    report: {
      from: 'Đỗ Quốc Bảo', sub: 'SV năm 3 · Khoa Tin học',
      msgs: [
        { time: '07:52' },
        'chào ad',
        'page mình bán đồ handmade trên ViệtBook vừa nhận mail này',
        { shot: ['ViệtBook Security', 'Trang của bạn vi phạm bản quyền', 'sẽ bị vô hiệu hóa sau 24 giờ', '[ KHÁNG NGHỊ ]'], app: 'Gmail' },
        'nhìn khá thật, có logo đàng hoàng. page có 3k follow mất thì tiếc lắm',
        'mình bấm kháng nghị dc ko'
      ]
    },
    view: {
      kind: 'email',
      from: { name: 'ViệtBook Security', addr: '[[c-mail|no-reply@vietbook-support.com]]' },
      to: 'quocbao.handmade@gmail.com',
      subject: '⚠️ Cảnh báo cuối cùng: Trang của bạn sẽ bị vô hiệu hóa',
      date: 'Th 3, 15 thg 10, 06:40',
      body: 'Kính gửi chủ sở hữu Trang,\n\nChúng tôi nhận được báo cáo rằng Trang "Bảo Handmade" đã đăng nội dung [[c-copy|vi phạm bản quyền hình ảnh]] (Mã vụ việc: #VB-88217-CR).\n\nTheo Tiêu chuẩn cộng đồng, Trang của bạn [[c-24h|sẽ bị vô hiệu hóa vĩnh viễn sau 24 giờ]] nếu không gửi kháng nghị.\n\nNếu bạn cho rằng đây là nhầm lẫn, vui lòng bấm nút bên dưới và [[c-pass|xác minh bằng mật khẩu cùng mã đăng nhập]] để chứng minh bạn là quản trị viên.\n\nXin cảm ơn sự hợp tác của bạn.',
      button: { text: 'KHÁNG NGHỊ', clue: 'c-btn' },
      sig: 'Đội ngũ Hỗ trợ Bảo mật ViệtBook\n[[c-sig|Hỗ trợ: vietbook-support.com/help]]'
    },
    clues: {
      'c-mail': 'Thư thật của ViệtBook gửi từ đuôi @vietbook.vn. Đây là vietbook-support.com, một tên miền khác hẳn.',
      'c-copy': 'Không nói rõ ảnh nào vi phạm, ai báo cáo. Thông báo thật luôn chỉ ra bài đăng cụ thể.',
      'c-24h': 'Đếm ngược 24 giờ là chiêu ép bấm vội, kẻ gian luôn hối thúc như vậy.',
      'c-pass': 'Không mạng xã hội nào bắt "xác minh bằng mật khẩu và mã đăng nhập" qua một nút trong email.',
      'c-sig': 'Chữ ký lại ghi trang hỗ trợ ở vietbook-support.com. Trung tâm trợ giúp thật nằm trong vietbook.vn.',
      'c-btn': 'Nút "Kháng nghị" dẫn tới vietbook-support.com/appeal, một trang đăng nhập giả.'
    },
    evidence: {
      link: { url: 'vietbook-support.com/appeal?case=VB-88217', bad: true, highlight: '-support.com', detail: 'Tên miền mới đăng ký 6 ngày, không thuộc ViệtBook. Trang giả chép y giao diện, hỏi mật khẩu rồi hỏi tiếp mã 6 số gửi về điện thoại.', clue: 'c-btn' }
    },
    answer: 'report',
    consequence: 'Bảo nhập mật khẩu và mã đăng nhập. Kẻ gian đổi tên Trang thành "Thanh lý iPhone giá rẻ" để lừa 3.000 người theo dõi, Bảo mất Trang luôn.',
    explain: 'Email "khóa tài khoản sau 24h" gửi từ tên miền lạ và bắt nhập mật khẩu là bẫy chiếm Trang.',
    rule: 'Bị dọa khóa tài khoản: tự mở app kiểm tra, không bấm nút trong thư.'
  },
  {
    id: 'phishing-4', type: 'phishing', title: 'SMS xác thực SaoViet',
    reporter: 'Minh Tuấn · K48 Lịch sử',
    report: {
      from: 'Vũ Minh Tuấn', sub: 'SV năm 2 · Khoa Lịch sử',
      msgs: [
        { time: '19:05' },
        'dạ em chào anh chị ạ, em nhắn hộ mẹ em',
        'mẹ em nhận tin nhắn của SaoVietBank bảo tài khoản bị tạm khóa, phải bấm link cập nhật',
        { shot: ['SaoVietBank', 'Tai khoan cua Quy khach se bi tam khoa', 'cap nhat tai: saovietbank-xacthuc.cc'], app: 'Tin nhắn' },
        'mẹ em bấm vào rồi, đang đến bước nhập tên đăng nhập thì em giật lại máy 😅',
        'mẹ em chưa nhập j đâu ạ. mà nó hiện đúng tên SaoVietBank nên mẹ tin lắm'
      ]
    },
    view: {
      kind: 'chat', app: 'sms',
      contact: { name: 'SaoVietBank', avatar: '🏦', color: '#0f766e', sub: 'Tin nhắn SMS' },
      messages: [
        { who: 'sys', text: 'Th 6, 11 thg 10' },
        { who: 'them', text: 'SaoVietBank: GD -250,000VND tai SONGVIET TOPUP luc 08:12. SD: 4,382,500VND.' },
        { who: 'sys', text: 'Hôm nay 18:47' },
        { who: 'them', text: 'SaoVietBank: [[c-lock|Tai khoan cua Quy khach se bi tam khoa]] do [[c-reason|chua cap nhat sinh trac hoc theo quy dinh moi]]. Quy khach vui long cap nhat [[c-time|truoc 23h59 hom nay]] tai: [[c-link|https://saovietbank-xacthuc.cc]] [[c-typo|de tranh gian doan giao dich.Tran trong]]' }
      ]
    },
    clues: {
      'c-lock': 'Dọa khóa tài khoản để người nhận sợ mà bấm ngay. Ngân hàng thật báo qua app và quầy giao dịch.',
      'c-reason': 'Cập nhật sinh trắc học thật chỉ làm trong app SaoViet Mobile hoặc tại quầy, không qua link.',
      'c-time': 'Hạn chót "23h59 hôm nay" là chiêu hối thúc quen thuộc.',
      'c-link': 'Ngân hàng không gửi link trong SMS. Tên miền thật là saovietbank.vn, đây là saovietbank-xacthuc.cc.',
      'c-typo': 'Thiếu dấu cách sau dấu chấm, câu chữ cẩu thả. Tin của ngân hàng thật được soạn chuẩn.'
    },
    evidence: {
      link: { url: 'saovietbank-xacthuc.cc', bad: true, highlight: '-xacthuc.cc', detail: 'Tên miền đuôi .cc đăng ký ở nước ngoài 3 ngày trước. Kẻ gian dùng trạm phát sóng giả để tin nhắn lọt vào đúng luồng "SaoVietBank" trên điện thoại.', clue: 'c-link' }
    },
    answer: 'report',
    consequence: 'Nếu mẹ Tuấn nhập tên đăng nhập, mật khẩu và mã OTP, toàn bộ 4.382.500đ trong tài khoản sẽ bị chuyển đi chỉ trong vài phút.',
    explain: 'Tin nhắn nằm chung luồng brandname vẫn có thể giả, và ngân hàng không bao giờ gửi link bắt đăng nhập.',
    rule: 'SMS ngân hàng có link: không bấm, gọi tổng đài in sau thẻ.'
  },
  {
    id: 'phishing-5', type: 'phishing', title: 'Tài liệu ôn thi',
    reporter: 'Khánh Linh · K48 Toán',
    report: {
      from: 'Lê Khánh Linh', sub: 'SV năm 2 · Khoa Toán',
      msgs: [
        { time: '23:12' },
        'ad check giúp e cái link này với',
        'trong nhóm lớp có bạn Hoàng gửi tài liệu ôn giải tích, mở ra thì bắt đăng nhập lại tài khoản mới xem dc',
        { shot: ['Đinh Huy Hoàng · K48 Toán Sao Mai', 'Đề cương ôn thi Giải tích 2 + đề các năm', 'drive.goog1e-docs.com/file/d/1aX9...'], app: 'ViệtBook' },
        'Hoàng hay share tài liệu lắm, mà sao lần này lại bắt đăng nhập nhỉ',
        'mai thi r nên e sốt ruột 🥲'
      ]
    },
    view: {
      kind: 'post',
      author: { name: 'Đinh Huy Hoàng', avatar: '👦', color: '#2563eb', meta: 'Nhóm K48 Toán - ĐH Sao Mai · [[c-time|1 giờ trước]] · 👥' },
      text: 'Đề cương ôn thi Giải tích 2 + đề các năm có lời giải nhé mn, [[c-text|ai cần thì tải về trước khi mình xóa]] 📚\nMai thi rồi, cố lên cả lớp 💪',
      link: { url: 'drive.goog1e-docs.com/file/d/1aX9kQ', title: 'De_cuong_Giai_tich_2.pdf · Google Drive', clue: 'c-link' },
      stats: '👍 38 · 💬 12',
      comments: [
        { name: 'Trần Mai Anh', text: 'Sao bắt mình [[c-login|đăng nhập lại tài khoản]] vậy Hoàng?' },
        { name: 'Ngô Đức Minh', text: 'Cảm ơn ông nhé, cứu cả lớp 😂' },
        { name: 'Phương Thảo', text: '[[c-cmt|Hoàng ơi đây có phải ông đăng không, sáng nay ông bảo mất nick mà?]]' }
      ]
    },
    clues: {
      'c-time': 'Bài đăng lúc khuya, đúng đêm trước kỳ thi, lúc cả lớp dễ bấm vội nhất.',
      'c-text': '"Tải trước khi mình xóa" là câu hối thúc nhẹ, không giống cách Hoàng hay chia sẻ.',
      'c-link': 'Tên miền là goog1e-docs.com với số 1 thay chữ l. Trang Drive thật nằm ở drive.google.com.',
      'c-login': 'Mở file chia sẻ công khai mà bắt đăng nhập lại là dấu hiệu trang giả lấy mật khẩu.',
      'c-cmt': 'Có bạn nhắc Hoàng vừa mất nick. Chưa chắc chắn, nhưng đủ để phải hỏi lại chính Hoàng.'
    },
    evidence: {
      link: { url: 'drive.goog1e-docs.com/file/d/1aX9kQ', bad: true, highlight: 'goog1e-docs.com', detail: 'Chữ "l" trong google bị thay bằng số "1". Tên miền này đăng ký 5 ngày trước, mở ra là trang đăng nhập giả chứ không có file PDF nào.', clue: 'c-link' },
      profile: { bad: false, created: '2 năm trước', friends: '384 bạn bè', detail: 'Đây là tài khoản thật của Hoàng, hoạt động bình thường nhiều năm. Chưa rõ Hoàng tự đăng hay nick đang bị người khác dùng.', clue: 'c-cmt' }
    },
    answer: 'suspect',
    consequence: 'Nếu tin luôn, Linh nhập mật khẩu vào trang giả và mất tài khoản. Nếu chặn báo cáo luôn Hoàng, lớp có thể mất một người bạn thật đang bị hack mà cần giúp đỡ.',
    explain: 'Người đăng là bạn thật, nhưng link sai tên miền và đòi đăng nhập lại, nên phải gọi hỏi Hoàng và không nhập mật khẩu.',
    rule: 'Link của bạn quen cũng phải đọc kỹ tên miền, nghi thì hỏi trực tiếp.'
  },

  /* ===================== LỪA LẤY MÃ OTP ===================== */
  {
    id: 'otp-1', type: 'otp', title: 'Bạn thân gửi nhầm mã',
    reporter: 'Bảo Ngân · K48 Ngữ văn',
    report: {
      from: 'Trần Bảo Ngân', sub: 'SV năm 2 · Khoa Ngữ văn',
      msgs: [
        { time: '22:49' },
        'ad ơi cho e hỏi',
        'con bạn thân e nhắn zalo bảo lỡ gửi nhầm mã về số e, nhờ e đọc 6 số',
        { shot: ['Hà Linh 🌸', 'tớ lỡ gửi nhầm mã về số cậu r', 'cậu đọc giúp tớ 6 số với', 'nhanh lên cậu ơi mã hết hạn mất'], app: 'Zalo' },
        'lúc nãy nó còn hỏi mượn 2tr nữa',
        'e gọi thì nó ko nghe 🥲 có sao ko ạ, e sắp đọc cho nó r'
      ]
    },
    view: {
      kind: 'chat', app: 'zalo',
      contact: { name: 'Hà Linh 🌸', avatar: '👧', color: '#f472b6', sub: 'Vừa truy cập' },
      messages: [
        { who: 'sys', text: 'Hôm nay 22:31' },
        { who: 'them', text: 'Ngân ơi cậu ngủ chưa' },
        { who: 'them', text: 'tk ngân hàng tớ đang bị khóa, cậu [[c1-acc|ck tạm tớ 2tr vào stk 1903 6688 2468]] NGUYEN VAN BONG nhé, mai tớ trả liền' },
        { who: 'me', text: 'tớ hết tiền rồi 😅 tuần sau mới có' },
        { who: 'sys', text: 'Hôm nay 22:41' },
        { who: 'them', text: 'thôi ko sao. à tớ đang đổi máy mà [[c1-wrong|lỡ gửi nhầm mã về số cậu]] r' },
        { who: 'them', text: 'cậu đọc giúp tớ 6 số với' },
        { who: 'me', text: 'có tin này nè: "[[c1-code|Ma xac thuc dang nhap Zalo cua ban tren thiet bi moi]] la 593027. Khong chia se ma nay voi bat ky ai"' },
        { who: 'them', text: 'đúng r đó, [[c1-rush|nhanh lên cậu ơi mã hết hạn mất]] 😭' },
        { who: 'me', text: 'tớ gọi cậu nhé' },
        { who: 'them', text: '[[c1-call|tớ đang ở thư viện ko nghe máy được]], cậu nhắn số qua đây là được' }
      ]
    },
    clues: {
      'c1-acc': 'Hà Linh mượn tiền mà số tài khoản lại đứng tên NGUYEN VAN BONG. Bạn thân thật sẽ đưa tài khoản của chính mình.',
      'c1-wrong': 'Không ai "gửi nhầm" mã về số người khác được. Mã OTP luôn về đúng số điện thoại của chủ tài khoản.',
      'c1-code': 'Đọc kỹ tin này: đây là mã đăng nhập Zalo CỦA CHÁU trên một máy lạ. Đưa mã là kẻ gian vào được Zalo của cháu.',
      'c1-rush': 'Hối thúc "mã hết hạn" để cháu không kịp đọc tin và không kịp hỏi ai.',
      'c1-call': 'Không chịu nghe máy, chỉ nhắn tin. Tài khoản của bạn cháu nhiều khả năng đã bị chiếm.'
    },
    evidence: {
      account: { number: BONG_DEM_ACC, bank: 'Ngân hàng Sao Mai', owner: 'NGUYEN VAN BONG', reports: 41, bad: true, detail: 'Tài khoản bị 41 người báo cáo trong 2 tháng, đều là kiểu "bạn bè nhắn mượn tiền gấp". Trùng số với đường dây "Bóng Đêm".', clue: 'c1-acc' },
      profile: { bad: true, created: '2019 (tài khoản thật của Hà Linh)', friends: '486 bạn bè', detail: 'Tài khoản thật nhưng đăng nhập trên thiết bị lạ từ 21:58 tối nay. Trong 30 phút đã nhắn mượn tiền và xin mã cho 17 người trong danh bạ.', clue: 'c1-call' }
    },
    answer: 'report',
    consequence: 'Ngân đọc 6 số. 5 phút sau Zalo của Ngân bị đăng xuất, kẻ gian dùng tài khoản của Ngân nhắn mượn tiền cả lớp và mẹ Ngân. Mẹ Ngân chuyển 3.000.000đ vào tài khoản 1903 6688 2468.',
    explain: 'Mã gửi về máy Ngân là mã đăng nhập Zalo của chính Ngân, "gửi nhầm" chỉ là cái cớ để chiếm tài khoản.',
    rule: 'Mã về máy mình là chìa khóa của mình: bạn thân xin cũng không đưa.'
  },
  {
    id: 'otp-2', type: 'otp', title: 'Hoàn tiền giao dịch lỗi',
    reporter: 'Thu Trang · K47 Sinh học',
    report: {
      from: 'Lê Thu Trang', sub: 'SV năm 3 · Khoa Sinh học',
      msgs: [
        { time: '16:12' },
        'a ơi e đang nghe đt bên momi gọi hoàn tiền',
        'hôm qua e nạp đt 120k bị trừ tiền mà ko lên, e có cmt trên trang hoàn tiền của momi',
        'giờ họ gọi bảo đọc mã otp là hoàn 120k',
        { shot: ['MoMi: Ma OTP de CHUYEN 4.800.000d', 'den vi 0868xxx219 la 482915.', 'Khong cung cap ma cho bat ky ai.'], app: 'Tin nhắn' },
        'mà tin nhắn ghi CHUYEN 4.800.000đ là sao ạ 🥲 e bảo họ đợi 5p'
      ]
    },
    view: {
      kind: 'post',
      author: { name: 'Ví MoMi - Trung Tâm Hoàn Tiền', avatar: '💳', color: '#a50064', meta: '[[c2-page|Trang · Tạo ngày 11/10/2026]] · 🌐' },
      text: '📢 THÔNG BÁO HOÀN TIỀN GIAO DỊCH LỖI\nDo sự cố hệ thống ngày 15-17/10, nhiều giao dịch nạp tiền điện thoại, thanh toán bị trừ tiền nhưng không thành công.\nVí MoMi cam kết hoàn 100% cho Quý khách:\n✅ Bình luận SĐT + số tiền bị lỗi\n✅ [[c2-call|Nhân viên sẽ gọi điện hỗ trợ trong 15 phút]]\n✅ [[c2-otp|Đọc mã OTP 6 số gửi về máy để hệ thống hoàn tiền]]\n⚠️ [[c2-rush|Sau 48h không xác minh, tiền lỗi sẽ bị hủy hoàn]]',
      link: { url: 'momi-hoantien.online', title: 'Tra cứu giao dịch lỗi - Ví MoMi', clue: 'c2-link' },
      stats: '👍 312 · 💬 845 · ↗ 57',
      comments: [
        { name: 'Thu Trang', text: '0868xxx219 bị trừ 120k nạp điện thoại mà ko lên ạ' },
        { name: 'Ví MoMi - Trung Tâm Hoàn Tiền', text: 'Dạ ad đã tiếp nhận, nhân viên sẽ liên hệ bạn ngay ạ ❤️' },
        { name: 'Phạm Đức', text: '[[c2-lost|đọc mã xong bị trừ 3tr, giờ mới để ý tin nhắn ghi "Ma OTP de CHUYEN"]] chứ hoàn gì, lừa đảo ae ơi' }
      ]
    },
    clues: {
      'c2-page': 'Trang mang tên Ví MoMi mà mới lập một tuần, không có dấu xác minh. Trang chính thức đã hoạt động nhiều năm.',
      'c2-call': 'Bình luận số điện thoại công khai rồi chờ "nhân viên" gọi: kẻ gian gom số nạn nhân đúng bằng cách này.',
      'c2-otp': 'Hoàn tiền là tiền chạy VÀO ví, không cần cháu đưa mã gì cả. Đòi OTP là để chuyển tiền RA.',
      'c2-rush': 'Dọa "hủy hoàn" sau 48h để cháu vội vàng làm theo.',
      'c2-link': 'Tên miền momi-hoantien.online có dấu gạch và đuôi .online, không phải momi.vn.',
      'c2-lost': 'Người khác đã mất tiền và chỉ ra đúng chỗ: tin OTP ghi rõ mã dùng để CHUYỂN tiền đi.'
    },
    evidence: {
      link: { url: 'momi-hoantien.online', bad: true, highlight: '-hoantien.online', detail: 'Tên miền đăng ký 9 ngày trước, máy chủ ở nước ngoài. Trang chính thức của Ví MoMi là momi.vn.', clue: 'c2-link' },
      profile: { bad: true, created: '8 ngày trước', friends: '0 bạn bè, 2,1K người theo dõi', detail: 'Trang đổi tên 1 lần, tên cũ "Shop Phụ Kiện Giá Sỉ". Không có liên kết nào tới momi.vn.', clue: 'c2-page' }
    },
    answer: 'report',
    consequence: 'Thu Trang đọc mã 482915. Ví MoMi của Trang bị chuyển đi 4.800.000đ, gần hết tiền học thêm và tiền ăn cả tháng. 120.000đ "lỗi" thì không ai hoàn.',
    explain: 'Tin OTP ghi rõ mã dùng để CHUYỂN 4.800.000đ đi, không phải để nhận tiền hoàn.',
    rule: 'Hoàn tiền không cần OTP. Ai đòi mã để "hoàn tiền" là đang rút tiền của bạn.'
  },
  {
    id: 'otp-3', type: 'otp', title: 'Shipper xin mã',
    reporter: 'Đức Huy · K49 Tin học',
    report: {
      from: 'Võ Đức Huy', sub: 'SV năm 1 · Khoa Tin học',
      msgs: [
        { time: '10:09' },
        'ad',
        'shipper nhắn mess đòi mã xác nhận giao hàng',
        { shot: ['Tuấn Shipper GNV', 'b đọc giúp mình mã xác nhận 6 số', 'vừa gửi về máy để mình xác nhận giao hàng nhé', 'đơn người khác đặt tặng b'], app: 'Messenger' },
        'mà mã lại gửi từ SaoVietBank 🤔',
        'đưa dc ko'
      ]
    },
    view: {
      kind: 'chat', app: 'messenger',
      contact: { name: 'Tuấn Shipper GNV', avatar: '👦', color: '#f97316', sub: 'Người lạ · Không có bạn chung' },
      messages: [
        { who: 'sys', text: 'Hôm nay 10:04' },
        { who: 'them', text: 'chào b, mình là [[c3-ship|shipper Giao Nhanh Việt]], đang giao đơn COD 0đ tới KTX Sao Mai cho b. b đọc giúp mình [[c3-code|mã xác nhận 6 số vừa gửi về máy]] để mình xác nhận giao hàng nhé' },
        { who: 'me', text: 'em có đặt gì đâu ạ' },
        { who: 'them', text: 'đơn người khác đặt tặng b, [[c3-gift|quà tặng sinh nhật]] đó, ko phải trả tiền đâu' },
        { who: 'sys', text: 'Hôm nay 10:07' },
        { who: 'me', text: 'mã gửi về từ SaoVietBank mà anh, ghi là dang ky SaoViet Mobile tren thiet bi moi' },
        { who: 'them', text: '[[c3-sys|hệ thống GNV liên kết ngân hàng]] nên mã gửi qua SaoVietBank b ạ. nhanh giúp mình, [[c3-rush|mình còn 30 đơn chưa giao]]' }
      ]
    },
    clues: {
      'c3-ship': 'Tài khoản Messenger lạ, không bạn chung, tự xưng shipper. Shipper thật chỉ gọi hẹn giờ giao, không cần mã gì từ máy cháu.',
      'c3-code': 'Giao hàng không bao giờ cần cháu đọc mã OTP. Mã gửi về máy là chìa khóa tài khoản của cháu.',
      'c3-gift': 'Cháu không đặt gì mà có "quà tặng". Đây là cái cớ để cháu bớt nghi ngờ.',
      'c3-sys': 'Mã của SaoVietBank là để đăng ký app ngân hàng trên máy lạ. Công ty giao hàng không liên quan gì tới mã ngân hàng của cháu.',
      'c3-rush': 'Than "còn 30 đơn" để thúc cháu đọc mã thật nhanh, không kịp đọc nội dung tin.'
    },
    evidence: {
      profile: { bad: true, created: '6 ngày trước', friends: '3 bạn bè', detail: 'Tài khoản bị 23 người báo cáo trong tuần, cùng một kịch bản "shipper xin mã xác nhận". Không có trong danh sách nhân viên GNV.', clue: 'c3-ship' }
    },
    answer: 'report',
    consequence: 'Huy đọc mã. Kẻ gian cài SaoViet Mobile của Huy lên máy chúng và chuyển sạch 2.350.000đ tiền nhà gửi lên đóng tiền phòng KTX.',
    explain: 'Mã gửi về là mã đăng ký app ngân hàng của Huy trên máy lạ, không phải mã giao hàng.',
    rule: 'Shipper không bao giờ cần mã OTP. Ai xin mã thì tắt máy.'
  },
  {
    id: 'otp-4', type: 'otp', title: 'Mã đổi thiết bị lúc 2h sáng',
    reporter: 'Mai · K46 Giáo dục Tiểu học',
    report: {
      from: 'Nguyễn Thị Mai', sub: 'SV năm 4 · Khoa Giáo dục Tiểu học',
      msgs: [
        { time: '06:42' },
        'dạ em chào anh chị ạ',
        'sáng nay em dậy thấy có tin nhắn OTP với email của SaoVietBank bảo đổi thiết bị lúc 2h sáng',
        { shot: ['SaoVietBank: Ma OTP doi thiet bi', 'SaoViet Mobile la 360518.', 'KHONG cung cap ma cho bat ky ai.'], app: 'Tin nhắn' },
        'nhưng em có làm gì đâu ạ, lúc đấy em đang ngủ 😭',
        'email thì đúng đuôi saovietbank.vn, ko có link gì. em có cần làm gì ko ạ'
      ]
    },
    view: {
      kind: 'email',
      from: { name: 'Ngân hàng Sao Việt', addr: '[[c4-mail|no-reply@saovietbank.vn]]' },
      to: 'mai.nguyenthi.k46@gmail.com',
      subject: 'Cảnh báo: Yêu cầu đổi thiết bị đăng nhập SaoViet Mobile',
      date: 'Th 2, 19 thg 10, 02:16',
      body: 'Kính gửi Quý khách NGUYEN THI MAI,\n\nSaoVietBank ghi nhận [[c4-req|yêu cầu đổi thiết bị đăng nhập SaoViet Mobile lúc 02:14 ngày 19/10/2026]]:\n• Thiết bị: [[c4-dev|Samsung SM-A155F, vị trí ước tính: Bình Dương]]\n• Mã OTP đã được gửi tới số điện thoại đăng ký của Quý khách.\n\n[[c4-safe|SaoVietBank không bao giờ yêu cầu Quý khách cung cấp mã OTP qua điện thoại, tin nhắn hay email.]]\n\nNếu không phải Quý khách thực hiện, vui lòng KHÔNG cung cấp mã OTP cho bất kỳ ai và [[c4-hotline|tự gọi tổng đài 1900 6060]] (24/7) để được hỗ trợ khóa tạm thời.\n\nTrân trọng,',
      sig: 'Ngân hàng TMCP Sao Việt\nTổng đài: 1900 6060 · saovietbank.vn\nĐây là email tự động, vui lòng không trả lời.'
    },
    clues: {
      'c4-mail': 'Địa chỉ gửi đúng tên miền saovietbank.vn. Email này nhiều khả năng là thật, nhưng điều nó báo mới đáng lo.',
      'c4-req': 'Mai không đổi máy mà vẫn có yêu cầu lúc 2h sáng: có người đã biết mật khẩu và đang thử vào tài khoản.',
      'c4-dev': 'Máy lạ ở Bình Dương, không phải điện thoại của Mai. Kẻ gian chỉ còn thiếu mã OTP nữa thôi.',
      'c4-safe': 'Ngân hàng thật nhắc không đưa mã cho ai. Sáng nay nếu có "nhân viên" gọi xin mã thì đó chính là kẻ gian.',
      'c4-hotline': 'Tự bấm số 1900 6060 từ điện thoại của mình để xác minh và khóa tạm, không gọi số nào người lạ đưa.'
    },
    evidence: {
      link: { url: 'saovietbank.vn', bad: false, detail: 'Đúng tên miền chính thức của Ngân hàng Sao Việt. Email không có link hay nút bấm nào, chỉ khuyên gọi tổng đài.', clue: 'c4-mail' },
      profile: { bad: true, created: 'Thiết bị lạ, chưa từng đăng nhập', friends: 'Không liên quan tới Mai', detail: 'Máy Samsung ở Bình Dương này đã gửi yêu cầu đổi thiết bị cho 3 tài khoản khác nhau trong đêm qua.', clue: 'c4-dev' }
    },
    answer: 'suspect',
    consequence: 'Nếu Mai bỏ qua, 8 giờ sáng có "nhân viên SaoVietBank" gọi tới xin mã để "hủy yêu cầu lạ". Mai đọc mã và mất 5.600.000đ tiền thực tập. Còn nếu chỉ chặn và xóa tin thì mật khẩu cũ vẫn nằm trong tay kẻ gian.',
    explain: 'Tin nhắn và email có thể là thật, nhưng chúng báo có người đang thử vào tài khoản của Mai, nên phải giữ kín mã, đổi mật khẩu và tự gọi 1900 6060 để xác minh.',
    rule: 'Nhận OTP mà mình không làm gì: không đưa mã, đổi mật khẩu, tự gọi tổng đài chính thức.'
  },
  {
    id: 'otp-5', type: 'otp', title: 'OTP đóng học phí',
    reporter: 'Quang Minh · K48 Lịch sử',
    report: {
      from: 'Đỗ Quang Minh', sub: 'SV năm 2 · Khoa Lịch sử',
      msgs: [
        { time: '14:33' },
        'ad ơi e vừa bấm đóng học phí trên app momi',
        'nó gửi mã otp về',
        { shot: ['MoMi: Ma OTP la 205846 de THANH TOAN', '6.250.000d cho TRUONG DAI HOC SAO MAI', 'Khong cung cap ma cho bat ky ai'], app: 'Tin nhắn' },
        'mẹ e dặn ko được đưa otp cho ai 😅 thế e nhập vào app có sao ko ạ'
      ]
    },
    view: {
      kind: 'chat', app: 'sms',
      contact: { name: 'MoMi', avatar: '💳', color: '#a50064', sub: '[[c5-brand|Tin nhắn SMS · cùng luồng với các tin MoMi trước]]' },
      messages: [
        { who: 'sys', text: '12 thg 9' },
        { who: 'them', text: 'MoMi: Quy khach da nap 500.000d tu SaoVietBank vao vi thanh cong. So du: 531.000d.' },
        { who: 'sys', text: '[[c5-time|Hôm nay 14:31]]' },
        { who: 'them', text: 'MoMi: Ma OTP la 205846 de [[c5-what|THANH TOAN 6.250.000d cho TRUONG DAI HOC SAO MAI]] (hoc phi HK1 2026-2027). Ma co hieu luc 2 phut. [[c5-warn|Khong cung cap ma cho bat ky ai]], ke ca nhan vien MoMi.' }
      ]
    },
    clues: {
      'c5-brand': 'Tên hiển thị đúng brandname MoMi, nằm chung luồng với các tin cũ của ví, không có đường link nào.',
      'c5-time': 'Tin đến đúng lúc Minh vừa tự bấm thanh toán trên app. Mã này là do chính Minh yêu cầu.',
      'c5-what': 'Nội dung khớp với việc Minh đang làm: đúng số tiền học phí, người nhận là Trường Đại học Sao Mai.',
      'c5-warn': 'Ví thật luôn dặn không đưa mã cho ai. Tự gõ mã vào app của mình thì không phải là "đưa" cho ai cả.'
    },
    evidence: {
      profile: { bad: false, created: 'Brandname MoMi đăng ký từ 2015', friends: 'Đầu số tin nhắn thương hiệu chính thức', detail: 'Tin gửi từ brandname chính thức, không chứa link, nội dung trùng khớp giao dịch Minh vừa tạo trên app MoMi.', clue: 'c5-brand' }
    },
    answer: 'trust',
    consequence: 'Nếu Minh nghi ngờ rồi bỏ dở, giao dịch hết hạn, Minh quên đóng lại và bị Phòng Kế hoạch Tài chính nhắc nợ học phí, không đăng ký được học phần kỳ sau đúng hạn.',
    explain: 'Minh tự tạo giao dịch, tin OTP từ đúng brandname MoMi ghi đúng số tiền và người nhận, và Minh tự nhập mã vào app của mình.',
    rule: 'OTP chỉ để chính bạn nhập vào app chính thức khi bạn vừa tự làm giao dịch, đọc kỹ nội dung trước khi nhập.'
  },

  /* ===================== GIẢ DANH GIẢNG VIÊN, NHÀ TRƯỜNG ===================== */
  {
    id: 'school-1', type: 'school', title: 'Cô nhờ mua thẻ cào',
    reporter: 'Thảo Vy · K49 Ngữ văn',
    report: {
      from: 'Lê Thảo Vy', sub: 'SV năm 2 · Khoa Ngữ văn',
      msgs: [
        { time: '14:36' },
        'dạ em chào anh chị ạ',
        'cô Hà dạy Văn học dân gian nhắn em nhờ mua thẻ cào, 5 cái 500k luôn ạ',
        { shot: ['TS. Trần Thu Hà', 'Cô đang họp trên Bộ, không ra ngoài được', 'Em ra tạp hóa mua giúp cô 5 thẻ SongViet 500k', 'Cào ra chụp gửi cô, chiều cô gửi lại em'], app: 'Messenger' },
        'ảnh đại diện đúng là ảnh cô mà sao nick lại ko có ai chung 🥲',
        'em đang đứng ở tạp hóa rồi, có nên mua ko ạ'
      ]
    },
    view: {
      kind: 'chat', app: 'messenger',
      contact: { name: 'TS. Trần Thu Hà', avatar: '👩', color: '#2563eb', sub: '[[c-nick|Messenger · Các bạn chưa là bạn bè]]' },
      messages: [
        { who: 'sys', text: 'Hôm nay 14:05' },
        { who: 'them', text: 'Vy ơi cô Hà đây, em đang ở trường ko' },
        { who: 'me', text: 'Dạ em chào cô ạ, em đang ở thư viện ạ' },
        { who: 'them', text: 'Cô [[c-meeting|đang họp trên Bộ, không ra ngoài được]], điện thoại cô chỉ nhắn tin được thôi' },
        { who: 'them', text: 'Em ra tạp hóa cổng trường [[c-card|mua giúp cô 5 thẻ cào SongViet mệnh giá 500k]] nhé, cô cần gấp để làm quà cho đoàn' },
        { who: 'them', text: '[[c-send|Cào ra rồi chụp rõ mã gửi cô qua đây]], chiều họp xong cô chuyển trả em 2tr5 luôn' },
        { who: 'them', text: '[[c-secret|Việc này em đừng nói với lớp nhé]], cô ngại 😊' },
        { who: 'me', text: 'Dạ cô đợi em chút ạ' }
      ]
    },
    clues: {
      'c-nick': 'Cô dạy Vy cả học kỳ mà tài khoản này lại "chưa là bạn bè". Kẻ gian lập nick mới, lấy ảnh thật của cô làm ảnh đại diện.',
      'c-meeting': '"Đang họp, không gọi được" là cái cớ để cháu không thể gọi điện hỏi lại chính cô.',
      'c-card': 'Giảng viên không bao giờ nhờ sinh viên mua thẻ cào. Đây là dấu hiệu rõ nhất.',
      'c-send': 'Mã thẻ cào gửi đi là mất, không lần ra ai dùng. Kẻ gian thích thẻ cào vì thế.',
      'c-secret': 'Dặn "đừng nói với ai" để cháu không kịp hỏi bạn bè, lớp trưởng.'
    },
    evidence: {
      profile: { bad: true, created: '2 ngày trước', friends: '7 bạn bè, 0 bạn chung', detail: 'Tài khoản thật của cô Trần Thu Hà lập năm 2015, có 1.300 bạn bè. Nick này lấy ảnh đại diện và ảnh bìa của cô, chỉ kết bạn với sinh viên.', clue: 'c-nick' },
      image: { bad: true, detail: 'Ảnh đại diện được tải về từ trang cá nhân thật của cô Hà và từ trang giới thiệu giảng viên Khoa Ngữ văn.', clue: 'c-nick' }
    },
    answer: 'report',
    consequence: 'Vy mua 5 thẻ hết 2.500.000đ, gửi mã đi. Nick giả nhắn tiếp "mua thêm 5 thẻ nữa", rồi chặn Vy. Cô Hà thật không hề biết chuyện.',
    explain: 'Nick mới lấy ảnh giảng viên, không gọi được, nhờ mua thẻ cào gấp: đủ bộ dấu hiệu giả danh.',
    rule: 'Thầy cô nhờ mua thẻ cào, mượn tiền qua tin nhắn: gọi thẳng cho thầy cô trước, chưa gọi được thì không làm.'
  },
  {
    id: 'school-2', type: 'school', title: 'Trợ lý khoa gửi link điểm',
    reporter: 'Khánh Linh · K49 Tâm lý',
    report: {
      from: 'Đỗ Khánh Linh', sub: 'SV năm 2 · Khoa Tâm lý học',
      msgs: [
        { time: '19:40' },
        'dạ anh chị ơi em hỏi chút ạ',
        'trong nhóm zalo lớp có 1 bạn xưng trợ lý khoa gửi link xem điểm giữa kỳ',
        { shot: ['Trợ lý khoa TLH', 'Điểm giữa kỳ môn Tâm lý học phát triển', 'Các em đăng nhập tài khoản cổng SV để xem', 'tinyurl.com/diemgk-tlh'], app: 'Zalo' },
        'mấy bạn bấm rồi mà em thấy lạ, trước giờ điểm toàn xem trên cổng trường',
        'nhưng cũng sợ là thật thì lỡ mất ạ 😭'
      ]
    },
    view: {
      kind: 'chat', app: 'zalo',
      contact: { name: 'K49 Tâm lý học A', avatar: '🏫', color: '#7c3aed', sub: '62 thành viên' },
      messages: [
        { who: 'sys', text: 'Hôm nay 19:12 · Bảo Ngọc đã thêm [[c-stranger|Trợ lý khoa TLH]] vào nhóm' },
        { who: 'them', text: 'Trợ lý khoa TLH: Chào các em, khoa đã có điểm giữa kỳ môn Tâm lý học phát triển.' },
        { who: 'them', text: 'Trợ lý khoa TLH: Các em xem tại [[c-short|tinyurl.com/diemgk-tlh]] nhé, [[c-login|đăng nhập bằng tài khoản cổng sinh viên]] để xem điểm cá nhân.' },
        { who: 'them', text: 'Trợ lý khoa TLH: Ai có sai sót phúc khảo trước thứ Sáu.' },
        { who: 'them', text: 'Bảo Ngọc: [[c-who|Ủa mình bấm thêm nhầm, mà anh này là ai vậy ạ]] 😅' },
        { who: 'them', text: 'Lớp trưởng Tuấn: [[c-wait|Mọi người khoan bấm, để mình hỏi cô cố vấn đã]]' }
      ]
    },
    clues: {
      'c-stranger': 'Tài khoản không tên thật, được thêm vào nhóm tối nay, không phải thầy cô quen của lớp. Chưa biết là ai.',
      'c-short': 'Link rút gọn che mất địa chỉ thật. Không biết nó dẫn về cổng trường hay về một trang giả.',
      'c-login': 'Đòi đăng nhập qua link lạ là bước nguy hiểm nhất. Điểm thật cháu tự vào online.saomai.edu.vn xem được.',
      'c-who': 'Chính người thêm vào cũng không biết đây là ai. Chưa ai xác nhận danh tính.',
      'c-wait': 'Lớp trưởng làm đúng: dừng lại và hỏi cố vấn học tập qua kênh chính thức trước.'
    },
    evidence: {
      link: { url: 'tinyurl.com/diemgk-tlh', bad: true, highlight: 'tinyurl.com', detail: 'Link rút gọn, đang chuyển hướng tới một trang chưa xác minh được, không phải online.saomai.edu.vn. Chưa đủ để kết luận, cần hỏi khoa.', clue: 'c-short' },
      profile: { bad: true, created: '3 tuần trước', friends: '41 bạn bè, chủ yếu sinh viên Tâm lý học', detail: 'Không có thông tin công việc, không có ảnh thật. Danh sách cán bộ khoa trên saomai.edu.vn chưa thấy ai tên như vậy.', clue: 'c-stranger' }
    },
    answer: 'suspect',
    consequence: 'Nếu tin ngay và đăng nhập, Linh có thể mất tài khoản cổng sinh viên và email trường. Nếu chỉ chặn mà không báo, cả lớp vẫn không biết ai đang giả danh khoa.',
    explain: 'Có thể là trợ lý mới thật, nhưng tài khoản lạ, link rút gọn và đòi đăng nhập thì phải hỏi cố vấn học tập hoặc Phòng CTSV trước.',
    rule: 'Ai xưng là người của khoa mà chưa quen: hỏi cố vấn học tập hoặc Phòng CTSV qua số, email chính thức rồi mới làm theo.'
  },
  {
    id: 'school-3', type: 'school', title: 'Thầy chủ nhiệm mượn tiền',
    reporter: 'Đức Mạnh · K48 Lịch sử',
    report: {
      from: 'Vũ Đức Mạnh', sub: 'SV năm 3 · Khoa Lịch sử',
      msgs: [
        { time: '22:15' },
        'thầy chủ nhiệm lớp e nhắn mượn 2tr',
        'bảo đang ở viện với vợ, ck vào stk này',
        { shot: ['Thầy Nguyễn Văn Khải', 'Em chuyển giúp thầy 2 triệu', '1903 6688 2468 - Ngân hàng Sao Mai', 'TRAN VAN DEM'], app: 'Zalo' },
        'mà tên chủ tk lạ hoắc',
        'e gọi số thầy thì thuê bao 😅 có ck ko ad'
      ]
    },
    view: {
      kind: 'chat', app: 'zalo',
      contact: { name: 'Thầy Nguyễn Văn Khải', avatar: '👨‍🏫', color: '#0369a1', sub: '[[c-newzalo|Vừa kết bạn · Không có nhóm chung]]' },
      messages: [
        { who: 'sys', text: 'Hôm nay 21:58' },
        { who: 'them', text: 'Mạnh à, thầy Khải đây. Zalo cũ thầy bị lỗi nên dùng tạm nick này' },
        { who: 'them', text: 'Thầy đang ở viện với vợ, [[c-hospital|máy kia hết pin không nghe được]]' },
        { who: 'them', text: 'Em [[c-borrow|cho thầy mượn 2 triệu đóng viện phí]], sáng mai thầy gửi lại em' },
        { who: 'them', text: 'Chuyển vào [[c-acc|STK 1903 6688 2468 Ngân hàng Sao Mai, TRAN VAN DEM]] là người nhà bên vợ thầy nhé' },
        { who: 'them', text: '[[c-rush|Em chuyển luôn giúp thầy, bác sĩ đang giục]]' },
        { who: 'sys', text: 'Cuộc gọi nhỡ' }
      ]
    },
    clues: {
      'c-newzalo': 'Thầy chủ nhiệm mà không ở chung nhóm lớp nào với cháu, lại vừa kết bạn hôm nay. Đây là nick mới tạo.',
      'c-hospital': 'Lý do không nghe máy được nghĩ sẵn để cháu không gọi xác minh.',
      'c-borrow': 'Giảng viên không mượn tiền sinh viên, nhất là qua tin nhắn.',
      'c-acc': 'Tiền không vào tài khoản tên thầy mà vào tên người lạ. Số tài khoản này Văn phòng đã gặp ở nhiều vụ.',
      'c-rush': 'Giục "chuyển luôn" là để cháu không kịp nghĩ.'
    },
    evidence: {
      account: { number: BONG_DEM_ACC, bank: 'Ngân hàng Sao Mai', owner: 'TRAN VAN DEM', reports: 87, bad: true, detail: 'Tài khoản thuộc đường dây "Bóng Đêm". Đã bị báo cáo 87 lần, dưới nhiều tên chủ khác nhau, chuyên giả danh thầy cô và người thân.', clue: 'c-acc' },
      profile: { bad: true, created: 'Hôm qua', friends: '23 bạn bè, toàn sinh viên Khoa Lịch sử', detail: 'Zalo thật của thầy Khải dùng số khác, vẫn đang hoạt động trong nhóm lớp. Nick này lấy ảnh thầy từ trang của khoa.', clue: 'c-newzalo' }
    },
    answer: 'report',
    consequence: 'Mạnh chuyển 2.000.000đ tiền ăn cả tháng. Sáng hôm sau gặp thầy Khải ở trường, thầy ngạc nhiên vì không hề nhắn tin.',
    explain: 'Nick mới, không gọi được, mượn tiền gấp, tài khoản tên người lạ: đúng kịch bản giả danh thầy cô.',
    rule: 'Thầy cô mượn tiền qua tin nhắn: không chuyển, hỏi lại qua nhóm lớp hoặc gặp trực tiếp.'
  },
  {
    id: 'school-4', type: 'school', title: 'Email đóng học phí',
    reporter: 'Quang Huy · K50 Toán',
    report: {
      from: 'Phạm Quang Huy', sub: 'SV năm 1 · Khoa Toán',
      msgs: [
        { time: '10:02' },
        'ad ơi',
        'e nhận mail phòng đào tạo bảo xác nhận đóng học phí kỳ 2 trước 17h ko là bị khóa tk',
        { shot: ['Phòng Đào tạo - ĐH Sao Mai', 'phongdaotao.saomai@gmail.com', 'XÁC NHẬN HỌC PHÍ HỌC KỲ II', 'Hạn chót: 17h00 hôm nay'], app: 'Gmail' },
        'e năm nhất chưa biết j, link nó là saomai-edu.online',
        'có phải web trường ko z'
      ]
    },
    view: {
      kind: 'email',
      from: { name: 'Phòng Đào tạo - ĐH Sao Mai', addr: '[[c-mail|phongdaotao.saomai@gmail.com]]' },
      to: 'huy.pq2025@saomai.edu.vn',
      subject: '[KHẨN] Xác nhận đóng học phí học kỳ II năm học 2026-2027',
      date: 'Th 2, 19 thg 10, 07:48',
      body: 'Thân gửi sinh viên,\n\nTheo rà soát của Phòng Đào tạo, hồ sơ học phí học kỳ II của bạn chưa được xác nhận trên hệ thống.\n\nBạn vui lòng đăng nhập bằng mã sinh viên và mật khẩu cổng thông tin để xác nhận [[c-deadline|trước 17h00 ngày hôm nay]].\n\nSau thời hạn trên, [[c-threat|tài khoản sinh viên sẽ bị khoá và bạn không được dự thi cuối kỳ]].\n\nNếu đã đóng, sinh viên vẫn cần xác nhận lại và [[c-fee|chuyển 30.000đ phí đối soát]] để hệ thông cập nhật.\n\nTrân trọng.',
      button: { text: 'XÁC NHẬN HỌC PHÍ NGAY', clue: 'c-link' },
      sig: 'Phòng Đào tạo\nTrường Đại học Sao Mai\n[[c-sig|Hotline hỗ trợ (Zalo): 0879 xxx 312]]'
    },
    clues: {
      'c-mail': 'Phòng Đào tạo thật gửi thư bằng địa chỉ @saomai.edu.vn, không bao giờ dùng @gmail.com.',
      'c-deadline': 'Hạn chót "17h hôm nay" ép cháu làm vội, không kịp hỏi ai.',
      'c-threat': 'Dọa khóa tài khoản, cấm thi để cháu sợ mà bấm link.',
      'c-fee': '"Phí đối soát" không có thật. Học phí chỉ đóng theo hướng dẫn trên cổng online.saomai.edu.vn.',
      'c-link': 'Nút này dẫn tới saomai-edu.online, một trang giả có gạch nối và đuôi .online, không phải saomai.edu.vn.',
      'c-sig': 'Phòng ban của trường để số điện thoại bàn và email trường, không bắt sinh viên liên hệ qua Zalo cá nhân.'
    },
    evidence: {
      link: { url: 'saomai-edu.online/xac-nhan-hoc-phi', bad: true, highlight: 'saomai-edu.online', detail: 'Tên miền đăng ký 5 ngày trước, chép giao diện cổng sinh viên. Ai nhập mã sinh viên và mật khẩu sẽ bị lấy mất tài khoản. Cổng thật là online.saomai.edu.vn.', clue: 'c-link' }
    },
    answer: 'report',
    consequence: 'Huy nhập mã sinh viên, mật khẩu và chuyển 30.000đ. Tối đó tài khoản cổng sinh viên bị đổi mật khẩu, email trường của Huy gửi link giả cho cả khóa.',
    explain: 'Email @gmail.com mạo danh Phòng Đào tạo, link sai tên miền, đòi mật khẩu và phí: là lừa đảo.',
    rule: 'Học phí chỉ xem và đóng trên online.saomai.edu.vn, tự gõ địa chỉ, không bấm link trong thư.'
  },
  {
    id: 'school-5', type: 'school', title: 'Nhắc đăng ký học phần',
    reporter: 'Gia Bảo · K50 Tin học',
    report: {
      from: 'Ngô Gia Bảo', sub: 'SV năm 1 · Khoa Tin học',
      msgs: [
        { time: '08:31' },
        'hi ad',
        'sau vụ bạn e mất acc vì mail giả e sợ quá, giờ mail nào cũng nghi 😅',
        { shot: ['Cô Nguyễn Thị Lan', 'lan.nguyenthi@saomai.edu.vn', 'Nhắc đăng ký học phần học kỳ II', 'online.saomai.edu.vn'], app: 'Gmail' },
        'mail cố vấn học tập nhắc đăng ký học phần',
        'cái này có sao ko ạ, e có nên làm theo ko'
      ]
    },
    view: {
      kind: 'email',
      from: { name: 'Nguyễn Thị Lan', addr: '[[c-domain|lan.nguyenthi@saomai.edu.vn]]' },
      to: 'Lớp K50 Tin học B',
      subject: 'Nhắc đăng ký học phần học kỳ II năm học 2026-2027',
      date: 'Th 2, 19 thg 10, 07:30',
      body: 'Chào các em lớp K50 Tin học B,\n\nCô nhắc các em đợt đăng ký học phần học kỳ II mở từ ngày 26/10 đến hết ngày 06/11.\n\nCác em [[c-portal|tự đăng nhập cổng online.saomai.edu.vn]] như mọi khi, vào mục "Đăng ký học phần" và chọn lớp theo kế hoạch học tập khoa đã gửi.\n\n[[c-nopass|Cô và nhà trường không bao giờ hỏi mật khẩu hay yêu cầu chuyển khoản qua email.]] Học phí sẽ hiện trên cổng sau khi đăng ký xong.\n\nEm nào vướng mắc thì [[c-meet|ghé phòng 204 nhà A2 giờ hành chính]] hoặc trả lời thư này.\n\nThân mến,',
      sig: 'ThS. Nguyễn Thị Lan\nCố vấn học tập lớp K50 Tin học B\nKhoa Tin học, Trường Đại học Sao Mai\n[[c-sig|Văn phòng khoa: (024) 3xxx 5120]]'
    },
    clues: {
      'c-domain': 'Địa chỉ đuôi @saomai.edu.vn, đúng tên miền của trường, và đúng tên cô cố vấn lớp Bảo.',
      'c-portal': 'Cô bảo tự vào cổng chính thức, không gửi link hay nút bấm nào lạ.',
      'c-nopass': 'Không đòi mật khẩu, không đòi tiền. Đây là dấu hiệu tốt.',
      'c-meet': 'Cho địa chỉ phòng làm việc thật để gặp trực tiếp. Kẻ gian thì luôn tránh gặp mặt.',
      'c-sig': 'Chữ ký có số điện thoại bàn của văn phòng khoa, gọi tới kiểm tra được.'
    },
    evidence: {
      link: { url: 'online.saomai.edu.vn', bad: false, highlight: '', detail: 'Đây là cổng thông tin sinh viên chính thức của ĐH Sao Mai, tên miền .edu.vn do nhà trường quản lý.', clue: 'c-portal' },
      profile: { bad: false, created: 'Năm 2016', friends: 'Có tên trong danh sách cán bộ Khoa Tin học', detail: 'ThS. Nguyễn Thị Lan là cố vấn học tập lớp K50 Tin học B, có tên trên trang saomai.edu.vn của khoa.', clue: 'c-domain' }
    },
    answer: 'trust',
    consequence: 'Nếu báo cáo nhầm, Bảo bỏ qua thông báo thật, lỡ đợt đăng ký và phải học bù lớp ghép ở kỳ sau.',
    explain: 'Email đúng tên miền trường, từ đúng cố vấn, chỉ nhắc tự vào cổng chính thức, không đòi tiền hay mật khẩu: là thư thật.',
    rule: 'Thư từ @saomai.edu.vn, chỉ dẫn về cổng chính thức, không đòi tiền hay mật khẩu: yên tâm làm theo.'
  },

  /* ===================== HỌC BỔNG, VAY TIỀN SINH VIÊN ===================== */
  {
    id: 'loan-1', type: 'loan', title: 'Học bổng 10 triệu',
    reporter: 'Thảo Vy · K49 Hóa học',
    report: {
      from: 'Lê Thảo Vy', sub: 'SV năm 1 · Khoa Hóa học',
      msgs: [
        { time: '07:52' },
        'dạ em chào anh chị ạ',
        'em vừa nhận mail báo đạt học bổng 10tr của quỹ Ánh Dương',
        { shot: ['Quỹ Học bổng Ánh Dương', 'CHÚC MỪNG BẠN ĐÃ ĐẠT HỌC BỔNG 10.000.000đ', 'Phí xử lý hồ sơ: 500.000đ', 'STK 1903 6688 2468'], app: 'Gmail' },
        'mà phải ck 500k phí hồ sơ trc 17h hôm nay mới dc nhận',
        'em có nộp hồ sơ học bổng nào đâu 🥲 nhưng 10tr thì nhiều quá, nhà em cũng khó khăn. ad xem giúp em có thật ko ạ'
      ]
    },
    view: {
      kind: 'email',
      from: { name: 'Quỹ Học bổng Ánh Dương', addr: '[[c-mail|quyhocbong.anhduong2026@gmail.com]]' },
      to: 'vy.lethao.k49@saomai.edu.vn',
      subject: '🎓 [THÔNG BÁO] Chúc mừng bạn đã đạt Học bổng Ánh Dương năm học 2026-2027',
      date: 'Th 2, 19 thg 10, 06:41',
      body: 'Thân gửi bạn Lê Thảo Vy,\n\nHội đồng xét duyệt Quỹ Học bổng Ánh Dương trân trọng thông báo bạn [[c-noapply|đã được lựa chọn nhận học bổng trị giá 10.000.000đ]] dành cho sinh viên có hoàn cảnh khó khăn, học tập tốt.\n\nĐể hoàn tất thủ tục giải ngân, bạn vui lòng [[c-fee|chuyển khoản 500.000đ phí xử lý hồ sơ]] tới tài khoản:\n- STK: [[c-acc|1903 6688 2468 - NGUYEN VAN BONG]]\n- Ngân hàng Sao Mai\n- Nội dung: HB ANHDUONG + MSSV\n\nSau khi nhận được phí, học bổng sẽ được chuyển vào tài khoản của bạn trong 24h.\n\n[[c-rush|Lưu ý: Hạn chót 17h00 ngày hôm nay]]. Quá thời hạn, suất học bổng sẽ được chuyển cho sinh viên khác.\n\nTrân trọng.',
      sig: 'Ban điều hành Quỹ Học bổng Ánh Dương\nHotline/Zalo: 0896 xxx 147\nWebsite: hocbong-anhduong.online'
    },
    clues: {
      'c-mail': 'Một quỹ học bổng đàng hoàng mà gửi thư bằng địa chỉ @gmail.com tự lập, không có tên miền riêng.',
      'c-noapply': 'Vy không hề nộp hồ sơ học bổng này. Không nộp thì làm sao "được lựa chọn"?',
      'c-fee': 'Học bổng thật không bắt nộp "phí xử lý hồ sơ" trước.',
      'c-acc': 'Tiền chuyển vào tài khoản một cá nhân, không phải tài khoản của quỹ hay của trường.',
      'c-rush': 'Hạn chót ngay trong ngày để Vy không kịp hỏi Phòng Công tác sinh viên.'
    },
    evidence: {
      account: { number: BONG_DEM_ACC, bank: 'Ngân hàng Sao Mai', owner: 'NGUYEN VAN BONG', reports: 63, bad: true, detail: 'Có 63 cảnh báo lừa đảo. Cùng số tài khoản này từng đứng tên TRAN VAN DEM, LE THI HOA trong các vụ trúng thưởng, giả danh. Dấu vết đường dây "Bóng Đêm".', clue: 'c-acc' }
    },
    answer: 'report',
    consequence: 'Vy chuyển 500.000đ. Hôm sau "quỹ" đòi thêm 1.200.000đ "phí thuế thu nhập học bổng". Không có đồng học bổng nào, số Zalo hotline cũng chặn Vy.',
    explain: 'Học bổng không nộp hồ sơ mà tự đến, lại bắt chuyển phí vào tài khoản cá nhân, là lừa đảo.',
    rule: 'Học bổng thật trao tiền cho bạn, không thu tiền của bạn.'
  },
  {
    id: 'loan-2', type: 'loan', title: 'Thông báo của Phòng CTSV',
    reporter: 'Mai Linh · K48 GD Tiểu học',
    report: {
      from: 'Đặng Mai Linh', sub: 'SV năm 2 · Khoa Giáo dục Tiểu học',
      msgs: [
        { time: '10:14' },
        'dạ em chào anh chị ạ',
        'dạo này em thấy nhiều vụ lừa học bổng quá nên giờ thấy cái gì cũng sợ 😅',
        { shot: ['Phòng Công tác sinh viên - ĐH Sao Mai', 'THÔNG BÁO HỌC BỔNG KKHT HK1', 'nộp hồ sơ tại phòng A1.105', 'không thu bất kỳ khoản phí nào'], app: 'ViệtBook' },
        'bài này trên trang phòng CTSV, có cả hướng dẫn vay vốn sv nữa',
        'em nộp theo bài này được ko ạ'
      ]
    },
    view: {
      kind: 'post',
      author: { name: 'Phòng Công tác sinh viên - ĐH Sao Mai', avatar: '🏛️', color: '#1d4ed8', verified: true, meta: '[[c-page|Trang chính thức · hoạt động từ 2014]] · 🌐' },
      text: '📢 THÔNG BÁO XÉT HỌC BỔNG KHUYẾN KHÍCH HỌC TẬP HỌC KỲ 1, NĂM HỌC 2026-2027\n\n1. Đối tượng: sinh viên chính quy có điểm trung bình học kỳ từ 3,2 và điểm rèn luyện từ loại Tốt.\n2. Hồ sơ: đơn theo mẫu, bảng điểm có xác nhận của khoa.\n3. [[c-onsite|Nộp hồ sơ trực tiếp tại Phòng Công tác sinh viên, phòng A1.105]], từ 20/10 đến 31/10, giờ hành chính.\n4. [[c-nofee|Nhà trường không thu bất kỳ khoản phí nào]]. Tiền học bổng chuyển vào tài khoản sinh viên đã đăng ký với trường.\n\n💡 Sinh viên có hoàn cảnh khó khăn cần vay vốn học tập: liên hệ [[c-vbsp|Ngân hàng Chính sách xã hội tại địa phương]] nơi gia đình cư trú. Phòng CTSV cấp giấy xác nhận sinh viên miễn phí.\n\nMẫu đơn và danh sách chi tiết xem tại [[c-site|saomai.edu.vn/ctsv]].',
      image: { emoji: '🎓', caption: 'Thông báo học bổng KKHT HK1', clue: 'c-img' },
      stats: '👍 1,3K · 💬 214 · ↗ 380',
      comments: [
        { name: 'Lớp trưởng K48 Toán', text: 'Lớp mình ai đủ điều kiện nhớ nộp trước 31/10 nha.' },
        { name: 'Phòng Công tác sinh viên - ĐH Sao Mai', text: 'Lưu ý: Phòng không nhắn tin riêng thu phí hồ sơ. Gặp trường hợp như vậy, các bạn báo ngay cho Phòng.' }
      ]
    },
    clues: {
      'c-page': 'Trang có tích xanh, hoạt động hơn 10 năm, đúng tên phòng của trường.',
      'c-onsite': 'Nộp hồ sơ trực tiếp ở phòng làm việc có số phòng rõ ràng, không qua link lạ.',
      'c-nofee': 'Ghi rõ không thu phí, đúng như học bổng thật.',
      'c-vbsp': 'Vay vốn sinh viên đúng kênh: Ngân hàng Chính sách xã hội, không phải app vay trên mạng.',
      'c-site': 'Dẫn về tên miền chính thức saomai.edu.vn, không sai chữ nào.',
      'c-img': 'Ảnh thông báo do trường tự thiết kế, có logo và số hiệu văn bản.'
    },
    evidence: {
      link: { url: 'saomai.edu.vn/ctsv', bad: false, detail: 'Tên miền chính thức của Trường Đại học Sao Mai, đăng ký từ năm 2008. Trang có cùng thông báo này.', clue: 'c-site' },
      profile: { bad: false, created: 'Năm 2014', friends: '18.000 người theo dõi, phần lớn là sinh viên Sao Mai', detail: 'Trang chính thức có dấu tích xanh, được liên kết từ website saomai.edu.vn. Đăng thông báo đều đặn mỗi tuần.', clue: 'c-page' },
      image: { bad: false, detail: 'Ảnh gốc, chỉ xuất hiện trên trang của trường và website saomai.edu.vn.', clue: 'c-img' }
    },
    answer: 'trust',
    consequence: 'Nếu nghi ngờ rồi bỏ qua, Mai Linh lỡ hạn nộp hồ sơ và mất suất học bổng khuyến khích học tập mà mình đủ điều kiện nhận.',
    explain: 'Thông báo đến từ trang chính thức có tích xanh, nộp hồ sơ trực tiếp, không thu phí và dẫn về saomai.edu.vn.',
    rule: 'Học bổng thật: kênh chính thức, nộp tại trường, không mất phí.'
  },
  {
    id: 'loan-3', type: 'loan', title: 'Tin nhắn đòi nợ',
    reporter: 'Ngọc Bích · K48 Tâm lý học',
    report: {
      from: 'Trần Ngọc Bích', sub: 'SV năm 2 · Khoa Tâm lý học',
      msgs: [
        { time: '14:05' },
        'chị ơi em bị nhắn tin dọa suốt từ sáng',
        'tụi nó bảo bạn cùng lớp em là Tuấn vay tiền app ko trả, bắt em trả thay 😭',
        { shot: ['+84 568 xxx 920', 'Ban la ban cua NGUYEN MINH TUAN', 'no 6.850.000d qua han', 'khong tra thi gui anh len nhom lop'], app: 'Tin nhắn' },
        'em có bảo lãnh j đâu. còn dọa đăng ảnh Tuấn lên nhóm lớp nữa',
        'giờ em phải làm sao ạ, có phải ck cho nó ko'
      ]
    },
    view: {
      kind: 'chat', app: 'sms',
      contact: { name: '+84 568 xxx 920', avatar: '👤', color: '#475569', sub: 'Tin nhắn SMS' },
      messages: [
        { who: 'sys', text: 'Hôm nay 08:17' },
        { who: 'them', text: 'TB: Ban la nguoi than cua NGUYEN MINH TUAN (K48 Tam ly hoc DH Sao Mai). Tuan [[c-contact|da khai so cua ban trong danh ba]] khi vay tai app VayLien.' },
        { who: 'them', text: 'Khoan vay 2.000.000d nay [[c-debt|da thanh 6.850.000d]] do qua han 20 ngay.' },
        { who: 'them', text: 'Yeu cau ban tra thay vao STK [[c-acc|0337 1188 5599 - DINH VAN HUNG]] truoc 18h.' },
        { who: 'sys', text: 'Hôm nay 11:40' },
        { who: 'them', text: '[[c-threat|Khong tra thi tao ghep anh no gui len nhom lop, gui ve nha, cho ca truong biet]]. Ban cung lien quan, dung de bi lien luy.' },
        { who: 'me', text: 'Em không vay, không bảo lãnh gì hết' },
        { who: 'them', text: '[[c-guarantee|Co so trong danh ba la phai chiu trach nhiem]]. Lam kho thi tao goi ca bo me may.' }
      ]
    },
    clues: {
      'c-contact': 'App vay đã đọc trộm danh bạ của Tuấn. Đây đúng là lý do không được cho app vay quyền danh bạ.',
      'c-debt': 'Vay 2 triệu mà 20 ngày thành 6,85 triệu: lãi cắt cổ của tín dụng đen.',
      'c-acc': 'Đòi chuyển vào tài khoản một cá nhân lạ. Trả thay cũng không chấm dứt được chuyện bị đòi tiếp.',
      'c-threat': 'Đe dọa ghép ảnh, bôi nhọ là hành vi vi phạm pháp luật, cần báo công an.',
      'c-guarantee': 'Vô lý: số điện thoại nằm trong danh bạ người khác không làm Bích phải trả nợ thay.'
    },
    evidence: {
      account: { number: '0337 1188 5599', bank: 'Ngân hàng Phương Nam', owner: 'DINH VAN HUNG', reports: 38, bad: true, detail: 'Có 38 cảnh báo: tài khoản dùng để thu tiền đòi nợ của các app vay không phép, nhiều người không hề vay vẫn bị ép trả.', clue: 'c-acc' },
      profile: { bad: true, created: 'Sim kích hoạt 2 tuần trước', friends: 'Đã gửi tin đến hơn 120 số khác nhau', detail: 'Số điện thoại bị nhiều người báo tin rác qua 156. Đổi số liên tục sau mỗi đợt nhắn.', clue: 'c-threat' }
    },
    answer: 'report',
    consequence: 'Bích sợ quá chuyển 1 triệu "trả bớt". Bọn chúng biết Bích dễ bị dọa nên đòi tiếp 2 triệu nữa, và vẫn gửi ảnh ghép lên nhóm lớp.',
    explain: 'Người không vay không có nghĩa vụ trả nợ thay. Đe dọa, bôi nhọ là hành vi của tín dụng đen, cần báo công an.',
    rule: 'Bị đòi nợ thay: không trả, chụp màn hình, chặn số và báo 113.'
  },
  {
    id: 'loan-4', type: 'loan', title: 'Vay 0% lãi',
    reporter: 'Khánh · K47 Tin học',
    report: {
      from: 'Phạm Quốc Khánh', sub: 'SV năm 3 · Khoa Tin học',
      msgs: [
        { time: '23:38' },
        'ad ơi',
        'e đang cần 3tr đóng tiền trọ, thấy bài này quảng cáo vay sv 0% lãi',
        { shot: ['Vay Nhanh Sinh Viên', 'Vay 0% lãi - chỉ cần CCCD + thẻ SV', 'Giải ngân 5 phút', 'Tải app: vaynhanh-sv.top/app.apk'], app: 'ViệtBook' },
        'tải app về nó đòi quyền danh bạ vs ảnh, e chưa bấm cho phép',
        'có nên ko ad, mai hạn đóng trọ r 😭'
      ]
    },
    view: {
      kind: 'post',
      author: { name: 'Vay Nhanh Sinh Viên - Hỗ Trợ 24/7', avatar: '💸', color: '#16a34a', meta: 'Được tài trợ · [[c-page|Trang tạo 9 ngày trước]]' },
      text: '💥 SINH VIÊN CẦN TIỀN GẤP? 💥\n✅ [[c-zero|Vay 0% lãi cho sinh viên]] từ 1 đến 10 triệu\n✅ [[c-easy|Chỉ cần CCCD + thẻ sinh viên, không thẩm định]]\n✅ Giải ngân 5 phút, không cần gặp mặt\n✅ Nợ xấu vẫn hỗ trợ\n👉 Tải app tại link dưới, [[c-perm|cho phép truy cập danh bạ]] để duyệt hồ sơ nhanh hơn!',
      image: { emoji: '📲', caption: 'App Vay Nhanh SV', clue: null },
      link: { url: 'vaynhanh-sv.top/app.apk', title: 'Tải app Vay Nhanh SV (Android)', clue: 'c-apk' },
      stats: '👍 812 · 💬 340 · ↗ 95',
      comments: [
        { name: 'Hoàng Long', text: 'App uy tín, mình vay rồi 👍' },
        { name: 'Thu Hà', text: '[[c-fine|Lãi 0% gì mà mình vay 2tr, 1 tuần sau đòi 2tr4]], gọi cho cả mẹ mình 😡' }
      ]
    },
    clues: {
      'c-page': 'Trang cho vay mới lập 9 ngày, chạy quảng cáo trả tiền. Ngân hàng thật không như vậy.',
      'c-zero': 'Không ai cho vay 0% lãi rồi giải ngân trong 5 phút. Mồi nhử để bạn tải app.',
      'c-easy': '"Chỉ cần CCCD, không thẩm định" thường là tín dụng đen.',
      'c-perm': 'App vay đòi danh bạ là để sau này nhắn tin, gọi điện khủng bố người thân, bạn bè của bạn.',
      'c-apk': 'File .apk tải ngoài cửa hàng ứng dụng, từ tên miền .top lạ. App này có thể đọc danh bạ, ảnh, tin nhắn.',
      'c-fine': 'Bình luận của người đã vay: "0% lãi" nhưng 1 tuần phải trả thêm 400k, tức khoảng 3% mỗi ngày.'
    },
    evidence: {
      link: { url: 'vaynhanh-sv.top/app.apk', bad: true, highlight: '.top/app.apk', detail: 'Tên miền đăng ký 11 ngày trước. File app.apk yêu cầu quyền đọc danh bạ, ảnh, tin nhắn SMS. Lãi thực tế ghi trong điều khoản ẩn: 3%/ngày kèm "phí dịch vụ".', clue: 'c-apk' },
      profile: { bad: true, created: '9 ngày trước', friends: '0 bạn bè, 2.300 người theo dõi', detail: 'Trang không có địa chỉ, không có giấy phép. Đã đổi tên 3 lần, tên cũ "Shop Quần Áo Giá Rẻ".', clue: 'c-page' }
    },
    answer: 'report',
    consequence: 'Khánh vay 3 triệu, chỉ nhận 2,1 triệu vì bị trừ "phí hồ sơ". 10 ngày sau nợ thành 4 triệu, app gửi tin bôi nhọ Khánh tới cả danh bạ, từ mẹ tới cố vấn học tập.',
    explain: 'Vay "0% lãi, không thẩm định" qua app .apk đòi danh bạ là tín dụng đen trá hình.',
    rule: 'App vay nào đòi danh bạ thì xóa ngay, đừng vay.'
  },
  {
    id: 'loan-5', type: 'loan', title: 'Đề cử học bổng',
    reporter: 'Đức Huy · K49 Lịch sử',
    report: {
      from: 'Võ Đức Huy', sub: 'SV năm 1 · Khoa Lịch sử',
      msgs: [
        { time: '19:26' },
        'cho mình hỏi',
        'có anh nhắn tự giới thiệu cán bộ Đoàn trường, bảo mình dc đề cử học bổng doanh nghiệp',
        { shot: ['Hoàng Minh Đức', 'em được Đoàn trường đề cử', 'học bổng DN 5.000.000đ', 'điền form trước thứ 6 nhé'], app: 'Messenger' },
        'nó chưa đòi tiền gì cả, chỉ bảo điền form gg',
        'mình ko quen anh này. điền thì có sao ko'
      ]
    },
    view: {
      kind: 'chat', app: 'messenger',
      contact: { name: 'Hoàng Minh Đức', avatar: '👦', color: '#0284c7', sub: '[[c-nofriend|Các bạn không phải là bạn bè trên ViệtBook]]' },
      messages: [
        { who: 'sys', text: 'Hôm nay 18:58' },
        { who: 'them', text: 'Chào em Huy, anh là Đức, [[c-role|cán bộ Đoàn trường ĐH Sao Mai]] nhé.' },
        { who: 'them', text: 'Đoàn trường vừa đề cử em vào danh sách nhận [[c-sponsor|học bổng doanh nghiệp 5.000.000đ]] do có thành tích hoạt động phong trào tốt.' },
        { who: 'them', text: 'Em điền thông tin vào form này giúp anh trước thứ 6 nhé: [[c-form|forms.gle/hb-doanhnghiep-saomai]]' },
        { who: 'me', text: 'Dạ form cần điền những gì ạ anh?' },
        { who: 'them', text: 'Họ tên, MSSV, SĐT, [[c-info|số CCCD và số tài khoản ngân hàng]] để doanh nghiệp chuyển tiền thôi em. Không mất phí gì đâu 😊' }
      ]
    },
    clues: {
      'c-nofriend': 'Huy không quen người này, cũng chưa kết bạn. Cần kiểm tra người nhắn có đúng là cán bộ Đoàn không.',
      'c-role': 'Ai cũng có thể tự xưng "cán bộ Đoàn". Hãy hỏi lại Văn phòng Đoàn hoặc Phòng Công tác sinh viên.',
      'c-sponsor': 'Học bổng doanh nghiệp có thật, nhưng thường được thông báo công khai trên trang của trường.',
      'c-form': 'Form Google ai cũng tạo được trong 2 phút. Chưa chắc là của trường.',
      'c-info': 'Chưa đòi tiền, nhưng xin số CCCD và tài khoản ngân hàng. Thông tin này có thể bị dùng để lừa tiếp.'
    },
    evidence: {
      link: { url: 'forms.gle/hb-doanhnghiep-saomai', bad: false, detail: 'Đây là form Google thật, không chứa mã độc. Nhưng người tạo form dùng Gmail cá nhân, không phải tài khoản @saomai.edu.vn. Chưa xác định được ai đứng sau.', clue: 'c-form' },
      profile: { bad: false, created: '4 năm trước', friends: '310 bạn bè, 12 bạn chung là sinh viên Sao Mai', detail: 'Tài khoản có hoạt động lâu, từng đăng ảnh các hoạt động tình nguyện. Không thấy tên trong danh sách Ban chấp hành Đoàn trường công khai trên saomai.edu.vn.', clue: 'c-nofriend' }
    },
    answer: 'suspect',
    consequence: 'Nếu tin ngay: Huy gửi số CCCD và tài khoản, vài ngày sau nhận cuộc gọi "học bổng bị lỗi, cần đọc mã OTP để nhận tiền". Nếu chặn luôn mà không hỏi: Huy có thể lỡ một suất học bổng thật.',
    explain: 'Tin có thể thật nhưng đến từ người lạ và xin thông tin nhạy cảm, nên phải hỏi Phòng Công tác sinh viên hoặc Văn phòng Đoàn trước.',
    rule: 'Học bổng đến qua tin nhắn riêng: hỏi Phòng CTSV trước khi điền bất cứ gì.'
  }
];

/* ---------- Thư của Bác Tư (cốt truyện) ----------
   need: số sao tối thiểu để thư hiện ra; boss: true để hiện khi mở khóa trùm cuối */
const LETTERS = [
  { need: 0, title: 'Chào mừng đến Văn phòng Thám tử Mạng', text: 'Chào cháu! Ta là Bác Tư. Mỗi tối fanpage của Văn phòng nhận cả chục tin nhắn của sinh viên Đại học Sao Mai hỏi "cái này có phải lừa đảo không ạ". Nhiệm vụ của cháu: đọc tin trình báo, soi manh mối và trả lời cho đúng. Cố lên nhé, thực tập sinh!' },
  { need: 4, title: 'Một số tài khoản quen quen...', text: 'Cháu có để ý không? Số tài khoản ' + BONG_DEM_ACC + ' xuất hiện ở nhiều vụ, mỗi lần lại đứng một cái tên khác. Có vẻ không phải kẻ lừa đảo lẻ tẻ. Hãy dùng Sổ tra STK thật kỹ nhé.' },
  { need: 12, title: 'Cái tên "Bóng Đêm"', text: 'Ta vừa nhận tin từ bên công an: có một đường dây tên "Bóng Đêm" chuyên nhắm vào sinh viên. Chúng đổi đủ kiểu: trúng thưởng, giả giảng viên, học bổng, việc làm online... nhưng tiền cuối cùng đều chảy về cùng một chỗ. Cháu tiếp tục điều tra nhé.' },
  { need: 22, title: 'Sắp tới lúc rồi', text: 'Hồ sơ của cháu ngày càng dày. Khi mỗi hình thức lừa đảo cháu đều có ít nhất 3 sao, ta sẽ giao cho cháu hồ sơ cuối cùng: lật mặt "Bóng Đêm".' },
  { boss: true, title: 'HỒ SƠ TỐI MẬT: Bóng Đêm', text: 'Cháu đã sẵn sàng. Đêm nay "Bóng Đêm" vừa tung một loạt tin nhắn vào nhóm sinh viên Sao Mai cùng lúc. Hãy mở hồ sơ cuối trong Hộp thư, nhận diện từng chiêu và tìm ra kẻ cầm đầu!' }
];

/* ---------- Trùm cuối: Bóng Đêm ----------
   Mỗi vòng: một tin nhắn, người chơi chọn đúng kiểu lừa đảo.
   Vòng cuối (kind: 'choice') là câu hỏi nhiều lựa chọn. */
const BOSS_ROUNDS = [
  { from: 'SongViet', text: 'SongViet: Chuc mung TB cua Quy khach trung giai Nhi tri an 20 nam (tri gia 15.000.000d). Vui long nop phi thue 1.500.000d de nhan giai. LH 0879xxx312.', type: 'prize' },
  { from: 'Cô Thu Hà (nick mới)', text: 'Em ơi cô đang họp khoa không ra ngoài được, em mua giúp cô 5 thẻ cào 500k chụp mã gửi cô nhé, chiều cô gửi lại.', type: 'school' },
  { from: 'Tuyển CTV Sao Mai', text: 'Đã trả bạn 45k cho 3 nhiệm vụ đầu nha! Giờ nạp 2 triệu để lên nhiệm vụ VIP, hoàn 2,6 triệu sau 15 phút.', type: 'job' },
  { from: 'Quỹ học bổng Ánh Dương', text: 'Chúc mừng bạn đạt học bổng 10.000.000đ. Vui lòng chuyển 500.000đ phí xử lý hồ sơ trước 17h hôm nay.', type: 'loan' },
  { from: 'SaoVietBank', text: 'SaoVietBank: Tai khoan cua Quy khach se bi tam khoa do chua cap nhat sinh trac hoc. Cap nhat tai saovietbank-xacthuc.cc', type: 'phishing' },
  { from: 'Minh (bạn cùng phòng)', text: 'Ê tớ lỡ để số cậu khi đăng ký, nó gửi mã 6 số về máy cậu đó, đọc giúp tớ với gấp lắm.', type: 'otp' },
  { from: 'Cán bộ Công an quận', text: 'Em có liên quan đường dây rửa tiền. Chuyển toàn bộ số dư vào tài khoản tạm giữ để chứng minh trong sạch. Không được nói với gia đình.', type: 'impersonate' },
  {
    kind: 'choice',
    from: 'Bác Tư',
    text: 'Câu hỏi cuối! Bằng chứng nào giúp ta xác định các vụ trên đều do cùng một đường dây "Bóng Đêm"?',
    options: [
      'Các tin nhắn đều gửi vào buổi tối',
      'Cùng một số tài khoản ' + BONG_DEM_ACC + ' nhận tiền ở nhiều vụ khác nhau',
      'Các tin nhắn đều viết không dấu'
    ],
    correct: 1,
    explain: 'Sổ tra STK cho thấy cùng một tài khoản nhận tiền ở vụ trúng thưởng, giả giảng viên, việc làm và học bổng. Báo cáo số tài khoản tại canhbao.ncsc.gov.vn và cho công an giúp truy ra cả đường dây.'
  }
];

/* ---------- Câu hỏi ôn tập để hồi máu ---------- */
const QUIZ = [
  { q: 'Bạn nhận tin trúng thưởng nhưng phải chuyển phí vận chuyển trước. Bạn nên làm gì?', options: ['Chuyển cho nhanh', 'Không trả lời, chụp màn hình, chặn và báo cáo', 'Gửi số CCCD để hỏi thêm'], correct: 1, explain: 'Quà thật không bắt nộp phí trước. Không trả lời, không cung cấp thông tin.' },
  { q: 'Muốn báo cáo tin nhắn rác, lừa đảo, bạn chuyển tiếp tới đầu số nào (miễn phí)?', options: ['5656 hoặc 156', '1080', '911'], correct: 0, explain: 'Chuyển tiếp tin nhắn tới 5656 hoặc 156 để báo cáo.' },
  { q: 'Mã OTP là gì?', options: ['Mã giảm giá', 'Mật khẩu dùng một lần, chỉ mình bạn được biết', 'Mã bình chọn'], correct: 1, explain: 'OTP là chìa khóa tài khoản, không đưa cho bất kỳ ai.' },
  { q: 'Email "Phòng Đào tạo" gửi từ phongdaotao.saomai@gmail.com bắt đóng học phí qua link. Dấu hiệu đáng ngờ nhất là?', options: ['Email viết dài', 'Không có đuôi .edu.vn chính thức của trường', 'Gửi vào buổi sáng'], correct: 1, explain: 'Email chính thức của trường có đuôi .edu.vn.' },
  { q: 'Giảng viên nhắn Messenger nhờ bạn mua 5 thẻ cào vì "đang họp". Bạn nên?', options: ['Mua ngay cho cô', 'Gọi điện hoặc hỏi trực tiếp giảng viên qua kênh chính thức', 'Mua một nửa thôi'], correct: 1, explain: 'Giảng viên không nhờ sinh viên mua thẻ cào. Hãy xác minh trước.' },
  { q: 'Công việc nào sau đây chắc chắn là lừa đảo?', options: ['Phụ quán cà phê, phỏng vấn tại quán', 'Làm nhiệm vụ online, phải nạp tiền để rút thưởng', 'Gia sư qua Trung tâm hỗ trợ sinh viên của trường'], correct: 1, explain: 'Việc thật trả lương cho bạn, không bắt bạn nạp tiền.' },
  { q: 'Trang thật của Ngân hàng Sao Việt là saovietbank.vn. Link nào là giả?', options: ['saovietbank.vn', 'saovietbank-xacthuc.cc', 'Tự mở app SaoViet Mobile'], correct: 1, explain: 'Thêm "-xacthuc" và đuôi lạ .cc là trang giả.' },
  { q: '"Công an" gọi bảo chuyển tiền vào tài khoản tạm giữ và cấm nói với gia đình. Bạn nên?', options: ['Làm theo vì sợ', 'Tắt máy ngay, không tranh luận, kể với người thân', 'Cãi lại cho ra lẽ'], correct: 1, explain: 'Công an không yêu cầu chuyển tiền qua điện thoại. Tắt máy, không tranh luận.' },
  { q: 'Học bổng báo bạn đạt 10 triệu nhưng cần chuyển 500k phí hồ sơ. Bạn nên hỏi ai?', options: ['Người gửi tin', 'Phòng Công tác sinh viên hoặc cố vấn học tập', 'Bạn trên mạng'], correct: 1, explain: 'Liên hệ Phòng CTSV qua số, email chính thức để xác minh.' },
  { q: 'App vay "chỉ cần CCCD, giải ngân 5 phút" đòi quyền đọc danh bạ. Đây là dấu hiệu gì?', options: ['App uy tín', 'Tín dụng đen, có thể khủng bố người thân khi đòi nợ', 'Bình thường'], correct: 1, explain: 'Tín dụng đen hay lấy danh bạ để đe dọa người thân.' },
  { q: 'Muốn báo cáo một website, đường link lừa đảo, bạn vào trang nào?', options: ['canhbao.ncsc.gov.vn', 'Trang do kẻ gian gửi', 'Không cần báo'], correct: 0, explain: 'canhbao.ncsc.gov.vn là trang cảnh báo an toàn thông tin quốc gia.' },
  { q: 'Bị đe dọa hoặc đã mất tiền vì lừa đảo, bạn gọi số nào?', options: ['113 (công an)', '115', '114'], correct: 0, explain: 'Gọi 113 hoặc đến công an phường, xã gần nhất.' },
  { q: 'Trên iPhone, chặn một số lạ thế nào?', options: ['Gần đây → ⓘ → Chặn Người gọi này', 'Xóa danh bạ', 'Tắt máy'], correct: 0, explain: 'Vào Gần đây, nhấn ⓘ cạnh số, chọn Chặn Người gọi này.' },
  { q: 'Khi thấy bất thường nhưng chưa chắc chắn, ai là người nên hỏi đầu tiên?', options: ['Người thân', 'Người gửi tin', 'Không hỏi ai'], correct: 0, explain: 'Người thân luôn là lựa chọn đầu tiên, giúp ta bình tĩnh hơn.' }
];

/* ---------- Cẩm nang xử lý (hiện trong Sổ Huy hiệu) ---------- */
const HELP = {
  steps: [
    'Không trả lời, không cung cấp thông tin cho người lạ qua điện thoại, tin nhắn.',
    'Tắt máy ngay, không tranh luận.',
    'Chụp màn hình tin nhắn, cuộc gọi để báo cáo.',
    'Chặn số điện thoại và báo cáo lừa đảo với nhà mạng, hoặc nhờ người có kinh nghiệm xử lý.'
  ],
  block: [
    { os: 'Android', text: 'Mở Cuộc gọi gần đây → nhấn vào số cần chặn → Chi tiết → Chặn hoặc Chặn & báo cáo spam.' },
    { os: 'iPhone', text: 'Vào Gần đây → nhấn ⓘ cạnh số điện thoại → Chặn Người gọi này.' },
    { os: 'Tin nhắn rác', text: 'Chuyển tiếp tin nhắn tới 5656 hoặc 156 (miễn phí).' }
  ],
  contacts: [
    { who: 'Người thân', when: 'Khi thấy bất thường, chưa chắc chắn. Luôn là lựa chọn đầu tiên.' },
    { who: 'Tổng đài 156', when: 'Báo tin nhắn rác, tin giả, tin lừa đảo. Miễn phí, nhanh.' },
    { who: 'Công an địa phương (113)', when: 'Khi bị đe dọa, bị lừa nghiêm trọng, mất tài sản.' },
    { who: 'canhbao.ncsc.gov.vn', when: 'Báo cáo website, đường link, tài khoản nghi ngờ.' },
    { who: 'Phòng Công tác sinh viên, cố vấn học tập', when: 'Thông báo đáng ngờ về học phí, học bổng, quy định nhà trường. Liên hệ trực tiếp hoặc qua số, email chính thức (.edu.vn).' }
  ]
};
