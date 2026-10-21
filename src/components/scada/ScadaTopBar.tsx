import React, { useState } from 'react';
import {
  PylonIcon,
  SubstationIcon,
  TurbineMastIcon,
  ReactivePowerIcon,
  CircularLightningIcon,
  GridTowerIcon,
} from './ScadaIcons';
import { MOCK_GLOBAL_KPIS, MOCK_ALARM_SUMMARY } from './mockData';
import { useAppStore } from '@/stores/useAppStore';
import { ChevronDown, ChevronUp, Sun, Moon, Bell, Wrench, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ScadaTopBarProps {
  onSelectAlarms?: () => void;
}

export const ScadaTopBar: React.FC<ScadaTopBarProps> = ({ onSelectAlarms }) => {
  const { theme, setTheme } = useAppStore();
  const [kpiExpanded, setKpiExpanded] = useState<boolean>(true);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <header className="w-full shrink-0 border-b border-[#2C3138] dark:border-[#2C3138] bg-[#FFFFFF] dark:bg-[#202328] text-slate-800 dark:text-slate-100 select-none transition-colors duration-200">
      {/* Upper Bar: Brand Logo, Alarm Counters, Theme, User */}
      <div className="flex items-center justify-between px-3 lg:px-4 py-2 border-b border-[#E2E8F0] dark:border-[#2B2F36]">
        {/* Left: Brand */}
        <div className="flex items-baseline gap-2.5">
          <div className="flex items-baseline font-black tracking-tight text-xl lg:text-2xl cursor-pointer">
            <span className="text-[#E52E2D]">Mi</span>
            <span className="text-slate-800 dark:text-white">Scout</span>
            <span className="text-[10px] text-slate-400 font-normal ml-0.5 align-super">TM</span>
          </div>
          <span className="text-[10px] tracking-wider font-semibold text-slate-400 dark:text-[#8E959E] uppercase">
            SCADA 5 - Enterprise
          </span>
        </div>

        {/* Center: Global Alarm & Event Counters */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          {/* Main Red Clipboard Alarm Badge */}
          <button
            onClick={onSelectAlarms}
            className="flex items-center gap-1.5 bg-[#E52E2D] hover:bg-[#D42625] text-white px-2.5 py-1 rounded shadow-sm transition-transform active:scale-95"
            title="Active Alarms"
          >
            <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
            <span className="font-bold text-sm leading-none">{MOCK_ALARM_SUMMARY.total}</span>
          </button>

          {/* Individual Alarm Counters */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1 text-[#EF4444]" title="Critical Alarms">
              <Bell className="w-3.5 h-3.5 fill-[#EF4444]" />
              <span>{MOCK_ALARM_SUMMARY.criticalAlarms}</span>
            </div>

            <div className="flex items-center gap-1 text-[#F97316]" title="Warnings">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{MOCK_ALARM_SUMMARY.warnings}</span>
            </div>

            <div className="flex items-center gap-1 text-[#EAB308]" title="Cautions">
              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
              <span>{MOCK_ALARM_SUMMARY.cautions}</span>
            </div>

            <div className="flex items-center gap-1 text-[#3B82F6]" title="In Service">
              <Wrench className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{MOCK_ALARM_SUMMARY.inService}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400" title="Standby Sync">
              <RefreshCw className="w-3 h-3 stroke-[2.2]" />
              <span>{MOCK_ALARM_SUMMARY.standby}</span>
            </div>
          </div>
        </div>

        {/* Right: Theme Toggle & User Account */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#E2E8F0] dark:border-[#383D45] bg-slate-50 dark:bg-[#2A2E35] text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} SCADA Theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Light SCADA</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="hidden md:inline">Dark SCADA</span>
              </>
            )}
          </button>

          {/* User Account */}
          <div className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200 text-xs font-semibold px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <div className="w-6 h-6 rounded-full bg-[#E52E2D]/20 text-[#E52E2D] flex items-center justify-center font-bold text-[10px]">
              HH
            </div>
            <span>Hulk Hogan</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Lower Bar: Global KPI Telemetry Strip (Ẩn trên mobile để tiết kiệm chiều cao màn hình) */}
      {kpiExpanded && (
        <div className="hidden md:flex px-3 lg:px-4 py-1.5 items-center justify-between gap-4 overflow-x-auto scrollbar-none bg-[#F8FAFC] dark:bg-[#1A1D21] border-b border-[#E2E8F0] dark:border-[#282C33]">
          <div className="flex items-center gap-6 lg:gap-10 shrink-0">
            {MOCK_GLOBAL_KPIS.map((kpi) => {
              const IconComp =
                kpi.type === 'pylon'
                  ? PylonIcon
                  : kpi.type === 'factory'
                  ? SubstationIcon
                  : kpi.type === 'turbine'
                  ? TurbineMastIcon
                  : kpi.type === 'reactive'
                  ? ReactivePowerIcon
                  : kpi.type === 'generator'
                  ? CircularLightningIcon
                  : GridTowerIcon;

              return (
                <div key={kpi.id} className="flex items-center gap-2.5 shrink-0 group">
                  <div className="text-[#E52E2D] group-hover:scale-110 transition-transform">
                    <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1 font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-tight font-mono">
                      <span>{kpi.value}</span>
                      {kpi.unit && <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">{kpi.unit}</span>}
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#8E959E] font-medium leading-none">
                      {kpi.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setKpiExpanded(false)}
            className="hidden xl:flex text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-white/5 transition-colors"
            title="Thu gọn dải KPI"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}
      {!kpiExpanded && (
        <div className="hidden md:flex justify-end px-3 py-0.5 bg-[#F8FAFC] dark:bg-[#1A1D21]">
          <button
            onClick={() => setKpiExpanded(true)}
            className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 font-semibold"
          >
            <span>Hiện KPIs</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}
    </header>
  );
};
