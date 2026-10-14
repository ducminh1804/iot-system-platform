import React from 'react';
import { Gauge, MoreHorizontal } from 'lucide-react';
import { TurbineTelemetry } from './types';

interface RealTimePowerCardProps {
  telemetry: TurbineTelemetry;
}

export const RealTimePowerCard: React.FC<RealTimePowerCardProps> = ({ telemetry }) => {
  const { realtimePower } = telemetry;

  // Arc Gauge parameters
  const size = 190;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  // Semicircle arc angles: from 140 deg to 400 deg (span 260 deg)
  const totalAngle = 240;
  const startAngle = 150;
  const percent = Math.min(Math.max(realtimePower.capacityPercent / 100, 0), 1);
  const currentAngle = startAngle + totalAngle * percent;

  // Helpers to calculate coordinates along arc
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (cx: number, cy: number, r: number, startA: number, endA: number) => {
    const start = polarToCartesian(cx, cy, r, endA);
    const end = polarToCartesian(cx, cy, r, startA);
    const largeArcFlag = endA - startA <= 180 ? '0' : '1';
    return ['M', start.x, start.y, 'A', r, r, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  };

  const bgArcPath = describeArc(center, center, radius, startAngle, startAngle + totalAngle);
  const activeArcPath = describeArc(center, center, radius, startAngle, currentAngle);

  // Ticks at 0, 200, 400, 600, 800, 1000, 1.2k
  const ticks = [
    { label: '0', val: 0 },
    { label: '200', val: 0.166 },
    { label: '400', val: 0.333 },
    { label: '600', val: 0.5 },
    { label: '800', val: 0.666 },
    { label: '1000', val: 0.833 },
    { label: '1.2k', val: 1 },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Real-Time Power
          </h3>
        </div>
        <button
          type="button"
          aria-label="Options"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Radial Semi-Circular Gauge */}
      <div className="relative flex items-center justify-center my-1">
        <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.8}`}>
          {/* Background track arc */}
          <path
            d={bgArcPath}
            fill="none"
            stroke="currentColor"
            className="text-slate-200/90 dark:text-slate-800"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active filled arc */}
          <path
            d={activeArcPath}
            fill="none"
            stroke="url(#powerGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Ticks and scale labels */}
          {ticks.map((t) => {
            const angle = startAngle + totalAngle * t.val;
            const pt = polarToCartesian(center, center, radius - 14, angle);
            return (
              <text
                key={t.label}
                x={pt.x}
                y={pt.y + 3}
                textAnchor="middle"
                className="text-[8px] fill-slate-400 font-medium select-none"
              >
                {t.label}
              </text>
            );
          })}

          <defs>
            <linearGradient id="powerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Readout Text */}
        <div className="absolute top-[35%] flex flex-col items-center">
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-sans">
            {realtimePower.currentKw}
          </span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {realtimePower.capacityPercent}%
          </span>
        </div>
      </div>

      {/* 2x2 Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="p-1">
          <p className="text-[10px] text-slate-400 font-medium">Gauge Value</p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {realtimePower.gaugeValue}
          </p>
        </div>
        <div className="p-1">
          <p className="text-[10px] text-slate-400 font-medium">Capacity Percentage</p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {realtimePower.capacityPercentage}%
          </p>
        </div>
        <div className="p-1">
          <p className="text-[10px] text-slate-400 font-medium">Gauge Range</p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {realtimePower.gaugeRange}
          </p>
        </div>
        <div className="p-1">
          <p className="text-[10px] text-slate-400 font-medium">Avg Power (10 min)</p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {realtimePower.avgPower10m}kW
          </p>
        </div>
      </div>
    </div>
  );
};
