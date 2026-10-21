import React, { useState } from 'react';
import {
  Edit2,
  RotateCcw,
  Calendar,
  Brain,
  AlertTriangle,
  Sparkles,
  Check,
  Layers,
  Cpu,
  Flame,
} from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const DAYS_OF_WEEK = [
  { id: 1, label: 'Thứ 2', short: 'T2', code: 'MON' },
  { id: 2, label: 'Thứ 3', short: 'T3', code: 'TUE' },
  { id: 3, label: 'Thứ 4', short: 'T4', code: 'WED' },
  { id: 4, label: 'Thứ 5', short: 'T5', code: 'THU' },
  { id: 5, label: 'Thứ 6', short: 'T6', code: 'FRI' },
  { id: 6, label: 'Thứ 7', short: 'T7', code: 'SAT', isWeekend: true },
  { id: 0, label: 'Chủ Nhật', short: 'CN', code: 'SUN', isWeekend: true },
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
    toast.success('Đã lưu ngưỡng sai lệch bất thường!');
  };

  const handlePresetExclusion = (preset: 'all_week' | 'skip_weekend' | 'skip_sunday') => {
    if (preset === 'all_week') {
      nonMonitoringDays.forEach((d) => toggleNonMonitoringDay(d));
      toast.success('Đã chọn: Giám sát toàn bộ 7 ngày');
    } else if (preset === 'skip_weekend') {
      [0, 1, 2, 3, 4, 5, 6].forEach((d) => {
        const shouldBeExcluded = d === 6 || d === 0;
        const isCurrentlyExcluded = nonMonitoringDays.includes(d);
        if (shouldBeExcluded !== isCurrentlyExcluded) {
          toggleNonMonitoringDay(d);
        }
      });
      toast.success('Đã chọn: Bỏ qua Thứ 7 & Chủ Nhật');
    } else if (preset === 'skip_sunday') {
      [0, 1, 2, 3, 4, 5, 6].forEach((d) => {
        const shouldBeExcluded = d === 0;
        const isCurrentlyExcluded = nonMonitoringDays.includes(d);
        if (shouldBeExcluded !== isCurrentlyExcluded) {
          toggleNonMonitoringDay(d);
        }
      });
      toast.success('Đã chọn: Bỏ qua Chủ Nhật');
    }
  };

  const progressPercent = Math.min(100, Math.round((device1015LearningDay / 7) * 100));

  return (
    <div className="space-y-6">
      {/* 1. NEURAL ORBIT 7-DAY LEARNING PIPELINE (THIẾT BỊ 1015) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Adaptive AI // 7-Day Baseline Synthesis
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  TIẾN TRÌNH {progressPercent}%
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Hồ Sơ Tự Học AI 7 Ngày (Thiết Bị 1015)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setShowDeviceResetModal(true)}
              className="px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-950/20 text-xs font-mono font-bold text-purple-300 hover:bg-purple-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Baseline 1015</span>
            </button>
          </div>
        </div>

        {/* 7-Node Cyber Pipeline */}
        <div className="mt-5 p-4 rounded-xl bg-[#0D1014] border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
            <span>Tiến trình tự tổng hợp Baseline: <strong className="text-purple-300">Ngày {device1015LearningDay} / 7</strong></span>
            <span>Mẫu tích lũy: <strong className="text-white font-mono">{device1015TotalSamples} mẫu</strong></span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => {
              const isCompleted = dayNum < device1015LearningDay;
              const isCurrent = dayNum === device1015LearningDay;

              return (
                <div
                  key={dayNum}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-2 relative overflow-hidden ${
                    isCompleted
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5'
                      : isCurrent
                      ? 'bg-purple-950/40 border-purple-400 text-purple-200 shadow-xl shadow-purple-500/20 ring-1 ring-purple-400'
                      : 'bg-[#14171C]/60 border-slate-800 text-slate-500 opacity-50'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                  )}

                  <div className="flex items-center justify-between w-full text-[10px] font-mono">
                    <span className="text-slate-400">D{dayNum}</span>
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    )}
                  </div>

                  <span className="text-xs sm:text-sm font-black text-white">
                    Ngày {dayNum}
                  </span>

                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isCurrent
                        ? 'bg-purple-500/30 text-purple-200 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isCompleted ? 'KHÓA MẪU' : isCurrent ? 'ĐANG HỌC' : 'CHỜ'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3">
            <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3 Telemetry Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Giai Đoạn Tổng Hợp
            </span>
            <span className="text-2xl font-black text-purple-300 font-mono">
              Ngày {device1015LearningDay} / 7
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Dung Lượng Dữ Liệu
            </span>
            <span className="text-2xl font-black text-white font-mono">
              {device1015TotalSamples} <span className="text-xs text-slate-400 font-sans">mẫu đo</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Thời Điểm Khởi Tạo
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-300 font-mono block mt-1">
              {device1015LastReset}
            </span>
          </div>
        </div>
      </div>

      {/* 2. TOLERANCE ENVELOPE (DUNG SAI SO SÁNH TUẦN KẾ TIẾP) */}
      <div className="rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Global Anomaly Gate // Neural Envelope
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  HỆ THỐNG TOÀN MẠNG
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Hành Lang Dung Sai Bất Thường
              </h2>
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
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Hiệu chỉnh biên độ</span>
              </button>
            )}
            <Switch
              checked={masterAnomalyEnabled}
              onCheckedChange={setMasterAnomalyEnabled}
              className="data-[state=checked]:bg-cyan-500 scale-110"
            />
          </div>
        </div>

        {/* Visual Deviation Zone Bar */}
        <div className="mt-5 p-4 rounded-xl bg-[#0D1014] border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-amber-400 font-bold">Biên dưới: -{anomalyDeviationPercent}%</span>
            <span className="text-emerald-400 font-bold">Dải Dung Sai Baseline (Bình Thường)</span>
            <span className="text-amber-400 font-bold">Biên trên: +{anomalyDeviationPercent}%</span>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center justify-center p-0.5">
            <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span className="text-rose-400">Rò rỉ / Sụt áp báo động</span>
            <span className="text-slate-300 font-bold">Đối chiếu cùng thứ tuần trước</span>
            <span className="text-rose-400">Quá áp / Bục vỡ báo động</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Độ Lệch Lưu Lượng
            </span>
            {isEditingDeviation ? (
              <div className="space-y-1.5 mt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={flowPct}
                    onChange={(e) => setFlowPct(parseInt(e.target.value, 10) || 20)}
                    className="w-16 px-2 py-0.5 rounded bg-black border border-cyan-400 text-sm font-bold text-white font-mono"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
                <div className="flex items-center gap-1">
                  {[10, 15, 20, 25].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setFlowPct(v)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        flowPct === v ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-2xl font-black text-cyan-300 font-mono">
                ± {anomalyDeviationPercent}%
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Độ Lệch Áp Suất
            </span>
            {isEditingDeviation ? (
              <div className="space-y-1.5 mt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={pressPct}
                    onChange={(e) => setPressPct(parseInt(e.target.value, 10) || 15)}
                    className="w-16 px-2 py-0.5 rounded bg-black border border-cyan-400 text-sm font-bold text-white font-mono"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
                <div className="flex items-center gap-1">
                  {[10, 15, 20, 25].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setPressPct(v)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        pressPct === v ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-2xl font-black text-cyan-300 font-mono">
                ± {anomalyPressureDeviationPercent}%
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Chu Kỳ Lấy Mẫu
            </span>
            <span className="text-2xl font-black text-white font-mono">
              7 Ngày
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Đối Chiếu Tuần Hoàn
            </span>
            <span className="text-base font-bold text-emerald-400 block mt-1">
              Cùng Thứ Tuần Kế Tiếp
            </span>
          </div>
        </div>

        {isEditingDeviation && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingDeviation(false)}
              className="px-3 py-1 rounded text-xs font-bold text-slate-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveDeviation}
              className="px-3.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black"
            >
              Lưu Thiết Lập
            </button>
          </div>
        )}
      </div>

      {/* 3. EXCLUSION MATRIX (LỊCH BỎ QUA QUAN SÁT) */}
      <div className="rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shadow-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Exclusion Filter // Schedule Matrix
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  BỎ QUA {nonMonitoringDays.length} NGÀY
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Ma Trận Ngày Loại Trừ Quan Sát
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <button
              type="button"
              onClick={() => handlePresetExclusion('all_week')}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
            >
              Cả Tuần
            </button>
            <button
              type="button"
              onClick={() => handlePresetExclusion('skip_weekend')}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
            >
              Bỏ T7 &amp; CN
            </button>
            <button
              type="button"
              onClick={() => handlePresetExclusion('skip_sunday')}
              className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
            >
              Bỏ Chủ Nhật
            </button>
          </div>
        </div>

        {/* 7 Days Button Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mt-5">
          {DAYS_OF_WEEK.map((d) => {
            const isExcluded = nonMonitoringDays.includes(d.id);
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => toggleNonMonitoringDay(d.id)}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-2 ${
                  isExcluded
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'bg-[#0D1014] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#14171C]'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px] font-mono">
                  <span className="text-slate-400">{d.code}</span>
                  {isExcluded ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-400/50" />
                  )}
                </div>

                <span className="text-sm font-black text-white">{d.label}</span>

                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    isExcluded ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {isExcluded ? 'BỎ QUA' : 'THEO DÕI'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODAL RESET RIÊNG CHO 1015 */}
      {showDeviceResetModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#181D24] border border-purple-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3 text-purple-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-white">
                Reset Chu Kỳ Tự Học Thiết Bị 1015?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Toàn bộ dữ liệu 7 ngày của trạm 1015 sẽ bị xóa và bắt đầu học lại từ Ngày 1. Hồ sơ các trạm khác trên mạng lưới giữ nguyên.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDeviceResetModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  resetDevice1015Baseline();
                  setShowDeviceResetModal(false);
                  toast.success('Đã reset chu kỳ học máy của trạm 1015');
                }}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-md shadow-purple-600/30"
              >
                Xác Nhận Reset 1015
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
