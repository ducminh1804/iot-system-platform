import React from 'react';
import {
  Fan,
  ChevronDown,
  Camera,
  Box,
  Search,
  Calendar,
  Bell,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface HydrolixHeaderProps {
  selectedTurbine: string;
  onSelectTurbine: (turbineId: string) => void;
  viewportMode: 'camera' | 'model';
  onViewportModeChange: (mode: 'camera' | 'model') => void;
  turbines: Array<{ id: string; name: string }>;
}

export const HydrolixHeader: React.FC<HydrolixHeaderProps> = ({
  selectedTurbine,
  onSelectTurbine,
  viewportMode,
  onViewportModeChange,
  turbines,
}) => {
  const currentTurbine = turbines.find((t) => t.id === selectedTurbine) || turbines[0];

  return (
    <header className="w-full flex items-center justify-between gap-4 py-1.5 px-3 select-none">
      {/* Brand & Turbine Select */}
      <div className="flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white shadow-sm">
            <Fan className="w-5 h-5 animate-[spin_10s_linear_infinite]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm font-sans">
            Hydrolix
          </span>
        </div>

        {/* Turbine Selector Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/35 hover:bg-slate-900/50 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wide transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span>{currentTurbine?.name || 'Select Turbine'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 bg-slate-900/90 backdrop-blur-lg border-white/20 text-white">
            {turbines.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => onSelectTurbine(t.id)}
                className={`cursor-pointer hover:bg-white/10 text-xs ${
                  t.id === selectedTurbine ? 'text-blue-400 font-semibold' : 'text-slate-200'
                }`}
              >
                {t.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Middle: Camera / Model 3D Switch */}
      <div className="hidden md:flex items-center p-0.5 rounded-full bg-slate-900/35 backdrop-blur-md border border-white/20">
        <button
          type="button"
          onClick={() => onViewportModeChange('camera')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            viewportMode === 'camera'
              ? 'bg-white/25 text-white shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Camera</span>
        </button>
        <button
          type="button"
          onClick={() => onViewportModeChange('model')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
            viewportMode === 'model'
              ? 'bg-white/25 text-white shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Model</span>
        </button>
      </div>

      {/* Right Controls: Search, Date, Notification, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="relative hidden lg:block w-48 xl:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/90 text-slate-800 text-xs placeholder:text-slate-400 border border-white/40 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Date Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 text-slate-700 text-xs font-medium shadow-sm border border-white/40">
          <span>Feb 02, 2026</span>
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-sm border border-white/40 hover:bg-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 ring-1 ring-white" />
        </button>

        {/* User Profile */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/80 shadow-sm flex items-center justify-center bg-slate-200">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
