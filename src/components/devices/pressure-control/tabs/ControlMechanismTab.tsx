import React, { useMemo, useState } from 'react';
import {
  Clock,
  Gauge,
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
} from '../types';
import { DEFAULT_CONTROL_MECHANISM_CONFIG } from '../utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ControlModeOption,
  ControlModeSelector,
} from './control-mechanism/ControlModeSelector';
import { ThresholdCard } from './control-mechanism/ThresholdCard';
import { ScheduleRtcList } from './control-mechanism/ScheduleRtcList';

const CONTROL_MODES: ControlModeOption[] = [
  {
    id: 'input_pressure_priority',
    name: 'Ưu tiên áp suất đầu vào',
    icon: Gauge,
    color: 'text-blue-500',
  },
  {
    id: 'schedule_rtc',
    name: 'Hẹn giờ theo thời gian thực',
    icon: Clock,
    color: 'text-amber-500',
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
  onSave?: () => void;
}

export function ControlMechanismTab({
  config,
  onChangeConfig,
}: ControlMechanismTabProps) {
  const cm: ControlMechanismConfig =
    config.controlMechanism ?? DEFAULT_CONTROL_MECHANISM_CONFIG;
  const activeMode = cm.activeMode;
  const schedules = cm.schedules;
  const lowerThreshold = cm.lowerThreshold;
  const upperThreshold = cm.upperThreshold;

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
    updateControlMechanism((prev) => ({ ...prev, activeMode: viewingMode }));
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

  const handleAutoChainSchedules = () => {
    updateControlMechanism((prev) => {
      const next = [...prev.schedules];
      const enabledIndices = next
        .map((s, i) => (s.enabled ? i : -1))
        .filter((i) => i !== -1);

      if (enabledIndices.length <= 1) return prev;

      for (let k = 0; k < enabledIndices.length; k++) {
        const currIdx = enabledIndices[k];
        const nextIdx = enabledIndices[(k + 1) % enabledIndices.length];
        next[nextIdx] = {
          ...next[nextIdx],
          startHour: next[currIdx].endHour,
          startMinute: next[currIdx].endMinute,
        };
      }
      toast.success('Đã tự động nối tiếp khung giờ giữa các giai đoạn');
      return { ...prev, schedules: next };
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

        {/* 2. Cấu hình chi tiết theo chế độ đang xem */}
        {viewingMode === 'input_pressure_priority' ? (
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
        ) : (
          /* CHẾ ĐỘ 2: HẸN GIỜ THEO THỜI GIAN THỰC (5 GIAI ĐOẠN) */
          <ScheduleRtcList
            schedules={schedules}
            overlappingIds={overlappingIds}
            onUpdateSchedule={updateSchedule}
            onAutoChainSchedules={handleAutoChainSchedules}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
