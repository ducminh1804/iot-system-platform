import React, { useState, useEffect } from 'react';
import {
  Droplets,
  RotateCcw,
  Calculator,
  HelpCircle,
  Save,
  Check,
  Activity,
  ArrowRight,
  ArrowLeftRight,
} from 'lucide-react';
import {
  PressureStationConfig,
  PulseMeterConfig,
  PulseUnitType,
} from '../types';
import { DEFAULT_PULSE_METER_CONFIG, formatVNNumber } from '../utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PulseMeterTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
  currentFlowRate?: number; // m³/h từ trạm
}

const PRESET_PULSE_RATES: { label: string; value: number; unit: PulseUnitType }[] = [
  { label: '1 L/xung', value: 1, unit: 'liter_per_pulse' },
  { label: '10 L/xung', value: 10, unit: 'liter_per_pulse' },
  { label: '100 L/xung', value: 100, unit: 'liter_per_pulse' },
  { label: '1 m³/xung', value: 1000, unit: 'liter_per_pulse' },
];

export function PulseMeterTab({
  config,
  onChangeConfig,
  onSave,
  currentFlowRate = 49.6,
}: PulseMeterTabProps) {
  const meter: PulseMeterConfig = config.pulseMeter ?? DEFAULT_PULSE_METER_CONFIG;

  const [tempNet, setTempNet] = useState<string>(String(meter.netFlowTotal));
  const [tempForward, setTempForward] = useState<string>(String(meter.forwardFlow));
  const [tempReserve, setTempReserve] = useState<string>(String(meter.reserveFlow));
  const [pulseBlink, setPulseBlink] = useState<boolean>(false);

  // Cập nhật state nội bộ khi config bên ngoài thay đổi
  useEffect(() => {
    setTempNet(String(meter.netFlowTotal));
    setTempForward(String(meter.forwardFlow));
    setTempReserve(String(meter.reserveFlow));
  }, [meter.netFlowTotal, meter.forwardFlow, meter.reserveFlow]);

  const updateMeter = (patch: Partial<PulseMeterConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      pulseMeter: {
        ...(prev.pulseMeter ?? DEFAULT_PULSE_METER_CONFIG),
        ...patch,
      },
    }));
  };

  // Tính toán tần số nhịp xung tương ứng với lưu lượng tức thời (Hz)
  // L/s = (m³/h * 1000) / 3600
  // Xung/s (Hz) = L/s / (L/xung)
  const litersPerPulse =
    meter.pulseUnit === 'liter_per_pulse'
      ? meter.pulsesPerUnit
      : meter.pulseUnit === 'pulse_per_m3'
      ? 1000 / Math.max(0.001, meter.pulsesPerUnit)
      : Math.max(0.001, meter.pulsesPerUnit * 1000);

  const flowRateLitersPerSecond = (currentFlowRate * 1000) / 3600;
  const pulseFreqHz = litersPerPulse > 0 ? flowRateLitersPerSecond / litersPerPulse : 0;

  // Hiệu ứng nhịp chớp LED mô phỏng xung nước
  useEffect(() => {
    if (pulseFreqHz <= 0) {
      setPulseBlink(false);
      return;
    }
    const intervalMs = Math.min(2000, Math.max(100, Math.round(1000 / pulseFreqHz)));
    const timer = setInterval(() => {
      setPulseBlink((prev) => !prev);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [pulseFreqHz]);

  // Tự động tính Net Flow Total từ Forward và Reserve
  const handleAutoCalcNet = () => {
    const fwd = parseFloat(tempForward) || 0;
    const rev = parseFloat(tempReserve) || 0;
    const calculatedNet = parseFloat((fwd - rev).toFixed(2));
    setTempNet(String(calculatedNet));
    updateMeter({
      forwardFlow: fwd,
      reserveFlow: rev,
      netFlowTotal: calculatedNet,
    });
  };

  // Cập nhật khi người dùng thay đổi trực tiếp Forward Flow
  const handleForwardChange = (val: string) => {
    setTempForward(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      updateMeter({ forwardFlow: num });
    }
  };

  // Cập nhật khi người dùng thay đổi trực tiếp Reserve Flow
  const handleReserveChange = (val: string) => {
    setTempReserve(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      updateMeter({ reserveFlow: num });
    }
  };

  // Cập nhật khi người dùng thay đổi trực tiếp Net Flow Total
  const handleNetChange = (val: string) => {
    setTempNet(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      updateMeter({ netFlowTotal: num });
    }
  };

  // Đặt lại các đồng hồ tích lũy về 0
  const handleResetCounters = () => {
    setTempNet('0');
    setTempForward('0');
    setTempReserve('0');
    updateMeter({
      netFlowTotal: 0,
      forwardFlow: 0,
      reserveFlow: 0,
    });
  };

  // Tách số Net Flow Total thành chuỗi 8 chữ số kiểu cơ khí
  const netString = Math.max(0, meter.netFlowTotal).toFixed(1);
  const [intPartRaw, decPart = '0'] = netString.split('.');
  const intPart = intPartRaw.padStart(7, '0');

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col justify-between gap-5 sm:gap-6">
        {/* 1. Mặt số đồng hồ cơ điện tử trực quan (Mechanical Counter & Flow Rate Hero) */}
        <div className="rounded-[22px] bg-gradient-to-br from-slate-900 to-slate-950 text-white p-4 sm:p-5 lg:p-6 shadow-md border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                  Đồng hồ xung
                </h4>
              </div>
            </div>

            {/* Trạng thái xung thời gian thực */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-mono">
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-150 ${
                    pulseBlink ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'
                  }`}
                />
                <span className="text-slate-300 font-semibold">Tín hiệu xung:</span>
                <span className="text-emerald-400 font-extrabold">
                  {formatVNNumber(pulseFreqHz, 2)} Hz
                </span>
              </div>
            </div>
          </div>

          {/* Mặt số hiển thị kiểu trống cơ khí (Mechanical Odometer Display) */}
          <div className="pt-4 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tổng lưu lượng Net
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-slate-500 hover:text-slate-300 cursor-pointer">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Tổng tích lũy thực = Lưu lượng thuận - Lưu lượng nghịch
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Dãy chữ số cơ khí */}
              <div className="flex items-center gap-1 sm:gap-1.5 font-mono select-none overflow-x-auto pb-1">
                {intPart.split('').map((digit, idx) => (
                  <div
                    key={`int-${idx}`}
                    className="w-7 h-10 sm:w-8 sm:h-12 rounded-lg bg-black/90 border border-slate-700 flex items-center justify-center text-lg sm:text-2xl font-black text-white shadow-inner"
                  >
                    {digit}
                  </div>
                ))}
                <div className="text-slate-400 font-black text-xl px-0.5">,</div>
                <div className="w-7 h-10 sm:w-8 sm:h-12 rounded-lg bg-rose-950/80 border border-rose-600/60 flex items-center justify-center text-lg sm:text-2xl font-black text-rose-300 shadow-inner">
                  {decPart}
                </div>
                <span className="ml-2 text-xs sm:text-sm font-bold text-slate-400">m³</span>
              </div>
            </div>

            {/* Lưu lượng tức thời Flow Rate */}
            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
              <span className="text-xs font-semibold text-slate-400">
                Lưu lượng tức thời (Flow Rate)
              </span>
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-xl sm:text-3xl font-black text-blue-400">
                  {formatVNNumber(currentFlowRate, 1)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-400">m³/h</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                (~{formatVNNumber(flowRateLitersPerSecond, 2)} L/s)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Cấu hình chi tiết: Lưới 2 khối cân đối & tối ưu mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Khối 1: Hệ số xung (Pulses per unit volume) & Bộ lọc */}
          <div className="rounded-[20px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Hệ số xung
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {formatVNNumber(meter.pulsesPerUnit, 1)}{' '}
                  {meter.pulseUnit === 'liter_per_pulse' ? 'L/xung' : 'xung/m³'}
                </span>
              </div>

              {/* Các nút preset chọn nhanh (Cực kỳ dễ thao tác trên màn hình cảm ứng di động) */}
              <div className="pt-4">
                <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Mức xung chuẩn
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_PULSE_RATES.map((preset) => {
                    const isSelected =
                      meter.pulsesPerUnit === preset.value && meter.pulseUnit === preset.unit;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() =>
                          updateMeter({
                            pulsesPerUnit: preset.value,
                            pulseUnit: preset.unit,
                          })
                        }
                        className={`h-11 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white dark:bg-[#0B0E14] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nhập hệ số xung tùy chỉnh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Giá trị xung
                    </label>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0.001"
                    inputMode="decimal"
                    value={meter.pulsesPerUnit}
                    onChange={(e) =>
                      updateMeter({ pulsesPerUnit: parseFloat(e.target.value) || 0.1 })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Đơn vị xung
                  </label>
                  <select
                    value={meter.pulseUnit}
                    onChange={(e) =>
                      updateMeter({ pulseUnit: e.target.value as PulseUnitType })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="liter_per_pulse">Lít / xung (L/pulse)</option>
                    <option value="pulse_per_m3">Xung / m³ (pulse/m³)</option>
                    <option value="m3_per_pulse">m³ / xung (m³/pulse)</option>
                  </select>
                </div>
              </div>

              {/* Bộ lọc chống dội xung & Điểm cắt lưu lượng 0 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Lọc dội xung (ms)
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Khử xung giả do rung ống hoặc búa nước cơ học (chuẩn 10 - 50ms)
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <input
                    type="number"
                    step="5"
                    min="5"
                    max="200"
                    inputMode="numeric"
                    value={meter.debounceFilterMs ?? 20}
                    onChange={(e) =>
                      updateMeter({ debounceFilterMs: parseInt(e.target.value, 10) || 10 })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Cắt điểm 0 (m³/h)
                    </label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Lưu lượng thấp hơn giá trị này được làm tròn về 0 để chống trôi số
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    value={meter.cutoffMinFlowRate ?? 0.05}
                    onChange={(e) =>
                      updateMeter({ cutoffMinFlowRate: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Khối 2: Cài đặt chỉ số thể tích tích lũy (Forward, Reserve, Net Flow Total) */}
          <div className="rounded-[20px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Chỉ số lưu lượng (m³)
                  </h4>
                </div>

                {/* Nút thao tác nhanh trên mobile */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoCalcNet}
                    className="h-8 px-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-100 transition-colors"
                    title="Tự động tính Net = Thuận - Nghịch"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Tính Net</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCounters}
                    className="h-8 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors"
                    title="Đặt lại các chỉ số về 0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Form 3 trường chỉ số thể tích tích lũy */}
              <div className="space-y-3.5 pt-4">
                {/* 1. Forward Flow */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Tổng thuận (Forward Flow)</span>
                    </label>
                    <span className="text-xs font-mono font-semibold text-slate-400">m³</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    inputMode="decimal"
                    value={tempForward}
                    onChange={(e) => handleForwardChange(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm sm:text-base font-mono font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-2xs"
                  />
                </div>

                {/* 2. Reserve Flow */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Tổng nghịch (Reserve Flow)</span>
                    </label>
                    <span className="text-xs font-mono font-semibold text-slate-400">m³</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    inputMode="decimal"
                    value={tempReserve}
                    onChange={(e) => handleReserveChange(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm sm:text-base font-mono font-extrabold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all shadow-2xs"
                  />
                </div>

                {/* 3. Net Flow Total */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Tổng thực (Net Flow Total)</span>
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      m³
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    inputMode="decimal"
                    value={tempNet}
                    onChange={(e) => handleNetChange(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-blue-500/30 dark:border-blue-500/30 bg-blue-50/20 dark:bg-blue-950/20 text-sm sm:text-base font-mono font-black text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Bảng cân bằng toán học nhanh */}
            <div className="mt-4 p-3 rounded-xl bg-white dark:bg-[#0B0E14] border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-sans">Quan hệ cân bằng:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Net = Thuận ({formatVNNumber(meter.forwardFlow, 1)}) - Nghịch ({formatVNNumber(meter.reserveFlow, 1)})
              </span>
            </div>
          </div>
        </div>

        {/* 3. Nút Lưu cấu hình trạm */}
        {onSave && (
          <div className="flex items-center justify-end pt-2 pb-1">
            <button
              type="button"
              onClick={onSave}
              className="w-full sm:w-auto h-12 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Lưu cấu hình đồng hồ</span>
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
