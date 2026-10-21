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
}

export type ActivePressureLevel = 0 | 1 | 2 | 3;
// 0: Đóng nước | 1: Mức áp 1 | 2: Mức áp 2 | 3: Mở full
