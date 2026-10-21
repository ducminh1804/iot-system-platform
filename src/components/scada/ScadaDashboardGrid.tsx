import React from 'react';
import { ScadaUnit } from './types';
import {
  FanStatusIcon,
  WrenchStatusIcon,
  SirenAlarmStatusIcon,
  WarningStatusIcon,
  StandbySyncStatusIcon,
  TurbineWatermarkSvg,
} from './ScadaIcons';

interface ScadaDashboardGridProps {
  units: ScadaUnit[];
  onSelectUnit: (unit: ScadaUnit) => void;
}

export const ScadaDashboardGrid: React.FC<ScadaDashboardGridProps> = ({
  units,
  onSelectUnit,
}) => {
  const renderStatusBadge = (unit: ScadaUnit) => {
    switch (unit.status) {
      case 'service':
        return <WrenchStatusIcon />;
      case 'alarm':
        return <SirenAlarmStatusIcon />;
      case 'warning':
        return <FanStatusIcon color="#F97316" />;
      case 'caution':
        return <WarningStatusIcon />;
      case 'standby':
        return <StandbySyncStatusIcon />;
      case 'ok':
      default:
        return <FanStatusIcon color="#22C55E" />;
    }
  };

  return (
    <div className="p-3 lg:p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-3.5 overflow-y-auto">
      {units.map((unit) => {
        // Percentage fills for progress bars
        const powerPercent = Math.min(100, Math.round((unit.powerKw / unit.maxPowerKw) * 100));
        const windPercent = Math.min(100, Math.round((unit.windSpeedMs / unit.maxWindSpeedMs) * 100));
        const prodPercent = Math.min(
          100,
          Math.round((unit.productivityKwh / unit.maxProductivityKwh) * 100)
        );

        return (
          <div
            key={unit.id}
            onClick={() => onSelectUnit(unit)}
            className="relative bg-white dark:bg-[#25282E] border border-[#CBD5E1] dark:border-[#33373E] rounded-md p-3 flex flex-col justify-between shadow-xs hover:border-[#E52E2D] dark:hover:border-[#E52E2D] hover:shadow-md transition-all cursor-pointer group overflow-hidden select-none"
          >
            {/* Turbine Watermark Background Graphic */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 dark:opacity-20 text-slate-400 dark:text-slate-200">
              <TurbineWatermarkSvg className="w-36 h-36" />
            </div>

            {/* Top Row: Unit Name, Timestamp & Model */}
            <div className="relative z-10 flex items-start justify-between border-b border-slate-100 dark:border-[#2D3137] pb-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                  {unit.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400 leading-tight">
                  Upd: {unit.timestamp}
                </div>
                <div className="text-[9px] text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">
                  {unit.model} {unit.park}
                </div>
              </div>
            </div>

            {/* Center Row: Large Status Icon & Message */}
            <div className="relative z-10 py-3 flex items-start gap-3 my-auto">
              {renderStatusBadge(unit)}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                  {unit.statusMessage}
                </p>
                {unit.status !== 'ok' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectUnit(unit);
                    }}
                    className="text-[11px] text-[#2563EB] dark:text-[#60A5FA] hover:underline font-semibold mt-1 inline-block"
                  >
                    Details
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Row: 3 Telemetry Progress Bars */}
            <div className="relative z-10 pt-2 border-t border-slate-100 dark:border-[#2D3137] space-y-1.5 text-[11px]">
              {/* Power Bar */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400 w-24 shrink-0">Power</span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-[#1A1D21] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 dark:bg-slate-300 rounded-full transition-all duration-500"
                    style={{ width: `${powerPercent}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-right w-16 shrink-0">
                  {unit.powerKw.toFixed(1)} kW
                </span>
              </div>

              {/* Wind Speed Bar */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400 w-24 shrink-0">Wind speed</span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-[#1A1D21] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 dark:bg-slate-300 rounded-full transition-all duration-500"
                    style={{ width: `${windPercent}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-right w-16 shrink-0">
                  {unit.windSpeedMs.toFixed(2)} m/s
                </span>
              </div>

              {/* Productivity Bar */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 dark:text-slate-400 w-24 shrink-0">Productivity today</span>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-[#1A1D21] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 dark:bg-slate-300 rounded-full transition-all duration-500"
                    style={{ width: `${prodPercent}%` }}
                  />
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-right w-16 shrink-0">
                  {unit.productivityKwh.toFixed(1)} kWh
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
