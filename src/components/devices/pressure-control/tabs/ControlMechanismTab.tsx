import React, { useState } from 'react';
import { SlidersHorizontal, Gauge, Cog, CheckCircle2, ShieldCheck } from 'lucide-react';
import { PressureStationConfig } from '../types';

interface ControlMechanismTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
}

export function ControlMechanismTab({
  config,
  onChangeConfig,
}: ControlMechanismTabProps) {
  // Chế độ vận hành: 'auto' | 'manual' | 'schedule'
  const [controlMode, setControlMode] = useState<'auto' | 'manual' | 'schedule'>('auto');
  // Quyền điều khiển: 'local' | 'remote'
  const [controlSource, setControlSource] = useState<'local' | 'remote'>('remote');
  // Dải chết dung sai áp lực (Deadband ± mH2O)
  const [deadband, setDeadband] = useState<number>(0.3);
  // Thời gian hành trình quay van (Full stroke seconds)
  const [strokeTime, setStrokeTime] = useState<number>(45);
  // Góc bước tối thiểu (Min step degrees)
  const [minStepAngle, setMinStepAngle] = useState<number>(1.0);

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* Main 3 Cards Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 overflow-y-auto pr-1">
        {/* CARD 1: Chế độ điều khiển chính */}
        <div className="rounded-[22px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Chế Độ Vận Hành
              </h4>
              <p className="text-[11px] text-slate-400">Phương thức điều tiết van</p>
            </div>
          </div>

          <div className="space-y-4 py-3">
            {/* Phương thức điều khiển */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Thuật toán điều khiển:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'auto', label: 'Tự động', desc: 'Theo áp lực' },
                  { id: 'manual', label: 'Thủ công', desc: 'Góc cố định' },
                  { id: 'schedule', label: 'Lịch trình', desc: 'Theo khung giờ' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setControlMode(mode.id as typeof controlMode)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      controlMode === mode.id
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 shadow-2xs font-bold'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs font-bold">{mode.label}</span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {mode.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quyền điều khiển */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Nguồn lệnh điều khiển:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setControlSource('remote')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    controlSource === 'remote'
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs">Từ xa (SCADA Web)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setControlSource('local')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    controlSource === 'local'
                      ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-xs">Cục bộ (Tại trạm)</span>
                </button>
              </div>
            </div>

            {/* Trạng thái thuật toán */}
            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-500/15 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Đang kích hoạt thuật toán <strong className="text-blue-600 dark:text-blue-400">PID thích nghi</strong>. Van sẽ tự động điều chỉnh tốc độ nhích dựa trên độ lệch giữa áp thực tế và điểm đặt.
              </p>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Trạng thái vòng lặp:</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Closed-Loop Active</span>
          </div>
        </div>

        {/* CARD 2: Cài đặt mức áp suất mục tiêu */}
        <div className="rounded-[22px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Mức Áp Suất Mục Tiêu
              </h4>
              <p className="text-[11px] text-slate-400">Target Setpoints P1 / P2 / P3</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-3.5 py-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mức áp 1 (Target P1 – Giờ cao điểm):
                </label>
                <span className="text-[11px] font-mono text-blue-500 font-bold">mH₂O</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={config.targetP1}
                onChange={(e) =>
                  onChangeConfig((prev) => ({
                    ...prev,
                    targetP1: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mức áp 2 (Target P2 – Giờ thấp điểm):
                </label>
                <span className="text-[11px] font-mono text-amber-500 font-bold">mH₂O</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={config.targetP2}
                onChange={(e) =>
                  onChangeConfig((prev) => ({
                    ...prev,
                    targetP2: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mở full (Target P3 – Xả tối đa / Cứu hỏa):
                </label>
                <span className="text-[11px] font-mono text-rose-500 font-bold">% van</span>
              </div>
              <input
                type="number"
                step="1"
                value={config.targetP3}
                onChange={(e) =>
                  onChangeConfig((prev) => ({
                    ...prev,
                    targetP3: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Dải chết dung sai (Deadband ΔP):
                </label>
                <span className="text-[11px] font-mono text-slate-400">± mH₂O</span>
              </div>
              <input
                type="number"
                step="0.05"
                value={deadband}
                onChange={(e) => setDeadband(parseFloat(e.target.value) || 0.1)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
              />
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Dung sai cho phép:</span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">±{deadband} mH₂O</span>
          </div>
        </div>

        {/* CARD 3: Động học chấp hành & Calib van */}
        <div className="rounded-[22px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
              <Cog className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Đáp Ứng Động Cơ Van
              </h4>
              <p className="text-[11px] text-slate-400">Thông số cơ cấu chấp hành</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-3.5 py-3">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Tỉ lệ Calib van (Góc 0° / 90°):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Góc 0° (Đóng kín)</span>
                  <input
                    type="text"
                    value={config.ratio0}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({ ...prev, ratio0: e.target.value }))
                    }
                    placeholder="0:1.5"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-0.5">Góc 90° (Mở max)</span>
                  <input
                    type="text"
                    value={config.ratio90}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({ ...prev, ratio90: e.target.value }))
                    }
                    placeholder="90:1.0"
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs font-mono font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Thời gian chạy hết hành trình (0° → 90°):
                </label>
                <span className="text-[11px] font-mono text-indigo-500 font-bold">giây</span>
              </div>
              <input
                type="number"
                min="10"
                max="300"
                value={strokeTime}
                onChange={(e) => setStrokeTime(parseInt(e.target.value) || 45)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-2xs"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Bước nhích góc van tối thiểu (Min Step):
                </label>
                <span className="text-[11px] font-mono text-indigo-500 font-bold">độ (°)</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="10"
                value={minStepAngle}
                onChange={(e) => setMinStepAngle(parseFloat(e.target.value) || 1.0)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-2xs"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Bảo vệ chống giật van (Soft-start / Soft-stop)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Tốc độ quay:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {(90 / (strokeTime || 1)).toFixed(1)}°/giây
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
