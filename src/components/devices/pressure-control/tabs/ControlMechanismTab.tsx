import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Gauge,
  SlidersHorizontal,
  Timer,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  PressureStationConfig,
  ControlModeId,
  ScheduleSlot,
  ThresholdConfig,
  ControlMechanismConfig,
  PrvTimerConfig,
} from '../types';
import {
  DEFAULT_CONTROL_MECHANISM_CONFIG,
  DEFAULT_PRV_TIMER_CONFIG,
} from '../utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ControlModeOption,
  ControlModeSelector,
} from './control-mechanism/ControlModeSelector';
import { ThresholdCard } from './control-mechanism/ThresholdCard';
import { ScheduleRtcList } from './control-mechanism/ScheduleRtcList';
import { PrvTimerCard } from './control-mechanism/PrvTimerCard';

const CONTROL_MODES: ControlModeOption[] = [
  {
    id: 'manual',
    name: 'Điều khiển thủ công (Manual)',
    icon: SlidersHorizontal,
    color: 'text-emerald-500',
  },
  {
    id: 'schedule_rtc',
    name: 'Hẹn giờ theo thời gian thực',
    icon: Clock,
    color: 'text-amber-500',
  },
  {
    id: 'input_pressure_priority',
    name: 'Ưu tiên áp suất đầu vào',
    icon: Gauge,
    color: 'text-blue-500',
  },
  {
    id: 'prv_timer',
    name: 'Hẹn giờ điều khiển van PRV',
    icon: Timer,
    color: 'text-rose-500',
  },
];

const MIN_PRESSURE_GAP = 1.0;

const toMinutes = (h: number, m: number) => h * 60 + m;
const fromMinutes = (total: number) => {
  const norm = ((total % 1440) + 1440) % 1440;
  return { hour: Math.floor(norm / 60), minute: norm % 60 };
};

/**
 * Tìm các slot đang bị chồng chéo khung giờ
 */
function findOverlappingSlotIds(schedules: ScheduleSlot[]): Set<number> {
  const enabledSlots = schedules.filter((s) => s.enabled);
  const conflictedIds = new Set<number>();
  const minuteOwner = new Array<number | null>(1440).fill(null);

  for (const slot of enabledSlots) {
    const start = toMinutes(slot.startHour, slot.startMinute);
    const end = toMinutes(slot.endHour, slot.endMinute);

    const minutes: number[] = [];
    if (start < end) {
      for (let m = start; m < end; m++) minutes.push(m);
    } else if (start > end) {
      for (let m = start; m < 1440; m++) minutes.push(m);
      for (let m = 0; m < end; m++) minutes.push(m);
    }

    for (const m of minutes) {
      const prevOwner = minuteOwner[m];
      if (prevOwner !== null && prevOwner !== slot.id) {
        conflictedIds.add(prevOwner);
        conflictedIds.add(slot.id);
      } else {
        minuteOwner[m] = slot.id;
      }
    }
  }
  return conflictedIds;
}

interface ControlMechanismTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onApplyMode?: (modeId: ControlModeId) => void;
  onSave?: () => void;
}

export function ControlMechanismTab({
  config,
  onChangeConfig,
  onApplyMode,
}: ControlMechanismTabProps) {
  const cm: ControlMechanismConfig =
    config.controlMechanism ?? DEFAULT_CONTROL_MECHANISM_CONFIG;
  const activeMode = cm.activeMode;
  const schedules = cm.schedules;
  const lowerThreshold = cm.lowerThreshold;
  const upperThreshold = cm.upperThreshold;
  const prvTimer = cm.prvTimer ?? DEFAULT_PRV_TIMER_CONFIG;

  // Tách biệt giữa "Chế độ đang xem/cấu hình" (viewingMode) và "Chế độ đang kích hoạt vận hành" (activeMode)
  const [viewingMode, setViewingMode] = useState<ControlModeId>(activeMode);

  const updateControlMechanism = (
    updater: (prev: ControlMechanismConfig) => ControlMechanismConfig
  ) => {
    onChangeConfig((prevConfig) => {
      const currentCm =
        prevConfig.controlMechanism ?? DEFAULT_CONTROL_MECHANISM_CONFIG;
      return {
        ...prevConfig,
        controlMechanism: updater(currentCm),
      };
    });
  };

  const handleActivateViewingMode = () => {
    if (viewingMode === activeMode) return;
    if (onApplyMode) {
      onApplyMode(viewingMode);
    } else {
      updateControlMechanism((prev) => ({ ...prev, activeMode: viewingMode }));
    }
    const modeName = CONTROL_MODES.find((m) => m.id === viewingMode)?.name;
    toast.success(`Đã áp dụng chế độ: ${modeName}`);
  };

  const setLowerThreshold = (
    updater: (prev: ThresholdConfig) => ThresholdConfig
  ) => {
    updateControlMechanism((prev) => {
      const nextLower = updater(prev.lowerThreshold);
      const maxAllowed = Math.min(
        50,
        Number((prev.upperThreshold.value - MIN_PRESSURE_GAP).toFixed(1))
      );
      const clampedVal = Math.max(0, Math.min(maxAllowed, nextLower.value));
      return {
        ...prev,
        lowerThreshold: { ...nextLower, value: clampedVal },
      };
    });
  };

  const setUpperThreshold = (
    updater: (prev: ThresholdConfig) => ThresholdConfig
  ) => {
    updateControlMechanism((prev) => {
      const nextUpper = updater(prev.upperThreshold);
      const minAllowed = Math.max(
        1,
        Number((prev.lowerThreshold.value + MIN_PRESSURE_GAP).toFixed(1))
      );
      const clampedVal = Math.min(80, Math.max(minAllowed, nextUpper.value));
      return {
        ...prev,
        upperThreshold: { ...nextUpper, value: clampedVal },
      };
    });
  };

  const setPrvTimer = (updater: (prev: PrvTimerConfig) => PrvTimerConfig) => {
    updateControlMechanism((prev) => ({
      ...prev,
      prvTimer: updater(prev.prvTimer ?? DEFAULT_PRV_TIMER_CONFIG),
    }));
  };

  const updateSchedule = (id: number, patch: Partial<ScheduleSlot>) => {
    updateControlMechanism((prev) => {
      if (patch.enabled === false) {
        const enabledCount = prev.schedules.filter((s) => s.enabled).length;
        const targetSlot = prev.schedules.find((s) => s.id === id);
        if (targetSlot?.enabled && enabledCount <= 1) {
          toast.warning('Phải duy trì ít nhất 1 giai đoạn hoạt động');
          return prev;
        }
      }

      const idx = prev.schedules.findIndex((s) => s.id === id);
      if (idx === -1) return prev;

      const updated = prev.schedules.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      );
      const current = updated[idx];

      if (
        current.startHour === current.endHour &&
        current.startMinute === current.endMinute
      ) {
        const bumped = fromMinutes(
          toMinutes(current.startHour, current.startMinute) + 30
        );
        updated[idx] = {
          ...current,
          endHour: bumped.hour,
          endMinute: bumped.minute,
        };
      }

      return { ...prev, schedules: updated };
    });
  };

  const lowerMaxAllowed = Math.min(
    50,
    Number((upperThreshold.value - MIN_PRESSURE_GAP).toFixed(1))
  );
  const upperMinAllowed = Math.max(
    1,
    Number((lowerThreshold.value + MIN_PRESSURE_GAP).toFixed(1))
  );

  const overlappingIds = useMemo(
    () =>
      viewingMode === 'schedule_rtc'
        ? findOverlappingSlotIds(schedules)
        : new Set<number>(),
    [viewingMode, schedules]
  );

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col gap-4 max-w-5xl mx-auto w-full py-1">
        {/* 1. Header chọn chế độ cấu hình & kích hoạt vận hành */}
        <ControlModeSelector
          modes={CONTROL_MODES}
          viewingMode={viewingMode}
          activeMode={activeMode}
          onSelectViewingMode={setViewingMode}
          onApplyMode={handleActivateViewingMode}
        />

        {/* Cảnh báo chế độ chưa được kích hoạt cho trạm (áp dụng thống nhất cho tất cả các chế độ) */}
        {viewingMode !== activeMode && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-amber-500/25 bg-amber-500/5 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-medium">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Vui lòng kích hoạt chế độ để tiếp tục cấu hình</span>
          </div>
        )}

        {/* 2. Cấu hình chi tiết theo chế độ đang xem */}
        <div
          className={`transition-opacity ${
            viewingMode !== activeMode ? 'opacity-60 select-none' : ''
          }`}
          onClickCapture={
            viewingMode !== activeMode
              ? (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toast.warning('Vui lòng kích hoạt chế độ để tiếp tục cấu hình');
                }
              : undefined
          }
        >
          {viewingMode === 'manual' ? (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-8 shadow-xs flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                Chế độ điều khiển thủ công trực tiếp trên màn hình chính
              </span>
            </div>
          ) : viewingMode === 'input_pressure_priority' ? (
            <div className="grid grid-cols-1 gap-4">
              {/* CARD 1: MỨC ÁP SUẤT MIN */}
              <ThresholdCard
                title="Mức áp suất Min"
                icon={TrendingDown}
                iconBgClass="bg-amber-500/10 dark:bg-amber-500/15"
                iconColorClass="text-amber-500"
                accentClass="text-amber-600 dark:text-amber-400"
                config={lowerThreshold}
                schedules={schedules}
                minAllowed={0}
                maxAllowed={lowerMaxAllowed}
                step={0.5}
                onChangeConfig={setLowerThreshold}
                switchId="lower-cycle-switch"
              />

              {/* CARD 2: MỨC ÁP SUẤT MAX */}
              <ThresholdCard
                title="Mức áp suất Max"
                icon={TrendingUp}
                iconBgClass="bg-rose-500/10 dark:bg-rose-500/15"
                iconColorClass="text-rose-500"
                accentClass="text-rose-600 dark:text-rose-400"
                config={upperThreshold}
                schedules={schedules}
                minAllowed={upperMinAllowed}
                maxAllowed={80}
                step={0.5}
                onChangeConfig={setUpperThreshold}
                switchId="upper-cycle-switch"
              />
            </div>
          ) : viewingMode === 'schedule_rtc' ? (
            /* CHẾ ĐỘ 2: HẸN GIỜ THEO THỜI GIAN THỰC (5 GIAI ĐOẠN) */
            <ScheduleRtcList
              schedules={schedules}
              overlappingIds={overlappingIds}
              onUpdateSchedule={updateSchedule}
            />
          ) : (
            /* CHẾ ĐỘ 3 / CƠ CHẾ SỐ 4: HẸN GIỜ ĐIỀU KHIỂN VAN PRV (ONE-SHOT) */
            <PrvTimerCard
              config={prvTimer}
              onChangeConfig={setPrvTimer}
              isModeActive={activeMode === 'prv_timer'}
            />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
