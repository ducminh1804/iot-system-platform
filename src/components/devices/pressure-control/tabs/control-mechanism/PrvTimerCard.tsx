import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ChevronDown, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { PrvTimerConfig } from '../../types';
import { DEFAULT_PRV_TIMER_CONFIG } from '../../utils';
import { Switch } from '@/components/ui/switch';

interface PrvTimerCardProps {
  config?: PrvTimerConfig;
  onChangeConfig: (updater: (prev: PrvTimerConfig) => PrvTimerConfig) => void;
  isModeActive?: boolean;
}

const pad = (n: number) => n.toString().padStart(2, '0');
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function PrvTimerCard({
  config = DEFAULT_PRV_TIMER_CONFIG,
  onChangeConfig,
  isModeActive = false,
}: PrvTimerCardProps) {
  // Đồng hồ thời gian thực
  const [now, setNow] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(
    `${pad(config.targetHour)}:${pad(config.targetMinute)}`
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  // Cập nhật giờ hệ thống định kỳ để đối soát quá giờ
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Đồng bộ text hiển thị khi props đổi từ ngoài
  useEffect(() => {
    setInputText(`${pad(config.targetHour)}:${pad(config.targetMinute)}`);
  }, [config.targetHour, config.targetMinute]);

  // Cuộn vào mục đang chọn khi mở dropdown
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      hourListRef.current
        ?.querySelector('[data-active="true"]')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      minuteListRef.current
        ?.querySelector('[data-active="true"]')
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 40);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        // Format lại text chuẩn khi blur ra ngoài
        setInputText(`${pad(config.targetHour)}:${pad(config.targetMinute)}`);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, config.targetHour, config.targetMinute]);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = config.targetHour * 60 + config.targetMinute;
  const isPastToday = targetMinutes <= currentMinutes;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!isModeActive) return;
    setIsOpen(true);
    e.target.select(); // Tự động bôi đen toàn bộ số để nhập tay nhanh
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    // Tự động phân tích khi người dùng nhập chuỗi định dạng HH:mm hoặc HHmm
    const cleaned = val.replace(/[^\d:]/g, '');
    let h: number | null = null;
    let m: number | null = null;

    if (cleaned.includes(':')) {
      const parts = cleaned.split(':');
      if (parts[0] !== '') h = parseInt(parts[0], 10);
      if (parts[1] !== '') m = parseInt(parts[1], 10);
    } else if (cleaned.length === 4) {
      h = parseInt(cleaned.slice(0, 2), 10);
      m = parseInt(cleaned.slice(2, 4), 10);
    }

    if (h !== null && !isNaN(h)) {
      const validH = Math.min(23, Math.max(0, h));
      onChangeConfig((prev) => ({
        ...prev,
        targetHour: validH,
        targetMinute: m !== null && !isNaN(m) ? Math.min(59, Math.max(0, m)) : prev.targetMinute,
      }));
    }
  };

  const handlePickHour = (h: number) => {
    onChangeConfig((prev) => ({ ...prev, targetHour: h }));
  };

  const handlePickMinute = (m: number) => {
    onChangeConfig((prev) => ({ ...prev, targetMinute: m }));
  };

  const handleToggle = (checked: boolean) => {
    if (!isModeActive) {
      toast.warning('Vui lòng kích hoạt chế độ để tiếp tục cấu hình');
      return;
    }

    onChangeConfig((prev) => ({
      ...prev,
      enabled: checked,
    }));

    if (checked) {
      if (isPastToday) {
        toast.info(
          `Đã kích hoạt hẹn giờ lúc ${pad(config.targetHour)}:${pad(config.targetMinute)} (kích hoạt vào ngày mai)`
        );
      } else {
        toast.success(
          `Đã kích hoạt hẹn giờ lúc ${pad(config.targetHour)}:${pad(config.targetMinute)} hôm nay`
        );
      }
    } else {
      toast.info('Đã hủy kích hoạt hẹn giờ van PRV');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header: Tiêu đề + Cần gạt kích hoạt */}
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Hẹn giờ van PRV
        </h3>

        {/* Cần gạt kích hoạt */}
        <div className="flex items-center gap-2.5">
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
            disabled={!isModeActive}
            onCheckedChange={handleToggle}
            aria-label="Cần gạt kích hoạt hẹn giờ PRV"
          />
        </div>
      </div>

      {/* Thân thẻ: Ô nhập thời gian to vừa phải + Cảnh báo nhỏ nếu đã quá giờ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
          Thời gian hẹn
        </span>

        <div className="flex items-center gap-3">
          {/* Cảnh báo: Chỉ hiện khi ĐÃ QUÁ GIỜ HIỆN TẠI */}
          {isPastToday && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 animate-in fade-in duration-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Đã qua giờ hiện tại</span>
            </span>
          )}

          {/* Ô nhập thời gian: to vừa phải, click là xổ danh sách ở dưới, tự động bôi đen nếu gõ tay */}
          <div ref={containerRef} className="relative">
            <div
              className={`flex items-center gap-2 h-10 px-3 rounded-xl border bg-slate-50/70 dark:bg-[#0E121B] transition-all ${
                isOpen
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              } ${!isModeActive ? 'opacity-60 cursor-not-allowed' : 'cursor-text'}`}
              onClick={() => {
                if (!isModeActive) return;
                setIsOpen(true);
                inputRef.current?.select();
              }}
            >
              <Clock className="w-4 h-4 text-blue-500 shrink-0 pointer-events-none" />

              <input
                ref={inputRef}
                type="text"
                disabled={!isModeActive}
                value={inputText}
                onFocus={handleFocus}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsOpen(false);
                    inputRef.current?.blur();
                  }
                }}
                className="w-16 font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white bg-transparent outline-none text-center selection:bg-blue-500 selection:text-white"
                placeholder="00:00"
              />

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 pointer-events-none ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {/* Danh sách xổ ra ở dưới để chọn */}
            {isOpen && isModeActive && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-52 bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in-95 duration-100">
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold text-slate-400 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span>GIỜ</span>
                  <span>PHÚT</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                  {/* Cột GIỜ (00 -> 23) */}
                  <div
                    ref={hourListRef}
                    className="h-44 overflow-y-auto space-y-0.5 pr-1 scroll-smooth"
                  >
                    {HOURS.map((h) => {
                      const isSelected = config.targetHour === h;
                      return (
                        <button
                          key={h}
                          type="button"
                          data-active={isSelected}
                          onClick={() => handlePickHour(h)}
                          className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                          }`}
                        >
                          {pad(h)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Cột PHÚT (00 -> 59) */}
                  <div
                    ref={minuteListRef}
                    className="h-44 overflow-y-auto space-y-0.5 pr-1 scroll-smooth border-l border-slate-100 dark:border-slate-800/80 pl-1"
                  >
                    {MINUTES.map((m) => {
                      const isSelected = config.targetMinute === m;
                      return (
                        <button
                          key={m}
                          type="button"
                          data-active={isSelected}
                          onClick={() => handlePickMinute(m)}
                          className={`w-full py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                          }`}
                        >
                          {pad(m)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-bold transition-all cursor-pointer active:scale-95"
                >
                  Xong
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
