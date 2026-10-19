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
    toast.success('Đã cập nhật tham số ưu tiên xả tràn!');
  };

  // Convert "HH:MM" to minutes for duration/timeline calculations
  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const MODES = [
    {
      id: 'manual',
      title: 'Vận Hành Thủ Công',
      icon: SlidersHorizontal,
    },
    {
      id: 'rtc',
      title: 'Hẹn Giờ Thời Gian Thực (RTC)',
      icon: Clock,
    },
    {
      id: 'pressure_adaptive',
      title: 'Dựa Theo Áp Suất Đầu Vào',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Card: Chế độ vận hành chính */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
          <h3 className="text-xl font-black text-white flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span>Chế Độ Vận Hành Chính</span>
          </h3>
          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>
              {controlMode === 'manual'
                ? 'Thủ công (Manual)'
                : controlMode === 'rtc'
                ? 'Hẹn giờ RTC (5 Giai đoạn)'
                : 'Thích ứng áp lực (Adaptive)'}
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {MODES.map((mode) => {
            const isSelected = controlMode === mode.id;
            const Icon = mode.icon;
            return (
              <div
                key={mode.id}
                onClick={() => setControlMode(mode.id as any)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'border-cyan-400 bg-gradient-to-b from-cyan-950/60 to-slate-900/90 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                    : 'border-white/10 hover:border-white/20 bg-slate-900/50 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-white/5 text-slate-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className={`text-base font-black ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                    {mode.title}
                  </h4>
                </div>

                {isSelected && (
                  <span className="p-1.5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Card: Cần gạt vận hành dựa theo áp suất đầu vào (Ưu tiên xả tràn) */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl font-black text-white">
                Ưu Tiên Xả Tràn Theo Áp Suất Đầu Vào
              </h3>
              {inletOverrideEnabled && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ĐANG BẬT
                </span>
              )}
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
                className="px-4 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                <span>Chỉnh sửa</span>
              </button>
            )}
            <Switch
              checked={inletOverrideEnabled}
              onCheckedChange={setInletOverrideEnabled}
              className="data-[state=checked]:bg-cyan-500 scale-125"
            />
          </div>
        </div>

        {/* Dashboard 4 ô thông số */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {/* Ngưỡng áp */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Ngưỡng Áp Kích Hoạt
            </span>
            {isEditingOverride ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="5.0"
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(parseFloat(e.target.value) || 1.4)}
                    className="w-24 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-400 text-lg font-black text-white font-mono focus:outline-hidden"
                  />
                  <span className="text-sm font-bold text-slate-300">Bar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[1.0, 1.2, 1.4, 1.6, 2.0].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTempThreshold(val)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        tempThreshold === val ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-2xl font-black text-amber-300 font-mono tracking-tight">
                &lt; {inletThresholdBar} Bar
              </span>
            )}
          </div>

          {/* Chu kỳ kiểm tra */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Chu Kỳ Duy Trì
            </span>
            {isEditingOverride ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 3, 5, 10].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setTempCycle(mins)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      tempCycle === mins
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                        : 'bg-slate-950 border border-white/15 text-slate-300 hover:text-white'
                    }`}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {inletCycleMinutes} phút
              </span>
            )}
          </div>

          {/* Hành động ưu tiên */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/25 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              Hành Động Ưu Tiên
            </span>
            <span className="text-xl font-black text-amber-300 flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>MỞ FULL (100%)</span>
            </span>
          </div>

          {/* Trạng thái tương hỗ với RTC */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Thời Gian Thực
            </span>
            <span className="text-base font-bold text-cyan-300">
              {inletOverrideEnabled
                ? `Vô hiệu khi < ${inletThresholdBar} Bar`
                : 'Bình thường theo lịch'}
            </span>
          </div>
        </div>

        {isEditingOverride && (
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditingOverride(false)}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-300 hover:text-white border border-white/10 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveOverrideParams}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-cyan-500/25 cursor-pointer"
            >
              Lưu Thay Đổi
            </button>
          </div>
        )}
      </div>

      {/* 3. Card: Lập lịch hẹn giờ thời gian thực (RTC 5 giai đoạn) */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <h3 className="text-xl font-black text-white flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Hẹn Giờ Thời Gian Thực (5 Giai Đoạn)</span>
          </h3>

          <div className="flex items-center gap-3">
            <span className="text-xs text-cyan-300 font-bold font-mono bg-cyan-950/60 px-3 py-1.5 rounded-full border border-cyan-500/40">
              {rtcStages.filter((s) => s.enabled).length} / {rtcStages.length} Giai đoạn đang BẬT
            </span>
          </div>
        </div>

        {/* 24-HOUR VISUAL TIMELINE BAR */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/70 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>

          <div className="h-6 w-full rounded-xl bg-slate-950/80 border border-white/15 relative overflow-hidden flex">
            {rtcStages.map((stage) => {
              const startMin = timeToMinutes(stage.startTime);
              const endMin = timeToMinutes(stage.endTime);
              let durationMin = endMin - startMin;
              if (durationMin < 0) durationMin += 24 * 60;
              const widthPct = (durationMin / (24 * 60)) * 100;

              return (
                <div
                  key={stage.id}
                  title={`${stage.name}: ${stage.startTime} - ${stage.endTime}`}
                  style={{ width: `${widthPct}%` }}
                  className={`h-full border-r border-slate-950 transition-all flex items-center justify-center text-[10px] font-mono font-bold truncate px-1 ${
                    !stage.enabled
                      ? 'bg-slate-800/40 text-slate-500'
                      : stage.targetLevel === 1
                      ? 'bg-emerald-500 text-slate-950'
                      : stage.targetLevel === 2
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  <span className="truncate">{stage.name}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 mt-3 text-xs text-slate-300 flex-wrap justify-end">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Mức 1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Mức 2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Mức 3</span>
            </div>
          </div>
        </div>

        {/* Danh sách 5 giai đoạn */}
        <div className="divide-y divide-white/10 mt-5">
          {rtcStages.map((stage: RtcScheduleStage) => (
            <div
              key={stage.id}
              className={`py-4 px-3 sm:px-4 rounded-2xl my-2 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                stage.enabled
                  ? 'bg-slate-900/40 border border-white/10'
                  : 'bg-slate-950/20 border border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <Switch
                  checked={stage.enabled}
                  onCheckedChange={() => toggleRtcStage(stage.id)}
                  className="data-[state=checked]:bg-cyan-500 scale-110"
                />
                <span className="font-black text-white text-base">
                  {stage.name}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 font-mono text-xs sm:text-sm bg-slate-950/80 p-1.5 rounded-xl border border-white/10">
                  <span className="text-slate-400 font-sans font-medium px-1">Từ</span>
                  <input
                    type="time"
                    value={stage.startTime}
                    disabled={!stage.enabled}
                    onChange={(e) => updateRtcStage(stage.id, { startTime: e.target.value })}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/20 text-xs sm:text-sm font-bold text-white disabled:opacity-40 focus:border-cyan-400"
                  />
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400 font-sans font-medium px-1">Đến</span>
                  <input
                    type="time"
                    value={stage.endTime}
                    disabled={!stage.enabled}
                    onChange={(e) => updateRtcStage(stage.id, { endTime: e.target.value })}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-white/20 text-xs sm:text-sm font-bold text-white disabled:opacity-40 focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-white/10">
                  {[1, 2, 3].map((lvl) => {
                    const isSelected = stage.targetLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        disabled={!stage.enabled}
                        onClick={() => updateRtcStage(stage.id, { targetLevel: lvl as any })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          isSelected
                            ? lvl === 1
                              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25 ring-1 ring-emerald-400'
                              : lvl === 2
                              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25 ring-1 ring-amber-300'
                              : 'bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-1 ring-rose-400'
                            : 'bg-transparent text-slate-400 hover:text-white'
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


