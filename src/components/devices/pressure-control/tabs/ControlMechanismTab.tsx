import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Check,
  Clock,
  Gauge,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  AlertTriangle,
  Wand2,
  Minus,
  Plus,
  Zap,
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
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ControlModeItem {
  id: ControlModeId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const CONTROL_MODES: ControlModeItem[] = [
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

const pad = (n: number) => String(n).padStart(2, '0');
const toMinutes = (h: number, m: number) => h * 60 + m;
const fromMinutes = (total: number) => {
  const norm = ((total % 1440) + 1440) % 1440;
  return { hour: Math.floor(norm / 60), minute: norm % 60 };
};

const MIN_PRESSURE_GAP = 1.0;
const CYCLE_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1);
const CYCLE_MINUTES = [5, 10, 15, 20, 25, 30, 45, 60];

/**
 * Cụm nhập mức áp suất kèm nút tăng/giảm (+/-) chuẩn công nghiệp (Không dùng thanh kéo Slider)
 * - Cho phép xóa trắng (Backspace) hoặc gõ số thập phân mà không bị nhảy về 0.
 * - Tự động khóa (clamp) vào [min, max] và làm tròn theo step khi rời ô hoặc nhấn Enter.
 * - Chặn lăn chuột (onWheel) tránh nhảy số vô tình.
 */
function PressureStepperInput({
  value,
  min,
  max,
  step = 0.5,
  disabled,
  onChange,
  accentClass = 'text-blue-600 dark:text-blue-400',
  ariaLabel,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  onChange: (val: number) => void;
  accentClass?: string;
  ariaLabel?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    if (!isFocused) {
      setDraft(String(value));
    }
  }, [value, isFocused]);

  const clampAndStep = (num: number) => {
    const stepped = Math.round(num / step) * step;
    return Math.min(max, Math.max(min, Number(stepped.toFixed(1))));
  };

  const commitValue = (raw: string) => {
    const normalized = raw.trim().replace(',', '.');
    const parsed = parseFloat(normalized);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const clamped = clampAndStep(parsed);
    setDraft(String(clamped));
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  const handleStep = (delta: number) => {
    if (disabled) return;
    const next = clampAndStep(value + delta);
    if (next !== value) {
      onChange(next);
      setDraft(String(next));
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => handleStep(-step)}
        aria-label={`Giảm ${ariaLabel ?? 'áp suất'}`}
        className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all shadow-2xs shrink-0"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <div className="relative flex items-center h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0E14] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
        <input
          type="text"
          inputMode="decimal"
          aria-label={ariaLabel}
          disabled={disabled}
          value={isFocused ? draft : String(value)}
          onFocus={(e) => {
            setIsFocused(true);
            setDraft(String(value));
            e.currentTarget.select();
          }}
          onChange={(e) => {
            const next = e.target.value;
            if (/^[0-9]*[.,]?[0-9]*$/.test(next)) {
              setDraft(next);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            commitValue(draft);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              setDraft(String(value));
              setIsFocused(false);
              e.currentTarget.blur();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              handleStep(step);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              handleStep(-step);
            }
          }}
          onWheel={(e) => {
            e.currentTarget.blur();
          }}
          className={`w-14 text-center bg-transparent text-sm font-mono font-extrabold ${accentClass} focus:outline-none disabled:opacity-40`}
        />
        <span className="text-[11px] font-mono font-semibold text-slate-400 select-none pl-1">
          mH₂O
        </span>
      </div>

      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => handleStep(step)}
        aria-label={`Tăng ${ariaLabel ?? 'áp suất'}`}
        className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all shadow-2xs shrink-0"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * Bộ chọn giờ 24h chống tràn khung nhìn & tự động cuộn tới giờ đang chọn
 */
function TimePicker24h({
  hour,
  minute,
  onChange,
  disabled,
}: {
  hour: number;
  minute: number;
  onChange: (h: number, m: number) => void;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.left;
      setOpenUpward(spaceBelow < 290 && rect.top > 290);
      setAlignRight(spaceRight < 230);
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      const activeHourEl = hourListRef.current?.querySelector('[data-active="true"]');
      const activeMinEl = minuteListRef.current?.querySelector('[data-active="true"]');
      activeHourEl?.scrollIntoView({ block: 'center' });
      activeMinEl?.scrollIntoView({ block: 'center' });
    }, 20);
    return () => clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141824] hover:bg-slate-50 dark:hover:bg-slate-800/80 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
      >
        <Clock className="w-3.5 h-3.5 text-blue-500" />
        <span>
          {pad(hour)}:{pad(minute)}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute z-40 bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3.5 flex flex-col gap-3 min-w-[210px] animate-in fade-in zoom-in-95 duration-100 ${
              openUpward ? 'bottom-[calc(100%+6px)]' : 'top-[calc(100%+6px)]'
            } ${alignRight ? 'right-0' : 'left-0'}`}
          >
            <div className="text-center pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Chọn Giờ (24H)
              </span>
              <div className="text-base font-mono font-black text-blue-600 dark:text-blue-400 mt-0.5">
                {pad(hour)} : {pad(minute)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400">GIỜ</span>
                <div
                  ref={hourListRef}
                  className="h-40 w-full overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 p-1 space-y-1"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      data-active={hour === i}
                      onClick={() => onChange(i, minute)}
                      className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        hour === i
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pad(i)}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-slate-400">PHÚT</span>
                <div
                  ref={minuteListRef}
                  className="h-40 w-full overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 p-1 space-y-1"
                >
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                    <button
                      key={m}
                      type="button"
                      data-active={minute === m}
                      onClick={() => onChange(hour, m)}
                      className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        minute === m
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pad(m)}p
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Xác nhận
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Kiểm tra chồng lấn khung giờ giữa các giai đoạn đang bật
 */
function findOverlappingSlotIds(schedules: ScheduleSlot[]): Set<number> {
  const activeSlots = schedules.filter((s) => s.enabled);
  const minuteOwner = new Array<number | null>(1440).fill(null);
  const conflictedIds = new Set<number>();

  for (const slot of activeSlots) {
    const start = toMinutes(slot.startHour, slot.startMinute);
    const end = toMinutes(slot.endHour, slot.endMinute);
    if (start === end) {
      conflictedIds.add(slot.id);
      continue;
    }
    const duration = end > start ? end - start : 1440 - start + end;
    for (let offset = 0; offset < duration; offset++) {
      const m = (start + offset) % 1440;
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
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);

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

  // Kích hoạt chế độ đang xem thành chế độ vận hành chính của trạm
  const handleActivateViewingMode = () => {
    if (viewingMode === activeMode) return;
    updateControlMechanism((prev) => ({ ...prev, activeMode: viewingMode }));
    const modeName = CONTROL_MODES.find((m) => m.id === viewingMode)?.name;
    toast.success(`Đã kích hoạt chế độ: ${modeName}`);
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

  const updateThresholdTime = (
    which: 'lower' | 'upper',
    field: 'start' | 'end',
    h: number,
    m: number
  ) => {
    const apply = (prev: ThresholdConfig): ThresholdConfig => {
      const next =
        field === 'start'
          ? { ...prev, startHour: h, startMinute: m }
          : { ...prev, endHour: h, endMinute: m };

      if (next.startHour === next.endHour && next.startMinute === next.endMinute) {
        const bumped = fromMinutes(toMinutes(next.startHour, next.startMinute) + 30);
        return { ...next, endHour: bumped.hour, endMinute: bumped.minute };
      }
      return next;
    };

    if (which === 'lower') setLowerThreshold(apply);
    else setUpperThreshold(apply);
  };

  const currentViewingMode =
    CONTROL_MODES.find((m) => m.id === viewingMode) || CONTROL_MODES[0];
  const CurrentViewingIcon = currentViewingMode.icon;

  const currentActiveMode =
    CONTROL_MODES.find((m) => m.id === activeMode) || CONTROL_MODES[0];

  const lowerMaxAllowed = Math.min(
    50,
    Number((upperThreshold.value - MIN_PRESSURE_GAP).toFixed(1))
  );
  const upperMinAllowed = Math.max(
    1,
    Number((lowerThreshold.value + MIN_PRESSURE_GAP).toFixed(1))
  );

  const overlappingIds =
    viewingMode === 'schedule_rtc'
      ? findOverlappingSlotIds(schedules)
      : new Set<number>();

  const isCurrentViewActive = viewingMode === activeMode;

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col gap-4 max-w-5xl mx-auto w-full py-1">
        {/* 1. Header chọn chế độ cấu hình & kích hoạt vận hành (Tối ưu hoàn hảo cho Mobile & Mở rộng N chế độ) */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-3 sm:px-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Bộ chọn chế độ cấu hình (Dropdown thích ứng, hỗ trợ 2 đến 10+ chế độ không bao giờ vỡ trên điện thoại) */}
            <div className="relative flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-0">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Cơ chế cấu hình:
                </span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModeSelectorOpen((prev) => !prev)}
                  className="w-full sm:max-w-md h-10 px-3.5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-[#0E121B] hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <CurrentViewingIcon
                      className={`w-4 h-4 shrink-0 ${currentViewingMode.color}`}
                    />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {currentViewingMode.name}
                    </span>
                    {isCurrentViewActive && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Đang chạy
                      </span>
                    )}
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isModeSelectorOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu hỗ trợ cuộn khi có nhiều chế độ */}
                {isModeSelectorOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsModeSelectorOpen(false)}
                    />
                    <div className="absolute left-0 top-[calc(100%+6px)] z-40 w-full sm:max-w-md max-h-72 overflow-y-auto bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100">
                      {CONTROL_MODES.map((mode) => {
                        const isViewing = mode.id === viewingMode;
                        const isStationActive = mode.id === activeMode;
                        const Icon = mode.icon;

                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => {
                              setViewingMode(mode.id);
                              setIsModeSelectorOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                              isViewing
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon className={`w-4 h-4 shrink-0 ${mode.color}`} />
                              <span className="truncate">{mode.name}</span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {isStationActive && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Đang chạy
                                </span>
                              )}
                              {isViewing && (
                                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Cụm Kích hoạt & Trạng thái (Tối ưu responsive trên cả mobile và desktop) */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
              {viewingMode === 'schedule_rtc' && overlappingIds.size > 0 && (
                <button
                  type="button"
                  onClick={handleAutoChainSchedules}
                  className="h-10 px-3 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">Nối tiếp khung giờ</span>
                  <span className="xs:hidden">Nối tiếp</span>
                </button>
              )}

              {isCurrentViewActive ? (
                <div className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Đang kích hoạt</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleActivateViewingMode}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all shrink-0"
                  title={`Kích hoạt "${currentViewingMode.name}" làm cơ chế vận hành chính của trạm`}
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Kích hoạt chế độ này</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Vùng cấu hình chi tiết theo chế độ đang xem */}
        {viewingMode === 'input_pressure_priority' ? (
          <div className="grid grid-cols-1 gap-4">
            {/* CARD 1: NGƯỠNG DƯỚI */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Ngưỡng Dưới
                  </span>
                </div>

                <PressureStepperInput
                  min={0}
                  max={lowerMaxAllowed}
                  step={0.5}
                  value={lowerThreshold.value}
                  ariaLabel="Ngưỡng Dưới"
                  accentClass="text-amber-600 dark:text-amber-400"
                  onChange={(val) =>
                    setLowerThreshold((prev) => ({ ...prev, value: val }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Khối Khung Giờ */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3">
                  <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-700/80 shadow-2xs shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setLowerThreshold((prev) => ({
                          ...prev,
                          triggerScope: 'all_time',
                        }))
                      }
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        lowerThreshold.triggerScope === 'all_time'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Toàn Thời Gian
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLowerThreshold((prev) => ({
                          ...prev,
                          triggerScope: 'custom_window',
                        }))
                      }
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        lowerThreshold.triggerScope === 'custom_window'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Khung Giờ
                    </button>
                  </div>

                  {lowerThreshold.triggerScope === 'custom_window' ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                      <TimePicker24h
                        hour={lowerThreshold.startHour}
                        minute={lowerThreshold.startMinute}
                        onChange={(h, m) =>
                          updateThresholdTime('lower', 'start', h, m)
                        }
                      />
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <TimePicker24h
                        hour={lowerThreshold.endHour}
                        minute={lowerThreshold.endMinute}
                        onChange={(h, m) =>
                          updateThresholdTime('lower', 'end', h, m)
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400 pr-2">
                      24/24H
                    </span>
                  )}
                </div>

                {/* Khối Chu Kỳ */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      id="lower-cycle-switch"
                      checked={lowerThreshold.useCycles}
                      onCheckedChange={(checked) =>
                        setLowerThreshold((prev) => ({
                          ...prev,
                          useCycles: checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="lower-cycle-switch"
                      className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
                    >
                      Theo chu kỳ
                    </label>
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
                        {lowerThreshold.useCycles
                          ? `Kiểm tra lặp lại ${lowerThreshold.cycleCount} lần, mỗi lần ${lowerThreshold.cycleMinutes} phút (tổng ${lowerThreshold.cycleCount * lowerThreshold.cycleMinutes} phút) trước khi kích hoạt`
                          : 'Kích hoạt điều áp ngay lập tức khi chạm ngưỡng'}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {lowerThreshold.useCycles ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                      <div className="relative flex items-center h-9 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] shadow-2xs">
                        <select
                          aria-label="Số lần chu kỳ ngưỡng dưới"
                          value={lowerThreshold.cycleCount}
                          onChange={(e) =>
                            setLowerThreshold((prev) => ({
                              ...prev,
                              cycleCount: parseInt(e.target.value, 10),
                            }))
                          }
                          className="h-full pl-3 pr-7 bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer appearance-none"
                        >
                          {CYCLE_COUNTS.map((c) => (
                            <option
                              key={c}
                              value={c}
                              className="bg-white dark:bg-[#141824]"
                            >
                              {c} lần
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                      </div>

                      <span className="text-xs font-bold text-slate-400">×</span>

                      <div className="relative flex items-center h-9 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] shadow-2xs">
                        <select
                          aria-label="Số phút mỗi chu kỳ ngưỡng dưới"
                          value={lowerThreshold.cycleMinutes}
                          onChange={(e) =>
                            setLowerThreshold((prev) => ({
                              ...prev,
                              cycleMinutes: parseInt(e.target.value, 10),
                            }))
                          }
                          className="h-full pl-3 pr-7 bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer appearance-none"
                        >
                          {CYCLE_MINUTES.map((m) => (
                            <option
                              key={m}
                              value={m}
                              className="bg-white dark:bg-[#141824]"
                            >
                              {m} phút
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 pr-2">
                      Kích hoạt ngay
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 2: NGƯỠNG TRÊN */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Ngưỡng Trên
                  </span>
                </div>

                <PressureStepperInput
                  min={upperMinAllowed}
                  max={80}
                  step={0.5}
                  value={upperThreshold.value}
                  ariaLabel="Ngưỡng Trên"
                  accentClass="text-rose-600 dark:text-rose-400"
                  onChange={(val) =>
                    setUpperThreshold((prev) => ({ ...prev, value: val }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Khối Khung Giờ */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3">
                  <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-700/80 shadow-2xs shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setUpperThreshold((prev) => ({
                          ...prev,
                          triggerScope: 'all_time',
                        }))
                      }
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        upperThreshold.triggerScope === 'all_time'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Toàn Thời Gian
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setUpperThreshold((prev) => ({
                          ...prev,
                          triggerScope: 'custom_window',
                        }))
                      }
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        upperThreshold.triggerScope === 'custom_window'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Khung Giờ
                    </button>
                  </div>

                  {upperThreshold.triggerScope === 'custom_window' ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                      <TimePicker24h
                        hour={upperThreshold.startHour}
                        minute={upperThreshold.startMinute}
                        onChange={(h, m) =>
                          updateThresholdTime('upper', 'start', h, m)
                        }
                      />
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <TimePicker24h
                        hour={upperThreshold.endHour}
                        minute={upperThreshold.endMinute}
                        onChange={(h, m) =>
                          updateThresholdTime('upper', 'end', h, m)
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-bold text-slate-400 pr-2">
                      24/24H
                    </span>
                  )}
                </div>

                {/* Khối Chu Kỳ */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      id="upper-cycle-switch"
                      checked={upperThreshold.useCycles}
                      onCheckedChange={(checked) =>
                        setUpperThreshold((prev) => ({
                          ...prev,
                          useCycles: checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="upper-cycle-switch"
                      className="text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
                    >
                      Theo chu kỳ
                    </label>
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
                        {upperThreshold.useCycles
                          ? `Kiểm tra lặp lại ${upperThreshold.cycleCount} lần, mỗi lần ${upperThreshold.cycleMinutes} phút (tổng ${upperThreshold.cycleCount * upperThreshold.cycleMinutes} phút) trước khi kích hoạt`
                          : 'Kích hoạt điều áp ngay lập tức khi chạm ngưỡng'}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {upperThreshold.useCycles ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                      <div className="relative flex items-center h-9 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] shadow-2xs">
                        <select
                          aria-label="Số lần chu kỳ ngưỡng trên"
                          value={upperThreshold.cycleCount}
                          onChange={(e) =>
                            setUpperThreshold((prev) => ({
                              ...prev,
                              cycleCount: parseInt(e.target.value, 10),
                            }))
                          }
                          className="h-full pl-3 pr-7 bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer appearance-none"
                        >
                          {CYCLE_COUNTS.map((c) => (
                            <option
                              key={c}
                              value={c}
                              className="bg-white dark:bg-[#141824]"
                            >
                              {c} lần
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                      </div>

                      <span className="text-xs font-bold text-slate-400">×</span>

                      <div className="relative flex items-center h-9 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] shadow-2xs">
                        <select
                          aria-label="Số phút mỗi chu kỳ ngưỡng trên"
                          value={upperThreshold.cycleMinutes}
                          onChange={(e) =>
                            setUpperThreshold((prev) => ({
                              ...prev,
                              cycleMinutes: parseInt(e.target.value, 10),
                            }))
                          }
                          className="h-full pl-3 pr-7 bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer appearance-none"
                        >
                          {CYCLE_MINUTES.map((m) => (
                            <option
                              key={m}
                              value={m}
                              className="bg-white dark:bg-[#141824]"
                            >
                              {m} phút
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-slate-400 pr-2">
                      Kích hoạt ngay
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CHẾ ĐỘ 2: HẸN GIỜ THEO THỜI GIAN THỰC (5 GIAI ĐOẠN) */
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] divide-y divide-slate-100 dark:divide-slate-800/80 shadow-xs overflow-hidden">
            {schedules.map((slot) => {
              const isOverlapping = slot.enabled && overlappingIds.has(slot.id);
              const switchId = `schedule-switch-${slot.id}`;

              return (
                <div
                  key={slot.id}
                  className={`p-3.5 sm:px-5 sm:py-4 transition-colors ${
                    !slot.enabled
                      ? 'bg-slate-50/60 dark:bg-[#0e121b]/60 opacity-55'
                      : isOverlapping
                      ? 'bg-amber-500/5'
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Cột 1: Tên giai đoạn + Switch */}
                    <div className="flex items-center justify-between sm:justify-start gap-3 sm:w-44 shrink-0">
                      <div className="flex items-center gap-2.5">
                        <Switch
                          id={switchId}
                          checked={slot.enabled}
                          onCheckedChange={(checked) =>
                            updateSchedule(slot.id, { enabled: checked })
                          }
                        />
                        <label
                          htmlFor={switchId}
                          className="text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none"
                        >
                          {slot.label}
                        </label>
                      </div>

                      {isOverlapping && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-amber-500 cursor-help">
                              <AlertTriangle className="w-4 h-4" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Khung giờ đang bị chồng lấn với giai đoạn khác
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    {/* Cột 2: Khung giờ Bắt đầu -> Kết thúc */}
                    <div className="flex items-center gap-2">
                      <TimePicker24h
                        hour={slot.startHour}
                        minute={slot.startMinute}
                        disabled={!slot.enabled}
                        onChange={(h, m) =>
                          updateSchedule(slot.id, { startHour: h, startMinute: m })
                        }
                      />

                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                      <TimePicker24h
                        hour={slot.endHour}
                        minute={slot.endMinute}
                        disabled={!slot.enabled}
                        onChange={(h, m) =>
                          updateSchedule(slot.id, { endHour: h, endMinute: m })
                        }
                      />
                    </div>

                    {/* Cột 3: Mức áp suất (Nút -/+ và ô nhập số, đã bỏ thanh kéo) */}
                    <div className="flex items-center justify-end">
                      <PressureStepperInput
                        min={5}
                        max={50}
                        step={0.5}
                        disabled={!slot.enabled}
                        value={slot.targetPressure}
                        ariaLabel={`Áp suất ${slot.label}`}
                        onChange={(val) =>
                          updateSchedule(slot.id, { targetPressure: val })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
