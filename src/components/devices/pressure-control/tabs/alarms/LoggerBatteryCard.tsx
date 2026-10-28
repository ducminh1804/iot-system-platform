import React from 'react';
import {
  Battery,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Server,
  Radio,
} from 'lucide-react';
import {
  LoggerBatteryConfig,
  ServerAlertProtocol,
} from '../../types';
import { formatVNNumber } from '../../utils';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const SERVER_PROTOCOLS: { id: ServerAlertProtocol; label: string }[] = [
  { id: 'mqtt', label: 'MQTT Publish' },
  { id: 'http', label: 'HTTP Webhook' },
  { id: 'scada', label: 'SCADA Center' },
];

interface LoggerBatteryCardProps {
  logger: LoggerBatteryConfig;
  currentLoggerVoltage: number;
  onUpdateLogger: (patch: Partial<LoggerBatteryConfig>) => void;
}

export function LoggerBatteryCard({
  logger,
  currentLoggerVoltage,
  onUpdateLogger,
}: LoggerBatteryCardProps) {
  // Đánh giá trạng thái Pin Logger từ NSX (ngưỡng cắt tiêu chuẩn NSX là 3.0V cho Li-SOCl2 3.6V)
  const isLoggerLowBattery = logger.enabled && currentLoggerVoltage < 3.0;

  return (
    <div className="rounded-[20px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header Card */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
              <Battery className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Pin Logger
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {logger.enabled ? 'Đang bật' : 'Đang tắt'}
            </span>
            <Switch
              checked={logger.enabled}
              onCheckedChange={(checked) => onUpdateLogger({ enabled: checked })}
            />
          </div>
        </div>

        {/* Thông số mặc định chuẩn NSX (Read-only / Clean Industrial) */}
        <div className="py-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white dark:bg-[#0B0E14] border border-slate-200/70 dark:border-slate-800/70">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">
                Tiêu chuẩn nguồn
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Li-SOCl2 (Mặc định NSX)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#0B0E14] border border-slate-200/70 dark:border-slate-800/70">
              <span className="text-[11px] text-slate-400 font-medium block mb-1">
                Cơ chế cảnh báo
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tự động theo chuẩn NSX
              </span>
            </div>
          </div>
        </div>

        {/* Khu vực cấu hình: Cảnh báo về máy chủ (Server Alert Dispatch) */}
        <div className="pt-4">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <label className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                Cảnh báo về server
              </label>
            </div>
            <Switch
              checked={logger.notifyServer}
              disabled={!logger.enabled}
              onCheckedChange={(checked) => onUpdateLogger({ notifyServer: checked })}
            />
          </div>

          {logger.notifyServer && logger.enabled && (
            <div className="space-y-3.5 pt-2 animate-in fade-in duration-150">
              {/* Giao thức truyền tin */}
              <div>
                <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Giao thức truyền
                </label>
                <select
                  value={logger.serverProtocol ?? 'mqtt'}
                  onChange={(e) =>
                    onUpdateLogger({ serverProtocol: e.target.value as ServerAlertProtocol })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs cursor-pointer"
                >
                  {SERVER_PROTOCOLS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Địa chỉ / Topic cảnh báo */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                    Topic / Endpoint
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Topic MQTT hoặc Webhook URL trên Server nhận bản tin cảnh báo sự cố
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  type="text"
                  value={logger.serverEndpoint ?? ''}
                  onChange={(e) => onUpdateLogger({ serverEndpoint: e.target.value })}
                  placeholder="iot/station/1015/alarm/battery"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
                />
              </div>

              {/* Chu kỳ nhắc cảnh báo */}
              <div>
                <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Chu kỳ nhắc (phút)
                </label>
                <input
                  type="number"
                  step="5"
                  min="5"
                  value={logger.alertRepeatMinutes ?? 30}
                  onChange={(e) =>
                    onUpdateLogger({
                      alertRepeatMinutes: parseInt(e.target.value, 10) || 5,
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bảng trạng thái vận hành Pin Logger */}
      <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0B0E14] border border-slate-200/90 dark:border-slate-800/90">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Trạng thái NSX
          </span>
          <div className="flex items-center gap-1.5">
            {isLoggerLowBattery ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                Pin yếu
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Bình thường
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="flex flex-col">
            <span className="text-[11px] font-sans text-slate-400 font-medium">Điện áp đo</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {formatVNNumber(currentLoggerVoltage, 2)} V
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-sans text-slate-400 font-medium">Tiêu chuẩn NSX</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              ≥ 3.00 V
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-sans text-slate-400 font-medium">Gửi server</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {logger.notifyServer && logger.enabled ? 'Đang kích hoạt' : 'Đã tắt'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-sans text-slate-400 font-medium">Nhắc lại</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {logger.alertRepeatMinutes ?? 30} phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

