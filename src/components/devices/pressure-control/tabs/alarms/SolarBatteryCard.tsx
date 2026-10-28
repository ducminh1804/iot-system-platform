import React from 'react';
import {
  Sun,
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  BatteryChemistry,
  SolarBatteryConfig,
} from '../../types';
import { formatVNNumber } from '../../utils';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const SOLAR_CHEMISTRY_OPTIONS: {
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

interface SolarBatteryCardProps {
  solar: SolarBatteryConfig;
  currentSolarVoltage: number;
  onUpdateSolar: (patch: Partial<SolarBatteryConfig>) => void;
}

export function SolarBatteryCard({
  solar,
  currentSolarVoltage,
  onUpdateSolar,
}: SolarBatteryCardProps) {
  const handleSelectSolarChemistry = (chem: BatteryChemistry) => {
    const opt = SOLAR_CHEMISTRY_OPTIONS.find((o) => o.id === chem);
    if (!opt) return;
    onUpdateSolar({
      chemistry: chem,
      nominalVoltage: opt.defNom,
      voltageFull: opt.defFull,
      voltageCutoff: opt.defCut,
    });
  };

  // Tính toán kỹ thuật Solar
  const vRange = Math.max(0.1, solar.voltageFull - solar.voltageCutoff);
  const rawSolarSoc = ((currentSolarVoltage - solar.voltageCutoff) / vRange) * 100;
  const solarSocPercent = Math.min(100, Math.max(0, rawSolarSoc));
  const remainingWattHours = solar.nominalVoltage * solar.capacityAh * (solarSocPercent / 100);
  const backupHours = solar.averageLoadWatts > 0 ? remainingWattHours / solar.averageLoadWatts : 0;
  const isSolarAlarmTriggered = solar.enabled && solarSocPercent <= solar.triggerThresholdPercent;

  return (
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
              onCheckedChange={(checked) => onUpdateSolar({ enabled: checked })}
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
                onUpdateSolar({ nominalVoltage: parseFloat(e.target.value) || 0 })
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
                onUpdateSolar({ capacityAh: parseFloat(e.target.value) || 0 })
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
                onUpdateSolar({ averageLoadWatts: parseFloat(e.target.value) || 0 })
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
                onUpdateSolar({ voltageFull: parseFloat(e.target.value) || 0 })
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
                onUpdateSolar({ voltageCutoff: parseFloat(e.target.value) || 0 })
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
              onValueChange={(vals) => onUpdateSolar({ triggerThresholdPercent: vals[0] })}
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
  );
}

