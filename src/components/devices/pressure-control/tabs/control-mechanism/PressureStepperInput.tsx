import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface PressureStepperInputProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange: (val: number) => void;
  accentClass?: string;
  ariaLabel?: string;
}

/**
 * Component nhập áp suất có nút bấm - và + kèm ô nhập trực tiếp.
 * Khắc phục triệt để lỗi nhập số (cho phép xóa rỗng tạm thời, phím Enter/Esc, Arrow keys).
 */
export function PressureStepperInput({
  value,
  min = 0,
  max = 50,
  step = 0.5,
  disabled = false,
  onChange,
  accentClass = 'text-blue-600 dark:text-blue-400',
  ariaLabel,
}: PressureStepperInputProps) {
  const [draft, setDraft] = useState<string>(String(value));
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setDraft(String(value));
    }
  }, [value, isFocused]);

  const commitValue = (raw: string) => {
    const normalized = raw.replace(',', '.').trim();
    if (normalized === '' || isNaN(Number(normalized))) {
      setDraft(String(value));
      return;
    }
    let parsed = parseFloat(normalized);
    if (parsed < min) parsed = min;
    if (parsed > max) parsed = max;
    const rounded = Number(parsed.toFixed(1));
    setDraft(String(rounded));
    if (rounded !== value) {
      onChange(rounded);
    }
  };

  const handleStep = (delta: number) => {
    if (disabled) return;
    const next = Math.min(max, Math.max(min, Number((value + delta).toFixed(1))));
    setDraft(String(next));
    onChange(next);
  };

  return (
    <div className="flex items-center gap-1 select-none">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => handleStep(-step)}
        aria-label={`Giảm ${ariaLabel ?? 'áp suất'}`}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all shadow-2xs shrink-0"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center justify-center h-8 sm:h-9 px-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#181D2A] shadow-2xs">
        <input
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={draft}
          aria-label={ariaLabel ?? 'Giá trị áp suất'}
          onFocus={(e) => {
            setIsFocused(true);
            setDraft(String(value));
            e.currentTarget.select();
          }}
          onChange={(e) => {
            const next = e.target.value;
            if (/^[0-9]*[.,]?[0-9]*$/.test(next)) {
              setDraft(next);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            commitValue(draft);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.currentTarget.blur();
            } else if (e.key === 'Escape') {
              setDraft(String(value));
              setIsFocused(false);
              e.currentTarget.blur();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              handleStep(step);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              handleStep(-step);
            }
          }}
          onWheel={(e) => {
            e.currentTarget.blur();
          }}
          className={`w-10 sm:w-12 text-center bg-transparent text-xs sm:text-sm font-mono font-extrabold ${accentClass} focus:outline-none disabled:opacity-40`}
        />
        <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-slate-400 select-none pl-0.5">
          mH₂O
        </span>
      </div>

      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => handleStep(step)}
        aria-label={`Tăng ${ariaLabel ?? 'áp suất'}`}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#181D2A] text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all shadow-2xs shrink-0"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

