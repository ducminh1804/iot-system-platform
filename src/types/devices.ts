export type DeviceCategoryKey =
  | 'pressureControl'
  | 'dataLogger'
  | 'valveBreaker'
  | 'waterQuality'
  | 'other';

export interface DeviceCategory {
  key: DeviceCategoryKey;
  code: string;
  name: string;
  description: string;
  color: string; // Hex color for borders/accents
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  count: number;
  onlineCount: number;
  avgMetric: string;
  metricLabel: string;
}

export interface IoTDevice {
  id: string;
  code: string;
  name: string;
  category: DeviceCategoryKey;
  location: string;
  ipAddress: string;
  status: 'online' | 'warning' | 'offline';
  primaryValue: string;
  primaryUnit: string;
  secondaryMetric: string;
  signalStrength: number; // 0 - 100%
  batteryLevel?: number; // 0 - 100% or AC power
  lastPing: string;
  firmware: string;
}
