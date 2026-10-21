import React from 'react';
import { Droplets, Gauge, Zap, Battery } from 'lucide-react';
import { formatVNNumber } from './utils';

interface PressureTelemetryGridProps {
  currentFlowRate: number;
  currentVelocity: number;
  currentPressureIn: number;
  currentPressureOut: number;
  currentDeltaP: number;
  rtcTime: string;
}

export function PressureTelemetryGrid({
  currentFlowRate,
  currentVelocity,
  currentPressureIn,
  currentPressureOut,
  currentDeltaP,
  rtcTime,
}: PressureTelemetryGridProps) {
  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3 overflow-hidden">
      {/* Group 1: Flow & Volume */}
      <div className="rounded-[18px] sm:rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-2.5 sm:p-3 lg:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors h-full">
        <div className="shrink-0 flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs sm:text-sm lg:text-[15px] font-bold text-slate-900 dark:text-white">
            Flow & Volume
          </h4>
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-around py-1">
          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              FlowRate:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400">
              {formatVNNumber(currentFlowRate, 1)} (m³/h)
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              Velocity:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-semibold text-slate-800 dark:text-slate-200">
              {formatVNNumber(currentVelocity, 1)} (m/s)
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              Net Flow Total:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-extrabold text-slate-900 dark:text-white">
              {formatVNNumber(1653377.3, 1)} (m³)
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              Forward Flow:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">
              {formatVNNumber(1653381.6, 1)} (m³)
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              Reserve Flow:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">
              {formatVNNumber(4.3, 1)} (m³)
            </span>
          </div>
        </div>
      </div>

      {/* Group 2: Pressure Telemetry */}
      <div className="rounded-[18px] sm:rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-2.5 sm:p-3 lg:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors h-full">
        <div className="shrink-0 flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs sm:text-sm lg:text-[15px] font-bold text-slate-900 dark:text-white">
            Pressure Telemetry
          </h4>
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-around py-1">
          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              Pressure In:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400">
              {formatVNNumber(currentPressureIn, 1)} (mH₂O)
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              Pressure Out:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatVNNumber(currentPressureOut, 1)} (mH₂O)
            </span>
          </div>

          <div className="pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-2 text-xs sm:text-[13px]">
            <span className="text-slate-500 dark:text-slate-400 font-medium">ΔP (Head Loss):</span>
            <span className="font-mono font-extrabold text-slate-900 dark:text-white">
              {formatVNNumber(currentDeltaP, 1)} (mH₂O)
            </span>
          </div>
        </div>
      </div>

      {/* Group 3: System & Power */}
      <div className="rounded-[18px] sm:rounded-[22px] bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 p-2.5 sm:p-3 lg:p-3.5 shadow-xs flex flex-col justify-between overflow-hidden transition-colors h-full">
        <div className="shrink-0 flex items-center gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800/60">
          <div className="w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs sm:text-sm lg:text-[15px] font-bold text-slate-900 dark:text-white">
            System & Power
          </h4>
        </div>

        <div className="flex-1 min-h-0 flex flex-col justify-around py-1">
          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              Battery:
            </span>
            <div className="flex items-center gap-1.5">
              <Battery className="w-4 h-4 text-emerald-500" />
              <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatVNNumber(12.46, 2)}V
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              Low Power Metter:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">
              False
            </span>
          </div>

          <div className="flex items-center justify-between py-0.5 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1A202C] transition-colors">
            <span className="text-xs sm:text-[13px] font-medium text-slate-600 dark:text-slate-300">
              RTC:
            </span>
            <span className="text-xs sm:text-[13px] lg:text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
              {rtcTime}
            </span>
          </div>

          <div className="pt-1 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-2 text-xs sm:text-[13px]">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Link Protocol:</span>
            <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400">
              Modbus RTU
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
