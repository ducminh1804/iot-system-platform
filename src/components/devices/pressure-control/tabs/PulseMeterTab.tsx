import React from 'react';
import {
  Droplets,
  Gauge,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus,
  Radio,
} from 'lucide-react';
import { PressureStationConfig, PulseMeterConfig } from '../types';
import { DEFAULT_PULSE_METER_CONFIG, formatVNNumber } from '../utils';

interface PulseMeterTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
  currentFlowRate?: number;
}

const PULSE_PRESETS = [1, 10, 100, 1000];

type PulseNumericKey = 'pulsesPerUnit' | 'flowRate' | 'netFlowTotal' | 'forwardFlow' | 'reserveFlow';

export function PulseMeterTab({
  config,
  onChangeConfig,
  currentFlowRate,
}: PulseMeterTabProps) {
  const meter: PulseMeterConfig = config.pulseMeter ?? DEFAULT_PULSE_METER_CONFIG;

  const updateField = (key: PulseNumericKey, value: number) => {
    const clean = Math.max(0, isNaN(value) ? 0 : Number(value.toFixed(2)));
    onChangeConfig((prev) => ({
      ...prev,
      pulseMeter: {
        ...(prev.pulseMeter ?? DEFAULT_PULSE_METER_CONFIG),
        [key]: clean,
      },
    }));
  };

  const handleInputChange = (key: PulseNumericKey, valStr: string) => {
    if (valStr === '') {
      updateField(key, 0);
      return;
    }
    const parsed = parseFloat(valStr);
    updateField(key, parsed);
  };

  const adjustField = (key: PulseNumericKey, delta: number, precision: number = 1) => {
    const current = Number(meter[key] ?? 0);
    const next = Math.max(0, parseFloat((current + delta).toFixed(precision)));
    updateField(key, next);
  };

  return (
    <div className="flex-1 flex flex-col justify-between gap-6 max-w-5xl mx-auto w-full py-1">
      {/* 1. Industrial Visual Schematic: Sơ đồ trực quan đồng hồ xung & dòng chảy */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-linear-to-b from-slate-50/90 to-white dark:from-[#141824] dark:to-[#0F121A] p-4 sm:p-5 shadow-xs overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800/80">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Sơ đồ đồng hồ đo lưu lượng xung
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                5 thông số cấu hình cảm biến & thanh ghi thể tích
              </p>
            </div>
          </div>

          {/* Quick telemetry badge if currentFlowRate is available */}
          {currentFlowRate !== undefined && (
            <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 dark:text-slate-400">Lưu lượng thực tế:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {formatVNNumber(currentFlowRate, 1)} m³/h
              </span>
            </div>
          )}
        </div>

        {/* Trực quan đường ống & đồng hồ xung */}
        <div className="mt-4 pt-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Box A: Xung cảm biến */}
          <div className="rounded-xl bg-white dark:bg-[#10141D] border border-slate-200/80 dark:border-slate-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Tỷ lệ phát xung
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono font-extrabold text-sm sm:text-base text-blue-600 dark:text-blue-400">
                {meter.pulsesPerUnit}
              </span>
              <span className="text-[11px] font-mono text-slate-400 ml-1">p/m³</span>
            </div>
          </div>

          {/* Box B: Lưu lượng cài đặt */}
          <div className="rounded-xl bg-white dark:bg-[#10141D] border border-slate-200/80 dark:border-slate-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Lưu lượng định mức
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono font-extrabold text-sm sm:text-base text-sky-600 dark:text-sky-400">
                {formatVNNumber(meter.flowRate, 1)}
              </span>
              <span className="text-[11px] font-mono text-slate-400 ml-1">m³/h</span>
            </div>
          </div>

          {/* Box C: Thể tích ròng (Net Total) */}
          <div className="rounded-xl bg-white dark:bg-[#10141D] border border-slate-200/80 dark:border-slate-800 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Tổng thể tích ròng
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono font-extrabold text-sm sm:text-base text-indigo-600 dark:text-indigo-400">
                {formatVNNumber(meter.netFlowTotal, 1)}
              </span>
              <span className="text-[11px] font-mono text-slate-400 ml-1">m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bento Grid: 2 Khối cấu hình chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* KHỐI 1: Cấu hình Cảm biến & Lưu lượng tức thời */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Cảm biến & Tốc độ dòng chảy
              </h4>
            </div>

            <div className="mt-4 space-y-4">
              {/* Field 1: Pluses per unit volume */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Pluses per unit volume
                  </span>
                  <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-500/20">
                    p/m³
                  </span>
                </div>

                {/* Input + Stepper Bar */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustField('pulsesPerUnit', -1, 0)}
                    disabled={meter.pulsesPerUnit <= 1}
                    aria-label="Giảm 1 xung"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 cursor-pointer transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      inputMode="numeric"
                      value={meter.pulsesPerUnit}
                      onChange={(e) => handleInputChange('pulsesPerUnit', e.target.value)}
                      className="w-full text-center font-mono font-extrabold text-base text-slate-900 dark:text-white bg-transparent outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => adjustField('pulsesPerUnit', 1, 0)}
                    aria-label="Tăng 1 xung"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Presets: 1, 10, 100, 1000 p/m³ */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 shrink-0 mr-1">Chuẩn:</span>
                  <div className="grid grid-cols-4 gap-1.5 flex-1">
                    {PULSE_PRESETS.map((preset) => {
                      const isActive = meter.pulsesPerUnit === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => updateField('pulsesPerUnit', preset)}
                          className={`py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                          }`}
                        >
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Field 2: Flow Rate */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Flow Rate
                  </span>
                  <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-500/20">
                    m³/h
                  </span>
                </div>

                {/* Input + Stepper Bar */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustField('flowRate', -0.5, 1)}
                    disabled={meter.flowRate <= 0}
                    aria-label="Giảm 0.5 m³/h"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 cursor-pointer transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      inputMode="decimal"
                      value={meter.flowRate}
                      onChange={(e) => handleInputChange('flowRate', e.target.value)}
                      className="w-full text-center font-mono font-extrabold text-base text-slate-900 dark:text-white bg-transparent outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => adjustField('flowRate', 0.5, 1)}
                    aria-label="Tăng 0.5 m³/h"
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KHỐI 2: Bộ đếm thể tích tích lũy (Totalizer Registers) */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Bộ đếm thể tích tích lũy
              </h4>
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Field 3: Net Flow Total (Tổng thực) */}
              <div className="rounded-xl border border-indigo-200/70 dark:border-indigo-900/40 bg-indigo-50/20 dark:bg-indigo-950/10 p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Net Flow Total
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    m³
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adjustField('netFlowTotal', -10, 1)}
                    disabled={meter.netFlowTotal <= 0}
                    aria-label="Giảm 10 m³"
                    className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 cursor-pointer transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex-1 h-10 px-3 rounded-xl border border-indigo-300 dark:border-indigo-700/60 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      inputMode="decimal"
                      value={meter.netFlowTotal}
                      onChange={(e) => handleInputChange('netFlowTotal', e.target.value)}
                      className="w-full text-center font-mono font-black text-base sm:text-lg text-indigo-600 dark:text-indigo-400 bg-transparent outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => adjustField('netFlowTotal', 10, 1)}
                    aria-label="Tăng 10 m³"
                    className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lưới 2 chiều: Forward Flow & Reserve Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Field 4: Forward Flow */}
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ArrowUpRight className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        Forward Flow
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      m³
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustField('forwardFlow', -1, 1)}
                      disabled={meter.forwardFlow <= 0}
                      aria-label="Giảm 1 m³ chiều thuận"
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <div className="flex-1 h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        inputMode="decimal"
                        value={meter.forwardFlow}
                        onChange={(e) => handleInputChange('forwardFlow', e.target.value)}
                        className="w-full text-center font-mono font-bold text-sm text-slate-900 dark:text-white bg-transparent outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => adjustField('forwardFlow', 1, 1)}
                      aria-label="Tăng 1 m³ chiều thuận"
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Field 5: Reserve Flow */}
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ArrowDownLeft className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        Reserve Flow
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                      m³
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustField('reserveFlow', -1, 1)}
                      disabled={meter.reserveFlow <= 0}
                      aria-label="Giảm 1 m³ chiều nghịch"
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <div className="flex-1 h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500/20">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        inputMode="decimal"
                        value={meter.reserveFlow}
                        onChange={(e) => handleInputChange('reserveFlow', e.target.value)}
                        className="w-full text-center font-mono font-bold text-sm text-slate-900 dark:text-white bg-transparent outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => adjustField('reserveFlow', 1, 1)}
                      aria-label="Tăng 1 m³ chiều nghịch"
                      className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
