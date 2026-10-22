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
  pulsesPerUnit: number; // Hệ số xung (VD: 10 L/xung hoặc 100 xung/m3)
  pulseUnit: PulseUnitType; // Đơn vị hệ số xung
  flowRateUnit: 'm3_h' | 'l_s'; // Đơn vị lưu lượng
  netFlowTotal: number; // Tổng lưu lượng tích lũy Net (m³)
  forwardFlow: number; // Tổng lưu lượng chiều thuận (m³)
  reserveFlow: number; // Tổng lưu lượng chiều nghịch (m³)
  debounceFilterMs?: number; // Lọc dội xung (ms)
  cutoffMinFlowRate?: number; // Lưu lượng cắt điểm 0 (m³/h)
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
  solarBattery?: SolarBatteryConfig;
  loggerBattery?: LoggerBatteryConfig;
  pulseMeter?: PulseMeterConfig;
}

export type ActivePressureLevel = 0 | 1 | 2 | 3;
// 0: Đóng nước | 1: Mức áp 1 | 2: Mức áp 2 | 3: Mở full
