import {
  PressureStationConfig,
  SolarBatteryConfig,
  LoggerBatteryConfig,
  PulseMeterConfig,
} from './types';

/**
 * Định dạng số theo chuẩn Việt Nam:
 * - Hàng nghìn phân tách bằng dấu chấm (.)
 * - Số thập phân phân tách bằng dấu phẩy (,)
 * Ví dụ: 1653377.3 -> "1.653.377,3", 12.46 -> "12,46"
 */
export function formatVNNumber(
  val: number | string,
  fractionDigits: number = 1
): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return String(val);

  const fixed = num.toFixed(fractionDigits);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return decPart !== undefined ? `${formattedInt},${decPart}` : formattedInt;
}

export const DEFAULT_SOLAR_BATTERY_CONFIG: SolarBatteryConfig = {
  enabled: true,
  chemistry: 'lifepo4',
  nominalVoltage: 12.8,
  capacityAh: 20.0,
  triggerThresholdPercent: 25,
  voltageFull: 14.4,
  voltageCutoff: 10.8,
  averageLoadWatts: 3.5,
};

export const DEFAULT_LOGGER_BATTERY_CONFIG: LoggerBatteryConfig = {
  enabled: true,
  notifyServer: true,
  serverProtocol: 'mqtt',
  serverEndpoint: 'iot/station/1015/alarm/battery',
  alertRepeatMinutes: 30,
};

export const DEFAULT_PULSE_METER_CONFIG: PulseMeterConfig = {
  pulsesPerUnit: 10,
  pulseUnit: 'liter_per_pulse',
  flowRateUnit: 'm3_h',
  netFlowTotal: 1653377.3,
  forwardFlow: 1653381.6,
  reserveFlow: 4.3,
  debounceFilterMs: 20,
  cutoffMinFlowRate: 0.05,
};

export const DEFAULT_PRESSURE_CONFIG: PressureStationConfig = {
  targetP1: 27.8,
  targetP2: 50.0,
  targetP3: 100.0,
  ratio0: '1.5',
  ratio90: '1.0',
  reportInterval: '10s',
  modbusId: 1,
  baudRate: '9600',
  alarmPInHigh: 35.0,
  alarmPInLow: 10.0,
  alarmPOutHigh: 30.0,
  alarmDeltaP: 15.0,
  autoShutoff: true,
  rtcAutoSync: true,
  lowBattery: 11.5,
  solarBattery: DEFAULT_SOLAR_BATTERY_CONFIG,
  loggerBattery: DEFAULT_LOGGER_BATTERY_CONFIG,
  pulseMeter: DEFAULT_PULSE_METER_CONFIG,
};
