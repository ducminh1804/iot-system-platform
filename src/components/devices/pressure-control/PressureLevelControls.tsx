import React, { useState, useEffect } from 'react';
import { SpeedometerGauge } from '@/components/gauge/SpeedometerGauge';
import { Clock, ShieldAlert, PowerOff } from 'lucide-react';
import { ActivePressureLevel } from './types';

interface PressureLevelControlsProps {
  activeLevel: ActivePressureLevel;
  gaugeVal1: number;
  gaugeVal2: number;
  gaugeVal3: number;
  lastActionTimes: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
  onSelectLevel?: (level: 1 | 2 | 3) => void;
  onShutoffWater?: () => void;
  readOnly?: boolean;
}

export function PressureLevelControls({
  activeLevel,
  gaugeVal1,
  gaugeVal2,
  gaugeVal3,
  lastActionTimes,
  onSelectLevel,
  onShutoffWater,
  readOnly = false,
}: PressureLevelControlsProps) {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile: 70px (4 cards chung 1 hàng vừa khít ~360-400px), Tablet: 120px, Desktop: 175px
  const gaugeSize = windowWidth < 640 ? 70 : windowWidth < 1024 ? 120 : 175;

  const formatShortTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.trim().split(' ');
    return parts.length > 1 ? parts[1] : timeStr;
  };

  return (
    <div className="shrink-0 grid grid-cols-4 gap-1 sm:gap-2 lg:gap-3">
      {/* Gauge 1: Mức áp 1 */}
      <div
        role={readOnly ? undefined : 'button'}
        tabIndex={readOnly ? -1 : 0}
        onClick={readOnly ? undefined : () => onSelectLevel?.(1)}
        onKeyDown={readOnly ? undefined : (e) => e.key === 'Enter' && onSelectLevel?.(1)}
        className={`h-[110px] sm:h-[142px] lg:h-[180px] rounded-[14px] sm:rounded-[20px] lg:rounded-[22px] bg-white dark:bg-[#13161F] p-1.5 sm:p-2.5 lg:p-3 shadow-xs flex flex-col items-center justify-between transition-all duration-300 overflow-hidden ${
          readOnly ? 'cursor-default pointer-events-none' : 'cursor-pointer'
        } ${
          activeLevel === 1
            ? 'border-2 border-blue-500/80 dark:border-blue-500/80 ring-2 ring-blue-500/20 shadow-blue-500/10'
            : 'border border-slate-200/90 dark:border-slate-800/90 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="w-full flex items-center justify-center pb-0.5 sm:pb-1">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className={`text-[11px] sm:text-xs lg:text-[13px] font-extrabold transition-colors truncate ${
                activeLevel === 1
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Mức <span className="hidden sm:inline">áp </span>1
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                activeLevel === 1 ? 'bg-blue-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          </div>
        </div>

        <div className="py-0 sm:py-0.5 pointer-events-none flex items-center justify-center">
          <SpeedometerGauge
            value={gaugeVal1}
            unit="mH₂O"
            size={gaugeSize}
            variant="embedded"
            showControls={false}
            showMetrics={false}
            easingStyle="spring"
          />
        </div>

        <div className="w-full pt-0.5 sm:pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center sm:justify-between text-[10px] sm:text-[11px] lg:text-xs">
          <span className="text-slate-400 font-medium hidden sm:flex items-center gap-1 truncate">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500 shrink-0" />
            <span className="hidden lg:inline">Gần nhất:</span>
          </span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
            <span className="hidden sm:inline">{lastActionTimes[1]}</span>
            <span className="sm:hidden">{formatShortTime(lastActionTimes[1])}</span>
          </span>
        </div>
      </div>

      {/* Gauge 2: Mức áp 2 */}
      <div
        role={readOnly ? undefined : 'button'}
        tabIndex={readOnly ? -1 : 0}
        onClick={readOnly ? undefined : () => onSelectLevel?.(2)}
        onKeyDown={readOnly ? undefined : (e) => e.key === 'Enter' && onSelectLevel?.(2)}
        className={`h-[110px] sm:h-[142px] lg:h-[180px] rounded-[14px] sm:rounded-[20px] lg:rounded-[22px] bg-white dark:bg-[#13161F] p-1.5 sm:p-2.5 lg:p-3 shadow-xs flex flex-col items-center justify-between transition-all duration-300 overflow-hidden ${
          readOnly ? 'cursor-default pointer-events-none' : 'cursor-pointer'
        } ${
          activeLevel === 2
            ? 'border-2 border-emerald-500/80 dark:border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
            : 'border border-slate-200/90 dark:border-slate-800/90 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="w-full flex items-center justify-center pb-0.5 sm:pb-1">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className={`text-[11px] sm:text-xs lg:text-[13px] font-extrabold transition-colors truncate ${
                activeLevel === 2
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Mức <span className="hidden sm:inline">áp </span>2
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                activeLevel === 2 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          </div>
        </div>

        <div className="py-0 sm:py-0.5 pointer-events-none flex items-center justify-center">
          <SpeedometerGauge
            value={gaugeVal2}
            unit="mH₂O"
            size={gaugeSize}
            variant="embedded"
            showControls={false}
            showMetrics={false}
            easingStyle="spring"
          />
        </div>

        <div className="w-full pt-0.5 sm:pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center sm:justify-between text-[10px] sm:text-[11px] lg:text-xs">
          <span className="text-slate-400 font-medium hidden sm:flex items-center gap-1 truncate">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500 shrink-0" />
            <span className="hidden lg:inline">Gần nhất:</span>
          </span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
            <span className="hidden sm:inline">{lastActionTimes[2]}</span>
            <span className="sm:hidden">{formatShortTime(lastActionTimes[2])}</span>
          </span>
        </div>
      </div>

      {/* Gauge 3: Mở full */}
      <div
        role={readOnly ? undefined : 'button'}
        tabIndex={readOnly ? -1 : 0}
        onClick={readOnly ? undefined : () => onSelectLevel?.(3)}
        onKeyDown={readOnly ? undefined : (e) => e.key === 'Enter' && onSelectLevel?.(3)}
        className={`h-[110px] sm:h-[142px] lg:h-[180px] rounded-[14px] sm:rounded-[20px] lg:rounded-[22px] bg-white dark:bg-[#13161F] p-1.5 sm:p-2.5 lg:p-3 shadow-xs flex flex-col items-center justify-between transition-all duration-300 overflow-hidden ${
          readOnly ? 'cursor-default pointer-events-none' : 'cursor-pointer'
        } ${
          activeLevel === 3
            ? 'border-2 border-amber-500/80 dark:border-amber-500/80 ring-2 ring-amber-500/20 shadow-amber-500/10'
            : 'border border-slate-200/90 dark:border-slate-800/90 opacity-70 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="w-full flex items-center justify-center pb-0.5 sm:pb-1">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className={`text-[11px] sm:text-xs lg:text-[13px] font-extrabold transition-colors truncate ${
                activeLevel === 3
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Mở full
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                activeLevel === 3 ? 'bg-amber-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          </div>
        </div>

        <div className="py-0 sm:py-0.5 pointer-events-none flex items-center justify-center">
          <SpeedometerGauge
            value={gaugeVal3}
            unit="%"
            size={gaugeSize}
            variant="embedded"
            showControls={false}
            showMetrics={false}
            easingStyle="spring"
          />
        </div>

        <div className="w-full pt-0.5 sm:pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center sm:justify-between text-[10px] sm:text-[11px] lg:text-xs">
          <span className="text-slate-400 font-medium hidden sm:flex items-center gap-1 truncate">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500 shrink-0" />
            <span className="hidden lg:inline">Gần nhất:</span>
          </span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
            <span className="hidden sm:inline">{lastActionTimes[3]}</span>
            <span className="sm:hidden">{formatShortTime(lastActionTimes[3])}</span>
          </span>
        </div>
      </div>

      {/* Card 4: Đóng nước (Hỗ trợ click lần 2 để mở lại nước về mức trước đó) */}
      <div
        role={readOnly ? undefined : 'button'}
        tabIndex={readOnly ? -1 : 0}
        onClick={readOnly ? undefined : onShutoffWater}
        onKeyDown={readOnly ? undefined : (e) => e.key === 'Enter' && onShutoffWater?.()}
        title={
          readOnly
            ? undefined
            : activeLevel === 0
            ? 'Đang đóng nước. Bấm để mở lại nước về mức áp trước đó'
            : 'Bấm để đóng nước trạm'
        }
        className={`h-[110px] sm:h-[142px] lg:h-[180px] rounded-[14px] sm:rounded-[20px] lg:rounded-[22px] p-1.5 sm:p-2.5 lg:p-3 shadow-xs flex flex-col items-center justify-between transition-all duration-300 overflow-hidden select-none active:scale-95 ${
          readOnly ? 'cursor-default pointer-events-none' : 'cursor-pointer'
        } ${
          activeLevel === 0
            ? 'bg-rose-50/40 dark:bg-rose-950/20 border-2 border-rose-500/90 dark:border-rose-500/90 ring-2 ring-rose-500/20 shadow-rose-500/10'
            : 'bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 opacity-70 hover:opacity-100 hover:border-rose-300 dark:hover:border-rose-700/60'
        }`}
      >
        {/* Card Header */}
        <div className="w-full flex items-center justify-center pb-0.5 sm:pb-1">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span
              className={`text-[11px] sm:text-xs lg:text-[13px] font-extrabold transition-colors truncate ${
                activeLevel === 0
                  ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Đóng<span className="hidden sm:inline"> nước</span>
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all shrink-0 ${
                activeLevel === 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          </div>
        </div>

        {/* Card Center: Valve Actuator */}
        <div className="flex-1 w-full flex items-center justify-center py-0.5 sm:py-1">
          <div
            className={`w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-lg sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
              activeLevel === 0
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/35 ring-2 sm:ring-4 ring-rose-500/20 scale-105'
                : 'bg-slate-100 dark:bg-[#1A202C] text-slate-400 border border-slate-200/80 dark:border-slate-700/80 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
            }`}
          >
            {activeLevel === 0 ? (
              <ShieldAlert className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 animate-pulse" />
            ) : (
              <PowerOff className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
            )}
          </div>
        </div>

        {/* Card Bottom: Operation Timestamp */}
        <div className="w-full pt-0.5 sm:pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center sm:justify-between text-[10px] sm:text-[11px] lg:text-xs">
          <span className="text-slate-400 font-medium hidden sm:flex items-center gap-1 truncate">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500 shrink-0" />
            <span className="hidden lg:inline">Gần nhất:</span>
          </span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-300 truncate">
            <span className="hidden sm:inline">{lastActionTimes[4]}</span>
            <span className="sm:hidden">{formatShortTime(lastActionTimes[4])}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
