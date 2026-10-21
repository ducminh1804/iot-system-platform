import React, { useLayoutEffect, useRef } from 'react';

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
  onChange: (id: T) => void;
}

/** Độ rộng của mỗi vai cong (S-curve) hai bên tab đang chọn */
const SHOULDER = 30;
const BAR_HEIGHT = 56;

/**
 * Thanh tab lượn sóng: một khối trắng duy nhất trượt (transform + width)
 * tới tab đang chọn. Hai vai cong có kích thước cố định nên không bị méo,
 * phần giữa co giãn theo độ rộng tab.
 */
export function WaveTabs<T extends string>({ tabs, activeId, onChange }: WaveTabsProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useLayoutEffect(() => {
    const place = () => {
      const btn = buttonRefs.current[activeId];
      const indicator = indicatorRef.current;
      if (!btn || !indicator) return;
      indicator.style.width = `${btn.offsetWidth + SHOULDER * 2}px`;
      indicator.style.transform = `translate3d(${btn.offsetLeft - SHOULDER}px, 0, 0)`;
    };

    place();

    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(place);
    observer.observe(track);
    Object.values(buttonRefs.current).forEach((b) => b && observer.observe(b));
    return () => observer.disconnect();
  }, [activeId, tabs]);

  return (
    <div
      className="shrink-0 bg-blue-600 dark:bg-blue-700 overflow-x-auto overflow-y-hidden select-none"
      style={{ height: BAR_HEIGHT, scrollbarWidth: 'none' }}
      role="tablist"
    >
      <div
        ref={trackRef}
        className="relative h-full flex items-end gap-2 sm:gap-4 px-10 sm:px-12 w-max min-w-full"
      >
        {/* Khối sóng trắng trượt */}
        <div
          ref={indicatorRef}
          aria-hidden
          className="absolute left-0 bottom-0 flex items-stretch text-white dark:text-[#12151E] pointer-events-none will-change-transform transition-[transform,width] duration-300 ease-[cubic-bezier(0.3,0.9,0.3,1)]"
          style={{ height: BAR_HEIGHT - 8, width: 0 }}
        >
          <svg
            className="shrink-0 h-full"
            width={SHOULDER}
            viewBox={`0 0 ${SHOULDER} 100`}
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d={`M0,100 C${SHOULDER * 0.55},100 ${SHOULDER * 0.45},0 ${SHOULDER},0 L${SHOULDER},100 Z`} />
          </svg>
          <div className="flex-1 min-w-0 bg-current" />
          <svg
            className="shrink-0 h-full"
            width={SHOULDER}
            viewBox={`0 0 ${SHOULDER} 100`}
            preserveAspectRatio="none"
            fill="currentColor"
          >
            <path d={`M${SHOULDER},100 C${SHOULDER * 0.45},100 ${SHOULDER * 0.55},0 0,0 L0,100 Z`} />
          </svg>
        </div>

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
              onClick={() => onChange(tab.id)}
              style={{ height: BAR_HEIGHT - 8 }}
              className={`relative z-10 shrink-0 flex items-center gap-2 px-3 sm:px-4 text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                isActive
                  ? 'text-slate-900 dark:text-white font-extrabold'
                  : 'text-white/85 hover:text-white font-semibold'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                  isActive ? tab.accentColor ?? '' : ''
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
