import React, { useState } from 'react';
import { MoreVertical, ArrowUpRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SourceItem {
  name: string;
  percentage: string;
  value: string;
  color: string;
  weight: number;
}

export function RevenueBySourceCard() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const sources: SourceItem[] = [
    { name: 'DMA 01 - Khu Bắc', percentage: '55%', value: '46.315 m³', color: '#2563EB', weight: 55 },
    { name: 'DMA 02 - Khu Nam', percentage: '20%', value: '16.840 m³', color: '#06B6D4', weight: 20 },
    { name: 'DMA 03 - Khu Đông', percentage: '13%', value: '10.950 m³', color: '#10B981', weight: 13 },
    { name: 'DMA 04 - Trung Tâm', percentage: '12%', value: '10.105 m³', color: '#F59E0B', weight: 12 },
  ];

  // Arc segments calculation for the semi-circle
  const arcSegments = [
    { id: 0, name: 'DMA 01 - Khu Bắc', color: '#2563EB', pct: 0.55 },
    { id: 1, name: 'DMA 02 - Khu Nam', color: '#06B6D4', pct: 0.20 },
    { id: 2, name: 'DMA 03 - Khu Đông', color: '#10B981', pct: 0.13 },
    { id: 3, name: 'DMA 04 - Trung Tâm', color: '#F59E0B', pct: 0.12 },
  ];

  const cx = 160;
  const cy = 150;
  const radius = 105;
  const strokeWidth = 10;
  const gapAngle = 0.05; // radians gap between segments

  // Semi-circle spans from PI (180 deg, left) to 0 (0 deg, right)
  let currentAngle = Math.PI;

  const renderedArcs = arcSegments.map((seg) => {
    const angleSpan = seg.pct * Math.PI - gapAngle;
    const startAngle = currentAngle;
    const endAngle = currentAngle - angleSpan;
    currentAngle = endAngle - gapAngle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy - radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy - radius * Math.sin(endAngle);

    // Large arc flag is 1 if angleSpan > PI
    const largeArcFlag = angleSpan > Math.PI ? 1 : 0;
    const pathD = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    const isHovered = hoveredIdx === seg.id;

    return {
      ...seg,
      pathD,
      isHovered,
    };
  });

  return (
    <div className="bg-white dark:bg-[#151A24] rounded-[24px] p-6 border border-slate-200/60 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-between h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Phân Phối Lưu Lượng DMA
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 text-xs shadow-xl">
            <DropdownMenuItem className="cursor-pointer">Xem chi tiết vùng DMA</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Xuất báo cáo lưu lượng CSV</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Cấu hình phân vùng DMA</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Semicircle Gauge Centerpiece */}
      <div className="relative w-full flex flex-col items-center justify-center my-2">
        <svg
          viewBox="0 0 320 170"
          className="w-full max-w-[275px] overflow-visible drop-shadow-xs"
        >
          {/* Subtle background track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-slate-100 dark:text-slate-800/60"
          />

          {/* Render Colored Arc Segments */}
          {renderedArcs.map((arc) => (
            <path
              key={arc.id}
              d={arc.pathD}
              fill="none"
              stroke={arc.color}
              strokeWidth={arc.isHovered ? strokeWidth + 3 : strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(arc.id)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                filter: arc.isHovered ? `drop-shadow(0 0 8px ${arc.color}90)` : undefined,
              }}
            />
          ))}
        </svg>

        {/* Center Metric Callout */}
        <div className="text-center -mt-16 sm:-mt-20 z-10 select-none">
          <div className="text-3xl sm:text-[34px] font-extrabold tracking-tight text-slate-900 dark:text-white font-sans leading-tight">
            84.210 m³
          </div>
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>+16.8% so với chu kỳ trước</span>
          </div>
        </div>
      </div>

      {/* Breakdown Rows Table */}
      <div className="w-full space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
        {sources.map((item, idx) => {
          const isHighlighted = hoveredIdx === idx;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between text-xs sm:text-[13px] py-1.5 px-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                isHighlighted
                  ? 'bg-slate-100/80 dark:bg-slate-800/70 scale-[1.01]'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {/* Category Name with Dot */}
              <div className="flex items-center gap-3 min-w-[130px]">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                  style={{
                    backgroundColor: item.color,
                    transform: isHighlighted ? 'scale(1.35)' : 'scale(1)',
                    boxShadow: isHighlighted ? `0 0 6px ${item.color}80` : undefined,
                  }}
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>

              {/* Percentage */}
              <div className="text-slate-400 dark:text-slate-500 font-medium text-center w-12 font-mono text-xs">
                {item.percentage}
              </div>

              {/* Dollar Amount */}
              <div className="font-bold text-slate-900 dark:text-white text-right min-w-[70px] font-mono text-xs sm:text-[13px]">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
