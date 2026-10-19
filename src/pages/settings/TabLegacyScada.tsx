import React, { useState } from 'react';
import {
  Cpu,
  Clock,
  ShieldAlert,
  Sliders,
  Edit2,
} from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const TabLegacyScada: React.FC = () => {
  const {
    cycleStages,
    pressureSteps,
    togglePressureStep,
    pressureStopEnabled,
    setPressureStop,
    stopLowPressureBar,
  } = useSettingsStore();

  const [isEditingCutoff, setIsEditingCutoff] = useState(false);
  const [cutoffVal, setCutoffVal] = useState(stopLowPressureBar);

  const handleSaveCutoff = () => {
    setPressureStop(pressureStopEnabled, cutoffVal);
    setIsEditingCutoff(false);
    toast.success('Đã cập nhật ngưỡng áp khóa van!');
  };

  return (
    <div className="space-y-6">
      {/* 1. Card: Thông số thiết bị SCADA */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Thông Tin SCADA
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Mã Thiết Bị
            </span>
            <span className="text-2xl font-black text-cyan-300 font-mono">
              TB-1015
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Phần Cứng
            </span>
            <span className="text-xl font-bold text-white font-mono">
              v3.2.0
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Firmware
            </span>
            <span className="text-xl font-bold text-white font-mono">
              v2.4.1
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Chu Kỳ Đẩy Tin
            </span>
            <span className="text-2xl font-black text-cyan-400 font-mono">
              30s
            </span>
          </div>
        </div>
      </div>

      {/* 2. Card: Hẹn giờ theo chu kỳ chạy / nghỉ (Cycle Interval) */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Chu Kỳ Chạy / Nghỉ (Duty Cycle)
            </h3>
          </div>
        </div>

        <div className="divide-y divide-white/10 mt-2 space-y-3">
          {cycleStages.map((cs) => {
            const totalMin = cs.runDurationMin + cs.pauseDurationMin;
            const dutyPercent = Math.round((cs.runDurationMin / totalMin) * 100);

            return (
              <div
                key={cs.id}
                className={`p-4 rounded-2xl transition-all border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  cs.enabled
                    ? 'bg-slate-900/60 border-white/10'
                    : 'bg-slate-950/30 border-transparent opacity-60'
                }`}
              >
                {/* Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-white">{cs.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        cs.enabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {dutyPercent}%
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-300 flex-wrap">
                    <span>
                      Chạy: <strong className="text-cyan-300 font-bold">{cs.runDurationMin}p</strong>
                    </span>
                    <span className="text-slate-500">•</span>
                    <span>
                      Nghỉ: <strong className="text-amber-400 font-bold">{cs.pauseDurationMin}p</strong>
                    </span>
                    <span className="text-slate-500">•</span>
                    <span>
                      Chu kỳ: <strong className="text-white">{totalMin}p</strong>
                    </span>
                  </div>

                  {/* Visual ratio bar */}
                  <div className="h-2 w-full max-w-md rounded-full bg-slate-950 border border-white/10 overflow-hidden flex">
                    <div
                      style={{ width: `${dutyPercent}%` }}
                      className="h-full bg-cyan-400 rounded-l-full"
                    />
                    <div
                      style={{ width: `${100 - dutyPercent}%` }}
                      className="h-full bg-amber-400/80 rounded-r-full"
                    />
                  </div>
                </div>

                {/* Level Tag & Switch */}
                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`px-3.5 py-1 rounded-xl text-xs font-black border ${
                      cs.targetLevel === 1
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : cs.targetLevel === 2
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    Mức {cs.targetLevel} ({cs.targetLevel === 1 ? '28%' : cs.targetLevel === 2 ? '50%' : '100%'})
                  </span>

                  <Switch
                    checked={cs.enabled}
                    onCheckedChange={() => {
                      toast.info(`Đã thay đổi trạng thái ${cs.name}`);
                    }}
                    className="data-[state=checked]:bg-cyan-500 scale-110"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Card: Bảo vệ áp thấp / Khóa van khẩn cấp */}
      <div className="rounded-2xl sm:rounded-3xl border border-red-500/30 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Khóa Van Khi Cạn Nguồn
              </h3>
              {pressureStopEnabled && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 font-mono">
                  INTERLOCK
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {!isEditingCutoff && pressureStopEnabled && (
              <button
                type="button"
                onClick={() => {
                  setCutoffVal(stopLowPressureBar);
                  setIsEditingCutoff(true);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                <span>Chỉnh sửa</span>
              </button>
            )}
            <Switch
              checked={pressureStopEnabled}
              onCheckedChange={(c) => setPressureStop(c, cutoffVal)}
              className="data-[state=checked]:bg-red-500 scale-125"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Ngưỡng Khóa Van
            </span>
            {isEditingCutoff ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="2.0"
                    value={cutoffVal}
                    onChange={(e) => setCutoffVal(parseFloat(e.target.value) || 0.5)}
                    className="w-24 px-2.5 py-1 rounded-lg bg-slate-950 border border-red-500 text-lg font-bold text-white font-mono"
                  />
                  <span className="text-sm font-bold text-slate-300">Bar</span>
                </div>
                <div className="flex items-center gap-1">
                  {[0.3, 0.5, 0.8, 1.0].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCutoffVal(v)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        cutoffVal === v ? 'bg-red-500 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v} Bar
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-3xl font-black text-red-400 font-mono">
                &lt; {stopLowPressureBar} Bar
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/20">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-1.5">
              Hành Động Khẩn Cấp
            </span>
            <span className="text-xl font-black text-red-300 flex items-center gap-1.5">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>ĐÓNG 100% CÁC VAN</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Kênh Báo Động
            </span>
            <span className="text-xl font-black text-cyan-300 font-mono">
              SMS & WEBHOOK
            </span>
          </div>
        </div>

        {isEditingCutoff && (
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditingCutoff(false)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white border border-white/10"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveCutoff}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-black shadow-md shadow-red-600/30 cursor-pointer"
            >
              Lưu
            </button>
          </div>
        )}
      </div>

      {/* 4. Card: Bảng nấc áp suất tự động từng cấp (Stepped Ladder) */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Phân Cấp Dải Áp Đầu Vào
            </h3>
          </div>
        </div>

        <div className="divide-y divide-white/10 mt-3 space-y-3">
          {pressureSteps.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-2xl transition-all border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                step.enabled
                  ? 'bg-slate-900/60 border-white/10'
                  : 'bg-slate-950/30 border-transparent opacity-60'
              }`}
            >
              <div className="space-y-1">
                <span className="text-base font-black text-white block">{step.name}</span>
                <span className="text-slate-300 font-mono text-xs sm:text-sm">
                  Kích hoạt: <strong className="text-amber-300 font-bold">{step.minPressureBar} - {step.maxPressureBar} Bar</strong>
                </span>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black border ${
                    step.targetLevel === 1
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : step.targetLevel === 2
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  Mức {step.targetLevel} ({step.targetLevel === 1 ? '28%' : step.targetLevel === 2 ? '50%' : '100%'})
                </span>
                <Switch
                  checked={step.enabled}
                  onCheckedChange={() => togglePressureStep(step.id)}
                  className="data-[state=checked]:bg-cyan-500 scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

