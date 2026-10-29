import React from 'react';
import { PressureStationConfig, PulseMeterConfig } from '../types';
import { DEFAULT_PULSE_METER_CONFIG } from '../utils';

interface PulseMeterTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  currentFlowRate?: number;
}

type PulseNumericKey =
  | 'pulsesPerUnit'
  | 'forwardFlow'
  | 'reserveFlow'
  | 'forwardPulses'
  | 'reversePulses';

interface PulseFieldItem {
  key: PulseNumericKey;
  label: string;
  unit: string;
  step: string;
  min: number;
}

const PULSE_FIELDS: PulseFieldItem[] = [
  {
    key: 'pulsesPerUnit',
    label: 'Pulses per unit volume',
    unit: 'p/m³',
    step: '1',
    min: 1,
  },
  {
    key: 'forwardFlow',
    label: 'Forward Total',
    unit: 'm³',
    step: '0.1',
    min: 0,
  },
  {
    key: 'reserveFlow',
    label: 'Reverse Total',
    unit: 'm³',
    step: '0.1',
    min: 0,
  },
  {
    key: 'forwardPulses',
    label: 'Forward Pulses',
    unit: 'pulses',
    step: '1',
    min: 0,
  },
  {
    key: 'reversePulses',
    label: 'Reverse Pulses',
    unit: 'pulses',
    step: '1',
    min: 0,
  },
];

export function PulseMeterTab({
  config,
  onChangeConfig,
}: PulseMeterTabProps) {
  const meter: PulseMeterConfig = config.pulseMeter ?? DEFAULT_PULSE_METER_CONFIG;

  const updateField = (key: PulseNumericKey, value: number) => {
    const clean = Math.max(0, isNaN(value) ? 0 : Number(value.toFixed(2)));
    onChangeConfig((prev) => {
      const curMeter = prev.pulseMeter ?? DEFAULT_PULSE_METER_CONFIG;
      const nextMeter: PulseMeterConfig = {
        ...curMeter,
        [key]: clean,
      };

      // Tự động tính toán netFlowTotal = forwardFlow - reserveFlow
      const fwd = key === 'forwardFlow' ? clean : (nextMeter.forwardFlow ?? 0);
      const rev = key === 'reserveFlow' ? clean : (nextMeter.reserveFlow ?? 0);
      nextMeter.netFlowTotal = Math.max(0, Number((fwd - rev).toFixed(2)));

      return {
        ...prev,
        pulseMeter: nextMeter,
      };
    });
  };

  const handleInputChange = (key: PulseNumericKey, valStr: string) => {
    if (valStr === '') {
      updateField(key, 0);
      return;
    }
    const parsed = parseFloat(valStr);
    updateField(key, parsed);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full py-2">
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
        {PULSE_FIELDS.map((field) => (
          <div
            key={field.key}
            className="flex items-center justify-between p-3.5 sm:px-5 sm:py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors gap-3"
          >
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {field.label}
            </span>

            <div className="flex items-center h-9 sm:h-10 px-3 w-40 sm:w-52 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#10141D] focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 shadow-2xs transition-all shrink-0">
              <input
                type="number"
                step={field.step}
                min={field.min}
                value={meter[field.key] ?? 0}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full text-right font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white bg-transparent outline-none pr-2"
              />
              <span className="text-xs font-mono font-semibold text-slate-400 select-none shrink-0">
                {field.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
