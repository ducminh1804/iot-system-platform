import React from 'react';
import {
  SlidersHorizontal,
  RefreshCw,
  Save,
  X,
  Gauge,
  ShieldAlert,
  Activity,
  Zap,
} from 'lucide-react';
import { PressureStationConfig } from './types';

interface PressureSettingsModalProps {
  isOpen: boolean;
  config: PressureStationConfig;
  rtcTime: string;
  onChangeConfig: (updater: (prev: PressureStationConfig) => PressureStationConfig) => void;
  onSave: () => void;
  onResetDefaults: () => void;
  onSyncRTC: () => void;
  onClose: () => void;
}

export function PressureSettingsModal({
  isOpen,
  config,
  rtcTime,
  onChangeConfig,
  onSave,
  onResetDefaults,
  onSyncRTC,
  onClose,
}: PressureSettingsModalProps) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 transition-all duration-300 ease-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop: Làm mờ nền sâu */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Window: Centered, Expansive (98vw x 95vh, max-w-[2400px]), smooth scale/translate animation */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-[98vw] max-w-[2400px] h-[93vh] sm:h-[95vh] bg-white dark:bg-[#12151E] rounded-[24px] sm:rounded-[30px] border border-slate-200/90 dark:border-slate-800/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out transform ${
          isOpen
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-95 opacity-0 translate-y-3 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shrink-0 px-5 sm:px-8 py-3.5 sm:py-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-[#151924]/70">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Cài Đặt Cấu Hình Trạm 1015
                </h3>
                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold font-mono bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Modbus RTU
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Online
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 mt-0.5">
                Hiệu chỉnh giá trị đặt mức áp, ngưỡng cảnh báo an toàn & chu kỳ truyền thông Modbus
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onResetDefaults}
              className="hidden sm:flex px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold items-center gap-2 transition-colors cursor-pointer"
              title="Khôi phục mặc định"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Mặc định</span>
            </button>
            <button
              type="button"
              onClick={onSave}
              className="hidden sm:flex px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Lưu cấu hình"
            >
              <Save className="w-4 h-4" />
              <span>Lưu cấu hình</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
              title="Đóng (Thoát)"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body: 4 Configuration Cards in spacious 4-column grid (h-full stretched) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-7 flex flex-col">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 min-h-full">
            {/* Card 1: Cấu hình Mức Áp & Góc Van */}
            <div className="h-full rounded-[24px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
              <div className="shrink-0 flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Mức Áp & Góc Van
                  </h4>
                  <p className="text-[11px] text-slate-400">Giá trị đặt mục tiêu</p>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col justify-between space-y-3 sm:space-y-4 py-3 sm:py-4">
                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Mức áp 1 (Target P1 – mH₂O):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.targetP1}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({
                        ...prev,
                        targetP1: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Mức áp 2 (Target P2 – mH₂O):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.targetP2}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({
                        ...prev,
                        targetP2: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Mở full (Target P3 – %):
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={config.targetP3}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({
                        ...prev,
                        targetP3: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                    Tỉ lệ Calib van (Góc 0° / 90°):
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    <input
                      type="text"
                      value={config.ratio0}
                      onChange={(e) =>
                        onChangeConfig((prev) => ({ ...prev, ratio0: e.target.value }))
                      }
                      placeholder="0:1.5"
                      className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
                    />
                    <input
                      type="text"
                      value={config.ratio90}
                      onChange={(e) =>
                        onChangeConfig((prev) => ({ ...prev, ratio90: e.target.value }))
                      }
                      placeholder="90:1.0"
                      className="w-full h-10 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-300 shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Ngưỡng Cảnh Báo An Toàn */}
            <div className="h-full rounded-[24px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
              <div className="shrink-0 flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Ngưỡng Cảnh Báo
                  </h4>
                  <p className="text-[11px] text-slate-400">Giới hạn an toàn & Trip</p>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col justify-between space-y-3 sm:space-y-4 py-3 sm:py-4">
                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Áp suất vào cực đại (P_In Max – mH₂O):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.alarmPInHigh}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({
                        ...prev,
                        alarmPInHigh: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Áp suất ra cực đại (P_Out Max – mH₂O):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.alarmPOutHigh}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({
                        ...prev,
                        alarmPOutHigh: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Chênh áp cực đại ΔP (Headloss – mH₂O):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.alarmDeltaP}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({
                        ...prev,
                        alarmDeltaP: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.autoShutoff}
                      onChange={(e) =>
                        onChangeConfig((prev) => ({ ...prev, autoShutoff: e.target.checked }))
                      }
                      className="w-5 h-5 rounded-md text-rose-600 accent-rose-600 cursor-pointer"
                    />
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Tự ngắt van khi vượt ngưỡng
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Card 3: Truyền Thông Modbus & Chu Kỳ */}
            <div className="h-full rounded-[24px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
              <div className="shrink-0 flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Truyền Thông Modbus
                  </h4>
                  <p className="text-[11px] text-slate-400">Chu kỳ & Thông số cổng</p>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col justify-between space-y-3 sm:space-y-4 py-3 sm:py-4">
                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Chu kỳ gửi tin (Telemetry Interval):
                  </label>
                  <select
                    value={config.reportInterval}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({ ...prev, reportInterval: e.target.value }))
                    }
                    className="w-full h-11 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="5s">5 giây (Real-time cao tần)</option>
                    <option value="10s">10 giây (Tiêu chuẩn SCADA)</option>
                    <option value="30s">30 giây</option>
                    <option value="60s">60 giây (Tiết kiệm năng lượng)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Modbus Slave ID:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="247"
                    value={config.modbusId}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({
                        ...prev,
                        modbusId: parseInt(e.target.value) || 1,
                      }))
                    }
                    className="w-full h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Tốc độ Baud Rate:
                  </label>
                  <select
                    value={config.baudRate}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({ ...prev, baudRate: e.target.value }))
                    }
                    className="w-full h-11 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all shadow-2xs cursor-pointer"
                  >
                    <option value="4800">4800 bps</option>
                    <option value="9600">9600 bps (Chuẩn)</option>
                    <option value="19200">19200 bps</option>
                    <option value="115200">115200 bps</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs sm:text-[13px]">
                  <span className="text-slate-400 font-medium">Cổng kết nối:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">RS485-COM1</span>
                </div>
              </div>
            </div>

            {/* Card 4: Hệ Thống & Đồng Bộ RTC */}
            <div className="h-full rounded-[24px] bg-slate-50/70 dark:bg-[#141822] border border-slate-200/90 dark:border-slate-800/90 p-4 sm:p-5 lg:p-6 shadow-xs flex flex-col justify-between overflow-hidden transition-colors">
              <div className="shrink-0 flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Hệ Thống & RTC
                  </h4>
                  <p className="text-[11px] text-slate-400">Đồng hồ & Nguồn nuôi</p>
                </div>
              </div>

              <div className="flex-1 min-h-0 flex flex-col justify-between space-y-3 sm:space-y-4 py-3 sm:py-4">
                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Đồng hồ RTC bo mạch:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-xs sm:text-sm font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center truncate shadow-2xs">
                      {rtcTime}
                    </div>
                    <button
                      type="button"
                      onClick={onSyncRTC}
                      className="h-11 px-3.5 sm:px-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer text-xs font-bold shrink-0 flex items-center justify-center"
                      title="Đồng bộ RTC với giờ máy tính"
                    >
                      Đồng bộ
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-[13px] font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Cảnh báo pin yếu (Low Battery – V):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={config.lowBattery}
                    onChange={(e) =>
                      onChangeConfig((prev) => ({
                        ...prev,
                        lowBattery: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0E14] text-sm font-mono font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all shadow-2xs"
                  />
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={config.rtcAutoSync}
                      onChange={(e) =>
                        onChangeConfig((prev) => ({ ...prev, rtcAutoSync: e.target.checked }))
                      }
                      className="w-5 h-5 rounded-md text-blue-600 accent-blue-600 cursor-pointer"
                    />
                    <span className="text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                      Tự động đồng bộ giờ NTP
                    </span>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs sm:text-[13px]">
                  <span className="text-slate-400 font-medium">Firmware:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">v1.0.4-build2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 px-6 sm:px-8 py-3.5 sm:py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#151924]/70 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">
              Trạng thái Modbus:{' '}
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">RS485-COM1 (Active)</strong> • Trạm ID:{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-mono">1015</strong> • Giờ trạm:{' '}
              <strong className="font-mono text-slate-700 dark:text-slate-300">{rtcTime}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onResetDefaults}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Khôi phục mặc định"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Mặc định</span>
            </button>
            <button
              type="button"
              onClick={onSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Lưu cấu hình"
            >
              <Save className="w-4 h-4" />
              <span>Lưu cấu hình</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
