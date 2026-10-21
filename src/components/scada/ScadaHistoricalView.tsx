import React, { useState } from 'react';
import { Calendar, Download, Settings, ChevronRight } from 'lucide-react';

export const ScadaHistoricalView: React.FC = () => {
  const [splitBy, setSplitBy] = useState('10 min');
  const [variables, setVariables] = useState({
    gearOilTemp: true,
    gen2Temp: true,
    productionKw: true,
    hydraulicTemp: false,
    nacelleTemp: false,
    topControllerTemp: false,
    bearing1Temp: false,
    envTemp: false,
  });

  const [turbines, setTurbines] = useState({
    wtg01: true,
    wtg02: true,
    wtg03: true,
    wtg04: true,
    wtg05: true,
    wtg06: true,
    wtg07: true,
    wtg08: true,
    wtg09: true,
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1E2126] text-slate-800 dark:text-slate-200 overflow-y-auto select-none">
      {/* Top Filter Bar */}
      <div className="px-3 lg:px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-[#2D3137] bg-[#F8FAFC] dark:bg-[#202328]">
        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white dark:bg-[#282C33] border border-slate-300 dark:border-[#383D45] rounded px-3 py-1 text-xs">
            <span className="font-bold text-slate-900 dark:text-white">Custom</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">29.06.2018 - 14.07.2018</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Split by</span>
            <select
              value={splitBy}
              onChange={(e) => setSplitBy(e.target.value)}
              className="bg-white dark:bg-[#282C33] border border-slate-300 dark:border-[#383D45] rounded px-2 py-1 text-xs font-bold text-slate-800 dark:text-slate-100"
            >
              <option value="5 min">5 min</option>
              <option value="10 min">10 min</option>
              <option value="1 hour">1 hour</option>
              <option value="1 day">1 day</option>
            </select>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2">
          <button className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Chart + Right Variable Panel */}
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Chart Viewport */}
        <div className="flex-1 flex flex-col p-3 lg:p-4 border-r border-slate-200 dark:border-[#2D3137]">
          {/* Main Time-series Chart */}
          <div className="flex-1 relative flex items-center justify-center min-h-[350px]">
            <svg viewBox="0 0 600 280" className="w-full h-full">
              {/* Grid Lines */}
              {[40, 80, 120, 160, 200, 240].map((y) => (
                <line
                  key={y}
                  x1="60"
                  y1={y}
                  x2="560"
                  y2={y}
                  stroke="#CBD5E1"
                  className="dark:stroke-[#2E333C]"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
              ))}

              {/* Y Axis Left (KWh) */}
              <text x="35" y="25" fontSize="10" fill="#888" fontWeight="bold">KWh</text>
              <text x="50" y="44" fontSize="9" fill="#888" textAnchor="end">8,700</text>
              <text x="50" y="104" fontSize="9" fill="#888" textAnchor="end">8,600</text>
              <text x="50" y="164" fontSize="9" fill="#888" textAnchor="end">8,500</text>
              <text x="50" y="224" fontSize="9" fill="#888" textAnchor="end">8,400</text>

              {/* Y Axis Right (°C) */}
              <text x="575" y="25" fontSize="10" fill="#888" fontWeight="bold">°C</text>
              <text x="570" y="44" fontSize="9" fill="#888">60</text>
              <text x="570" y="104" fontSize="9" fill="#888">50</text>
              <text x="570" y="164" fontSize="9" fill="#888">40</text>
              <text x="570" y="224" fontSize="9" fill="#888">30</text>

              {/* Multi-series curves */}
              {/* Curve 1: Generator 2 temp (Red curves) */}
              <path
                d="M 60 210 L 90 190 L 120 140 L 150 170 L 180 150 L 210 130 L 240 160 L 270 80 L 300 120 L 330 110 L 360 140 L 390 90 L 420 180 L 450 190 L 480 170 L 510 175 L 560 175"
                fill="none"
                stroke="#DC2626"
                strokeWidth="1.6"
              />
              <path
                d="M 60 220 L 90 200 L 120 155 L 150 185 L 180 160 L 210 140 L 240 170 L 270 95 L 300 135 L 330 120 L 360 150 L 390 105 L 420 195 L 450 205 L 480 185 L 510 190 L 560 190"
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />

              {/* Curve 2: Gear oil temp (Olive / Green curves) */}
              <path
                d="M 60 180 L 90 150 L 120 200 L 150 190 L 180 160 L 210 60 L 240 100 L 270 120 L 300 140 L 330 150 L 360 130 L 390 120 L 420 100 L 450 130 L 480 110 L 510 140 L 560 130"
                fill="none"
                stroke="#65A30D"
                strokeWidth="1.5"
              />
              <path
                d="M 60 170 L 90 140 L 120 190 L 150 180 L 180 150 L 210 50 L 240 90 L 270 110 L 300 130 L 330 140 L 360 120 L 390 110 L 420 90 L 450 120 L 480 100 L 510 130 L 560 120"
                fill="none"
                stroke="#84CC16"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />

              {/* Date Markers on bottom */}
              {['07.07', '08.07', '09.07', '10.07', '11.07', '12.07', '13.07', '14.07'].map(
                (date, i) => (
                  <text
                    key={date}
                    x={90 + i * 60}
                    y="255"
                    fontSize="9"
                    fill="#888"
                    textAnchor="middle"
                  >
                    {date}
                  </text>
                )
              )}
            </svg>
          </div>

          {/* Bottom Timeline Brush Scrubber */}
          <div className="h-14 border-t border-slate-200 dark:border-[#2D3137] pt-2 flex flex-col justify-between">
            <div className="relative h-6 bg-slate-100 dark:bg-[#1A1D21] rounded overflow-hidden">
              <svg viewBox="0 0 500 20" className="w-full h-full opacity-40">
                <path
                  d="M 0 15 Q 50 5 100 15 T 200 10 T 300 15 T 400 8 T 500 15"
                  fill="none"
                  stroke="#888"
                  strokeWidth="1"
                />
              </svg>
              {/* Highlight window */}
              <div className="absolute left-[30%] right-[25%] top-0 bottom-0 bg-[#E52E2D]/20 border-x-2 border-[#E52E2D]" />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>29.06</span>
              <span>30.06</span>
              <span>01.07</span>
              <span>02.07</span>
              <span>03.07</span>
              <span>04.07</span>
              <span>05.07</span>
              <span>06.07</span>
              <span>07.07</span>
              <span>08.07</span>
              <span>09.07</span>
              <span>10.07</span>
              <span>11.07</span>
              <span>12.07</span>
              <span>13.07</span>
              <span>14.07</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Variables & Turbines Selection */}
        <div className="w-full lg:w-72 p-3 lg:p-4 bg-slate-50 dark:bg-[#202328] space-y-4 overflow-y-auto">
          {/* Variables Section */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#2D3137]">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white">Variables</span>
              <button className="bg-[#E52E2D] text-white p-0.5 rounded text-[10px] font-bold">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 mt-2 text-xs">
              {[
                { key: 'gearOilTemp', label: 'Gear oil temp, °C', color: '#65A30D' },
                { key: 'gen2Temp', label: 'Generator 2 temp, °C', color: '#DC2626' },
                { key: 'productionKw', label: 'Production, kWt', color: '#EAB308' },
                { key: 'hydraulicTemp', label: 'Hydraulic temp, °C', color: '#22C55E' },
                { key: 'nacelleTemp', label: 'Nacelle temp, °C', color: '#38BDF8' },
                { key: 'topControllerTemp', label: 'Top controller temp, °C', color: '#B45309' },
                { key: 'bearing1Temp', label: 'Bearing 1 temp, °C', color: '#A855F7' },
                { key: 'envTemp', label: 'Environment temp, °C', color: '#06B6D4' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between py-1 px-1 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 dark:text-slate-300 text-[11px]">{item.label}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={variables[item.key as keyof typeof variables]}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="accent-[#E52E2D] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <button className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block font-semibold">
              Show on separate graphs...
            </button>
          </div>

          {/* Turbines Section */}
          <div className="border-t border-slate-200 dark:border-[#2D3137] pt-3">
            <span className="font-extrabold text-xs text-slate-900 dark:text-white">Turbines</span>

            <div className="space-y-1 mt-2 text-xs">
              {[
                { key: 'wtg01', label: 'WTG 01', style: 'solid' },
                { key: 'wtg02', label: 'WTG 02', style: 'dashed' },
                { key: 'wtg03', label: 'WTG 03', style: 'dashdot' },
                { key: 'wtg04', label: 'WTG 04', style: 'dotted' },
                { key: 'wtg05', label: 'WTG 05', style: 'dotted' },
                { key: 'wtg06', label: 'WTG 06', style: 'dotted' },
                { key: 'wtg07', label: 'WTG 07', style: 'dotted' },
                { key: 'wtg08', label: 'WTG 08', style: 'dotted' },
                { key: 'wtg09', label: 'WTG 09', style: 'dotted' },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between py-1 px-1 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                      {item.label}
                    </span>
                    <span className="w-16 h-0.5 bg-slate-400 dark:bg-slate-500 inline-block" />
                  </div>
                  <input
                    type="checkbox"
                    checked={turbines[item.key as keyof typeof turbines]}
                    onChange={(e) =>
                      setTurbines((prev) => ({ ...prev, [item.key]: e.target.checked }))
                    }
                    className="accent-[#E52E2D] rounded w-3.5 h-3.5 cursor-pointer"
                  />
                </label>
              ))}
            </div>

            <button className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block font-semibold">
              Show on separate graphs...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
