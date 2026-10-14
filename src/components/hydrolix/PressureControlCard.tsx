import React, { useState } from 'react';
import { MoreHorizontal, Gauge, Sparkles, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { SpeedometerGauge } from './SpeedometerGauge';

interface PressureStageConfig {
  id: 1 | 2 | 3;
  name: string;
  subLabel: string;
  pressureMh2o: number; // mH2O
  barEquivalent: number; // bar
  ringsCount: number; // số tầng sóng áp lực
  accentColor: string;
  glowColor: string;
  lightBg: string;
}

const STAGES: PressureStageConfig[] = [
  {
    id: 1,
    name: 'Mức 1',
    subLabel: 'Áp lực Thấp',
    pressureMh2o: 15.0,
    barEquivalent: 1.5,
    ringsCount: 1,
    accentColor: '#0284c7', // Sky Blue
    glowColor: 'rgba(2, 132, 199, 0.45)',
    lightBg: 'rgba(2, 132, 199, 0.08)',
  },
  {
    id: 2,
    name: 'Mức 2',
    subLabel: 'Áp lực Vừa',
    pressureMh2o: 30.0,
    barEquivalent: 3.0,
    ringsCount: 2,
    accentColor: '#2563eb', // Royal Blue
    glowColor: 'rgba(37, 99, 235, 0.45)',
    lightBg: 'rgba(37, 99, 235, 0.08)',
  },
  {
    id: 3,
    name: 'Mức 3',
    subLabel: 'Áp lực Cao',
    pressureMh2o: 45.0,
    barEquivalent: 4.5,
    ringsCount: 3,
    accentColor: '#0d9488', // Deep Cyan / Teal
    glowColor: 'rgba(13, 148, 136, 0.45)',
    lightBg: 'rgba(13, 148, 136, 0.08)',
  },
];

export const PressureControlCard: React.FC = () => {
  // Chế độ xem: 'stages' (3 thẻ sóng nén) hoặc 'gauge' (đồng hồ bán nguyệt)
  const [viewMode, setViewMode] = useState<'stages' | 'gauge'>('gauge');

  // Trạng thái bật/tắt độc lập của 3 mức áp lực
  const [stagesState, setStagesState] = useState<Record<1 | 2 | 3, boolean>>({
    1: true,
    2: true,
    3: false,
  });

  const activeStages = STAGES.filter((s) => stagesState[s.id]);
  const currentPressureOut = activeStages.length > 0
    ? Math.max(...activeStages.map((s) => s.pressureMh2o))
    : 0;
  const currentBarOut = activeStages.length > 0
    ? (currentPressureOut / 10).toFixed(1)
    : '0.0';

  // Quy đổi áp lực ra 4 vị trí kim chuẩn xác:
  // - Mức 0: -90° (tắt hoàn toàn dải màu, grayscale)
  // - Mức 1: -40° (vùng Xanh đậm hơn)
  // - Mức 2: 0° (thẳng đứng 12h như ảnh mẫu, vùng Vàng đậm hơn)
  // - Mức 3 (MAX): +90° (kịch kim cực phải, vùng Đỏ bừng sáng phát quang nổi bật)
  const activeLevel: 0 | 1 | 2 | 3 =
    currentPressureOut === 0
      ? 0
      : currentPressureOut === 15
      ? 1
      : currentPressureOut === 30
      ? 2
      : 3;

  const isOff = activeLevel === 0;
  const needleAngle =
    activeLevel === 0
      ? -90
      : activeLevel === 1
      ? -40
      : activeLevel === 2
      ? 0
      : 90; // Kịch kim MAX cực phải

  // Lưu lượng và vận tốc phản hồi
  const totalFlowRate = activeStages.reduce((sum, s) => sum + s.pressureMh2o * 2.5, 0);
  const velocity = activeStages.length > 0 ? (totalFlowRate / 42).toFixed(2) : '0.00';

  const handleToggleStage = (id: 1 | 2 | 3) => {
    const nextState = !stagesState[id];
    setStagesState((prev) => ({
      ...prev,
      [id]: nextState,
    }));

    const stage = STAGES.find((s) => s.id === id);
    if (stage) {
      if (nextState) {
        toast.success(`Đã BẬT ${stage.name} · Kích hoạt áp lực ${stage.pressureMh2o} mH₂O (${stage.barEquivalent} Bar)`, {
          duration: 2000,
        });
      } else {
        toast.info(`Đã TẮT ${stage.name} · Giải phóng áp lực`, {
          duration: 1800,
        });
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
              Điều Khiển Mức Áp Lực
            </h3>
            <p className="text-[10px] text-slate-400">Chạm để Bật/Tắt mức áp lực & kiểm tra kim quay</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Nút gạt chuyển chế độ xem Đồng Hồ Bán Nguyệt / 3 Cấp Áp Lực */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setViewMode('gauge')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                viewMode === 'gauge'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Đồng Hồ SVG
            </button>
            <button
              type="button"
              onClick={() => setViewMode('stages')}
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                viewMode === 'stages'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              3 Cấp Sóng
            </button>
          </div>

          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
              isOff
                ? 'bg-slate-100 text-slate-500 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                : activeLevel === 3
                ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>{isOff ? '0 mH₂O (TẮT)' : activeLevel === 3 ? `${currentPressureOut} mH₂O (MAX)` : `${currentPressureOut} mH₂O`}</span>
          </div>
        </div>
      </div>

      {/* Chế độ 1: Đồng hồ bán nguyệt SVG khớp 100% mẫu */}
      {viewMode === 'gauge' ? (
        <div className="flex flex-col items-center justify-between my-1 py-1 w-full flex-1">
          {/* SVG Gauge Semicircle - Đã tối ưu GPU Composite Layer cho điện thoại, KHÔNG CÓ TEXT ĐÈ */}
          <div
            className="w-full max-w-[240px] xs:max-w-[260px] sm:max-w-[280px] flex items-center justify-center relative"
            style={{ contain: 'paint layout' }}
          >
            <svg
              viewBox="0 0 480 290"
              className="w-full h-auto overflow-visible select-none"
              style={{ shapeRendering: 'geometricPrecision' }}
            >
              <defs>
                <linearGradient id="pcard-green" x1="0%" y1="100%" x2="70%" y2="0%">
                  <stop offset="0%" stopColor="#8ee04e" />
                  <stop offset="35%" stopColor="#6fd243" />
                  <stop offset="75%" stopColor="#3eb447" />
                  <stop offset="100%" stopColor="#2ba247" />
                </linearGradient>
                <linearGradient id="pcard-yellow" x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%" stopColor="#ffea3d" />
                  <stop offset="50%" stopColor="#ffd014" />
                  <stop offset="100%" stopColor="#ffbf00" />
                </linearGradient>
                <linearGradient id="pcard-red" x1="10%" y1="0%" x2="95%" y2="100%">
                  <stop offset="0%" stopColor="#aa1427" />
                  <stop offset="35%" stopColor="#cf2027" />
                  <stop offset="75%" stopColor="#ea3d28" />
                  <stop offset="100%" stopColor="#f35032" />
                </linearGradient>
              </defs>

              {/* 3 Cung tròn phân vùng - Ở MỨC NÀO THÌ MÀU MỨC ĐÓ ĐẬM HƠN CÁC MỨC CÒN LẠI */}
              <g className="transition-all duration-500 ease-out">
                {/* Vùng Xanh: 180° -> 120° (Đậm hơn khi ở Mức 1) */}
                <path
                  d="M 40 240 A 200 200 0 0 1 140 66.8 L 190 153.4 A 100 100 0 0 0 140 240 Z"
                  fill="url(#pcard-green)"
                  className={`transition-all duration-500 ease-out ${
                    isOff
                      ? 'opacity-20 filter grayscale brightness-75'
                      : activeLevel === 1
                      ? 'opacity-100 filter brightness-115 saturate-135 drop-shadow-[0_0_12px_rgba(34,197,94,0.45)]'
                      : 'opacity-35 filter saturate-60'
                  }`}
                />

                {/* Vùng Vàng: 120° -> 60° (Đậm hơn khi ở Mức 2) */}
                <path
                  d="M 140 66.8 A 200 200 0 0 1 340 66.8 L 290 153.4 A 100 100 0 0 0 190 153.4 Z"
                  fill="url(#pcard-yellow)"
                  className={`transition-all duration-500 ease-out ${
                    isOff
                      ? 'opacity-20 filter grayscale brightness-75'
                      : activeLevel === 2
                      ? 'opacity-100 filter brightness-115 saturate-135 drop-shadow-[0_0_12px_rgba(250,204,21,0.45)]'
                      : 'opacity-35 filter saturate-60'
                  }`}
                />

                {/* Vùng Đỏ: 60° -> 0° (Đậm hơn & CỰC KỲ NỔI BẬT khi ở Mức 3 MAX) */}
                <path
                  d="M 340 66.8 A 200 200 0 0 1 440 240 L 340 240 A 100 100 0 0 0 290 153.4 Z"
                  fill="url(#pcard-red)"
                  className={`transition-all duration-500 ease-out ${
                    isOff
                      ? 'opacity-20 filter grayscale brightness-75'
                      : activeLevel === 3
                      ? 'opacity-100 filter brightness-125 saturate-150 drop-shadow-[0_0_16px_rgba(239,68,68,0.85)] drop-shadow-[0_0_28px_rgba(220,38,38,0.5)]'
                      : 'opacity-35 filter saturate-60'
                  }`}
                />

                {/* Rãnh cắt radial mảnh */}
                <line x1="140" y1="66.8" x2="190" y2="153.4" stroke="#ffffff" strokeWidth="1.2" strokeOpacity={isOff ? '0.1' : activeLevel === 1 || activeLevel === 2 ? '0.5' : '0.25'} />
                <line x1="340" y1="66.8" x2="290" y2="153.4" stroke="#ffffff" strokeWidth="1.2" strokeOpacity={isOff ? '0.1' : activeLevel === 2 || activeLevel === 3 ? '0.5' : '0.25'} />

                {/* Cung viền hào quang phát sáng năng lượng đỉnh khi ở MỨC 3 (MAX) */}
                {activeLevel === 3 && (
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

              {/* Chân đế dưới đáy */}
              <rect
                x="180"
                y="252"
                width="120"
                height="24"
                rx="8"
                fill={isOff ? '#475569' : activeLevel === 3 ? '#0f172a' : '#1e252d'}
                className="transition-colors duration-500"
              />

              {/* Kim chuyển động siêu mượt - 100% GPU Hardware Accelerated */}
              <g
                style={{
                  transformOrigin: '240px 240px',
                  transform: `rotate(${needleAngle}deg) translateZ(0)`,
                  WebkitTransform: `rotate(${needleAngle}deg) translateZ(0)`,
                  transition: 'transform 950ms cubic-bezier(0.34, 1.42, 0.64, 1)',
                  WebkitTransition: '-webkit-transform 950ms cubic-bezier(0.34, 1.42, 0.64, 1)',
                  filter: isOff
                    ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    : activeLevel === 3
                    ? 'drop-shadow(0 0 12px rgba(239,68,68,0.9)) drop-shadow(0 4px 8px rgba(0,0,0,0.45))'
                    : 'drop-shadow(0 4px 6px rgba(0,0,0,0.35))',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <path
                  d="M 212 240 A 28 28 0 0 0 268 240 L 247 88 A 7 7 0 0 0 233 88 Z"
                  fill={isOff ? '#64748b' : activeLevel === 3 ? '#0f172a' : '#1e252d'}
                  className="transition-colors duration-500"
                />
                {/* Vòng khuyên tròn trục kim - Sáng viền đỏ rực cảnh báo khi ở MAX */}
                <circle
                  cx="240"
                  cy="240"
                  r="13"
                  fill="#ffffff"
                  stroke={activeLevel === 3 ? '#ef4444' : 'none'}
                  strokeWidth={activeLevel === 3 ? 2.5 : 0}
                  className="transition-all duration-300"
                />
              </g>
            </svg>
          </div>

          {/* Nhãn mốc hiển thị & Nút kích hoạt 4 vị trí trực tiếp */}
          <div className="w-full mt-1.5 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] sm:text-xs font-bold transition-colors ${isOff ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                {isOff ? '0 mH₂O (0.0 Bar) · ĐÃ NGẮT' : `${currentPressureOut} mH₂O (${currentBarOut} Bar)`}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-all ${
                  isOff
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                    : activeLevel === 1
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                    : activeLevel === 2
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                    : 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/25 animate-pulse'
                }`}
              >
                {isOff
                  ? 'Mức 0 · Tắt'
                  : activeLevel === 1
                  ? 'Mức 1 · Xanh'
                  : activeLevel === 2
                  ? 'Mức 2 · Vàng'
                  : 'Mức 3 · MAX (Kịch Kim)'}
              </span>
            </div>

            {/* Bộ 4 nút kích hoạt 4 vị trí chuẩn: Mức 0, Mức 1, Mức 2, Mức 3 (MAX) */}
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 w-full">
              {/* Vị trí 1: Mức 0 (Tắt) */}
              <button
                type="button"
                onClick={() => setStagesState({ 1: false, 2: false, 3: false })}
                className={`py-1.5 px-1 rounded-lg text-[9px] sm:text-[10px] font-bold border transition-all text-center touch-manipulation active:scale-95 select-none ${
                  isOff
                    ? 'bg-slate-800 text-white border-slate-700 shadow-sm ring-2 ring-slate-400/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                Mức 0
              </button>

              {/* Vị trí 2: Mức 1 */}
              <button
                type="button"
                onClick={() => setStagesState({ 1: true, 2: false, 3: false })}
                className={`py-1.5 px-1 rounded-lg text-[9px] sm:text-[10px] font-bold border transition-all text-center touch-manipulation active:scale-95 select-none ${
                  activeLevel === 1
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-400/40'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
                }`}
              >
                Mức 1
              </button>

              {/* Vị trí 3: Mức 2 */}
              <button
                type="button"
                onClick={() => setStagesState({ 1: true, 2: true, 3: false })}
                className={`py-1.5 px-1 rounded-lg text-[9px] sm:text-[10px] font-bold border transition-all text-center touch-manipulation active:scale-95 select-none ${
                  activeLevel === 2
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm ring-2 ring-amber-300/40'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100'
                }`}
              >
                Mức 2
              </button>

              {/* Vị trí 4: Mức 3 (MAX - Cực kỳ nổi bật) */}
              <button
                type="button"
                onClick={() => setStagesState({ 1: true, 2: true, 3: true })}
                className={`relative py-1.5 px-1 rounded-lg text-[9px] sm:text-[10px] font-bold border transition-all text-center touch-manipulation active:scale-95 select-none overflow-hidden ${
                  activeLevel === 3
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/30 ring-2 ring-red-400 animate-pulse'
                    : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/60 hover:bg-red-100 hover:border-red-300'
                }`}
              >
                <span>Mức 3 (MAX)</span>
                {activeLevel === 3 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Chế độ 2: 3 Thẻ Mức Áp Lực Tinh Tế & Hiện Đại */
        <div className="grid grid-cols-3 gap-2.5 my-1.5">
          {STAGES.map((stage) => {
            const isOn = stagesState[stage.id];

            return (
              <div
                key={stage.id}
                onClick={() => handleToggleStage(stage.id)}
                className={`group relative flex flex-col items-center justify-between p-3 rounded-2xl border text-center transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isOn
                    ? 'bg-white dark:bg-slate-800 border-blue-400/80 shadow-[0_8px_24px_rgba(37,99,235,0.12)] scale-[1.02]'
                    : 'bg-slate-50/60 dark:bg-slate-850/40 border-slate-200/80 dark:border-slate-800 opacity-65 hover:opacity-95 hover:border-slate-300'
                }`}
              >
                {/* Tiêu đề & Đèn trạng thái */}
                <div className="w-full flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 font-sans">
                    {stage.name}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isOn ? 'ring-2 ring-offset-1' : 'opacity-25'
                    }`}
                    style={{
                      backgroundColor: stage.accentColor,
                      boxShadow: isOn ? `0 0 10px ${stage.glowColor}` : 'none',
                    }}
                  />
                </div>

                {/* Biểu tượng Sóng Áp Lực Nén Trừu Tượng Tinh Tế (Modern Radial Isobaric Pressure Icon) */}
                <div className="relative w-16 h-16 flex items-center justify-center my-1">
                  <svg
                    viewBox="0 0 64 64"
                    className="w-full h-full overflow-visible transition-transform duration-500 group-hover:scale-108"
                  >
                    {/* Vòng nền chuẩn */}
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      className={isOn ? 'text-slate-100 dark:text-slate-800' : 'text-slate-200 dark:text-slate-800'}
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />

                    {/* Vòng ngoài cùng (Cấp 3 có 3 vòng, Cấp 2 có 2 vòng, Cấp 1 có 1 vòng) */}
                    {stage.ringsCount >= 3 && (
                      <circle
                        cx="32"
                        cy="32"
                        r="24"
                        fill="none"
                        stroke={isOn ? stage.accentColor : '#94a3b8'}
                        strokeWidth={isOn ? '2' : '1.2'}
                        strokeDasharray={isOn ? '4 2' : 'none'}
                        className={isOn ? 'animate-[spin_16s_linear_infinite]' : 'opacity-30'}
                        opacity={isOn ? 0.8 : 0.25}
                      />
                    )}

                    {stage.ringsCount >= 2 && (
                      <circle
                        cx="32"
                        cy="32"
                        r="18"
                        fill="none"
                        stroke={isOn ? stage.accentColor : '#94a3b8'}
                        strokeWidth={isOn ? '2.4' : '1.2'}
                        className={isOn ? 'transition-all duration-300' : 'opacity-40'}
                        opacity={isOn ? 0.9 : 0.35}
                      />
                    )}

                    {/* Vòng nén áp lực trong tâm (Core Pressure Ring) */}
                    <circle
                      cx="32"
                      cy="32"
                      r="12"
                      fill={isOn ? stage.lightBg : 'none'}
                      stroke={isOn ? stage.accentColor : '#94a3b8'}
                      strokeWidth={isOn ? '2.8' : '1.5'}
                      className="transition-all duration-300"
                    />

                    {/* Tâm điểm áp lực (Pressure Core Vector) */}
                    <circle
                      cx="32"
                      cy="32"
                      r={isOn ? '4.5' : '3'}
                      fill={isOn ? stage.accentColor : '#94a3b8'}
                      className="transition-all duration-300"
                    />

                    {/* Các mũi tên nén hướng tâm (Centripetal Pressure Vectors) khi BẬT */}
                    {isOn && (
                      <g className="transition-opacity duration-300">
                        {/* 4 Mũi tên nén hướng tâm */}
                        <path d="M 32 4 L 32 8" stroke={stage.accentColor} strokeWidth="2" strokeLinecap="round" />
                        <path d="M 32 60 L 32 56" stroke={stage.accentColor} strokeWidth="2" strokeLinecap="round" />
                        <path d="M 4 32 L 8 32" stroke={stage.accentColor} strokeWidth="2" strokeLinecap="round" />
                        <path d="M 60 32 L 56 32" stroke={stage.accentColor} strokeWidth="2" strokeLinecap="round" />
                      </g>
                    )}
                  </svg>

                  {/* Sóng áp lực lan toả mềm khi BẬT */}
                  {isOn && (
                    <span
                      className="absolute inset-2 rounded-full animate-ping opacity-20 pointer-events-none"
                      style={{ backgroundColor: stage.accentColor }}
                    />
                  )}
                </div>

                {/* Thông số áp lực hiển thị nổi bật */}
                <div className="w-full mt-0.5">
                  <span
                    className={`text-xs font-black tracking-tight block font-sans transition-colors ${
                      isOn ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}
                  >
                    {isOn ? `${stage.pressureMh2o} mH₂O` : '0 mH₂O'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block">
                    {stage.subLabel} · {stage.barEquivalent} Bar
                  </span>
                </div>

                {/* Công tắc Bật/Tắt mini (Sleek Tactile Pill Switch) */}
                <div className="w-full mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <div
                    className={`w-full py-1 rounded-lg text-[9px] font-bold tracking-wider transition-all duration-200 flex items-center justify-center gap-1 ${
                      isOn
                        ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-sm'
                        : 'bg-slate-200/70 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOn ? 'bg-emerald-400' : 'bg-slate-400'
                      }`}
                    />
                    <span>{isOn ? 'BẬT (ON)' : 'TẮT (OFF)'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dải Telemetry SCADA Đo Lường Mạng Lưới (Áp lực & Lưu lượng) */}
      <div className="p-2 rounded-xl bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-[10px]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-sans">
          {/* Cột Trái */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Battery:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">3.6V</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Velocity:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{velocity} m/s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Angle:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">0°</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Net Flow Total:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {activeStages.length > 0 ? '1,420 m³' : '0 m³'}
              </span>
            </div>
          </div>

          {/* Cột Phải */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pressure In:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                52.4 mH₂O
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Pressure Out:</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {currentPressureOut.toFixed(1)} mH₂O
                <span className="text-[9px] font-normal text-slate-400 ml-1">({currentBarOut} Bar)</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">FlowRate:</span>
              <span className="font-bold text-slate-800 dark:text-slate-100">
                {totalFlowRate.toFixed(1)} m³/h
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Forward Flow:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {activeStages.length > 0 ? '890 m³' : '0 m³'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
