import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, ChevronDown, Clock, SunMedium } from 'lucide-react';
import { ScheduleSlot } from '../../types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ThresholdTimeWindowPickerProps {
  triggerScope: 'all_time' | 'custom_window';
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  schedules?: ScheduleSlot[];
  onChangeScope: (scope: 'all_time' | 'custom_window') => void;
  onChangeTime: (type: 'start' | 'end', hour: number, minute: number) => void;
  onSelectWindow?: (
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ) => void;
  disabled?: boolean;
}

const pad = (n: number) => n.toString().padStart(2, '0');
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => i);

const DEFAULT_FIVE_SLOTS: ScheduleSlot[] = [
  { id: 1, label: 'Giai đoạn 1', startHour: 5, startMinute: 0, endHour: 8, endMinute: 0, targetPressure: 28.5, enabled: true },
  { id: 2, label: 'Giai đoạn 2', startHour: 8, startMinute: 0, endHour: 11, endMinute: 0, targetPressure: 24.0, enabled: true },
  { id: 3, label: 'Giai đoạn 3', startHour: 11, startMinute: 0, endHour: 17, endMinute: 0, targetPressure: 22.0, enabled: true },
  { id: 4, label: 'Giai đoạn 4', startHour: 17, startMinute: 0, endHour: 22, endMinute: 0, targetPressure: 32.0, enabled: true },
  { id: 5, label: 'Giai đoạn 5', startHour: 22, startMinute: 0, endHour: 5, endMinute: 0, targetPressure: 18.0, enabled: true },
];

/**
 * Bộ chọn phạm vi thời gian (Toàn thời gian vs Khung giờ):
 * - Popup Popover Portal nổi trên modal: không làm co dãn (zoom/stretch) các thẻ khác bên cạnh.
 * - Tự động giới hạn chiều cao max-height theo không gian thực tế để không bao giờ bị che khuất dưới Taskbar.
 * - Cột trái: 5 Khung giờ chẵn nổi bật, chữ Giai đoạn 1..5 nhỏ tinh tế.
 * - Cột phải: Khung cuộn chọn phút (00 -> 59) mượt mà, tự động cuộn phút đang chọn vào tâm giữa.
 */
export function ThresholdTimeWindowPicker({
  triggerScope,
  startHour,
  startMinute,
  endHour,
  endMinute,
  schedules = DEFAULT_FIVE_SLOTS,
  onChangeScope,
  onChangeTime,
  onSelectWindow,
  disabled = false,
}: ThresholdTimeWindowPickerProps) {
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const [isTimePopupOpen, setIsTimePopupOpen] = useState(false);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const isAllTime = triggerScope === 'all_time';
  const fiveSlots = schedules.length >= 5 ? schedules.slice(0, 5) : DEFAULT_FIVE_SLOTS;

  // Số phút đang được chọn (áp dụng đồng nhất cho các khung giờ chẵn)
  const selectedMinute = startMinute;

  // Tìm giai đoạn đang khớp theo cặp giờ chẵn (startHour - endHour)
  const matchedSlot = fiveSlots.find(
    (s) => s.startHour === startHour && s.endHour === endHour
  );

  const scopeOptions: {
    id: 'all_time' | 'custom_window';
    label: string;
    subText: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
  }[] = [
    {
      id: 'all_time',
      label: 'Toàn thời gian',
      subText: '24/24H',
      icon: SunMedium,
      iconColor: 'text-blue-500',
    },
    {
      id: 'custom_window',
      label: 'Khung giờ',
      subText: `${pad(startHour)}:${pad(selectedMinute)}-${pad(endHour)}:${pad(selectedMinute)}`,
      icon: Clock,
      iconColor: 'text-amber-500',
    },
  ];

  const currentOption =
    scopeOptions.find((opt) => opt.id === triggerScope) || scopeOptions[0];
  const CurrentIcon = currentOption.icon;

  useEffect(() => {
    if (!isTimePopupOpen) return;
    const timer = setTimeout(() => {
      const activeMinEl = minuteListRef.current?.querySelector('[data-active="true"]');
      activeMinEl?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 40);
    return () => clearTimeout(timer);
  }, [isTimePopupOpen]);

  const applyWindowAndMinute = (sh: number, eh: number, min: number) => {
    const clampedMin = Math.min(59, Math.max(0, min));
    if (onSelectWindow) {
      onSelectWindow(sh, clampedMin, eh, clampedMin);
    } else {
      onChangeTime('start', sh, clampedMin);
      onChangeTime('end', eh, clampedMin);
    }
  };

  const handlePickSlot = (slot: ScheduleSlot) => {
    applyWindowAndMinute(slot.startHour, slot.endHour, selectedMinute);
  };

  const handlePickMinute = (m: number) => {
    applyWindowAndMinute(startHour, endHour, m);
  };

  const handleSelectScopeOption = (scopeId: 'all_time' | 'custom_window') => {
    onChangeScope(scopeId);
    if (scopeId === 'custom_window' && !matchedSlot && fiveSlots.length > 0) {
      applyWindowAndMinute(fiveSlots[0].startHour, fiveSlots[0].endHour, selectedMinute);
    }
    setIsScopeOpen(false);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-2 h-[48px] sm:h-[52px]">
      {/* 1. Bên trái: Dropdown Popover chọn Toàn thời gian / Khung giờ */}
      <Popover open={isScopeOpen} onOpenChange={setIsScopeOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] hover:border-slate-300 dark:hover:border-slate-600 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <CurrentIcon className={`w-3.5 h-3.5 shrink-0 ${currentOption.iconColor}`} />
            <span>{currentOption.label}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
                isScopeOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          className="z-70 w-52 bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 flex flex-col gap-0.5 ring-0"
        >
          {scopeOptions.map((opt) => {
            const isSelected = opt.id === triggerScope;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectScopeOption(opt.id)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${opt.iconColor}`} />
                  <span>{opt.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400">
                    {opt.subText}
                  </span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </PopoverContent>
      </Popover>

      {/* 2. Bên phải: Hiển thị 24/24H hoặc Nút mở Popup [5 Khung giờ | Chọn phút 00-59] */}
      {isAllTime ? (
        <span className="text-xs font-mono font-bold text-slate-400 pr-2 select-none">
          24/24H
        </span>
      ) : (
        <Popover open={isTimePopupOpen} onOpenChange={setIsTimePopupOpen}>
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
              {matchedSlot && (
                <span className="hidden sm:inline text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-0.5">
                  ({matchedSlot.label})
                </span>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-150 ${
                  isTimePopupOpen ? 'rotate-180' : ''
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
              onClick={() => setIsTimePopupOpen(false)}
              className="w-full py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              Xong
            </button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
