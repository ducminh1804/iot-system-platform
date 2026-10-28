import React from 'react';
import { ArrowRight, Clock, Moon, SunMedium, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { TimePicker24h } from './TimePicker24h';

interface ThresholdTimeWindowPickerProps {
  triggerScope: 'all_time' | 'custom_window';
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  onChangeScope: (scope: 'all_time' | 'custom_window') => void;
  onChangeTime: (type: 'start' | 'end', hour: number, minute: number) => void;
  disabled?: boolean;
}

/**
 * Tính thời lượng khung giờ (phút) và kiểm tra xem có qua đêm không
 */
function computeWindowDuration(
  startHour: number,
  startMinute: number,
  endHour: number,
  endMinute: number
): { durationMinutes: number; isOvernight: boolean } {
  const startTotal = startHour * 60 + startMinute;
  const endTotal = endHour * 60 + endMinute;

  if (startTotal === endTotal) {
    return { durationMinutes: 0, isOvernight: false };
  }

  if (endTotal > startTotal) {
    return { durationMinutes: endTotal - startTotal, isOvernight: false };
  }

  // Vắt qua nửa đêm (22:00 -> 05:00 hôm sau)
  return { durationMinutes: 24 * 60 - startTotal + endTotal, isOvernight: true };
}

function formatDurationText(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h}h ${m}p`;
}

/**
 * Thanh Timeline 24H Trực quan (Poka-Yoke Visual Feedback)
 */
function Visual24hTimeline({
  isAllTime,
  startHour,
  startMinute,
  endHour,
  endMinute,
}: {
  isAllTime: boolean;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}) {
  const startPct = ((startHour * 60 + startMinute) / 1440) * 100;
  const endPct = ((endHour * 60 + endMinute) / 1440) * 100;
  const isOvernight = startPct > endPct;

  return (
    <div className="w-full space-y-1 select-none pt-1">
      {/* Thanh vạch 24H */}
      <div className="relative w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border border-slate-300/40 dark:border-slate-700/50">
        {isAllTime ? (
          <div className="absolute inset-0 bg-blue-500 rounded-full" />
        ) : isOvernight ? (
          <>
            <div
              className="absolute top-0 bottom-0 bg-blue-500 rounded-r-full"
              style={{ left: `${startPct}%`, right: 0 }}
            />
            <div
              className="absolute top-0 bottom-0 left-0 bg-blue-500 rounded-l-full"
              style={{ width: `${endPct}%` }}
            />
          </>
        ) : (
          <div
            className="absolute top-0 bottom-0 bg-blue-500 rounded-full"
            style={{
              left: `${startPct}%`,
              width: `${Math.max(2, endPct - startPct)}%`,
            }}
          />
        )}

        <div className="absolute left-[25%] top-0 bottom-0 w-[1px] bg-slate-400/40 pointer-events-none" />
        <div className="absolute left-[50%] top-0 bottom-0 w-[1px] bg-slate-400/40 pointer-events-none" />
        <div className="absolute left-[75%] top-0 bottom-0 w-[1px] bg-slate-400/40 pointer-events-none" />
      </div>

      <div className="flex justify-between text-[9px] font-mono font-semibold text-slate-400 px-0.5">
        <span>00h</span>
        <span>06h</span>
        <span>12h</span>
        <span>18h</span>
        <span>24h</span>
      </div>
    </div>
  );
}

/**
 * Bộ chọn phạm vi thời gian (Toàn thời gian vs Khung giờ) chuẩn Poka-Yoke:
 * - Tab chuyển đổi 50/50 Full-Width cực lớn, không thể chạm nhầm bằng ngón tay.
 * - Thanh trượt animated pill chuyển đổi rõ ràng dứt khoát.
 * - Tự động ghi nhớ thời gian cũ khi đổi qua lại giữa 2 tab.
 */
export function ThresholdTimeWindowPicker({
  triggerScope,
  startHour,
  startMinute,
  endHour,
  endMinute,
  onChangeScope,
  onChangeTime,
  disabled = false,
}: ThresholdTimeWindowPickerProps) {
  const { durationMinutes, isOvernight } = computeWindowDuration(
    startHour,
    startMinute,
    endHour,
    endMinute
  );

  const isAllTime = triggerScope === 'all_time';

  const applyPreset = (sh: number, sm: number, eh: number, em: number) => {
    if (disabled) return;
    onChangeScope('custom_window');
    onChangeTime('start', sh, sm);
    onChangeTime('end', eh, em);
  };

  return (
    <div className="flex flex-col gap-2.5 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0c0f17]/60 shadow-2xs">
      {/* 1. THANH CHỌN TAB TOÀN CHIỀU RỘNG (50% / 50% Segmented Control - Chống bấm trượt hoàn toàn) */}
      <div className="relative grid grid-cols-2 p-1 rounded-xl bg-slate-200/70 dark:bg-[#141824] border border-slate-300/50 dark:border-slate-700/60 select-none">
        {/* Tab 1: Toàn thời gian */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChangeScope('all_time')}
          className={`relative z-10 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
            isAllTime
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {isAllTime && (
            <motion.div
              layoutId="time-scope-tab-active-indicator"
              className="absolute inset-0 bg-white dark:bg-[#1a2030] rounded-lg shadow-xs border border-slate-200/80 dark:border-slate-700 z-[-1]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <SunMedium className="w-4 h-4 shrink-0" />
          <span>Toàn thời gian (24/24)</span>
        </button>

        {/* Tab 2: Theo khung giờ */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChangeScope('custom_window')}
          className={`relative z-10 py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
            !isAllTime
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {!isAllTime && (
            <motion.div
              layoutId="time-scope-tab-active-indicator"
              className="absolute inset-0 bg-white dark:bg-[#1a2030] rounded-lg shadow-xs border border-slate-200/80 dark:border-slate-700 z-[-1]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <Clock className="w-4 h-4 shrink-0" />
          <span>Theo khung giờ</span>
        </button>
      </div>

      {/* 2. THANH TIMELINE 24H TRỰC QUAN */}
      <Visual24hTimeline
        isAllTime={isAllTime}
        startHour={startHour}
        startMinute={startMinute}
        endHour={endHour}
        endMinute={endMinute}
      />

      {/* 3. NỘI DUNG CHI TIẾT THEO CHẾ ĐỘ ĐANG CHỌN */}
      {isAllTime ? (
        /* Khi chọn Toàn thời gian */
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-[#121622] border border-slate-200/60 dark:border-slate-800 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Áp dụng liên tục mọi thời điểm trong ngày</span>
          </div>
          <span className="font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">
            24 / 24 Giờ
          </span>
        </div>
      ) : (
        /* Khi chọn Theo khung giờ */
        <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800 animate-in fade-in duration-150">
          {/* Header trạng thái thời lượng & báo qua đêm */}
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
            <span className="text-[11px] font-sans font-semibold text-slate-400">
              Thời gian áp dụng:
            </span>
            <div className="flex items-center gap-1.5">
              {isOvernight && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Moon className="w-3 h-3" />
                  Qua đêm (+1 ngày)
                </span>
              )}
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                {formatDurationText(durationMinutes)}
              </span>
            </div>
          </div>

          {/* Ô nhập giờ Bắt đầu và Kết thúc */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Từ:</span>
              <TimePicker24h
                hour={startHour}
                minute={startMinute}
                disabled={disabled}
                onChange={(h, m) => onChangeTime('start', h, m)}
              />
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

            <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
              <span className="text-xs font-semibold text-slate-500 shrink-0">Đến:</span>
              <TimePicker24h
                hour={endHour}
                minute={endMinute}
                disabled={disabled}
                onChange={(h, m) => onChangeTime('end', h, m)}
              />
            </div>
          </div>

          {/* Presets nhanh */}
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Chọn nhanh:
            </span>

            <button
              type="button"
              disabled={disabled}
              onClick={() => applyPreset(22, 0, 5, 0)}
              className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Đêm (22:00 - 05:00)
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => applyPreset(6, 0, 18, 0)}
              className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Ngày (06:00 - 18:00)
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => applyPreset(10, 0, 14, 0)}
              className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-white dark:bg-[#141824] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cao điểm (10:00 - 14:00)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
