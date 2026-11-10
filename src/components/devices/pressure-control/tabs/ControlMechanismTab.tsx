import React, { useMemo } from 'react';
import {
  Clock,
  Gauge,
  SlidersHorizontal,
  Timer,
  TrendingDown,
  TrendingUp,
  Waves,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  PressureStationConfig,
  ControlModeId,
  ScheduleSlot,
  ThresholdConfig,
  ControlMechanismConfig,
  PrvTimerConfig,
  OutputPressureConfig,
} from '../types';
import {
  DEFAULT_CONTROL_MECHANISM_CONFIG,
  DEFAULT_PRV_TIMER_CONFIG,
  getConflictingModes,
  resolveActivatedModes,
  resolveDeactivatedModes,
} from '../utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { ThresholdCard } from './control-mechanism/ThresholdCard';
import { ScheduleRtcList } from './control-mechanism/ScheduleRtcList';
import { PrvTimerCard } from './control-mechanism/PrvTimerCard';
import { DownstreamPressureCard } from './control-mechanism/DownstreamPressureCard';

interface ControlModeMeta {
  id: ControlModeId;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const CONTROL_MODES: ControlModeMeta[] = [
  {
    id: 'manual',
    name: 'Điều khiển thủ công (Manual)',
    shortName: 'Thủ công',
    icon: SlidersHorizontal,
    color: 'text-emerald-500',
  },
  {
    id: 'schedule_rtc',
    name: 'Hẹn giờ theo thời gian thực',
    shortName: 'Thời gian thực',
    icon: Clock,
    color: 'text-amber-500',
  },
  {
    id: 'input_pressure_priority',
    name: 'Ưu tiên áp suất đầu vào',
    shortName: 'Áp lực đầu vào',
    icon: Gauge,
    color: 'text-blue-500',
  },
  {
    id: 'output_pressure_control',
    name: 'Điều khiển theo áp lực cuối nguồn',
    shortName: 'Áp lực cuối nguồn',
    icon: Waves,
    color: 'text-cyan-500',
  },
  {
    id: 'prv_timer',
    name: 'Điều khiển đóng mở van PRV',
    shortName: 'Đóng mở van PRV',
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
  onDeactivateMode?: (modeId: ControlModeId) => void;
  onSave?: () => void;
}

export function ControlMechanismTab({
  config,
  onChangeConfig,
  onApplyMode,
  onDeactivateMode,
}: ControlMechanismTabProps) {
  const cm: ControlMechanismConfig =
    config.controlMechanism ?? DEFAULT_CONTROL_MECHANISM_CONFIG;
  const activeMode = cm.activeMode;
  const activeModes =
    cm.activeModes && cm.activeModes.length > 0
      ? cm.activeModes
      : [activeMode];
  const schedules = cm.schedules;
  const lowerThreshold = cm.lowerThreshold;
  const upperThreshold = cm.upperThreshold;
  const prvTimer = cm.prvTimer ?? DEFAULT_PRV_TIMER_CONFIG;
  const outputPressure: OutputPressureConfig =
    cm.outputPressure ?? {
      p1: config.targetP1,
      p2: config.targetP2,
      pFull: config.targetP3,
    };

  const isManualActive = activeModes.includes('manual');
  const isRtcActive = activeModes.includes('schedule_rtc');
  const isInputPressureActive = activeModes.includes('input_pressure_priority');
  const isOutputPressureActive = activeModes.includes('output_pressure_control');
  const isPrvActive = activeModes.includes('prv_timer');

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

  const handleToggleMode = (modeId: ControlModeId, checked: boolean) => {
    const targetMeta = CONTROL_MODES.find((m) => m.id === modeId);
    const targetName = targetMeta?.name ?? modeId;

    if (checked) {
      // 1. Kiểm tra các chế độ đang xung đột - KHÔNG tự ý ngắt của người dùng
      const conflictingModes = getConflictingModes(modeId, activeModes);

      if (conflictingModes.length > 0) {
        const conflictingNames = conflictingModes
          .map((m) => CONTROL_MODES.find((opt) => opt.id === m)?.name ?? m)
          .join(', ');
        toast.warning(`Phải tắt [${conflictingNames}] để bật [${targetName}]`);
        return; // Dừng lại, giữ nguyên công tắc để người dùng tự thao tác tắt
      }

      // 2. Không có xung đột: Kích hoạt chế độ
      if (onApplyMode) {
        onApplyMode(modeId);
      } else {
        const nextActiveModes = activeModes.includes(modeId)
          ? activeModes
          : [...activeModes, modeId];
        updateControlMechanism((prev) => ({
          ...prev,
          activeMode: modeId,
          activeModes: nextActiveModes,
          prvTimer: {
            ...(prev.prvTimer ?? DEFAULT_PRV_TIMER_CONFIG),
            enabled: nextActiveModes.includes('prv_timer'),
          },
        }));
      }

      // Thông báo thành công
      if (
        modeId === 'input_pressure_priority' &&
        activeModes.includes('schedule_rtc')
      ) {
        toast.success(
          `Đã bật [${targetName}] (chạy song song với Hẹn giờ theo thời gian thực)`
        );
      } else if (
        modeId === 'schedule_rtc' &&
        activeModes.includes('input_pressure_priority')
      ) {
        toast.success(
          `Đã bật [${targetName}] (chạy song song với Ưu tiên áp suất đầu vào)`
        );
      } else {
        toast.success(`Đã bật [${targetName}]`);
      }
    } else {
      // 3. Tắt chế độ: Cho phép người dùng tự tắt chế độ đang chạy
      if (onDeactivateMode) {
        onDeactivateMode(modeId);
      } else {
        const nextActiveModes = activeModes.filter((m) => m !== modeId);
        updateControlMechanism((prev) => ({
          ...prev,
          activeMode: nextActiveModes[0] ?? 'manual',
          activeModes: nextActiveModes,
          prvTimer: {
            ...(prev.prvTimer ?? DEFAULT_PRV_TIMER_CONFIG),
            enabled: nextActiveModes.includes('prv_timer'),
          },
        }));
      }

      toast.info(`Đã tắt [${targetName}]`);
    }
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

  const setOutputPressure = (
    updater: (prev: OutputPressureConfig) => OutputPressureConfig
  ) => {
    onChangeConfig((prevConfig) => {
      const currentCm =
        prevConfig.controlMechanism ?? DEFAULT_CONTROL_MECHANISM_CONFIG;
      const currentOp = currentCm.outputPressure ?? {
        p1: prevConfig.targetP1,
        p2: prevConfig.targetP2,
        pFull: prevConfig.targetP3,
      };
      const nextOp = updater(currentOp);
      return {
        ...prevConfig,
        targetP1: nextOp.p1,
        targetP2: nextOp.p2,
        targetP3: nextOp.pFull,
        controlMechanism: {
          ...currentCm,
          outputPressure: nextOp,
        },
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

  const lowerMaxAllowed = Math.min(
    50,
    Number((upperThreshold.value - MIN_PRESSURE_GAP).toFixed(1))
  );
  const upperMinAllowed = Math.max(
    1,
    Number((lowerThreshold.value + MIN_PRESSURE_GAP).toFixed(1))
  );

  const overlappingIds = useMemo(
    () => findOverlappingSlotIds(schedules),
    [schedules]
  );

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col gap-4 max-w-5xl mx-auto w-full py-1">
        {/* Danh sách các khối cơ chế điều khiển */}
        <div className="flex flex-col gap-4">
          {/* KHỐI 1: ĐIỀU KHIỂN THỦ CÔNG (Gọn gàng, loại bỏ text thừa) */}
          <section
            id="section-manual"
            className={`rounded-2xl border transition-all ${
              isManualActive
                ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141824] shadow-xs'
                : 'border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#10141f]/40 opacity-75'
            } px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isManualActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Điều khiển thủ công (Manual)
              </h3>
            </div>

            <div className="flex items-center">
              <Switch
                id="switch-mode-manual"
                checked={isManualActive}
                onCheckedChange={(checked) => handleToggleMode('manual', checked)}
                aria-label="Bật/tắt Điều khiển thủ công"
              />
            </div>
          </section>

          {/* KHỐI 2: HẸN GIỜ THEO THỜI GIAN THỰC (Tách riêng) */}
          <section
            id="section-schedule_rtc"
            className={`rounded-2xl border transition-all ${
              isRtcActive
                ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141824] shadow-xs'
                : 'border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#10141f]/40 opacity-75'
            } p-4 sm:p-5 space-y-3.5`}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isRtcActive
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Hẹn giờ theo thời gian thực
                  </h3>
                </div>
              </div>

              <div className="flex items-center">
                <Switch
                  id="switch-mode-schedule_rtc"
                  checked={isRtcActive}
                  onCheckedChange={(checked) => handleToggleMode('schedule_rtc', checked)}
                  aria-label="Bật/tắt Hẹn giờ theo thời gian thực"
                />
              </div>
            </div>

            <div className={`transition-opacity ${!isRtcActive ? 'opacity-50 pointer-events-none' : ''}`}>
              <ScheduleRtcList
                schedules={schedules}
                overlappingIds={overlappingIds}
                onUpdateSchedule={updateSchedule}
                borderless={true}
              />
            </div>
          </section>

          {/* KHỐI 3: ƯU TIÊN ÁP SUẤT ĐẦU VÀO (Tách riêng) */}
          <section
            id="section-input_pressure_priority"
            className={`rounded-2xl border transition-all ${
              isInputPressureActive
                ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141824] shadow-xs'
                : 'border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#10141f]/40 opacity-75'
            } p-4 sm:p-5 space-y-3.5`}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isInputPressureActive
                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Ưu tiên áp suất đầu vào
                  </h3>
                </div>
              </div>

              <div className="flex items-center">
                <Switch
                  id="switch-mode-input_pressure_priority"
                  checked={isInputPressureActive}
                  onCheckedChange={(checked) =>
                    handleToggleMode('input_pressure_priority', checked)
                  }
                  aria-label="Bật/tắt Ưu tiên áp suất đầu vào"
                />
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-3.5 transition-opacity ${
                !isInputPressureActive ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
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
                variant="embedded"
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
                variant="embedded"
              />
            </div>
          </section>

          {/* KHỐI 4: ĐIỀU KHIỂN THEO ÁP LỰC CUỐI NGUỒN */}
          <section
            id="section-output_pressure_control"
            className={`rounded-2xl border transition-all ${
              isOutputPressureActive
                ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141824] shadow-xs'
                : 'border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#10141f]/40 opacity-75'
            } p-4 sm:p-5 space-y-3.5`}
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isOutputPressureActive
                      ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
                      : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Waves className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Điều khiển theo áp lực cuối nguồn
                </h3>
              </div>

              <div className="flex items-center">
                <Switch
                  id="switch-mode-output_pressure_control"
                  checked={isOutputPressureActive}
                  onCheckedChange={(checked) =>
                    handleToggleMode('output_pressure_control', checked)
                  }
                  aria-label="Bật/tắt Điều khiển theo áp lực cuối nguồn"
                />
              </div>
            </div>

            <div
              className={`transition-opacity ${
                !isOutputPressureActive ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <DownstreamPressureCard
                config={outputPressure}
                onChangeConfig={setOutputPressure}
                disabled={!isOutputPressureActive}
                variant="embedded"
              />
            </div>
          </section>

          {/* KHỐI 4: ĐIỀU KHIỂN ĐÓNG MỞ VAN PRV */}
          <section id="section-prv_timer">
            <PrvTimerCard
              config={prvTimer}
              onChangeConfig={setPrvTimer}
              isModeActive={isPrvActive}
              onToggleMode={(checked) => handleToggleMode('prv_timer', checked)}
            />
          </section>
        </div>
      </div>
    </TooltipProvider>
  );
}

