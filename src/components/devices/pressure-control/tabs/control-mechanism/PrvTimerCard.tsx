import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Lock,
  PowerOff,
  Timer,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { PrvTimerConfig } from '../../types';
import { DEFAULT_PRV_TIMER_CONFIG } from '../../utils';
import { Switch } from '@/components/ui/switch';
import { TimePicker24h } from './TimePicker24h';

interface PrvTimerCardProps {
  config?: PrvTimerConfig;
  onChangeConfig: (updater: (prev: PrvTimerConfig) => PrvTimerConfig) => void;
}

const pad = (n: number) => n.toString().padStart(2, '0');

export function PrvTimerCard({
  config = DEFAULT_PRV_TIMER_CONFIG,
  onChangeConfig,
}: PrvTimerCardProps) {
  // Đồng hồ thời gian thực để đối soát cảnh báo thông minh
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = config.targetHour * 60 + config.targetMinute;
  const isPastToday = targetMinutes <= currentMinutes;

  // Tính số phút và thời gian còn lại
  const diffMinutes = isPastToday
    ? 1440 - currentMinutes + targetMinutes
    : targetMinutes - currentMinutes;

  const hoursRemaining = Math.floor(diffMinutes / 60);
  const minutesRemaining = diffMinutes % 60;
  const remainingText =
    hoursRemaining > 0
      ? `${hoursRemaining} giờ ${minutesRemaining > 0 ? `${minutesRemaining} phút` : ''}`.trim()
      : `${minutesRemaining} phút`;

  const targetTimeStr = `${pad(config.targetHour)}:${pad(config.targetMinute)}`;
  const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const handleTimeChange = (h: number, m: number) => {
    onChangeConfig((prev) => ({
      ...prev,
      targetHour: h,
      targetMinute: m,
    }));
  };

  const handleToggle = (checked: boolean) => {
    onChangeConfig((prev) => ({
      ...prev,
      enabled: checked,
    }));

    if (checked) {
      if (isPastToday) {
        toast.info(
          `Đã kích hoạt hẹn giờ PRV lúc ${targetTimeStr} vào NGÀY MAI (sau ${remainingText})`
        );
      } else {
        toast.success(
          `Đã kích hoạt hẹn giờ PRV lúc ${targetTimeStr} HÔM NAY (sau ${remainingText})`
        );
      }
    } else {
      toast.info('Đã hủy kích hoạt hẹn giờ van PRV');
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. THÔNG BÁO THÔNG MINH (POKA-YOKE SMART ALERT) */}
      {isPastToday ? (
        <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5 flex-wrap">
              <span>Mốc hẹn ({targetTimeStr}) đã qua giờ hiện tại ({currentTimeStr}).</span>
              <span className="text-amber-700 dark:text-amber-400 font-extrabold">
                Lệnh sẽ kích hoạt vào NGÀY MAI.
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-700/90 dark:text-amber-300/80 font-medium">
              Thời gian dự kiến thực thi sau <strong className="font-bold">{remainingText}</strong> nữa.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl border border-blue-500/25 bg-blue-500/5 text-blue-900 dark:text-blue-200">
          <Clock className="w-5 h-5 shrink-0 text-blue-500" />
          <div className="text-xs sm:text-sm font-medium">
            Mốc hẹn hợp lệ trong ngày. Lệnh sẽ kích hoạt vào <strong className="font-bold text-blue-600 dark:text-blue-400">HÔM NAY lúc {targetTimeStr}</strong> (sau {remainingText}).
          </div>
        </div>
      )}

      {/* 2. CARD CẤU HÌNH HẸN GIỜ VAN PRV */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-6 shadow-xs space-y-5">
        {/* Header: Tiêu đề + Cần gạt kích hoạt */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Hẹn giờ van PRV
              </h3>
              <span className="text-xs text-slate-500 font-mono">One-shot Timer</span>
            </div>
          </div>

          {/* Cần gạt kích hoạt khung giờ */}
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold transition-colors ${
                config.enabled
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {config.enabled ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
            </span>
            <Switch
              id="prv-timer-switch"
              checked={config.enabled}
              onCheckedChange={handleToggle}
              aria-label="Cần gạt kích hoạt hẹn giờ PRV"
            />
          </div>
        </div>

        {/* Thân Card: 1 input duy nhất cho thời gian trong ngày */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/70 dark:bg-[#0E121B] border border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                Thời gian tác động
              </span>
              {config.enabled && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                  <Lock className="w-3 h-3 text-amber-500" />
                  Đã khóa
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Chu kỳ 24h trong ngày (HH:mm)
            </p>
          </div>

          {/* 1 Input thời gian duy nhất */}
          <div className="flex items-center gap-2">
            <TimePicker24h
              hour={config.targetHour}
              minute={config.targetMinute}
              onChange={handleTimeChange}
              disabled={config.enabled}
            />
          </div>
        </div>

        {/* Thông tin kỹ thuật tác động van & Relay mapping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#10141F] flex items-center gap-2.5">
            <PowerOff className="w-4 h-4 text-rose-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Tác động</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                Đóng Van 4 & ngắt các van áp
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#10141F] flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Bản đồ Relay</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                Hút Relay 7 + 2,4,6 (10 giây)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
