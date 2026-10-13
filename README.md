# IoT System Platform (React + Vite + TypeScript)

Dự án Frontend hiện đại, tối ưu cho ứng dụng IoT, giám sát telemetry và điều khiển thiết bị thời gian thực.

## 🚀 Công nghệ & Thư viện đã cài đặt

| Nhóm chức năng | Thư viện | Mô tả |
| :--- | :--- | :--- |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) (Nova preset) | 27+ component (Button, Card, Dialog, Table, Sidebar, Tabs, Sheet, Drawer...) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite` | Hỗ trợ CSS variables, Theme Dark/Light linh hoạt |
| **Icons** | [Lucide React](https://lucide.dev/) | Hệ thống icon hiện đại, nhất quán |
| **Animation** | [Motion](https://motion.dev/) | Hiệu ứng chuyển cảnh và tương tác mượt mà |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Hệ thống Toast notification thông minh |
| **Charts** | [Apache ECharts](https://echarts.apache.org/) + `echarts-for-react` | Biểu đồ telemetry, hiệu năng và trực quan hóa dữ liệu lớn |
| **Data Table** | [TanStack Table v8](https://tanstack.com/table) | Bảng dữ liệu hỗ trợ sorting, filtering, pagination |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Quản lý form hiệu năng cao, validate chặt chẽ |
| **Server State** | [TanStack Query v5](https://tanstack.com/query) | Caching, refetching và đồng bộ API |
| **Client State** | [Zustand](https://zustand.docs.pmnd.rs/) | State management gọn nhẹ, lưu trữ trạng thái theme & thiết bị |
| **Routing** | [React Router v7](https://reactrouter.com/) | Điều hướng trang đơn trang (SPA) |
| **Node Canvas** | [@xyflow/react](https://reactflow.dev/) (React Flow) | Canvas kéo thả sơ đồ mạng lưới node IoT |
| **Realtime** | [Socket.IO Client](https://socket.io/) | Kết nối WebSocket realtime với Gateway / Server |
| **Date / Time** | [date-fns](https://date-fns.org/) | Xử lý format ngày giờ |
| **Resizable Panels** | [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) | Bố cục panel co giãn linh hoạt |
| **Code Formatting** | [Prettier](https://prettier.io/) + Tailwind Plugin | Tự động căn chỉnh và sắp xếp Tailwind class |
| **PWA (Offline & Install)** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + Workbox | Khả năng cài đặt App máy tính/điện thoại, Service Worker cache ngoại tuyến, Auto-update prompt |

---

## 📁 Cấu trúc thư mục (`src/`)

```
src/
├── components/
│   ├── theme-provider.tsx     # Đồng bộ theme Sáng / Tối (Dark mode)
│   └── ui/                    # Toàn bộ 27+ component shadcn/ui
├── hooks/
│   └── use-mobile.ts          # Hook kiểm tra breakpoint thiết bị di động
├── lib/
│   ├── queryClient.ts         # Cấu hình TanStack Query Client
│   ├── socket.ts              # Socket.IO client singleton kết nối realtime
│   └── utils.ts               # Hàm utility cn() kết hợp clsx & tailwind-merge
├── pages/
│   ├── DashboardPage.tsx      # Demo KPI cards, ECharts telemetry realtime, Toast
│   ├── DevicesPage.tsx        # Demo TanStack Table (sort, search, pagination)
│   ├── TopologyPage.tsx       # Demo React Flow Canvas & Resizable Panels
│   └── SettingsPage.tsx       # Demo React Hook Form + Zod validation
├── stores/
│   └── useAppStore.ts         # Zustand store (theme, sidebar, selectedDevice)
├── types/                     # Chứa TypeScript interfaces dùng chung
├── App.tsx                    # Routing, Layout, Toaster, TooltipProvider
├── index.css                  # Cấu hình Tailwind v4 & Design tokens shadcn
├── main.tsx                   # Điểm khởi chạy ứng dụng
└── vite-env.d.ts              # Type declarations cho Vite Env
```

---

## 🛠️ Các lệnh hữu ích

```bash
# Khởi chạy server phát triển (HMR)
npm run dev

# Kiểm tra type và build production
npm run build

# Tự động format toàn bộ code theo chuẩn Prettier & Tailwind
npm run format

# Kiểm tra định dạng code
npm run format:check

# Kiểm tra chất lượng mã nguồn (Linter)
npm run lint

# Xem trước bản build production
npm run preview
```

---

## ⚙️ Biến môi trường (`.env`)

- `VITE_APP_NAME`: Tên ứng dụng hiển thị
- `VITE_API_BASE_URL`: Địa chỉ API Backend
- `VITE_SOCKET_URL`: Địa chỉ máy chủ Socket.IO Realtime
