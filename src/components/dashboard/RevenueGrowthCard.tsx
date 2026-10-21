import React, { useState } from 'react';
import { TimeRange } from '@/types/dashboard';

interface GrowthPoint {
  month: string;
  x: number;
  y: number; // Value on scale 0 to 300
  displayVal: string;
  dateStr: string;
}

export function RevenueGrowthCard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('Month');
  const [activePointIndex, setActivePointIndex] = useState<number>(4); // Default to 'May' (index 4)

  // Chart configuration
  const width = 640;
  const height = 310;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 35;
  const paddingBottom = 45;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  // Custom non-linear scale matching the screenshot's Y-axis:
  // 300k, 200k, 100k, 75k, 50k, 25k, $0
  const yTicks = [
    { label: '300k', fraction: 0 },
    { label: '200k', fraction: 0.2 },
    { label: '100k', fraction: 0.42 },
    { label: '75k', fraction: 0.58 },
    { label: '50k', fraction: 0.72 },
    { label: '25k', fraction: 0.86 },
    { label: '$0', fraction: 1.0 },
  ];

  // Raw wave samples for Month view (Jan - Jul)
  // Matching the exact curve geometry from the screenshot:
  const rawMonths = [
    { month: 'Jan', yFrac: 0.78, displayVal: '68k', dateStr: '15 JAN 2026' },
    { month: 'Feb', yFrac: 0.81, displayVal: '58k', dateStr: '12 FEB 2026' },
    { month: 'Mar', yFrac: 0.38, displayVal: '162k', dateStr: '20 MAR 2026' },
    { month: 'Apr', yFrac: 0.65, displayVal: '84k', dateStr: '18 APR 2026' },
    { month: 'May', yFrac: 0.45, displayVal: '509k', dateStr: '5 MAY 2026' }, // Target featured pin!
    { month: 'Jun', yFrac: 0.35, displayVal: '215k', dateStr: '22 JUN 2026' },
    { month: 'Jul', yFrac: 0.15, displayVal: '280k', dateStr: '28 JUL 2026' },
  ];

  // Dense spline points for the organic undulating wave matching screenshot
  const splineProfile = [
    { u: 0.0, yF: 0.78 },   // Jan
    { u: 0.05, yF: 0.72 },
    { u: 0.10, yF: 0.75 },
    { u: 0.13, yF: 0.72 },
    { u: 0.166, yF: 0.81 }, // Feb
    { u: 0.20, yF: 0.83 },
    { u: 0.23, yF: 0.77 },
    { u: 0.28, yF: 0.54 },
    { u: 0.333, yF: 0.46 }, // Mar peak
    { u: 0.38, yF: 0.68 },
    { u: 0.42, yF: 0.74 },
    { u: 0.46, yF: 0.70 },
    { u: 0.50, yF: 0.65 },  // Apr
    { u: 0.55, yF: 0.52 },
    { u: 0.60, yF: 0.57 },
    { u: 0.666, yF: 0.45 }, // May (Pinned Point)
    { u: 0.72, yF: 0.43 },
    { u: 0.76, yF: 0.51 },
    { u: 0.80, yF: 0.42 },
    { u: 0.833, yF: 0.35 }, // Jun
    { u: 0.88, yF: 0.46 },
    { u: 0.94, yF: 0.16 },  // Jul high rise
    { u: 1.0, yF: 0.20 },   // Jul end
  ];

  // Generate SVG path from splineProfile using smooth cubic beziers
  const splineCoords = splineProfile.map((p) => ({
    x: paddingLeft + p.u * chartW,
    y: paddingTop + p.yF * chartH,
  }));

  // Build smooth bezier path
  let pathD = `M ${splineCoords[0].x} ${splineCoords[0].y}`;
  for (let i = 0; i < splineCoords.length - 1; i++) {
    const p0 = splineCoords[i === 0 ? 0 : i - 1];
    const p1 = splineCoords[i];
    const p2 = splineCoords[i + 1];
    const p3 = splineCoords[i + 2 < splineCoords.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  // Area path closing down to bottom
  const areaD = `${pathD} L ${splineCoords[splineCoords.length - 1].x} ${
    paddingTop + chartH
  } L ${splineCoords[0].x} ${paddingTop + chartH} Z`;

  // Landmark interactive points corresponding to months Jan - Jul
  const monthPoints: GrowthPoint[] = rawMonths.map((m, i) => {
    const u = i / (rawMonths.length - 1);
    const x = paddingLeft + u * chartW;
    const y = paddingTop + m.yFrac * chartH;
    return {
      month: m.month,
      x,
      y,
      displayVal: m.displayVal,
      dateStr: m.dateStr,
    };
  });

  const activePoint = monthPoints[activePointIndex] || monthPoints[4];

  return (
    <div className="bg-white dark:bg-[#151A24] rounded-[24px] p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between h-full">
      {/* Header and Filter Pills */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Revenue Growth
        </h3>

        {/* Range Pill Toggle */}
        <div className="flex items-center p-1 rounded-full bg-slate-200/50 dark:bg-[#1C222D] border border-slate-200/60 dark:border-slate-800 text-xs font-semibold shadow-2xs">
          {(['Days', 'Week', 'Month'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
                timeRange === range
                  ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-xs font-bold scale-[1.02]'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive SVG Chart Area */}
      <div className="relative w-full flex-1 min-h-[260px] sm:min-h-[290px] mt-2 select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Soft Blue Gradient for Area */}
            <linearGradient id="revenueAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>

            {/* Filter shadow for floating tooltip */}
            <filter id="tooltipShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.08" floodColor="#0F172A" />
            </filter>
          </defs>

          {/* Y-axis Labels & Reference guidelines */}
          {yTicks.map((tick) => {
            const yPos = paddingTop + tick.fraction * chartH;
            return (
              <g key={tick.label}>
                <text
                  x={paddingLeft - 14}
                  y={yPos + 4}
                  textAnchor="end"
                  className="text-[11px] font-medium fill-slate-400 dark:fill-slate-500 font-mono"
                >
                  {tick.label}
                </text>
                {/* Subtle base line at $0 */}
                {tick.label === '$0' && (
                  <line
                    x1={paddingLeft}
                    y1={yPos}
                    x2={width - paddingRight}
                    y2={yPos}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-slate-100 dark:text-slate-800"
                  />
                )}
              </g>
            );
          })}

          {/* Soft Gradient Fill Area */}
          <path d={areaD} fill="url(#revenueAreaGrad)" />

          {/* Spline Line Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-xs"
          />

          {/* Vertical dashed guide line to Active Month */}
          <line
            x1={activePoint.x}
            y1={activePoint.y}
            x2={activePoint.x}
            y2={paddingTop + chartH}
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Active Highlight Dot on the curve */}
          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r="5"
            fill="#3B82F6"
            stroke="#FFFFFF"
            strokeWidth="2"
            className="filter drop-shadow-sm cursor-pointer transition-all duration-150"
          />

          {/* Floating Tooltip Box (5 MAY 2026 · 509k) */}
          <g
            transform={`translate(${activePoint.x - 45}, ${Math.max(
              10,
              activePoint.y - 65
            )})`}
            className="transition-transform duration-200 pointer-events-none"
          >
            {/* Tooltip Background Card */}
            <rect
              width="90"
              height="50"
              rx="10"
              fill="white"
              stroke="#E2E8F0"
              strokeWidth="0.8"
              filter="url(#tooltipShadow)"
              className="dark:fill-[#1E2532] dark:stroke-slate-700"
            />

            {/* Header: Date + Info icon */}
            <text
              x="12"
              y="18"
              className="text-[10px] font-semibold fill-slate-400 dark:fill-slate-400 font-sans tracking-wide uppercase"
            >
              {activePoint.dateStr}
            </text>
            <circle cx="76" cy="15" r="4.5" fill="none" stroke="#94A3B8" strokeWidth="0.8" />
            <text x="74.5" y="17.5" className="text-[7px] font-bold fill-slate-400">
              i
            </text>

            {/* Big Stat Value: 509k */}
            <text
              x="12"
              y="38"
              className="text-[17px] font-extrabold fill-slate-900 dark:fill-white font-sans tracking-tight"
            >
              {activePoint.displayVal}
            </text>
          </g>

          {/* Interactive Month Columns (Click/Hover triggers) */}
          {monthPoints.map((pt, i) => (
            <g
              key={pt.month}
              className="cursor-pointer group"
              onClick={() => setActivePointIndex(i)}
              onMouseEnter={() => setActivePointIndex(i)}
            >
              {/* Invisible wide hover target */}
              <rect
                x={pt.x - chartW / (monthPoints.length * 2)}
                y={paddingTop}
                width={chartW / monthPoints.length}
                height={chartH + 30}
                fill="transparent"
              />

              {/* X-axis Month Label */}
              <text
                x={pt.x}
                y={paddingTop + chartH + 20}
                textAnchor="middle"
                className={`text-xs font-semibold transition-colors ${
                  activePointIndex === i
                    ? 'fill-blue-600 dark:fill-blue-400 font-bold'
                    : 'fill-slate-400 dark:fill-slate-500 group-hover:fill-slate-700 dark:group-hover:fill-slate-300'
                }`}
              >
                {pt.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
