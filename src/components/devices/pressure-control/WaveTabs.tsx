import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface WaveTabItem<T extends string = string> {
  id: T;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Màu icon khi tab đang được chọn */
  accentColor?: string;
}

interface WaveTabsProps<T extends string> {
  tabs: WaveTabItem<T>[];
  activeId: T;
  onChange: (id: NoInfer<T>) => void;
}

/**
 * Thanh tab tối giản chuẩn công nghiệp (underline active indicator):
 * - Bung hết toàn bộ chiều rộng (w-full), chia đều tỷ lệ bằng nhau (flex-1) giữa các tab.
 * - Căn giữa nội dung icon và label trong từng tab.
 * - Đường line chỉ báo hoạt động (indicator) ở chân trượt mượt mà bằng framer-motion layoutId.
 */
export function WaveTabs<T extends string>({ tabs, activeId, onChange }: WaveTabsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Tự động căn giữa tab được chọn trong thanh cuộn ngang khi trên màn hình quá hẹp (mobile)
  const scrollToTab = (tabId: T, smooth = true) => {
    const container = containerRef.current;
    const btn = buttonRefs.current[tabId];
    if (!container || !btn) return;

    if (container.scrollWidth > container.clientWidth) {
      const containerWidth = container.clientWidth;
      const btnLeft = btn.offsetLeft;
      const btnWidth = btn.offsetWidth;
      const targetLeft = btnLeft - containerWidth / 2 + btnWidth / 2;

      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToTab(activeId, true);
    }, 60);
    return () => clearTimeout(timer);
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      className="shrink-0 w-full bg-white dark:bg-[#12151E] border-b border-slate-200 dark:border-slate-800 overflow-x-auto overflow-y-hidden select-none scroll-smooth"
      style={{
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
      role="tablist"
    >
      <div className="relative flex items-center w-full min-w-full px-2 sm:px-6">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                buttonRefs.current[tab.id] = el;
              }}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                onChange(tab.id);
                scrollToTab(tab.id, true);
              }}
              className={`group relative shrink-0 md:flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3.5 text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors duration-200 outline-none select-none rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                  isActive
                    ? tab.accentColor ?? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                }`}
              />
              <span className="whitespace-nowrap">{tab.label}</span>

              {/* Đường line ở chân tab trượt mượt mà (Animated Underline Indicator) */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 dark:bg-blue-400 rounded-full z-10"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}




