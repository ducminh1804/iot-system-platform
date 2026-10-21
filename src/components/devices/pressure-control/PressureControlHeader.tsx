import React from 'react';
import { ArrowLeft, Wifi, Settings, X } from 'lucide-react';

interface PressureControlHeaderProps {
  ratio0: string;
  ratio90: string;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  onBack: () => void;
}

export function PressureControlHeader({
  ratio0,
  ratio90,
  isSettingsOpen,
  onToggleSettings,
  onBack,
}: PressureControlHeaderProps) {
  return (
    <div className="relative z-50 shrink-0 w-full bg-white dark:bg-[#13161F] rounded-[20px] sm:rounded-[22px] border border-slate-200/90 dark:border-slate-800/90 px-3.5 py-2.5 sm:py-3 shadow-xs flex items-center justify-between gap-3 transition-colors">
      {/* Left: Back button + Station Identity */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (isSettingsOpen) {
              onToggleSettings();
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
              1015 0:{ratio0} 90:{ratio90}
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
          onClick={onToggleSettings}
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
  );
}
