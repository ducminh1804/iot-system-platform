import React, { useState } from 'react';
import {
  LayoutGrid,
  Cpu,
  Settings,
  HelpCircle,
  Check,
  Plus,
} from 'lucide-react';
import { Logo, SidebarCollapseIcon } from './Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeItem: string;
  onSelectItem: (item: string) => void;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  activeItem,
  onSelectItem,
}: SidebarProps) {
  const [workspace, setWorkspace] = useState('Startup Inc.');

  const workspaces = [
    { name: 'Startup Inc.', code: 'SI', active: true, plan: 'Enterprise' },
    { name: 'Acme Cloud', code: 'AC', active: false, plan: 'Pro' },
    { name: 'Venture Labs', code: 'VL', active: false, plan: 'Team' },
  ];

  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'devices', label: 'Thiết bị', icon: Cpu },
  ];

  const bottomNav = [
    { id: 'setting', label: 'Setting', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <aside
      className={`relative flex flex-col justify-between h-full select-none border-r border-slate-200/60 dark:border-slate-800/60 bg-[#F9FAFB]/95 dark:bg-[#111622]/95 backdrop-blur-md overflow-hidden transition-[width,padding] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
        isCollapsed ? 'w-[72px] px-3.5 py-6' : 'w-[240px] px-5 py-6'
      }`}
    >
      {/* Top Header: Logo & Collapse Button */}
      <div>
        <div
          className={`transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
            isCollapsed
              ? 'flex flex-col items-center gap-3 mb-6'
              : 'flex items-center justify-between mb-7 min-h-[36px]'
          }`}
        >
          {/* Logo container */}
          <div className="flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95">
            <Logo className="w-8 h-8 shrink-0" />
          </div>

          {/* Collapse / Expand Toggle Button - Always Visible */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-2xs active:scale-95 cursor-pointer shrink-0 flex items-center justify-center"
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
          >
            <SidebarCollapseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={`w-full flex items-center h-11 rounded-2xl text-[13px] font-semibold transition-all duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-white dark:bg-[#1B222E] text-slate-950 dark:text-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-200/70 dark:border-slate-700/60'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40 active:scale-[0.99]'
                } ${isCollapsed ? 'px-0 justify-center' : 'px-3.5'}`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Fixed Icon container: never shifts position */}
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors ${
                      isActive
                        ? 'text-slate-900 dark:text-white stroke-[2.2]'
                        : 'text-slate-400 dark:text-slate-500 stroke-[1.8]'
                    }`}
                  />
                </div>

                {/* Animated Text Label: smoothly fades and clips width */}
                <span
                  className={`whitespace-nowrap transition-all duration-200 overflow-hidden text-left font-medium ${
                    isCollapsed
                      ? 'w-0 opacity-0 pointer-events-none -translate-x-2'
                      : 'w-auto opacity-100 translate-x-0 ml-3 flex-1 tracking-tight'
                  } ${isActive ? 'font-bold text-slate-900 dark:text-white' : ''}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation & Workspace */}
      <div className="pt-6 space-y-3.5">
        {/* Settings & Help */}
        <div className="space-y-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-4">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={`w-full flex items-center h-10 rounded-xl text-[13px] font-medium transition-colors cursor-pointer overflow-hidden ${
                  isActive
                    ? 'bg-white dark:bg-[#1B222E] text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                } ${isCollapsed ? 'px-0 justify-center' : 'px-3.5'}`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                  <Icon className="w-[18px] h-[18px] text-slate-400 dark:text-slate-500 stroke-[1.8]" />
                </div>
                <span
                  className={`whitespace-nowrap transition-all duration-200 overflow-hidden text-left ${
                    isCollapsed
                      ? 'w-0 opacity-0 pointer-events-none -translate-x-2'
                      : 'w-auto opacity-100 translate-x-0 ml-3 flex-1 tracking-tight'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Workspace Switcher Pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={`w-full flex items-center h-11 rounded-2xl bg-white/80 dark:bg-[#191F2B] hover:bg-white dark:hover:bg-[#1E2534] border border-slate-200/70 dark:border-slate-800/70 transition-all duration-200 shadow-xs active:scale-[0.99] cursor-pointer overflow-hidden ${
                isCollapsed ? 'px-0 justify-center' : 'px-2.5'
              }`}
              title={workspace}
            >
              {/* Circular Monogram Icon */}
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                SI
              </div>

              {/* Text label and dropdown dot with smooth clip */}
              <div
                className={`flex items-center justify-between transition-all duration-200 overflow-hidden whitespace-nowrap ${
                  isCollapsed
                    ? 'w-0 opacity-0 pointer-events-none'
                    : 'w-auto opacity-100 ml-2.5 flex-1'
                }`}
              >
                <div className="text-left min-w-0 leading-tight">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Workspace</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {workspace}
                  </p>
                </div>
                <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-400 ml-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl">
            <DropdownMenuLabel className="text-xs text-slate-400 font-normal px-2">
              Chuyển Không Gian Làm Việc
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.name}
                onClick={() => setWorkspace(ws.name)}
                className="flex items-center justify-between p-2 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-[10px] font-bold flex items-center justify-center">
                    {ws.code}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{ws.name}</p>
                    <p className="text-[10px] text-slate-400">{ws.plan}</p>
                  </div>
                </div>
                {ws.name === workspace && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-medium p-2 rounded-xl cursor-pointer">
              <Plus className="w-4 h-4" />
              <span>Tạo Workspace Mới</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
