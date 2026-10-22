import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { DeviceStation } from './mockDeviceData';
import {
  PressureLevelControls,
  PressureTelemetryGrid,
  PressureControlHeader,
  DEFAULT_PRESSURE_CONFIG,
  ActivePressureLevel,
  PressureStationConfig,
  StationMetaInfo,
} from './pressure-control';

interface StationPanelProps {
  station: DeviceStation;
  viewMode: 'gauges_only' | 'full_detail';
  onSelectStation: (station: DeviceStation) => void;
  onOpenSettings?: (station: DeviceStation, config: PressureStationConfig) => void;
  rtcTime?: string;
}

export const StationPanel = React.memo(function StationPanel({
  station,
  viewMode,
  onSelectStation,
  rtcTime = '21-10-2026 14:27:25',
}: StationPanelProps) {
  const [stationMeta] = useState<StationMetaInfo>({
    name: station.name,
    stationId: station.stationId,
    version: station.version || 'version 1',
  });

  // Mức áp hiện thời của trạm (chỉ hiển thị, không thao tác ở danh sách)
  const activeLevel: ActivePressureLevel =
    (station.activeLevel as ActivePressureLevel) ?? 1;

  const [config] = useState<PressureStationConfig>(DEFAULT_PRESSURE_CONFIG);

  const gaugeVal1 = activeLevel === 1 ? config.targetP1 : 0;
  const gaugeVal2 = activeLevel === 2 ? config.targetP2 : 0;
  const gaugeVal3 = activeLevel === 3 ? config.targetP3 : 0;

  const lastActionTimes = {
    1: '21-10-2026 14:15:20',
    2: '21-10-2026 14:02:15',
    3: '21-10-2026 13:45:00',
    4: '21-10-2026 13:30:00',
  };

  const currentPressureIn = station.pressureIn;
  const currentPressureOut =
    activeLevel === 0 ? 0.0 : activeLevel === 1 ? station.pressureOut : activeLevel === 2 ? 20.5 : 25.5;
  const currentDeltaP = Math.abs(currentPressureIn - currentPressureOut);
  const currentFlowRate = activeLevel === 0 ? 0.0 : station.flowRate;
  const currentVelocity = activeLevel === 0 ? 0.0 : 0.8;
  const solarBatteryVoltage = station.batterySolar;
  const loggerBatteryVoltage = station.batteryLogger;

  // LOẠI 1: CHỈ HIỂN THỊ 4 ĐỒNG HỒ (CHỈ ĐƯỢC XEM, MỌI THAO TÁC BẤM ĐỀU VÔ HIỆU)
  if (viewMode === 'gauges_only') {
    return (
      <div className="w-full bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 rounded-[22px] p-3 sm:p-4 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-150 flex flex-col space-y-2.5 sm:space-y-3">
        {/* Compact Station Header */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white truncate">
                Trạm {station.stationId}
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate hidden sm:inline">
                • {station.name}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
              {station.area}
            </span>
          </div>

          {/* Nút duy nhất được bấm: Mở chi tiết trạm */}
          <button
            type="button"
            onClick={() => onSelectStation(station)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-slate-200 dark:hover:text-white transition-all cursor-pointer shrink-0 shadow-2xs group"
          >
            <span>Chi tiết</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 4 Gauges Row ONLY: readOnly = true (Chỉ được xem, bấm không có tác dụng) */}
        <div className="pointer-events-none select-none">
          <PressureLevelControls
            activeLevel={activeLevel}
            gaugeVal1={gaugeVal1}
            gaugeVal2={gaugeVal2}
            gaugeVal3={gaugeVal3}
            lastActionTimes={lastActionTimes}
            readOnly={true}
          />
        </div>
      </div>
    );
  }

  // LOẠI 2: DẠNG HIỂN THỊ ĐẦY ĐỦ (CHỈ ĐƯỢC XEM, THAO TÁC CẦN BẤM VÀO CHI TIẾT)
  return (
    <div className="w-full bg-white dark:bg-[#13161F] border border-slate-200/90 dark:border-slate-800/90 rounded-[24px] p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4 transition-colors">
      {/* 1. Header Trạm: Nút quay lại/cài đặt chuyển hướng vào trang chi tiết */}
      <PressureControlHeader
        stationName={stationMeta.name}
        stationId={stationMeta.stationId}
        version={stationMeta.version}
        ratio0={config.ratio0}
        ratio90={config.ratio90}
        isSettingsOpen={false}
        onToggleSettings={() => onSelectStation(station)}
        onBack={() => onSelectStation(station)}
        showBackButton={false}
        rtcTime={rtcTime}
      />

      {/* 2. Hàng 4 đồng hồ mức áp: readOnly = true */}
      <div className="pointer-events-none select-none">
        <PressureLevelControls
          activeLevel={activeLevel}
          gaugeVal1={gaugeVal1}
          gaugeVal2={gaugeVal2}
          gaugeVal3={gaugeVal3}
          lastActionTimes={lastActionTimes}
          readOnly={true}
        />
      </div>

      {/* 3. Bảng đầy đủ các nhóm cảm biến đo đạc (View-only) */}
      <div className="pointer-events-none select-none">
        <PressureTelemetryGrid
          currentFlowRate={currentFlowRate}
          currentVelocity={currentVelocity}
          currentPressureIn={currentPressureIn}
          currentPressureOut={currentPressureOut}
          currentDeltaP={currentDeltaP}
          rtcTime={rtcTime}
          solarBatteryVoltage={solarBatteryVoltage}
          loggerBatteryVoltage={loggerBatteryVoltage}
        />
      </div>

      {/* Nút hành động dẫn vào chi tiết để thao tác */}
      <div className="flex justify-end pt-0.5">
        <button
          type="button"
          onClick={() => onSelectStation(station)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-colors cursor-pointer"
        >
          <span>Vào chi tiết</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
});
