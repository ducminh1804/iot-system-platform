import React from 'react';
import {
  PressureStationConfig,
  SolarBatteryConfig,
  LoggerBatteryConfig,
} from '../types';
import {
  DEFAULT_SOLAR_BATTERY_CONFIG,
  DEFAULT_LOGGER_BATTERY_CONFIG,
} from '../utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SolarBatteryCard } from './alarms/SolarBatteryCard';
import { LoggerBatteryCard } from './alarms/LoggerBatteryCard';

interface AlarmsTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
  /** Điện áp đo thực tế từ trạm (V) */
  currentSolarVoltage?: number;
  currentLoggerVoltage?: number;
}

export function AlarmsTab({
  config,
  onChangeConfig,
  currentSolarVoltage = 12.46,
  currentLoggerVoltage = 3.60,
}: AlarmsTabProps) {
  const solar: SolarBatteryConfig = config.solarBattery ?? DEFAULT_SOLAR_BATTERY_CONFIG;
  const logger: LoggerBatteryConfig = config.loggerBattery ?? DEFAULT_LOGGER_BATTERY_CONFIG;

  const updateSolar = (patch: Partial<SolarBatteryConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      solarBattery: {
        ...(prev.solarBattery ?? DEFAULT_SOLAR_BATTERY_CONFIG),
        ...patch,
      },
    }));
  };

  const updateLogger = (patch: Partial<LoggerBatteryConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      loggerBattery: {
        ...(prev.loggerBattery ?? DEFAULT_LOGGER_BATTERY_CONFIG),
        ...patch,
      },
    }));
  };

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col justify-between gap-6 max-w-5xl mx-auto w-full py-1">
        {/* Lưới 2 khối: Pin Solar (Trái) & Pin Logger (Phải) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 1: Nguồn Pin Solar (Nguồn chính trạm) */}
          <SolarBatteryCard
            solar={solar}
            currentSolarVoltage={currentSolarVoltage}
            onUpdateSolar={updateSolar}
          />

          {/* Card 2: Nguồn Pin Logger (Chuẩn NSX & Cảnh báo về Server) */}
          <LoggerBatteryCard
            logger={logger}
            currentLoggerVoltage={currentLoggerVoltage}
            onUpdateLogger={updateLogger}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
