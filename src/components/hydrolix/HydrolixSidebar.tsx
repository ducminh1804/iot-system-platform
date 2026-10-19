import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Cpu,
  BarChart3,
  AlertTriangle,
  FileText,
  Info,
  Settings,
  LogOut,
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface HydrolixSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutGrid, path: '/' },
  { id: 'device', label: 'Device', icon: Cpu, path: '/device' },
  { id: 'analytics', label: 'Power & Telemetry Analytics', icon: BarChart3 },
  { id: 'alarms', label: 'System Alarms (1 Active)', icon: AlertTriangle, hasBadge: true },
  { id: 'logs', label: 'Operational Logs', icon: FileText },
  { id: 'diagnostics', label: 'Subsystem Diagnostics', icon: Info },
  { id: 'settings', label: 'Cài Đặt & Cấu Hình', icon: Settings, path: '/settings' },
];

export const HydrolixSidebar: React.FC<HydrolixSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.path) {
      if (item.path === '/') {
        return location.pathname === '/';
      }
      return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    }
    return activeTab === item.id;
  };

  const handleItemClick = (item: (typeof NAV_ITEMS)[number]) => {
    if (item.path) {
      navigate(item.path);
    }
    onTabChange?.(item.id);
  };

  return (
    <aside
      aria-label="Sidebar Navigation"
      className="z-30 flex flex-col items-center justify-between py-4 px-2.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] select-none transition-all"
    >
      <div className="flex flex-col items-center gap-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(item);

          return (
            <Tooltip key={item.id} delayDuration={150}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  aria-label={item.label}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[1.9]" />
                  {item.hasBadge && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium text-xs">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label="Logout"
              className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="w-5 h-5 stroke-[1.8]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium text-xs">
            Sign out
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
};
