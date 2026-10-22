import {
  PressureStationConfig,
  SolarBatteryConfig,
  LoggerBatteryConfig,
  PulseMeterConfig,
  SensorCalibrationConfig,
  FlowAlarmConfig,
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
  pulseUnit: 'pulse_per_m3',
  flowRate: 5,
  flowRateUnit: 'm3_h',
  netFlowTotal: 100,
  forwardFlow: 60,
  reserveFlow: 40,
};

export const DEFAULT_SENSOR_CALIBRATION_CONFIG: SensorCalibrationConfig = {
  rangeMin: 0,
  rangeMax: 10,
  unit: 'bar',
  level0: {
    value: 0.0,
    enabled: true,
  },
  level1: {
    value: 3.5,
    enabled: true,
  },
  level2: {
    value: 7.0,
    enabled: false,
  },
};

export const DEFAULT_FLOW_ALARM_CONFIG: FlowAlarmConfig = {
  highFlowEnabled: true,
  highFlowThreshold: 80.0,
  highFlowDelaySeconds: 30,
  autoShutoffOnHighFlow: false,

  lowFlowEnabled: true,
  lowFlowThreshold: 2.0,
  lowFlowDelaySeconds: 60,

  reverseFlowEnabled: true,
  reverseFlowThreshold: 0.5,

  nightLeakageEnabled: true,
  nightStartHour: 1,
  nightEndHour: 4,
  nightFlowThreshold: 5.0,

  notifyServer: true,
  serverProtocol: 'mqtt',
  alertRepeatMinutes: 30,
};

export const DEFAULT_ANOMALY_ALARM_CONFIG: AnomalyAlarmConfig = {
  enabled: true,
  globalApply: true,
  learningDaysRequired: 7,
  learningDaysCompleted: 4, // Đang ở ngày thứ 4/7
  flowDeviationPercent: 25, // ±25%
  pressureDeviationPercent: 20, // ±20%
  ignoreDays: [0], // Mặc định không giám sát Chủ Nhật (0)
  lastResetTime: '21-10-2026 08:00',
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
  sensorCalibration: DEFAULT_SENSOR_CALIBRATION_CONFIG,
  flowAlarm: DEFAULT_FLOW_ALARM_CONFIG,
  anomalyAlarm: DEFAULT_ANOMALY_ALARM_CONFIG,
};
