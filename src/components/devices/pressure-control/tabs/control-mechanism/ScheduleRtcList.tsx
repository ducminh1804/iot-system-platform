import React from 'react';
import { AlertTriangle, ArrowRight, Wand2 } from 'lucide-react';
import { ScheduleSlot } from '../../types';
import { PressureStepperInput } from './PressureStepperInput';
import { TimePicker24h } from './TimePicker24h';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ScheduleRtcListProps {
  schedules: ScheduleSlot[];
  overlappingIds: Set<number>;
  onUpdateSchedule: (slotId: number, patch: Partial<ScheduleSlot>) => void;
  onAutoChainSchedules: () => void;
}

export function ScheduleRtcList({
  schedules,
  overlappingIds,
  onUpdateSchedule,
  onAutoChainSchedules,
}: ScheduleRtcListProps) {
  return (
    <div className="space-y-3">
      {/* Nút hỗ trợ giải quyết xung đột thời gian (1-click Nối tiếp khung giờ) */}
      {overlappingIds.size > 0 && (
        <div className="flex items-center justify-between p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Phát hiện khung giờ bị chồng lấn giữa các giai đoạn</span>
          </div>

          <button
            type="button"
            onClick={onAutoChainSchedules}
            className="h-8 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95 shrink-0"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Nối tiếp khung giờ</span>
          </button>
        </div>
      )}

      {/* Danh sách 5 giai đoạn hẹn giờ RTC */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs overflow-hidden">
        {schedules.map((slot) => {
          const isOverlapping = slot.enabled && overlappingIds.has(slot.id);
          const switchId = `schedule-switch-${slot.id}`;

          return (
            <div
              key={slot.id}
              className={`px-3 py-2.5 sm:px-5 sm:py-3.5 transition-colors ${
                !slot.enabled
                  ? 'bg-slate-50/60 dark:bg-[#0e121b]/60 opacity-55'
                  : isOverlapping
                  ? 'bg-amber-500/5'
                  : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                {/* Hàng 1 (Mobile) / Cột 1 (Desktop): Switch & Tên giai đoạn */}
                <div className="flex items-center justify-between gap-2 sm:w-44 shrink-0">
                  <div className="flex items-center gap-2">
                    <Switch
                      id={switchId}
                      checked={slot.enabled}
                      onCheckedChange={(checked) =>
                        onUpdateSchedule(slot.id, { enabled: checked })
                      }
                    />
                    <label
                      htmlFor={switchId}
                      className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none"
                    >
                      {slot.label}
                    </label>
                  </div>

                  {/* Trên Mobile: Stepper nằm ngay góc phải hàng 1, cực kỳ gọn gàng */}
                  <div className="sm:hidden">
                    <PressureStepperInput
                      min={5}
                      max={50}
                      step={0.5}
                      disabled={!slot.enabled}
                      value={slot.targetPressure}
                      ariaLabel={`Áp suất ${slot.label}`}
                      onChange={(val) =>
                        onUpdateSchedule(slot.id, { targetPressure: val })
                      }
                    />
                  </div>
                </div>

                {/* Hàng 2 (Mobile) / Cột 2 (Desktop): Khung giờ Bắt đầu -> Kết thúc */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TimePicker24h
                    hour={slot.startHour}
                    minute={slot.startMinute}
                    disabled={!slot.enabled}
                    onChange={(h, m) =>
                      onUpdateSchedule(slot.id, { startHour: h, startMinute: m })
                    }
                  />

                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                  <TimePicker24h
                    hour={slot.endHour}
                    minute={slot.endMinute}
                    disabled={!slot.enabled}
                    onChange={(h, m) =>
                      onUpdateSchedule(slot.id, { endHour: h, endMinute: m })
                    }
                  />

                  {isOverlapping && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-amber-500 cursor-help pl-1">
                          <AlertTriangle className="w-4 h-4" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Khung giờ đang bị chồng lấn với giai đoạn khác
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                {/* Trên Desktop: Stepper nằm ở cột 3 cuối dòng */}
                <div className="hidden sm:flex items-center justify-end">
                  <PressureStepperInput
                    min={5}
                    max={50}
                    step={0.5}
                    disabled={!slot.enabled}
                    value={slot.targetPressure}
                    ariaLabel={`Áp suất ${slot.label}`}
                    onChange={(val) =>
                      onUpdateSchedule(slot.id, { targetPressure: val })
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

