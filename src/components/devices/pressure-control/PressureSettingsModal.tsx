import React, { useEffect, useMemo, useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Pencil,
  Check,
  Gauge,
  Droplets,
  Waves,
  Zap,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { PressureStationConfig, StationMetaInfo } from './types';
import { DEFAULT_PRESSURE_CONFIG } from './utils';
import { ControlMechanismTab } from './tabs/ControlMechanismTab';
import { AlarmsTab } from './tabs/AlarmsTab';
import { PulseMeterTab } from './tabs/PulseMeterTab';
import { SensorCalibrationTab } from './tabs/SensorCalibrationTab';
import { AnomalyAlarmTab } from './tabs/AnomalyAlarmTab';
import { WaveTabs, WaveTabItem } from './WaveTabs';

export type SettingsTabId =
  | 'control'
  | 'pulse_meter'
  | 'flow_alarms'
  | 'alarms'
  | 'calibration';

const SETTINGS_TABS: WaveTabItem<SettingsTabId>[] = [
  { id: 'control', label: 'Cơ chế điều khiển', icon: SlidersHorizontal, accentColor: 'text-orange-500' },
  { id: 'pulse_meter', label: 'Đồng hồ xung', icon: Droplets, accentColor: 'text-blue-500' },
  { id: 'flow_alarms', label: 'Cảnh báo bất thường', icon: Waves, accentColor: 'text-cyan-500' },
  { id: 'alarms', label: 'Cảnh báo nguồn & Pin', icon: Zap, accentColor: 'text-amber-500' },
  { id: 'calibration', label: 'Calib cảm biến', icon: Gauge, accentColor: 'text-indigo-500' },
];

type PendingNavigationAction =
  | { type: 'switch_tab'; targetTab: SettingsTabId }
  | { type: 'close_modal' }
  | null;

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

  // Bản nháp (Draft Config) để theo dõi thay đổi trước khi Lưu chính thức
  const [draftConfig, setDraftConfig] = useState<PressureStationConfig>(config);
  const [pendingAction, setPendingAction] = useState<PendingNavigationAction>(null);

  // Đồng bộ draftConfig khi mở modal hoặc khi config gốc từ ngoài thay đổi
  useEffect(() => {
    if (isOpen) {
      setDraftConfig(config);
      setPendingAction(null);
    }
  }, [isOpen, config]);

  // Kiểm tra xem có bất kỳ thông số nào đang bị thay đổi mà chưa lưu không
  const isDirty = useMemo(() => {
    return JSON.stringify(draftConfig) !== JSON.stringify(config);
  }, [draftConfig, config]);

  // Lưu toàn bộ thay đổi 1 lần duy nhất
  const handleCommitSave = () => {
    onChangeConfig(() => draftConfig);
    if (onSave) {
      onSave();
    } else {
      toast.success('Đã lưu toàn bộ cấu hình trạm');
    }
  };

  // Bỏ toàn bộ thay đổi chưa lưu, quay về bản gốc
  const handleDiscardChanges = () => {
    setDraftConfig(config);
    toast.info('Đã hủy các thay đổi chưa lưu');
  };

  // Khi người dùng bấm chuyển Tab
  const handleRequestTabChange = (nextTab: SettingsTabId) => {
    if (nextTab === activeTab) return;
    if (isDirty) {
      setPendingAction({ type: 'switch_tab', targetTab: nextTab });
    } else {
      setActiveTab(nextTab);
    }
  };

  // Khi người dùng bấm đóng Modal (X, Backdrop, hoặc phím Esc)
  const handleRequestClose = () => {
    if (isDirty) {
      setPendingAction({ type: 'close_modal' });
    } else {
      onClose();
    }
  };

  // Xử lý phím Escape để đóng modal an toàn
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pendingAction) {
          setPendingAction(null);
        } else if (isEditingMeta) {
          setIsEditingMeta(false);
        } else {
          handleRequestClose();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isDirty, pendingAction, isEditingMeta]);

  // Xử lý lựa chọn trên Popup xác nhận chưa lưu
  const handleConfirmDiscardAndProceed = () => {
    if (!pendingAction) return;
    const action = pendingAction;
    setDraftConfig(config);
    setPendingAction(null);

    if (action.type === 'switch_tab') {
      setActiveTab(action.targetTab);
    } else if (action.type === 'close_modal') {
      onClose();
    }
  };

  const handleConfirmSaveAndProceed = () => {
    if (!pendingAction) return;
    const action = pendingAction;
    onChangeConfig(() => draftConfig);
    if (onSave) {
      onSave();
    } else {
      toast.success('Đã lưu toàn bộ cấu hình trạm');
    }
    setPendingAction(null);

    if (action.type === 'switch_tab') {
      setActiveTab(action.targetTab);
    } else if (action.type === 'close_modal') {
      onClose();
    }
  };

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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 transition-all duration-300 ease-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={handleRequestClose}
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
        {/* 1. Modal Header */}
        <div className="shrink-0 px-3 sm:px-8 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 sm:gap-3 bg-slate-50/80 dark:bg-[#151924]/80 backdrop-blur-sm">
          {!isEditingMeta ? (
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
              <div className="hidden sm:flex p-2 sm:p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
                  <h3 className="text-sm sm:text-lg lg:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate max-w-[150px] sm:max-w-none">
                    {stationMeta.name}
                  </h3>

                  <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                    ID: {stationMeta.stationId}
                  </span>

                  <span className="hidden xs:inline px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                    {stationMeta.version}
                  </span>

                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all cursor-pointer active:scale-95 shrink-0"
                    title="Chỉnh sửa Tên, ID, Version"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="hidden sm:block text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                  Cài đặt thông số cấu hình và định danh thiết bị
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSaveMeta}
              className="flex-1 min-w-0 flex flex-wrap items-center gap-2 py-1"
            >
              <div className="flex-1 min-w-[120px]">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Tên thiết bị..."
                  autoFocus
                  className="w-full h-8 sm:h-9 px-2.5 rounded-xl border border-blue-400 dark:border-blue-600 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-2xs"
                />
              </div>

              <div className="w-18 sm:w-24 shrink-0">
                <input
                  type="text"
                  value={tempId}
                  onChange={(e) => setTempId(e.target.value)}
                  placeholder="ID"
                  className="w-full h-8 sm:h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0E14] text-xs font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-2xs"
                />
              </div>

              <div className="w-18 sm:w-24 shrink-0">
                <input
                  type="text"
                  value={tempVersion}
                  onChange={(e) => setTempVersion(e.target.value)}
                  placeholder="Version"
                  className="w-full h-8 sm:h-9 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B0E14] text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="submit"
                  className="h-8 sm:h-9 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
                  title="Lưu (Enter)"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelMeta}
                  className="h-8 sm:h-9 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors"
                  title="Hủy bỏ (Esc)"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}

          {/* Cụm nút Hành động Chung: Bỏ thay đổi & Lưu 1 lần cho toàn bộ Modal */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-all animate-in fade-in duration-150"
                title="Hủy các thay đổi chưa lưu"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden xs:inline">Bỏ thay đổi</span>
                <span className="xs:hidden">Bỏ</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCommitSave}
              className={`relative h-8 sm:h-9 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all ${
                isDirty
                  ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-500/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title="Lưu toàn bộ cấu hình trạm"
            >
              {isDirty && (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              )}
              <Check className="w-3.5 h-3.5" />
              <span>Lưu</span>
            </button>

            <button
              type="button"
              onClick={handleRequestClose}
              className="p-1.5 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              title="Đóng (Thoát)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
              className={`relative h-9 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all ${
                isDirty
                  ? 'bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-500/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title="Lưu toàn bộ cấu hình trạm"
            >
              {isDirty && (
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
              )}
              <Check className="w-3.5 h-3.5" />
              <span>Lưu</span>
            </button>

            <button
              type="button"
              onClick={handleRequestClose}
              className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              title="Đóng (Thoát)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* 2. Thanh tab bar */}
        <WaveTabs
          tabs={SETTINGS_TABS}
          activeId={activeTab}
          onChange={handleRequestTabChange}
        />

        {/* 3. Modal Body */}
        <div className="flex-1 min-h-0 bg-white dark:bg-[#12151E] overflow-y-auto p-4 sm:p-6 lg:p-7 flex flex-col">
          {activeTab === 'control' && (
            <ControlMechanismTab
              config={draftConfig}
              onChangeConfig={setDraftConfig}
            />
          )}

          {activeTab === 'pulse_meter' && (
            <PulseMeterTab
              config={draftConfig}
              onChangeConfig={setDraftConfig}
              currentFlowRate={currentFlowRate}
            />
          )}

          {activeTab === 'flow_alarms' && (
            <AnomalyAlarmTab
              config={draftConfig}
              stationMeta={stationMeta}
              onChangeConfig={setDraftConfig}
              currentFlowRate={currentFlowRate}
              currentPressureIn={currentPressureIn}
            />
          )}

          {activeTab === 'alarms' && (
            <AlarmsTab
              config={draftConfig}
              onChangeConfig={setDraftConfig}
              currentSolarVoltage={currentSolarVoltage}
              currentLoggerVoltage={currentLoggerVoltage}
            />
          )}

          {activeTab === 'calibration' && (
            <SensorCalibrationTab
              config={draftConfig}
              onChangeConfig={setDraftConfig}
              currentPressureIn={currentPressureIn}
              currentPressureOut={currentPressureOut}
            />
          )}
        </div>

        {/* 4. Popup Xác Nhận Khi Chuyển Tab Hoặc Đóng Modal Mà Chưa Lưu */}
        {pendingAction && (
          <div
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={() => setPendingAction(null)}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B26] p-5 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Chưa lưu thay đổi
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {pendingAction.type === 'switch_tab'
                      ? 'Bạn có thông số vừa thay đổi ở tab hiện tại chưa được lưu.'
                      : 'Bạn có thông số vừa thay đổi chưa được lưu trước khi thoát.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPendingAction(null)}
                  className="h-9 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Ở lại
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDiscardAndProceed}
                  className="h-9 px-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold cursor-pointer transition-colors"
                >
                  Bỏ thay đổi
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSaveAndProceed}
                  className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {pendingAction.type === 'switch_tab'
                      ? 'Lưu & Chuyển tab'
                      : 'Lưu & Thoát'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
