import React, { useState } from 'react';
import { Check, ChevronDown, Clock, SunMedium } from 'lucide-react';
import { ScheduleSlot } from '../../types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimeWindowPopoverPicker } from './TimeWindowPopoverPicker';

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

/**
 * Bộ chọn phạm vi thời gian (Toàn thời gian vs Khung giờ) cho Mức áp suất Min / Max:
 * - Cột trái: Dropdown chọn Toàn thời gian / Khung giờ
 * - Cột phải: Dùng chung bộ chọn TimeWindowPopoverPicker đồng bộ y hệt như chế độ Hẹn giờ RTC
 */
export function ThresholdTimeWindowPicker({
  triggerScope,
  startHour,
  startMinute,
  endHour,
  endMinute,
  schedules,
  onChangeScope,
  onChangeTime,
  onSelectWindow,
  disabled = false,
}: ThresholdTimeWindowPickerProps) {
  const [isScopeOpen, setIsScopeOpen] = useState(false);
  const isAllTime = triggerScope === 'all_time';

  const scopeOptions = [
    {
      id: 'all_time' as const,
      label: 'Toàn thời gian',
      subText: '24/24H',
      icon: SunMedium,
      iconColor: 'text-blue-500',
    },
    {
      id: 'custom_window' as const,
      label: 'Khung giờ',
      subText: `${pad(startHour)}:${pad(startMinute)}-${pad(endHour)}:${pad(startMinute)}`,
      icon: Clock,
      iconColor: 'text-amber-500',
    },
  ];

  const currentOption =
    scopeOptions.find((opt) => opt.id === triggerScope) || scopeOptions[0];
  const CurrentIcon = currentOption.icon;

  const handleTimeChange = (sh: number, sm: number, eh: number, em: number) => {
    if (onSelectWindow) {
      onSelectWindow(sh, sm, eh, em);
    } else {
      onChangeTime('start', sh, sm);
      onChangeTime('end', eh, em);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-2 h-[48px] sm:h-[52px]">
      {/* Dropdown Scope: Toàn thời gian vs Khung giờ */}
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
                onClick={() => {
                  onChangeScope(opt.id);
                  setIsScopeOpen(false);
                }}
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

      {/* Hiển thị 24/24H hoặc Bộ chọn khung giờ Popover đồng bộ */}
      {isAllTime ? (
        <span className="text-xs font-mono font-bold text-slate-400 pr-2 select-none">
          24/24H
        </span>
      ) : (
        <TimeWindowPopoverPicker
          startHour={startHour}
          startMinute={startMinute}
          endHour={endHour}
          endMinute={endMinute}
          schedules={schedules}
          disabled={disabled}
          onChange={handleTimeChange}
          showStageBadge={true}
        />
      )}
    </div>
  );
}
