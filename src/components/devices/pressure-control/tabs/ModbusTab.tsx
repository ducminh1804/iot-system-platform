import React from 'react';
import { Cpu, HelpCircle, Upload, FileCode, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  PressureStationConfig,
  ModbusMeterConfig,
  ModbusBrandId,
  ModbusDataType,
  ModbusRegisterField,
} from '../types';
import {
  DEFAULT_MODBUS_METER_CONFIG,
  MODBUS_BRAND_PRESETS,
} from '../utils';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ModbusTabProps {
  config: PressureStationConfig;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave?: () => void;
}

const DATA_TYPES: { id: ModbusDataType; label: string }[] = [
  { id: 'float32', label: 'Float32 (IEEE 754)' },
  { id: 'float32_swapped', label: 'Float32 (Byte-swapped)' },
  { id: 'int32', label: 'Int32 (Signed 32-bit)' },
  { id: 'uint32', label: 'UInt32 (Unsigned 32-bit)' },
  { id: 'int16', label: 'Int16 (Signed 16-bit)' },
  { id: 'uint16', label: 'UInt16 (Unsigned 16-bit)' },
  { id: 'double64', label: 'Double64 (64-bit float)' },
];

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ModbusTab({
  config,
  onChangeConfig,
}: ModbusTabProps) {
  const modbus: ModbusMeterConfig =
    config.modbusMeter ?? DEFAULT_MODBUS_METER_CONFIG;

  const updateModbus = (patch: Partial<ModbusMeterConfig>) => {
    onChangeConfig((prev) => ({
      ...prev,
      modbusMeter: {
        ...(prev.modbusMeter ?? DEFAULT_MODBUS_METER_CONFIG),
        ...patch,
      },
    }));
  };

  const updateRegisterField = (
    fieldKey: 'flowRate' | 'forwardTotal' | 'reverseTotal' | 'pressure',
    patch: Partial<ModbusRegisterField>
  ) => {
    onChangeConfig((prev) => {
      const cur = prev.modbusMeter ?? DEFAULT_MODBUS_METER_CONFIG;
      const currentField = cur[fieldKey] ?? {
        address: 40001,
        dataType: 'float32',
        multiplier: 1,
      };

      return {
        ...prev,
        modbusMeter: {
          ...cur,
          [fieldKey]: {
            ...currentField,
            ...patch,
          },
        },
      };
    });
  };

  const handleBrandChange = (newBrand: ModbusBrandId) => {
    const preset = MODBUS_BRAND_PRESETS.find((p) => p.id === newBrand);
    if (!preset) return;

    updateModbus({
      ...preset.config,
    });

    if (newBrand !== 'custom') {
      toast.info(`Đã nạp bản đồ thanh ghi chuẩn của ${preset.name}`);
    } else {
      toast.info('Đã mở chế độ tùy chỉnh thanh ghi cho thiết bị mới');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.json', '.js', '.lua', '.bin', '.hex', '.py', '.txt', '.c'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(ext)) {
      toast.error('Định dạng tệp không hợp lệ (.json, .js, .lua, .bin, .hex, .py, .c, .txt)');
      e.target.value = '';
      return;
    }

    if (file.size === 0) {
      toast.error('Tệp tin rỗng');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dung lượng tệp vượt quá 5MB');
      e.target.value = '';
      return;
    }

    updateModbus({
      uploadedCode: {
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      },
    });

    toast.success(`Đã nạp mã đọc: ${file.name}`);
    e.target.value = '';
  };

  const handleRemoveUploadedCode = () => {
    updateModbus({ uploadedCode: undefined });
    toast.info('Đã gỡ mã đọc');
  };

  const isEnabled = modbus.enabled;
  const isCustom = modbus.brand === 'custom';

  return (
    <TooltipProvider>
      <div className="flex-1 flex flex-col gap-4 max-w-5xl mx-auto w-full py-1">
        {/* KHỐI 1: CHỌN HÃNG ĐỒNG HỒ & TRẠNG THÁI */}
        <section
          className={`rounded-2xl border transition-all ${
            isEnabled
              ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141824] shadow-xs'
              : 'border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#10141f]/40 opacity-75'
          } p-4 sm:p-5 space-y-4`}
        >
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  isEnabled
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-200/60 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                }`}
              >
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Thiết lập Modbus
              </h3>
            </div>

            <div className="flex items-center">
              <Switch
                id="switch-modbus-enable"
                checked={isEnabled}
                onCheckedChange={(checked) => updateModbus({ enabled: checked })}
                aria-label="Bật/tắt truyền thông Modbus"
              />
            </div>
          </div>

          <div
            className={`space-y-3.5 transition-opacity ${
              !isEnabled ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {/* 1. Hãng đồng hồ & Model */}
            <div className={`grid grid-cols-1 ${isCustom ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3.5`}>
              <div className="space-y-1.5">
                <label
                  htmlFor="select-modbus-brand"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Hãng đồng hồ
                </label>
                <select
                  id="select-modbus-brand"
                  value={modbus.brand}
                  onChange={(e) => handleBrandChange(e.target.value as ModbusBrandId)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0E121B] text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                >
                  {MODBUS_BRAND_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.id !== 'custom' ? `(${p.model})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {isCustom ? (
                <>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="input-modbus-custom-name"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Tên thiết bị mới
                    </label>
                    <input
                      id="input-modbus-custom-name"
                      type="text"
                      value={modbus.customDeviceName ?? ''}
                      onChange={(e) => updateModbus({ customDeviceName: e.target.value })}
                      placeholder="Nhập tên đồng hồ..."
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0E121B] text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="input-modbus-model"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Model thiết bị
                    </label>
                    <input
                      id="input-modbus-model"
                      type="text"
                      value={modbus.model ?? ''}
                      onChange={(e) => updateModbus({ model: e.target.value })}
                      placeholder="VD: Model XYZ..."
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#0E121B] text-xs sm:text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Dòng thiết bị
                  </label>
                  <div className="h-10 px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E121B]/50 flex items-center text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {modbus.model}
                  </div>
                </div>
              )}
            </div>

            {/* Nạp mã đọc hãng / tùy chỉnh */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mã đọc
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs">
                    Nạp tệp mã đọc/driver tùy chỉnh cho hãng (.json, .js, .lua, .bin, .hex, .py, .c, .txt, tối đa 5MB).
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                {modbus.uploadedCode ? (
                  <div className="h-9 px-3 rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center gap-2 max-w-xs">
                    <FileCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 truncate">
                      {modbus.uploadedCode.fileName}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600/70 dark:text-emerald-400/70 shrink-0">
                      ({formatFileSize(modbus.uploadedCode.fileSize)})
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveUploadedCode}
                      className="p-1 -mr-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                      title="Gỡ file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="upload-modbus-code"
                    className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-[#141824] hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer transition-all active:scale-95 shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-500" />
                    <span>Nạp mã đọc</span>
                    <input
                      id="upload-modbus-code"
                      type="file"
                      accept=".json,.js,.lua,.bin,.hex,.py,.txt,.c"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* KHỐI 2: ĐỊA CHỈ THANH GHI MODBUS (CHỈ HIỂN THỊ KHI LÀ THIẾT BỊ MỚI) */}
        {isCustom && (
        <section
          className={`rounded-2xl border transition-all ${
            isEnabled
              ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#141824] shadow-xs'
              : 'border-slate-200/70 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#10141f]/40 opacity-75'
          } p-4 sm:p-5 space-y-4`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Địa chỉ thanh ghi Modbus (Register Mapping)
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-help">
                  <HelpCircle className="w-4 h-4" />
                </span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                Nhập địa chỉ thanh ghi (thập phân) và kiểu dữ liệu theo tài liệu kỹ thuật của nhà sản xuất đồng hồ.
              </TooltipContent>
            </Tooltip>
          </div>

          <div
            className={`space-y-3.5 transition-opacity ${
              !isEnabled ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {/* HÀNG 1: LƯU LƯỢNG TỨC THỜI (FLOW RATE) */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0C0F17]/50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div className="sm:col-span-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  Lưu lượng tức thời
                </span>
                <span className="text-xs font-mono text-slate-400">m³/h</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Địa chỉ thanh ghi
                </label>
                <input
                  type="number"
                  value={modbus.flowRate.address}
                  onChange={(e) =>
                    updateRegisterField('flowRate', { address: parseInt(e.target.value) || 0 })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  placeholder="40001"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Kiểu dữ liệu
                </label>
                <select
                  value={modbus.flowRate.dataType}
                  onChange={(e) =>
                    updateRegisterField('flowRate', { dataType: e.target.value as ModbusDataType })
                  }
                  className="w-full h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  {DATA_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Hệ số nhân
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={modbus.flowRate.multiplier ?? 1}
                  onChange={(e) =>
                    updateRegisterField('flowRate', { multiplier: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  placeholder="1"
                />
              </div>
            </div>

            {/* HÀNG 2: TÍCH LŨY THUẬN (FORWARD TOTAL) */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0C0F17]/50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div className="sm:col-span-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  Tích lũy thuận
                </span>
                <span className="text-xs font-mono text-slate-400">m³</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Địa chỉ thanh ghi
                </label>
                <input
                  type="number"
                  value={modbus.forwardTotal.address}
                  onChange={(e) =>
                    updateRegisterField('forwardTotal', { address: parseInt(e.target.value) || 0 })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  placeholder="40003"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Kiểu dữ liệu
                </label>
                <select
                  value={modbus.forwardTotal.dataType}
                  onChange={(e) =>
                    updateRegisterField('forwardTotal', { dataType: e.target.value as ModbusDataType })
                  }
                  className="w-full h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  {DATA_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Hệ số nhân
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={modbus.forwardTotal.multiplier ?? 1}
                  onChange={(e) =>
                    updateRegisterField('forwardTotal', { multiplier: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  placeholder="1"
                />
              </div>
            </div>

            {/* HÀNG 3: TÍCH LŨY NGHỊCH (REVERSE TOTAL) */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0C0F17]/50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div className="sm:col-span-1">
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                  Tích lũy nghịch
                </span>
                <span className="text-xs font-mono text-slate-400">m³</span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Địa chỉ thanh ghi
                </label>
                <input
                  type="number"
                  value={modbus.reverseTotal.address}
                  onChange={(e) =>
                    updateRegisterField('reverseTotal', { address: parseInt(e.target.value) || 0 })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  placeholder="40005"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Kiểu dữ liệu
                </label>
                <select
                  value={modbus.reverseTotal.dataType}
                  onChange={(e) =>
                    updateRegisterField('reverseTotal', { dataType: e.target.value as ModbusDataType })
                  }
                  className="w-full h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  {DATA_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Hệ số nhân
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={modbus.reverseTotal.multiplier ?? 1}
                  onChange={(e) =>
                    updateRegisterField('reverseTotal', { multiplier: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  placeholder="1"
                />
              </div>
            </div>

            {/* HÀNG 4: ÁP LỰC NƯỚC (PRESSURE - TÙY CHỌN) */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0C0F17]/50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
              <div className="sm:col-span-1 flex items-center justify-between sm:justify-start gap-3">
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block">
                    Áp lực nước
                  </span>
                  <span className="text-xs font-mono text-slate-400">mH₂O</span>
                </div>
                <Switch
                  checked={modbus.pressure?.enabled ?? false}
                  onCheckedChange={(c) => updateRegisterField('pressure', { enabled: c })}
                  aria-label="Bật đọc áp lực Modbus"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Địa chỉ thanh ghi
                </label>
                <input
                  type="number"
                  disabled={!modbus.pressure?.enabled}
                  value={modbus.pressure?.address ?? 40007}
                  onChange={(e) =>
                    updateRegisterField('pressure', { address: parseInt(e.target.value) || 0 })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 disabled:opacity-40"
                  placeholder="40007"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Kiểu dữ liệu
                </label>
                <select
                  disabled={!modbus.pressure?.enabled}
                  value={modbus.pressure?.dataType ?? 'float32'}
                  onChange={(e) =>
                    updateRegisterField('pressure', { dataType: e.target.value as ModbusDataType })
                  }
                  className="w-full h-9 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none cursor-pointer disabled:opacity-40"
                >
                  {DATA_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                  Hệ số nhân
                </label>
                <input
                  type="number"
                  step="0.001"
                  disabled={!modbus.pressure?.enabled}
                  value={modbus.pressure?.multiplier ?? 1}
                  onChange={(e) =>
                    updateRegisterField('pressure', { multiplier: parseFloat(e.target.value) || 1 })
                  }
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141824] font-mono font-bold text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500 disabled:opacity-40"
                  placeholder="1"
                />
              </div>
            </div>
          </div>
        </section>
        )}
      </div>
    </TooltipProvider>
  );
}
