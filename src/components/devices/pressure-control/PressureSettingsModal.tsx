import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Pencil,
  Check,
  CalendarClock,
  Gauge,
  Activity,
  Cpu,
  Droplets,
  Waves,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { PressureStationConfig, StationMetaInfo } from './types';
import { DEFAULT_PRESSURE_CONFIG } from './utils';
import { ControlMechanismTab } from './tabs/ControlMechanismTab';
import { AlarmsTab } from './tabs/AlarmsTab';
import { PulseMeterTab } from './tabs/PulseMeterTab';
import { SensorCalibrationTab } from './tabs/SensorCalibrationTab';
import { FlowAlarmTab } from './tabs/FlowAlarmTab';
import { WaveTabs, WaveTabItem } from './WaveTabs';

export type SettingsTabId =
  | 'control'
  | 'pulse_meter'
  | 'flow_alarms'
  | 'alarms'
  | 'schedule'
  | 'calibration'
  | 'modbus'
  | 'system';

const SETTINGS_TABS: WaveTabItem<SettingsTabId>[] = [
  { id: 'control', label: 'Cơ chế điều khiển', icon: SlidersHorizontal, accentColor: 'text-orange-500' },
  { id: 'pulse_meter', label: 'Đồng hồ xung', icon: Droplets, accentColor: 'text-blue-500' },
  { id: 'flow_alarms', label: 'Cảnh báo lưu lượng', icon: Waves, accentColor: 'text-cyan-500' },
  { id: 'alarms', label: 'Cảnh báo nguồn & Pin', icon: Zap, accentColor: 'text-amber-500' },
  { id: 'schedule', label: 'Lịch trình áp', icon: CalendarClock, accentColor: 'text-amber-500' },
  { id: 'calibration', label: 'Calib cảm biến', icon: Gauge, accentColor: 'text-indigo-500' },
  { id: 'modbus', label: 'Truyền thông Modbus', icon: Activity, accentColor: 'text-emerald-500' },
  { id: 'system', label: 'Hệ thống & RTC', icon: Cpu, accentColor: 'text-cyan-500' },
];

interface PressureSettingsModalProps {
  isOpen: boolean;
  stationMeta?: StationMetaInfo;
  onUpdateStationMeta?: (meta: StationMetaInfo) => void;
  config?: PressureStationConfig;
  rtcTime?: string;
  currentSolarVoltage?: number;
  currentLoggerVoltage?: number;
  currentFlowRate?: number;
  currentPressureIn?: number;
  currentPressureOut?: number;
  onChangeConfig?: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
  onResetDefaults?: () => void;
  onSyncRTC?: () => void;
  onClose: () => void;
}

export function PressureSettingsModal({
  isOpen,
  stationMeta = {
    name: 'Thiết bị điều khiển áp lực',
    stationId: '1015',
    version: 'version 1',
  },
  onUpdateStationMeta,
  config = DEFAULT_PRESSURE_CONFIG,
  currentSolarVoltage = 12.46,
  currentLoggerVoltage = 3.60,
  currentFlowRate = 49.6,
  currentPressureIn = 25.9,
  currentPressureOut = 24.2,
  onChangeConfig = () => {},
  onSave,
  onClose,
}: PressureSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('control');
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [tempName, setTempName] = useState(stationMeta.name);
  const [tempId, setTempId] = useState(stationMeta.stationId);
  const [tempVersion, setTempVersion] = useState(stationMeta.version);

  const handleStartEdit = () => {
    setTempName(stationMeta.name);
    setTempId(stationMeta.stationId);
    setTempVersion(stationMeta.version);
    setIsEditingMeta(true);
  };

  const handleSaveMeta = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = tempName.trim();
    const cleanId = tempId.trim();
    const cleanVersion = tempVersion.trim();

    if (!cleanName) {
      toast.error('Tên thiết bị không được để trống');
      return;
    }
    if (!cleanId) {
      toast.error('ID thiết bị không được để trống');
      return;
    }
    if (!cleanVersion) {
      toast.error('Phiên bản (Version) không được để trống');
      return;
    }

    onUpdateStationMeta?.({
      name: cleanName,
      stationId: cleanId,
      version: cleanVersion,
    });
    setIsEditingMeta(false);
    toast.success('Đã lưu thông tin thiết bị (Tên, ID, Version)');
  };

  const handleCancelMeta = () => {
    setTempName(stationMeta.name);
    setTempId(stationMeta.stationId);
    setTempVersion(stationMeta.version);
    setIsEditingMeta(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelMeta();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 transition-all duration-300 ease-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-[98vw] max-w-[2400px] h-[93vh] sm:h-[95vh] bg-white dark:bg-[#12151E] rounded-[24px] sm:rounded-[30px] border border-slate-200/90 dark:border-slate-800/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out transform ${
          isOpen
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-95 opacity-0 translate-y-3 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Header: Hiển thị Tên - ID - Version và Cây Bút chỉnh sửa */}
        <div className="shrink-0 px-4 sm:px-8 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-[#151924]/80 backdrop-blur-sm">
          {!isEditingMeta ? (
            /* Chế độ xem: Tên - ID - Version + Cây bút */
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                  <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                    {stationMeta.name}
                  </h3>

                  {/* ID Badge */}
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                    ID: {stationMeta.stationId}
                  </span>

                  {/* Version Badge */}
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {stationMeta.version}
                  </span>

                  {/* Cây bút (Click để chỉnh sửa Tên, ID, Version) */}
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all cursor-pointer active:scale-95 group shrink-0"
                    title="Chỉnh sửa Tên, ID, Version"
                  >
                    <Pencil className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </button>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                  Cài đặt thông số cấu hình và định danh thiết bị
                </p>
              </div>
            </div>
          ) : (
            /* Chế độ sửa: Form sửa Tên - ID - Version trực tiếp ngay trên header */
            <form
              onSubmit={handleSaveMeta}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 flex flex-wrap items-center gap-2 sm:gap-3 py-1"
            >
              <div className="flex items-center gap-1.5 shrink-0 text-blue-600 dark:text-blue-400">
                <Pencil className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                  Sửa thông số:
                </span>
              </div>

              {/* Input Tên thiết bị */}
              <div className="flex-1 min-w-[150px] sm:min-w-[200px]">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Tên thiết bị..."
                  autoFocus
                  className="w-full h-9 px-3 rounded-xl border border-blue-400 dark:border-blue-600 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-2xs"
                />
              </div>

              {/* Input ID */}
              <div className="w-24 sm:w-28 shrink-0">
                <input
                  type="text"
                  value={tempId}
                  onChange={(e) => setTempId(e.target.value)}
                  placeholder="ID trạm"
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0E14] text-xs font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-2xs"
                />
              </div>

              {/* Input Version */}
              <div className="w-24 sm:w-28 shrink-0">
                <input
                  type="text"
                  value={tempVersion}
                  onChange={(e) => setTempVersion(e.target.value)}
                  placeholder="Version"
                  className="w-full h-9 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0E14] text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-2xs"
                />
              </div>

              {/* Nút Lưu & Hủy */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="submit"
                  className="h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Lưu (Enter)"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelMeta}
                  className="h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  title="Hủy bỏ (Esc)"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Nút Lưu & Thoát / Đóng Modal */}
          <div className="flex items-center gap-2 shrink-0">
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                title="Lưu cấu hình trạm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Lưu</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              title="Đóng (Thoát)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* 2. Thanh tab lượn sóng: một khối trắng duy nhất trượt tới tab đang chọn */}
        <WaveTabs tabs={SETTINGS_TABS} activeId={activeTab} onChange={(id) => setActiveTab(id)} />

        {/* 3. Modal Body: Nối liền mượt mà với chân tab đang chọn */}
        <div className="flex-1 min-h-0 bg-white dark:bg-[#12151E] overflow-y-auto p-4 sm:p-6 lg:p-7 flex flex-col">
          {activeTab === 'control' && (
            <ControlMechanismTab
              config={config}
              onChangeConfig={onChangeConfig}
              onSave={onSave}
            />
          )}

          {activeTab === 'pulse_meter' && (
            <PulseMeterTab
              config={config}
              onChangeConfig={onChangeConfig}
              onSave={onSave}
              currentFlowRate={currentFlowRate}
            />
          )}

          {activeTab === 'flow_alarms' && (
            <FlowAlarmTab
              config={config}
              onChangeConfig={onChangeConfig}
              onSave={onSave}
              currentFlowRate={currentFlowRate}
            />
          )}

          {activeTab === 'alarms' && (
            <AlarmsTab
              config={config}
              onChangeConfig={onChangeConfig}
              onSave={onSave}
              currentSolarVoltage={currentSolarVoltage}
              currentLoggerVoltage={currentLoggerVoltage}
            />
          )}

          {activeTab === 'calibration' && (
            <SensorCalibrationTab
              config={config}
              onChangeConfig={onChangeConfig}
              onSave={onSave}
              currentPressureIn={currentPressureIn}
              currentPressureOut={currentPressureOut}
            />
          )}

          {activeTab !== 'control' &&
            activeTab !== 'pulse_meter' &&
            activeTab !== 'flow_alarms' &&
            activeTab !== 'alarms' &&
            activeTab !== 'calibration' && (
              <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-xs">
                  {activeTab === 'schedule' && <CalendarClock className="w-8 h-8 text-amber-500" />}
                  {activeTab === 'modbus' && <Activity className="w-8 h-8 text-emerald-500" />}
                  {activeTab === 'system' && <Cpu className="w-8 h-8 text-cyan-500" />}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                  {SETTINGS_TABS.find((t) => t.id === activeTab)?.label}
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1.5">
                  Tab này đã sẵn sàng. Bạn có thể yêu cầu thiết kế chi tiết các thông số cụ thể cho tab này bất cứ lúc nào!
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
