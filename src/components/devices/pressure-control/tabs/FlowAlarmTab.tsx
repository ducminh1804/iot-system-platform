import React from 'react';
import {
  Waves,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  Moon,
  Server,
  RotateCcw,
  Save,
  Plus,
  Minus,
} from 'lucide-react';
import { toast } from 'sonner';
import { PressureStationConfig, FlowAlarmConfig, ServerAlertProtocol } from '../types';
import { DEFAULT_FLOW_ALARM_CONFIG, formatVNNumber } from '../utils';
import { Switch } from '@/components/ui/switch';

interface FlowAlarmTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
  currentFlowRate?: number;
}

const SERVER_PROTOCOLS: { id: ServerAlertProtocol; label: string }[] = [
  { id: 'mqtt', label: 'MQTT Publish' },
  { id: 'http', label: 'HTTP Webhook' },
  { id: 'scada', label: 'SCADA Center' },
];

export function FlowAlarmTab({
  config,
  onChangeConfig,
  onSave,
  currentFlowRate = 49.6,
}: FlowAlarmTabProps) {
  const alarm: FlowAlarmConfig = config.flowAlarm ?? DEFAULT_FLOW_ALARM_CONFIG;

  const updateAlarm = (patch: Partial<FlowAlarmConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      flowAlarm: {
        ...(prev.flowAlarm ?? DEFAULT_FLOW_ALARM_CONFIG),
        ...patch,
      },
    }));
  };

  const adjustNumeric = (key: keyof FlowAlarmConfig, delta: number, precision: number = 1, min: number = 0) => {
    const curVal = Number(alarm[key] ?? 0);
    const nextVal = Math.max(min, parseFloat((curVal + delta).toFixed(precision)));
    updateAlarm({ [key]: nextVal });
  };

  const handleResetDefaults = () => {
    onChangeConfig((prev) => ({
      ...prev,
      flowAlarm: { ...DEFAULT_FLOW_ALARM_CONFIG },
    }));
    toast.info('Đã khôi phục thông số cảnh báo lưu lượng về mặc định');
  };

  const handleSave = () => {
    if (alarm.highFlowEnabled && alarm.lowFlowEnabled && alarm.highFlowThreshold <= alarm.lowFlowThreshold) {
      toast.error('Ngưỡng lưu lượng cao phải lớn hơn ngưỡng lưu lượng thấp');
      return;
    }
    if (onSave) {
      onSave();
    } else {
      toast.success('Đã lưu cấu hình cảnh báo lưu lượng bất thường');
    }
  };

  // Kiểm tra lưu lượng tức thời có vi phạm ngưỡng nào không
  const isHighFlowAlert = alarm.highFlowEnabled && currentFlowRate >= alarm.highFlowThreshold;
  const isLowFlowAlert = alarm.lowFlowEnabled && currentFlowRate <= alarm.lowFlowThreshold;

  const stepBtn =
    'w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-850 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all';

  return (
    <div className="flex-1 flex flex-col justify-between gap-6 max-w-5xl mx-auto w-full py-1">
      {/* 1. THANH TRẠNG THÁI TELEMETRY & ĐỐI CHIẾU NGƯỠNG HIỆN HÀNH */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-linear-to-b from-slate-50/90 to-white dark:from-[#141824] dark:to-[#0F121A] p-4 sm:p-5 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
              <Waves className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Cảnh báo lưu lượng bất thường
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Giám sát sự cố vỡ ống, kẹt van, dòng chảy ngược và rò rỉ đêm
              </p>
            </div>
          </div>

          {/* Live Flow Badge */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#10141E] shadow-2xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isHighFlowAlert || isLowFlowAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">Lưu lượng thực:</span>
            <span className="font-mono font-black text-sm sm:text-base text-slate-900 dark:text-white">
              {formatVNNumber(currentFlowRate, 1)} m³/h
            </span>
          </div>
        </div>
      </div>

      {/* 2. BENTO GRID 4 CARD CẢNH BÁO SỰ CỐ DÒNG CHẢY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CARD 1: CẢNH BÁO LƯU LƯỢNG CAO / VỠ ỐNG */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-4 transition-all ${
            alarm.highFlowEnabled
              ? 'border-rose-200/90 dark:border-rose-900/40 bg-white dark:bg-[#141824]'
              : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-[#10131D]/40 opacity-70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Lưu lượng cao / Vỡ ống
                </h4>
              </div>
              <Switch
                checked={alarm.highFlowEnabled}
                onCheckedChange={(checked) => updateAlarm({ highFlowEnabled: checked })}
                aria-label="Bật cảnh báo lưu lượng cao"
              />
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Ngưỡng cao (m3/h) */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Ngưỡng kích hoạt</span>
                  <span className="font-mono font-semibold">m³/h</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!alarm.highFlowEnabled}
                    onClick={() => adjustNumeric('highFlowThreshold', -5, 1, 0)}
                    className={stepBtn}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      disabled={!alarm.highFlowEnabled}
                      inputMode="decimal"
                      value={alarm.highFlowThreshold}
                      onChange={(e) => updateAlarm({ highFlowThreshold: parseFloat(e.target.value) || 0 })}
                      className="w-full text-center font-mono font-black text-lg text-rose-600 dark:text-rose-400 bg-transparent outline-none disabled:text-slate-400"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!alarm.highFlowEnabled}
                    onClick={() => adjustNumeric('highFlowThreshold', 5, 1, 0)}
                    className={stepBtn}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thời gian trễ duy trì (giây) & Tự động đóng van */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">Độ trễ (giây)</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={!alarm.highFlowEnabled}
                      onClick={() => adjustNumeric('highFlowDelaySeconds', -5, 0, 5)}
                      className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-xs w-9 text-center text-slate-900 dark:text-white">
                      {alarm.highFlowDelaySeconds}s
                    </span>
                    <button
                      type="button"
                      disabled={!alarm.highFlowEnabled}
                      onClick={() => adjustNumeric('highFlowDelaySeconds', 5, 0, 5)}
                      className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">Tự đóng van</span>
                  <Switch
                    disabled={!alarm.highFlowEnabled}
                    checked={alarm.autoShutoffOnHighFlow}
                    onCheckedChange={(checked) => updateAlarm({ autoShutoffOnHighFlow: checked })}
                    aria-label="Tự động đóng van khi vỡ ống"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: CẢNH BÁO LƯU LƯỢNG THẤP / KẸT VAN */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-4 transition-all ${
            alarm.lowFlowEnabled
              ? 'border-amber-200/90 dark:border-amber-900/40 bg-white dark:bg-[#141824]'
              : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-[#10131D]/40 opacity-70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Lưu lượng thấp / Kẹt van
                </h4>
              </div>
              <Switch
                checked={alarm.lowFlowEnabled}
                onCheckedChange={(checked) => updateAlarm({ lowFlowEnabled: checked })}
                aria-label="Bật cảnh báo lưu lượng thấp"
              />
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Ngưỡng thấp (m3/h) */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Ngưỡng kích hoạt</span>
                  <span className="font-mono font-semibold">m³/h</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!alarm.lowFlowEnabled}
                    onClick={() => adjustNumeric('lowFlowThreshold', -0.5, 1, 0)}
                    className={stepBtn}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      disabled={!alarm.lowFlowEnabled}
                      inputMode="decimal"
                      value={alarm.lowFlowThreshold}
                      onChange={(e) => updateAlarm({ lowFlowThreshold: parseFloat(e.target.value) || 0 })}
                      className="w-full text-center font-mono font-black text-lg text-amber-600 dark:text-amber-400 bg-transparent outline-none disabled:text-slate-400"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!alarm.lowFlowEnabled}
                    onClick={() => adjustNumeric('lowFlowThreshold', 0.5, 1, 0)}
                    className={stepBtn}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thời gian trễ duy trì */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">Độ trễ xác nhận</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={!alarm.lowFlowEnabled}
                    onClick={() => adjustNumeric('lowFlowDelaySeconds', -10, 0, 10)}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-mono font-bold text-xs w-11 text-center text-slate-900 dark:text-white">
                    {alarm.lowFlowDelaySeconds}s
                  </span>
                  <button
                    type="button"
                    disabled={!alarm.lowFlowEnabled}
                    onClick={() => adjustNumeric('lowFlowDelaySeconds', 10, 0, 10)}
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: CẢNH BÁO DÒNG CHẢY NGƯỢC (REVERSE FLOW) */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-4 transition-all ${
            alarm.reverseFlowEnabled
              ? 'border-indigo-200/90 dark:border-indigo-900/40 bg-white dark:bg-[#141824]'
              : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-[#10131D]/40 opacity-70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <ArrowDownLeft className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Dòng chảy ngược
                </h4>
              </div>
              <Switch
                checked={alarm.reverseFlowEnabled}
                onCheckedChange={(checked) => updateAlarm({ reverseFlowEnabled: checked })}
                aria-label="Bật cảnh báo dòng chảy ngược"
              />
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Ngưỡng ngược tối đa</span>
                  <span className="font-mono font-semibold">m³/h</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!alarm.reverseFlowEnabled}
                    onClick={() => adjustNumeric('reverseFlowThreshold', -0.1, 1, 0.1)}
                    className={stepBtn}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      disabled={!alarm.reverseFlowEnabled}
                      inputMode="decimal"
                      value={alarm.reverseFlowThreshold}
                      onChange={(e) => updateAlarm({ reverseFlowThreshold: parseFloat(e.target.value) || 0.1 })}
                      className="w-full text-center font-mono font-black text-lg text-indigo-600 dark:text-indigo-400 bg-transparent outline-none disabled:text-slate-400"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!alarm.reverseFlowEnabled}
                    onClick={() => adjustNumeric('reverseFlowThreshold', 0.1, 1, 0.1)}
                    className={stepBtn}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: CẢNH BÁO RÒ RỈ ĐÊM (MINIMUM NIGHT FLOW - MNF) */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-4 transition-all ${
            alarm.nightLeakageEnabled
              ? 'border-sky-200/90 dark:border-sky-900/40 bg-white dark:bg-[#141824]'
              : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-[#10131D]/40 opacity-70'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Rò rỉ ban đêm (MNF)
                </h4>
              </div>
              <Switch
                checked={alarm.nightLeakageEnabled}
                onCheckedChange={(checked) => updateAlarm({ nightLeakageEnabled: checked })}
                aria-label="Bật cảnh báo rò rỉ đêm"
              />
            </div>

            <div className="mt-4 space-y-3.5">
              {/* Ngưỡng rò rỉ đêm */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-medium text-slate-800 dark:text-slate-200">Ngưỡng đáy đêm</span>
                  <span className="font-mono font-semibold">m³/h</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!alarm.nightLeakageEnabled}
                    onClick={() => adjustNumeric('nightFlowThreshold', -0.5, 1, 0.5)}
                    className={stepBtn}
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="flex-1 h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0C0F17] flex items-center focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      disabled={!alarm.nightLeakageEnabled}
                      inputMode="decimal"
                      value={alarm.nightFlowThreshold}
                      onChange={(e) => updateAlarm({ nightFlowThreshold: parseFloat(e.target.value) || 0 })}
                      className="w-full text-center font-mono font-black text-lg text-sky-600 dark:text-sky-400 bg-transparent outline-none disabled:text-slate-400"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!alarm.nightLeakageEnabled}
                    onClick={() => adjustNumeric('nightFlowThreshold', 0.5, 1, 0)}
                    className={stepBtn}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Khung giờ kiểm tra ban đêm */}
              <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300">Khung giờ đêm</span>
                <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                  0{alarm.nightStartHour}:00 — 0{alarm.nightEndHour}:00
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CARD TRUYỀN TIN CẢNH BÁO VỀ SERVER */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Truyền tin cảnh báo về Server
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Gửi tự động</span>
            <Switch
              checked={alarm.notifyServer}
              onCheckedChange={(checked) => updateAlarm({ notifyServer: checked })}
              aria-label="Gửi cảnh báo lưu lượng về máy chủ"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Giao thức */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-300">Giao thức</span>
            <div className="flex items-center gap-1">
              {SERVER_PROTOCOLS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  disabled={!alarm.notifyServer}
                  onClick={() => updateAlarm({ serverProtocol: p.id })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-40 ${
                    alarm.serverProtocol === p.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {p.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Chu kỳ nhắc lại */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10131C] p-3 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-300">Chu kỳ nhắc lại</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!alarm.notifyServer}
                onClick={() => adjustNumeric('alertRepeatMinutes', -5, 0, 5)}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-mono font-bold text-xs w-12 text-center text-slate-900 dark:text-white">
                {alarm.alertRepeatMinutes} phút
              </span>
              <button
                type="button"
                disabled={!alarm.notifyServer}
                onClick={() => adjustNumeric('alertRepeatMinutes', 5, 0, 5)}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-100 disabled:opacity-30"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACTION FOOTER BAR */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="w-full sm:w-auto h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Khôi phục mặc định</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Lưu cảnh báo lưu lượng</span>
        </button>
      </div>
    </div>
  );
}
