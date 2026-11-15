# Vy — chọn nội dung cho bản chuẩn bị thông tin

Kiểm ngày 15/11/2026. Mốc đầu: `0f00a1ceb77ccd8c11ef5a0e681ae5ac875a91e6`.
Bản runtime đã quan sát trên Pages: `f1e5d0380aa214ab8cb2373906e494ae8ad8fc84` (cache `ca-vy-dossier-v5`).

## Đường vào và thay đổi

Tất cả lượt UI vào từ https://thamtumang.github.io/game-goc.html → Chơi thử không cần tài khoản → nhấp đúp Ca trực. Chuỗi nạp: `game-goc.html` → `js/game.js` → `ca-truc/ban-thu/index.html` → `app.js`.

Trước sửa, bản chuẩn bị chỉ là tóm tắt tự điền và nút lưu; không có lựa chọn tài liệu hoặc lượt gửi Vy xem. Nay lựa chọn, nháp, gửi, lưu riêng chứng cứ và lưu phiên bản là các trạng thái khác nhau. Mỗi tài liệu nêu nguồn, vai trò và giới hạn. Tóm tắt tự điền không được tính vào số tài liệu đính kèm. Không thêm quy trình liên hệ thực tế hoặc lời hứa thu hồi tiền.

## Các lượt thực sự đã chạy trên UI

| Lượt | Kết quả quan sát |
| --- | --- |
| A — chỉ biên lai 45k | Nháp ghi tiền đã nhận riêng. Gửi mới tạo tin. Vy nói biên lai thể hiện lần nhận tiền, còn thiếu khoản đã chuyển. Không tự lưu chứng cứ. Đã chạy lại trên v5. |
| B — chứng từ rồi bổ sung tin nhắn | Lần đầu Vy nhắc thiếu yêu cầu tiền. Nút bổ sung chọn thêm tin nhắn; phải xem nháp và gửi. Giữ hai tin/version, phản hồi mới ghi có cả khoản chuyển và yêu cầu. Cùng bộ hiện tại không còn nút gửi lại. Lưu không tạo thêm tin. Chạy trên v5. |
| C — chỉ tin nhắn; chỉ bài tuyển | Hai lượt khách riêng. Tin nhắn: thiếu chứng từ đã chuyển. Bài tuyển: chỉ là bối cảnh công việc, thiếu chứng từ. Không coi bài thật là xác minh lời mời riêng. |
| D — bốn tài liệu chính | Chọn đủ bốn, xem nháp và gửi. Vy ghi có khoản chuyển và yêu cầu; bài tuyển thêm bối cảnh, chưa xác nhận lời mời. Không thông báo hồ sơ đầy đủ hay thưởng điểm. Hỏi riêng hai câu Studio rồi trở lại: hai phản hồi mới xuất hiện trong bộ chọn. Gửi phản hồi quy trình vẫn chốt dừng; tổng kết 500k chưa thu hồi. |
| E — chọn, nháp, hủy | Trên lượt đã gửi và lưu bài tuyển, thêm biên lai 45k, xem nháp rồi hủy. Số tin đã gửi vẫn 1; bản lưu vẫn chỉ chứa bài tuyển. Chọn không tự lưu riêng chứng cứ. |
| F — bản lưu 500k rồi chuyển thêm | Lưu bản 500k, chủ động xác nhận chuyển thêm. Tổng hiện tại 1,5 triệu, bản cũ vẫn 500k và cảnh báo cần cập nhật. Cập nhật nháp mới có MP-500-042 và MP-1000-043; lưu tạo bản 2, bản 1 vẫn đọc được. |
| G — giữ nháp và reset khách | Đang có nháp tin nhắn: đóng riêng Ca trực, mở lại vẫn đúng nháp. Tin mở cảnh hồ sơ chỉ một lần. Tải lại trang và vào khách mới: không ô được chọn, không nháp, không bản lưu. |
| H — dữ liệu cũ | Tạo bản lưu theo schema cũ 500k bằng tài khoản demo trước khi đưa tính năng mới lên. Mở lại sau cập nhật: giữ bản cũ, không tự chọn tài liệu, không tự tạo tin gửi hoặc tin mở cảnh mới. Đây là tài khoản demo local; chưa kiểm tài khoản Firebase thật. |

A và H được quan sát từ các bản đầu của cùng thay đổi; A đã chạy lại ở v5. Các sửa v3–v5 chỉ làm ổn định checkbox/focus/cuộn, không đổi migration. B–G và nhánh xác minh cuối chạy trên v5.

## Ảnh Pages qua đường vào thật

- [Nháp chỉ có biên lai 45k](receipt45-draft.jpg)
- [Vy phản hồi còn thiếu chứng từ khoản đã chuyển](missing-transfer-response.jpg)
- [Bản bổ sung, giữ lịch sử bản trước](supplemented-version.jpg)
- [Kiểm zoom 400%, không phải điện thoại thật](narrow-draft.jpg)

## Dữ liệu và hồi quy

Giữ khóa `payment-v1`, thêm mặc định cho lựa chọn/nháp/lịch sử gửi/bản lưu. Snapshot mới schema 2 chứa nguyên văn nguồn ở thời điểm lưu/gửi. Snapshot cũ đọc trung tính theo dữ liệu cũ, không suy ra người chơi từng chọn hoặc gửi tài liệu. Khi cũ chỉ lưu cờ chứng từ, tổng đã lưu được suy ra theo trạng thái chuyển thêm đã có; dữ liệu cũ không có snapshot không thể phục dựng nguyên văn tài liệu tại thời điểm đó.

Kiểm tự động đã pass: `node --check ca-truc/ban-thu/app.js`, `tests/vy-dossier.test.cjs`, `tests/vy-review.test.cjs`, `tests/vy-support.test.cjs`, `tests/shift.test.cjs`, `tests/demo-account.test.cjs`, `git diff --check`. Bộ hồ sơ kiểm 16 tổ hợp tài liệu chính, khóa nguồn Studio, hủy/gửi/lưu riêng, click/check lặp, phiên bản bất biến, nháp lỗi thời và migration. Hồi quy khác kiểm sửa nhận định, thứ tự lịch sử, quyết định đã xác minh, chuyển thêm tối đa một lần, báo cáo/hỗ trợ và cách ly tài khoản.

## Bố cục, giới hạn và sửa phát sinh

Desktop: cửa sổ 1363×1023, viewport iframe 1363×853. Kiểm zoom 200% (iframe khoảng 681×379) và 400% (340×145), chữ/nút xuống dòng, không tràn ngang theo DOM. Có kiểm Tab tới vùng nháp; chưa kiểm đầy đủ thứ tự Tab hoặc trình đọc màn hình. Zoom làm vùng nhìn thấp nên không tương đương thiết bị cảm ứng 360×800. Chưa kiểm điện thoại thật, Firebase thật, hoặc người chơi mới.

Trong kiểm UI, chọn checkbox/gửi liên tiếp từng có thể bỏ lỡ do thay node hoặc cuộn/focus cập nhật muộn. Đã dùng giá trị checked rõ ràng, giữ node checkbox khi đổi lựa chọn và hoàn tất focus/cuộn ngay khi render. Chuỗi chọn → gửi → bổ sung → gửi chạy lại thành công trên v5. Chưa kiểm hết các màn ca Minh bằng UI; bộ hồi quy chạy qua logic hiện có. Không đổi đăng nhập, Store hoặc dữ liệu ca Minh; game-goc/js game chỉ đổi cache URL.
