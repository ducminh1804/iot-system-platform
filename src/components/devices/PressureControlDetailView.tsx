import React, { useState, useEffect } from 'react';
import { SpeedometerGauge } from '@/components/gauge/SpeedometerGauge';
import {
  ArrowLeft,
  Wifi,
  Clock,
  Battery,
  Activity,
  CheckCircle2,
  Droplets,
  Gauge,
  Zap,
  PowerOff,
  ShieldAlert,
  Settings,
  Save,
  RefreshCw,
  SlidersHorizontal,
  ShieldCheck,
  Check,
  Radio,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

interface PressureControlDetailViewProps {
  onBack: () => void;
}

/**
 * Định dạng số theo chuẩn Việt Nam:
 * - Hàng nghìn phân tách bằng dấu chấm (.)
 * - Số thập phân phân tách bằng dấu phẩy (,)
 * Ví dụ: 1653377.3 -> "1.653.377,3", 12.46 -> "12,46"
 */
export function formatVNNumber(
  val: number | string,
  fractionDigits: number = 1
): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return String(val);

  const fixed = num.toFixed(fractionDigits);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return decPart !== undefined ? `${formattedInt},${decPart}` : formattedInt;
}

export function PressureControlDetailView({ onBack }: PressureControlDetailViewProps) {
  // Trạng thái hiển thị modal cài đặt: true (mở modal đè lên giao diện chính) | false (đóng modal)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Trạng thái mức áp đang chọn kích hoạt:
  // 0: Đóng nước (cả 3 đồng hồ về 0) | 1: Mức áp 1 | 2: Mức áp 2 | 3: Mở full
  const [activeLevel, setActiveLevel] = useState<0 | 1 | 2 | 3>(1);

  // Cấu hình tham số trạm (Settings Form States)
  const [cfgTargetP1, setCfgTargetP1] = useState<number>(27.8);
  const [cfgTargetP2, setCfgTargetP2] = useState<number>(50.0);
  const [cfgTargetP3, setCfgTargetP3] = useState<number>(100.0);
  const [cfgRatio0, setCfgRatio0] = useState<string>('1.5');
  const [cfgRatio90, setCfgRatio90] = useState<string>('1.0');
  const [cfgReportInterval, setCfgReportInterval] = useState<string>('10s');
  const [cfgModbusId, setCfgModbusId] = useState<number>(1);
  const [cfgBaudRate, setCfgBaudRate] = useState<string>('9600');
  const [cfgAlarmPInHigh, setCfgAlarmPInHigh] = useState<number>(35.0);
  const [cfgAlarmPInLow, setCfgAlarmPInLow] = useState<number>(10.0);
  const [cfgAlarmPOutHigh, setCfgAlarmPOutHigh] = useState<number>(30.0);
  const [cfgAlarmDeltaP, setCfgAlarmDeltaP] = useState<number>(15.0);
  const [cfgAutoShutoff, setCfgAutoShutoff] = useState<boolean>(true);
  const [cfgRtcAutoSync, setCfgRtcAutoSync] = useState<boolean>(true);
  const [cfgLowBattery, setCfgLowBattery] = useState<number>(11.5);

  // Giá trị kim đồng hồ của từng mức (0 = Tắt hoàn toàn)
  const [gaugeVal1, setGaugeVal1] = useState<number>(27.8); // Mức áp 1 (Vùng Xanh)
  const [gaugeVal2, setGaugeVal2] = useState<number>(0);    // Mức áp 2 (Tắt)
  const [gaugeVal3, setGaugeVal3] = useState<number>(0);    // Mở full (Tắt)
  const [rtcTime, setRtcTime] = useState<string>('21-10-2026 14:27:25');

  // Thời gian gần nhất thực hiện thao tác trên từng mức
  const [lastActionTime1, setLastActionTime1] = useState<string>('21-10-2026 14:15:20');
  const [lastActionTime2, setLastActionTime2] = useState<string>('21-10-2026 14:02:15');
  const [lastActionTime3, setLastActionTime3] = useState<string>('21-10-2026 13:45:00');
  const [lastActionTime4, setLastActionTime4] = useState<string>('21-10-2026 13:30:00');

  // Giá trị đo đạc tương ứng với mức đang bật (Nếu activeLevel === 0 thì nước đóng, lưu lượng = 0, áp lực ra = 0)
  const currentPressureIn = 25.9;
  const currentPressureOut =
    activeLevel === 0 ? 0.0 : activeLevel === 1 ? 16.8 : activeLevel === 2 ? 20.5 : 25.5;
  const currentDeltaP = Math.abs(currentPressureIn - currentPressureOut);
  const currentFlowRate = activeLevel === 0 ? 0.0 : 49.6;
  const currentVelocity = activeLevel === 0 ? 0.0 : 0.8;

  // Real-time clock update (live second ticking based on the initial RTC)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setRtcTime(`${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Xử lý khi click vào 1 trong 3 đồng hồ: Dịch kim lên mức tương ứng, 2 đồng hồ còn lại quay về trạng thái tắt
  const handleSelectLevel = (level: 1 | 2 | 3) => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const formatted = `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;

    setActiveLevel(level);

    if (level === 1) {
      setGaugeVal1(cfgTargetP1); // Mức áp 1: Vùng Xanh
      setGaugeVal2(0);           // Quay về tắt
      setGaugeVal3(0);           // Quay về tắt
      setLastActionTime1(formatted);
      toast.success('Thao tác thành công');
    } else if (level === 2) {
      setGaugeVal1(0);           // Quay về tắt
      setGaugeVal2(cfgTargetP2); // Mức áp 2: Vùng Vàng
      setGaugeVal3(0);           // Quay về tắt
      setLastActionTime2(formatted);
      toast.success('Thao tác thành công');
    } else {
      setGaugeVal1(0);           // Quay về tắt
      setGaugeVal2(0);           // Quay về tắt
      setGaugeVal3(cfgTargetP3); // Mở full: 100% Vùng Đỏ
      setLastActionTime3(formatted);
      toast.success('Thao tác thành công');
    }
  };

  // Xử lý khi click vào ô "Đóng nước": Hạ cả 3 đồng hồ về 0, chuyển activeLevel về 0
  const handleShutoffWater = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const formatted = `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;

    setActiveLevel(0);
    setGaugeVal1(0); // Tất cả 3 đồng hồ quay về Mức 0
    setGaugeVal2(0);
    setGaugeVal3(0);
    setLastActionTime4(formatted);
    toast.success('Thao tác thành công');
  };

  // Lưu cấu hình từ modal cài đặt
  const handleSaveSettings = () => {
    if (activeLevel === 1) setGaugeVal1(cfgTargetP1);
    else if (activeLevel === 2) setGaugeVal2(cfgTargetP2);
    else if (activeLevel === 3) setGaugeVal3(cfgTargetP3);

    toast.success('Thao tác thành công');
    setIsSettingsOpen(false);
  };

  // Khôi phục mặc định
  const handleResetDefaults = () => {
    setCfgTargetP1(27.8);
    setCfgTargetP2(50.0);
    setCfgTargetP3(100.0);
    setCfgRatio0('1.5');
    setCfgRatio90('1.0');
    setCfgReportInterval('10s');
    setCfgModbusId(1);
    setCfgBaudRate('9600');
    setCfgAlarmPInHigh(35.0);
    setCfgAlarmPInLow(10.0);
    setCfgAlarmPOutHigh(30.0);
    setCfgAlarmDeltaP(15.0);
    setCfgAutoShutoff(true);
    setCfgRtcAutoSync(true);
    setCfgLowBattery(11.5);
    toast.success('Thao tác thành công');
  };

  // Đồng bộ RTC ngay lập tức
  const handleSyncRTC = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    setRtcTime(`${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`);
    toast.success('Thao tác thành công');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between min-h-0 select-none overflow-hidden space-y-2.5 sm:space-y-3">
      {/* 1. TOP HEADER BAR: Back button, Station Config, Enlarged Realtime Online Status, Settings Gear/Exit Button */}
      <div className="relative z-50 shrink-0 w-full bg-white dark:bg-[#13161F] rounded-[20px] sm:rounded-[22px] border border-slate-200/90 dark:border-slate-800/90 px-3.5 py-2.5 sm:py-3 shadow-xs flex items-center justify-between gap-3 transition-colors">
        {/* Left: Back button + Station Identity */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (isSettingsOpen) {
                setIsSettingsOpen(false);
              } else {
                onBack();
              }
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title={isSettingsOpen ? 'Thoát cài đặt' : 'Quay lại danh sách thiết bị'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                1015 0:{cfgRatio0} 90:{cfgRatio90}
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                version 1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Thiết bị điều khiển áp lực tự động
            </p>
          </div>
        </div>

        {/* Center: Realtime Online Status Indicator (2 Icons Only: Pulsing Dot + Wifi) */}
        <div
          className="flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border-2 border-emerald-500/30 dark:border-emerald-500/50 shadow-sm shadow-emerald-500/15 transition-all"
          title="Trực tuyến • Realtime Online"
        >
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <Wifi className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-pulse stroke-[2.4]" />
        </div>

        {/* Right: Settings Gear Button (Transforms to Exit X when open) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-xs active:scale-95 ${
              isSettingsOpen
                ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 shadow-rose-500/10'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
            title={isSettingsOpen ? 'Thoát cài đặt (Đóng)' : 'Cài đặt thông số thiết bị'}
          >
            {isSettingsOpen ? (
              <>
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400 transition-transform duration-300 rotate-90" />
                <span className="text-rose-600 dark:text-rose-400">Thoát</span>
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300 transition-transform duration-500 hover:rotate-90" />
                <span>Cài đặt</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA (Monitor View - Image 2) */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        {/* MONITOR VIEW (Image 2 - Luôn hiển thị nền và được làm mờ khi mở modal cài đặt) */}
        <div className="w-full h-full flex flex-col justify-between space-y-2.5 sm:space-y-3">
          {/* 2. MIDDLE ROW: 3 GAUGE CARDS (Click để bật mức & tắt 2 mức còn lại) + 1 EMPTY SLOT */}
          <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Gauge 1: Mức áp 1 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleSelectLevel(1)}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectLevel(1)}
          className={`h-[180px] rounded-[22px] bg-white dark:bg-[#13161F] p-3 shadow-xs flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${
            activeLevel === 1
              ? 'border-2 border-blue-500/80 dark:border-blue-500/80 ring-2 ring-blue-500/20 shadow-blue-500/10'
              : 'border border-slate-200/90 dark:border-slate-800/90 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="w-full flex items-center justify-center pb-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs sm:text-[13px] font-bold transition-colors ${
                  activeLevel === 1
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Mức áp 1
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeLevel === 1 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </div>
          </div>

          <div className="py-0.5 pointer-events-none">
            <SpeedometerGauge
              value={gaugeVal1}
              unit="mH₂O"
              size={175}
              variant="embedded"
              showControls={false}
              showMetrics={false}
              easingStyle="spring"
            />
          </div>

          <div className="w-full pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-500 shrink-0" />
              <span>Gần nhất:</span>
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {lastActionTime1}
            </span>
          </div>
        </div>

        {/* Gauge 2: Mức áp 2 */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleSelectLevel(2)}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectLevel(2)}
          className={`h-[180px] rounded-[22px] bg-white dark:bg-[#13161F] p-3 shadow-xs flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${
            activeLevel === 2
              ? 'border-2 border-emerald-500/80 dark:border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
              : 'border border-slate-200/90 dark:border-slate-800/90 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="w-full flex items-center justify-center pb-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs sm:text-[13px] font-bold transition-colors ${
                  activeLevel === 2
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Mức áp 2
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeLevel === 2 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </div>
          </div>

          <div className="py-0.5 pointer-events-none">
            <SpeedometerGauge
              value={gaugeVal2}
              unit="mH₂O"
              size={175}
              variant="embedded"
              showControls={false}
              showMetrics={false}
              easingStyle="spring"
            />
          </div>

          <div className="w-full pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Gần nhất:</span>
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {lastActionTime2}
            </span>
          </div>
        </div>

        {/* Gauge 3: Mở full */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => handleSelectLevel(3)}
          onKeyDown={(e) => e.key === 'Enter' && handleSelectLevel(3)}
          className={`h-[180px] rounded-[22px] bg-white dark:bg-[#13161F] p-3 shadow-xs flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${
            activeLevel === 3
              ? 'border-2 border-amber-500/80 dark:border-amber-500/80 ring-2 ring-amber-500/20 shadow-amber-500/10'
              : 'border border-slate-200/90 dark:border-slate-800/90 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="w-full flex items-center justify-center pb-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs sm:text-[13px] font-bold transition-colors ${
                  activeLevel === 3
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Mở full
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeLevel === 3 ? 'bg-amber-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </div>
          </div>

          <div className="py-0.5 pointer-events-none">
            <SpeedometerGauge
              value={gaugeVal3}
              unit="%"
              size={175}
              variant="embedded"
              showControls={false}
              showMetrics={false}
              easingStyle="spring"
            />
          </div>

          <div className="w-full pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Gần nhất:</span>
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {lastActionTime3}
            </span>
          </div>
        </div>

        {/* Card 4: Đóng nước */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleShutoffWater}
          onKeyDown={(e) => e.key === 'Enter' && handleShutoffWater()}
          className={`h-[180px] rounded-[22px] p-3 shadow-xs flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${
            activeLevel === 0
              ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500/90 dark:border-rose-500/90 ring-2 ring-rose-500/20 shadow-rose-500/10'
              : 'bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 opacity-70 hover:opacity-100 hover:border-rose-300 dark:hover:border-rose-700/60'
          }`}
        >
          {/* Card Header */}
          <div className="w-full flex items-center justify-center pb-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs sm:text-[13px] font-bold transition-colors ${
                  activeLevel === 0
                    ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Đóng nước
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeLevel === 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </div>
          </div>

          {/* Card Center: Valve Actuator */}
          <div className="flex-1 w-full flex items-center justify-center py-1">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                activeLevel === 0
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/35 ring-4 ring-rose-500/20 scale-105'
                  : 'bg-slate-100 dark:bg-[#1A202C] text-slate-400 border border-slate-200/80 dark:border-slate-700/80 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
              }`}
            >
              {activeLevel === 0 ? (
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              ) : (
                <PowerOff className="w-8 h-8" />
              )}
            </div>
          </div>

          {/* Card Bottom: Operation Timestamp */}
          <div className="w-full pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3 text-rose-500 shrink-0" />
              <span>Gần nhất:</span>
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {lastActionTime4}
            </span>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: 3 LOGICALLY GROUPED TELEMETRY CARDS (Clean top headers without unit badges) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 overflow-hidden">
        {/* Group 1: Flow & Volume (5 parameters) */}
        <div className="rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
          <div className="shrink-0 flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Droplets className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
              Flow & Volume
            </h4>
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-center space-y-1 py-1">
            <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                FlowRate:
              </span>
              <span className="text-xs font-mono font-extrabold text-blue-600 dark:text-blue-400">
                {formatVNNumber(currentFlowRate, 1)} (m³/h)
              </span>
            </div>

            <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Velocity:
              </span>
              <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200">
                {formatVNNumber(currentVelocity, 1)} (m/s)
              </span>
            </div>

            <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Net Flow Total:
              </span>
              <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">
                {formatVNNumber(1653377.3, 1)} (m³)
              </span>
            </div>

            <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Forward Flow:
              </span>
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                {formatVNNumber(1653381.6, 1)} (m³)
              </span>
            </div>

            <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Reserve Flow:
              </span>
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                {formatVNNumber(4.3, 1)} (m³)
              </span>
            </div>
          </div>
        </div>

        {/* Group 2: Pressure Telemetry (Pressure In, Pressure Out, Delta) */}
        <div className="rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
          <div className="shrink-0 flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
              Pressure Telemetry
            </h4>
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-center space-y-1.5 py-1">
            <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Pressure In:
              </span>
              <span className="text-xs font-mono font-extrabold text-blue-600 dark:text-blue-400">
                {formatVNNumber(currentPressureIn, 1)} (mH₂O)
              </span>
            </div>

            <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Pressure Out:
              </span>
              <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatVNNumber(currentPressureOut, 1)} (mH₂O)
              </span>
            </div>

            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-2 text-[11px]">
              <span className="text-slate-400 font-medium">ΔP (Head Loss):</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {formatVNNumber(currentDeltaP, 1)} (mH₂O)
              </span>
            </div>
          </div>
        </div>

        {/* Group 3: System & Power (3 parameters + Link Status) */}
        <div className="rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
          <div className="shrink-0 flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
            <div className="w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
              System & Power
            </h4>
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-center space-y-1.5 py-1">
            <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Battery:
              </span>
              <div className="flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatVNNumber(12.46, 2)}V
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Low Power Metter:
              </span>
              <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                False
              </span>
            </div>

            <div className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                RTC:
              </span>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                {rtcTime}
              </span>
            </div>

            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-2 text-[11px]">
              <span className="text-slate-400 font-medium">Link Protocol:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                Modbus RTU
              </span>
            </div>
          </div>
            </div>
          </div>
        </div>
        {/* END MONITOR VIEW */}
      </div>

      {/* 3. SETTINGS MODAL CENTERED DIALOG (Hiện giữa màn hình, kích thước lớn rộng rãi, animation mượt mà) */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 transition-all duration-300 ease-out ${
          isSettingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop: Làm mờ nền */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setIsSettingsOpen(false)}
        />

        {/* Modal Window: Centered, Large (max-w-6xl / 1200px), smooth scale/translate animation */}
        <div
          role="dialog"
          aria-modal="true"
          className={`relative z-10 w-full max-w-6xl max-h-[88vh] bg-white dark:bg-[#12151E] rounded-[24px] sm:rounded-[28px] border border-slate-200/90 dark:border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out transform ${
            isSettingsOpen
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-95 opacity-0 translate-y-3 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#151924]/70">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Cài Đặt Cấu Hình Trạm 1015
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Modbus RTU
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Online
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
                  Hiệu chỉnh giá trị đặt mức áp, ngưỡng cảnh báo an toàn & chu kỳ truyền thông Modbus
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="hidden sm:flex px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold items-center gap-1.5 transition-colors cursor-pointer"
                title="Khôi phục mặc định"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Mặc định</span>
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="hidden sm:flex px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title="Lưu cấu hình"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu cấu hình</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                title="Đóng (Thoát)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body: 4 Configuration Cards in spacious 4-column grid */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {/* Card 1: Cấu hình Mức Áp & Góc Van */}
              <div className="rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
                <div className="shrink-0 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-500">
                    <Gauge className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                      Mức Áp & Góc Van
                    </h4>
                    <p className="text-[10px] text-slate-400">Giá trị đặt mục tiêu</p>
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-between space-y-2 py-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Mức áp 1 (Target P1 - mH₂O):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={cfgTargetP1}
                      onChange={(e) => setCfgTargetP1(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Mức áp 2 (Target P2 - mH₂O):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={cfgTargetP2}
                      onChange={(e) => setCfgTargetP2(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Mở full (Target P3 - %):
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={cfgTargetP3}
                      onChange={(e) => setCfgTargetP3(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-[11px] font-medium text-slate-500 block mb-1">Tỉ lệ Calib van (Góc 0° / 90°):</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cfgRatio0}
                        onChange={(e) => setCfgRatio0(e.target.value)}
                        placeholder="0:1.5"
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-[11px] font-mono text-slate-700 dark:text-slate-300"
                      />
                      <input
                        type="text"
                        value={cfgRatio90}
                        onChange={(e) => setCfgRatio90(e.target.value)}
                        placeholder="90:1.0"
                        className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-[11px] font-mono text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Ngưỡng Cảnh Báo An Toàn */}
              <div className="rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
                <div className="shrink-0 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="w-6 h-6 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20 flex items-center justify-center text-rose-500">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                      Ngưỡng Cảnh Báo
                    </h4>
                    <p className="text-[10px] text-slate-400">Giới hạn an toàn & Trip</p>
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-between space-y-2 py-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Áp suất vào cực đại (P_In Max - mH₂O):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={cfgAlarmPInHigh}
                      onChange={(e) => setCfgAlarmPInHigh(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Áp suất ra cực đại (P_Out Max - mH₂O):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={cfgAlarmPOutHigh}
                      onChange={(e) => setCfgAlarmPOutHigh(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Chênh áp cực đại ΔP (Headloss - mH₂O):
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={cfgAlarmDeltaP}
                      onChange={(e) => setCfgAlarmDeltaP(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={cfgAutoShutoff}
                        onChange={(e) => setCfgAutoShutoff(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 accent-rose-600 cursor-pointer"
                      />
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Tự ngắt van khi vượt ngưỡng
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Card 3: Truyền Thông Modbus & Chu Kỳ */}
              <div className="rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
                <div className="shrink-0 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                      Truyền Thông Modbus
                    </h4>
                    <p className="text-[10px] text-slate-400">Chu kỳ & Thông số cổng</p>
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-between space-y-2 py-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Chu kỳ gửi tin (Telemetry Interval):
                    </label>
                    <select
                      value={cfgReportInterval}
                      onChange={(e) => setCfgReportInterval(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="5s">5 giây (Real-time cao tần)</option>
                      <option value="10s">10 giây (Tiêu chuẩn SCADA)</option>
                      <option value="30s">30 giây</option>
                      <option value="60s">60 giây (Tiết kiệm năng lượng)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Modbus Slave ID:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="247"
                      value={cfgModbusId}
                      onChange={(e) => setCfgModbusId(parseInt(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Tốc độ Baud Rate:
                    </label>
                    <select
                      value={cfgBaudRate}
                      onChange={(e) => setCfgBaudRate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="4800">4800 bps</option>
                      <option value="9600">9600 bps (Chuẩn)</option>
                      <option value="19200">19200 bps</option>
                      <option value="115200">115200 bps</option>
                    </select>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Cổng kết nối:</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">RS485-COM1</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Hệ Thống & Đồng Bộ RTC */}
              <div className="rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-3 sm:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
                <div className="shrink-0 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                      Hệ Thống & RTC
                    </h4>
                    <p className="text-[10px] text-slate-400">Đồng hồ & Nguồn nuôi</p>
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-between space-y-2 py-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Đồng hồ RTC bo mạch:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-[11px] font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                        {rtcTime}
                      </div>
                      <button
                        type="button"
                        onClick={handleSyncRTC}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer text-[10px] font-bold shrink-0"
                        title="Đồng bộ RTC với giờ máy tính"
                      >
                        Đồng bộ
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Cảnh báo pin yếu (Low Battery - V):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={cfgLowBattery}
                      onChange={(e) => setCfgLowBattery(parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0B0E14] text-xs font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={cfgRtcAutoSync}
                        onChange={(e) => setCfgRtcAutoSync(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Tự động đồng bộ giờ NTP
                      </span>
                    </label>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Firmware:</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">v1.0.4-build2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#151924]/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">
              Trạng thái Modbus:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">RS485-COM1 (Active)</strong> • Trạm ID:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-mono">1015</strong> • Giờ trạm:{' '}
              <strong className="font-mono text-slate-700 dark:text-slate-300">{rtcTime}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Khôi phục mặc định"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Mặc định</span>
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Lưu cấu hình"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu cấu hình</span>
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
