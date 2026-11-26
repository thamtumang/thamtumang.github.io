# Ca Vy — ba điểm nối nhịp chơi

Ngày kiểm: 26/11/2026, Asia/Ho_Chi_Minh.

Baseline: runtime e651224bf1d99691046b161c86f1760d4c219c18; HEAD trước sửa 7d771230b0a87f6d14fe1b871db47b5af97b92b8. Đã đối chiếu GitHub trước khi sửa, không có thay đổi mới hơn mốc Chat A đưa.

Đường UI: https://thamtumang.github.io/game-goc.html → Chơi thử không cần tài khoản → nhấp đúp Ca trực. Từ js/game.js, cửa sổ nạp ca-truc/ban-thu/ và dùng Store.caTrucStorage('payment-v1'). Không dùng /ca-truc/ làm đường thay thế.

## Thay đổi trong phạm vi

| Điểm | Trước, đã tái hiện trên Pages short-v1 | Sau |
|---|---|---|
| A. Biên lai | Vy nói 500k chưa về, sau đó lại có lời đề nghị xem chung chung | Hai phản hồi biên lai hỏi cụ thể phạm vi công việc; lối Xem bài tuyển gốc hoặc Quay lại hội thoại Studio đã tìm thấy; vẫn có dừng/khuyên tiếp |
| B. Chat chia sẻ | Vị trí 0, chủ yếu đọc lại năm tin Hôm qua | Lần đầu chưa có vị trí/đã xem: tới Hôm nay trước đoạn đổi phần việc. Vẫn giữ tất cả tin phía trên |
| C. Hỗ trợ | Nhắn dừng xong đóng khung, phải mở lại để tới chứng cứ | Giữ khung hỗ trợ, một cặp tin trong chat Vy và một bản trình bày lại xác nhận tại chỗ; còn các lối tới chứng cứ, hướng dẫn, báo cáo |

Không thêm tình tiết hay hệ thống chơi. Chỉ thay app.js, thêm một quy tắc CSS cho xác nhận dừng, đổi mã tải trong index.html/game-goc.html/js/game.js và cập nhật kiểm thử.

## Kiểm tự động

Mười suite đã qua: vy-pace, vy-short, vy-review, vy-hub, vy-support, vy-dossier, vy-ending, vy-scene, shift, demo-account. Đã kiểm node --check cho app.js/js/game.js và whitespace bằng git diff --no-index --check so với baseline tải từ GitHub.

Suite vy-pace kiểm: lối tiếp sau hai diễn giải, không suy ra đã xác minh; Studio đã tìm được/đã trả lời nhưng chưa gửi; quyết định đã chốt/tổng 1,5 triệu; ưu tiên vị trí đọc kể cả 0; mặc định Hôm nay chỉ một lần; trích đoạn được yêu cầu tường minh; nhắn dừng giữ view recover và không tự làm hỗ trợ khác; chống nhân đôi; giữ tin/attachment/nháp/snapshot cũ.

Các kiểm vị trí cuộn tự động dùng fixture hình học, không thay kiểm layout trên trình duyệt thật. Ca Minh hồi quy tự động; không nói đã chơi ca Minh nếu không vào được qua giao diện đang nạp Vy.

## Dữ liệu cũ

Không đổi khóa payment-v1, Store hoặc đăng nhập. Không thêm bộ trạng thái gameplay mới. Dùng seen.recruiter và scrolls.recruiter hiện có để quyết định vị trí mặc định; Object.hasOwn giữ được số 0. Lượt đã xem chat nhưng thiếu vị trí cũng không bị ép nhảy. Vị trí người chơi cuộn tiếp được lưu bằng cơ chế sẵn có. Link chủ động trích đoạn được ưu tiên riêng cho lần mở đó.

Tin cũ, căn cứ đính kèm, timeline, bản gửi, bản lưu và nháp không bị viết lại. Các câu đáp biên lai mới chỉ được tạo khi gửi/sửa ý mới, với ưu tiên giữ quyết định đã dừng/đã xác minh/đã chuyển thêm như trước.

## Quy trình và giới hạn

Máy chủ local của executor không nằm cùng host với trình duyệt cloud ở các vòng trước; không coi kiểm VM là UI local. Kiểm kỹ thuật trước push, kiểm UI qua Pages sau deploy; chỉ xác nhận cập nhật sau khi thấy hành vi mới qua đường vào thật.

Chưa có học sinh THPT thử nghiệm. Ba chỉnh sửa nhằm giảm lặp và đi vòng, không chứng minh tạo thêm chiều sâu, hấp dẫn hoặc hiệu quả học tập.

## UI đã thực sự kiểm trên Pages

Đã thấy iframe `?v=ca-vy-pace-v1` và ba hành vi mới sau workflow Pages thành công. Runtime: 5f6577de17cc2e1c3d8621f2e36f2e5254436e48. Commit tài liệu/ảnh sau đó không đổi runtime.

| Lượt | Thao tác thực tế và kết quả |
|---|---|
| A — Dừng ngay | Khách mới → Đừng chuyển thêm → tổng kết ngay. 500k chưa thu hồi, Studio chưa xác minh; không bị bắt mở bài hoặc hồ sơ |
| B — Biên lai khuyên tin | Giao dịch → biên lai → gửi khuyên tin. Vy hỏi việc ứng tiền có nằm trong việc Studio tuyển không. Cạnh phản hồi có Xem bài tuyển gốc, còn dừng/khuyên tiếp, không còn câu đề nghị xem chung. Mở bài giữ số lượt chat 1→1. Tự đi trang → inbox, hỏi quy trình, chủ động chuyển cho Vy; kết xác minh 500k chưa thu hồi |
| C — Thận trọng và thông tin đã có | Sau khi tìm hộp thư nhưng chưa hỏi: sửa biên lai sang thận trọng, có lời đáp riêng; chỉ một link Quay lại hội thoại Studio, không có link bài trùng tác dụng. Hỏi quy trình rồi đóng chưa chuyển: Vy chưa biết, quay lại vẫn còn câu trả lời/nút gửi, không hỏi trùng. Gửi thật làm Vy dừng; sau đó sửa sang khuyên tin: Vy nhớ Studio và không mở lại quyết định. Một lượt khác gửi biên lai sau khi chuyển thêm: giữ 1,5 triệu |
| D — Chat Giang | Khách mới → chat: scrollTop 486, thấy Hôm nay, thẻ nhiệm vụ, Vy hỏi đổi việc, Giang giải thích phần đơn hàng, Vy hỏi 500k và yêu cầu 1 triệu trong cùng vùng nhìn desktop. Control+Home đọc được nguyên Hôm qua. Đóng/mở nguồn giữ 0; đổi sang 40, đóng/mở giữ 40. Đóng/mở riêng Ca trực giữ 0. Hội thoại chia sẻ không có input/textarea/button gửi |
| E — Hỗ trợ | Chuyển thêm → hỗ trợ → nhắn dừng: pane vẫn 1, số lượt chat 3→4 (một cặp tin), trạng thái thay nút gửi. Chọn chứng cứ ngay từ khung hiện có. Lưu chứng từ còn nút lưu tin; lưu tiếp tin rồi tổng kết ghi đủ hai, không mở hướng dẫn/chuẩn bị/báo cáo giả, 1,5 triệu chưa thu hồi. Kiểm riêng lượt tạm dừng 500k → kết → hỗ trợ → nhắn dừng: pane còn 1, một cặp tin, tiền 500k. Nút nhắn dừng không còn để bấm lại; chống gọi lặp handler kiểm tự động |
| F — Quyết định và dữ liệu | Khuyên tiếp → đổi ý: 500k. Khách sạch khác xác nhận: 1,5 triệu. Các lần reload guest trở về mở đầu sạch. Demo cũ có ba lượt chat, bản gửi/lưu 45k và nháp hai tài liệu vẫn mở được; đặt vị trí đọc 0, reload vào demo vẫn 0 và ba lượt chat. Mở lại nháp vẫn Chưa gửi Vy/Chưa lưu phiên bản này, không ghi đè bản trước |
| G — Giao diện/hồi quy | Desktop và zoom 200%, Enter/Home/Control+Home/ArrowDown/Escape. Khung hẹp sau dừng đọc được xác nhận ngay tại chỗ, nút về chat còn rõ và tới chứng cứ được. Chat lần đầu ở khung hẹp: Hôm nay nằm gần đầu body, vùng đọc còn cuộn (clientHeight 168, scrollHeight 1175), nút về Vy vẫn hiện. Escape đóng khung, số lượt chat vẫn 0. Game gốc mở được hộp thư và hồ sơ Vòng quay iPhone; không bắt đầu chơi/hoàn thành vụ án. Ca Minh chỉ hồi quy tự động |

Phản biện sau xác nhận bài đăng vẫn giữ nguyên trong code và qua suite vy-short, không áp lời đáp biên lai cho nhóm bài đăng. Các liên kết mở trích đoạn tường minh được kiểm bằng fixture: ưu tiên `.request-context` đúng một lần rồi trả về cơ chế giữ vị trí. UI rút gọn hiện không bày link `data-focus-request` của luồng cũ, nên không ghi đã bấm đường đó trên Pages.

## Kích thước và ảnh

- Desktop: viewport 1363×936, iframe 1363×853 CSS px, đo từ DOM.
- Zoom 200%: viewport 681×468, iframe 682×379 CSS px (làm tròn khác nhau ở zoom). Đây là zoom desktop, không phải điện thoại hoặc viewport cảm ứng 360×800.
- Nguồn hỗ trợ ở zoom: clientWidth = scrollWidth = 643. Không thấy tràn ngang trong vùng nguồn đã đo.
- Không dùng DevTools/giả lập điện thoại: môi trường trước đó đã chặn công cụ này. Không thử lách hạn chế.

| Trạng thái | Ảnh |
|---|---|
| Sau biên lai | [receipt.jpg](receipt.jpg) |
| Chat lần đầu | [today.jpg](today.jpg) |
| Hỗ trợ sau dừng, desktop | [support.jpg](support.jpg) |
| Hỗ trợ sau dừng, zoom 200% | [support-narrow.jpg](support-narrow.jpg) |
| Chat lần đầu, zoom 200% | [today-narrow.jpg](today-narrow.jpg) |

## Phần chưa kiểm

Chưa kiểm cảm ứng/thiết bị di động thật, viewport điện thoại chuẩn, trình đọc màn hình, đăng nhập Firebase bằng tài khoản người dùng thật, đồng bộ nhiều máy hoặc mọi biến thể dữ liệu sản xuất. Tài khoản thử nghiệm lưu local đã kiểm UI; tách dữ liệu/tài khoản và logout/tabclose guest kiểm bằng mã/fixture hiện hành, không ghi đã đóng trình duyệt thật. Không thay Store/auth để đạt kết quả.

Không có thay đổi ngoài ba điểm nêu trên, ngoài mã tải để tránh cache và kiểm thử/ảnh/biên bản. Chưa có dữ liệu người chơi mới; đây là cải thiện nhịp thao tác, không phải bằng chứng tăng hấp dẫn hoặc hiệu quả giáo dục.
