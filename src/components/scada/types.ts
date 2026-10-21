export interface ScadaUnit {
  id: string;
  name: string; // e.g. "Unit 01"
  park: string; // e.g. "Park 02"
  model: string; // e.g. "NEG Micon NM-600/200"
  country: 'China' | 'USA' | 'Germany';
  region: string; // e.g. "Shicheng", "Jiuguan", "Boxberg", "Shonwald"
  status: 'ok' | 'service' | 'alarm' | 'warning' | 'caution' | 'standby' | 'error';
  statusCode: number; // 0, 512, 1, 5
  statusMessage: string; // "0 - System state OK", "512 - error", etc.
  timestamp: string; // "24.06.18: 12:35:01"
  powerKw: number; // e.g. 794.2
  maxPowerKw: number; // e.g. 1000
  windSpeedMs: number; // e.g. 9.90
  maxWindSpeedMs: number; // e.g. 25
  productivityKwh: number; // e.g. 11547.2
  maxProductivityKwh: number; // e.g. 15000
  uptimeDays: number;
  uptimeHours: number;
  uptimeMins: number;
  rotorSpeedRpm: number; // 15.9
  outdoorTempC: number; // 32
  windDirectionDeg: number; // 280
  nacelleDirectionDeg: number; // 281.1
  dailyProducedKwh: number; // 232
  monthlyProducedKwh: number; // 45838.2
  totalProducedKwh: number; // 190605836
  operatingHours: number; // 26572
  serviceThisYearHours: number; // 25.6
  turbineType: string; // "WT 7-Fifty"
  ratedPowerKw: number; // 3500.0
  hydraulicValveLevel: 1 | 2 | 3;
}

export type ScadaMainTab = 'overview' | 'device' | 'alarms' | 'historical' | 'control' | 'predict' | 'analyze' | 'report' | 'configure';
export type ScadaWorkspaceView = 'map' | 'park' | 'dashboard' | 'turbine';
export type TurbineSubTab = 'monitor' | 'alarms' | 'service' | 'remote';

export type ScadaDeviceSubTab = 'monitor' | 'settings' | 'history' | 'logs';
export type ScadaAlarmsSubTab = 'all' | 'critical' | 'warning' | 'history';
export type ScadaHistoricalSubTab = 'trends' | 'compare' | 'raw';
export type ScadaControlSubTab = 'valves' | 'schedule' | 'estop';

