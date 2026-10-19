import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  UploadCloud,
  AlertTriangle,
  SlidersHorizontal,
  Gauge,
  BatteryCharging,
  Activity,
  Cpu,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { TabControlModes } from './settings/TabControlModes';
import { TabSensorCalibration } from './settings/TabSensorCalibration';
import { TabPowerManagement } from './settings/TabPowerManagement';
import { TabAnomalyDetection } from './settings/TabAnomalyDetection';
import { TabLegacyScada } from './settings/TabLegacyScada';

export type SettingsTabId = 'control' | 'calibration' | 'power' | 'anomaly' | 'legacy';

interface NavItem {
  id: SettingsTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'control',
    label: 'Phương Thức Điều Khiển',
    icon: SlidersHorizontal,
  },
  {
    id: 'calibration',
    label: 'Hiệu Chuẩn Cảm Biến',
    icon: Gauge,
  },
  {
    id: 'power',
    label: 'Nguồn Điện & Pin Solar',
    icon: BatteryCharging,
  },
  {
    id: 'anomaly',
    label: 'Học Máy & Cảnh Báo 7 Ngày',
    icon: Activity,
  },
  {
    id: 'legacy',
    label: 'Cấu Hình SCADA & An Toàn',
    icon: Cpu,
  },
];

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTabId>('control');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showGlobalResetModal, setShowGlobalResetModal] = useState(false);

  const {
    saveAllSettings,
    resetGlobalSystem,
    controlMode,
    zeroConfirmed,
    point1Confirmed,
    device1015LearningDay,
    battery36WarningEnabled,
    solarWarningEnabled,
  } = useSettingsStore();

  const handleSyncToDevice = async () => {
    setIsSyncing(true);
    toast.loading('Đang đồng bộ cấu hình xuống Thiết Bị 1015...', { id: 'sync-cfg' });
    await new Promise((r) => setTimeout(r, 700));
    saveAllSettings();
    setIsSyncing(false);
    toast.success('Đã lưu và nạp cấu hình xuống thiết bị 1015!', { id: 'sync-cfg' });
  };

  // Keyboard shortcut Ctrl+S / Cmd+S for quick save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSyncToDevice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentTab = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];

  // Helper dynamic tab badges based on store state
  const getTabBadge = (id: SettingsTabId) => {
    switch (id) {
      case 'control':
        return controlMode === 'rtc' ? 'RTC' : controlMode === 'manual' ? 'Thủ công' : 'Thích ứng';
      case 'calibration':
        return zeroConfirmed && point1Confirmed ? 'Đã Calib' : 'Cần Calib';
      case 'power':
        return battery36WarningEnabled || solarWarningEnabled ? 'Cảnh báo Bật' : 'Bình thường';
      case 'anomaly':
        return `Ngày ${device1015LearningDay}/7`;
      case 'legacy':
        return 'SCADA Online';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 min-w-0 bg-slate-900/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.4)] font-sans text-slate-100 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-white/10 gap-4">
        {/* Left: Back + Title + Status Capsule */}
        <div className="flex items-center gap-3.5 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => navigate('/device')}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all cursor-pointer group shrink-0"
            title="Quay lại Giám Sát"
            aria-label="Quay lại trang Giám Sát"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Cài Đặt Hệ Thống
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                THIẾT BỊ 1015
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 self-end lg:self-auto shrink-0">
          <button
            type="button"
            onClick={() => navigate('/device')}
            className="px-5 py-2.5 rounded-xl border border-white/15 text-sm font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Quay Lại Giám Sát
          </button>

          <button
            type="button"
            disabled={isSyncing}
            onClick={handleSyncToDevice}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2.5 cursor-pointer"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>{isSyncing ? 'Đang Nạp...' : 'Lưu & Nạp Thiết Bị'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Vertical Menu */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-2">
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              const badgeText = getTabBadge(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all cursor-pointer border flex items-center gap-3.5 group relative shrink-0 min-w-[220px] lg:min-w-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900 border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/30'
                      : 'bg-slate-950/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl transition-all shrink-0 ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                    <span
                      className={`text-base font-black truncate ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tracking-tight border shrink-0 ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}
                    >
                      {badgeText}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Red Action at Bottom */}
          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowGlobalResetModal(true)}
              className="w-full text-left p-3.5 rounded-2xl text-sm font-bold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 hover:border-red-500/50 transition-all cursor-pointer flex items-center gap-3 group"
            >
              <div className="p-2 rounded-xl bg-red-500/20 text-red-400 group-hover:bg-red-500/30">
                <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-black text-base">Reset Toàn Bộ Hệ Thống</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-6">
          {/* Active Tab Header */}
          <div className="pb-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <currentTab.icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {currentTab.label}
              </h2>
            </div>
          </div>

          {/* Tab Renderers */}
          {activeTab === 'control' && <TabControlModes />}
          {activeTab === 'calibration' && <TabSensorCalibration />}
          {activeTab === 'power' && <TabPowerManagement />}
          {activeTab === 'anomaly' && <TabAnomalyDetection />}
          {activeTab === 'legacy' && <TabLegacyScada />}
        </div>
      </div>

      {/* Modal xác nhận Reset Toàn Bộ Hệ Thống */}
      {showGlobalResetModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-red-500/50 text-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
            <div className="flex items-start gap-4 text-red-400 mb-4">
              <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 shrink-0">
                <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  Xác Nhận Reset Toàn Bộ Hệ Thống?
                </h3>
                <p className="text-xs text-red-400/90 font-bold uppercase tracking-wider mt-0.5">
                  Cảnh Báo Cực Kỳ Quan Trọng
                </p>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed font-medium bg-slate-950/60 p-4 rounded-2xl border border-white/10">
              <p>
                Thao tác này sẽ <strong className="text-red-400">xóa sạch toàn bộ dữ liệu mẫu học 7 ngày</strong> của tất cả thiết bị trên toàn mạng lưới cấp nước.
              </p>
              <p className="text-xs text-slate-400">
                Hệ thống AI sẽ bắt đầu chu kỳ quan sát lại từ Ngày 1 cho tất cả các điểm đo. Các cảnh báo bất thường sẽ tạm ngưng cho đến khi hoàn thành tối thiểu 3 ngày dữ liệu.
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowGlobalResetModal(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                Hủy Bỏ
              </button>
              <button
                type="button"
                onClick={() => {
                  resetGlobalSystem();
                  setShowGlobalResetModal(false);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-black shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
              >
                Xác Nhận Xóa Toàn Bộ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

