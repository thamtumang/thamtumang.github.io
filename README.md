# 🕵️ Thám Tử Mạng: Hồ Sơ Lừa Đảo

Game giáo dục trên trình duyệt giúp học sinh, sinh viên **nhận biết và phòng tránh lừa đảo trên mạng**.
Người chơi vào vai thực tập sinh của Văn phòng Thám tử Mạng, đăng nhập vào một "máy tính thám tử" giống Windows 11
để điều tra các vụ lừa qua tin nhắn SMS, Zalo, Messenger, email và mạng xã hội giả lập **ViệtBook**.

Nội dung dựa trên tài liệu **"Phòng tránh lừa đảo nhắm vào sinh viên trên môi trường số"**: 7 hình thức lừa đảo,
cách xử lý, cách chặn số lạ và các nguồn trợ giúp đáng tin cậy.

- Không cần cài đặt, không cần server, không cần build. Chỉ có HTML, CSS và JavaScript thuần.
- Chạy được trên máy tính và điện thoại (trên điện thoại, cửa sổ tự mở toàn màn hình).
- Có **tài khoản đăng nhập** và **bảng xếp hạng**. Mặc định lưu trên trình duyệt; có thể bật bản trực tuyến (xem mục "Bảng xếp hạng trực tuyến").
- Cửa sổ tự xếp cạnh nhau khi mở nhiều ứng dụng (không chồng lên nhau).

---

## 🎮 Cách chơi

0. **Đăng nhập**: bấm vào màn hình khóa, tạo tài khoản (chọn ảnh đại diện, tên hiển thị, tên đăng nhập, mật khẩu) hoặc chơi với tư cách Khách.
1. **Hộp thư vụ án** 📨: đọc tin nhắn trình báo của sinh viên (có ảnh chụp màn hình) và thư từ Bác Tư.
2. **ViệtBook** 📘: xem tận mắt tin nhắn SMS, Zalo, Messenger, email hoặc bài đăng. **Chạm vào chỗ đáng ngờ** để thu thập manh mối.
3. **Thiết bị dò tìm**: Kính lúp soi link 🔍, Máy tra ảnh 🖼️, Sổ tra số tài khoản 🏦, Máy soi hồ sơ 🪪.
4. **Kết luận**: chọn **Tin tưởng / Nghi ngờ & xác minh / Chặn & báo cáo**, rồi chọn đúng **kiểu lừa đảo**.
5. Đúng thì nhận ⭐ và 💰. Sai thì mất ❤️ và thấy ngay hậu quả. Hết máu chỉ phải chơi lại vụ đó.
6. **Sổ Huy hiệu** 📒: mỗi kiểu lừa đảo có 5 sao. Đủ 5 sao nhận huy hiệu và mở **Bí kíp phòng tránh**.
7. **Cửa hàng** 🏪: dùng tiền mua và nâng cấp thiết bị (3 cấp). Có mục **Ôn tập hồi máu** miễn phí.
8. Khi mọi kiểu lừa đảo có ít nhất 3 sao, mở **Hồ sơ cuối: lật mặt đường dây "Bóng Đêm"**.
9. **Bảng xếp hạng** 🏆: điểm = số sao × 100 + số huy hiệu × 200 + 1000 nếu hạ được "Bóng Đêm".

Sổ Huy hiệu có thêm trang **"Khi gặp dấu hiệu lừa đảo"**: các bước xử lý, cách chặn số lạ trên Android và iPhone,
báo tin nhắn rác qua 5656 hoặc 156, và danh sách nguồn trợ giúp (người thân, 156, 113, canhbao.ncsc.gov.vn, Phòng Công tác sinh viên).

Lần đầu mở game sẽ có hướng dẫn **"Ngày đầu đi làm"** do Bác Tư dẫn từng bước.
Chơi lại hướng dẫn, xóa tiến trình hoặc đăng xuất: mở menu **Bắt đầu** (logo ở giữa thanh taskbar), bấm nút nguồn ở góc dưới.

### Nội dung hiện có

| Chương | Kiểu lừa đảo | Số tình huống |
|---|---|---|
| 1 | Giả mạo trúng thưởng (`prize`) | 5 |
| 2 | Giả danh người quen, cơ quan (`impersonate`) | 5 |
| 3 | Đầu tư, việc làm online (`job`) | 5 |
| 4 | Link giả mạo, phishing (`phishing`) | 5 |
| 5 | Lừa lấy mã OTP (`otp`) | 5 |
| 6 | Giả danh giảng viên, nhà trường (`school`) | 5 |
| 7 | Học bổng, vay tiền sinh viên (`loan`) | 5 |
| Cuối | Đường dây "Bóng Đêm" | 8 vòng |

Mỗi chương có 1 tình huống **an toàn** (ví dụ email thật từ đuôi `.edu.vn`, tin biến động số dư thật) và 1 tình huống
**cần xác minh** (ví dụ mẹ nhắn từ số mới), để người chơi không bấm "báo cáo" theo thói quen mà phải thật sự đọc dấu hiệu.

Nhân vật là sinh viên của **Trường Đại học Sao Mai** (trường hư cấu, web `saomai.edu.vn`). Ngân hàng Sao Việt, Ví MoMi,
nhà mạng Sóng Việt... đều là tên hư cấu để không giả mạo tổ chức có thật. Chương sau mở khi chương trước có 2 sao.

---

## 📁 Cấu trúc thư mục

```
tham-tu-mang/
├── index.html      ← trang chính, mở file này để chơi
├── css/
│   ├── fonts.css   ← khai báo phông chữ
│   └── style.css   ← giao diện (Windows 11, ViệtBook, Zalo, SMS, email, điện thoại)
├── fonts/          ← phông Be Vietnam Pro và Baloo 2 (giấy phép OFL, dùng miễn phí)
├── img/
│   ├── logo.svg       ← logo game
│   └── wallpaper.svg  ← hình nền
├── js/
│   ├── config.js   ← cấu hình bảng xếp hạng trực tuyến (Firebase), mặc định để trống
│   ├── icons.js    ← bộ icon ứng dụng, avatar nhân vật, huy chương (vẽ bằng SVG)
│   ├── store.js    ← tài khoản, lưu tiến trình, bảng xếp hạng
│   ├── data.js     ← TOÀN BỘ nội dung: kiểu lừa đảo, tình huống, thư, trùm cuối, câu hỏi ôn tập, cẩm nang
│   └── game.js     ← logic game (cửa sổ, điều tra, sao, tiền, máu, cửa hàng, hướng dẫn)
└── README.md
```

---

## 💻 Mở và chạy bằng VS Code

1. Cài [Visual Studio Code](https://code.visualstudio.com/).
2. Giải nén file `tham-tu-mang.zip`.
3. Trong VS Code: **File → Open Folder...** rồi chọn thư mục `tham-tu-mang`.
4. Cài extension **Live Server** (tác giả Ritwick Dey): bấm biểu tượng Extensions ở thanh bên trái (hoặc `Ctrl+Shift+X`), tìm "Live Server", bấm **Install**.
5. Mở file `index.html`, bấm chuột phải chọn **Open with Live Server** (hoặc bấm **Go Live** ở góc dưới bên phải).
6. Trình duyệt tự mở game ở địa chỉ dạng `http://127.0.0.1:5500`. Mỗi lần bạn lưu file, trang tự tải lại.

> Không có Live Server vẫn chơi được: nhấp đúp file `index.html` để mở thẳng bằng Chrome, Edge hoặc Firefox.

**Thử giao diện điện thoại:** trong Chrome bấm `F12`, rồi bấm biểu tượng điện thoại (Toggle device toolbar, `Ctrl+Shift+M`).

**Chơi trên điện thoại thật cùng mạng Wi-Fi:** khi Live Server đang chạy, mở trên điện thoại địa chỉ
`http://<địa-chỉ-IP-máy-tính>:5500` (xem IP bằng lệnh `ipconfig` trên Windows).

---

## 🚀 Đưa lên GitHub

> ⚠️ Phải tải lên **đủ cả các thư mục `css`, `js`, `img`, `fonts`** cùng `index.html`. Nếu chỉ tải `index.html`, trang sẽ trắng.

### Cách 1: Dùng ngay trong VS Code (không cần gõ lệnh)

1. Tạo tài khoản tại [github.com](https://github.com) nếu chưa có.
2. Cài [Git](https://git-scm.com/downloads) cho máy tính (cài xong, khởi động lại VS Code).
3. Trong VS Code, mở thư mục `tham-tu-mang`, bấm biểu tượng **Source Control** ở thanh bên trái (`Ctrl+Shift+G`).
4. Bấm **Publish to GitHub**, đăng nhập GitHub khi được hỏi, chọn **Public repository**.
5. VS Code sẽ tạo repository và tải toàn bộ code lên.

Sau này mỗi lần sửa code: vào Source Control, gõ một dòng mô tả thay đổi, bấm **Commit**, rồi bấm **Sync Changes**.

### Cách 2: Dùng Terminal

Tạo một repository trống trên GitHub (ví dụ tên `tham-tu-mang`), rồi trong VS Code mở **Terminal → New Terminal** và gõ:

```bash
git init
git add .
git commit -m "Phiên bản đầu tiên của Thám Tử Mạng"
git branch -M main
git remote add origin https://github.com/<ten-tai-khoan>/tham-tu-mang.git
git push -u origin main
```

## 🌐 Bật GitHub Pages (để ai cũng chơi được qua link)

1. Vào repository trên GitHub, chọn **Settings → Pages**.
2. Ở mục **Build and deployment**, phần **Source** chọn **Deploy from a branch**.
3. Phần **Branch** chọn `main` và thư mục `/ (root)`, bấm **Save**.
4. Đợi 1 đến 2 phút, tải lại trang. GitHub sẽ hiện link dạng:
   `https://<ten-tai-khoan>.github.io/tham-tu-mang/`
5. Gửi link này cho học sinh. Chơi được trên cả máy tính và điện thoại.

Mỗi lần bạn push code mới lên nhánh `main`, trang web tự cập nhật sau khoảng 1 phút.

---

## 🏆 Bảng xếp hạng trực tuyến (không bắt buộc)

Mặc định, tài khoản và bảng xếp hạng lưu **trên trình duyệt của từng máy**: ai chơi chung một máy sẽ thấy nhau trên bảng.
Muốn cả lớp đăng nhập ở bất kỳ máy nào và xếp hạng chung, dùng Firebase (miễn phí):

1. Vào [console.firebase.google.com](https://console.firebase.google.com), bấm **Add project**, đặt tên (ví dụ `tham-tu-mang`).
2. Trong dự án, chọn **Build → Authentication → Get started → Sign-in method**, bật **Email/Password**.
3. Chọn **Build → Firestore Database → Create database** (chọn vị trí gần, ví dụ `asia-southeast1`).
4. Ở tab **Rules** của Firestore, dán đoạn sau rồi bấm **Publish**:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /players/{uid} {
         allow read: if true;
         allow write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
5. Vào **Project settings** (bánh răng) → **Your apps** → bấm biểu tượng `</>` để thêm Web app. Firebase hiện một đoạn `firebaseConfig`.
6. Mở `js/config.js`, thay dòng `window.FIREBASE_CONFIG = null;` bằng cấu hình vừa nhận, ví dụ:
   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "AIza...",
     authDomain: "tham-tu-mang.firebaseapp.com",
     projectId: "tham-tu-mang",
     storageBucket: "tham-tu-mang.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef"
   };
   ```
7. Trong **Authentication → Settings → Authorized domains**, thêm tên miền GitHub Pages của bạn (ví dụ `ten-tai-khoan.github.io`).
8. Lưu, đưa lên GitHub. Màn hình đăng nhập sẽ hiện "Tài khoản trực tuyến".

Ghi chú: tên đăng nhập được đổi thành email nội bộ dạng `ten@thamtumang.game`, học sinh không cần email thật.
Các khóa trong `config.js` là khóa công khai của Firebase, đưa lên GitHub được; quyền ghi được bảo vệ bằng Rules ở bước 4.
Nếu Firebase lỗi hoặc không có mạng, game tự quay về chế độ lưu trên máy.

---

## ✍️ Thêm tình huống mới

Mọi nội dung nằm trong `js/data.js`. Không cần sửa `game.js`.

1. Mở `js/data.js`, tìm mảng `SCENARIOS`.
2. Copy một tình huống có sẵn cùng dạng: bài đăng (`prize-1`), SMS (`prize-3`), Zalo (`otp-1`), Messenger (`impersonate-1`), email (`school-4`).
3. Dán vào trong mảng (trước dấu `];`), nhớ có dấu phẩy giữa các tình huống.
4. Sửa nội dung theo mẫu dưới đây.

```js
{
  id: 'otp-6',                  // mã riêng, KHÔNG được trùng
  type: 'otp',                  // prize, impersonate, job, phishing, otp, school, loan
  title: 'Nhân viên ví gọi',    // tên hồ sơ
  reporter: 'Thảo · K49 Hóa',   // dòng ngắn hiện trong Hộp thư
  report: {                     // tin nhắn sinh viên gửi Văn phòng
    from: 'Lê Phương Thảo', sub: 'SV năm 1 · Khoa Hóa học',
    msgs: [
      { time: '22:05' },                       // mốc giờ
      'ad ơi cho e hỏi',                       // mỗi chuỗi là một tin nhắn
      { shot: ['MoMi', 'Ma OTP: 482913'], app: 'Tin nhắn' },  // ảnh chụp màn hình
      'có ng gọi xin mã này, e có nên đưa ko ạ'
    ]
  },
  view: {
    kind: 'chat',               // 'chat', 'post' hoặc 'email'
    app: 'sms',                 // với chat: 'messenger', 'zalo' hoặc 'sms'
    contact: { name: 'MoMi', avatar: '💳', color: '#a50064', sub: 'Tin nhắn SMS' },
    messages: [
      { who: 'sys', text: 'Hôm nay 22:01' },
      { who: 'them', text: 'Ma OTP de [[c-what|CHUYEN 4.800.000d]] la 482913.' }
    ]
  },
  clues: {                      // giải thích cho từng manh mối [[...]]
    'c-what': 'Mã này dùng để chuyển tiền đi, không phải để nhận tiền hoàn.'
  },
  evidence: {},                 // bằng chứng cho thiết bị dò tìm (xem bảng bên dưới)
  answer: 'report',             // 'trust', 'suspect' hoặc 'report'
  consequence: 'Điều xảy ra nếu chọn sai...',
  explain: 'Một câu giải thích vì sao.',
  rule: 'Quy tắc vàng ngắn gọn để ghi nhớ.'
},
```

### Quy tắc viết manh mối

- Trong chữ, viết `[[ma-manh-moi|chữ hiện ra]]` để biến đoạn chữ đó thành chỗ bấm được.
- Mỗi `ma-manh-moi` phải có lời giải thích trong `clues`, và chỉ xuất hiện một lần.
- Bài đăng (`kind: 'post'`) có `author`, `text`, `image`, `link`, `stats`, `comments`. Xem mẫu `prize-1`.
- Email (`kind: 'email'`) có `from: { name, addr }`, `to`, `subject`, `date`, `body`, `button: { text, clue }`, `sig`.
- `avatar` là một trong 👧 👩 🧒 👦 👨‍🏫 👮 👤 thì game vẽ hình người; emoji khác thì vẽ logo chữ cái theo `color`.

### Các loại bằng chứng (`evidence`)

| Thiết bị | Khóa | Các trường |
|---|---|---|
| 🔍 Kính lúp soi link | `link` | `url`, `bad`, `highlight` (phần chữ tô đỏ), `detail`, `clue` |
| 🖼️ Máy tra ảnh | `image` | `bad`, `detail`, `clue` |
| 🏦 Sổ tra STK | `account` | `number`, `bank`, `owner`, `reports`, `bad`, `detail`, `clue` |
| 🪪 Máy soi hồ sơ | `profile` | `created`, `friends`, `bad`, `detail`, `clue` |

`bad: true` là nguy hiểm, `bad: false` là an toàn. `clue` là manh mối tự được đánh dấu khi thiết bị đạt cấp 2.

### Lưu ý khi thêm nội dung

- Mỗi kiểu lừa đảo cần **đúng 5 tình huống** để Sổ Huy hiệu tính đủ 5 sao. Nếu thêm nhiều hơn 5, học sinh sẽ nhận huy hiệu khi có 5 sao bất kỳ.
- Muốn thêm **kiểu lừa đảo mới**: thêm một mục vào `SCAM_TYPES` (có `id`, `name`, `color`, `badge`, `sign`, `tips`) rồi viết 5 tình huống với `type` là `id` đó. Icon của kiểu mới khai báo trong `TYPE_ICONS` ở `js/icons.js`.
- Có thể sửa thư của Bác Tư trong `LETTERS`, các vòng trùm cuối trong `BOSS_ROUNDS`, câu hỏi hồi máu trong `QUIZ`, cẩm nang xử lý trong `HELP`.
- Sửa xong, lưu file và tải lại trang. Nếu game trắng trang, bấm `F12` → tab **Console** để xem lỗi (thường do thiếu dấu phẩy hoặc dấu nháy).

### Chỉnh độ khó

Ở đầu file `js/game.js` có các con số dễ chỉnh: máu tối đa, máu bị trừ khi sai, tiền thưởng, giá thiết bị,
số sao cần để mở chương tiếp theo và trùm cuối.

---

## ℹ️ Ghi chú

- Tên người, trường, ngân hàng, ví điện tử, số tài khoản trong game đều là **hư cấu**, dựa trên các thủ đoạn lừa đảo có thật ở Việt Nam.
- Các đầu số và trang trợ giúp trong game là thật: **156** (Bộ Khoa học và Công nghệ, báo tin rác, lừa đảo), **5656** (báo tin nhắn rác),
  **113** (Công an), trang **canhbao.ncsc.gov.vn** (báo cáo website, link, tài khoản nghi ngờ).
- Ở chế độ mặc định, tài khoản và tiến trình lưu theo từng trình duyệt. Đổi máy hoặc xóa dữ liệu duyệt web thì phải tạo tài khoản lại.
  Mật khẩu chế độ này chỉ để phân biệt người chơi trên cùng máy, không dùng mật khẩu thật của bạn.
