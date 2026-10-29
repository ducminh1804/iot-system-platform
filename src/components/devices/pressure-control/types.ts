export interface StationMetaInfo {
  name: string;
  stationId: string;
  version: string;
}

export type BatteryChemistry = 'lifepo4' | 'lead_acid' | 'gel' | 'li_ion';
export type LoggerBatteryType = 'lisocl2_36' | 'lisocl2_72' | 'alkaline_6';

export interface SolarBatteryConfig {
  enabled: boolean;
  chemistry: BatteryChemistry;
  nominalVoltage: number; // V (12V, 24V, 3.2V, 3.7V)
  capacityAh: number; // Dung lượng danh định Ah
  triggerThresholdPercent: number; // % ngưỡng kích hoạt cảnh báo
  voltageFull: number; // Điện áp đầy (V)
  voltageCutoff: number; // Điện áp cạn (V)
  averageLoadWatts: number; // Công suất tiêu thụ trung bình trạm (W)
}

export type ServerAlertProtocol = 'mqtt' | 'http' | 'scada';

export interface LoggerBatteryConfig {
  enabled: boolean; // Bật/tắt giám sát cảnh báo pin logger theo chuẩn NSX
  notifyServer: boolean; // Cảnh báo về server
  serverProtocol?: ServerAlertProtocol; // Giao thức truyền tin cảnh báo
  serverEndpoint?: string; // Topic MQTT / Webhook URL / Endpoint
  alertRepeatMinutes?: number; // Chu kỳ gửi nhắc lại cảnh báo (phút)
}

export type PulseUnitType = 'liter_per_pulse' | 'pulse_per_m3' | 'm3_per_pulse';

export interface PulseMeterConfig {
  pulsesPerUnit: number; // Pulses per unit volume (p/m³)
  pulseUnit?: PulseUnitType; // Đơn vị hệ số xung
  flowRate?: number; // Flow Rate (m³/h)
  flowRateUnit?: 'm3_h' | 'l_s'; // Đơn vị lưu lượng
  netFlowTotal?: number; // Net Flow Total (m³)
  forwardFlow: number; // Forward Total (m³)
  reserveFlow: number; // Reverse Total (m³)
  forwardPulses?: number; // Forward Pulses (pulses)
  reversePulses?: number; // Reverse Pulses (pulses)
  debounceFilterMs?: number; // Lọc dội xung (ms)
  cutoffMinFlowRate?: number; // Lưu lượng cắt điểm 0 (m³/h)
}

export interface CalibrationLevelConfig {
  value: number; // Giá trị áp suất (bar)
  enabled?: boolean; // Cho mức áp 2 tùy chọn
  rawAdc?: number; // ADC thô / mV nếu cần
}

export interface SensorCalibrationConfig {
  rangeMin: number; // Min dải đo (VD: 0)
  rangeMax: number; // Max dải đo (VD: 10)
  unit: string; // 'bar' | 'mH2O' | 'psi'
  level0: CalibrationLevelConfig; // Mức áp 0
  level1: CalibrationLevelConfig; // Mức áp 1 (Bắt buộc)
  level2: CalibrationLevelConfig; // Mức áp 2 (Tùy chọn)
}

export interface FlowAlarmConfig {
  highFlowEnabled: boolean; // Cảnh báo lưu lượng cao (vỡ ống)
  highFlowThreshold: number; // Ngưỡng cao (m³/h)
  highFlowDelaySeconds: number; // Thời gian trễ (giây)
  autoShutoffOnHighFlow: boolean; // Tự động đóng van khi vỡ ống

  lowFlowEnabled: boolean; // Cảnh báo lưu lượng thấp
  lowFlowThreshold: number; // Ngưỡng thấp (m³/h)
  lowFlowDelaySeconds: number; // Thời gian trễ (giây)

  reverseFlowEnabled: boolean; // Cảnh báo dòng chảy ngược
  reverseFlowThreshold: number; // Ngưỡng chảy ngược (m³/h)

  nightLeakageEnabled: boolean; // Cảnh báo rò rỉ đêm (MNF)
  nightStartHour: number; // Giờ bắt đầu (0-23)
  nightEndHour: number; // Giờ kết thúc (0-23)
  nightFlowThreshold: number; // Ngưỡng rò rỉ đêm (m³/h)

  notifyServer: boolean; // Gửi cảnh báo về server
  serverProtocol?: ServerAlertProtocol; // mqtt | http | scada
  alertRepeatMinutes: number; // Chu kỳ nhắc lại (phút)
}

export interface AnomalyAlarmConfig {
  enabled: boolean; // Bật/tắt cảnh báo bất thường
  globalApply: boolean; // Nút gạt áp dụng chung cho tất cả thiết bị
  learningDaysRequired: number; // Mặc định 7 ngày thu thập dữ liệu
  learningDaysCompleted: number; // Tiến độ học thực tế (0 - 7 ngày)
  flowDeviationPercent: number; // % sai lệch lưu lượng so với data quá khứ (VD: 25%)
  pressureDeviationPercent: number; // % sai lệch áp suất so với data quá khứ (VD: 20%)
  ignoreDays: number[]; // Các ngày không quan sát dữ liệu (0: CN, 1: T2, ..., 6: T7)
  lastResetTime?: string; // Thời điểm reset gần nhất
}

export type ControlModeId = 'schedule_rtc' | 'input_pressure_priority';

export interface ScheduleSlot {
  id: number;
  label: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  targetPressure: number;
  enabled: boolean;
}

export interface ThresholdConfig {
  value: number;
  triggerScope: 'all_time' | 'custom_window';
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  useCycles: boolean;
  cycleCount: number;
  cycleMinutes: number;
}

export interface ControlMechanismConfig {
  activeMode: ControlModeId;
  schedules: ScheduleSlot[];
  lowerThreshold: ThresholdConfig;
  upperThreshold: ThresholdConfig;
}

export interface PressureStationConfig {
  targetP1: number;
  targetP2: number;
  targetP3: number;
  ratio0: string;
  ratio90: string;
  reportInterval: string;
  modbusId: number;
  baudRate: string;
  alarmPInHigh: number;
  alarmPInLow: number;
  alarmPOutHigh: number;
  alarmDeltaP: number;
  autoShutoff: boolean;
  rtcAutoSync: boolean;
  lowBattery: number;
  controlMechanism?: ControlMechanismConfig;
  solarBattery?: SolarBatteryConfig;
  loggerBattery?: LoggerBatteryConfig;
  pulseMeter?: PulseMeterConfig;
  sensorCalibration?: SensorCalibrationConfig;
  flowAlarm?: FlowAlarmConfig;
  anomalyAlarm?: AnomalyAlarmConfig;
}

export type ActivePressureLevel = 0 | 1 | 2 | 3;
// 0: Đóng nước | 1: Mức áp 1 | 2: Mức áp 2 | 3: Mở full
