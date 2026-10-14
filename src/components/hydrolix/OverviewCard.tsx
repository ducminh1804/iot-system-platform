import React, { useState } from 'react';
import { RotateCw, MoreHorizontal, Fan, Maximize2, Clock } from 'lucide-react';
import { TurbineTelemetry } from './types';

interface OverviewCardProps {
  telemetry: TurbineTelemetry;
  onReload?: () => void;
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ telemetry, onReload }) => {
  const { overview } = telemetry;
  const [isRotating, setIsRotating] = useState(false);

  const handleReload = () => {
    setIsRotating(true);
    if (onReload) onReload();
    setTimeout(() => setIsRotating(false), 800);
  };

  // Dotted tick ring calculations
  const totalTicks = 32;
  const size = 150;
  const center = size / 2;
  const radius = center - 16;
  const tickLength = 7;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
          Overview
        </h3>
        <button
          type="button"
          aria-label="Options"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Dotted Radial Ring Progress Dial */}
      <div className="relative flex flex-col items-center justify-center my-0.5">
        <svg width={size} height={size * 0.88} viewBox={`0 0 ${size} ${size}`}>
          {Array.from({ length: totalTicks }).map((_, i) => {
            const angle = (i * 360) / totalTicks;
            const rad = ((angle - 90) * Math.PI) / 180;
            // active ticks for first 65% of circle
            const isActive = i < totalTicks * 0.72;

            const x1 = center + (radius - tickLength) * Math.cos(rad);
            const y1 = center + (radius - tickLength) * Math.sin(rad);
            const x2 = center + radius * Math.cos(rad);
            const y2 = center + radius * Math.sin(rad);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? '#3b82f6' : 'currentColor'}
                className={isActive ? '' : 'text-slate-200 dark:text-slate-800'}
                strokeWidth={isActive ? '2.5' : '1.8'}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Center Power Readout */}
        <div className="absolute top-[28%] flex flex-col items-center">
          <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase">
            Power
          </span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans leading-none my-0.5">
            {overview.powerMwh}
          </span>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            MWh
          </span>
        </div>

        {/* Action Button: Reload */}
        <button
          type="button"
          onClick={handleReload}
          className="flex items-center gap-1.5 px-4 py-1.5 -mt-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/25 active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        >
          <span>Reload</span>
          <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Sub-telemetry List */}
      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Fan className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Rotor RPM</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {overview.rotorRpm} RPM
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Capacity Utilization</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {overview.capacityUtilization}%
          </span>
        </div>

        <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">Operational Hours</span>
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {overview.operationalHours.toLocaleString()} hrs
          </span>
        </div>
      </div>
    </div>
  );
};
