import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ScheduleSlot } from '../../types';
import { TimeWindowPopoverPicker } from './TimeWindowPopoverPicker';
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
  onAutoChainSchedules?: () => void;
}

export function ScheduleRtcList({
  schedules,
  overlappingIds,
  onUpdateSchedule,
}: ScheduleRtcListProps) {
  return (
    <div className="space-y-3">
      {/* Banner cảnh báo phát hiện khung giờ bị chồng lấn giữa các giai đoạn */}
      {overlappingIds.size > 0 && (
        <div className="flex items-center gap-2.5 p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
          <span className="text-xs font-bold">
            Phát hiện khung giờ bị chồng lấn giữa các giai đoạn
          </span>
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
              <div className="flex items-center justify-between gap-3">
                {/* Cột 1: Switch & Tên giai đoạn */}
                <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
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

                {/* Cột 2: Khung giờ Bắt đầu -> Kết thúc (Dùng chung TimeWindowPopoverPicker đồng bộ như chế độ kia) */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <TimeWindowPopoverPicker
                    startHour={slot.startHour}
                    startMinute={slot.startMinute}
                    endHour={slot.endHour}
                    endMinute={slot.endMinute}
                    schedules={schedules}
                    disabled={!slot.enabled}
                    onChange={(sh, sm, eh, em) =>
                      onUpdateSchedule(slot.id, {
                        startHour: sh,
                        startMinute: sm,
                        endHour: eh,
                        endMinute: em,
                      })
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

