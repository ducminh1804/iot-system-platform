import React, { useState } from 'react';
import { ArrowUpDown, ArrowLeft, Settings, LayoutList } from 'lucide-react';
import { ScadaUnit } from './types';

interface ScadaParkViewProps {
  units: ScadaUnit[];
  onSelectUnit: (unit: ScadaUnit) => void;
  onBack?: () => void;
}

export const ScadaParkView: React.FC<ScadaParkViewProps> = ({
  units,
  onSelectUnit,
  onBack,
}) => {
  const [parkLevel, setParkLevel] = useState('2');

  const rows = [
    { name: 'Unit 01', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
    { name: 'Unit 01', status: 'green', wind: 9.3, power: 822.50, prod: 434.89 },
    { name: 'Unit 02', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
    { name: 'Unit 03', status: 'yellow', wind: 9.3, power: 822.50, prod: 434.89 },
    { name: 'Unit 04', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
    { name: 'Unit 05', status: 'red', wind: 9.3, power: 822.50, prod: 434.89 },
    { name: 'Unit 06', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
    { name: 'Unit 1', status: 'green', wind: 9.3, power: 822.50, prod: 434.89 },
    { name: 'Unit 2', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
    { name: 'Unit 3', status: 'yellow', wind: 9.3, power: 822.50, prod: 434.89 },
    { name: 'Unit 4', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
    { name: 'Unit 1', status: 'green', wind: 9.3, power: 822.50, prod: 434.89 },
    { name: 'Unit 2', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
    { name: 'Unit 3', status: 'yellow', wind: 9.3, power: 822.50, prod: 434.89 },
    { name: 'Unit 4', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
    { name: 'Unit 1', status: 'yellow', wind: 9.3, power: 822.50, prod: 434.89 },
    { name: 'Unit 2', status: 'green', wind: 6.4, power: 786.89, prod: 768.90 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'red':
        return '#EF4444';
      case 'yellow':
        return '#EAB308';
      case 'green':
      default:
        return '#22C55E';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1E2126] text-slate-800 dark:text-slate-200 overflow-y-auto select-none p-3 lg:p-4">
      {/* Top Filter Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2D3137]">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Park level</span>
          <select
            value={parkLevel}
            onChange={(e) => setParkLevel(e.target.value)}
            className="bg-white dark:bg-[#282C33] border border-slate-300 dark:border-[#383D45] rounded px-2.5 py-0.5 text-xs text-slate-800 dark:text-slate-100 font-bold focus:outline-none"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5">
            <LayoutList className="w-4 h-4" />
          </button>
          <button className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SCADA Table */}
      <div className="flex-1 overflow-x-auto mt-2">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-300 dark:border-[#383D45] text-slate-900 dark:text-white font-extrabold">
              <th className="py-2.5 px-3 w-[250px]">
                <div className="flex items-center justify-between">
                  <span>Target</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 w-[200px]">
                <div className="flex items-center justify-between">
                  <span>Wind speed, m/s</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 w-[220px]">
                <div className="flex items-center justify-between">
                  <span>Power, kW</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 w-[220px]">
                <div className="flex items-center justify-between">
                  <span>Production, Kwh</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#282C33]">
            {/* Group Summary Row */}
            <tr className="bg-slate-100 dark:bg-[#25282E] font-bold">
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444]" />
                  <span className="text-slate-900 dark:text-white font-black">NM 600</span>
                </div>
              </td>
              <td className="py-2 px-3 font-mono">
                <div className="relative bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 px-3 py-1 rounded text-right font-black">
                  9.3
                </div>
              </td>
              <td className="py-2 px-3 font-mono">
                <div className="relative bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-3 py-1 rounded text-right font-black">
                  822.50
                </div>
              </td>
              <td className="py-2 px-3 font-mono">
                <div className="relative bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 px-3 py-1 rounded text-right font-black">
                  434.89
                </div>
              </td>
            </tr>

            {/* Individual Units */}
            {rows.map((row, idx) => {
              const windWidth = `${Math.min(100, (row.wind / 15) * 100)}%`;
              const powerWidth = `${Math.min(100, (row.power / 1000) * 100)}%`;
              const prodWidth = `${Math.min(100, (row.prod / 1000) * 100)}%`;

              return (
                <tr
                  key={idx}
                  onClick={() => {
                    const matched = units.find((u) => u.name === row.name) || units[0];
                    onSelectUnit(matched);
                  }}
                  className="hover:bg-slate-50 dark:hover:bg-[#25282E]/70 cursor-pointer transition-colors group"
                >
                  <td className="py-1.5 px-3 pl-8">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-xs"
                        style={{ backgroundColor: getStatusColor(row.status) }}
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Wind speed in-cell bar */}
                  <td className="py-1.5 px-3 font-mono">
                    <div className="relative w-full h-6 bg-slate-100 dark:bg-[#1A1D21] rounded overflow-hidden flex items-center justify-end px-2">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#BAE6FD] dark:bg-[#0369A1]/60 transition-all duration-300"
                        style={{ width: windWidth }}
                      />
                      <span className="relative z-10 font-bold text-slate-800 dark:text-slate-100 text-xs">
                        {row.wind.toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Power in-cell bar */}
                  <td className="py-1.5 px-3 font-mono">
                    <div className="relative w-full h-6 bg-slate-100 dark:bg-[#1A1D21] rounded overflow-hidden flex items-center justify-end px-2">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#FEF08A] dark:bg-[#854D0E]/60 transition-all duration-300"
                        style={{ width: powerWidth }}
                      />
                      <span className="relative z-10 font-bold text-slate-800 dark:text-slate-100 text-xs">
                        {row.power.toFixed(2)}
                      </span>
                    </div>
                  </td>

                  {/* Production in-cell bar */}
                  <td className="py-1.5 px-3 font-mono">
                    <div className="relative w-full h-6 bg-slate-100 dark:bg-[#1A1D21] rounded overflow-hidden flex items-center justify-end px-2">
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-[#BBF7D0] dark:bg-[#166534]/60 transition-all duration-300"
                        style={{ width: prodWidth }}
                      />
                      <span className="relative z-10 font-bold text-slate-800 dark:text-slate-100 text-xs">
                        {row.prod.toFixed(2)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Back to parks button */}
      <div className="pt-4 pb-2 flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to parks</span>
        </button>
      </div>
    </div>
  );
};
