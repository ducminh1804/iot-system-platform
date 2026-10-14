import React from 'react';
import { Compass, MoreHorizontal } from 'lucide-react';
import { TurbineTelemetry } from './types';

interface WindInformationCardProps {
  telemetry: TurbineTelemetry;
}

export const WindInformationCard: React.FC<WindInformationCardProps> = ({ telemetry }) => {
  const { wind } = telemetry;

  // Polar radar dimensions
  const size = 180;
  const center = size / 2;
  const radius = center - 24;

  // Calculate arrow coordinate from angle
  const angleRad = ((wind.angleDeg - 90) * Math.PI) / 180;
  const arrowEndX = center + radius * 0.85 * Math.cos(angleRad);
  const arrowEndY = center + radius * 0.85 * Math.sin(angleRad);

  const arrowStartX = center - radius * 0.75 * Math.cos(angleRad);
  const arrowStartY = center - radius * 0.75 * Math.sin(angleRad);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Wind Information
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

      {/* Polar Compass / Radar Visualization */}
      <div className="relative flex items-center justify-center my-1">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Concentric range rings */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200/90 dark:text-slate-800"
            strokeWidth="1.2"
          />
          <circle
            cx={center}
            cy={center}
            r={radius * 0.66}
            fill="none"
            stroke="currentColor"
            className="text-slate-200/90 dark:text-slate-800"
            strokeWidth="1"
          />
          <circle
            cx={center}
            cy={center}
            r={radius * 0.33}
            fill="none"
            stroke="currentColor"
            className="text-slate-200/90 dark:text-slate-800"
            strokeWidth="1"
          />

          {/* Crosshairs & Diagonals */}
          <line
            x1={center}
            y1={center - radius}
            x2={center}
            y2={center + radius}
            stroke="currentColor"
            className="text-slate-200/80 dark:text-slate-800"
            strokeWidth="1"
          />
          <line
            x1={center - radius}
            y1={center}
            x2={center + radius}
            y2={center}
            stroke="currentColor"
            className="text-slate-200/80 dark:text-slate-800"
            strokeWidth="1"
          />
          <line
            x1={center - radius * 0.707}
            y1={center - radius * 0.707}
            x2={center + radius * 0.707}
            y2={center + radius * 0.707}
            stroke="currentColor"
            className="text-slate-150 dark:text-slate-800/60"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <line
            x1={center - radius * 0.707}
            y1={center + radius * 0.707}
            x2={center + radius * 0.707}
            y2={center - radius * 0.707}
            stroke="currentColor"
            className="text-slate-150 dark:text-slate-800/60"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />

          {/* Compass Angle Degree Labels */}
          <text x={center} y={center - radius - 6} textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">0°</text>
          <text x={center + radius + 10} y={center + 3} textAnchor="start" className="text-[9px] fill-slate-400 font-medium">90°</text>
          <text x={center} y={center + radius + 12} textAnchor="middle" className="text-[9px] fill-slate-400 font-medium">180°</text>
          <text x={center - radius - 10} y={center + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">270°</text>

          {/* Target points on rings (blue marker triangles as seen in reference image) */}
          <polygon
            points={`${center},${center - radius * 0.66 - 5} ${center - 4},${center - radius * 0.66 + 3} ${center + 4},${center - radius * 0.66 + 3}`}
            className="fill-blue-500"
          />
          <polygon
            points={`${center - radius * 0.33},${center - 4} ${center - radius * 0.33 - 6},${center} ${center - radius * 0.33},${center + 4}`}
            className="fill-blue-500"
          />

          {/* Vector Wind Vector Needle Line */}
          <line
            x1={arrowStartX}
            y1={arrowStartY}
            x2={arrowEndX}
            y2={arrowEndY}
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Central Pivot Hub */}
          <circle cx={center} cy={center} r={4.5} fill="#2563eb" />
          <circle cx={center} cy={center} r={2} fill="#ffffff" />

          {/* Arrow Tip Triangles */}
          <circle cx={arrowEndX} cy={arrowEndY} r={3} fill="#2563eb" />
          <circle cx={arrowStartX} cy={arrowStartY} r={3} fill="#2563eb" />
        </svg>
      </div>

      {/* Bottom 3-Column Stats Row */}
      <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Rotor Speed</p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {wind.rotorSpeed}°c
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Wind Speed</p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {wind.windSpeed}m/s
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Active Power</p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {wind.activePower}kW
          </p>
        </div>
      </div>
    </div>
  );
};
