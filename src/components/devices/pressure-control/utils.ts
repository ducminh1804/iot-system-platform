import {
  PressureStationConfig,
  SolarBatteryConfig,
  LoggerBatteryConfig,
  PulseMeterConfig,
  SensorCalibrationConfig,
  FlowAlarmConfig,
  AnomalyAlarmConfig,
  ControlMechanismConfig,
  PrvTimerConfig,
  OutputPressureConfig,
  ControlModeId,
  ModbusMeterConfig,
  ModbusBrandId,
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
  netFlowTotal: 20,
  forwardFlow: 60,
  reserveFlow: 40,
  forwardPulses: 600,
  reversePulses: 400,
};

export const DEFAULT_SENSOR_CALIBRATION_CONFIG: SensorCalibrationConfig = {
  rangeMin: 0,
  rangeMax: 100,
  unit: 'mH₂O',
  level0: {
    value: 0.0,
    enabled: true,
  },
  level1: {
    value: 35.0,
    enabled: true,
  },
  level2: {
    value: 70.0,
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

export const DEFAULT_PRV_TIMER_CONFIG: PrvTimerConfig = {
  enabled: false,
  targetHour: 22,
  targetMinute: 0,
  action: 'shutoff',
};

export const DEFAULT_OUTPUT_PRESSURE_CONFIG: OutputPressureConfig = {
  p1: 27.8,
  p2: 50.0,
  pFull: 100.0,
};

export const DEFAULT_CONTROL_MECHANISM_CONFIG: ControlMechanismConfig = {
  activeMode: 'schedule_rtc',
  activeModes: ['schedule_rtc'],
  prvTimer: DEFAULT_PRV_TIMER_CONFIG,
  outputPressure: DEFAULT_OUTPUT_PRESSURE_CONFIG,
  schedules: [
    {
      id: 1,
      label: 'Giai đoạn 1',
      startHour: 5,
      startMinute: 0,
      endHour: 8,
      endMinute: 0,
      targetPressure: 28.5,
      enabled: true,
    },
    {
      id: 2,
      label: 'Giai đoạn 2',
      startHour: 8,
      startMinute: 0,
      endHour: 11,
      endMinute: 0,
      targetPressure: 24.0,
      enabled: true,
    },
    {
      id: 3,
      label: 'Giai đoạn 3',
      startHour: 11,
      startMinute: 0,
      endHour: 17,
      endMinute: 0,
      targetPressure: 22.0,
      enabled: true,
    },
    {
      id: 4,
      label: 'Giai đoạn 4',
      startHour: 17,
      startMinute: 0,
      endHour: 22,
      endMinute: 0,
      targetPressure: 32.0,
      enabled: true,
    },
    {
      id: 5,
      label: 'Giai đoạn 5',
      startHour: 22,
      startMinute: 0,
      endHour: 5,
      endMinute: 0,
      targetPressure: 18.0,
      enabled: true,
    },
  ],
  lowerThreshold: {
    value: 15.0,
    triggerScope: 'all_time',
    startHour: 5,
    startMinute: 0,
    endHour: 8,
    endMinute: 0,
    useCycles: true,
    cycleCount: 1,
    cycleMinutes: 5,
  },
  upperThreshold: {
    value: 45.0,
    triggerScope: 'all_time',
    startHour: 17,
    startMinute: 0,
    endHour: 22,
    endMinute: 0,
    useCycles: true,
    cycleCount: 1,
    cycleMinutes: 5,
  },
};

export interface ModbusBrandPreset {
  id: ModbusBrandId;
  name: string;
  model: string;
  config: Omit<ModbusMeterConfig, 'enabled'>;
}

export const MODBUS_BRAND_PRESETS: ModbusBrandPreset[] = [
  {
    id: 'abb',
    name: 'ABB',
    model: 'AquaMaster 4 / WaterMaster',
    config: {
      brand: 'abb',
      model: 'AquaMaster 4',
      slaveId: 1,
      baudRate: 9600,
      parity: 'even',
      dataBits: 8,
      stopBits: 1,
      byteOrder: 'CDAB',
      functionCode: 3,
      pollIntervalSeconds: 15,
      flowRate: { address: 40001, dataType: 'float32', multiplier: 1, unit: 'm³/h' },
      forwardTotal: { address: 40003, dataType: 'float32', multiplier: 1, unit: 'm³' },
      reverseTotal: { address: 40005, dataType: 'float32', multiplier: 1, unit: 'm³' },
      pressure: { address: 40007, dataType: 'float32', multiplier: 1, unit: 'mH₂O', enabled: false },
    },
  },
  {
    id: 'siemens',
    name: 'Siemens',
    model: 'SITRANS F M MAG 8000',
    config: {
      brand: 'siemens',
      model: 'MAG 8000',
      slaveId: 1,
      baudRate: 9600,
      parity: 'none',
      dataBits: 8,
      stopBits: 1,
      byteOrder: 'ABCD',
      functionCode: 3,
      pollIntervalSeconds: 15,
      flowRate: { address: 30001, dataType: 'float32', multiplier: 1, unit: 'm³/h' },
      forwardTotal: { address: 30003, dataType: 'float32', multiplier: 1, unit: 'm³' },
      reverseTotal: { address: 30005, dataType: 'float32', multiplier: 1, unit: 'm³' },
      pressure: { address: 30007, dataType: 'float32', multiplier: 1, unit: 'mH₂O', enabled: false },
    },
  },
  {
    id: 'krohne',
    name: 'Krohne',
    model: 'WATERFLUX 3070 / OPTIFLUX',
    config: {
      brand: 'krohne',
      model: 'WATERFLUX 3070',
      slaveId: 1,
      baudRate: 19200,
      parity: 'even',
      dataBits: 8,
      stopBits: 1,
      byteOrder: 'CDAB',
      functionCode: 3,
      pollIntervalSeconds: 15,
      flowRate: { address: 40001, dataType: 'float32', multiplier: 1, unit: 'm³/h' },
      forwardTotal: { address: 40005, dataType: 'float32', multiplier: 1, unit: 'm³' },
      reverseTotal: { address: 40009, dataType: 'float32', multiplier: 1, unit: 'm³' },
      pressure: { address: 40013, dataType: 'float32', multiplier: 1, unit: 'mH₂O', enabled: false },
    },
  },
  {
    id: 'endress_hauser',
    name: 'Endress+Hauser',
    model: 'Proline Promag W 400 / 800',
    config: {
      brand: 'endress_hauser',
      model: 'Promag W 400',
      slaveId: 1,
      baudRate: 9600,
      parity: 'even',
      dataBits: 8,
      stopBits: 1,
      byteOrder: 'ABCD',
      functionCode: 3,
      pollIntervalSeconds: 15,
      flowRate: { address: 42007, dataType: 'float32', multiplier: 1, unit: 'm³/h' },
      forwardTotal: { address: 42011, dataType: 'float32', multiplier: 1, unit: 'm³' },
      reverseTotal: { address: 42015, dataType: 'float32', multiplier: 1, unit: 'm³' },
      pressure: { address: 42019, dataType: 'float32', multiplier: 1, unit: 'mH₂O', enabled: false },
    },
  },
  {
    id: 'sensus',
    name: 'Sensus',
    model: 'MeiStream / PolluFlow',
    config: {
      brand: 'sensus',
      model: 'MeiStream',
      slaveId: 1,
      baudRate: 9600,
      parity: 'none',
      dataBits: 8,
      stopBits: 1,
      byteOrder: 'CDAB',
      functionCode: 3,
      pollIntervalSeconds: 15,
      flowRate: { address: 40001, dataType: 'float32', multiplier: 1, unit: 'm³/h' },
      forwardTotal: { address: 40003, dataType: 'float32', multiplier: 1, unit: 'm³' },
      reverseTotal: { address: 40005, dataType: 'float32', multiplier: 1, unit: 'm³' },
      pressure: { address: 40007, dataType: 'float32', multiplier: 1, unit: 'mH₂O', enabled: false },
    },
  },
  {
    id: 'custom',
    name: 'Thiết bị mới (Tùy chỉnh)',
    model: 'Custom Modbus Device',
    config: {
      brand: 'custom',
      customDeviceName: 'Đồng hồ điện từ mới',
      model: 'Tùy chỉnh',
      slaveId: 1,
      baudRate: 9600,
      parity: 'none',
      dataBits: 8,
      stopBits: 1,
      byteOrder: 'CDAB',
      functionCode: 3,
      pollIntervalSeconds: 10,
      flowRate: { address: 40001, dataType: 'float32', multiplier: 1, unit: 'm³/h' },
      forwardTotal: { address: 40003, dataType: 'float32', multiplier: 1, unit: 'm³' },
      reverseTotal: { address: 40005, dataType: 'float32', multiplier: 1, unit: 'm³' },
      pressure: { address: 40007, dataType: 'float32', multiplier: 1, unit: 'mH₂O', enabled: false },
    },
  },
];

export const DEFAULT_MODBUS_METER_CONFIG: ModbusMeterConfig = {
  enabled: true,
  ...MODBUS_BRAND_PRESETS[0].config,
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
  controlMechanism: DEFAULT_CONTROL_MECHANISM_CONFIG,
  solarBattery: DEFAULT_SOLAR_BATTERY_CONFIG,
  loggerBattery: DEFAULT_LOGGER_BATTERY_CONFIG,
  pulseMeter: DEFAULT_PULSE_METER_CONFIG,
  sensorCalibration: DEFAULT_SENSOR_CALIBRATION_CONFIG,
  flowAlarm: DEFAULT_FLOW_ALARM_CONFIG,
  anomalyAlarm: DEFAULT_ANOMALY_ALARM_CONFIG,
  modbusMeter: DEFAULT_MODBUS_METER_CONFIG,
};

/**
 * Kiểm tra các chế độ đang chạy bị xung đột với chế độ người dùng muốn bật.
 * NGUYÊN TẮC AN TOÀN: Hệ thống KHÔNG tự ý ngắt chế độ đang chạy mà trả về danh sách
 * các chế độ đang xung đột để cảnh báo người dùng tự thao tác ngắt trước:
 * - Thủ công (manual): Xung đột với mọi chế độ khác đang bật.
 * - Thời gian thực (schedule_rtc): Xung đột với thủ công, prv, áp lực cuối nguồn (cho phép chạy cùng áp lực đầu vào).
 * - Ưu tiên áp suất đầu vào (input_pressure_priority): Xung đột với thủ công, prv, áp lực cuối nguồn (cho phép chạy cùng thời gian thực).
 * - Điều khiển theo áp lực cuối nguồn (output_pressure_control): Xung đột với mọi chế độ khác.
 * - Điều khiển đóng mở van PRV (prv_timer): Xung đột với mọi chế độ khác.
 */
export function getConflictingModes(
  targetMode: ControlModeId,
  currentActiveModes: ControlModeId[] = []
): ControlModeId[] {
  switch (targetMode) {
    case 'manual':
      return currentActiveModes.filter((m) => m !== 'manual');

    case 'schedule_rtc':
      return currentActiveModes.filter(
        (m) => m !== 'schedule_rtc' && m !== 'input_pressure_priority'
      );

    case 'input_pressure_priority':
      return currentActiveModes.filter(
        (m) => m !== 'input_pressure_priority' && m !== 'schedule_rtc'
      );

    case 'output_pressure_control':
      return currentActiveModes.filter((m) => m !== 'output_pressure_control');

    case 'prv_timer':
      return currentActiveModes.filter((m) => m !== 'prv_timer');

    default:
      return [];
  }
}

/**
 * Xử lý ma trận kích hoạt chế độ điều khiển:
 * - Thủ công (manual): Tắt toàn bộ các chế độ còn lại.
 * - Thời gian thực (schedule_rtc): Tắt thủ công, tắt prv, tắt áp lực cuối nguồn; áp lực đầu vào vẫn cho phép chạy song song.
 * - Ưu tiên áp suất đầu vào (input_pressure_priority): Tắt thủ công, tắt prv, tắt áp lực cuối nguồn; thời gian thực vẫn giữ nguyên nếu đang bật.
 * - Điều khiển đóng mở van PRV (prv_timer): Tắt hết tất cả các chế độ khác.
 * - Điều khiển theo áp lực cuối nguồn (output_pressure_control): Tắt hết tất cả các chế độ khác.
 */
export function resolveActivatedModes(
  targetMode: ControlModeId,
  currentActiveModes: ControlModeId[] = []
): ControlModeId[] {
  switch (targetMode) {
    case 'manual':
      return ['manual'];

    case 'schedule_rtc':
      if (currentActiveModes.includes('input_pressure_priority')) {
        return ['schedule_rtc', 'input_pressure_priority'];
      }
      return ['schedule_rtc'];

    case 'input_pressure_priority':
      if (currentActiveModes.includes('schedule_rtc')) {
        return ['schedule_rtc', 'input_pressure_priority'];
      }
      return ['input_pressure_priority'];

    case 'prv_timer':
      return ['prv_timer'];

    case 'output_pressure_control':
      return ['output_pressure_control'];

    default:
      return [targetMode];
  }
}

/**
 * Xử lý khi hủy kích hoạt một chế độ điều khiển:
 * - Nếu không còn chế độ tự động nào đang bật, hệ thống tự động rơi về Thủ công ('manual').
 */
export function resolveDeactivatedModes(
  targetMode: ControlModeId,
  currentActiveModes: ControlModeId[] = []
): ControlModeId[] {
  const remaining = currentActiveModes.filter((m) => m !== targetMode);
  if (remaining.length === 0) {
    return ['manual'];
  }
  return remaining;
}
