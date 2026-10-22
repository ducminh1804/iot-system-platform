# Workspace Rules - IoT System Platform

## UI/UX Design Rules (Quy chuẩn Thiết kế Giao diện)

Tuân thủ nghiêm ngặt quy chuẩn thiết kế tại [.agents/rules/ui-ux-design.md](file:///.agents/rules/ui-ux-design.md):

1. **CẤM thêm nhãn con (sub-labels), badge phụ hoặc tag màu mè**:
   - Tuyệt đối không gắn các badge, pill, text màu mè chỉ để trang trí hoặc giải thích phụ dưới các tiêu đề, thẻ card hoặc nhãn trường nhập liệu.
   - Không đặt nhiều loại nhãn phụ nhỏ lẻ, lòe loẹt làm giao diện trở nên chật chội, rối mắt.
2. **CẤM thêm các dòng text giải thích/chú thích thừa thãi**:
   - Cấm chèn các câu/đoạn mô tả rườm rà dưới mỗi input, card hoặc modal header khi ý nghĩa đã rõ ràng.
   - Không giải thích những điều hiển nhiên làm mất không gian hiển thị thông số kỹ thuật.
3. **Màu sắc chuẩn công nghiệp**:
   - Chỉ dùng màu nhấn (semantic color) cho trạng thái kỹ thuật (xanh lá = online/tốt, đỏ = báo động/lỗi, vàng/cam = cảnh báo, xanh dương = tương tác/chọn).
   - Toàn bộ nhãn, khung viền, nền sử dụng màu trung tính (`slate`/`zinc`).
4. **Giữ không gian thoáng đãng (Clean & Breathing Room)**:
   - Nhãn ngắn gọn từ 1 - 3 từ.
   - Nếu cần giải thích thông số phức tạp, dùng icon trợ giúp `(?)` dạng tooltip ẩn, không in trực tiếp dòng chữ dài vào giao diện.
