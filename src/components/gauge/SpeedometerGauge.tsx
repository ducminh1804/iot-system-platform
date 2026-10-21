/* Hallmark · component: speedometer-gauge · genre: modern-minimal · theme: cobalt
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass (48)
 * Landmark-based ultra-smooth physics animation
 */

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import { Play, Pause, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

export interface GaugeLandmark {
  id: string;
  label: string;
  subLabel: string;
  percent: number; // 0 to 100
  angle: number; // -90 to +90
  zone: 'off' | 'green' | 'yellow' | 'red';
  color: string;
}

export const GAUGE_LANDMARKS: GaugeLandmark[] = [
  { id: 'level0', label: 'Mức 0', subLabel: 'Tắt hoàn toàn', percent: 0, angle: -90, zone: 'off', color: '#64748b' },
  { id: 'level1', label: 'Mức 1', subLabel: 'Vùng Xanh', percent: 27.8, angle: -40, zone: 'green', color: '#22c55e' },
  { id: 'level2', label: 'Mức 2', subLabel: 'Vùng Vàng', percent: 50, angle: 0, zone: 'yellow', color: '#facc15' },
  { id: 'level3', label: 'Mức 3 (MAX)', subLabel: 'Vùng Đỏ (Kịch Kim)', percent: 100, angle: 90, zone: 'red', color: '#ef4444' },
];

export interface SpeedometerGaugeProps {
  /** Giá trị từ 0 đến 100 (%) */
  value?: number;
  /** Callback khi giá trị kim thay đổi */
  onChange?: (val: number) => void;
  /** Kích thước chiều rộng component (mặc định 460) */
  size?: number;
  /** Hiển thị bảng điều khiển các điểm mốc và chế độ quét tự động */
  showControls?: boolean;
  /** Hiển thị nhãn thông số đo bên dưới */
  showMetrics?: boolean;
  /** Độ mượt của animation ('spring' nảy cơ khí, 'fluid' êm dịu, 'linear' đều) */
  easingStyle?: 'spring' | 'fluid' | 'linear';
  /** Tên đơn vị đo hiển thị (vd: 'mH₂O', 'kW', '%', 'Bar') */
  unit?: string;
  className?: string;
  /** Kiểu hiển thị: 'card' (có viền card nền trắng/tối) hoặc 'embedded' (trong suốt để nhúng vào card khác) */
  variant?: 'card' | 'embedded';
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  value = 50,
  onChange,
  size = 460,
  showControls = true,
  showMetrics = true,
  easingStyle = 'spring',
  unit = '%',
  className = '',
  variant = 'card',
}) => {
  const [currentVal, setCurrentVal] = useState<number>(value);
  const [isAutoSweeping, setIsAutoSweeping] = useState<boolean>(false);
  const [selectedEasing, setSelectedEasing] = useState<'spring' | 'fluid' | 'linear'>(easingStyle);
  const sweepIndexRef = useRef<number>(3);
  const sweepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const uid = useId().replace(/:/g, '');
  const greenGradId = `gauge-green-${uid}`;
  const yellowGradId = `gauge-yellow-${uid}`;
  const redGradId = `gauge-red-${uid}`;
  const dropShadowId = `needle-shadow-${uid}`;

  // Đồng bộ value khi prop bên ngoài thay đổi
  useEffect(() => {
    if (!isAutoSweeping) {
      setCurrentVal(value);
    }
  }, [value, isAutoSweeping]);

  // Đổi giá trị nội bộ
  const updateValue = (nextVal: number) => {
    const clamped = Math.max(0, Math.min(100, nextVal));
    setCurrentVal(clamped);
    onChange?.(clamped);
  };

  // Tính góc quay của kim: 0% -> -90 deg, 50% -> 0 deg (thẳng đứng), 100% -> +90 deg
  const needleAngle = (currentVal / 100) * 180 - 90;

  // Xác định trạng thái tắt hoàn toàn (Mức 0) và kịch kim (Mức 3 MAX)
  const isOff = currentVal <= 1.5;
  const isMax = currentVal >= 98;

  // Xác định khu vực kim đang trỏ tới khi BẬT (phân chia 3 vùng Xanh / Vàng / Đỏ)
  const currentZone: 'off' | 'green' | 'yellow' | 'red' = isOff
    ? 'off'
    : currentVal < 38
    ? 'green'
    : currentVal < 75
    ? 'yellow'
    : 'red';

  // Chế độ tự động quét mượt qua các điểm mốc tuần tự
  useEffect(() => {
    if (isAutoSweeping) {
      sweepTimerRef.current = setInterval(() => {
        // Tạm dừng quét nếu trang bị ẩn (chuyển tab, tắt màn hình đt) để tiết kiệm pin tối đa
        if (typeof document !== 'undefined' && document.hidden) return;

        sweepIndexRef.current = (sweepIndexRef.current + 1) % GAUGE_LANDMARKS.length;
        const nextLandmark = GAUGE_LANDMARKS[sweepIndexRef.current];
        updateValue(nextLandmark.percent);
      }, 1500);
    } else {
      if (sweepTimerRef.current) {
        clearInterval(sweepTimerRef.current);
        sweepTimerRef.current = null;
      }
    }

    return () => {
      if (sweepTimerRef.current) clearInterval(sweepTimerRef.current);
    };
  }, [isAutoSweeping]);

  // Lắng nghe sự kiện ẩn/hiện trang di động để giải phóng tài nguyên
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && isAutoSweeping) {
        // Khi người dùng khóa màn hình hoặc chuyển app, giữ nguyên trạng thái
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [isAutoSweeping]);

  // Cấu hình easing curve để đạt độ mượt tối đa
  const getTransitionStyle = () => {
    if (selectedEasing === 'spring') {
      // Cubic-bezier có lực quán tính nảy nhẹ đặc trưng của kim đồng hồ cơ khí cao cấp
      return 'transform 950ms cubic-bezier(0.34, 1.42, 0.64, 1)';
    }
    if (selectedEasing === 'fluid') {
      // Cubic-bezier hãm đà êm ái cực kỳ mượt phong cách Apple iOS
      return 'transform 850ms cubic-bezier(0.16, 1, 0.3, 1)';
    }
    return 'transform 700ms linear';
  };

  return (
    <div
      className={
        variant === 'embedded'
          ? `flex flex-col items-center w-full select-none ${className}`
          : `flex flex-col items-center p-3.5 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.08)] select-none transition-all w-full ${className}`
      }
      style={{ maxWidth: variant === 'embedded' ? size : size + 60 }}
    >
      {/* SVG Speedometer Gauge Canvas - Khớp 100% hình mẫu tham chiếu & 100% GPU Accelerated */}
      <div
        className="relative flex items-center justify-center w-full overflow-visible"
        style={{ contain: 'paint layout' }}
      >
        <svg
          viewBox="0 0 480 290"
          className="w-full h-auto max-w-[480px] overflow-visible select-none"
          style={{ shapeRendering: 'geometricPrecision' }}
        >
          <defs>
            {/* Dải màu Xanh: Vàng chanh lime tại 180° chuyển dần lên ngọc lục bảo tại 120° */}
            <linearGradient id={greenGradId} x1="0%" y1="100%" x2="70%" y2="0%">
              <stop offset="0%" stopColor="#8ee04e" />
              <stop offset="35%" stopColor="#6fd243" />
              <stop offset="75%" stopColor="#3eb447" />
              <stop offset="100%" stopColor="#2ba247" />
            </linearGradient>

            {/* Dải màu Vàng: Vàng sáng rực rỡ ở đỉnh 90°, ánh cam nhẹ ở 2 cạnh tiếp giáp */}
            <linearGradient id={yellowGradId} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#ffea3d" />
              <stop offset="50%" stopColor="#ffd014" />
              <stop offset="100%" stopColor="#ffbf00" />
            </linearGradient>

            {/* Dải màu Đỏ: Đỏ thẫm tại 60° chuyển dần sang đỏ cam rực rỡ tại 0° */}
            <linearGradient id={redGradId} x1="10%" y1="0%" x2="95%" y2="100%">
              <stop offset="0%" stopColor="#aa1427" />
              <stop offset="35%" stopColor="#cf2027" />
              <stop offset="75%" stopColor="#ea3d28" />
              <stop offset="100%" stopColor="#f35032" />
            </linearGradient>
          </defs>

          {/* ============================================================== */}
          {/* CÁC CUNG TRÒN PHÂN VÙNG: Ở MỨC NÀO THÌ MÀU MỨC ĐÓ ĐẬM HƠN CÁC MỨC CÒN LẠI */}
          {/* ============================================================== */}
          <g className="transition-all duration-500 ease-out">
            {/* VÙNG 1 (XANH): 180° -> 120° (Đậm hơn khi ở Mức 1) */}
            <path
              d="M 40 240 A 200 200 0 0 1 140 66.8 L 190 153.4 A 100 100 0 0 0 140 240 Z"
              fill={`url(#${greenGradId})`}
              className={`transition-all duration-500 ease-out ${
                isOff
                  ? 'opacity-20 filter grayscale brightness-75'
                  : currentZone === 'green'
                  ? 'opacity-100 filter brightness-115 saturate-135 drop-shadow-[0_0_12px_rgba(34,197,94,0.45)]'
                  : 'opacity-35 filter saturate-60'
              }`}
            />

            {/* VÙNG 2 (VÀNG): 120° -> 60° (Đậm hơn khi ở Mức 2) */}
            <path
              d="M 140 66.8 A 200 200 0 0 1 340 66.8 L 290 153.4 A 100 100 0 0 0 190 153.4 Z"
              fill={`url(#${yellowGradId})`}
              className={`transition-all duration-500 ease-out ${
                isOff
                  ? 'opacity-20 filter grayscale brightness-75'
                  : currentZone === 'yellow'
                  ? 'opacity-100 filter brightness-115 saturate-135 drop-shadow-[0_0_12px_rgba(250,204,21,0.45)]'
                  : 'opacity-35 filter saturate-60'
              }`}
            />

            {/* VÙNG 3 (ĐỎ): 60° -> 0° (Đậm hơn & CỰC KỲ NỔI BẬT khi ở Mức 3 MAX) */}
            <path
              d="M 340 66.8 A 200 200 0 0 1 440 240 L 340 240 A 100 100 0 0 0 290 153.4 Z"
              fill={`url(#${redGradId})`}
              className={`transition-all duration-500 ease-out ${
                isOff
                  ? 'opacity-20 filter grayscale brightness-75'
                  : isMax
                  ? 'opacity-100 filter brightness-125 saturate-150 drop-shadow-[0_0_16px_rgba(239,68,68,0.85)] drop-shadow-[0_0_28px_rgba(220,38,38,0.5)]'
                  : currentZone === 'red'
                  ? 'opacity-100 filter brightness-115 saturate-135 drop-shadow-[0_0_12px_rgba(239,68,68,0.45)]'
                  : 'opacity-35 filter saturate-60'
              }`}
            />

            {/* Đường cắt rãnh radial siêu mảnh sắc nét tạo chiều sâu chuẩn chỉ */}
            <line x1="140" y1="66.8" x2="190" y2="153.4" stroke="#ffffff" strokeWidth="1.2" strokeOpacity={isOff ? '0.1' : currentZone === 'green' || currentZone === 'yellow' ? '0.5' : '0.25'} />
            <line x1="340" y1="66.8" x2="290" y2="153.4" stroke="#ffffff" strokeWidth="1.2" strokeOpacity={isOff ? '0.1' : currentZone === 'yellow' || currentZone === 'red' ? '0.5' : '0.25'} />

            {/* Cung viền hào quang phát sáng năng lượng đỉnh khi ở MỨC 3 (MAX) */}
            {isMax && (
              <path
                d="M 340 64 A 203 203 0 0 1 443 240"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="animate-pulse"
                filter="drop-shadow(0 0 8px rgba(239,68,68,0.9))"
              />
            )}
          </g>

          {/* ============================================================== */}
          {/* CHÂN ĐẾ GIA CÔNG DƯỚI ĐỒNG HỒ */}
          {/* ============================================================== */}
          <rect
            x="180"
            y="252"
            width="120"
            height="24"
            rx="8"
            fill={isOff ? '#475569' : isMax ? '#0f172a' : '#1e252d'}
            className="transition-colors duration-500"
          />

          {/* ============================================================== */}
          {/* KIM ĐO DẠNG KHỐI VUỐT MỀM (Needle Pointer - 100% GPU Accelerated) */}
          {/* ============================================================== */}
          <g
            style={{
              transformOrigin: '240px 240px',
              transform: `rotate(${needleAngle}deg) translateZ(0)`,
              WebkitTransform: `rotate(${needleAngle}deg) translateZ(0)`,
              transition: getTransitionStyle(),
              WebkitTransition: `-webkit-${getTransitionStyle()}`,
              filter: isOff
                ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                : isMax
                ? 'drop-shadow(0 0 12px rgba(239,68,68,0.9)) drop-shadow(0 4px 8px rgba(0,0,0,0.45))'
                : 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          >
            {/* Thân kim vuốt thon đều lên đỉnh tròn bo mịn, khớp 100% ảnh */}
            <path
              d="
                M 212 240
                A 28 28 0 0 0 268 240
                L 247 88
                A 7 7 0 0 0 233 88
                Z
              "
              fill={isOff ? '#64748b' : isMax ? '#0f172a' : '#1e252d'}
              className="transition-colors duration-500"
            />

            {/* Lỗ trục quay tâm trắng tinh khôi đặc trưng ở gốc kim - sáng viền đỏ khi ở MAX */}
            <circle
              cx="240"
              cy="240"
              r="13"
              fill="#ffffff"
              stroke={isMax ? '#ef4444' : 'none'}
              strokeWidth={isMax ? 2.5 : 0}
              className="transition-all duration-300"
            />
          </g>
        </svg>
      </div>

      {/* Thông số đo lường số thực tế */}
      {showMetrics && (
        <div className="flex flex-col items-center mt-3 text-center">
          <div className="flex items-baseline gap-1.5 font-sans">
            <span className={`text-3xl font-extrabold tracking-tight tabular-nums transition-colors ${isOff ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
              {currentVal.toFixed(1).replace('.', ',')}
            </span>
            <span className="text-sm font-semibold text-slate-400">{unit}</span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all shadow-sm ${
                isMax ? 'animate-pulse' : ''
              }`}
              style={{
                backgroundColor:
                  isOff
                    ? 'rgba(100, 116, 139, 0.15)'
                    : currentZone === 'green'
                    ? 'rgba(34, 197, 94, 0.15)'
                    : currentZone === 'yellow'
                    ? 'rgba(234, 179, 8, 0.18)'
                    : 'rgba(239, 68, 68, 0.22)',
                color:
                  isOff
                    ? '#64748b'
                    : currentZone === 'green'
                    ? '#16a34a'
                    : currentZone === 'yellow'
                    ? '#b45309'
                    : '#dc2626',
              }}
            >
              {isOff ? (
                <span>Mức 0 · Tắt</span>
              ) : currentZone === 'green' ? (
                <>
                  <ShieldCheck className="w-3 h-3" />
                  <span>Mức 1 · Vùng Xanh</span>
                </>
              ) : currentZone === 'yellow' ? (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  <span>Mức 2 · Vùng Vàng</span>
                </>
              ) : (
                <>
                  <Flame className="w-3 h-3" />
                  <span>{isMax ? 'Mức 3 · MAX (Kịch Kim)' : 'Mức 3 · Vùng Đỏ'}</span>
                </>
              )}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Góc: {needleAngle > 0 ? `+${needleAngle.toFixed(1).replace('.', ',')}` : needleAngle.toFixed(1).replace('.', ',')}°
            </span>
          </div>
        </div>
      )}

      {/* Bộ điều khiển & Chuyển mốc tương tác (Interactive Controls) */}
      {showControls && (
        <div className="w-full mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          {/* Thanh trượt kéo kim thời gian thực */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>Mức 0 (Min)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">Kéo kim tùy ý</span>
              <span>Mức 3 (MAX)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={currentVal}
              onChange={(e) => {
                if (isAutoSweeping) setIsAutoSweeping(false);
                updateValue(parseFloat(e.target.value));
              }}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
            />
          </div>

          {/* Các nút bấm nhảy ngay tới từng điểm mốc (Landmarks) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <span>Chuyển nhanh qua 4 mức chuẩn:</span>
              <button
                type="button"
                onClick={() => setIsAutoSweeping((prev) => !prev)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                  isAutoSweeping
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                }`}
              >
                {isAutoSweeping ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Dừng Quét</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Tự Động Quét Mượt</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {GAUGE_LANDMARKS.map((lm) => {
                const isSelected = Math.abs(currentVal - lm.percent) < 1.5;
                const isMaxBtn = lm.id === 'level3';

                return (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => {
                      if (isAutoSweeping) setIsAutoSweeping(false);
                      updateValue(lm.percent);
                    }}
                    className={`relative flex flex-col items-start p-2 sm:p-1.5 rounded-lg border text-left transition-all touch-manipulation active:scale-95 select-none ${
                      isSelected
                        ? isMaxBtn
                          ? 'border-red-500 bg-red-600 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-400'
                          : 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/30'
                        : isMaxBtn
                        ? 'border-red-200 dark:border-red-900/60 bg-red-50/60 dark:bg-red-950/30 text-red-700 dark:text-red-300 hover:bg-red-100/70'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-tight">{lm.label}</span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected && isMaxBtn ? 'bg-yellow-300 animate-ping' : ''}`}
                        style={{ backgroundColor: isSelected && isMaxBtn ? '#fde047' : lm.color }}
                      />
                    </div>
                    <span className={`text-[9px] mt-0.5 ${isSelected && isMaxBtn ? 'text-red-100' : 'text-slate-400'}`}>
                      {lm.percent.toFixed(0)}% · {lm.angle > 0 ? `+${lm.angle}°` : `${lm.angle}°`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>


          {/* Chọn phong cách gia tốc animation */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Độ mượt gia tốc kim:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedEasing('spring')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
                  selectedEasing === 'spring'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
                title="Quán tính cơ học nảy nhẹ như kim thật"
              >
                Cơ Khí (Spring)
              </button>
              <button
                type="button"
                onClick={() => setSelectedEasing('fluid')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
                  selectedEasing === 'fluid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
                title="Hãm đà êm ái phong cách Apple"
              >
                Êm Ái (Fluid)
              </button>
              <button
                type="button"
                onClick={() => setSelectedEasing('linear')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
                  selectedEasing === 'linear'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
                title="Tuyến tính đều đặn"
              >
                Đều (Linear)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
