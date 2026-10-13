import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';

export function PWAReloadPrompt() {
  const {
    offlineReady: [offlineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        console.log('Service Worker đã kích hoạt thành công');
      }
    },
    onRegisterError(error) {
      console.error('Lỗi đăng ký Service Worker:', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast.success('PWA đã sẵn sàng hoạt động Ngoại tuyến (Offline)!');
    }
  }, [offlineReady]);

  useEffect(() => {
    if (needRefresh) {
      toast.info('Đã có bản cập nhật mới cho hệ thống!', {
        description: 'Bấm Cập nhật để áp dụng phiên bản mới nhất.',
        action: {
          label: 'Cập nhật',
          onClick: () => updateServiceWorker(true),
        },
        duration: 10000,
      });
    }
  }, [needRefresh, updateServiceWorker]);

  return null;
}
