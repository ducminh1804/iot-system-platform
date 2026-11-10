import React from 'react';
import { Gauge, SlidersHorizontal, Maximize2 } from 'lucide-react';
import { OutputPressureConfig } from '../../types';
import { PressureStepperInput } from './PressureStepperInput';

interface DownstreamPressureCardProps {
  config: OutputPressureConfig;
  onChangeConfig: (updater: (prev: OutputPressureConfig) => OutputPressureConfig) => void;
  disabled?: boolean;
  variant?: 'card' | 'embedded';
}

interface LevelItem {
  key: keyof OutputPressureConfig;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
  accentClass: string;
  min: number;
  max: number;
  step: number;
}

const LEVELS: LevelItem[] = [
  {
    key: 'p1',
    label: 'Mức áp 1',
    icon: Gauge,
    iconBgClass: 'bg-blue-500/10 dark:bg-blue-500/15',
    iconColorClass: 'text-blue-500',
    accentClass: 'text-blue-600 dark:text-blue-400',
    min: 0,
    max: 50,
    step: 0.5,
  },
  {
    key: 'p2',
    label: 'Mức áp 2',
    icon: SlidersHorizontal,
    iconBgClass: 'bg-amber-500/10 dark:bg-amber-500/15',
    iconColorClass: 'text-amber-500',
    accentClass: 'text-amber-600 dark:text-amber-400',
    min: 0,
    max: 80,
    step: 0.5,
  },
  {
    key: 'pFull',
    label: 'Mở full',
    icon: Maximize2,
    iconBgClass: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    iconColorClass: 'text-emerald-500',
    accentClass: 'text-emerald-600 dark:text-emerald-400',
    min: 0,
    max: 120,
    step: 0.5,
  },
];

export function DownstreamPressureCard({
  config,
  onChangeConfig,
  disabled = false,
  variant = 'card',
}: DownstreamPressureCardProps) {
  const handleLevelChange = (key: keyof OutputPressureConfig, val: number) => {
    onChangeConfig((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5">
      {LEVELS.map(({ key, label, icon: Icon, iconBgClass, iconColorClass, accentClass, min, max, step }) => {
        const val = config[key];

        return (
          <div
            key={key}
            className={
              variant === 'embedded'
                ? 'rounded-xl border border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0c0f17]/50 p-3.5 sm:p-4 space-y-3 flex flex-col justify-between'
                : 'rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-3.5 sm:p-5 shadow-xs space-y-3.5 flex flex-col justify-between'
            }
          >
            {/* Header: Icon + Tên mức áp */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl ${iconBgClass} ${iconColorClass} flex items-center justify-center shrink-0 border border-current/20`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {label}
                </span>
              </div>
            </div>

            {/* Điều khiển nhập áp suất: Stepper (+ / -) cùng ô nhập số thập phân chuẩn mH2O */}
            <div className="flex items-center justify-center py-1">
              <PressureStepperInput
                value={val}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                onChange={(nextVal) => handleLevelChange(key, nextVal)}
                accentClass={accentClass}
                ariaLabel={label}
                showSteppers={true}
                showUnit={true}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

