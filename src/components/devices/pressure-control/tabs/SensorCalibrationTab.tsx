import React from 'react';
import { RotateCcw, Save, Plus, Minus, Crosshair } from 'lucide-react';
import { Slider as SliderPrimitive } from 'radix-ui';
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
  onSave,
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

  const clamp = (v: number) => Math.max(calib.rangeMin, Math.min(calib.rangeMax, v));

  const setLevelValue = (key: LevelKey, v: number) => {
    if (isNaN(v)) return;
    updateLevel(key, { value: round1(clamp(v)) });
  };

  const handleSliderChange = (vals: number[]) => {
    onChangeConfig((prev) => {
      const cur = prev.sensorCalibration ?? DEFAULT_SENSOR_CALIBRATION_CONFIG;
      return {
        ...prev,
        sensorCalibration: {
          ...cur,
          level0: { ...cur.level0, value: vals[0] },
          level1: { ...cur.level1, value: vals[1] },
          level2: vals.length > 2 ? { ...cur.level2, value: vals[2] } : cur.level2,
        },
      };
    });
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

  const handleReset = () => {
    onChangeConfig((prev) => ({
      ...prev,
      sensorCalibration: { ...DEFAULT_SENSOR_CALIBRATION_CONFIG },
    }));
    toast.info('Đã khôi phục mặc định');
  };

  const handleSave = () => {
    if (calib.rangeMax <= calib.rangeMin) {
      toast.error('Max phải lớn hơn Min');
      return;
    }
    if (calib.level1.value === undefined || isNaN(calib.level1.value)) {
      toast.error('Mức áp 1 là bắt buộc');
      return;
    }
    if (onSave) onSave();
    else toast.success('Đã lưu calib cảm biến');
  };

  const sliderValues = level2On
    ? [calib.level0.value, calib.level1.value, calib.level2.value]
    : [calib.level0.value, calib.level1.value];

  const span = calib.rangeMax - calib.rangeMin;
  const ticks = Array.from({ length: 6 }, (_, i) => calib.rangeMin + (span * i) / 5);

  const stepBtn =
    'w-11 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all';

  return (
    <div className="flex-1 flex flex-col gap-5 max-w-5xl mx-auto w-full py-1">
      {/* Dải đo */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Dải đo cảm biến
          </h3>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={calib.rangeMin}
                onChange={(e) => updateCalib({ rangeMin: parseFloat(e.target.value) || 0 })}
                aria-label="Min"
                className="w-16 h-10 text-center font-mono font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0C0F17] text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-slate-300 dark:text-slate-600">—</span>
              <input
                type="number"
                inputMode="decimal"
                value={calib.rangeMax}
                onChange={(e) => updateCalib({ rangeMax: parseFloat(e.target.value) || 0 })}
                aria-label="Max"
                className="w-16 h-10 text-center font-mono font-bold text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0C0F17] text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

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
        </div>

        {/* Track nhiều núm kéo */}
        <div className="mt-12 mb-2 px-3">
          <SliderPrimitive.Root
            value={sliderValues}
            min={calib.rangeMin}
            max={calib.rangeMax}
            step={0.1}
            minStepsBetweenThumbs={0}
            onValueChange={handleSliderChange}
            className="relative flex w-full h-6 items-center touch-none select-none"
          >
            <SliderPrimitive.Track className="relative grow h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <SliderPrimitive.Range className="absolute h-full bg-blue-500/80" />
            </SliderPrimitive.Track>

            {sliderValues.map((v, i) => (
              <SliderPrimitive.Thumb
                key={i}
                aria-label={LEVELS[i].label}
                className="relative block w-7 h-7 rounded-full bg-white dark:bg-[#141824] border-2 border-blue-500 shadow-md outline-none cursor-grab active:cursor-grabbing focus-visible:ring-4 focus-visible:ring-blue-500/25 transition-shadow"
              >
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-mono font-extrabold text-blue-600 dark:text-blue-400">
                  {i}
                </span>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-mono font-bold whitespace-nowrap">
                  {v.toFixed(1)}
                </span>
              </SliderPrimitive.Thumb>
            ))}
          </SliderPrimitive.Root>

          <div className="mt-3 flex justify-between text-[11px] font-mono text-slate-400">
            {ticks.map((t, i) => (
              <span key={i}>{round1(t)}</span>
            ))}
          </div>
        </div>
      </section>

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

      {/* Hành động */}
      <div className="mt-auto pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto h-11 px-5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          Mặc định
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          Lưu
        </button>
      </div>
    </div>
  );
}
