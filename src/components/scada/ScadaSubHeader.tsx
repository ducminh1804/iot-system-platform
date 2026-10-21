import React from 'react';
import { ScadaWorkspaceView, ScadaMainTab } from './types';
import {
  ArrowLeft,
  Plus,
  Download,
  Settings as SettingsIcon,
  Play,
  Square,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

interface ScadaSubHeaderProps {
  activeRailTab: ScadaMainTab;
  currentView: ScadaWorkspaceView;
  onViewChange: (view: ScadaWorkspaceView) => void;
  deviceViewMode?: 'monitor' | 'settings';
  onDeviceViewModeChange?: (mode: 'monitor' | 'settings') => void;
  onBack?: () => void;
}

export const ScadaSubHeader: React.FC<ScadaSubHeaderProps> = ({
  activeRailTab,
  currentView,
  onViewChange,
  deviceViewMode = 'monitor',
  onDeviceViewModeChange,
  onBack,
}) => {
  const handleAction = (action: string) => {
    toast.success(`Action: ${action} sent to selected units`, { duration: 1500 });
  };

  // 1. TABS DÀNH RIÊNG CHO MỤC DEVICE (Thiết Bị 1015)
  if (activeRailTab === 'device') {
    return (
      <div className="w-full shrink-0 bg-[#FFFFFF] dark:bg-[#202328] border-b border-[#E2E8F0] dark:border-[#282C33] select-none text-slate-800 dark:text-slate-200">
        {/* Upper Tab Navigation */}
        <div className="flex items-center justify-between px-2 sm:px-4 py-1 sm:py-1.5 border-b border-[#E2E8F0] dark:border-[#282C33]">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onBack}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Device Specific Tabs */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onDeviceViewModeChange?.('monitor')}
                className={`relative px-2.5 sm:px-3 py-1 text-xs font-bold transition-colors ${
                  deviceViewMode === 'monitor'
                    ? 'text-[#E52E2D] dark:text-[#EF4444]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>Giám Sát Trạm 1015</span>
                {deviceViewMode === 'monitor' && (
                  <div className="absolute bottom-[-5px] left-0 right-0 h-[2.5px] bg-[#E52E2D]" />
                )}
              </button>

              <button
                onClick={() => onDeviceViewModeChange?.('settings')}
                className={`relative px-2.5 sm:px-3 py-1 text-xs font-bold transition-colors ${
                  deviceViewMode === 'settings'
                    ? 'text-[#E52E2D] dark:text-[#EF4444]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>Cấu Hình & Cài Đặt (5 Phân Hệ)</span>
                {deviceViewMode === 'settings' && (
                  <div className="absolute bottom-[-5px] left-0 right-0 h-[2.5px] bg-[#E52E2D]" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block font-mono text-xs font-extrabold text-[#E52E2D] bg-[#E52E2D]/10 px-2 py-0.5 rounded">
              STATION: 1015
            </span>
          </div>
        </div>

        {/* Lower Device Status Sub-Bar */}
        <div className="px-2 sm:px-4 py-0.5 sm:py-1 flex items-center justify-between gap-2 bg-[#F8FAFC] dark:bg-[#1C1F24] text-xs">
          <div className="flex items-center gap-2 text-[11px] truncate">
            <span className="font-extrabold text-slate-900 dark:text-white">1015 0:1.5 90:1.0</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-500 hidden sm:inline">Bộ điều khiển trạm van áp lực</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onDeviceViewModeChange?.('settings')}
              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Cài đặt trạm thiết bị"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. TABS DÀNH CHO CÁC MỤC KHÁC (Overview, Historical, Alarms, Control...)
  const views: { id: ScadaWorkspaceView; label: string }[] = [
    { id: 'dashboard', label: 'Lưới Tuabin (Dashboard)' },
    { id: 'turbine', label: 'Chi Tiết Tuabin (Turbine)' },
    { id: 'park', label: 'Bảng Nông Trại (Park View)' },
    { id: 'map', label: 'Bản Đồ (Map)' },
  ];

  return (
    <div className="w-full shrink-0 bg-[#FFFFFF] dark:bg-[#202328] border-b border-[#E2E8F0] dark:border-[#282C33] select-none text-slate-800 dark:text-slate-200">
      {/* Upper Tab Navigation */}
      <div className="flex items-center justify-between px-2.5 sm:px-4 py-1.5 border-b border-[#E2E8F0] dark:border-[#282C33]">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
          {/* Back button */}
          <button
            onClick={onBack || (() => onViewChange('dashboard'))}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            title="Quay lại bảng điều khiển"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* View Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {views.map((v) => {
              const isActive = currentView === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => onViewChange(v.id)}
                  className={`relative px-2.5 sm:px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#E52E2D] dark:text-[#EF4444]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{v.label}</span>
                  {isActive && (
                    <div className="absolute bottom-[-5px] left-0 right-0 h-[2.5px] bg-[#E52E2D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Add View Button */}
        <button
          onClick={() => toast.info('Tùy biến góc nhìn workspace')}
          className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
          title="Thêm View"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Lower Filter Bar & Park Summary Strip */}
      <div className="px-2.5 sm:px-4 py-1 flex flex-wrap items-center justify-between gap-2 bg-[#F8FAFC] dark:bg-[#1C1F24] text-xs">
        {/* Left: Showing Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px] hidden sm:inline">Khu vực:</span>
          <select className="bg-white dark:bg-[#282C33] border border-[#CBD5E1] dark:border-[#383D45] rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-100 font-medium focus:outline-none">
            <option>Tất cả (All selected)</option>
            <option>China - Shicheng</option>
            <option>China - Jiuguan</option>
            <option>Germany - Boxberg</option>
          </select>
        </div>

        {/* Center: Park Model & Quick Buttons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-slate-900 dark:text-white text-[11px] sm:text-xs">NEG Mikon</span>
            <span className="text-slate-400 text-[10px] hidden md:inline">115 units</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAction('START')}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold shadow-xs active:scale-95"
            >
              <Play className="w-2.5 h-2.5 fill-white" />
              <span>START</span>
            </button>
            <button
              onClick={() => handleAction('STOP')}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold shadow-xs active:scale-95"
            >
              <Square className="w-2.5 h-2.5 fill-white" />
              <span>STOP</span>
            </button>
            <button
              onClick={() => handleAction('RESET')}
              className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-slate-600 hover:bg-slate-500 text-white text-[10px] font-bold shadow-xs active:scale-95"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>RESET</span>
            </button>
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => toast.success('Đã xuất báo cáo SCADA (CSV)')}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title="Xuất báo cáo"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toast.info('Cấu hình hiển thị bảng')}
            className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title="Cài đặt bảng"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
