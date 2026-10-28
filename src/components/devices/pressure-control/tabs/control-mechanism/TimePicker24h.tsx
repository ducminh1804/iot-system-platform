import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimePicker24hProps {
  hour: number;
  minute: number;
  onChange: (h: number, m: number) => void;
  disabled?: boolean;
}

const pad = (n: number) => n.toString().padStart(2, '0');

/**
 * Bộ chọn giờ 24h popover thông minh:
 * - Chống tràn khung nhìn (tự động lật lên trên / lật sang trái nếu sát mép)
 * - Tự động cuộn danh sách đến vị trí giờ và phút đang chọn
 */
export function TimePicker24h({
  hour,
  minute,
  onChange,
  disabled = false,
}: TimePicker24hProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.left;
      setOpenUpward(spaceBelow < 290 && rect.top > 290);
      setAlignRight(spaceRight < 230);
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      const activeHourEl = hourListRef.current?.querySelector('[data-active="true"]');
      const activeMinEl = minuteListRef.current?.querySelector('[data-active="true"]');
      activeHourEl?.scrollIntoView({ block: 'center' });
      activeMinEl?.scrollIntoView({ block: 'center' });
    }, 20);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141824] hover:bg-slate-50 dark:hover:bg-slate-800/80 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
      >
        <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span>
          {pad(hour)}:{pad(minute)}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute z-40 bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3.5 flex flex-col gap-3 min-w-[210px] animate-in fade-in zoom-in-95 duration-100 ${
              openUpward ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'
            } ${alignRight ? 'right-0' : 'left-0'}`}
          >
            <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Chọn Giờ (24H)
              </span>
              <div className="text-base font-mono font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {pad(hour)} : {pad(minute)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400">GIỜ</span>
                <div
                  ref={hourListRef}
                  className="h-40 w-full overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 p-1 space-y-1"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      data-active={hour === i}
                      onClick={() => onChange(i, minute)}
                      className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        hour === i
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pad(i)}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400">PHÚT</span>
                <div
                  ref={minuteListRef}
                  className="h-40 w-full overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 p-1 space-y-1"
                >
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                    <button
                      key={m}
                      type="button"
                      data-active={minute === m}
                      onClick={() => onChange(hour, m)}
                      className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        minute === m
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pad(m)}p
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Xong
            </button>
          </div>
        </>
      )}
    </div>
  );
}

