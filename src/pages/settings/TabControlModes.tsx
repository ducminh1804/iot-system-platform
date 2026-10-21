import React, { useState } from 'react';
import {
  Edit2,
  Check,
  Clock,
  Activity,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  Zap,
  Sun,
  Moon,
  Compass,
  Radio,
} from 'lucide-react';
import { useSettingsStore, RtcScheduleStage } from '@/stores/useSettingsStore';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const TabControlModes: React.FC = () => {
  const {
    controlMode,
    setControlMode,
    inletOverrideEnabled,
    setInletOverrideEnabled,
    inletThresholdBar,
    setInletThresholdBar,
    inletCycleMinutes,
    setInletCycleMinutes,
    rtcStages,
    toggleRtcStage,
    updateRtcStage,
  } = useSettingsStore();

  const [isEditingOverride, setIsEditingOverride] = useState(false);
  const [tempThreshold, setTempThreshold] = useState(inletThresholdBar);
  const [tempCycle, setTempCycle] = useState(inletCycleMinutes);

  const handleSaveOverrideParams = () => {
    setInletThresholdBar(tempThreshold);
    setInletCycleMinutes(tempCycle);
    setIsEditingOverride(false);
    toast.success('Đã lưu tham số xả tràn đầu vào!');
  };

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const MODES = [
    {
      id: 'manual' as const,
      tag: '01 // DIRECT',
      title: 'Vận Hành Thủ Công',
      subtitle: 'Điều phối trực tiếp từ SCADA / Tại chỗ',
      description: 'Gửi lệnh đóng/mở van theo 3 mức cố định tức thời, không phụ thuộc lịch hay cảm biến.',
      icon: SlidersHorizontal,
      badge: 'Trực tiếp 100%',
      accent: 'from-amber-500/20 to-orange-500/5',
      glow: 'shadow-amber-500/10',
    },
    {
      id: 'rtc' as const,
      tag: '02 // CHRONO',
      title: 'Hẹn Giờ Thời Gian Thực (RTC)',
      subtitle: 'Chu kỳ sinh học 24h • 5 Mốc tự động',
      description: 'Tự động luân chuyển áp lực theo lịch đồng hồ thực của trạm: Đêm, Sáng, Trưa, Cao điểm, Tối.',
      icon: Clock,
      badge: 'Khuyên Dùng',
      accent: 'from-[#E52E2D]/20 to-rose-500/5',
      glow: 'shadow-red-500/10',
    },
    {
      id: 'pressure_adaptive' as const,
      tag: '03 // ADAPTIVE',
      title: 'Thích Ứng Áp Suất Đầu Vào',
      subtitle: 'Dynamic Pressure Sensing Loop',
      description: 'Liên tục đọc áp suất đầu vào thời gian thực để tự động mở xả tràn bảo vệ mạng lưới.',
      icon: Activity,
      badge: 'Bảo Vệ Động',
      accent: 'from-cyan-500/20 to-blue-500/5',
      glow: 'shadow-cyan-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. TRI-MODE FLIGHT SELECTOR */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#E52E2D]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E52E2D] to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Subsystem 01 // Core Dispatch
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Phương Thức Điều Phối Áp Lực
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#E52E2D] animate-pulse" />
              <span>Chế độ hiện hành:</span>
              <strong className="text-white uppercase font-bold">
                {controlMode === 'rtc' ? 'RTC 5 Mốc' : controlMode === 'manual' ? 'Thủ Công' : 'Thích Ứng'}
              </strong>
            </span>
          </div>
        </div>

        {/* 3 Interactive Cockpit Mode Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 relative z-10">
          {MODES.map((mode) => {
            const isSelected = controlMode === mode.id;
            const Icon = mode.icon;

            return (
              <div
                key={mode.id}
                onClick={() => setControlMode(mode.id)}
                className={`relative p-5 rounded-xl border transition-all duration-300 cursor-pointer group flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-[#181D24] border-[#E52E2D] shadow-xl shadow-red-500/10 ring-1 ring-[#E52E2D]/50 scale-[1.02]'
                    : 'bg-[#14171C]/80 border-slate-800/90 hover:border-slate-700 hover:bg-[#181C22]'
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E52E2D] to-transparent" />
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold">
                      {mode.tag}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#E52E2D]/20 text-[#E52E2D] border border-[#E52E2D]/30'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      {mode.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-[#E52E2D] text-white shadow-md shadow-red-500/30'
                          : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white">{mode.title}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{mode.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {mode.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-slate-400">
                    {isSelected ? 'Đang kích hoạt' : 'Bấm để chuyển'}
                  </span>
                  {isSelected ? (
                    <span className="flex items-center gap-1 font-bold text-[#E52E2D]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>ONLINE</span>
                    </span>
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-transform group-hover:translate-x-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. INLET PRESSURE OVERFLOW INTERLOCK (XẢ TRÀN KHẨN CẤP) */}
      <div className="rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Protection Loop // Inlet Surge
                </span>
                {inletOverrideEnabled && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
                    ARMED
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Ưu Tiên Xả Tràn Theo Áp Suất Đầu Vào
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {!isEditingOverride && inletOverrideEnabled && (
              <button
                type="button"
                onClick={() => {
                  setTempThreshold(inletThresholdBar);
                  setTempCycle(inletCycleMinutes);
                  setIsEditingOverride(true);
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:text-white hover:border-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Hiệu chỉnh ngưỡng</span>
              </button>
            )}
            <Switch
              checked={inletOverrideEnabled}
              onCheckedChange={setInletOverrideEnabled}
              className="data-[state=checked]:bg-amber-500 scale-110"
            />
          </div>
        </div>

        {/* Visual Surge Needle & Gauge Bar */}
        <div className="mt-5 p-4 rounded-xl bg-[#0D1014] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">
              Vùng xả tràn: <strong className="text-amber-400">&lt; {inletThresholdBar} Bar</strong>
            </span>
            <span className="text-emerald-400 font-bold">Vùng Áp Lực Bình Thường</span>
            <span className="text-slate-400">Áp lực Max: 10.0 Bar</span>
          </div>

          {/* Interactive Range Rail */}
          <div className="h-4 w-full rounded-full bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center">
            {/* Surge Zone */}
            <div
              style={{ width: `${(inletThresholdBar / 10) * 100}%` }}
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 relative flex items-center justify-end pr-1 transition-all duration-300"
            >
              <div className="w-1.5 h-full bg-white shadow-[0_0_8px_white]" />
            </div>
            {/* Safe Zone */}
            <div className="flex-1 h-full bg-emerald-500/20" />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>0.0 Bar (Cạn kiệt)</span>
            <span className="text-amber-400 font-bold">Ngưỡng kích hoạt: {inletThresholdBar} Bar</span>
            <span>10.0 Bar</span>
          </div>
        </div>

        {/* 4 Interactive Instrument Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800/80 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Ngưỡng Áp Kích Hoạt
            </span>
            {isEditingOverride ? (
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5.0"
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(parseFloat(e.target.value) || 1.4)}
                    className="w-20 px-2 py-1 rounded bg-black border border-amber-500 text-lg font-black text-amber-400 font-mono focus:outline-hidden"
                  />
                  <span className="text-xs font-bold text-slate-400">Bar</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1.0, 1.2, 1.4, 1.6, 2.0].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setTempThreshold(v)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        tempThreshold === v
                          ? 'bg-amber-500 text-black font-black'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-2xl font-black text-amber-400 font-mono tracking-tight mt-1">
                &lt; {inletThresholdBar} <span className="text-sm font-sans font-bold text-slate-400">Bar</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800/80 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Chu Kỳ Giữ Áp
            </span>
            {isEditingOverride ? (
              <div className="flex items-center gap-1.5 mt-2">
                {[1, 3, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTempCycle(mins)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                      tempCycle === mins
                        ? 'bg-amber-500 text-black font-black shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins}p
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-2xl font-black text-white font-mono tracking-tight mt-1">
                {inletCycleMinutes} <span className="text-sm font-sans font-bold text-slate-400">phút</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-black border border-amber-500/30 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Hành Động Khẩn Cấp
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-lg font-black text-amber-300 font-mono">MỞ FULL (100%)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800/80 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Cơ Chế Khóa RTC
            </span>
            <span className="text-xs font-bold text-slate-300 mt-1">
              {inletOverrideEnabled
                ? `Vô hiệu RTC khi < ${inletThresholdBar} Bar`
                : 'Tuân thủ lịch bình thường'}
            </span>
          </div>
        </div>

        {isEditingOverride && (
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingOverride(false)}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveOverrideParams}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-md cursor-pointer"
            >
              Lưu Thiết Lập Xả Tràn
            </button>
          </div>
        )}
      </div>

      {/* 3. 24-HOUR CIRCADIAN CHRONO-BAND (HẸN GIỜ THỜI GIAN THỰC) */}
      <div className="rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E52E2D]/15 text-[#E52E2D] border border-[#E52E2D]/30 flex items-center justify-center shadow-lg shadow-red-500/10">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Chronological Engine // 24H Cycle
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E52E2D]/20 text-[#E52E2D] border border-[#E52E2D]/30">
                  {rtcStages.filter((s) => s.enabled).length} / {rtcStages.length} MỐC BẬT
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Băng Hẹn Giờ 24 Giờ Thời Gian Thực
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Đêm 00:00</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Ngày 12:00</span>
            </div>
          </div>
        </div>

        {/* 24-HOUR VISUAL RIBBON */}
        <div className="mt-5 p-4 rounded-xl bg-[#0D1014] border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>00:00 (Khuya)</span>
            <span>06:00 (Sáng)</span>
            <span>12:00 (Trưa)</span>
            <span>18:00 (Chiều)</span>
            <span>24:00 (Đêm)</span>
          </div>

          <div className="h-8 w-full rounded-lg bg-slate-900 border border-slate-800 relative overflow-hidden flex shadow-inner">
            {rtcStages.map((stage) => {
              const startMin = timeToMinutes(stage.startTime);
              const endMin = timeToMinutes(stage.endTime);
              let durationMin = endMin - startMin;
              if (durationMin < 0) durationMin += 24 * 60;
              const widthPct = (durationMin / (24 * 60)) * 100;

              return (
                <div
                  key={stage.id}
                  title={`${stage.name}: ${stage.startTime} - ${stage.endTime} (Mức ${stage.targetLevel})`}
                  style={{ width: `${widthPct}%` }}
                  className={`h-full border-r border-black/40 transition-all flex flex-col items-center justify-center text-[10px] font-mono font-black truncate px-1 relative group cursor-pointer ${
                    !stage.enabled
                      ? 'bg-slate-800/50 text-slate-500'
                      : stage.targetLevel === 1
                      ? 'bg-emerald-500 text-slate-950 shadow-inner'
                      : stage.targetLevel === 2
                      ? 'bg-amber-400 text-slate-950 shadow-inner'
                      : 'bg-[#E52E2D] text-white shadow-inner'
                  }`}
                >
                  <span className="truncate">{stage.name}</span>
                  <span className="text-[9px] opacity-80 font-normal">
                    {stage.enabled ? `L${stage.targetLevel}` : 'OFF'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-5 mt-3 text-xs text-slate-400 font-mono justify-end flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              <span>Mức 1 (28% - Tiết kiệm)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
              <span>Mức 2 (50% - Chuẩn)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#E52E2D]" />
              <span>Mức 3 (100% - Cao điểm)</span>
            </div>
          </div>
        </div>

        {/* 5 Stages Config Rows */}
        <div className="space-y-3 mt-5">
          {rtcStages.map((stage: RtcScheduleStage) => (
            <div
              key={stage.id}
              className={`p-3.5 sm:p-4 rounded-xl transition-all border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                stage.enabled
                  ? 'bg-[#15191F] border-slate-800 shadow-md'
                  : 'bg-[#0E1115] border-slate-900 opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Switch
                  checked={stage.enabled}
                  onCheckedChange={() => toggleRtcStage(stage.id)}
                  className="data-[state=checked]:bg-[#E52E2D] scale-110"
                />
                <div>
                  <span className="font-black text-white text-sm block">
                    {stage.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Khung giờ: {stage.startTime} → {stage.endTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Time range input */}
                <div className="flex items-center gap-1.5 font-mono text-xs bg-black/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] px-1 uppercase">Từ</span>
                  <input
                    type="time"
                    value={stage.startTime}
                    disabled={!stage.enabled}
                    onChange={(e) => updateRtcStage(stage.id, { startTime: e.target.value })}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-white disabled:opacity-40 focus:border-[#E52E2D] outline-hidden"
                  />
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="text-slate-400 text-[10px] px-1 uppercase">Đến</span>
                  <input
                    type="time"
                    value={stage.endTime}
                    disabled={!stage.enabled}
                    onChange={(e) => updateRtcStage(stage.id, { endTime: e.target.value })}
                    className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-xs font-bold text-white disabled:opacity-40 focus:border-[#E52E2D] outline-hidden"
                  />
                </div>

                {/* Level selector */}
                <div className="flex items-center gap-1 bg-black/60 p-1.5 rounded-lg border border-slate-800">
                  {[1, 2, 3].map((lvl) => {
                    const isSelected = stage.targetLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        disabled={!stage.enabled}
                        onClick={() => updateRtcStage(stage.id, { targetLevel: lvl as any })}
                        className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? lvl === 1
                              ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/30'
                              : lvl === 2
                              ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/30'
                              : 'bg-[#E52E2D] text-white font-black shadow-md shadow-red-500/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        } disabled:opacity-30 disabled:cursor-not-allowed`}
                      >
                        Mức {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
