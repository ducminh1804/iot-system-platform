import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TimePicker24hProps {
  hour: number;
  minute: number;
  onChange: (h: number, m: number) => void;
  disabled?: boolean;
}

const pad = (n: number) => n.toString().padStart(2, '0');
const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => i);

/**
 * Bộ chọn giờ 24h & phút (00 -> 59) popover thông minh:
 * - Sử dụng Radix Popover Portal (z-70) để không bao giờ bị cắt bởi khung cuộn overflow-y-auto của Modal
 * - Cho phép chọn hoặc nhập trực tiếp từng phút từ 00 đến 59
 */
export function TimePicker24h({
  hour,
  minute,
  onChange,
  disabled = false,
}: TimePicker24hProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      const activeHourEl = hourListRef.current?.querySelector('[data-active="true"]');
      const activeMinEl = minuteListRef.current?.querySelector('[data-active="true"]');
      activeHourEl?.scrollIntoView({ block: 'center' });
      activeMinEl?.scrollIntoView({ block: 'center' });
    }, 30);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141824] hover:bg-slate-50 dark:hover:bg-slate-800/80 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
        >
          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>
            {pad(hour)}:{pad(minute)}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        avoidCollisions={false}
        className="z-70 w-[235px] bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 flex flex-col gap-2.5 ring-0"
      >
        {/* Header hiển thị & nhập nhanh Giờ : Phút (00-59) */}
        <div className="flex items-center justify-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 mb-0.5">GIỜ</span>
            <input
              type="number"
              min={0}
              max={23}
              value={pad(hour)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!Number.isNaN(val)) {
                  onChange(Math.min(23, Math.max(0, val)), minute);
                }
              }}
              className="w-12 h-8 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0E14] font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <span className="text-base font-mono font-black text-slate-400 mt-4">:</span>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 mb-0.5">PHÚT</span>
            <input
              type="number"
              min={0}
              max={59}
              value={pad(minute)}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!Number.isNaN(val)) {
                  onChange(hour, Math.min(59, Math.max(0, val)));
                }
              }}
              className="w-12 h-8 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0E14] font-mono text-sm font-extrabold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        {/* 2 cột cuộn: Giờ (00-23) & Phút (00-59) */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            ref={hourListRef}
            className="h-44 w-full overflow-y-auto rounded-xl border border-slate-200/80 dark:border-slate-800 p-1 space-y-0.5 bg-slate-50/60 dark:bg-[#0B0E14]/60"
          >
            {HOURS_24.map((i) => (
              <button
                key={i}
                type="button"
                data-active={hour === i}
                onClick={() => onChange(i, minute)}
                className={`w-full py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  hour === i
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {pad(i)}h
              </button>
            ))}
          </div>

          <div
            ref={minuteListRef}
            className="h-44 w-full overflow-y-auto rounded-xl border border-slate-200/80 dark:border-slate-800 p-1 space-y-0.5 bg-slate-50/60 dark:bg-[#0B0E14]/60"
          >
            {MINUTES_60.map((m) => (
              <button
                key={m}
                type="button"
                data-active={minute === m}
                onClick={() => onChange(hour, m)}
                className={`w-full py-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                  minute === m
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {pad(m)} phút
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-95"
        >
          Xong
        </button>
      </PopoverContent>
    </Popover>
  );
}
