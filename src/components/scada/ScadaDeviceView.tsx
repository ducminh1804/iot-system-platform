import React, { useState, useEffect, useMemo } from 'react';
import {
  Radio,
  Clock,
  Droplets,
  Compass,
  Battery,
  PlusCircle,
  ShieldCheck,
  Zap,
  Settings,
  Activity,
  Gauge,
  Waves,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { SpeedometerGauge } from '@/components/hydrolix/SpeedometerGauge';
import { ScadaDeviceSettingsView } from './ScadaDeviceSettingsView';

interface ValveConfig {
  id: number;
  name: string;
  maxLevel: 1 | 2 | 3;
  maxPercent: number;
  maxAngle: number;
  levelName: string;
  zoneColor: string;
}

const VALVE_CONFIGS: ValveConfig[] = [
  {
    id: 1,
    name: 'Mức áp lực 1',
    maxLevel: 1,
    maxPercent: 27.8, // Mức 1 - Vùng Xanh (-40°)
    maxAngle: -40,
    levelName: 'Mức 1 (28%)',
    zoneColor: '#22c55e',
  },
  {
    id: 2,
    name: 'Mức áp lực 2',
    maxLevel: 2,
    maxPercent: 50.0, // Mức 2 - Vùng Vàng (0°)
    maxAngle: 0,
    levelName: 'Mức 2 (50%)',
    zoneColor: '#eab308',
  },
  {
    id: 3,
    name: 'Mức áp lực Full',
    maxLevel: 3,
    maxPercent: 100.0, // Mức 3 - Mở Full Vùng Đỏ (+90°)
    maxAngle: 90,
    levelName: 'Mức 3 (100% Full)',
    zoneColor: '#ef4444',
  },
];

interface ScadaDeviceViewProps {
  initialOpenSettings?: boolean;
  onOpenSettings?: () => void;
}

export const ScadaDeviceView: React.FC<ScadaDeviceViewProps> = ({
  initialOpenSettings = false,
  onOpenSettings,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(initialOpenSettings);

  // Trạng thái bật/tắt của từng van: false = Tắt (0%), true = Bật (Max tương ứng)
  const [valveStates, setValveStates] = useState<{ [key: number]: boolean }>({
    1: false,
    2: true, // Mức 2 mở mặc định
    3: false,
  });

  // Trạng thái trực tuyến của thiết bị
  const [isOnline, setIsOnline] = useState(true);
  const [isWaking, setIsWaking] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Tích lũy lưu lượng thời gian thực (m³)
  const [flowTotals, setFlowTotals] = useState({
    net: 1642633.5,
    forward: 1642637.4,
    reserve: 3.9,
  });

  // Cập nhật đồng hồ RTC mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tính toán các thông số thủy lực động phụ thuộc vào trạng thái mở của các van
  const dynamicTelemetry = useMemo(() => {
    let activeOpenCount = 0;
    let totalPercentSum = 0;

    if (valveStates[1]) {
      activeOpenCount += 1;
      totalPercentSum += VALVE_CONFIGS[0].maxPercent;
    }
    if (valveStates[2]) {
      activeOpenCount += 1;
      totalPercentSum += VALVE_CONFIGS[1].maxPercent;
    }
    if (valveStates[3]) {
      activeOpenCount += 1;
      totalPercentSum += VALVE_CONFIGS[2].maxPercent;
    }

    if (activeOpenCount === 0) {
      return {
        flowRate: 0.0,
        velocity: 0.0,
        angle: 0.0,
        pressureIn: 22.0,
        pressureOut: 0.1,
        deltaP: 21.9,
      };
    }

    const factor = totalPercentSum / 100;
    const flowRate = Math.round((factor * 174.4) * 10) / 10;
    const velocity = Math.round((factor * 2.8) * 10) / 10;
    const angle = Math.round((valveStates[3] ? 90 : valveStates[2] ? 15 : 8) * 10) / 10;
    const pressureIn = Math.round((20.3 + (factor - 0.5) * 1.4) * 10) / 10;
    const pressureOut = Math.round((16.8 + (factor - 0.5) * 1.6) * 10) / 10;
    const deltaP = Math.round(Math.abs(pressureIn - pressureOut) * 10) / 10;

    return {
      flowRate,
      velocity,
      angle,
      pressureIn,
      pressureOut,
      deltaP,
    };
  }, [valveStates]);

  // Tích lũy dòng chảy
  useEffect(() => {
    if (dynamicTelemetry.flowRate > 0) {
      const interval = setInterval(() => {
        setFlowTotals((prev) => {
          const delta = (dynamicTelemetry.flowRate / 3600) * 1.5;
          const nextNet = Math.round((prev.net + delta) * 10) / 10;
          const nextFwd = Math.round((prev.forward + delta) * 10) / 10;
          return {
            net: nextNet,
            forward: nextFwd,
            reserve: prev.reserve,
          };
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [dynamicTelemetry.flowRate]);

  // Click vào card để bật/tắt van
  const handleToggleValve = (id: number) => {
    const config = VALVE_CONFIGS.find((v) => v.id === id);
    if (!config) return;

    setValveStates((prev) => {
      const isCurrentlyOpen = prev[id];
      const nextState = !isCurrentlyOpen;

      if (nextState) {
        toast.success(`Đã BẬT ${config.name}`, { duration: 1600 });
      } else {
        toast.info(`Đã TẮT ${config.name} (Về 0%)`, { duration: 1600 });
      }

      return {
        ...prev,
        [id]: nextState,
      };
    });
  };

  const formatNumber = (num: number, decimals = 1) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatRTC = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const seconds = pad(d.getSeconds());
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleWakeupDevice = () => {
    if (isWaking) return;
    setIsWaking(true);
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);

    if (nextOnline) {
      toast.success('Đã gửi tín hiệu: Thiết bị TRỰC TUYẾN', {
        duration: 2000,
        icon: <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />,
      });
    } else {
      toast.info('Đã gửi tín hiệu: Thiết bị NGOẠI TUYẾN (Chế độ ngủ)', {
        duration: 2000,
        icon: <Radio className="w-4 h-4 text-slate-400" />,
      });
    }

    setTimeout(() => {
      setIsWaking(false);
    }, 1500);
  };

  if (isSettingsOpen) {
    return <ScadaDeviceSettingsView onBack={() => setIsSettingsOpen(false)} />;
  }

  return (
    <div className="flex-1 flex flex-col justify-between gap-1.5 sm:gap-2.5 min-w-0 font-sans selection:bg-emerald-500 selection:text-white h-full max-h-full overflow-hidden rounded-[20px] sm:rounded-[28px] bg-slate-950/70 backdrop-blur-2xl border-2 border-white/20 p-2 sm:p-3 md:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10 select-none">
      {/* ============================================================== */}
      {/* 1. THANH TIÊU ĐỀ TRÊN GỌN GÀNG                                 */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 px-2.5 sm:px-3.5 py-1 sm:py-2 shadow-[0_6px_20px_rgb(0,0,0,0.12)] flex items-center justify-between gap-2 select-none shrink-0">
        {/* Bên trái: Mã trạm thiết bị & Chấm trạng thái Online/Offline */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm sm:text-base font-bold tracking-tight text-white truncate">
              1015 0:1.5 90:1.0
            </span>
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0">
              {isOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-slate-500 ring-1 ring-white/20"></span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-300">
            <span className="italic text-slate-400">version 1</span>
            <span className="text-white/20">|</span>
            <span className={`font-medium transition-colors ${isOnline ? 'text-emerald-400' : 'text-slate-400'}`}>
              Bộ điều khiển áp lực
            </span>
          </div>
        </div>

        {/* Ở giữa: Nút đánh thức / On-Off Realtime với hiệu ứng sóng radar */}
        <div className="flex items-center justify-center shrink-0">
          <div className="relative flex items-center justify-center">
            {isWaking && (
              <>
                <span className="absolute inset-0 rounded-xl sm:rounded-2xl bg-emerald-400/40 animate-ping pointer-events-none" />
                <span className="absolute -inset-1 rounded-xl sm:rounded-2xl border-2 border-emerald-400/60 animate-ping [animation-duration:1.2s] pointer-events-none" />
              </>
            )}

            <button
              type="button"
              onClick={handleWakeupDevice}
              disabled={isWaking}
              title={isOnline ? 'Gửi tín hiệu đưa thiết bị vào chế độ ngủ (Offline)' : 'Gửi tín hiệu đánh thức thiết bị (Online)'}
              className={`relative flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-xl border transition-all duration-300 active:scale-90 group cursor-pointer ${
                isWaking
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.6)] ring-2 ring-emerald-400/40 scale-105'
                  : isOnline
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.18)]'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                  isWaking ? 'scale-120 animate-pulse text-emerald-300' : isOnline ? 'text-emerald-400' : 'text-slate-400'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bên phải: Nút cấu hình cài đặt */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else setIsSettingsOpen(true);
            }}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-900/70 hover:bg-slate-900 text-slate-200 hover:text-white border border-white/10 hover:border-emerald-400/40 transition-all active:scale-95 shadow-sm group cursor-pointer"
            title="Cài đặt hệ thống & cấu hình thiết bị 1015"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. KHU VỰC 4 Ô ĐỒNG HỒ ĐO: DÙNG ĐÚNG 3 ĐỒNG HỒ SPEEDOMETERGAUGE */}
      {/* ============================================================== */}
      <section className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-2.5 w-full select-none shrink-0">
        {VALVE_CONFIGS.map((config) => {
          const isOpen = valveStates[config.id];
          const currentValue = isOpen ? config.maxPercent : 0;

          return (
            <div
              key={config.id}
              onClick={() => handleToggleValve(config.id)}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-1 sm:p-2 flex flex-col items-center justify-between transition-all duration-200 cursor-pointer backdrop-blur-xl border ${
                isOpen
                  ? 'bg-slate-900/90 border-emerald-400/50 shadow-[0_8px_25px_rgba(0,0,0,0.3)] ring-1.5 ring-emerald-500/25'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/30 hover:bg-slate-900/75 shadow-sm opacity-85 hover:opacity-100'
              }`}
            >
              {/* Vệt sáng aura khi bật */}
              {isOpen && (
                <div
                  className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-20"
                  style={{ backgroundColor: config.zoneColor }}
                />
              )}

              {/* Tên mức áp lực */}
              <div className="w-full text-center pb-0.5 border-b border-white/10 leading-none">
                <span className="text-[10px] sm:text-xs md:text-sm font-bold text-white tracking-tight truncate block group-hover:text-emerald-300 transition-colors">
                  {config.name}
                </span>
              </div>

              {/* 3 ĐỒNG HỒ ÁP LỰC 3 MỨC NGUYÊN BẢN (SPEEDOMETER GAUGE VỚI KIM LÒ XO) */}
              <div className="w-full py-0.5 sm:py-1 flex items-center justify-center transform transition-transform group-hover:scale-105 active:scale-95 pointer-events-none max-w-[170px]">
                <SpeedometerGauge
                  value={currentValue}
                  size={155}
                  showControls={false}
                  showMetrics={false}
                  easingStyle="spring"
                  variant="embedded"
                />
              </div>

              {/* Chỉ dẫn chạm nhỏ gọn */}
              <div className="w-full pt-0.5 text-center leading-none">
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors block truncate">
                  {isOpen ? 'Mở · Chạm tắt' : 'Đóng · Chạm bật'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Ô THỨ 4: ĐỂ TRỐNG (DỰ PHÒNG) */}
        <div className="relative rounded-xl sm:rounded-2xl p-1 sm:p-2 flex flex-col items-center justify-between backdrop-blur-xl bg-slate-900/30 border-2 border-dashed border-white/15 select-none">
          <div className="w-full text-center pb-0.5 border-b border-white/10 leading-none">
            <span className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-400 tracking-tight block">
              Trống
            </span>
          </div>

          <div className="my-auto flex flex-col items-center justify-center text-center p-0.5 sm:p-1">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-0.5">
              <PlusCircle className="w-4 h-4 stroke-[1.5]" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-semibold text-slate-300 block">Vị trí trống</span>
            <span className="text-[8px] text-slate-500 hidden sm:block">Chưa kích hoạt</span>
          </div>

          <div className="w-full pt-0.5 text-center text-[8px] sm:text-[9px] text-slate-400 truncate leading-none">
            Dự phòng
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. BẢNG THÔNG SỐ: CHỈ ĐỔI TÊN NHÃN CÁC THÔNG SỐ SANG TIẾNG ANH  */}
      {/* ============================================================== */}
      <section className="flex flex-col gap-1.5 sm:gap-2 w-full select-none flex-1 justify-between min-h-0">
        {/* ============================================================ */}
        {/* TẦNG 1: ÁP SUẤT THỦY LỰC & LƯU LƯỢNG TÍCH LŨY               */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-1.5 sm:gap-2 flex-1 min-h-0">
          {/* 1. ÁP SUẤT THỦY LỰC */}
          <div className="col-span-1 lg:col-span-5 rounded-xl sm:rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/15 p-1.5 sm:p-2.5 flex flex-col justify-between shadow-[0_6px_25px_rgb(0,0,0,0.18)]">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-cyan-300 truncate">
                <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Áp Suất Thủy Lực</span>
              </div>
              <span className="text-[9px] sm:text-xs font-bold font-mono text-cyan-400 shrink-0">mH₂O</span>
            </div>

            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 my-auto">
              {/* Pressure In */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300">
                  <span className="truncate">Pressure In</span>
                  <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-sm sm:text-xl font-extrabold text-white tabular-nums block truncate">
                    {formatNumber(dynamicTelemetry.pressureIn, 1)}
                  </span>
                  <span className="text-[9px] sm:text-xs font-bold text-emerald-400 ml-1">mH₂O</span>
                </div>
              </div>

              {/* Pressure Out */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300">
                  <span className="truncate">Pressure Out</span>
                  <ArrowDownRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400 shrink-0" />
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-sm sm:text-xl font-extrabold text-cyan-300 tabular-nums block truncate">
                    {formatNumber(dynamicTelemetry.pressureOut, 1)}
                  </span>
                  <span className="text-[9px] sm:text-xs font-bold text-cyan-400 ml-1">mH₂O</span>
                </div>
              </div>

              {/* Delta P */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-amber-500/25 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-amber-300">
                  <span className="truncate">Delta P (ΔP)</span>
                  <Droplets className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-sm sm:text-xl font-extrabold text-amber-300 tabular-nums block truncate">
                    {formatNumber(dynamicTelemetry.deltaP, 1)}
                  </span>
                  <span className="text-[9px] sm:text-xs font-bold text-amber-400 ml-1">mH₂O</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. LƯU LƯỢNG & KHỐI LƯỢNG TÍCH LŨY */}
          <div className="col-span-1 lg:col-span-7 rounded-xl sm:rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/15 p-1.5 sm:p-2.5 flex flex-col justify-between shadow-[0_6px_25px_rgb(0,0,0,0.18)]">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 truncate">
                <Waves className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Lưu Lượng & Khối Lượng Tích Lũy</span>
              </div>
              <span className="text-[9px] sm:text-xs font-bold font-mono text-emerald-400 shrink-0">m³/h · m³</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5 my-auto">
              {/* FlowRate */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-emerald-500/40 flex flex-col justify-between shadow-inner">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-emerald-300">
                  <span className="truncate">FlowRate</span>
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-xs sm:text-lg font-extrabold text-emerald-400 tabular-nums block truncate">
                    {formatNumber(dynamicTelemetry.flowRate, 1)}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-emerald-400 ml-1">m³/h</span>
                </div>
              </div>

              {/* Net Flow Total */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <span className="text-[9px] sm:text-[11px] text-slate-300 truncate">Net Flow Total</span>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-xs sm:text-base font-extrabold text-white tabular-nums tracking-tight block truncate">
                    {formatNumber(flowTotals.net, 0)}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-emerald-300 ml-1">m³</span>
                </div>
              </div>

              {/* Forward Flow */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <span className="text-[9px] sm:text-[11px] text-slate-300 truncate">Forward Flow</span>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-xs sm:text-base font-extrabold text-white tabular-nums tracking-tight block truncate">
                    {formatNumber(flowTotals.forward, 0)}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-cyan-300 ml-1">m³</span>
                </div>
              </div>

              {/* Reserve Flow */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <span className="text-[9px] sm:text-[11px] text-slate-300 truncate">Reserve Flow</span>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-xs sm:text-base font-extrabold text-white tabular-nums block truncate">
                    {formatNumber(flowTotals.reserve, 1)}
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-bold text-slate-300 ml-1">m³</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* TẦNG 2: ĐỘNG HỌC & CƠ CẤU + NGUỒN ĐIỆN & RTC                */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-1.5 sm:gap-2 flex-1 min-h-0">
          {/* 3. ĐỘNG HỌC & CƠ CẤU */}
          <div className="col-span-1 lg:col-span-5 rounded-xl sm:rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/15 p-1.5 sm:p-2.5 flex flex-col justify-between shadow-[0_6px_25px_rgb(0,0,0,0.18)]">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 truncate">
                <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Động Học & Cơ Cấu</span>
              </div>
              <span className="text-[9px] sm:text-xs font-bold font-mono text-amber-400 shrink-0">m/s · độ</span>
            </div>

            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 my-auto">
              {/* Velocity */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300">
                  <span className="truncate">Velocity</span>
                  <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400 shrink-0" />
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-sm sm:text-xl font-extrabold text-white tabular-nums block truncate">
                    {formatNumber(dynamicTelemetry.velocity, 1)}
                  </span>
                  <span className="text-[9px] sm:text-xs font-bold text-blue-400 ml-1">m/s</span>
                </div>
              </div>

              {/* Angle */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300">
                  <span className="truncate">Angle</span>
                  <Compass className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-sm sm:text-xl font-extrabold text-amber-300 tabular-nums block truncate">
                    {formatNumber(dynamicTelemetry.angle, 0)}°
                  </span>
                  <span className="text-[9px] sm:text-xs font-bold text-amber-400 ml-1">độ</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. NGUỒN ĐIỆN & HỆ THỐNG RTC */}
          <div className="col-span-1 lg:col-span-7 rounded-xl sm:rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/15 p-1.5 sm:p-2.5 flex flex-col justify-between shadow-[0_6px_25px_rgb(0,0,0,0.18)]">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300 truncate">
                <Battery className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Nguồn Điện & Hệ Thống RTC</span>
              </div>
              <span className="text-[9px] sm:text-xs font-bold font-mono text-emerald-400 shrink-0">V · Trạng thái</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-1.5 my-auto">
              {/* Battery */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300">
                  <span className="truncate">Battery</span>
                  <Battery className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-xs sm:text-base font-extrabold text-emerald-300 tabular-nums block truncate">
                    12.46
                  </span>
                  <span className="text-[9px] sm:text-xs font-bold text-emerald-400 ml-1">V</span>
                </div>
              </div>

              {/* Low Power Metter */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-white/10 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-300">
                  <span className="truncate">Low Power Metter</span>
                  <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                </div>
                <div className="mt-0.5 flex items-baseline justify-between font-mono">
                  <span className="text-xs sm:text-base font-extrabold text-emerald-400">
                    False
                  </span>
                </div>
              </div>

              {/* RTC Clock */}
              <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-slate-950/60 border border-emerald-500/30 flex flex-col justify-between shadow-inner">
                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-emerald-300">
                  <span className="truncate">RTC</span>
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400 shrink-0" />
                </div>
                <div className="mt-0.5 font-mono">
                  <span className="text-[10px] sm:text-xs font-bold text-white tabular-nums tracking-tighter block truncate">
                    {formatRTC(currentTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
