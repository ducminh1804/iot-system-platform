import React, { useState } from 'react';
import {
  RotateCcw,
  Save,
  Plus,
  Minus,
  Calendar,
  AlertOctagon,
  RefreshCw,
  Gauge,
  Droplets,
  Activity,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  PressureStationConfig,
  AnomalyAlarmConfig,
  StationMetaInfo,
} from '../types';
import { DEFAULT_ANOMALY_ALARM_CONFIG } from '../utils';
import { Switch } from '@/components/ui/switch';

interface AnomalyAlarmTabProps {
  config: PressureStationConfig;
  stationMeta?: StationMetaInfo;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
  currentFlowRate?: number;
  currentPressureIn?: number;
}

const WEEK_DAYS = [
  { id: 1, label: 'Thứ 2' },
  { id: 2, label: 'Thứ 3' },
  { id: 3, label: 'Thứ 4' },
  { id: 4, label: 'Thứ 5' },
  { id: 5, label: 'Thứ 6' },
  { id: 6, label: 'Thứ 7' },
  { id: 0, label: 'Chủ nhật' },
];

export function AnomalyAlarmTab({
  config,
  stationMeta = { name: 'Trạm áp lực', stationId: '1015', version: 'v1' },
  onChangeConfig,
  onSave,
}: AnomalyAlarmTabProps) {
  const anomaly: AnomalyAlarmConfig =
    config.anomalyAlarm ?? DEFAULT_ANOMALY_ALARM_CONFIG;

  const [showGlobalResetConfirm, setShowGlobalResetConfirm] = useState(false);

  const updateAnomaly = (patch: Partial<AnomalyAlarmConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      anomalyAlarm: {
        ...(prev.anomalyAlarm ?? DEFAULT_ANOMALY_ALARM_CONFIG),
        ...patch,
      },
    }));
  };

  const adjustPercent = (
    key: 'flowDeviationPercent' | 'pressureDeviationPercent',
    delta: number,
    min: number = 5,
    max: number = 100
  ) => {
    const curVal = anomaly[key] ?? 20;
    const nextVal = Math.max(min, Math.min(max, curVal + delta));
    updateAnomaly({ [key]: nextVal });
  };

  const toggleIgnoreDay = (dayId: number) => {
    const current = anomaly.ignoreDays ?? [];
    const exists = current.includes(dayId);
    const updated = exists
      ? current.filter((d) => d !== dayId)
      : [...current, dayId];
    updateAnomaly({ ignoreDays: updated });
  };

  // Reset dữ liệu cơ sở cho trạm này -> tính lại từ ngày 1/7
  const handleResetCurrentDevice = () => {
    const nowStr = new Date().toLocaleString('vi-VN');
    updateAnomaly({
      learningDaysCompleted: 0,
      lastResetTime: nowStr,
    });
    toast.success(`Đã reset dữ liệu trạm ${stationMeta.stationId}. Bắt đầu tính lại 7 ngày.`);
  };

  // Reset toàn bộ hệ thống
  const handleConfirmGlobalReset = () => {
    const nowStr = new Date().toLocaleString('vi-VN');
    updateAnomaly({
      learningDaysCompleted: 0,
      lastResetTime: nowStr,
    });
    setShowGlobalResetConfirm(false);
    toast.error('Đã reset toàn bộ hệ thống thiết bị.');
  };

  const handleResetDefaults = () => {
    onChangeConfig((prev) => ({
      ...prev,
      anomalyAlarm: { ...DEFAULT_ANOMALY_ALARM_CONFIG },
    }));
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  const handleSave = () => {
    if (onSave) onSave();
    else toast.success('Đã lưu cấu hình');
  };

  const isLearning = anomaly.learningDaysCompleted < anomaly.learningDaysRequired;
  const progressPercent = Math.min(
    100,
    Math.round((anomaly.learningDaysCompleted / anomaly.learningDaysRequired) * 100)
  );

  const stepBtn =
    'w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all';

  return (
    <div className="flex-1 flex flex-col justify-between gap-5 max-w-5xl mx-auto w-full py-1">
      {/* 1. KHỐI ĐIỀU KHIỂN & CHU KỲ 7 NGÀY */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Cảnh báo thất thường
            </h3>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Toàn hệ thống
              </span>
              <Switch
                checked={anomaly.globalApply}
                onCheckedChange={(c) => updateAnomaly({ globalApply: c })}
                aria-label="Áp dụng toàn hệ thống"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Kích hoạt
              </span>
              <Switch
                checked={anomaly.enabled}
                onCheckedChange={(c) => updateAnomaly({ enabled: c })}
                aria-label="Bật cảnh báo"
              />
            </div>
          </div>
        </div>

        {/* TIẾN TRÌNH 7 NGÀY */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isLearning ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {isLearning
                ? `Thu thập cơ sở: Ngày ${anomaly.learningDaysCompleted}/7`
                : 'Đang đối chiếu tuần trước'}
            </span>
          </div>

          {/* 7 Ô Ngày tối giản */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const dayNum = i + 1;
              const isCompleted = dayNum <= anomaly.learningDaysCompleted;
              const isCurrent = dayNum === anomaly.learningDaysCompleted + 1 && isLearning;

              return (
                <div
                  key={dayNum}
                  className={`h-11 rounded-xl border flex items-center justify-center font-mono font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500/40 text-blue-600 dark:text-blue-400'
                      : isCurrent
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/60 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/20'
                      : 'bg-slate-50/50 dark:bg-[#10141D] border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : dayNum}
                </div>
              );
            })}
          </div>

          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. CẤU HÌNH % SAI LỆCH */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sai lệch lưu lượng */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Sai lệch lưu lượng
            </h4>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={!anomaly.enabled}
              onClick={() => adjustPercent('flowDeviationPercent', -5)}
              aria-label="Giảm 5%"
              className={stepBtn}
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0C0F17] flex items-center justify-center focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <span className="font-mono font-bold text-slate-400 pr-1 select-none">±</span>
              <input
                type="number"
                step="1"
                min="5"
                max="100"
                disabled={!anomaly.enabled}
                inputMode="numeric"
                value={anomaly.flowDeviationPercent}
                onChange={(e) =>
                  updateAnomaly({
                    flowDeviationPercent: Math.max(5, Math.min(100, parseInt(e.target.value) || 5)),
                  })
                }
                className="w-20 text-center font-mono font-black text-xl text-slate-900 dark:text-white bg-transparent outline-none disabled:text-slate-400"
              />
              <span className="font-mono font-bold text-slate-400 pl-1 select-none">%</span>
            </div>

            <button
              type="button"
              disabled={!anomaly.enabled}
              onClick={() => adjustPercent('flowDeviationPercent', 5)}
              aria-label="Tăng 5%"
              className={stepBtn}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sai lệch áp suất */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Gauge className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Sai lệch áp suất
            </h4>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              disabled={!anomaly.enabled}
              onClick={() => adjustPercent('pressureDeviationPercent', -5)}
              aria-label="Giảm 5%"
              className={stepBtn}
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex-1 h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0C0F17] flex items-center justify-center focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <span className="font-mono font-bold text-slate-400 pr-1 select-none">±</span>
              <input
                type="number"
                step="1"
                min="5"
                max="100"
                disabled={!anomaly.enabled}
                inputMode="numeric"
                value={anomaly.pressureDeviationPercent}
                onChange={(e) =>
                  updateAnomaly({
                    pressureDeviationPercent: Math.max(5, Math.min(100, parseInt(e.target.value) || 5)),
                  })
                }
                className="w-20 text-center font-mono font-black text-xl text-slate-900 dark:text-white bg-transparent outline-none disabled:text-slate-400"
              />
              <span className="font-mono font-bold text-slate-400 pl-1 select-none">%</span>
            </div>

            <button
              type="button"
              disabled={!anomaly.enabled}
              onClick={() => adjustPercent('pressureDeviationPercent', 5)}
              aria-label="Tăng 5%"
              className={stepBtn}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. LẬP LỊCH: NGÀY BỎ QUA */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Ngày không quan sát
          </h4>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-7 gap-2">
          {WEEK_DAYS.map((d) => {
            const isIgnored = anomaly.ignoreDays.includes(d.id);

            return (
              <button
                key={d.id}
                type="button"
                disabled={!anomaly.enabled}
                onClick={() => toggleIgnoreDay(d.id)}
                className={`h-11 rounded-xl text-xs font-mono font-bold flex items-center justify-center border transition-all cursor-pointer disabled:opacity-30 ${
                  isIgnored
                    ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11141E] text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. RESET DỮ LIỆU */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <RefreshCw className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Reset dữ liệu cơ sở
          </h4>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Reset trạm này */}
          <button
            type="button"
            onClick={handleResetCurrentDevice}
            className="h-11 px-4 rounded-xl border border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100/60 dark:hover:bg-blue-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset trạm {stationMeta.stationId}</span>
          </button>

          {/* Reset toàn hệ thống */}
          {!showGlobalResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowGlobalResetConfirm(true)}
              className="h-11 px-4 rounded-xl border border-rose-300/80 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Reset toàn hệ thống</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConfirmGlobalReset}
                className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Xác nhận reset tất cả
              </button>
              <button
                type="button"
                onClick={() => setShowGlobalResetConfirm(false)}
                className="px-4 h-11 rounded-xl border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. NÚT LƯU & MẶC ĐỊNH */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleResetDefaults}
          className="w-full sm:w-auto h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Mặc định</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Lưu cấu hình</span>
        </button>
      </div>
    </div>
  );
}
