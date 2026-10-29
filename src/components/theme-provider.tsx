import * as React from 'react';
import { useAppStore } from '@/stores/useAppStore';

/**
 * Tạm thời vô hiệu hóa tất cả CSS transitions trong 1-2 frame
 * khi đổi theme sáng/tối. Kỹ thuật chuẩn (Next-themes/shadcn) này giúp
 * triệt tiêu hoàn toàn hiện tượng 100+ phần tử (backdrop-blur, SVG gauge, card)
 * đồng loạt tính toán transition gây tụt khung hình (giật lag/stutter).
 */
function disableTransitionsTemporarily() {
  const css = document.createElement('style');
  css.setAttribute('id', 'disable-theme-transitions');
  css.textContent = `
    *, *::before, *::after {
      -webkit-transition: none !important;
      -moz-transition: none !important;
      -o-transition: none !important;
      -ms-transition: none !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(css);

  return () => {
    // Ép reflow đồng bộ
    (() => window.getComputedStyle(document.body))();

    // Chờ 2 frame để DOM vẽ xong theme mới rồi gỡ bỏ
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        css.remove();
      });
    });
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Chỉ subscribe chính xác vào state.theme để không re-render khi breadcrumbs đổi
  const theme = useAppStore((state) => state.theme);

  React.useLayoutEffect(() => {
    const restore = disableTransitionsTemporarily();
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    restore();
  }, [theme]);

  return <>{children}</>;
}
