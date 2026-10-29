import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Clock } from 'lucide-react';
import { ScheduleSlot } from '../../types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface TimeWindowPopoverPickerProps {
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  schedules?: ScheduleSlot[];
  disabled?: boolean;
  onChange: (startHour: number, startMinute: number, endHour: number, endMinute: number) => void;
  showStageBadge?: boolean;
}

const pad = (n: number) => n.toString().padStart(2, '0');
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => i);

export const DEFAULT_FIVE_SLOTS: ScheduleSlot[] = [
  { id: 1, label: 'Giai đoạn 1', startHour: 5, startMinute: 0, endHour: 8, endMinute: 0, targetPressure: 28.5, enabled: true },
  { id: 2, label: 'Giai đoạn 2', startHour: 8, startMinute: 0, endHour: 11, endMinute: 0, targetPressure: 24.0, enabled: true },
  { id: 3, label: 'Giai đoạn 3', startHour: 11, startMinute: 0, endHour: 17, endMinute: 0, targetPressure: 22.0, enabled: true },
  { id: 4, label: 'Giai đoạn 4', startHour: 17, startMinute: 0, endHour: 22, endMinute: 0, targetPressure: 32.0, enabled: true },
  { id: 5, label: 'Giai đoạn 5', startHour: 22, startMinute: 0, endHour: 5, endMinute: 0, targetPressure: 18.0, enabled: true },
];

/**
 * Bộ chọn khung giờ Popover dùng chung cho cả 2 chế độ:
 * - Ưu tiên áp suất đầu vào
 * - Hẹn giờ theo thời gian thực (5 Giai đoạn)
 * 
 * Thiết kế chuẩn:
 * - Nút bấm: [ 05:00 -> 08:00 v ]
 * - Cột trái: 5 Khung giờ chẵn (05:00 - 08:00, 08:00 - 11:00...)
 * - Cột phải: Khung cuộn chọn phút (00 -> 59), tự động cuộn phút đang chọn vào tâm.
 */
export function TimeWindowPopoverPicker({
  startHour,
  startMinute,
  endHour,
  endMinute,
  schedules = DEFAULT_FIVE_SLOTS,
  disabled = false,
  onChange,
  showStageBadge = false,
}: TimeWindowPopoverPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const fiveSlots = schedules.length >= 5 ? schedules.slice(0, 5) : DEFAULT_FIVE_SLOTS;
  const selectedMinute = startMinute;

  const matchedSlot = fiveSlots.find(
    (s) => s.startHour === startHour && s.endHour === endHour
  );

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      const activeMinEl = minuteListRef.current?.querySelector('[data-active="true"]');
      activeMinEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 40);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handlePickSlot = (slot: ScheduleSlot) => {
    onChange(slot.startHour, selectedMinute, slot.endHour, selectedMinute);
  };

  const handlePickMinute = (m: number) => {
    onChange(startHour, m, endHour, m);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] hover:border-blue-400 dark:hover:border-blue-500 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs transition-all cursor-pointer disabled:opacity-50 min-w-0"
        >
          <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="font-mono">
            {pad(startHour)}:{pad(selectedMinute)}
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-mono">
            {pad(endHour)}:{pad(selectedMinute)}
          </span>
          {showStageBadge && matchedSlot && (
            <span className="hidden sm:inline text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-0.5">
              ({matchedSlot.label})
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={6}
        collisionPadding={12}
        className="z-70 w-[340px] sm:w-[380px] max-h-[min(260px,var(--radix-popover-content-available-height,260px))] bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 flex flex-col gap-2 ring-0 overflow-hidden"
      >
        {/* Lưới 2 Cột: Cột Trái (5 Khung Giờ) | Cột Phải (Cuộn Phút 00 -> 59) */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-2.5 min-h-0 flex-1">
          {/* CỘT TRÁI: 5 KHUNG GIỜ (Giờ chẵn nổi bật, Giai đoạn 1..5 nhỏ tinh tế) */}
          <div className="h-[156px] flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 p-1 bg-slate-50/60 dark:bg-[#0B0E14]/60 gap-0.5">
            {fiveSlots.map((slot) => {
              const isSlotSelected = matchedSlot?.id === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handlePickSlot(slot)}
                  className={`w-full flex-1 px-2 rounded-lg text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                    isSlotSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <span className="text-[11px] sm:text-xs font-mono font-extrabold tracking-tight shrink-0">
                    {pad(slot.startHour)}:{pad(selectedMinute)} – {pad(slot.endHour)}:{pad(selectedMinute)}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-medium truncate ${
                      isSlotSelected
                        ? 'text-blue-100/90'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {slot.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CỘT PHẢI: KHUNG CUỘN CHỌN PHÚT 00 -> 59 */}
          <div
            ref={minuteListRef}
            className="h-[156px] w-full overflow-y-auto rounded-xl border border-slate-200/80 dark:border-slate-800 p-1 space-y-0.5 bg-slate-50/60 dark:bg-[#0B0E14]/60 scroll-smooth"
          >
            {MINUTES_60.map((m) => {
              const isMinSelected = selectedMinute === m;
              return (
                <button
                  key={m}
                  type="button"
                  data-active={isMinSelected}
                  onClick={() => handlePickMinute(m)}
                  className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                    isMinSelected
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  {pad(m)} phút
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-95 shrink-0"
        >
          Xong
        </button>
      </PopoverContent>
    </Popover>
  );
}

