import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ScheduleSlot, ThresholdConfig } from '../../types';
import { PressureStepperInput } from './PressureStepperInput';
import { ThresholdTimeWindowPicker } from './ThresholdTimeWindowPicker';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CYCLE_COUNTS = [1, 2, 3, 4, 5, 10];

interface ThresholdCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
  accentClass: string;
  config: ThresholdConfig;
  schedules?: ScheduleSlot[];
  minAllowed: number;
  maxAllowed: number;
  step?: number;
  onChangeConfig: (updater: (prev: ThresholdConfig) => ThresholdConfig) => void;
  switchId: string;
}

export function ThresholdCard({
  title,
  icon: Icon,
  iconBgClass,
  iconColorClass,
  accentClass,
  config,
  schedules,
  minAllowed,
  maxAllowed,
  step = 0.5,
  onChangeConfig,
  switchId,
}: ThresholdCardProps) {
  const handleScopeChange = (scope: 'all_time' | 'custom_window') => {
    onChangeConfig((prev) => ({
      ...prev,
      triggerScope: scope,
    }));
  };

  const handleTimeChange = (type: 'start' | 'end', hour: number, minute: number) => {
    onChangeConfig((prev) => {
      const next = { ...prev };
      if (type === 'start') {
        next.startHour = hour;
        next.startMinute = minute;
      } else {
        next.endHour = hour;
        next.endMinute = minute;
      }

      // Ngăn ngừa giờ bắt đầu trùng khít giờ kết thúc (0 phút)
      if (next.startHour === next.endHour && next.startMinute === next.endMinute) {
        const nextEndMinute = (next.startMinute + 30) % 60;
        const nextEndHour = (next.startHour + Math.floor((next.startMinute + 30) / 60)) % 24;
        return { ...next, endHour: nextEndHour, endMinute: nextEndMinute };
      }

      return next;
    });
  };

  const handleSelectWindow = (
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ) => {
    onChangeConfig((prev) => ({
      ...prev,
      startHour,
      startMinute,
      endHour,
      endMinute,
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-3.5 sm:p-5 shadow-xs space-y-3.5">
      {/* 1. Header Card: Tên ngưỡng + Stepper áp suất */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl ${iconBgClass} ${iconColorClass} flex items-center justify-center shrink-0 border border-current/20`}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            {title}
          </span>
        </div>

        <PressureStepperInput
          min={minAllowed}
          max={maxAllowed}
          step={step}
          value={config.value}
          ariaLabel={title}
          accentClass={accentClass}
          placeholder={
            title.toLowerCase().includes('min') || title.toLowerCase().includes('dưới')
              ? 'Nhập mức áp suất min...'
              : 'Nhập mức áp suất max...'
          }
          showSteppers={false}
          showUnit={false}
          className="w-48 sm:w-64"
          onChange={(val) =>
            onChangeConfig((prev) => ({ ...prev, value: val }))
          }
        />
      </div>

      {/* 2. Khối cấu hình Thời gian & Chu kỳ (Responsive 1 cột trên Mobile, 2 cột trên Tablet/Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        {/* Khối Khung Giờ Thông Minh */}
        <ThresholdTimeWindowPicker
          triggerScope={config.triggerScope}
          startHour={config.startHour}
          startMinute={config.startMinute}
          endHour={config.endHour}
          endMinute={config.endMinute}
          schedules={schedules}
          onChangeScope={handleScopeChange}
          onChangeTime={handleTimeChange}
          onSelectWindow={handleSelectWindow}
        />

        {/* Khối Số lần quan sát */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3 h-[48px] sm:h-[52px]">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 select-none">
              Số lần quan sát
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Đo và xác nhận liên tiếp {config.cycleCount || 1} lần trước khi kích hoạt
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="relative flex items-center h-8 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] shadow-2xs">
            <select
              aria-label={`Số lần quan sát ${title}`}
              value={config.cycleCount || 1}
              onChange={(e) =>
                onChangeConfig((prev) => ({
                  ...prev,
                  useCycles: true,
                  cycleCount: parseInt(e.target.value, 10),
                }))
              }
              className="h-full pl-2.5 pr-6 bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer appearance-none"
            >
              {CYCLE_COUNTS.map((c) => (
                <option key={c} value={c} className="bg-white dark:bg-[#141824]">
                  {c} lần
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-1.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

