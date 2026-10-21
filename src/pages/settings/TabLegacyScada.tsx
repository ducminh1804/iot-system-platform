import React, { useState } from 'react';
import {
  Cpu,
  Clock,
  ShieldAlert,
  Sliders,
  Edit2,
  Terminal,
  Activity,
  Power,
  Flame,
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
    toast.success('Đã cập nhật ngưỡng áp ngắt van khẩn cấp!');
  };

  return (
    <div className="space-y-6">
      {/* 1. SCADA RTU TELEMETRY & COMMS CORE */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E52E2D] to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Subsystem 05 // SCADA Comms &amp; Interlock
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  MODBUS RTU ONLINE
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Trạm Vi Xử Lý &amp; Cơ Chế An Toàn SCADA
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span>Chu kỳ đẩy dữ liệu:</span>
            <strong className="text-white px-2 py-0.5 rounded bg-black border border-slate-800 text-[#00E676]">
              30 GIÂY / LẦN
            </strong>
          </div>
        </div>

        {/* 4 Hardware Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Mã Thiết Bị Trạm
            </span>
            <span className="text-2xl font-black text-white font-mono">
              TB-1015
            </span>
            <span className="text-[10px] font-mono text-cyan-400 block mt-1">ID Mạng Lưới: #9401</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Phần Cứng Bo Mạch (PCB)
            </span>
            <span className="text-xl font-black text-white font-mono">
              v3.2.0-PRO
            </span>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">Industrial Grade STM32</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Vi Mã Firmware RTU
            </span>
            <span className="text-xl font-black text-white font-mono">
              v2.4.1-STABLE
            </span>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">Baud: 115200 bps</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Băng Tần Truyền Dẫn
            </span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              4G LTE / NB-IoT
            </span>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">CSQ: 28/31 (Tuyệt vời)</span>
          </div>
        </div>
      </div>

      {/* 2. EMERGENCY CUTOFF INTERLOCK (KHÓA VAN KHẨN CẤP KHI CẠN NGUỒN) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#181112] to-[#111418] border border-rose-500/40 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-rose-500/20 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold">
                  Safety Interlock // Zero Pressure Breaker
                </span>
                {pressureStopEnabled && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    INTERLOCK ARMED
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Khóa Van Khẩn Cấp Khi Cạn Nguồn (Áp Thấp)
              </h2>
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
                className="px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-950/20 text-xs font-mono font-bold text-rose-300 hover:bg-rose-950/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Hiệu chỉnh ngưỡng</span>
              </button>
            )}
            <Switch
              checked={pressureStopEnabled}
              onCheckedChange={(c) => setPressureStop(c, cutoffVal)}
              className="data-[state=checked]:bg-rose-600 scale-110"
            />
          </div>
        </div>

        {/* 3 Interlock Action Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div className="p-4 rounded-xl bg-[#0D1014] border border-rose-500/30">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Ngưỡng Cắt Áp (Cutoff)
            </span>
            {isEditingCutoff ? (
              <div className="space-y-2 mt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="2.0"
                    value={cutoffVal}
                    onChange={(e) => setCutoffVal(parseFloat(e.target.value) || 0.5)}
                    className="w-20 px-2 py-1 rounded bg-black border border-rose-500 text-lg font-black text-rose-400 font-mono"
                  />
                  <span className="text-xs font-bold text-slate-400">Bar</span>
                </div>
                <div className="flex items-center gap-1">
                  {[0.3, 0.5, 0.8, 1.0].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setCutoffVal(v)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        cutoffVal === v ? 'bg-rose-600 text-white font-black' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v} Bar
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-2xl font-black text-rose-400 font-mono">
                &lt; {stopLowPressureBar} <span className="text-sm font-sans font-bold text-slate-400">Bar</span>
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 block mt-1">Tự động ngắt khi đường ống cạn</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
              Phản Ứng Cơ Khí Tức Thì
            </span>
            <div className="flex items-center gap-2 mt-2">
              <Power className="w-5 h-5 text-rose-500" />
              <span className="text-lg font-black text-rose-300 font-mono">ĐÓNG 100% VAN</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Bảo vệ tụt chân không đường ống</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Kênh Báo Động Khẩn
            </span>
            <span className="text-base font-black text-cyan-300 font-mono mt-2">
              SMS BÁO ĐỘNG &amp; HTTP
            </span>
            <span className="text-[10px] font-mono text-slate-400">Bắn tin trực tiếp tới kỹ sư trưởng</span>
          </div>
        </div>

        {isEditingCutoff && (
          <div className="mt-4 pt-3 border-t border-rose-500/30 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingCutoff(false)}
              className="px-3 py-1 rounded text-xs font-bold text-slate-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveCutoff}
              className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-md cursor-pointer"
            >
              Lưu Ngưỡng Khóa Van
            </button>
          </div>
        )}
      </div>

      {/* 3. DUTY CYCLE INTERVALS (CHU KỲ CHẠY / NGHỈ) */}
      <div className="rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Duty Modulation // Interval Pulsing
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Chu Kỳ Chạy / Tạm Nghỉ (Duty Cycle)
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-5">
          {cycleStages.map((cs) => {
            const totalMin = cs.runDurationMin + cs.pauseDurationMin;
            const dutyPercent = Math.round((cs.runDurationMin / totalMin) * 100);

            return (
              <div
                key={cs.id}
                className={`p-4 rounded-xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  cs.enabled
                    ? 'bg-[#15191F] border-slate-800 shadow-md'
                    : 'bg-[#0E1115] border-slate-900 opacity-50'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black text-white">{cs.name}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded-full ${
                        cs.enabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      Duty: {dutyPercent}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
                    <span>Thời gian mở: <strong className="text-cyan-300">{cs.runDurationMin}p</strong></span>
                    <span>•</span>
                    <span>Thời gian nghỉ: <strong className="text-amber-400">{cs.pauseDurationMin}p</strong></span>
                    <span>•</span>
                    <span>Tổng chu kỳ: <strong className="text-white">{totalMin}p</strong></span>
                  </div>

                  <div className="h-2 w-full max-w-sm rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex">
                    <div style={{ width: `${dutyPercent}%` }} className="h-full bg-cyan-400" />
                    <div style={{ width: `${100 - dutyPercent}%` }} className="h-full bg-amber-500/80" />
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                      cs.targetLevel === 1
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : cs.targetLevel === 2
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-[#E52E2D]/20 text-[#E52E2D] border-[#E52E2D]/30'
                    }`}
                  >
                    Mức {cs.targetLevel} ({cs.targetLevel === 1 ? '28%' : cs.targetLevel === 2 ? '50%' : '100%'})
                  </span>

                  <Switch
                    checked={cs.enabled}
                    onCheckedChange={() => {
                      toast.info(`Đã đổi trạng thái ${cs.name}`);
                    }}
                    className="data-[state=checked]:bg-cyan-500 scale-110"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. STEPPED PRESSURE LADDER (PHÂN CẤP DẢI ÁP ĐẦU VÀO) */}
      <div className="rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/10">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Adaptive Stepped Ladder // Multi-Tier
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Phân Cấp Dải Áp Đầu Vào (Stepped Ladder)
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-3 mt-5">
          {pressureSteps.map((step) => (
            <div
              key={step.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                step.enabled
                  ? 'bg-[#15191F] border-slate-800 shadow-md'
                  : 'bg-[#0E1115] border-slate-900 opacity-50'
              }`}
            >
              <div className="space-y-1">
                <span className="text-sm font-black text-white block">{step.name}</span>
                <span className="text-slate-400 font-mono text-xs">
                  Dải áp kích hoạt: <strong className="text-amber-400 font-bold">{step.minPressureBar} - {step.maxPressureBar} Bar</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                    step.targetLevel === 1
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : step.targetLevel === 2
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-[#E52E2D]/20 text-[#E52E2D] border-[#E52E2D]/30'
                  }`}
                >
                  Mức {step.targetLevel} ({step.targetLevel === 1 ? '28%' : step.targetLevel === 2 ? '50%' : '100%'})
                </span>
                <Switch
                  checked={step.enabled}
                  onCheckedChange={() => togglePressureStep(step.id)}
                  className="data-[state=checked]:bg-purple-500 scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
