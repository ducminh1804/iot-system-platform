import React, { useState } from 'react';
import { Activity, MoreHorizontal } from 'lucide-react';

interface ChartDataPoint {
  time: string;
  windSpeed: number; // m/s, e.g. 5 to 14
  power: number; // kW, e.g. 100 to 420
}

const DEFAULT_DATA: ChartDataPoint[] = [
  { time: '10:00', windSpeed: 6.2, power: 120 },
  { time: '10:15', windSpeed: 7.1, power: 180 },
  { time: '10:30', windSpeed: 7.8, power: 220 },
  { time: '10:45', windSpeed: 8.4, power: 260 },
  { time: '11:00', windSpeed: 9.2, power: 340 },
  { time: '11:15', windSpeed: 10.5, power: 390 },
  { time: '11:30', windSpeed: 11.2, power: 420 },
  { time: '11:45', windSpeed: 10.8, power: 410 },
  { time: '12:00', windSpeed: 9.5, power: 360 },
  { time: '12:15', windSpeed: 8.9, power: 310 },
  { time: '12:30', windSpeed: 8.2, power: 270 },
  { time: '12:45', windSpeed: 7.5, power: 210 },
  { time: '13:00', windSpeed: 8.0, power: 250 },
  { time: '13:15', windSpeed: 7.2, power: 190 },
  { time: '13:30', windSpeed: 6.8, power: 150 },
];

export const ActivePowerChart: React.FC = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Chart dimensions in SVG viewBox coordinate space
  const svgWidth = 420;
  const svgHeight = 170;
  const chartTop = 20;
  const chartBottom = 150;
  const chartHeight = chartBottom - chartTop;
  const chartLeft = 32;
  const chartRight = 388;
  const chartWidth = chartRight - chartLeft;

  const barCount = DEFAULT_DATA.length;
  const barSpacing = chartWidth / barCount;
  const barWidth = 7;

  // Max scale values: Power max 450kW, Wind max 15 m/s
  const maxPower = 450;

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none">
      {/* Title & Legend Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Active Power Vs Wind Speed
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

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mb-1 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white" />
          <span>Wind Speed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>Power</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative w-full flex-1 min-h-[140px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Horizontal gridlines */}
          <line
            x1={chartLeft}
            y1={chartTop}
            x2={chartRight}
            y2={chartTop}
            stroke="currentColor"
            className="text-slate-200/80 dark:text-slate-800"
            strokeDasharray="3 3"
          />
          <line
            x1={chartLeft}
            y1={chartTop + chartHeight * 0.3}
            x2={chartRight}
            y2={chartTop + chartHeight * 0.3}
            stroke="currentColor"
            className="text-slate-200/80 dark:text-slate-800"
            strokeDasharray="3 3"
          />
          <line
            x1={chartLeft}
            y1={chartTop + chartHeight * 0.5}
            x2={chartRight}
            y2={chartTop + chartHeight * 0.5}
            stroke="currentColor"
            className="text-slate-300 dark:text-slate-700"
          />
          <line
            x1={chartLeft}
            y1={chartTop + chartHeight * 0.7}
            x2={chartRight}
            y2={chartTop + chartHeight * 0.7}
            stroke="currentColor"
            className="text-slate-200/80 dark:text-slate-800"
            strokeDasharray="3 3"
          />
          <line
            x1={chartLeft}
            y1={chartBottom}
            x2={chartRight}
            y2={chartBottom}
            stroke="currentColor"
            className="text-slate-200/80 dark:text-slate-800"
            strokeDasharray="3 3"
          />

          {/* Left Y Axis Labels (m/s) */}
          <text x={chartLeft - 4} y={chartTop + 4} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">15</text>
          <text x={chartLeft - 4} y={chartTop + chartHeight * 0.3 + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">8</text>
          <text x={chartLeft - 4} y={chartTop + chartHeight * 0.5 + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">m/s</text>
          <text x={chartLeft - 4} y={chartTop + chartHeight * 0.7 + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">-8</text>
          <text x={chartLeft - 4} y={chartBottom + 2} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">-15</text>

          {/* Right Y Axis Labels (kW) */}
          <text x={chartRight + 6} y={chartTop + 4} textAnchor="start" className="text-[9px] fill-slate-400 font-medium">450</text>
          <text x={chartRight + 6} y={chartTop + chartHeight * 0.3 + 3} textAnchor="start" className="text-[9px] fill-slate-400 font-medium">250</text>
          <text x={chartRight + 6} y={chartTop + chartHeight * 0.5 + 3} textAnchor="start" className="text-[9px] fill-slate-400 font-medium">kW</text>
          <text x={chartRight + 6} y={chartTop + chartHeight * 0.7 + 3} textAnchor="start" className="text-[9px] fill-slate-400 font-medium">-250</text>
          <text x={chartRight + 6} y={chartBottom + 2} textAnchor="start" className="text-[9px] fill-slate-400 font-medium">-450</text>

          {/* Power Bar Chart (Center mirrored bipolar visual as in reference image) */}
          {DEFAULT_DATA.map((d, i) => {
            const x = chartLeft + i * barSpacing + barSpacing / 2;
            const powerRatio = d.power / maxPower;
            const topH = powerRatio * (chartHeight * 0.45);
            const botH = (d.windSpeed / 15) * (chartHeight * 0.45);
            const isHovered = hoveredIdx === i;

            return (
              <g
                key={d.time}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer transition-opacity"
              >
                {/* Upper bar (Active Power - Blue) */}
                <rect
                  x={x - barWidth / 2}
                  y={chartTop + chartHeight * 0.5 - topH}
                  width={barWidth}
                  height={topH}
                  rx={3.5}
                  className={`transition-all duration-200 ${
                    isHovered
                      ? 'fill-blue-500 filter drop-shadow(0 0 4px rgba(59,130,246,0.6))'
                      : i % 2 === 0
                      ? 'fill-blue-600'
                      : 'fill-blue-400/80'
                  }`}
                />

                {/* Lower bar (Wind / Mirror load effect - Soft Cyan/Slate) */}
                <rect
                  x={x - barWidth / 2}
                  y={chartTop + chartHeight * 0.5}
                  width={barWidth}
                  height={botH}
                  rx={3.5}
                  className={`transition-all duration-200 ${
                    isHovered ? 'fill-sky-400' : 'fill-slate-300 dark:fill-slate-700'
                  }`}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && (
          <div
            className="absolute top-1 pointer-events-none px-2 py-1 rounded bg-slate-900/90 text-white text-[10px] shadow-lg backdrop-blur-sm transform -translate-x-1/2"
            style={{
              left: `${((chartLeft + hoveredIdx * barSpacing + barSpacing / 2) / svgWidth) * 100}%`,
            }}
          >
            <div className="font-semibold text-blue-400">{DEFAULT_DATA[hoveredIdx].power} kW</div>
            <div className="text-slate-300">{DEFAULT_DATA[hoveredIdx].windSpeed} m/s</div>
          </div>
        )}
      </div>
    </div>
  );
};
