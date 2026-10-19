import React, { useState } from 'react';
import {
  Edit2,
  RotateCcw,
  Check,
  Gauge,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { toast } from 'sonner';

export const TabSensorCalibration: React.FC = () => {
  const {
    calibRangeMin,
    calibRangeMax,
    calibUnit,
    setCalibRange,
    zeroConfirmed,
    confirmZeroPoint,
    point1Confirmed,
    point1ValueBar,
    confirmPoint1,
    point2Confirmed,
    point2ValueBar,
    confirmPoint2,
    resetCalibration,
    lastCalibratedDate,
  } = useSettingsStore();

  const [isEditingRange, setIsEditingRange] = useState(false);
  const [minVal, setMinVal] = useState(calibRangeMin);
  const [maxVal, setMaxVal] = useState(calibRangeMax);
  const [unitVal, setUnitVal] = useState(calibUnit);

  const [p1Input, setP1Input] = useState(point1ValueBar);
  const [p2Input, setP2Input] = useState(point2ValueBar);

  const handleSaveRange = () => {
    setCalibRange(minVal, maxVal, unitVal);
    setIsEditingRange(false);
    toast.success('Đã lưu dải đo cảm biến thành công!');
  };

  const isFullyCalibrated = zeroConfirmed && point1Confirmed;

  return (
    <div className="space-y-6">
      {/* 1. Card: Nhập Range & Đơn Vị Đo */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Dải Đo Áp Lực
            </h3>
          </div>

          {!isEditingRange ? (
            <button
              type="button"
              onClick={() => {
                setMinVal(calibRangeMin);
                setMaxVal(calibRangeMax);
                setUnitVal(calibUnit);
                setIsEditingRange(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer self-end sm:self-auto"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-300" />
              <span>Chỉnh sửa</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setIsEditingRange(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-white/10"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveRange}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/25 cursor-pointer"
              >
                Lưu
              </button>
            </div>
          )}
        </div>

        {/* Visual Range Bar Graphic */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Min</span>
            <span className="text-cyan-400 font-bold">0 - 100%</span>
            <span>Max</span>
          </div>

          <div className="h-4 rounded-full bg-slate-950 border border-white/15 relative overflow-hidden p-0.5">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)] w-full" />
          </div>

          <div className="flex items-center justify-between font-mono font-black text-lg text-white mt-2">
            <span>{calibRangeMin} {calibUnit}</span>
            <span className="text-xs font-sans text-slate-400 font-medium">Δ {calibRangeMax - calibRangeMin} {calibUnit}</span>
            <span className="text-cyan-300">{calibRangeMax} {calibUnit}</span>
          </div>
        </div>

        {/* Parameter cards or Edit Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Min
            </span>
            {isEditingRange ? (
              <input
                type="number"
                step="0.1"
                value={minVal}
                onChange={(e) => setMinVal(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/20 text-lg font-black text-white font-mono focus:border-cyan-400"
              />
            ) : (
              <span className="text-2xl font-black text-white font-mono">
                {calibRangeMin} <span className="text-sm text-slate-400 font-sans">{calibUnit}</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Max
            </span>
            {isEditingRange ? (
              <input
                type="number"
                step="0.5"
                value={maxVal}
                onChange={(e) => setMaxVal(parseFloat(e.target.value) || 10)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-cyan-400 text-lg font-black text-white font-mono"
              />
            ) : (
              <span className="text-2xl font-black text-cyan-300 font-mono">
                {calibRangeMax} <span className="text-sm text-cyan-400/80 font-sans">{calibUnit}</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Đơn Vị Đo
            </span>
            {isEditingRange ? (
              <div className="grid grid-cols-2 gap-1.5">
                {(['Bar', 'mH2O', 'kPa', 'PSI'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnitVal(u)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                      unitVal === u
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-950 border border-white/15 text-slate-300 hover:text-white'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-2xl font-black text-white font-mono">
                {calibUnit}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Card: Quy trình 3 bước xác nhận hiệu chuẩn */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Hiệu Chuẩn 3 Điểm
            </h3>
          </div>

          <button
            type="button"
            onClick={resetCalibration}
            className="px-3.5 py-1.5 rounded-xl border border-white/15 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer self-end sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Khôi phục mặc định</span>
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              zeroConfirmed
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/60 border-white/10 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>BƯỚC 1</span>
              {zeroConfirmed ? (
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <span className="text-sm font-black text-white block mt-1">Lấy Điểm 0 (Zero)</span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              point1Confirmed
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-blue-950/30 border-blue-500/40 text-blue-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>BƯỚC 2 (BẮT BUỘC)</span>
              {point1Confirmed ? (
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              ) : (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300">Yêu cầu</span>
              )}
            </div>
            <span className="text-sm font-black text-white block mt-1">Mức Áp Chuẩn 1</span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border transition-all ${
              point2Confirmed
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/60 border-white/10 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold">
              <span>BƯỚC 3 (TÙY CHỌN)</span>
              {point2Confirmed && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
            </div>
            <span className="text-sm font-black text-white block mt-1">Mức Áp Tuyến Tính 2</span>
          </div>
        </div>

        {/* 3 Mục xác nhận chi tiết */}
        <div className="divide-y divide-white/10 mt-6 space-y-2">
          {/* Mức Áp 0 */}
          <div className="py-4 px-3 sm:px-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-white">Mức Áp 0 (Zero Tare)</span>
              {zeroConfirmed ? (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Đã xác nhận
                </span>
              ) : (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Chưa xác nhận
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right font-mono">
                <span className="text-xs text-slate-400 block">Hiện tại:</span>
                <span className="text-base font-bold text-white">0.02 {calibUnit}</span>
              </div>
              <button
                type="button"
                onClick={confirmZeroPoint}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold border border-white/15 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                Xác Nhận Mức 0
              </button>
            </div>
          </div>

          {/* Mức Áp 1 - BẮT BUỘC */}
          <div className="py-4 px-3 sm:px-4 rounded-2xl bg-slate-900/40 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-base font-black text-white">Mức Áp Chuẩn 1</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                BẮT BUỘC
              </span>
              {point1Confirmed && (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Hoàn thành
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <div className="flex items-center gap-2 font-mono text-sm bg-slate-950 p-1.5 rounded-xl border border-white/10">
                <span className="text-slate-400 font-sans text-xs px-1">Áp chuẩn:</span>
                <input
                  type="number"
                  step="0.1"
                  value={p1Input}
                  onChange={(e) => setP1Input(parseFloat(e.target.value) || 5.0)}
                  className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-white/20 text-sm font-bold text-white font-mono focus:border-cyan-400"
                />
                <span className="text-slate-300 font-bold text-xs pr-1">{calibUnit}</span>
              </div>
              <button
                type="button"
                onClick={() => confirmPoint1(p1Input)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black transition-all active:scale-95 shadow-md shadow-blue-600/30 cursor-pointer"
              >
                Xác Nhận Mức 1
              </button>
            </div>
          </div>

          {/* Mức Áp 2 - TÙY CHỌN */}
          <div className="py-4 px-3 sm:px-4 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-white">Mức Áp Chuẩn 2</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-white/10">
                TÙY CHỌN
              </span>
              {point2Confirmed && (
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Đã xác nhận
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <div className="flex items-center gap-2 font-mono text-sm bg-slate-950 p-1.5 rounded-xl border border-white/10">
                <span className="text-slate-400 font-sans text-xs px-1">Áp chuẩn:</span>
                <input
                  type="number"
                  step="0.1"
                  value={p2Input}
                  onChange={(e) => setP2Input(parseFloat(e.target.value) || 9.0)}
                  className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-white/20 text-sm font-bold text-white font-mono focus:border-cyan-400"
                />
                <span className="text-slate-300 font-bold text-xs pr-1">{calibUnit}</span>
              </div>
              <button
                type="button"
                onClick={() => confirmPoint2(p2Input)}
                className="px-5 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
              >
                Xác Nhận Mức 2
              </button>
            </div>
          </div>
        </div>

        {/* Footer info: Certificate status badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Trạng thái:</span>
            {isFullyCalibrated ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ĐẠT CHUẨN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 font-mono">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                CHƯA HOÀN TẤT
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 font-mono text-slate-400 text-xs">
            <span>Hiệu chuẩn: <strong className="text-white">{lastCalibratedDate}</strong></span>
            <span className="text-cyan-400 font-bold">Offset: +0.02V • Gain: 1.002</span>
          </div>
        </div>
      </div>
    </div>
  );
};
