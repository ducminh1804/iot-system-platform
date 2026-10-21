import { PressureStationConfig } from './types';

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
};
