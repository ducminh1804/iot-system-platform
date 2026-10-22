import React from 'react';
import {
  Sun,
  Battery,
  AlertTriangle,
  HelpCircle,
  Save,
  CheckCircle2,
  Server,
  Radio,
} from 'lucide-react';
import {
  PressureStationConfig,
  BatteryChemistry,
  SolarBatteryConfig,
  LoggerBatteryConfig,
  ServerAlertProtocol,
} from '../types';
import {
  DEFAULT_SOLAR_BATTERY_CONFIG,
  DEFAULT_LOGGER_BATTERY_CONFIG,
  formatVNNumber,
} from '../utils';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlarmsTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
  /** Điện áp đo thực tế từ trạm (V) */
  currentSolarVoltage?: number;
  currentLoggerVoltage?: number;
}

const SOLAR_CHEMISTRY_OPTIONS: {
  id: BatteryChemistry;
  label: string;
  defNom: number;
  defFull: number;
  defCut: number;
}[] = [
  { id: 'lifepo4', label: 'LiFePO4 (3.2V / 12.8V)', defNom: 12.8, defFull: 14.4, defCut: 10.8 },
  { id: 'lead_acid', label: 'Chì - Axit AGM (12V)', defNom: 12.0, defFull: 14.4, defCut: 10.8 },
  { id: 'gel', label: 'Ắc quy Gel (12V)', defNom: 12.0, defFull: 14.2, defCut: 11.0 },
  { id: 'li_ion', label: 'Li-ion Ternary (11.1V)', defNom: 11.1, defFull: 12.6, defCut: 9.0 },
];

const SERVER_PROTOCOLS: { id: ServerAlertProtocol; label: string }[] = [
  { id: 'mqtt', label: 'MQTT Publish' },
  { id: 'http', label: 'HTTP Webhook' },
  { id: 'scada', label: 'SCADA Center' },
];

export function AlarmsTab({
  config,
  onChangeConfig,
  onSave,
  currentSolarVoltage = 12.46,
  currentLoggerVoltage = 3.60,
}: AlarmsTabProps) {
  const solar: SolarBatteryConfig = config.solarBattery ?? DEFAULT_SOLAR_BATTERY_CONFIG;
  const logger: LoggerBatteryConfig = config.loggerBattery ?? DEFAULT_LOGGER_BATTERY_CONFIG;

  const updateSolar = (patch: Partial<SolarBatteryConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      solarBattery: {
        ...(prev.solarBattery ?? DEFAULT_SOLAR_BATTERY_CONFIG),
        ...patch,
      },
    }));
  };

  const updateLogger = (patch: Partial<LoggerBatteryConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      loggerBattery: {
        ...(prev.loggerBattery ?? DEFAULT_LOGGER_BATTERY_CONFIG),
        ...patch,
      },
    }));
  };

  const handleSelectSolarChemistry = (chem: BatteryChemistry) => {
    const opt = SOLAR_CHEMISTRY_OPTIONS.find((o) => o.id === chem);
    if (!opt) return;
    updateSolar({
      chemistry: chem,
      nominalVoltage: opt.defNom,
      voltageFull: opt.defFull,
      voltageCutoff: opt.defCut,
    });
  };

  // Tính toán kỹ thuật Solar:
  const vRange = Math.max(0.1, solar.voltageFull - solar.voltageCutoff);
  const rawSolarSoc = ((currentSolarVoltage - solar.voltageCutoff) / vRange) * 100;
  const solarSocPercent = Math.min(100, Math.max(0, rawSolarSoc));
  const remainingWattHours = solar.nominalVoltage * solar.capacityAh * (solarSocPercent / 100);
  const backupHours = solar.averageLoadWatts > 0 ? remainingWattHours / solar.averageLoadWatts : 0;
  const isSolarAlarmTriggered = solar.enabled && solarSocPercent <= solar.triggerThresholdPercent;

  // Đánh giá trạng thái Pin Logger từ NSX (ngưỡng cắt tiêu chuẩn NSX là 3.0V cho Li-SOCl2 3.6V)
  const isLoggerLowBattery = logger.enabled && currentLoggerVoltage < 3.0;

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col justify-between gap-6">
        {/* Lưới 2 khối: Pin Solar (Trái) & Pin Logger (Phải) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Card 1: Nguồn Pin Solar (Nguồn chính trạm) */}
          <div className="rounded-[20px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header Card */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Pin Solar
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {solar.enabled ? 'Đang bật' : 'Đang tắt'}
                  </span>
                  <Switch
                    checked={solar.enabled}
                    onCheckedChange={(checked) => updateSolar({ enabled: checked })}
                  />
                </div>
              </div>

              {/* Form nhập thông số Pin Solar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 pt-4">
                {/* Loại pin */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Loại pin
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
                        Hóa học pin để hệ thống áp dụng dải điện áp sạc/xả tiêu chuẩn
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <select
                    value={solar.chemistry}
                    onChange={(e) => handleSelectSolarChemistry(e.target.value as BatteryChemistry)}
                    disabled={!solar.enabled}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    {SOLAR_CHEMISTRY_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Điện áp danh định */}
                <div>
                  <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Điện áp danh định (V)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={solar.nominalVoltage}
                    onChange={(e) =>
                      updateSolar({ nominalVoltage: parseFloat(e.target.value) || 0 })
                    }
                    disabled={!solar.enabled}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs disabled:opacity-50"
                  />
                </div>

                {/* Dung lượng pin */}
                <div>
                  <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Dung lượng (Ah)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={solar.capacityAh}
                    onChange={(e) =>
                      updateSolar({ capacityAh: parseFloat(e.target.value) || 0 })
                    }
                    disabled={!solar.enabled}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs disabled:opacity-50"
                  />
                </div>

                {/* Công suất tải trạm */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Tải trạm (W)
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
                        Công suất tiêu thụ trung bình của actuator, RTU và cảm biến đo áp
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={solar.averageLoadWatts}
                    onChange={(e) =>
                      updateSolar({ averageLoadWatts: parseFloat(e.target.value) || 0 })
                    }
                    disabled={!solar.enabled}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs disabled:opacity-50"
                  />
                </div>

                {/* Điện áp sạc đầy */}
                <div>
                  <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Điện áp sạc đầy (V)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={solar.voltageFull}
                    onChange={(e) =>
                      updateSolar({ voltageFull: parseFloat(e.target.value) || 0 })
                    }
                    disabled={!solar.enabled}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs disabled:opacity-50"
                  />
                </div>

                {/* Điện áp ngắt cạn */}
                <div>
                  <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Điện áp cạn (V)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={solar.voltageCutoff}
                    onChange={(e) =>
                      updateSolar({ voltageCutoff: parseFloat(e.target.value) || 0 })
                    }
                    disabled={!solar.enabled}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Ngưỡng kích hoạt cảnh báo (%) */}
              <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Ngưỡng cảnh báo (%)</span>
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
                        Kích hoạt cảnh báo khi dung lượng pin tụt xuống dưới mức này
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <span className="text-sm font-mono font-extrabold text-amber-600 dark:text-amber-400">
                    ≤ {solar.triggerThresholdPercent}%
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Slider
                    min={5}
                    max={50}
                    step={1}
                    value={[solar.triggerThresholdPercent]}
                    onValueChange={(vals) => updateSolar({ triggerThresholdPercent: vals[0] })}
                    disabled={!solar.enabled}
                    className="flex-1 cursor-pointer"
                  />
                  <div className="w-14 shrink-0 text-right font-mono font-bold text-xs text-slate-700 dark:text-slate-300">
                    {solar.triggerThresholdPercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* Bảng kết quả tính toán kỹ thuật Solar */}
            <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#0B0E14] border border-slate-200/90 dark:border-slate-800/90">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/60">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  Tính toán kỹ thuật
                </span>
                <div className="flex items-center gap-1.5">
                  {isSolarAlarmTriggered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Cảnh báo
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
                    {formatVNNumber(currentSolarVoltage, 2)} V
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-sans text-slate-400 font-medium">Dung lượng ước tính</span>
                  <span
                    className={`text-sm font-extrabold ${
                      solarSocPercent <= solar.triggerThresholdPercent
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {formatVNNumber(solarSocPercent, 1)}%
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-sans text-slate-400 font-medium">Năng lượng lưu</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {formatVNNumber(remainingWattHours, 1)} Wh
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-sans text-slate-400 font-medium">Dự phòng dự kiến</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    ~{formatVNNumber(backupHours, 1)} giờ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Nguồn Pin Logger (Chuẩn NSX & Cảnh báo về Server) */}
          <div className="rounded-[20px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between">
            <div>
              {/* Header Card: Gạt lên là bật giám sát theo chuẩn NSX */}
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
                    onCheckedChange={(checked) => updateLogger({ enabled: checked })}
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
                    onCheckedChange={(checked) => updateLogger({ notifyServer: checked })}
                  />
                </div>

                {logger.notifyServer && logger.enabled && (
                  <div className="space-y-3.5 pt-2">
                    {/* Giao thức truyền tin */}
                    <div>
                      <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                        Giao thức truyền
                      </label>
                      <select
                        value={logger.serverProtocol ?? 'mqtt'}
                        onChange={(e) =>
                          updateLogger({ serverProtocol: e.target.value as ServerAlertProtocol })
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
                        onChange={(e) => updateLogger({ serverEndpoint: e.target.value })}
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
                          updateLogger({
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
        </div>

        {/* Nút lưu cấu hình */}
        {onSave && (
          <div className="flex items-center justify-end pt-2 pb-1">
            <button
              type="button"
              onClick={onSave}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Lưu cấu hình cảnh báo</span>
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
