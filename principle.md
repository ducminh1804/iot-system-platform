# TÀI LIỆU KỸ THUẬT & QUY TRÌNH LẬP TRÌNH: HỆ THỐNG ĐIỀU KHIỂN ĐẦU TỦ ÁP LỰC VAN PRV
**Quy chuẩn logic điều khiển van bi điện 3 dây & 8 Relay giao tiếp Firmware/App**

---

## 1. TỔNG QUAN HỆ THỐNG & NGUYÊN TẮC BẢN ĐỒ RELAY (RELAY MAPPING)

- **Phần cứng van:** Hệ thống sử dụng 4 van bi điện 3 dây (1 dây GND chung, 2 dây dương cấp nguồn đóng/mở).
- **Phần cứng điều khiển:** 8 Relay độc lập.
- **Quy tắc xung kích hoạt:** Mỗi lệnh điều khiển van (đóng hoặc mở) đều **duy trì xung cấp nguồn trong đúng 10 giây**.

| Cổng Van / Trạng Thái | Chức Năng Điều Khiển | Relay Tương Ứng | Quy Trình Xung Kích Hoạt (10 Giây) |
| :--- | :--- | :--- | :--- |
| **Van 1** (Áp lực) | Mức áp 1 | Relay 1 (Mở) <br> Relay 2 (Đóng) | • Mở: Hút Relay 1 trong 10s <br>• Đóng: Hút Relay 2 trong 10s |
| **Van 2** (Áp lực) | Mức áp 2 | Relay 3 (Mở) <br> Relay 4 (Đóng) | • Mở: Hút Relay 3 trong 10s <br>• Đóng: Hút Relay 4 trong 10s |
| **Van 3** (Áp lực) | Mở full | Relay 5 (Mở) <br> Relay 6 (Đóng) | • Mở: Hút Relay 5 trong 10s <br>• Đóng: Hút Relay 6 trong 10s |
| **Van 4** (Nguồn nước) | Đóng / Mở nước PRV | Relay 7 (Đóng) <br> Relay 8 (Mở) | • Đóng nước: Hút Relay 7 trong 10s <br>• Mở nước: Hút Relay 8 trong 10s <br>*(Van 4 mặc định Thường Mở)* |

---

## 2. QUY TẮC ĐỘC QUYỀN TRẠNG THÁI & THỨ TỰ ƯU TIÊN (PRIORITY LEVELS)

### Các Quy Tắc Cốt Lõi:
1. **Nguyên tắc Độc quyền Áp lực:** Tại một thời điểm chỉ duy nhất **1 trạng thái áp lực** được phép `ON` (Mức áp 1, Mức áp 2, hoặc Mở full). Khi chuyển trạng thái, hệ thống phải tự động đóng các van áp lực còn lại.
2. **Độc lập Van 4:** Van số 4 (Đóng/Mở nước PRV) hoạt động độc lập hoàn toàn với các chế độ thời gian thực và ưu tiên áp lực (trừ lệnh đóng đồng thời khi hẹn giờ nước kích hoạt). Chế độ thời gian thực và ưu tiên áp lực thông thường KHÔNG can thiệp vào trạng thái mở cơ bản của Van 4 nếu không có lịch đóng nước.

### Thứ Tự Ưu Tiên Chế Độ (Priority Level):
- **Cấp 1 (Cao nhất):** Hẹn giờ điều khiển van PRV / Đóng mở nước Van 4 (One-shot Timer - Khóa dòng chảy khi đến mốc lịch hẹn).
- **Cấp 2:** Ưu tiên áp suất đầu vào (Cứu áp khi $P < 1.5\text{ bar}$).
- **Cấp 3:** Hẹn giờ theo thời gian thực RTC (Chạy theo lịch trình 24h tuần hoàn 5 mốc).
- **Cấp 4 (Thấp nhất - Bị vô hiệu hóa khi bật Hẹn giờ / Ưu tiên):** Điều khiển Thủ công (Manual).

---

## 3. MA TRẬN LOGIC ĐIỀU KHIỂN THEO CHẾ ĐỘ

| Chế Độ Điều Khiển | Điều Kiện / Sự Kiện Kích Hoạt | Tác Động Van Tương Ứng | Chi Tiết Relay Hút Trong 10 Giây |
| :--- | :--- | :--- | :--- |
| **Thủ Công (Manual) - [Mức áp 1]** | Người dùng bấm icon 'Mức áp 1' trên App | Mở Van 1 <br> Đóng Van 2, Van 3 | • Hút Relay 1 (Mở Van 1) <br>• Hút Relay 4 (Đóng Van 2) <br>• Hút Relay 6 (Đóng Van 3) |
| **Thủ Công (Manual) - [Mức áp 2]** | Người dùng bấm icon 'Mức áp 2' trên App | Mở Van 2 <br> Đóng Van 1, Van 3 | • Hút Relay 3 (Mở Van 2) <br>• Hút Relay 2 (Đóng Van 1) <br>• Hút Relay 6 (Đóng Van 3) |
| **Thủ Công (Manual) - [Mở Full]** | Người dùng bấm icon 'Mở full' trên App | Mở Van 3 <br> Đóng Van 1, Van 2 | • Hút Relay 5 (Mở Van 3) <br>• Hút Relay 2 (Đóng Van 1) <br>• Hút Relay 4 (Đóng Van 2) |
| **Thời Gian Thực (RTC)** *(5 mốc 24h tuần hoàn)* | Đến mốc thời gian đã set (Mức 1, Mức 2 hoặc Mở full) | Kích hoạt van tương ứng mốc set | • Mức 1: Hút Relay 1 + 4 + 6 (10s) <br>• Mức 2: Hút Relay 3 + 2 + 6 (10s) <br>• Mở full: Hút Relay 5 + 2 + 4 (10s) |
| **Ưu Tiên Áp Suất - [Ngưỡng Dưới]** | Áp lực đầu vào $P < 1.5\text{ bar}$ liên tục 3 chu kỳ lấy mẫu ($= 5$ phút) | Tạm khóa RTC schedule. Ép Mở Full (Van 3) | • Hút Relay 5 (Mở Van 3) <br>• Hút Relay 2 (Đóng Van 1) <br>• Hút Relay 4 (Đóng Van 2) <br>*(Van 4 giữ nguyên)* |
| **Ưu Tiên Áp Suất - [Ngưỡng Trên]** | Áp lực đầu vào $P \ge 1.8\text{ bar}$ liên tục 3 lần đo liên tiếp | Hủy ưu tiên áp lực. Trả về RTC Schedule hiện tại | Quét lại Setpoint RTC hiện tại và kích hoạt Relay tương ứng (VD: Hút Relay 3 + 2 + 6 nếu đang ở mốc áp 2) |
| **Cơ Chế Số 4: Hẹn Giờ Van PRV (One-Shot)** | Cần gạt `ON` & Đồng hồ RTC trạm chạm đúng mốc giờ hẹn | Khóa nguồn PRV (Van 4) & đóng toàn bộ van áp | • Giờ Đóng: Hút Relay 7 (10s) + Hút Relay 2,4,6 (10s) <br>• Giờ Mở lại: Hút Relay 8 (10s) + khôi phục van áp theo Setpoint |

---

## 4. CƠ CHẾ ĐIỀU KHIỂN SỐ 4: HẸN GIỜ ĐIỀU KHIỂN VAN PRV (ONE-SHOT TIMER)

Chế độ Hẹn giờ điều khiển van PRV (Van 4) là cơ chế can thiệp tạm thời 1 lần (One-shot):
- **1 Input thời gian duy nhất (`HH:mm`):** Nhập trực tiếp Giờ : Phút trong ngày. Khi click vào ô nhập, hệ thống tự động bôi đen toàn bộ số để người dùng nhập đè nhanh từ bàn phím, đồng thời xổ danh sách chọn ở dưới.
- **Cần gạt kích hoạt (Toggle Switch):** Bật/tắt kích hoạt khung giờ hẹn. Ngay cả khi đã kích hoạt, người dùng vẫn được phép chỉnh sửa thời gian và bấm lưu để cập nhật xuống trạm.
- **Cảnh báo thông minh:** Chỉ hiển thị cảnh báo `Đã qua giờ hiện tại` khi mốc giờ hẹn nhỏ hơn hoặc bằng giờ hiện tại của thiết bị (lệnh sẽ kích hoạt vào ngày mai).
- **Sau khi hoàn thành:** Cần gạt tự động gạt về `OFF` (One-shot reset).

---

## 5. CẤU HÌNH ĐỒNG HỒ XUNG (PULSE METER CONFIGURATION)

Quy chuẩn các thông số cài đặt cho đồng hồ đo đếm xung nước:

| Tên Hiển Thị (UI Label) | Ý Nghĩa Kỹ Thuật | Đơn Vị | Đặc Tính Vận Hành |
| :--- | :--- | :--- | :--- |
| **Pulses per unit volume** | Hệ số xung đồng hồ | `p/m³` | Tỷ lệ số xung cơ học trên mỗi $m^3$ nước (mặc định 10 p/m³) |
| **Net Flow Total** | Tổng thể tích thực lũy kế | `m³` | Thể tích dòng thực tế qua trạm (Forward Total – Reverse Total) |
| **Forward Total** | Nhập tổng dòng chảy thuận | `m³` | Người dùng nhập chỉ số khối nước chiều thuận ban đầu của đồng hồ cơ |
| **Reverse Total** | Nhập tổng dòng chảy nghịch | `m³` | Người dùng nhập chỉ số khối nước chiều nghịch ban đầu của đồng hồ cơ |
| **Forward Pulses** | Xung dòng thuận đếm từ cảm biến | `pulses` | Số xung chiều thuận mà bộ logger đếm được thực tế |
| **Reverse Pulses** | Xung dòng nghịch đếm từ cảm biến | `pulses` | Số xung chiều nghịch mà bộ logger đếm được thực tế |

> [!NOTE]
> **Loại bỏ lưu lượng tức thời (Bỏ Flow Rate):** Tab cấu hình Đồng hồ xung chỉ duy trì các thông số đo đếm xung và thể tích tích lũy, **không đưa chỉ số lưu lượng tức thời (`Flow Rate - m³/h`) vào danh mục cài đặt này** để giữ giao diện chuẩn xác và tập trung.

---
*Tài liệu ban hành bởi: Ban Kỹ thuật / Nền Tảng Low Power*
