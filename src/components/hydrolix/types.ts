export interface TurbineTelemetry {
  id: string;
  name: string;
  status: 'Active' | 'Standby' | 'Maintenance' | 'Warning';
  energyReceived: number; // percentage, e.g. 86
  rotorControl: string; // 'Pitch Control'
  nacelleOrientation: string; // 'On Wind'
  converterStatus: string; // 'Running'
  warningsCount: number;
  power10m: number; // kW, e.g. 157.2
  totalEnergy: number; // GWh, e.g. 4.2
  
  realtimePower: {
    currentKw: number; // e.g. 332
    capacityPercent: number; // e.g. 36.9
    gaugeValue: string; // "346k W"
    capacityPercentage: number; // 38.4
    gaugeRange: string; // "0 - 1.2MW"
    avgPower10m: number; // 298.6 kW
  };

  weather: {
    hourly: Array<{
      time: string;
      temp: number;
      windSpeed: number;
      condition: 'sunny' | 'cloudy' | 'windy';
    }>;
  };

  temperatures: {
    bearing: number; // 69°C
    ambient: number; // 77°C
    rotor: number; // 33°C
    stator: number; // 29°C
  };

  wind: {
    angleDeg: number; // e.g. 48 deg (NE)
    rotorSpeed: number; // e.g. 12.5 rpm / deg
    windSpeed: number; // e.g. 8.6 m/s
    activePower: number; // e.g. 352 kW
  };

  overview: {
    powerMwh: number; // 44 MWh
    rotorRpm: number; // 18.6 RPM
    capacityUtilization: number; // 36.8%
    operationalHours: number; // 12480 hrs
  };
}

export interface HydrolixOutletContext {
  turbineData: TurbineTelemetry;
  viewportMode: 'camera' | 'model';
  handlePrevTurbine: () => void;
  handleNextTurbine: () => void;
  selectedTurbineId: string;
  handleSelectTurbine: (id: string) => void;
}

export const MOCK_TURBINES: TurbineTelemetry[] = [
  {
    id: 'T-05',
    name: 'Turbine 05',
    status: 'Active',
    energyReceived: 86,
    rotorControl: 'Pitch Control',
    nacelleOrientation: 'On Wind',
    converterStatus: 'Running',
    warningsCount: 1,
    power10m: 157.2,
    totalEnergy: 4.2,
    realtimePower: {
      currentKw: 332,
      capacityPercent: 36.9,
      gaugeValue: '346k W',
      capacityPercentage: 38.4,
      gaugeRange: '0 - 1.2MW',
      avgPower10m: 298.6,
    },
    weather: {
      hourly: [
        { time: 'Now', temp: 31, windSpeed: 6.6, condition: 'sunny' },
        { time: '2:00PM', temp: 32, windSpeed: 8.6, condition: 'sunny' },
        { time: '3:00PM', temp: 34, windSpeed: 2.6, condition: 'sunny' },
        { time: '4:00PM', temp: 33, windSpeed: 3.1, condition: 'sunny' },
      ],
    },
    temperatures: {
      bearing: 69,
      ambient: 77,
      rotor: 33,
      stator: 29,
    },
    wind: {
      angleDeg: 55,
      rotorSpeed: 12.5,
      windSpeed: 8.6,
      activePower: 352,
    },
    overview: {
      powerMwh: 44,
      rotorRpm: 18.6,
      capacityUtilization: 36.8,
      operationalHours: 12480,
    },
  },
  {
    id: 'T-04',
    name: 'Turbine 04',
    status: 'Active',
    energyReceived: 92,
    rotorControl: 'Pitch Control',
    nacelleOrientation: 'On Wind',
    converterStatus: 'Running',
    warningsCount: 0,
    power10m: 182.4,
    totalEnergy: 5.1,
    realtimePower: {
      currentKw: 410,
      capacityPercent: 42.1,
      gaugeValue: '420k W',
      capacityPercentage: 42.8,
      gaugeRange: '0 - 1.2MW',
      avgPower10m: 380.2,
    },
    weather: {
      hourly: [
        { time: 'Now', temp: 31, windSpeed: 7.2, condition: 'sunny' },
        { time: '2:00PM', temp: 32, windSpeed: 9.1, condition: 'sunny' },
        { time: '3:00PM', temp: 33, windSpeed: 4.2, condition: 'sunny' },
        { time: '4:00PM', temp: 32, windSpeed: 3.8, condition: 'sunny' },
      ],
    },
    temperatures: {
      bearing: 64,
      ambient: 75,
      rotor: 31,
      stator: 27,
    },
    wind: {
      angleDeg: 62,
      rotorSpeed: 13.8,
      windSpeed: 9.4,
      activePower: 412,
    },
    overview: {
      powerMwh: 52,
      rotorRpm: 19.4,
      capacityUtilization: 41.2,
      operationalHours: 14120,
    },
  },
];
