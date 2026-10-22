import React, { useState } from 'react';
import {
  ChevronDown,
  Check,
  Clock,
  Gauge,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { PressureStationConfig } from '../types';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export interface ControlModeItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const CONTROL_MODES: ControlModeItem[] = [
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
];

interface ScheduleSlot {
  id: number;
  label: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  targetPressure: number;
  enabled: boolean;
}

const INITIAL_SCHEDULES: ScheduleSlot[] = [
  {
    id: 1,
    label: 'Giai đoạn 1',
    startHour: 5,
    startMinute: 0,
    endHour: 8,
    endMinute: 30,
    targetPressure: 28.5,
    enabled: true,
  },
  {
    id: 2,
    label: 'Giai đoạn 2',
    startHour: 8,
    startMinute: 30,
    endHour: 11,
    endMinute: 30,
    targetPressure: 24.0,
    enabled: true,
  },
  {
    id: 3,
    label: 'Giai đoạn 3',
    startHour: 11,
    startMinute: 30,
    endHour: 13,
    endMinute: 30,
    targetPressure: 22.0,
    enabled: true,
  },
  {
    id: 4,
    label: 'Giai đoạn 4',
    startHour: 17,
    startMinute: 0,
    endHour: 21,
    endMinute: 0,
    targetPressure: 32.0,
    enabled: true,
  },
  {
    id: 5,
    label: 'Giai đoạn 5',
    startHour: 22,
    startMinute: 0,
    endHour: 4,
    endMinute: 30,
    targetPressure: 18.0,
    enabled: true,
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

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

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141824] hover:bg-slate-50 dark:hover:bg-slate-800/80 font-mono text-xs font-bold text-slate-800 dark:text-slate-200 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
      >
        <Clock className="w-3.5 h-3.5 text-blue-500" />
        <span>
          {pad(hour)}:{pad(minute)}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-[calc(100%+6px)] z-40 bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3.5 flex flex-col gap-3 min-w-[210px] animate-in fade-in zoom-in-95 duration-100">
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
                <div className="h-40 w-full overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 p-1 space-y-1">
                  {Array.from({ length: 24 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onChange(i, minute)}
                      className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all ${
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
                <div className="h-40 w-full overflow-y-auto rounded-xl border border-slate-100 dark:border-slate-800 p-1 space-y-1">
                  {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onChange(hour, m)}
                      className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all ${
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

const CYCLE_COUNTS = Array.from({ length: 10 }, (_, i) => i + 1);
const CYCLE_MINUTES = [5, 10, 15, 20, 25, 30, 45, 60];

interface ThresholdConfig {
  value: number;
  triggerScope: 'all_time' | 'custom_window';
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  useCycles: boolean;
  cycleCount: number;
  cycleMinutes: number;
}

interface ControlMechanismTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
}

export function ControlMechanismTab({
  config: _config,
  onChangeConfig: _onChangeConfig,
}: ControlMechanismTabProps) {
  const [selectedId, setSelectedId] = useState<string>('input_pressure_priority');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<ScheduleSlot[]>(INITIAL_SCHEDULES);

  const [lowerThreshold, setLowerThreshold] = useState<ThresholdConfig>({
    value: 15.0,
    triggerScope: 'all_time',
    startHour: 6,
    startMinute: 0,
    endHour: 18,
    endMinute: 0,
    useCycles: true,
    cycleCount: 3,
    cycleMinutes: 5,
  });

  const [upperThreshold, setUpperThreshold] = useState<ThresholdConfig>({
    value: 45.0,
    triggerScope: 'all_time',
    startHour: 18,
    startMinute: 0,
    endHour: 23,
    endMinute: 0,
    useCycles: true,
    cycleCount: 3,
    cycleMinutes: 5,
  });

  const currentMode =
    CONTROL_MODES.find((m) => m.id === selectedId) || CONTROL_MODES[0];
  const CurrentIcon = currentMode.icon;

  const updateSchedule = (id: number, patch: Partial<ScheduleSlot>) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Selector Dropdown Header */}
      <div className="relative z-20">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Cơ chế kích hoạt:
          </label>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex-1 max-w-sm h-9 px-3.5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141822] hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2 truncate">
              <CurrentIcon className={`w-4 h-4 shrink-0 ${currentMode.color}`} />
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {currentMode.name}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute left-0 sm:left-[118px] top-[calc(100%+6px)] w-full max-w-sm bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 p-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
              <div className="space-y-0.5">
                {CONTROL_MODES.map((mode) => {
                  const isSelected = mode.id === selectedId;
                  const Icon = mode.icon;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(mode.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${mode.color}`} />
                        <span className="truncate">{mode.name}</span>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c0f17] p-3 sm:p-4">
        {/* CHẾ ĐỘ 1: HẸN GIỜ THEO THỜI GIAN THỰC */}
        {selectedId === 'schedule_rtc' && (
          <div className="space-y-3">
            {schedules.map((slot) => (
              <div
                key={slot.id}
                className={`rounded-2xl border transition-all duration-200 p-3 sm:p-4 ${
                  slot.enabled
                    ? 'bg-white dark:bg-[#141824] border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700'
                    : 'bg-slate-100/40 dark:bg-[#10141e]/50 border-slate-200/50 dark:border-slate-800/40 opacity-50'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center justify-between lg:justify-start gap-3 lg:w-40 shrink-0">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-wide">
                      {slot.label}
                    </span>
                    <Switch
                      checked={slot.enabled}
                      onCheckedChange={(checked) =>
                        updateSchedule(slot.id, { enabled: checked })
                      }
                    />
                  </div>

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

                  <div className="flex items-center gap-3 flex-1 max-w-sm">
                    <Slider
                      disabled={!slot.enabled}
                      value={[slot.targetPressure]}
                      min={5}
                      max={50}
                      step={0.5}
                      onValueChange={([val]) =>
                        updateSchedule(slot.id, { targetPressure: val })
                      }
                      className="cursor-pointer"
                    />

                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="60"
                        disabled={!slot.enabled}
                        value={slot.targetPressure}
                        onChange={(e) =>
                          updateSchedule(slot.id, {
                            targetPressure: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-16 h-8 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0B0E14] text-xs font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500/40 disabled:opacity-40"
                      />
                      <span className="text-[11px] font-mono text-slate-400">
                        mH₂O
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CHẾ ĐỘ 2: ƯU TIÊN ÁP SUẤT ĐẦU VÀO */}
        {selectedId === 'input_pressure_priority' && (
          <div className="space-y-3.5">
            {/* CARD 1: CẤU HÌNH NGƯỠNG DƯỚI */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 shadow-xs space-y-3.5">
              {/* Row 1: Tiêu đề + Giá trị ngưỡng */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Ngưỡng Dưới
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:max-w-xs">
                  <Slider
                    value={[lowerThreshold.value]}
                    min={0}
                    max={50}
                    step={0.5}
                    onValueChange={([val]) =>
                      setLowerThreshold((prev) => ({ ...prev, value: val }))
                    }
                    className="cursor-pointer"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={upperThreshold.value - 1}
                      value={lowerThreshold.value}
                      onChange={(e) =>
                        setLowerThreshold((prev) => ({
                          ...prev,
                          value: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-16 h-8 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0c0f17] text-xs font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
                    />
                    <span className="text-xs font-mono font-medium text-slate-400">
                      mH₂O
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: 2 Khối Điều Kiện Kích Hoạt Thiết Kế Chuẩn UI/UX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Khối Khung Giờ */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3">
                  <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-700/80 shadow-2xs shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setLowerThreshold((prev) => ({ ...prev, triggerScope: 'all_time' }))
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
                        setLowerThreshold((prev) => ({ ...prev, triggerScope: 'custom_window' }))
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
                          setLowerThreshold((prev) => ({
                            ...prev,
                            startHour: h,
                            startMinute: m,
                          }))
                        }
                      />
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <TimePicker24h
                        hour={lowerThreshold.endHour}
                        minute={lowerThreshold.endMinute}
                        onChange={(h, m) =>
                          setLowerThreshold((prev) => ({
                            ...prev,
                            endHour: h,
                            endMinute: m,
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-medium text-slate-400 pr-2">
                      24/24H
                    </span>
                  )}
                </div>

                {/* Khối Chu Kỳ */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={lowerThreshold.useCycles}
                      onCheckedChange={(checked) =>
                        setLowerThreshold((prev) => ({ ...prev, useCycles: checked }))
                      }
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Theo chu kỳ
                    </span>
                  </div>

                  {lowerThreshold.useCycles ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                      <div className="flex items-center h-8 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] px-2 shadow-2xs">
                        <select
                          value={lowerThreshold.cycleCount}
                          onChange={(e) =>
                            setLowerThreshold((prev) => ({
                              ...prev,
                              cycleCount: parseInt(e.target.value, 10),
                            }))
                          }
                          className="bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-1"
                        >
                          {CYCLE_COUNTS.map((c) => (
                            <option key={c} value={c} className="bg-white dark:bg-[#141824]">
                              {c}
                            </option>
                          ))}
                        </select>
                        <span className="text-[11px] text-slate-400 font-medium select-none">
                          lần
                        </span>
                      </div>

                      <span className="text-xs font-bold text-slate-400">×</span>

                      <div className="flex items-center h-8 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] px-2 shadow-2xs">
                        <select
                          value={lowerThreshold.cycleMinutes}
                          onChange={(e) =>
                            setLowerThreshold((prev) => ({
                              ...prev,
                              cycleMinutes: parseInt(e.target.value, 10),
                            }))
                          }
                          className="bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-1"
                        >
                          {CYCLE_MINUTES.map((m) => (
                            <option key={m} value={m} className="bg-white dark:bg-[#141824]">
                              {m}
                            </option>
                          ))}
                        </select>
                        <span className="text-[11px] text-slate-400 font-medium select-none">
                          phút
                        </span>
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

            {/* CARD 2: CẤU HÌNH NGƯỠNG TRÊN */}
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 shadow-xs space-y-3.5">
              {/* Row 1: Tiêu đề + Giá trị ngưỡng */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 dark:bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Ngưỡng Trên
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:max-w-xs">
                  <Slider
                    value={[upperThreshold.value]}
                    min={20}
                    max={80}
                    step={0.5}
                    onValueChange={([val]) =>
                      setUpperThreshold((prev) => ({ ...prev, value: val }))
                    }
                    className="cursor-pointer"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <input
                      type="number"
                      step="0.5"
                      min={lowerThreshold.value + 1}
                      max={80}
                      value={upperThreshold.value}
                      onChange={(e) =>
                        setUpperThreshold((prev) => ({
                          ...prev,
                          value: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-16 h-8 text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0c0f17] text-xs font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-500/40"
                    />
                    <span className="text-xs font-mono font-medium text-slate-400">
                      mH₂O
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: 2 Khối Điều Kiện Kích Hoạt Thiết Kế Chuẩn UI/UX */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Khối Khung Giờ */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3">
                  <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-[#141824] border border-slate-200 dark:border-slate-700/80 shadow-2xs shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setUpperThreshold((prev) => ({ ...prev, triggerScope: 'all_time' }))
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
                        setUpperThreshold((prev) => ({ ...prev, triggerScope: 'custom_window' }))
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
                          setUpperThreshold((prev) => ({
                            ...prev,
                            startHour: h,
                            startMinute: m,
                          }))
                        }
                      />
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      <TimePicker24h
                        hour={upperThreshold.endHour}
                        minute={upperThreshold.endMinute}
                        onChange={(h, m) =>
                          setUpperThreshold((prev) => ({
                            ...prev,
                            endHour: h,
                            endMinute: m,
                          }))
                        }
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-medium text-slate-400 pr-2">
                      24/24H
                    </span>
                  )}
                </div>

                {/* Khối Chu Kỳ */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 gap-3">
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={upperThreshold.useCycles}
                      onCheckedChange={(checked) =>
                        setUpperThreshold((prev) => ({ ...prev, useCycles: checked }))
                      }
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Theo chu kỳ
                    </span>
                  </div>

                  {upperThreshold.useCycles ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
                      <div className="flex items-center h-8 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] px-2 shadow-2xs">
                        <select
                          value={upperThreshold.cycleCount}
                          onChange={(e) =>
                            setUpperThreshold((prev) => ({
                              ...prev,
                              cycleCount: parseInt(e.target.value, 10),
                            }))
                          }
                          className="bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-1"
                        >
                          {CYCLE_COUNTS.map((c) => (
                            <option key={c} value={c} className="bg-white dark:bg-[#141824]">
                              {c}
                            </option>
                          ))}
                        </select>
                        <span className="text-[11px] text-slate-400 font-medium select-none">
                          lần
                        </span>
                      </div>

                      <span className="text-xs font-bold text-slate-400">×</span>

                      <div className="flex items-center h-8 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#141824] px-2 shadow-2xs">
                        <select
                          value={upperThreshold.cycleMinutes}
                          onChange={(e) =>
                            setUpperThreshold((prev) => ({
                              ...prev,
                              cycleMinutes: parseInt(e.target.value, 10),
                            }))
                          }
                          className="bg-transparent font-mono text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer pr-1"
                        >
                          {CYCLE_MINUTES.map((m) => (
                            <option key={m} value={m} className="bg-white dark:bg-[#141824]">
                              {m}
                            </option>
                          ))}
                        </select>
                        <span className="text-[11px] text-slate-400 font-medium select-none">
                          phút
                        </span>
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
        )}
      </div>
    </div>
  );
}
