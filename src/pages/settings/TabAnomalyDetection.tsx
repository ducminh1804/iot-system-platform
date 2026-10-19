import React, { useState } from 'react';
import {
  Edit2,
  RotateCcw,
  Calendar,
  Brain,
  AlertTriangle,
  Sparkles,
  Check,
} from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const DAYS_OF_WEEK = [
  { id: 1, label: 'Thứ 2', short: 'T2' },
  { id: 2, label: 'Thứ 3', short: 'T3' },
  { id: 3, label: 'Thứ 4', short: 'T4' },
  { id: 4, label: 'Thứ 5', short: 'T5' },
  { id: 5, label: 'Thứ 6', short: 'T6' },
  { id: 6, label: 'Thứ 7', short: 'T7', isWeekend: true },
  { id: 0, label: 'Chủ Nhật', short: 'CN', isWeekend: true },
];

export const TabAnomalyDetection: React.FC = () => {
  const {
    masterAnomalyEnabled,
    setMasterAnomalyEnabled,
    anomalyDeviationPercent,
    anomalyPressureDeviationPercent,
    setAnomalyDeviationPercent,
    nonMonitoringDays,
    toggleNonMonitoringDay,
    device1015LearningDay,
    device1015TotalSamples,
    device1015LastReset,
    resetDevice1015Baseline,
    resetGlobalSystem,
  } = useSettingsStore();

  const [isEditingDeviation, setIsEditingDeviation] = useState(false);
  const [flowPct, setFlowPct] = useState(anomalyDeviationPercent);
  const [pressPct, setPressPct] = useState(anomalyPressureDeviationPercent);
  const [showDeviceResetModal, setShowDeviceResetModal] = useState(false);
  const [showGlobalResetModal, setShowGlobalResetModal] = useState(false);

  const handleSaveDeviation = () => {
    setAnomalyDeviationPercent(flowPct, pressPct);
    setIsEditingDeviation(false);
    toast.success('Đã lưu ngưỡng độ lệch bất thường!');
  };

  const handlePresetExclusion = (preset: 'all_week' | 'skip_weekend' | 'skip_sunday') => {
    if (preset === 'all_week') {
      // Clear all exclusions
      nonMonitoringDays.forEach((d) => toggleNonMonitoringDay(d));
      toast.success('Đã đặt: Giám sát toàn bộ 7 ngày');
    } else if (preset === 'skip_weekend') {
      // Exclude Saturday and Sunday
      [0, 1, 2, 3, 4, 5, 6].forEach((d) => {
        const shouldBeExcluded = d === 6 || d === 0;
        const isCurrentlyExcluded = nonMonitoringDays.includes(d);
        if (shouldBeExcluded !== isCurrentlyExcluded) {
          toggleNonMonitoringDay(d);
        }
      });
      toast.success('Đã đặt: Bỏ qua Thứ 7 & Chủ Nhật');
    } else if (preset === 'skip_sunday') {
      [0, 1, 2, 3, 4, 5, 6].forEach((d) => {
        const shouldBeExcluded = d === 0;
        const isCurrentlyExcluded = nonMonitoringDays.includes(d);
        if (shouldBeExcluded !== isCurrentlyExcluded) {
          toggleNonMonitoringDay(d);
        }
      });
      toast.success('Đã đặt: Bỏ qua Chủ Nhật');
    }
  };

  const progressPercent = Math.min(100, Math.round((device1015LearningDay / 7) * 100));

  return (
    <div className="space-y-6">
      {/* 1. Card: Nút gạt chung cho tất cả thiết bị & Cài đặt % so sánh */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Giám Sát Bất Thường (AI Engine)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                Toàn Cục
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {!isEditingDeviation && masterAnomalyEnabled && (
              <button
                type="button"
                onClick={() => {
                  setFlowPct(anomalyDeviationPercent);
                  setPressPct(anomalyPressureDeviationPercent);
                  setIsEditingDeviation(true);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                <span>Chỉnh sửa</span>
              </button>
            )}
            <Switch
              checked={masterAnomalyEnabled}
              onCheckedChange={setMasterAnomalyEnabled}
              className="data-[state=checked]:bg-cyan-500 scale-125"
            />
          </div>
        </div>

        {/* Visual Deviation Zone Bar */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono mb-2">
            <span>Giới hạn: <strong className="text-amber-400">-{anomalyDeviationPercent}%</strong></span>
            <span className="text-emerald-400 font-bold">Dung Sai Chuẩn (Baseline)</span>
            <span>Giới hạn: <strong className="text-amber-400">+{anomalyDeviationPercent}%</strong></span>
          </div>

          <div className="h-4 rounded-full bg-slate-950 border border-white/15 relative overflow-hidden flex items-center justify-center p-0.5">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-500/60 via-teal-400 to-emerald-500/60 border border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
            <span className="text-rose-400">-Δ Báo Động</span>
            <span className="text-slate-300">Chuẩn 100%</span>
            <span className="text-rose-400">+Δ Báo Động</span>
          </div>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Độ Lệch Lưu Lượng
            </span>
            {isEditingDeviation ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={flowPct}
                    onChange={(e) => setFlowPct(parseInt(e.target.value, 10) || 20)}
                    className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-400 text-lg font-bold text-white font-mono"
                  />
                  <span className="text-sm font-bold text-cyan-400">%</span>
                </div>
                <div className="flex items-center gap-1">
                  {[10, 15, 20, 25].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setFlowPct(v)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        flowPct === v ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-3xl font-black text-cyan-300 font-mono">
                ± {anomalyDeviationPercent} %
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Độ Lệch Áp Suất
            </span>
            {isEditingDeviation ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={pressPct}
                    onChange={(e) => setPressPct(parseInt(e.target.value, 10) || 15)}
                    className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-400 text-lg font-bold text-white font-mono"
                  />
                  <span className="text-sm font-bold text-cyan-400">%</span>
                </div>
                <div className="flex items-center gap-1">
                  {[10, 15, 20, 25].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setPressPct(v)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        pressPct === v ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-3xl font-black text-cyan-300 font-mono">
                ± {anomalyPressureDeviationPercent} %
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Chu Kỳ Lấy Mẫu
            </span>
            <span className="text-2xl font-black text-white font-mono">
              7 Ngày
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Mục Tiêu So Sánh
            </span>
            <span className="text-xl font-black text-emerald-400">
              Tuần Kế Tiếp
            </span>
          </div>
        </div>

        {isEditingDeviation && (
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditingDeviation(false)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white border border-white/10"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveDeviation}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-cyan-500/25 cursor-pointer"
            >
              Lưu
            </button>
          </div>
        )}
      </div>

      {/* 2. Card: Lập lịch không quan sát dữ liệu trong ngày nào */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Lập Lịch Loại Trừ (Exclusion)
            </h3>
          </div>

          <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/60 px-3 py-1.5 rounded-full border border-cyan-500/40 self-start sm:self-auto">
            Bỏ qua: {nonMonitoringDays.length} ngày / tuần
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 mt-4 flex-wrap text-xs">
          <span className="text-slate-400 font-medium">Chọn nhanh:</span>
          <button
            type="button"
            onClick={() => handlePresetExclusion('all_week')}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            Tất cả
          </button>
          <button
            type="button"
            onClick={() => handlePresetExclusion('skip_weekend')}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            Bỏ T7 & CN
          </button>
          <button
            type="button"
            onClick={() => handlePresetExclusion('skip_sunday')}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            Bỏ Chủ Nhật
          </button>
        </div>

        {/* 7 Days Grid Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 mt-4">
          {DAYS_OF_WEEK.map((d) => {
            const isExcluded = nonMonitoringDays.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleNonMonitoringDay(d.id)}
                className={`p-3.5 rounded-2xl text-center transition-all border cursor-pointer flex flex-col items-center justify-between gap-2 ${
                  isExcluded
                    ? 'bg-amber-950/40 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:text-white hover:border-white/25 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono font-bold text-slate-400">{d.short}</span>
                  {isExcluded ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  )}
                </div>
                <span className="text-sm font-black text-white">{d.label}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isExcluded ? 'bg-amber-500/20 text-amber-300' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {isExcluded ? 'BỎ QUA' : 'GIÁM SÁT'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Card: Thiết bị cụ thể ID 1015 & 7-Day Visual Node Pipeline */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg sm:text-xl font-black text-white">
              Thiết Bị 1015 (Chu Kỳ 7 Ngày)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowDeviceResetModal(true)}
            className="px-4 py-2 rounded-xl border border-amber-500/40 bg-amber-500/15 text-xs sm:text-sm font-black text-amber-300 hover:bg-amber-500/25 flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Baseline 1015</span>
          </button>
        </div>

        {/* 7-DAY VISUAL STEPPER TRACKER */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono mb-4">
            <span>Tiến trình: <strong className="text-cyan-300">Ngày {device1015LearningDay} / 7 ({progressPercent}%)</strong></span>
            <span>Tổng mẫu: <strong className="text-white font-mono">{device1015TotalSamples}</strong></span>
          </div>

          {/* 7 Nodes */}
          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
              const isCompleted = dayNum < device1015LearningDay;
              const isCurrent = dayNum === device1015LearningDay;

              return (
                <div
                  key={dayNum}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isCompleted
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-cyan-950/50 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                      : 'bg-slate-950/40 border-white/10 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono">
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    ) : (
                      <span>{dayNum}</span>
                    )}
                  </div>
                  <span className="text-xs font-black block">Ngày {dayNum}</span>
                  <span className="text-[10px] font-mono">
                    {isCompleted ? 'Hoàn tất' : isCurrent ? 'Đang học' : 'Chờ'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full h-3 rounded-full bg-slate-950 border border-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Thông số metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Tiến Độ
            </span>
            <span className="text-2xl font-black text-cyan-300 font-mono">
              Ngày {device1015LearningDay} / 7
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Số Mẫu Tích Lũy
            </span>
            <span className="text-2xl font-black text-white font-mono">
              {device1015TotalSamples} mẫu
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Lần Reset Gần Nhất
            </span>
            <span className="text-xl font-bold text-slate-200 font-mono">
              {device1015LastReset}
            </span>
          </div>
        </div>
      </div>

      {/* Modal xác nhận Reset riêng cho Thiết Bị 1015 */}
      {showDeviceResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-amber-500/40 text-slate-100">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-black text-white">
                Reset Chu Kỳ 7 Ngày Thiết Bị 1015?
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Thao tác này chỉ xóa dữ liệu học máy của <strong className="text-white">Thiết Bị 1015</strong> và bắt đầu quan sát lại từ Ngày 1. Dữ liệu của các thiết bị khác trên mạng lưới không bị ảnh hưởng.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeviceResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDevice1015Baseline();
                  setShowDeviceResetModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-amber-500/25 cursor-pointer"
              >
                Xác Nhận Reset 1015
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận Reset toàn bộ hệ thống */}
      {showGlobalResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-red-500/50 text-slate-100">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-black text-white">
                Xác Nhận Reset Toàn Bộ Hệ Thống?
              </h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Xóa sạch dữ liệu mẫu của toàn bộ thiết bị. Mạng lưới sẽ tính lại từ đầu đủ 7 ngày.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowGlobalResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  resetGlobalSystem();
                  setShowGlobalResetModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs sm:text-sm font-black hover:bg-red-500 shadow-md shadow-red-600/30 cursor-pointer"
              >
                Xác Nhận Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

