import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  UploadCloud,
  AlertTriangle,
  SlidersHorizontal,
  Gauge,
  BatteryCharging,
  Activity,
  Cpu,
  RefreshCw,
  RotateCcw,
  CheckCircle2,
  Compass,
  LayoutGrid,
  Settings2,
  Crosshair,
  Flame,
  Sun,
  Zap,
  Brain,
  ShieldAlert,
  Radio,
  ArrowRight,
  Maximize2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { TabControlModes } from '@/pages/settings/TabControlModes';
import { TabSensorCalibration } from '@/pages/settings/TabSensorCalibration';
import { TabPowerManagement } from '@/pages/settings/TabPowerManagement';
import { TabAnomalyDetection } from '@/pages/settings/TabAnomalyDetection';
import { TabLegacyScada } from '@/pages/settings/TabLegacyScada';
import { Switch } from '@/components/ui/switch';

export type SettingsTabId = 'matrix' | 'control' | 'calibration' | 'power' | 'anomaly' | 'legacy';

interface NavItem {
  id: SettingsTabId;
  label: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'matrix',
    label: 'Ma Trận Toàn Cảnh (HUD)',
    tag: 'OVERVIEW',
    icon: LayoutGrid,
  },
  {
    id: 'control',
    label: 'Điều Phối Áp Lực',
    tag: 'SUB-01',
    icon: SlidersHorizontal,
  },
  {
    id: 'calibration',
    label: 'Calib Cảm Biến 4-20mA',
    tag: 'SUB-02',
    icon: Gauge,
  },
  {
    id: 'power',
    label: 'Nguồn Kép & Solar',
    tag: 'SUB-03',
    icon: BatteryCharging,
  },
  {
    id: 'anomaly',
    label: 'AI Học Máy 7 Ngày',
    tag: 'SUB-04',
    icon: Activity,
  },
  {
    id: 'legacy',
    label: 'Khóa Van & An Toàn',
    tag: 'SUB-05',
    icon: Cpu,
  },
];

interface ScadaDeviceSettingsViewProps {
  onBack: () => void;
}

export const ScadaDeviceSettingsView: React.FC<ScadaDeviceSettingsViewProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('matrix');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showGlobalResetModal, setShowGlobalResetModal] = useState(false);

  const {
    saveAllSettings,
    resetGlobalSystem,
    controlMode,
    setControlMode,
    inletOverrideEnabled,
    setInletOverrideEnabled,
    inletThresholdBar,
    rtcStages,
    zeroConfirmed,
    confirmZeroPoint,
    point1Confirmed,
    point1ValueBar,
    calibRangeMax,
    calibUnit,
    battery36WarningEnabled,
    setBattery36Warning,
    battery36CurrentVoltage,
    battery36SpikeThresholdMa,
    solarCurrentPercent,
    solarBatteryType,
    solarWarningEnabled,
    masterAnomalyEnabled,
    setMasterAnomalyEnabled,
    anomalyDeviationPercent,
    anomalyPressureDeviationPercent,
    device1015LearningDay,
    device1015TotalSamples,
    nonMonitoringDays,
    pressureStopEnabled,
    setPressureStop,
    stopLowPressureBar,
    cycleStages,
  } = useSettingsStore();

  const handleSyncToDevice = async () => {
    setIsSyncing(true);
    toast.loading('Đang truyền gói tin cấu hình xuống Thiết Bị 1015 qua sóng 4G/NB-IoT...', { id: 'sync-cfg' });
    await new Promise((r) => setTimeout(r, 700));
    saveAllSettings();
    setIsSyncing(false);
    toast.success('Đã nạp và đồng bộ cấu hình vào bộ nhớ ROM Thiết Bị 1015 thành công!', { id: 'sync-cfg' });
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSyncToDevice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#0B0D11] text-slate-100 overflow-hidden select-none font-sans">
      {/* 1. TOP FLIGHT DECK COMMAND BAR */}
      <header className="shrink-0 bg-[#12151B] border-b border-slate-800/80 px-4 py-3 z-20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Back + Flight Header */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              type="button"
              className="p-2 rounded-xl bg-[#1A1F27] hover:bg-[#252C37] text-slate-300 hover:text-white border border-slate-700/80 transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
              title="Quay lại Giám Sát Trạm 1015"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
                  SCADA MISSION CONTROL //
                </span>
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight uppercase truncate">
                  TRẠM ĐIỀU ÁP 1015
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-[#E52E2D]/20 text-[#E52E2D] border border-[#E52E2D]/40">
                  ONLINE • 4G LTE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                5 Phân Hệ Cyber-Physical: Điều phối áp lực, Calib 4-20mA, Nguồn kép Solar, AI 7 ngày &amp; Safety Interlock
              </p>
            </div>
          </div>

          {/* Right: Sync & Reset Actions */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setShowGlobalResetModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181D24] hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="Khôi phục toàn bộ thông số xuất xưởng"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Khôi Phục Gốc</span>
            </button>

            <button
              type="button"
              disabled={isSyncing}
              onClick={handleSyncToDevice}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#E52E2D] to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-black shadow-lg shadow-red-500/25 transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
              title="Lưu và nạp cấu hình xuống thiết bị (Ctrl + S)"
            >
              {isSyncing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <UploadCloud className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
              <span>{isSyncing ? 'Đang Nạp Rom...' : 'Lưu & Nạp Thiết Bị'}</span>
              <span className="hidden md:inline text-[10px] opacity-75 font-mono font-normal">(Ctrl+S)</span>
            </button>
          </div>
        </div>

        {/* 2. DYNAMIC SEGMENTED COMMANDER (NAV STRIP) */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/60 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#E52E2D] to-rose-600 text-white border-[#E52E2D] shadow-md shadow-red-500/20'
                    : 'bg-[#181D24] text-slate-400 hover:text-white border-slate-800 hover:border-slate-700 hover:bg-[#1E242D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-black/30 text-white font-black' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.tag}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 3. DYNAMIC CONTENT VIEW AREA (SMOOTH LOCALIZED SCROLL) */}
      <main className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 lg:p-6 bg-[#0B0D11] scroll-smooth">
        <div className="max-w-6xl mx-auto pb-16">
          {/* VIEW MODE 1: BENTO SYSTEM MATRIX HUD */}
          {activeTab === 'matrix' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Executive Telemetry Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#141820] via-[#161B24] to-[#141820] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E52E2D] to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                        Active Telemetry HUD //
                      </span>
                      <span className="text-xs font-mono text-emerald-400 font-black">
                        TẤT CẢ 5 PHÂN HỆ ĐANG HOẠT ĐỘNG
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                      Ma Trận Điều Hành Toàn Cảnh Trạm 1015
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-slate-400 flex-wrap">
                  <div className="px-3 py-1 rounded-lg bg-black/50 border border-slate-800">
                    Chế độ: <strong className="text-white uppercase">{controlMode}</strong>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-black/50 border border-slate-800">
                    Calib: <strong className="text-emerald-400">{zeroConfirmed && point1Confirmed ? 'Chuẩn' : 'Cần Calib'}</strong>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-black/50 border border-slate-800">
                    AI 7 Ngày: <strong className="text-purple-400">Ngày {device1015LearningDay}/7</strong>
                  </div>
                </div>
              </div>

              {/* BENTO GRID: 5 INTERCONNECTED SUBSYSTEMS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. CARD: ĐIỀU PHỐI ÁP LỰC CHÍNH */}
                <div className="p-5 rounded-2xl bg-[#12151B] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E52E2D]/5 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-[#E52E2D]/15 text-[#E52E2D] border border-[#E52E2D]/30">
                          <SlidersHorizontal className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Subsystem 01</span>
                          <h3 className="text-sm font-black text-white">Điều Phối Áp Lực</h3>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-[#E52E2D] border border-[#E52E2D]/30">
                        {controlMode === 'rtc' ? 'RTC 5 Mốc' : controlMode === 'manual' ? 'Thủ Công' : 'Thích Ứng'}
                      </span>
                    </div>

                    {/* Mode Selector Chips */}
                    <div className="grid grid-cols-3 gap-1.5 my-3">
                      {(['manual', 'rtc', 'pressure_adaptive'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setControlMode(m)}
                          className={`py-1.5 px-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer truncate ${
                            controlMode === m
                              ? 'bg-[#E52E2D] text-white shadow-sm'
                              : 'bg-black/40 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          {m === 'manual' ? 'Thủ Công' : m === 'rtc' ? 'Lịch RTC' : 'Thích Ứng'}
                        </button>
                      ))}
                    </div>

                    {/* Inlet Overflow Indicator */}
                    <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ưu tiên xả tràn:</span>
                        </span>
                        <Switch
                          checked={inletOverrideEnabled}
                          onCheckedChange={setInletOverrideEnabled}
                          className="data-[state=checked]:bg-amber-500 scale-90"
                        />
                      </div>
                      <div className="text-[11px] text-amber-400 font-bold">
                        Kích hoạt khi áp đầu vào &lt; {inletThresholdBar} Bar
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('control')}
                    className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-slate-400 hover:text-[#E52E2D] transition-colors cursor-pointer"
                  >
                    <span>Mở Bảng Điều Khiển Chi Tiết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. CARD: CALIB CẢM BIẾN 4-20MA */}
                <div className="p-5 rounded-2xl bg-[#12151B] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                          <Crosshair className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Subsystem 02</span>
                          <h3 className="text-sm font-black text-white">Đặc Tuyến Cảm Biến</h3>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-cyan-300 border border-cyan-500/30">
                        {calibRangeMax} {calibUnit}
                      </span>
                    </div>

                    {/* Mini SVG Curve Preview */}
                    <div className="h-16 w-full rounded-lg bg-black/60 border border-slate-800 p-1 relative overflow-hidden my-2">
                      <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                        <line x1="20" y1="50" x2="190" y2="10" stroke="#00F2FE" strokeWidth="2.5" />
                        <circle cx="20" cy="50" r="3.5" fill="#00E676" />
                        <circle cx="105" cy="30" r="3.5" fill="#00F2FE" />
                        <circle cx="190" cy="10" r="3.5" fill="#FFB800" />
                      </svg>
                      <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400">
                        P0 (Zero) → P1 ({point1ValueBar}B) → P2
                      </div>
                    </div>

                    {/* 1-Click Zero Tare & Status */}
                    <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/40 border border-slate-800/80">
                      <div className="text-[11px] font-mono">
                        <span className="text-slate-400 block text-[9px]">Offset:</span>
                        <strong className="text-emerald-400">+0.02V</strong>
                      </div>
                      <button
                        type="button"
                        onClick={confirmZeroPoint}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-all active:scale-95 cursor-pointer"
                      >
                        {zeroConfirmed ? 'Đã Tare' : 'Lấy Zero Tare'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('calibration')}
                    className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <span>Mở Bàn Calib 3 Điểm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. CARD: NGUỒN KÉP SOLAR & PIN 3.6V */}
                <div className="p-5 rounded-2xl bg-[#12151B] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <BatteryCharging className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Subsystem 03</span>
                          <h3 className="text-sm font-black text-white">Năng Lượng Kép</h3>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-amber-400 border border-amber-500/30">
                        {solarBatteryType}
                      </span>
                    </div>

                    {/* Dual-Cell Gauges */}
                    <div className="grid grid-cols-2 gap-2 my-2">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                        <span className="text-[9px] font-mono uppercase text-slate-400 block">Pin 3.6V SpIn</span>
                        <span className="text-lg font-black text-white font-mono">
                          {battery36CurrentVoltage.toFixed(2)}V
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 block mt-0.5">Tải 12.4mA</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800">
                        <span className="text-[9px] font-mono uppercase text-slate-400 block">Solar PV SOC</span>
                        <span className="text-lg font-black text-emerald-400 font-mono">
                          {solarCurrentPercent}%
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 block mt-0.5">Nạp bình thường</span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between px-1">
                      <span>Ngưỡng Spike pin:</span>
                      <strong className="text-amber-400">&gt; {battery36SpikeThresholdMa} mA</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('power')}
                    className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span>Mở Bảng Nguồn Điện Kép</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 4. CARD: AI HỌC MÁY 7 NGÀY */}
                <div className="p-5 rounded-2xl bg-[#12151B] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          <Brain className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Subsystem 04</span>
                          <h3 className="text-sm font-black text-white">AI Học Máy 7 Ngày</h3>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-purple-300 border border-purple-500/30">
                        {device1015TotalSamples} MẪU
                      </span>
                    </div>

                    {/* 7-Day Orbit Tracker */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800 my-2">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1.5">
                        <span>Tiến trình tự học:</span>
                        <strong className="text-purple-300">Ngày {device1015LearningDay} / 7</strong>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <div
                            key={d}
                            className={`h-6 rounded text-[9px] font-mono font-bold flex items-center justify-center ${
                              d < device1015LearningDay
                                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                                : d === device1015LearningDay
                                ? 'bg-purple-500 text-slate-950 font-black animate-pulse'
                                : 'bg-slate-900 text-slate-600'
                            }`}
                          >
                            D{d}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between px-1">
                      <span>Dung sai phát hiện dị thường:</span>
                      <strong className="text-purple-300">±{anomalyDeviationPercent}% Flow</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('anomaly')}
                    className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    <span>Mở Bàn Điều Khiển AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 5. CARD: AN TOÀN & KHÓA VAN SCADA */}
                <div className="p-5 rounded-2xl bg-[#12151B] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden group md:col-span-2 lg:col-span-2">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Subsystem 05</span>
                          <h3 className="text-sm font-black text-white">An Toàn &amp; Khóa Van Khẩn Cấp</h3>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-rose-400 border border-rose-500/30">
                        {pressureStopEnabled ? 'INTERLOCK ARMED' : 'DISARMED'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-2">
                      <div className="p-3 rounded-xl bg-black/40 border border-rose-500/20">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-rose-400 font-bold">Khóa van khi cạn nguồn:</span>
                          <Switch
                            checked={pressureStopEnabled}
                            onCheckedChange={(c) => setPressureStop(c, stopLowPressureBar)}
                            className="data-[state=checked]:bg-rose-600 scale-90"
                          />
                        </div>
                        <div className="text-xs font-mono text-white mt-1">
                          Ngắt 100% van khi áp &lt; <strong className="text-rose-400">{stopLowPressureBar} Bar</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-slate-800">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Chu kỳ Chạy/Nghỉ (Duty Cycle)</span>
                        <div className="text-xs font-mono text-white mt-1">
                          Đang kích hoạt: <strong className="text-cyan-300">{cycleStages.filter(s => s.enabled).length} khoảng luân phiên</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('legacy')}
                    className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono font-bold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <span>Mở Bảng Điều Khiển An Toàn SCADA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: SPECIALIZED DEEP TUNING CONSOLES */}
          {activeTab === 'control' && <TabControlModes />}
          {activeTab === 'calibration' && <TabSensorCalibration />}
          {activeTab === 'power' && <TabPowerManagement />}
          {activeTab === 'anomaly' && <TabAnomalyDetection />}
          {activeTab === 'legacy' && <TabLegacyScada />}
        </div>
      </main>

      {/* 4. FACTORY RESET SAFETY CONFIRMATION MODAL */}
      {showGlobalResetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#181D24] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-white">
                Khôi Phục Toàn Bộ Cấu Hình Xuất Xưởng?
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Toàn bộ thông số hiệu chuẩn cảm biến, bảng giờ RTC 5 mốc, ngưỡng cảnh báo điện áp pin và thuật toán
              học máy 7 ngày của Thiết Bị 1015 sẽ được đưa về giá trị xuất xưởng của nhà sản xuất.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowGlobalResetModal(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  resetGlobalSystem();
                  setShowGlobalResetModal(false);
                  toast.success('Đã khôi phục toàn bộ cấu hình gốc của thiết bị 1015');
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-red-600/30"
              >
                Xác nhận khôi phục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
