# 🕵️ Thám Tử Mạng: Hồ Sơ Lừa Đảo

Game giáo dục trên trình duyệt giúp học sinh **nhận biết và phòng tránh lừa đảo trên mạng**.
Người chơi vào vai thực tập sinh của Văn phòng Thám tử Mạng, dùng một "máy tính thám tử" giống Windows
để điều tra các vụ lừa trên mạng xã hội giả lập **ViệtBook**.

- Không cần cài đặt, không cần server, không cần build. Chỉ có HTML, CSS và JavaScript thuần.
- Chạy được trên máy tính và điện thoại (trên điện thoại, cửa sổ tự mở toàn màn hình).
- Tiến trình (sao, tiền, máu, thiết bị) tự lưu trong trình duyệt bằng `localStorage`.

---

## 🎮 Cách chơi

1. **Hộp thư vụ án** 📨: nhận đơn trình báo của học sinh và thư từ Bác Tư.
2. **ViệtBook** 📘: xem bài đăng hoặc tin nhắn. **Chạm vào chỗ đáng ngờ** để thu thập manh mối.
3. **Thiết bị dò tìm**: Kính lúp soi link 🔍, Máy tra ảnh 🖼️, Sổ tra số tài khoản 🏦, Máy soi hồ sơ 🪪.
4. **Kết luận**: chọn **Tin tưởng / Nghi ngờ & xác minh / Chặn & báo cáo**, rồi chọn đúng **kiểu lừa đảo**.
5. Đúng thì nhận ⭐ và 💰. Sai thì mất ❤️ và thấy ngay hậu quả. Hết máu chỉ phải chơi lại vụ đó.
6. **Sổ Huy hiệu** 📒: mỗi kiểu lừa đảo có 5 sao. Đủ 5 sao nhận huy hiệu và mở **Bí kíp phòng tránh**.
7. **Cửa hàng** 🏪: dùng tiền mua và nâng cấp thiết bị (3 cấp). Có mục **Ôn tập hồi máu** miễn phí.
8. Khi mọi kiểu lừa đảo có ít nhất 3 sao, mở **Hồ sơ cuối: lật mặt đường dây "Bóng Đêm"**.

Lần đầu mở game sẽ có hướng dẫn **"Ngày đầu đi làm"** do Bác Tư dẫn từng bước.
Chơi lại hướng dẫn hoặc xóa tiến trình: bấm nút 🕵️ ở góc dưới bên trái.

### Nội dung hiện có

| Chương | Kiểu lừa đảo | Số tình huống |
|---|---|---|
| 1 | 🎁 Trúng thưởng giả | 5 |
| 2 | 🛒 Shop ảo, mua bán online | 5 |
| 3 | 👥 Tài khoản bạn bè bị hack | 5 |
| 4 | 💼 Việc nhẹ lương cao | 5 |
| 5 | 👮 Giả danh công an, ngân hàng, nhà trường | 5 |
| 6 | 📸 Dụ dỗ, tống tiền bằng ảnh | 5 |
| Cuối | 🌑 Đường dây "Bóng Đêm" | 7 vòng |

Mỗi chương có cả tình huống **an toàn** (ví dụ cuộc thi thật của trường) để học sinh không bấm "báo cáo" theo thói quen
mà phải thật sự đọc dấu hiệu. Chương sau mở khi chương trước có 2 sao.

---

## 📁 Cấu trúc thư mục

```
tham-tu-mang/
├── index.html      ← trang chính, mở file này để chơi
├── css/
│   └── style.css   ← giao diện (Windows, ViệtBook, điện thoại)
├── js/
│   ├── data.js     ← TOÀN BỘ nội dung: kiểu lừa đảo, tình huống, thư, trùm cuối, câu hỏi ôn tập
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

## ✍️ Thêm tình huống mới

Mọi nội dung nằm trong `js/data.js`. Không cần sửa `game.js`.

1. Mở `js/data.js`, tìm mảng `SCENARIOS`.
2. Copy một tình huống có sẵn cùng kiểu (bài đăng thì copy `prize-1`, tin nhắn thì copy `prize-2`).
3. Dán vào cuối mảng (trước dấu `];`), nhớ có dấu phẩy giữa các tình huống.
4. Sửa nội dung theo mẫu dưới đây.

```js
{
  id: 'shop-6',                 // mã riêng, KHÔNG được trùng
  type: 'shop',                 // kiểu lừa đảo: prize, shop, hack, job, impersonate, blackmail
  title: 'Bán điện thoại cũ',   // tên hồ sơ
  reporter: 'Lan Anh, lớp 8A',  // người gửi đơn
  brief: 'Lời kể của học sinh...',
  view: {
    kind: 'chat',               // 'chat' = tin nhắn, 'post' = bài đăng
    contact: { name: 'Shop ABC', avatar: '📱', color: '#059669', sub: 'Shop' },
    messages: [
      { who: 'them', text: 'Máy còn mới 99%, [[c-cheap|giá chỉ 1 triệu]]!' },
      { who: 'me',   text: 'Cho mình xem máy trực tiếp được không?' }
    ]
  },
  clues: {                      // giải thích cho từng manh mối [[...]]
    'c-cheap': 'Giá rẻ bất thường so với giá thị trường.'
  },
  evidence: {                   // bằng chứng cho thiết bị dò tìm (có thể bỏ trống: {})
    account: { number: '1234 5678', bank: 'Ngân hàng X', owner: 'NGUYEN VAN A',
               reports: 5, bad: true, detail: 'Có 5 cảnh báo lừa đảo.', clue: 'c-cheap' }
  },
  answer: 'report',             // đáp án đúng: 'trust', 'suspect' hoặc 'report'
  consequence: 'Điều xảy ra nếu chọn sai...',
  explain: 'Một câu giải thích vì sao.',
  rule: 'Quy tắc vàng ngắn gọn để học sinh ghi nhớ.'
},
```

### Quy tắc viết manh mối

- Trong chữ, viết `[[ma-manh-moi|chữ hiện ra]]` để biến đoạn chữ đó thành chỗ bấm được.
- Mỗi `ma-manh-moi` phải có lời giải thích trong `clues`.
- Bài đăng (`kind: 'post'`) có thêm `author`, `text`, `image`, `link`, `stats`, `comments`. Xem mẫu `prize-1`.

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
- Muốn thêm **kiểu lừa đảo mới**: thêm một mục vào `SCAM_TYPES` (có `id`, `name`, `icon`, `color`, `badge`, `tips`) rồi viết 5 tình huống với `type` là `id` đó.
- Có thể sửa thư của Bác Tư trong `LETTERS`, các vòng trùm cuối trong `BOSS_ROUNDS`, câu hỏi hồi máu trong `QUIZ`.
- Sửa xong, lưu file và tải lại trang. Nếu game trắng trang, bấm `F12` → tab **Console** để xem lỗi (thường do thiếu dấu phẩy hoặc dấu nháy).

### Chỉnh độ khó

Ở đầu file `js/game.js` có các con số dễ chỉnh: máu tối đa, máu bị trừ khi sai, tiền thưởng, giá thiết bị,
số sao cần để mở chương tiếp theo và trùm cuối.

---

## ℹ️ Ghi chú

- Tên người, trang, ngân hàng, số tài khoản trong game đều là **hư cấu**, dựa trên các thủ đoạn lừa đảo có thật ở Việt Nam.
- Các số điện thoại hỗ trợ trong game là thật: **111** (Tổng đài quốc gia bảo vệ trẻ em), **113** (Công an),
  **5656** (báo cáo tin nhắn rác), trang tra cứu cảnh báo **canhbao.khonggianmang.vn**.
- Tiến trình lưu theo từng trình duyệt. Đổi máy hoặc xóa dữ liệu duyệt web thì tiến trình sẽ bắt đầu lại.
