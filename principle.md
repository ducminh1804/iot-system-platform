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
2. **Độc lập Van 4:** Van số 4 (Đóng/Mở nước) hoạt động độc lập hoàn toàn với các chế độ thời gian thực và ưu tiên áp lực (trừ lệnh đóng đồng thời khi hẹn giờ nước kích hoạt). Chế độ thời gian thực và ưu tiên áp lực thông thường KHÔNG can thiệp vào trạng thái mở cơ bản của Van 4 nếu không có lịch đóng nước.

### Thứ Tự Ưu Tiên Chế Độ (Priority Level):
- **Cấp 1 (Cao nhất):** Hẹn giờ Đóng/Mở nước PRV (Khóa dòng chảy khi có lịch).
- **Cấp 2:** Ưu tiên áp suất đầu vào (Cứu áp khi $P < 1.5\text{ bar}$).
- **Cấp 3:** Hẹn giờ theo thời gian thực (Chạy theo lịch trình 24h tuần hoàn).
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

---

## 4. QUY TRÌNH HẸN GIỜ ĐÓNG / MỞ NƯỚC VAN 4 (ONE-SHOT TIMER)

Chế độ Hẹn giờ đóng/mở nước Van 4 là cơ cấu hẹn giờ 1 lần (One-shot). Sau khi hoàn thành xong 1 chu trình đóng và mở lại, nút gạt `ON` trên App sẽ tự động gạt về `OFF` (xóa lệnh, không lặp lại tuần hoàn trừ khi khách cài đặt lại).

| Giai Đoạn | Thời Điểm Kích Hoạt | Hành Động Van & Relay | Trạng Thái Hệ Thống Sau Kích Hoạt |
| :--- | :--- | :--- | :--- |
| **1. Đến giờ ĐÓNG nước** | Đến mốc giờ đóng (Ví dụ: 15:00) | • Hút Relay 7 (Đóng Van 4) trong 10s <br>• Hút Relay 2 + 4 + 6 (Đóng Van 1,2,3) trong 10s | Nguồn nước cấp bị ngắt hoàn toàn. Hệ thống vào trạng thái ngắt dòng. |
| **2. Trong thời gian ĐÓNG** | Từ giờ đóng đến giờ mở (Ví dụ: 15:00 - 16:00) | • Van 4 tiếp tục đóng. <br>• RTC & P-Priority vẫn tính toán ngầm. | Logic thời gian thực và áp suất vẫn cập nhật ngầm Setpoint nhưng van đầu ra bị khóa. |
| **3. Đến giờ MỞ nước** | Đến mốc giờ mở lại (Ví dụ: 16:00) | • Hút Relay 8 (Mở Van 4) trong 10s <br>• Check RTC/P-Priority để hút Relay mở van tương ứng (Relay 1 hoặc 3 hoặc 5) | Nước được cấp lại. Van áp lực 1/2/3 tự động về đúng trạng thái đang quy định theo lịch. |
| **4. Hoàn tất chu trình** | Ngay sau khi kích hoạt xong lệnh mở | • Nút gạt ON trên App tự động về OFF. <br>• Xóa bộ đếm hẹn giờ Van 4. | Sẵn sàng cho lần đặt lịch thủ công tiếp theo của người dùng. |

---
*Tài liệu ban hành bởi: Ban Kỹ thuật / Nền Tảng Low Power*