import React from 'react';
import { Plus, Minus, Crosshair } from 'lucide-react';
import { toast } from 'sonner';
import { PressureStationConfig, SensorCalibrationConfig, CalibrationLevelConfig } from '../types';
import { DEFAULT_SENSOR_CALIBRATION_CONFIG } from '../utils';
import { Switch } from '@/components/ui/switch';

interface SensorCalibrationTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
  currentPressureIn?: number;
  currentPressureOut?: number;
}

type LevelKey = 'level0' | 'level1' | 'level2';

const UNITS = ['bar', 'mH₂O', 'psi'] as const;

const LEVELS: { key: LevelKey; label: string; index: number }[] = [
  { key: 'level0', label: 'Mức áp 0', index: 0 },
  { key: 'level1', label: 'Mức áp 1 *', index: 1 },
  { key: 'level2', label: 'Mức áp 2', index: 2 },
];

const round1 = (n: number) => Math.round(n * 10) / 10;

export function SensorCalibrationTab({
  config,
  onChangeConfig,
  currentPressureIn,
  currentPressureOut,
}: SensorCalibrationTabProps) {
  const calib: SensorCalibrationConfig =
    config.sensorCalibration ?? DEFAULT_SENSOR_CALIBRATION_CONFIG;
  const level2On = calib.level2.enabled ?? false;

  const updateCalib = (patch: Partial<SensorCalibrationConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      sensorCalibration: {
        ...(prev.sensorCalibration ?? DEFAULT_SENSOR_CALIBRATION_CONFIG),
        ...patch,
      },
    }));
  };

  const updateLevel = (key: LevelKey, patch: Partial<CalibrationLevelConfig>) => {
    onChangeConfig((prev) => {
      const cur = prev.sensorCalibration ?? DEFAULT_SENSOR_CALIBRATION_CONFIG;
      return {
        ...prev,
        sensorCalibration: { ...cur, [key]: { ...cur[key], ...patch } },
      };
    });
  };

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const setLevelValue = (key: LevelKey, v: number) => {
    if (isNaN(v)) return;
    updateLevel(key, { value: round1(clamp(v)) });
  };

  const handleApplyLive = (key: LevelKey) => {
    const live = currentPressureIn ?? currentPressureOut;
    if (live === undefined) {
      toast.warning('Chưa có tín hiệu áp suất');
      return;
    }
    const converted = calib.unit === 'bar' ? live / 10 : live;
    setLevelValue(key, converted);
  };

  const stepBtn =
    'w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all';

  return (
    <div className="flex-1 flex flex-col gap-4 max-w-5xl mx-auto w-full py-1">
      {/* Bộ chọn đơn vị đo */}
      <div className="flex items-center justify-end">
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
          {UNITS.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => updateCalib({ unit: u })}
              className={`px-3 h-8 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                calib.unit === u
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* 3 mức áp */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LEVELS.map(({ key, label }) => {
          const lv = calib[key];
          const disabled = key === 'level2' && !level2On;

          return (
            <div
              key={key}
              className={`rounded-2xl border bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs transition-opacity ${
                disabled
                  ? 'border-dashed border-slate-200 dark:border-slate-800 opacity-60'
                  : 'border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between h-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{label}</h4>
                {key === 'level2' && (
                  <Switch
                    checked={level2On}
                    onCheckedChange={(c) => updateLevel('level2', { enabled: c })}
                    aria-label="Bật mức áp 2"
                  />
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setLevelValue(key, lv.value - 0.1)}
                  aria-label={`Giảm ${label}`}
                  className={stepBtn}
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex-1 min-w-0 h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0C0F17] flex items-baseline justify-center gap-1.5 px-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    disabled={disabled}
                    value={lv.value}
                    onChange={(e) => setLevelValue(key, parseFloat(e.target.value))}
                    className="w-full min-w-0 self-center text-center font-mono font-extrabold text-2xl text-slate-900 dark:text-white bg-transparent outline-none"
                  />
                  <span className="self-center text-xs font-mono font-semibold text-slate-400 shrink-0">
                    {calib.unit}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => setLevelValue(key, lv.value + 0.1)}
                  aria-label={`Tăng ${label}`}
                  className={stepBtn}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => handleApplyLive(key)}
                className="mt-3 w-full h-10 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
              >
                <Crosshair className="w-3.5 h-3.5" />
                Lấy áp thực tế
              </button>
            </div>
          );
        })}
      </section>
    </div>
  );
}
