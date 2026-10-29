import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

export function PWAReloadPrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (!registration) return;

      // 1. Kiểm tra bản build mới ngay khi tải trang
      registration.update().catch(() => {});

      // 2. Định kỳ kiểm tra cập nhật mỗi 60 giây
      setInterval(() => {
        registration.update().catch(() => {});
      }, 60 * 1000);

      // 3. Tự động kiểm tra khi người dùng mở lại tab / mở khóa màn hình điện thoại
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update().catch(() => {});
        }
      });
    },
    onRegisterError(error) {
      console.error('Lỗi Service Worker:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      toast.info('Đã có bản cập nhật mới', {
        action: {
          label: 'Tải lại',
          onClick: () => updateServiceWorker(true),
        },
        duration: 15000,
      });
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
