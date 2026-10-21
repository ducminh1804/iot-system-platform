import React from 'react';
import { ScadaMainTab } from './types';
import {
  Monitor,
  Globe,
  Bell,
  Clock,
  Sliders,
  BarChart2,
  FileSpreadsheet,
  FileText,
  Settings,
} from 'lucide-react';

interface ScadaNavRailProps {
  activeTab: ScadaMainTab;
  onTabChange: (tab: ScadaMainTab) => void;
}

interface NavItem {
  id: ScadaMainTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const ScadaNavRail: React.FC<ScadaNavRailProps> = ({ activeTab, onTabChange }) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Workspace 1', icon: Monitor },
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'device', label: 'Device', icon: Sliders },
    { id: 'alarms', label: 'Alarms', icon: Bell, badge: 29 },
    { id: 'historical', label: 'Historical', icon: Clock },
    { id: 'control', label: 'Control', icon: BarChart2 },
    { id: 'predict', label: 'Predict', icon: FileSpreadsheet },
    { id: 'report', label: 'Report', icon: FileText },
  ];

  return (
    <aside className="w-[50px] sm:w-[74px] shrink-0 bg-[#25282E] dark:bg-[#1E2126] border-r border-[#191B1F] flex flex-col justify-between py-1 sm:py-2 text-slate-300 select-none z-20">
      <div className="flex flex-col gap-0.5 sm:gap-1 w-full">
        {navItems.map((item, idx) => {
          const isActive =
            (item.label === 'Overview' && activeTab === 'overview') ||
            (item.id === activeTab && item.label !== 'Workspace 1');

          return (
            <button
              key={`${item.id}-${item.label}-${idx}`}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 sm:py-2.5 px-0.5 sm:px-1 w-full text-center transition-all group ${
                isActive
                  ? 'bg-[#373B43] text-white font-semibold shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {/* Active left indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E52E2D]" />
              )}

              <div className="relative">
                <item.icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400'
                  }`}
                  strokeWidth={1.8}
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#E52E2D] text-white text-[8px] sm:text-[9px] font-bold px-1 rounded-full leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 tracking-tight leading-none truncate max-w-[46px] sm:max-w-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Configure Item */}
      <button
        onClick={() => onTabChange('configure')}
        className={`relative flex flex-col items-center justify-center py-1.5 sm:py-2.5 px-0.5 sm:px-1 w-full text-center transition-all group ${
          activeTab === 'configure'
            ? 'bg-[#373B43] text-white font-semibold shadow-inner'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        {activeTab === 'configure' && (
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E52E2D]" />
        )}
        <Settings
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${
            activeTab === 'configure' ? 'text-white' : 'text-slate-400'
          }`}
          strokeWidth={1.8}
        />
        <span className="text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 tracking-tight leading-none truncate max-w-[46px] sm:max-w-none">Configure</span>
      </button>
    </aside>
  );
};
