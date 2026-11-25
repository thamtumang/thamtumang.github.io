# Ca Vy — chat làm nền, một khung nguồn

Ngày kiểm: 26/11/2026 (Asia/Ho_Chi_Minh).

Đường đã dùng: https://thamtumang.github.io/game-goc.html → Chơi thử không cần tài khoản → nhấp đúp Ca trực. Đúng iframe `ca-truc/ban-thu/`, không dùng `/ca-truc/` làm đường thay thế.

## Phạm vi

Giữ đối chiếu bài tuyển với phần việc ứng tiền. Không triển khai đề xuất giấy “Cam kết 1 triệu”. Không thay game gốc, ca Minh, Store hoặc đăng nhập. Hai thay đổi tích hợp ở game-goc.html và js/game.js chỉ đổi mã phiên bản tải script/iframe.

Các bản runtime: d6b83bf (hub-v1), 1268b9d (hub-v2), a4e4b32 (hub-v3). Commit tài liệu sau đó không thay runtime.

## Luồng cũ → mới

| Việc | Trước | Sau |
|---|---|---|
| Mở ca | Bốn thẻ và ba hướng nhắn, thêm lời khuyên rủi ro | Hai lối: Xem nội dung Vy gửi / Nhắn lại Vy |
| Xem yêu cầu tiền | Có lựa chọn xin xem → Vy đáp → mở chat | Bấm thẻ mở ngay chat chia sẻ, chỉ đọc |
| Tìm Studio | Có lựa chọn hứa hỏi → Vy đáp → bài → trang → inbox | Tự chọn bài → trang → inbox trong cùng một khung, giữ Vy bên cạnh trên desktop |
| Chuyển căn cứ lần đầu | Chọn nhận định → nháp → gửi | Căn cứ và hai lời nhắn có nhãn Gửi Vy nằm cạnh nguồn; bấm là gửi |
| Sửa ý | Có nháp trước gửi | Giữ xem lại, nháp sửa, đổi/hủy; tin cũ không thay |
| Đối chiếu | Bộ chọn 0/2 hiện thường trực | Bắt đầu bằng Chọn để đối chiếu trên nguồn; bộ chọn chỉ hiện khi có lựa chọn |
| Gửi hướng dẫn | Soạn → nháp → gửi | Đọc rõ lời gửi và nguồn, bấm Gửi Vy hướng dẫn này |
| Trở về | Qua các màn | Nguồn trước trong khung, hoặc một nút đóng khung về Vy; Escape cũng đóng |
| Hồ sơ/phiên bản | Nằm giữa các thao tác hỗ trợ | Mục tùy chọn; không cần gửi/lưu hồ sơ để kết ca |
| Chuyển thêm tiền | Khuyên → Vy hỏi lại → đổi ý hoặc xác nhận | Giữ nguyên ba bước, tối đa một lần thêm 1 triệu |

Chỉ mở nguồn không tạo tin mới của người chơi/Vy. Các lời hứa, tin hồi tưởng và lời mở hỗ trợ đã có trong lượt cũ được giữ; không tự tạo lại ở lượt mới. Nút chọn, mở, gửi, lưu chứng cứ, lưu bản chuẩn bị và báo cáo vẫn có trạng thái riêng.

## Kiểm trực tiếp trên Pages

Các lượt đầu A–G chạy trên hub-v1 để phát hiện lỗi trình bày; sau đó kiểm hồi quy hub-v2/v3. Không coi kiểm tự động là lượt chơi giao diện.

| Nhóm | Thực sự thao tác và quan sát | Kết quả |
|---|---|---|
| A | Khách sạch → mở nhóm nguồn → bài → đóng khung → nhắn khoan chuyển | Chat vẫn là nền; đóng một lần; focus về thẻ mở nguồn; 500k giữ nguyên |
| B | Bài → trang → inbox Studio → hỏi bài → gửi nhận định yếu → quay lại → hỏi quy trình → gửi Vy → tổng kết | Hai câu hỏi khác phạm vi; bài thật không tự xác minh lời mời; quy trình được chuyển mới làm Vy dừng. Kết 500k chưa thu hồi, không bắt hồ sơ |
| C | Gửi biên lai 45k theo hướng tin; gửi xác nhận bài theo hướng tin | Vy hỏi lại giới hạn tương ứng. Không tự chuyển tiền hoặc ghi xác minh độc lập đầy đủ |
| Sửa nhận định | Mở xem lại biên lai → chọn ý khác → đóng Ca trực khi có nháp → mở lại → hủy → soạn và gửi thật | Nháp còn khi mở lại; hủy không thêm tin sửa; gửi thật có “Tớ xem lại rồi…”, giữ tin cũ và thu gọn bộ soạn |
| D | Khách sạch, không mở nguồn → dừng → tổng kết | Kết hợp lệ, 500k chưa thu hồi; quy trình chưa kiểm tra qua Studio; không ép hỗ trợ |
| E | Khuyên chuyển → đổi ý → đọc biên lai → khuyên và xác nhận | Đổi ý vẫn 500k; xác nhận mới 1,5 triệu. Sau đó nút khuyên/xác nhận không còn. Tổng kết trước hỗ trợ ghi chưa dừng, chưa thu hồi |
| F | Đối chiếu bài/thẻ nhiệm vụ → hỏi quy trình chưa chuyển Vy → đọc giao dịch → dừng → chuyển phản hồi | Chỉ đọc/hỏi chưa thành Vy nhận căn cứ. Khi gửi sau khi đã dừng, Vy nói vẫn không chuyển thêm và có thêm căn cứ; không kể dừng lần đầu |
| G | Mở hỗ trợ → nhắn dừng → lưu chứng từ → tổng kết; mở nguồn ngân hàng → gửi hướng dẫn; soạn báo cáo rồi hủy; lưu tin nhắn; chọn hồ sơ → lưu rồi gửi; báo cáo thật trong mô phỏng → tổng kết | Từng trạng thái riêng. Một chứng cứ còn thiếu tin; đủ hai được ghi đủ. Hướng dẫn gửi chưa thành đã liên hệ. Lưu trước không tạo lời đáp; gửi sau mới có phản hồi. Hồ sơ chưa trình báo; báo cáo chưa có kết quả; 1,5 triệu vẫn chưa thu hồi |
| H | Mở tài khoản thử nghiệm có payment-v1 cũ, giữ ba tin cũ; gửi/lưu bản 45k, bổ sung nháp có chứng từ; tải lại vào tài khoản thử nghiệm | Tin cũ còn; bản lưu trước không đổi; nháp mới chưa gửi/chưa lưu vẫn tiếp tục được. Tương thích nhiều cấu trúc cũ được kiểm thêm bằng fixture tự động |
| I | Đóng riêng Ca trực khi có nháp rồi mở lại; về desktop từ tổng kết rồi mở lại; tải lại guest và vào lại | Giữ nháp/tiền/hành động khi chỉ đóng cửa sổ. Reload guest bắt đầu sạch. Account thử nghiệm giữ dữ liệu qua reload |
| Điều hướng nguồn | Studio → chat Vy chia sẻ → Nguồn trước; mở từ Vy sau đó | Một khung; trở về đúng Studio với phản hồi và nhãn đã chuyển còn nguyên; không tự hỏi hoặc chuyển thêm tin |

## Kích thước, bàn phím và ảnh

- Desktop: iframe thực đo 1363×853 CSS px. [Ảnh](desktop.jpg).
- Zoom trình duyệt 200%: iframe 682×379. Nguồn phủ vùng chat, nút về Vy rõ; nguồn đo clientWidth = scrollWidth = 643. [Ảnh](narrow-zoom200.jpg).
- Zoom 400%: iframe 341×145. Nguồn đo clientWidth = scrollWidth = 313. Đây chỉ là kiểm bề ngang chữ/nút, không phải viewport điện thoại. Chiều cao rất ngắn khiến cần cuộn ngoài khung để tới phần nội dung. [Ảnh](narrow-zoom400.jpg).
- Đã dùng Escape đóng nguồn; nút và details dùng HTML native. Kiểm focus trở lại thẻ mở nguồn và focus ở bản nháp sửa ý. Chưa kiểm trọn thứ tự Tab bằng trình đọc màn hình.
- DevTools bị chính sách môi trường chặn; không có lượt viewport 360×800/390×844 hoặc điện thoại cảm ứng thật. Không gọi zoom là kiểm điện thoại.

## Kiểm tự động

Đã chạy `node --check` cho app.js và js/game.js, `git diff --check`, cùng tám suite:

- vy-hub: một khung, ngữ cảnh Vy, mở không tạo tin, gửi trực tiếp không lặp, sửa ý, câu hỏi độc lập, quyết định đã chốt, xác nhận tiền, mặc định payment-v1, nháp nhóm khác không mất.
- vy-review: gửi/hủy/sửa ba nhóm, thứ tự thật, dữ liệu cũ, không tự tạo tin khi mở nguồn, không đảo quyết định.
- vy-scene: các handler/lịch sử cũ vẫn đọc được, không sinh giao dịch ngoài xác nhận. Hai lời hứa cũ không còn nút trong UI mới.
- vy-ending: ba nhóm kết, phản ánh tiền/hỗ trợ, đóng về desktop không reset.
- vy-dossier: snapshot bất biến, gửi/lưu/hủy riêng, tổng cũ/tổng mới và chống lưu trùng.
- vy-support: hỏi/đọc/gửi/lưu/báo cáo/hồ sơ riêng, báo cáo nháp/hủy/tổng thay đổi.
- shift: hồi quy game/ca Minh.
- demo-account: guest restart, tách tài khoản, demo và giữ khóa phiên bản.

Các suite dùng VM/fixture, không thay thế kiểm CSS/layout, cảm ứng hay Firebase thực.

## Tương thích và giới hạn

Giữ khóa payment-v1 và toàn bộ message/attachment, timeline, bản gửi, bản lưu, nháp. Trường bổ sung chỉ phục vụ giao diện: đường nguồn trước, nguồn gần nhất, vị trí cuộn chat và nơi trả focus. Không chuyển việc mở/đóng khung thành hành vi học tập. Opening cũ được giữ theo version; lượt mới dùng openingVersion 3.

Chưa kiểm đăng nhập Firebase bằng tài khoản cá nhân thật, đồng bộ nhiều máy, đóng tab/trình duyệt trên thiết bị thật hoặc mọi biến thể dữ liệu sản xuất. Guest reload đã kiểm giao diện; logout/tabclose cùng cơ chế memory hiện hành, được kiểm theo mã/fixture. Không thay Store hay auth để đạt kết quả kiểm.

Máy chủ local chạy được trong executor nhưng trình duyệt cloud không nối được localhost. Vì vậy kiểm tự động thực hiện trước push, còn các lượt giao diện thực hiện trên Pages sau push; các lỗi nhìn thấy được sửa bằng commit tiếp theo. Không tuyên bố đã kiểm UI local.

Đây là bản thử giảm thao tác quản lý giao diện. Chưa có dữ liệu người chơi mới để kết luận hấp dẫn hoặc hiệu quả giáo dục hơn.

## Đối chiếu cuối trên hub-v3

Đã quan sát iframe `?v=ca-vy-hub-v3` qua game-goc.html sau workflow Pages thành công, không chỉ suy từ trạng thái Git:

- Khách sạch: mở bài trong khung cạnh chat; phần đối chiếu 0/2 không còn chiếm màn.
- Hỏi bài, gửi nhận định yếu: Vy phân biệt bài đăng với người nhắn. Focus sau gửi nằm ở `.message-turn`; sau hỏi nguồn nằm ở đúng phản hồi Studio.
- Hỏi quy trình, gửi, xem kết: 500k chưa thu hồi, danh tính chưa xác minh; không cần hồ sơ.
- Gửi 45k khuyên tin sau xác minh: Vy giữ quyết định dừng, không có nút khuyên chuyển lại.
- Enter mở bài, Escape đóng: số lượt chat trước/sau đều 3; focus trở lại thẻ `#post`.
- Khách sạch dừng ngay: kết 500k, chưa kiểm tra Studio.
- Khách sạch khuyên chuyển, đổi ý: 500k; khuyên và xác nhận sau đó: 1,5 triệu, nút xác nhận và nút kết thúc tạm dừng cũ đều không còn.
- Dừng sau chuyển, lưu một chứng từ: tổng kết ghi còn thiếu tin nhắn; tiền vẫn 1,5 triệu chưa thu hồi.
- Tải lại tài khoản thử nghiệm: ba tin cũ cùng tin gửi bản 45k còn nguyên; bản lưu 1 và nháp mới có hai tài liệu vẫn tách riêng, chưa gửi/chưa lưu nháp mới.
- Đã chụp lại desktop và zoom 200% trên hub-v3. Ảnh zoom 400% là kiểm bổ sung hub-v2 (CSS responsive giống bản cuối); không coi đây là kiểm điện thoại đầy đủ.

Các hành vi hỗ trợ đủ hai chứng cứ, hướng dẫn, báo cáo hủy/xác nhận và lưu/gửi hồ sơ đã thao tác trên hub-v1, không lặp toàn bộ từng tổ hợp đó trên hub-v3. Handler tương ứng không thay sau hub-v1; có kiểm tự động và hồi quy hỗ trợ một chứng cứ trên bản cuối. Chưa có thử nghiệm học sinh.
