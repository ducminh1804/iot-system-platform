import React, { useState } from 'react';
import { ScadaUnit, TurbineSubTab } from './types';
import { FanStatusIcon } from './ScadaIcons';
import { Play, Square, RotateCcw, Download, Settings as SettingsIcon, Compass } from 'lucide-react';
import { toast } from 'sonner';
import { SpeedometerGauge } from '@/components/hydrolix/SpeedometerGauge';

interface ScadaTurbineOverviewProps {
  unit: ScadaUnit;
  onUpdateValveLevel?: (level: 1 | 2 | 3) => void;
  onSelectTab?: (tab: string) => void;
}

export const ScadaTurbineOverview: React.FC<ScadaTurbineOverviewProps> = ({
  unit,
  onUpdateValveLevel,
  onSelectTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<TurbineSubTab>('monitor');
  const [activeSubsystem, setActiveSubsystem] = useState<'overview' | 'hub' | 'drivetrain' | 'grid'>('overview');
  const [currentValveLevel, setCurrentValveLevel] = useState<1 | 2 | 3>(unit.hydraulicValveLevel || 1);
  const [gaugeMode, setGaugeMode] = useState<'pressure' | 'rotor'>('pressure');

  const handleValveChange = (level: 1 | 2 | 3) => {
    setCurrentValveLevel(level);
    onUpdateValveLevel?.(level);
    toast.success(`Hydraulic Valve set to Mức ${level}`, { duration: 2000 });
  };

  const handleAction = (action: string) => {
    toast.success(`${action} command executed on ${unit.name}`, { duration: 2000 });
  };

  // 24 hour mock production bars
  const dailyProductionBars = [
    { hour: '0-24', prev: 70, curr: 82 },
    { hour: '0', prev: 60, curr: 75 },
    { hour: '1', prev: 65, curr: 78 },
    { hour: '2', prev: 80, curr: 92 },
    { hour: '3', prev: 72, curr: 84 },
    { hour: '4', prev: 68, curr: 76 },
    { hour: '5', prev: 75, curr: 88 },
    { hour: '6', prev: 62, curr: 70 },
    { hour: '7', prev: 58, curr: 66 },
    { hour: '8', prev: 64, curr: 74 },
    { hour: '9', prev: 70, curr: 80 },
    { hour: '10', prev: 76, curr: 89 },
    { hour: '11', prev: 82, curr: 95 },
    { hour: '12', prev: 60, curr: 72 },
    { hour: '13', prev: 55, curr: 68 },
    { hour: '14', prev: 78, curr: 88 },
    { hour: '15', prev: 74, curr: 85 },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FFFFFF] dark:bg-[#1E2126] text-slate-800 dark:text-slate-200 overflow-y-auto select-none">
      {/* Top Secondary Sub-Tabs */}
      <div className="px-3 lg:px-4 py-1.5 flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#2D3137] bg-[#F8FAFC] dark:bg-[#202328]">
        <div className="flex items-center gap-1 sm:gap-2">
          {(
            [
              { id: 'monitor', label: 'Monitor' },
              { id: 'alarms', label: 'Alarms' },
              { id: 'service', label: 'Service log' },
              { id: 'remote', label: 'Remote display' },
            ] as const
          ).map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`relative px-4 py-1 text-xs font-bold rounded-t transition-colors ${
                  isActive
                    ? 'bg-white dark:bg-[#1E2126] text-[#E52E2D] border-t-2 border-[#E52E2D] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Telemetry exported')}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            title="Download Telemetry"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => toast.info('Turbine configuration')}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
            title="Configure Turbine"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Turbine Header Strip */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#2D3137] bg-white dark:bg-[#1E2126]">
        <div className="flex items-center gap-3">
          <FanStatusIcon color="#22C55E" className="w-8 h-8" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                {unit.name}
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {unit.statusMessage}
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          {unit.model} {unit.park}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
        {/* UPPER ROW: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Widget 1: Uptime & Specifications */}
          <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-3 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Uptime time
              </div>
              <div className="flex items-baseline gap-1 font-mono text-slate-900 dark:text-white">
                <span className="text-xl font-extrabold">{unit.uptimeDays}</span>
                <span className="text-xs text-slate-500">days</span>
                <span className="text-xl font-extrabold ml-1">{String(unit.uptimeHours).padStart(2, '0')}</span>
                <span className="text-xs text-slate-500">hrs</span>
                <span className="text-xl font-extrabold ml-1">{String(unit.uptimeMins).padStart(2, '0')}</span>
                <span className="text-xs text-slate-500">min</span>
              </div>
            </div>

            {/* Industrial Action Buttons */}
            <div className="flex items-center gap-2 my-3">
              <button
                onClick={() => handleAction('START')}
                className="flex-1 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>START</span>
              </button>
              <button
                onClick={() => handleAction('STOP')}
                className="flex-1 py-1 px-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>STOP</span>
              </button>
              <button
                onClick={() => handleAction('RESET')}
                className="flex-1 py-1 px-2 rounded bg-slate-600 hover:bg-slate-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET</span>
              </button>
            </div>

            {/* Specs List */}
            <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1 border-t border-slate-200 dark:border-[#2D3137] pt-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Last update..</span>
                <span>{unit.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Turbine type............</span>
                <span className="font-semibold text-slate-900 dark:text-white">{unit.turbineType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rated power, kW..........</span>
                <span className="font-semibold text-slate-900 dark:text-white">{unit.ratedPowerKw.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Widget 2: Đồng Hồ Áp Lực 3 Mốc (SpeedometerGauge) / Rotor Speed Gauge Toggle */}
          <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-[#2D3137]">
              <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-[#1D2024] p-0.5 rounded">
                <button
                  onClick={() => setGaugeMode('pressure')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    gaugeMode === 'pressure'
                      ? 'bg-[#E52E2D] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Áp Lực 3 Mốc
                </button>
                <button
                  onClick={() => setGaugeMode('rotor')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    gaugeMode === 'rotor'
                      ? 'bg-[#E52E2D] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Rotor RPM
                </button>
              </div>

              <span className="text-[10px] font-bold font-mono text-[#E52E2D]">
                {gaugeMode === 'pressure' ? `Mức ${currentValveLevel}` : `${unit.rotorSpeedRpm.toFixed(1)} RPM`}
              </span>
            </div>

            {/* Displaying SpeedometerGauge (Áp Lực 3 Mốc) or Rotor Dial */}
            {gaugeMode === 'pressure' ? (
              <div className="flex-1 flex flex-col items-center justify-center my-auto py-1">
                <SpeedometerGauge
                  value={currentValveLevel === 1 ? 27.8 : currentValveLevel === 2 ? 50 : 100}
                  onChange={(val) => {
                    if (val < 38) handleValveChange(1);
                    else if (val < 75) handleValveChange(2);
                    else handleValveChange(3);
                  }}
                  size={260}
                  variant="embedded"
                  showControls={true}
                  showMetrics={true}
                  unit="Bar"
                />
              </div>
            ) : (
              /* Circular Rotor Speed Gauge */
              <div className="flex-1 flex flex-col items-center justify-center my-auto">
                <div className="relative w-44 h-24 my-auto flex items-end justify-center overflow-hidden">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    <path
                      d="M 15 50 A 35 35 0 0 1 85 50"
                      fill="none"
                      stroke="#CBD5E1"
                      className="dark:stroke-[#33373E]"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 15 50 A 35 35 0 0 1 85 50"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="8"
                      strokeDasharray="110"
                      strokeDashoffset={110 - (110 * (unit.rotorSpeedRpm / 35))}
                      strokeLinecap="round"
                    />
                    <g transform={`rotate(${-90 + (180 * (unit.rotorSpeedRpm / 35))} 50 50)`}>
                      <line x1="50" y1="50" x2="50" y2="18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="4" fill="#E52E2D" />
                    </g>
                    <text x="14" y="58" fontSize="7" fill="#888" textAnchor="middle">0</text>
                    <text x="86" y="58" fontSize="7" fill="#888" textAnchor="middle">35</text>
                  </svg>
                </div>
                <div className="text-center mt-1">
                  <div className="text-xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                    {unit.rotorSpeedRpm.toFixed(1).replace('.', ',')}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                    Rotor speed, rpm
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Widget 3: Three Vertical Industrial Bar Meters */}
          <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-3 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Atmospheric & Power Meters
            </div>

            <div className="flex items-end justify-around h-36 pt-2">
              {/* Meter 1: Wind speed (0 to 30) */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
                  <span className="text-[9px]">30</span>
                </div>
                <div className="w-5 h-24 bg-slate-200 dark:bg-[#1A1D21] rounded-sm relative flex items-end overflow-hidden border border-slate-300 dark:border-[#383D45]">
                  <div
                    className="w-full bg-[#38BDF8] transition-all duration-500"
                    style={{ height: `${(unit.windSpeedMs / 30) * 100}%` }}
                  />
                </div>
                <span className="font-extrabold font-mono text-xs text-slate-900 dark:text-white mt-1">
                  {Math.round(unit.windSpeedMs)}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 text-center leading-tight">
                  Wind speed,<br />m/s
                </span>
              </div>

              {/* Meter 2: Power (0 to 3500) */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
                  <span className="text-[9px]">3500</span>
                </div>
                <div className="w-5 h-24 bg-slate-200 dark:bg-[#1A1D21] rounded-sm relative flex items-end overflow-hidden border border-slate-300 dark:border-[#383D45]">
                  <div
                    className="w-full bg-[#EAB308] transition-all duration-500"
                    style={{ height: `${(unit.powerKw / 1000) * 100}%` }}
                  />
                </div>
                <span className="font-extrabold font-mono text-xs text-slate-900 dark:text-white mt-1">
                  {Math.round(unit.powerKw * 3.5)}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 text-center leading-tight">
                  Power,<br />kW
                </span>
              </div>

              {/* Meter 3: Outdoor Temp (-20 to 80) */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
                  <span className="text-[9px]">80</span>
                </div>
                <div className="w-5 h-24 bg-slate-200 dark:bg-[#1A1D21] rounded-sm relative flex items-end overflow-hidden border border-slate-300 dark:border-[#383D45]">
                  <div
                    className="w-full bg-[#84CC16] transition-all duration-500"
                    style={{ height: `${((unit.outdoorTempC + 20) / 100) * 100}%` }}
                  />
                </div>
                <span className="font-extrabold font-mono text-xs text-slate-900 dark:text-white mt-1">
                  {unit.outdoorTempC}
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 text-center leading-tight">
                  Outdoor<br />temp, °C
                </span>
              </div>
            </div>
          </div>

          {/* Widget 4: Wind Compass & Nacelle Polar Radar */}
          <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-3 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-between">
              <span>Wind Direction Rose</span>
              <Compass className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Radar Circle */}
            <div className="relative w-32 h-32 mx-auto my-auto flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Concentric rings */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="#CBD5E1" className="dark:stroke-[#383D45]" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#CBD5E1" className="dark:stroke-[#383D45]" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="#CBD5E1" className="dark:stroke-[#383D45]" strokeWidth="0.8" />
                {/* Axis lines */}
                <line x1="50" y1="5" x2="50" y2="95" stroke="#CBD5E1" className="dark:stroke-[#383D45]" strokeWidth="0.8" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="#CBD5E1" className="dark:stroke-[#383D45]" strokeWidth="0.8" />
                {/* Compass labels */}
                <text x="50" y="10" fontSize="7" fill="#888" textAnchor="middle" fontWeight="bold">N</text>
                <text x="92" y="52" fontSize="7" fill="#888" textAnchor="middle" fontWeight="bold">E</text>
                <text x="50" y="97" fontSize="7" fill="#888" textAnchor="middle" fontWeight="bold">S</text>
                <text x="8" y="52" fontSize="7" fill="#888" textAnchor="middle" fontWeight="bold">W</text>

                {/* Wind Vector (Cyan Arrow) */}
                <g transform={`rotate(${unit.windDirectionDeg} 50 50)`}>
                  <line x1="50" y1="50" x2="50" y2="12" stroke="#38BDF8" strokeWidth="2.5" markerEnd="url(#arrow)" />
                  <polygon points="50,8 46,18 54,18" fill="#38BDF8" />
                </g>

                {/* Nacelle Vector (Green Arrow) */}
                <g transform={`rotate(${unit.nacelleDirectionDeg} 50 50)`}>
                  <line x1="50" y1="50" x2="50" y2="15" stroke="#84CC16" strokeWidth="2" strokeDasharray="2 2" />
                  <polygon points="50,11 47,19 53,19" fill="#84CC16" />
                </g>
              </svg>
            </div>

            {/* Readouts */}
            <div className="text-[10px] font-mono space-y-0.5 border-t border-slate-200 dark:border-[#2D3137] pt-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                  <span>Rel. wind dir........</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{unit.windDirectionDeg}°</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                  <span>Nacelle dir............</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{unit.nacelleDirectionDeg}°</span>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER ROW: 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Lower Column 1: Productivity & Integrated Valve Controls */}
          <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-3 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Productivity & Control
              </div>

              <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white">Produced energy, kWh:</div>
                <div className="flex justify-between pl-2">
                  <span className="text-slate-400">Today...........................</span>
                  <span className="font-bold text-slate-900 dark:text-white">{unit.dailyProducedKwh}</span>
                </div>
                <div className="flex justify-between pl-2">
                  <span className="text-slate-400">This month..............</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {unit.monthlyProducedKwh.toLocaleString('de-DE')}
                  </span>
                </div>
                <div className="flex justify-between pl-2">
                  <span className="text-slate-400">Total..............</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {unit.totalProducedKwh.toLocaleString('de-DE')}
                  </span>
                </div>

                <div className="border-t border-slate-200 dark:border-[#2D3137] my-1 pt-1 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operating time, hrs.....</span>
                    <span className="font-bold text-slate-900 dark:text-white">{unit.operatingHours}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service this year, hrs.....</span>
                    <span className="font-bold text-slate-900 dark:text-white">{unit.serviceThisYearHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated Hydraulic Valve Stage Control (from existing app) */}
            <div className="mt-3 p-2.5 bg-white dark:bg-[#1C1F24] border border-slate-200 dark:border-[#383D45] rounded">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex justify-between">
                <span>Hydraulic Valve Stage</span>
                <span className="text-[#E52E2D]">Active Mức {currentValveLevel}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleValveChange(1)}
                  className={`py-1 text-[11px] font-bold rounded transition-colors ${
                    currentValveLevel === 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-[#2A2E35] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#333842]'
                  }`}
                >
                  Mức 1 (28%)
                </button>
                <button
                  onClick={() => handleValveChange(2)}
                  className={`py-1 text-[11px] font-bold rounded transition-colors ${
                    currentValveLevel === 2
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 dark:bg-[#2A2E35] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#333842]'
                  }`}
                >
                  Mức 2 (50%)
                </button>
                <button
                  onClick={() => handleValveChange(3)}
                  className={`py-1 text-[11px] font-bold rounded transition-colors ${
                    currentValveLevel === 3
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-[#2A2E35] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#333842]'
                  }`}
                >
                  Mức 3 (100%)
                </button>
              </div>
            </div>
          </div>

          {/* Lower Column 2: Daily Production Bar Chart */}
          <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-3 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Daily production
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 w-full flex items-end gap-1 px-1 pt-2">
              {dailyProductionBars.map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-0.5 h-full">
                    {/* Previous day bar */}
                    <div
                      className="w-1.5 bg-[#4B6B62] rounded-t-xs transition-all duration-300"
                      style={{ height: `${bar.prev}%` }}
                      title={`Previous: ${bar.prev}`}
                    />
                    {/* Current day bar */}
                    <div
                      className="w-1.5 bg-[#84CC16] rounded-t-xs transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${bar.curr}%` }}
                      title={`Current: ${bar.curr}`}
                    />
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 mt-1">{bar.hour}</span>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-[#2D3137] pt-2 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4B6B62]" />
                <span>Previous day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                <span>Current day</span>
              </div>
            </div>
          </div>

          {/* Lower Column 3: Power Curve Scatter & Fit Chart */}
          <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-3 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
              Power curve
            </div>

            {/* Power curve chart visualization */}
            <div className="relative h-44 w-full flex items-center justify-center">
              <svg viewBox="0 0 200 120" className="w-full h-full">
                {/* Grid lines */}
                <line x1="30" y1="10" x2="190" y2="10" stroke="#CBD5E1" className="dark:stroke-[#33373E]" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="30" y1="40" x2="190" y2="40" stroke="#CBD5E1" className="dark:stroke-[#33373E]" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="30" y1="70" x2="190" y2="70" stroke="#CBD5E1" className="dark:stroke-[#33373E]" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="30" y1="100" x2="190" y2="100" stroke="#CBD5E1" className="dark:stroke-[#33373E]" strokeWidth="0.8" />

                {/* Y Axis Labels */}
                <text x="25" y="14" fontSize="7" fill="#888" textAnchor="end">2000</text>
                <text x="25" y="44" fontSize="7" fill="#888" textAnchor="end">1500</text>
                <text x="25" y="74" fontSize="7" fill="#888" textAnchor="end">1000</text>
                <text x="25" y="104" fontSize="7" fill="#888" textAnchor="end">500</text>
                <text x="15" y="25" fontSize="7" fill="#888" fontWeight="bold">kW</text>

                {/* X Axis Labels */}
                <text x="35" y="114" fontSize="7" fill="#888">3</text>
                <text x="75" y="114" fontSize="7" fill="#888">5</text>
                <text x="115" y="114" fontSize="7" fill="#888">10</text>
                <text x="155" y="114" fontSize="7" fill="#888">15</text>
                <text x="185" y="114" fontSize="7" fill="#888">20</text>

                {/* Theoretical Fitted S-Curve */}
                <path
                  d="M 35 100 Q 80 98 105 75 T 145 35 T 185 18"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1.8"
                />

                {/* Real-time scatter points (Last 24h: green, Last 10m: dark/lime) */}
                {[
                  [45, 98], [55, 95], [65, 92], [75, 88], [80, 84], [85, 80],
                  [90, 76], [95, 72], [100, 68], [105, 62], [110, 56], [115, 52],
                  [120, 48], [125, 44], [130, 40], [135, 36], [140, 32], [145, 29],
                  [150, 26], [155, 23], [160, 22], [165, 21], [170, 20]
                ].map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x + (Math.random() * 6 - 3)}
                    cy={y + (Math.random() * 6 - 3)}
                    r="2"
                    fill={i > 15 ? '#22C55E' : '#84CC16'}
                    fillOpacity="0.85"
                  />
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-[#2D3137] pt-2 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
                <span>Last 24 hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                <span>Last 10 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SUB-TABS & SUBSYSTEM SELECTOR */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-100 dark:bg-[#1A1D21] border border-slate-200 dark:border-[#2D3137] rounded text-xs">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              'Production',
              'Historical graph',
              'Power curve',
              'Trigger',
              'High resolution',
              'Error log',
            ].map((sub, i) => (
              <button
                key={sub}
                onClick={() => onSelectTab?.(sub)}
                className={`px-2.5 py-1 rounded font-semibold text-[11px] transition-colors ${
                  i === 0
                    ? 'bg-white dark:bg-[#25282E] text-[#E52E2D] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Subsystem Toggles */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#25282E] p-0.5 rounded border border-slate-200 dark:border-[#383D45]">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'hub', label: 'Hub' },
                { id: 'drivetrain', label: 'Drive train' },
                { id: 'grid', label: 'Grid' },
              ] as const
            ).map((sys) => (
              <button
                key={sys.id}
                onClick={() => setActiveSubsystem(sys.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                  activeSubsystem === sys.id
                    ? 'bg-[#E52E2D] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sys.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
