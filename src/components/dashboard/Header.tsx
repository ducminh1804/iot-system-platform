import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, X, LogOut, User, Settings as SettingsIcon, Menu, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title?: string;
  onSearchChange?: (val: string) => void;
  onOpenMobileMenu?: () => void;
}

export function Header({
  title = 'Revenue Analytics',
  onSearchChange,
  onOpenMobileMenu,
}: HeaderProps) {
  const { theme, setTheme, deviceBreadcrumbs } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnread, setHasUnread] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const notifications = [
    { id: 1, title: 'New subscription added', desc: 'Acme Corp upgraded to Enterprise ($2,400/mo)', time: '10m ago' },
    { id: 2, title: 'ARPU target reached', desc: 'Average revenue per user surged +16.8%', time: '1h ago' },
    { id: 3, title: 'May projection updated', desc: 'Forecasted growth milestone hit 509k', time: '3h ago' },
  ];

  return (
    <header className="w-full flex items-center justify-between gap-2.5 sm:gap-4">
      {/* Title & Mobile Menu Button / Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 sm:p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#151A24] text-slate-700 dark:text-slate-200 shadow-2xs active:scale-95 transition-transform shrink-0 cursor-pointer"
            title="Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {deviceBreadcrumbs ? (
          <div className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-xl lg:text-[23px] font-black tracking-tight min-w-0 text-slate-900 dark:text-white">
            {/* Back button */}
            <button
              type="button"
              onClick={deviceBreadcrumbs.stationName ? deviceBreadcrumbs.onBackToList : deviceBreadcrumbs.onBackToHub}
              className="p-1 sm:p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer mr-0.5"
              title="Quay lại"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Root "Thiết Bị" */}
            <button
              type="button"
              onClick={deviceBreadcrumbs.onBackToHub}
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap font-bold"
            >
              Thiết Bị
            </button>
            <span className="text-slate-300 dark:text-slate-600 font-light">/</span>

            {/* Category / Station */}
            {deviceBreadcrumbs.stationName ? (
              <>
                <button
                  type="button"
                  onClick={deviceBreadcrumbs.onBackToList}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer truncate max-w-[120px] sm:max-w-[220px] font-bold"
                >
                  {deviceBreadcrumbs.categoryTitle}
                </button>
                <span className="text-slate-300 dark:text-slate-600 font-light">/</span>
                <span className="truncate text-blue-600 dark:text-blue-400">
                  {deviceBreadcrumbs.stationName}
                </span>
              </>
            ) : (
              <span className="truncate">
                {deviceBreadcrumbs.categoryTitle}
              </span>
            )}
          </div>
        ) : (
          <h1 className="text-base sm:text-xl lg:text-[24px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Right Controls: Search, Notification, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search Bar - hiện trên desktop md trở lên */}
        <div className="hidden md:block relative w-52 lg:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            placeholder="Search anything..."
            className="w-full h-10 pl-9 pr-14 rounded-full text-xs sm:text-[13px] bg-white/90 dark:bg-[#151A24] border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onSearchChange?.('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md border border-slate-200/80 dark:border-slate-700/60 pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Notifications Popover */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={() => setHasUnread(false)}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#151A24] border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 shadow-2xs flex items-center justify-center cursor-pointer active:scale-95 shrink-0"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {hasUnread && (
                <span className="absolute top-2 sm:top-2.5 right-2 sm:right-2.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#151A24] animate-pulse" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Thông Báo</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
                Đánh dấu đã đọc
              </span>
            </div>
            <DropdownMenuSeparator />
            <div className="space-y-1 py-1 max-h-60 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{n.desc}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.time}</span>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle Button (Moon & Sun) */}
        <div className="flex items-center h-9 sm:h-10 p-0.5 sm:p-1 rounded-full bg-white dark:bg-[#151A24] border border-slate-200/80 dark:border-slate-800 shadow-2xs shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 text-amber-300 shadow-xs scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Dark mode"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              theme === 'light'
                ? 'bg-slate-100 text-amber-500 shadow-xs scale-105'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Light mode"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Profile Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700 hover:opacity-95 transition-all shadow-2xs active:scale-95 shrink-0"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Alex Rivera"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const next = e.currentTarget.nextElementSibling as HTMLElement;
                  if (next) next.style.display = 'flex';
                }}
              />
              <div
                style={{ display: 'none' }}
                className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs items-center justify-center shadow-xs"
              >
                AR
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl">
            <div className="px-3 py-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white">Alex Rivera</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">alex@startupinc.io</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-xs p-2 rounded-xl cursor-pointer">
              <User className="w-4 h-4 text-slate-400" />
              <span>Hồ Sơ Cá Nhân</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-xs p-2 rounded-xl cursor-pointer">
              <SettingsIcon className="w-4 h-4 text-slate-400" />
              <span>Cài Đặt Tài Khoản</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 p-2 rounded-xl cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>Đăng Xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
