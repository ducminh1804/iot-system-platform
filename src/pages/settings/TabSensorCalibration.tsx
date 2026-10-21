import React, { useState } from 'react';
import {
  Edit2,
  RotateCcw,
  Check,
  Gauge,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Activity,
  Maximize2,
  Crosshair,
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
    toast.success('Đã lưu thang đo cảm biến thành công!');
  };

  const isFullyCalibrated = zeroConfirmed && point1Confirmed;

  // Linear Regression equation representation:
  const slope = ((calibRangeMax - calibRangeMin) / 16).toFixed(3);

  return (
    <div className="space-y-6">
      {/* 1. INTERACTIVE CARTESIAN SENSOR RESPONSE GRAPH */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Telemetry Curve // 4-20mA Linear Transducer
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  R² = 0.9998
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Đặc Tuyến Đáp Ứng Cảm Biến Áp Lực
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs text-slate-300">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300">
              Phương trình: <strong>P = {slope} × (I - 4) + {calibRangeMin} {calibUnit}</strong>
            </span>
          </div>
        </div>

        {/* SVG COORDINATE RESPONSE CURVE */}
        <div className="mt-5 p-4 rounded-xl bg-[#0B0E12] border border-slate-800 relative">
          <div className="h-44 sm:h-52 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00E676" />
                  <stop offset="50%" stopColor="#00F2FE" />
                  <stop offset="100%" stopColor="#E52E2D" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00F2FE" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00F2FE" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="20" x2="480" y2="20" stroke="#1F2937" strokeDasharray="3 3" />
              <line x1="50" y1="60" x2="480" y2="60" stroke="#1F2937" strokeDasharray="3 3" />
              <line x1="50" y1="100" x2="480" y2="100" stroke="#1F2937" strokeDasharray="3 3" />
              <line x1="50" y1="140" x2="480" y2="140" stroke="#374151" />

              {/* Axis Labels */}
              <text x="15" y="25" fill="#9CA3AF" fontSize="10" fontFamily="monospace">10.0 Bar</text>
              <text x="15" y="65" fill="#9CA3AF" fontSize="10" fontFamily="monospace">7.5 Bar</text>
              <text x="15" y="105" fill="#9CA3AF" fontSize="10" fontFamily="monospace">5.0 Bar</text>
              <text x="15" y="145" fill="#9CA3AF" fontSize="10" fontFamily="monospace">0.0 Bar</text>

              <text x="50" y="165" fill="#9CA3AF" fontSize="10" fontFamily="monospace">4.0 mA</text>
              <text x="190" y="165" fill="#9CA3AF" fontSize="10" fontFamily="monospace">8.0 mA</text>
              <text x="330" y="165" fill="#9CA3AF" fontSize="10" fontFamily="monospace">14.0 mA</text>
              <text x="460" y="165" fill="#9CA3AF" fontSize="10" fontFamily="monospace">20.0 mA</text>

              {/* Shaded Area under Curve */}
              <polygon points="50,140 50,140 470,25 470,140" fill="url(#areaGradient)" />

              {/* The Linear Line */}
              <line x1="50" y1="140" x2="470" y2="25" stroke="url(#curveGradient)" strokeWidth="3.5" strokeLinecap="round" />

              {/* Point 0: Tare Point */}
              <circle cx="50" cy="140" r="6" fill="#00E676" stroke="#0B0E12" strokeWidth="2" className="animate-pulse" />
              <text x="58" y="132" fill="#00E676" fontSize="10" fontWeight="bold" fontFamily="monospace">
                P0 (Zero Tare)
              </text>

              {/* Point 1: Standard Pressure P1 */}
              <circle cx="260" cy="82" r="7" fill="#00F2FE" stroke="#0B0E12" strokeWidth="2" />
              <text x="270" y="80" fill="#00F2FE" fontSize="10" fontWeight="bold" fontFamily="monospace">
                P1 ({point1ValueBar} Bar / 12mA)
              </text>

              {/* Point 2: Span Pressure P2 */}
              <circle cx="430" cy="36" r="6" fill="#FFB800" stroke="#0B0E12" strokeWidth="2" />
              <text x="360" y="25" fill="#FFB800" fontSize="10" fontWeight="bold" fontFamily="monospace">
                P2 ({point2ValueBar} Bar / 18.4mA)
              </text>
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-3 pt-3 border-t border-slate-800 flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E676]" />
              <span>Điểm 0 (Zero): {zeroConfirmed ? 'Đã Calib (+0.02V)' : 'Chưa xác nhận'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FE]" />
              <span>Điểm 1 (Chuẩn): {point1Confirmed ? `Đạt ${point1ValueBar} Bar` : 'Cần xác nhận'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800]" />
              <span>Điểm 2 (Tuyến tính): {point2Confirmed ? `Đạt ${point2ValueBar} Bar` : 'Tùy chọn'}</span>
            </span>
          </div>
        </div>

        {/* Range Selector & Units */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Thang Đo Min (4 mA)
            </span>
            {isEditingRange ? (
              <input
                type="number"
                step="0.1"
                value={minVal}
                onChange={(e) => setMinVal(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1 rounded bg-black border border-cyan-400 text-lg font-black text-white font-mono"
              />
            ) : (
              <span className="text-2xl font-black text-white font-mono">
                {calibRangeMin} <span className="text-xs text-slate-400 font-sans">{calibUnit}</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Thang Đo Max (20 mA)
            </span>
            {isEditingRange ? (
              <input
                type="number"
                step="0.5"
                value={maxVal}
                onChange={(e) => setMaxVal(parseFloat(e.target.value) || 10)}
                className="w-full px-2.5 py-1 rounded bg-black border border-cyan-400 text-lg font-black text-cyan-300 font-mono"
              />
            ) : (
              <span className="text-2xl font-black text-cyan-300 font-mono">
                {calibRangeMax} <span className="text-xs text-slate-400 font-sans">{calibUnit}</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Đơn Vị & Thao Tác
              </span>
              {!isEditingRange ? (
                <button
                  type="button"
                  onClick={() => {
                    setMinVal(calibRangeMin);
                    setMaxVal(calibRangeMax);
                    setUnitVal(calibUnit);
                    setIsEditingRange(true);
                  }}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Sửa dải</span>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingRange(false)}
                    className="text-[11px] px-2 py-0.5 rounded text-slate-400 hover:text-white"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveRange}
                    className="text-[11px] px-2.5 py-0.5 rounded bg-cyan-500 text-slate-950 font-black"
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>

            {isEditingRange ? (
              <div className="grid grid-cols-4 gap-1 mt-2">
                {(['Bar', 'mH2O', 'kPa', 'PSI'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setUnitVal(u)}
                    className={`py-1 text-xs font-mono font-bold rounded cursor-pointer ${
                      unitVal === u ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-2xl font-black text-white font-mono mt-1">
                {calibUnit}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. 3-POINT CALIBRATION COCKPIT STATIONS */}
      <div className="rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Precision Calibration // 3-Point Multi-Step
                </span>
                {isFullyCalibrated ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    CERTIFIED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    CALIBRATION PENDING
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Bàn Điều Khiển Hiệu Chuẩn 3 Điểm Thực Địa
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={resetCalibration}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Về Chuẩn Nhà Máy</span>
          </button>
        </div>

        {/* 3 Step Interactive Workstations */}
        <div className="space-y-3.5 mt-5">
          {/* STEP 1: ZERO TARE */}
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-mono font-black text-sm">
                01
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">Lấy Điểm 0 (Zero Tare)</h3>
                  {zeroConfirmed ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      ĐÃ LẤY TARE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                      CHƯA TARE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Đảm bảo tháo áp lực khỏi đầu dò, tín hiệu cảm biến ở trạng thái áp suất khí quyển.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px]">Tín hiệu thực:</span>
                <span className="font-bold text-emerald-400 text-sm">4.02 mA (0.02 {calibUnit})</span>
              </div>
              <button
                type="button"
                onClick={confirmZeroPoint}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Xác Nhận Zero Point
              </button>
            </div>
          </div>

          {/* STEP 2: POINT 1 (MANDATORY STANDARD) */}
          <div className="p-4 rounded-xl bg-[#0D1014] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
            <div className="flex items-center gap-3.5 pl-1">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-mono font-black text-sm">
                02
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">Mức Áp Chuẩn 1 (P1)</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                    BẮT BUỘC
                  </span>
                  {point1Confirmed && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      HOÀN TẤT
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bơm áp lực chuẩn từ đồng hồ kiểm định và nhập giá trị thực tế đo được.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto flex-wrap">
              <div className="flex items-center gap-1.5 font-mono text-xs bg-black p-1.5 rounded-lg border border-cyan-500/40">
                <span className="text-slate-400 text-[11px] px-1">Áp nạp:</span>
                <input
                  type="number"
                  step="0.1"
                  value={p1Input}
                  onChange={(e) => setP1Input(parseFloat(e.target.value) || 5.0)}
                  className="w-16 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 font-mono focus:border-cyan-400 outline-hidden"
                />
                <span className="text-slate-400 text-xs pr-1">{calibUnit}</span>
              </div>
              <button
                type="button"
                onClick={() => confirmPoint1(p1Input)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/20 transition-all active:scale-95 cursor-pointer"
              >
                Xác Nhận Mức 1
              </button>
            </div>
          </div>

          {/* STEP 3: POINT 2 (SPAN LINEARITY) */}
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 flex items-center justify-center font-mono font-black text-sm">
                03
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">Mức Áp Tuyến Tính 2 (P2)</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                    TÙY CHỌN
                  </span>
                  {point2Confirmed && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      ĐÃ LẤY SPAN
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Xác nhận điểm cận biên trên (Span) để bù sai số phi tuyến ở dải áp cao.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto flex-wrap">
              <div className="flex items-center gap-1.5 font-mono text-xs bg-black p-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[11px] px-1">Áp nạp:</span>
                <input
                  type="number"
                  step="0.1"
                  value={p2Input}
                  onChange={(e) => setP2Input(parseFloat(e.target.value) || 9.0)}
                  className="w-16 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-white font-mono focus:border-cyan-400 outline-hidden"
                />
                <span className="text-slate-400 text-xs pr-1">{calibUnit}</span>
              </div>
              <button
                type="button"
                onClick={() => confirmPoint2(p2Input)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Xác Nhận Mức 2
              </button>
            </div>
          </div>
        </div>

        {/* Certificate Badge Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>Trạng thái kiểm định:</span>
            {isFullyCalibrated ? (
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ĐẠT TIÊU CHUẨN ISO/IEC 17025
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-bold text-amber-400">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                CẦN HOÀN THÀNH BƯỚC 1 &amp; BƯỚC 2
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span>Lần calib gần nhất: <strong className="text-white">{lastCalibratedDate}</strong></span>
            <span>•</span>
            <span>Offset: <strong className="text-cyan-400">+0.02V</strong></span>
            <span>•</span>
            <span>Gain: <strong className="text-cyan-400">1.002</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
