import React, { useState } from 'react';
import { Check, ChevronDown, Zap } from 'lucide-react';
import { ControlModeId } from '../../types';

export interface ControlModeOption {
  id: ControlModeId;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ControlModeSelectorProps {
  modes: ControlModeOption[];
  viewingMode: ControlModeId;
  activeMode: ControlModeId;
  onSelectViewingMode: (modeId: ControlModeId) => void;
  onApplyMode: () => void;
}

export function ControlModeSelector({
  modes,
  viewingMode,
  activeMode,
  onSelectViewingMode,
  onApplyMode,
}: ControlModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentViewingMode = modes.find((m) => m.id === viewingMode) || modes[0];
  const CurrentIcon = currentViewingMode.icon;
  const isCurrentViewActive = viewingMode === activeMode;

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#141824] p-3 sm:px-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Dropdown chọn chế độ để xem / cấu hình: Hiển thị đầy đủ tên, cấm cắt khuyết (...) */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-full min-h-[42px] py-1.5 px-3 sm:px-3.5 flex items-center justify-between gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-[#0E121B] hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CurrentIcon className={`w-4 h-4 shrink-0 ${currentViewingMode.color}`} />
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {currentViewingMode.name}
              </span>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ml-1 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Menu dropdown hỗ trợ cuộn khi mở rộng nhiều chế độ */}
          {isOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
              <div className="absolute left-0 top-[calc(100%+6px)] z-40 w-full sm:max-w-md max-h-72 overflow-y-auto bg-white dark:bg-[#141822] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100">
                {modes.map((mode) => {
                  const isViewing = mode.id === viewingMode;
                  const isStationActive = mode.id === activeMode;
                  const Icon = mode.icon;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => {
                        onSelectViewingMode(mode.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer ${
                        isViewing
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${mode.color}`} />
                        <span className="leading-snug">{mode.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isStationActive && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Đang áp dụng
                          </span>
                        )}
                        {isViewing && (
                          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Nút Áp dụng / Badge Trạng thái Đang áp dụng */}
        <div className="shrink-0 flex items-center">
          {isCurrentViewActive ? (
            <div className="inline-flex items-center gap-1.5 h-10 px-3 sm:px-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đang áp dụng</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onApplyMode}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-3 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all"
              title={`Áp dụng "${currentViewingMode.name}" làm cơ chế điều khiển của trạm`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Áp dụng chế độ này</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

