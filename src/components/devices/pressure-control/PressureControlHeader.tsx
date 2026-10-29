import React from 'react';
import { ArrowLeft, Radio, Settings, X, Clock } from 'lucide-react';

interface PressureControlHeaderProps {
  stationName?: string;
  stationId?: string;
  version?: string;
  ratio0: string;
  ratio90: string;
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  rtcTime?: string;
}

export function PressureControlHeader({
  stationName = 'Thiết bị điều khiển áp lực tự động',
  stationId = '1015',
  version = 'v1',
  ratio0,
  ratio90,
  isSettingsOpen,
  onToggleSettings,
  onBack,
  showBackButton = true,
  rtcTime,
}: PressureControlHeaderProps) {
  return (
    <div className="relative z-50 shrink-0 w-full bg-white dark:bg-[#13161F] rounded-[18px] sm:rounded-[22px] border border-slate-200/90 dark:border-slate-800/90 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 shadow-xs flex items-center justify-between gap-2 sm:gap-3 transition-colors">
      {/* Left: Back button (if enabled) + Station Identity (ID + Ratios + Name) */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 max-w-[calc(50%-20px)] sm:max-w-[calc(50%-24px)]">
        {showBackButton && onBack && (
          <button
            type="button"
            onClick={() => {
              if (isSettingsOpen) {
                onToggleSettings();
              } else {
                onBack();
              }
            }}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            title={isSettingsOpen ? 'Thoát cài đặt' : 'Quay lại danh sách thiết bị'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 min-w-0">
            {/* Mã trạm / ID luôn nổi bật và KHÔNG BAO GIỜ bị ẩn */}
            <h2 className="text-sm sm:text-base lg:text-lg font-black text-slate-900 dark:text-white tracking-tight font-mono shrink-0">
              {stationId}
            </h2>
            {/* Tỉ số van bước */}
            <span className="text-[11px] sm:text-xs font-mono font-semibold text-slate-400 dark:text-slate-500 truncate">
              0:{ratio0} 90:{ratio90}
            </span>
          </div>

          {/* Tên trạm hiển thị rõ ràng */}
          <p
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate"
            title={stationName}
          >
            {stationName}
          </p>
        </div>
      </div>

      {/* Center: Realtime Telemetry Broadcast Icon - Strictly Centered at 50% */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full sm:rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 dark:border-emerald-500/50 shadow-sm shadow-emerald-500/15 transition-all pointer-events-auto"
          title="Trực tuyến • Sóng kết nối thời gian thực"
        >
          <Radio className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 animate-pulse stroke-[2.4]" />
        </div>
      </div>

      {/* Right: Version + RTC timestamp + Settings Gear Button */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Version chuyển sang bên phải cạnh Settings để không chèn ép ID và tên trạm */}
        {version && (
          <span
            className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shrink-0 select-none"
            title={`Phiên bản phần mềm: ${version}`}
          >
            {version.startsWith('v') ? version : `v${version.replace(/^version\s*/i, '')}`}
          </span>
        )}

        {rtcTime && (
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1A202C] border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 shadow-2xs select-none"
            title="Thời gian thực thiết bị (RTC)"
          >
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-400">RTC:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{rtcTime}</span>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleSettings}
          className={`p-1.5 sm:p-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center shadow-xs active:scale-95 ${
            isSettingsOpen
              ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 shadow-rose-500/10'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
          }`}
          title={isSettingsOpen ? 'Thoát cài đặt (Đóng)' : 'Cài đặt thông số thiết bị'}
        >
          {isSettingsOpen ? (
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400 transition-transform duration-300 rotate-90" />
          ) : (
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300 transition-transform duration-500 hover:rotate-90" />
          )}
        </button>
      </div>
    </div>
  );
}
