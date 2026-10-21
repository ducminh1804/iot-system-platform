import React from 'react';
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
  onSelectLevel: (level: 1 | 2 | 3) => void;
  onShutoffWater: () => void;
}

export function PressureLevelControls({
  activeLevel,
  gaugeVal1,
  gaugeVal2,
  gaugeVal3,
  lastActionTimes,
  onSelectLevel,
  onShutoffWater,
}: PressureLevelControlsProps) {
  return (
    <div className="shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {/* Gauge 1: Mức áp 1 */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectLevel(1)}
        onKeyDown={(e) => e.key === 'Enter' && onSelectLevel(1)}
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
            {lastActionTimes[1]}
          </span>
        </div>
      </div>

      {/* Gauge 2: Mức áp 2 */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectLevel(2)}
        onKeyDown={(e) => e.key === 'Enter' && onSelectLevel(2)}
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
            {lastActionTimes[2]}
          </span>
        </div>
      </div>

      {/* Gauge 3: Mở full */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectLevel(3)}
        onKeyDown={(e) => e.key === 'Enter' && onSelectLevel(3)}
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
            {lastActionTimes[3]}
          </span>
        </div>
      </div>

      {/* Card 4: Đóng nước */}
      <div
        role="button"
        tabIndex={0}
        onClick={onShutoffWater}
        onKeyDown={(e) => e.key === 'Enter' && onShutoffWater()}
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
            {lastActionTimes[4]}
          </span>
        </div>
      </div>
    </div>
  );
}
