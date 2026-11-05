# Ca trực an toàn số

Chế độ điều tra mới trong desktop Thám Tử Mạng. Mở biểu tượng **Ca trực** hoặc nút ca trực trong **Hộp thư**. Có thể dùng nút **Vào tài khoản thử nghiệm** ở màn hình đăng nhập.

## Hai ca chơi hoàn chỉnh

- **45 nghìn đầu tiên**: bạn học đã nhận tiền làm nhiệm vụ, đang định nạp thêm. Hỏi chuyện, đọc bài tuyển dụng, xác minh với nhà trường rồi đối chiếu bằng chứng. Khuyên nạp tiền mở nhánh khắc phục hậu quả, không kết thúc ngay.
- **Một lời mời khác**: lời mời hỗ trợ sự kiện có thể xác minh qua trường. Người chơi cần kiểm tra rồi chọn cách tham gia an toàn, tránh mặc định mọi lời mời đều là lừa đảo.

Tin nhắn, trường, nhân vật, giao dịch và tài liệu tra cứu đều là mô phỏng; không gửi tin hay chuyển tiền ra ngoài. Hội thoại được viết sẵn, không dùng API AI. Lựa chọn hỏi thêm mở tài liệu và phản hồi khác nhau. Đây không phải trò chuyện tự do.

## Cách chơi

1. Chọn câu hỏi trong **Tin nhắn**, giữ các dữ kiện cần dùng.
2. Mở **Tra cứu**, tìm và kiểm tra nguồn độc lập.
3. Trong **Sổ điều tra**, chọn hai dữ kiện và mối liên hệ: mâu thuẫn, xác nhận, hoặc chưa đủ kết luận.
4. Gửi lời khuyên dựa trên bằng chứng. Nếu đã khuyên chuyển tiền, tiếp tục hỗ trợ khắc phục.
5. Chọn kế hoạch ứng phó và xem điểm, giải thích, nhật ký.

Không bắt buộc mở hết đầu mối. Hai nguồn phù hợp, có xác minh độc lập và đối chiếu đúng có thể đạt điểm tối đa. Hồ sơ lâu năm hoặc thiếu dấu tích không tự chứng minh thật/giả. Nhánh khắc phục không hứa hoàn tiền.

## Điểm quá trình (bản thử nghiệm)

| Thành phần | Tối đa | Cách ghi nhận |
|---|---:|---|
| Nhận diện | 25 | Hai dữ kiện phù hợp: 10; đối chiếu hợp lý: 15 |
| Xác minh | 35 | Kênh độc lập: 20; đối chiếu hợp lý: 15 |
| Quyết định | 20 | Lời khuyên ban đầu an toàn và không gây chuyển tiền sai: 10; quyết định cuối phù hợp: 10 |
| Ứng phó | 20 | Tỷ lệ hành động phù hợp đã chọn trong kế hoạch của nhánh |

Kế hoạch có hành động gây hại phải được sửa trước khi gửi. Chọn ít nhất hai hành động; nhánh đã chuyển tiền bắt buộc dừng chuyển thêm. Mở lại cùng dữ kiện không cộng thêm điểm. Kết quả không cộng tiền/sao vào 42 hồ sơ cũ.

Đây là quy tắc chấm điểm nguyên mẫu để chơi thử, chưa phải rubric đã thẩm định. Nhận diện và xác minh hiện cùng dùng một thao tác đối chiếu; khi dùng đánh giá nghiên cứu cần rà lại mức chồng lấn, ánh xạ YCCĐ và thử độ nhất quán giữa người chấm.

## Phạm vi và lưu tiến trình

Giữ nguyên bố cục desktop và 42 hồ sơ cũ. Chế độ mới lưu ca hiện tại theo tài khoản bằng hệ thống lưu sẵn có. Tải lại có thể tiếp tục; nhận ca mới thay tiến trình ca trực trước, chưa có lịch sử nhiều lượt hoặc xuất dữ liệu nghiên cứu. Tài khoản thử nghiệm lưu cục bộ, không ghi bảng xếp hạng.

Có đoạn nối đầu mối sang Bóng Đêm sau ca Vy để luyện phân biệt dấu hiệu giống nhau và kết luận cùng chủ. Đây chỉ là đoạn dẫn, chưa thay thế chuyên án/Boss cũ.

## Nguồn nội dung

Ca Vy chuyển thể cơ chế trả khoản nhỏ, yêu cầu nạp tiền làm nhiệm vụ rồi đòi thêm tiền từ các cảnh báo sau. Tên người, trường, câu thoại, bài đăng và số tiền cụ thể là hư cấu phục vụ gameplay. Ca sự kiện là tình huống đối chứng hư cấu. Nguồn chỉ hiện sau khi kết thúc ca để không lộ đáp án.

- https://www.canhsatquanlyhanhchinh.gov.vn/phong-chong-toi-pham/canh-giac-thu-doan-lua-dao-tuyen-cong-tac-vien-lam-online-viec-nhe-luong-cao-2681
- https://congan.com.vn/vu-an/canh-giac/cam-bay-xem-video-cung-co-tien-nhieu-phu-nu-bi-lua-tien-ty_160420.html

## Chạy và kiểm tra

Chạy `python3 -m http.server 8000` trong thư mục dự án, mở http://localhost:8000. Mã chính: `js/shift.js`, `css/shift.css`; tích hợp ở `index.html`, `js/game.js`.

- `node --check js/shift.js`
- `node --check js/game.js`
- `node tests/shift.test.cjs`
- `node tests/demo-account.test.cjs`

Đã chơi trên trình duyệt: ngăn chặn, xác minh lời mời thật, khắc phục khi đã chuyển tiền, chặn kế hoạch gây hại, lưu và tải lại. Kiểm tra khung 390 px không tràn ngang; chưa thay cho thử trên điện thoại thật hoặc thử nghiệm với học sinh.
