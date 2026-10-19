import React, { useState } from 'react';
import {
  Edit2,
  Send,
  Zap,
  Server,
  Sun,
  RefreshCw,
} from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export const TabPowerManagement: React.FC = () => {
  const {
    battery36WarningEnabled,
    setBattery36Warning,
    battery36CurrentVoltage,
    battery36SpikeThresholdMa,
    notifyServerEnabled,
    setNotifyServer,
    serverEndpoint,
    testServerNotification,
    solarWarningEnabled,
    solarMinPercent,
    solarBatteryType,
    solarNominalVoltage,
    setSolarWarning,
    solarCurrentPercent,
    solarCurrentVoltage,
  } = useSettingsStore();

  const [isEditingSolar, setIsEditingSolar] = useState(false);
  const [minPct, setMinPct] = useState(solarMinPercent);
  const [batType, setBatType] = useState(solarBatteryType);
  const [volts, setVolts] = useState(solarNominalVoltage);

  const [isEditing36, setIsEditing36] = useState(false);
  const [spikeMa, setSpikeMa] = useState(battery36SpikeThresholdMa);
  const [endpoint, setEndpoint] = useState(serverEndpoint);
  const [isTestingServer, setIsTestingServer] = useState(false);

  const handleSaveSolar = () => {
    setSolarWarning(solarWarningEnabled, minPct, batType, volts);
    setIsEditingSolar(false);
    toast.success('Đã lưu cấu hình Pin Solar!');
  };

  const handleSave36 = () => {
    setBattery36Warning(battery36WarningEnabled, spikeMa);
    setNotifyServer(notifyServerEnabled, endpoint);
    setIsEditing36(false);
    toast.success('Đã lưu cấu hình cảnh báo pin 3.6V!');
  };

  const handleRunServerTest = async () => {
    setIsTestingServer(true);
    await testServerNotification();
    setIsTestingServer(false);
  };

  const currentMa = 12.4;
  const currentRatio = Math.min(100, Math.round((currentMa / battery36SpikeThresholdMa) * 100));
  const headroomMa = Math.max(0, battery36SpikeThresholdMa - currentMa).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 1. Card: Cảnh báo tiêu thụ năng lượng bất thường (Pin 3.6V) */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Pin Dự Phòng 3.6V
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                SpIn 3.6V
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {!isEditing36 && battery36WarningEnabled && (
              <button
                type="button"
                onClick={() => {
                  setSpikeMa(battery36SpikeThresholdMa);
                  setEndpoint(serverEndpoint);
                  setIsEditing36(true);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                <span>Chỉnh sửa</span>
              </button>
            )}
            <Switch
              checked={battery36WarningEnabled}
              onCheckedChange={(c) => setBattery36Warning(c, spikeMa)}
              className="data-[state=checked]:bg-cyan-500 scale-125"
            />
          </div>
        </div>

        {/* Current Headroom Visual Meter */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono mb-2">
            <span>Dòng hiện tại: <strong className="text-emerald-400">{currentMa} mA</strong></span>
            <span className="text-slate-400">An toàn: <strong className="text-cyan-300">+{headroomMa} mA</strong></span>
            <span>Ngưỡng: <strong className="text-amber-400">{battery36SpikeThresholdMa} mA</strong></span>
          </div>

          <div className="h-3 w-full rounded-full bg-slate-950 border border-white/15 relative overflow-hidden">
            <div
              style={{ width: `${currentRatio}%` }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>0 mA</span>
            <span className="text-emerald-400 font-bold">Bình thường ({currentRatio}%)</span>
            <span>{battery36SpikeThresholdMa} mA</span>
          </div>
        </div>

        {/* Dashboard 4 ô thông số */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-5">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Điện Áp Pin 3.6V
            </span>
            <span className="text-2xl font-black text-white font-mono">
              {battery36CurrentVoltage.toFixed(2)} <span className="text-sm font-sans text-slate-400">V</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Dòng Tiêu Thụ
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {currentMa} <span className="text-sm font-sans text-emerald-300/80">mA</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Ngưỡng Spike
            </span>
            {isEditing36 ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={spikeMa}
                  onChange={(e) => setSpikeMa(parseInt(e.target.value, 10) || 35)}
                  className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-400 text-base font-bold text-white font-mono"
                />
                <span className="text-xs font-bold text-slate-300">mA</span>
              </div>
            ) : (
              <span className="text-2xl font-black text-amber-400 font-mono">
                &gt; {battery36SpikeThresholdMa} <span className="text-sm font-sans text-amber-300/80">mA</span>
              </span>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Thông Báo Máy Chủ
            </span>
            <span className="text-xl font-black text-cyan-300 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>{notifyServerEnabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}</span>
            </span>
          </div>
        </div>

        {/* Chế độ edit endpoint */}
        {isEditing36 && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Server URL:</span>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs sm:text-sm font-mono text-white focus:border-cyan-400"
                placeholder="https://iot-server.example.com/api/v1/alerts/power"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing36(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-white/10"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave36}
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/25 cursor-pointer"
              >
                Lưu
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            type="button"
            disabled={isTestingServer}
            onClick={handleRunServerTest}
            className="text-xs sm:text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-2 cursor-pointer bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/30 px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isTestingServer ? (
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Send className="w-4 h-4 text-cyan-400" />
            )}
            <span>{isTestingServer ? 'Đang gửi...' : 'Gửi test cảnh báo Server'}</span>
          </button>
        </div>
      </div>

      {/* 2. Card: Cảnh báo Pin Solar yếu */}
      <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-950/60 backdrop-blur-xl p-5 sm:p-7 shadow-[0_10px_35px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-500/15 text-yellow-400 border border-yellow-500/30">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              Pin Mặt Trời (Solar Battery)
            </h3>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {!isEditingSolar ? (
              <button
                type="button"
                onClick={() => {
                  setMinPct(solarMinPercent);
                  setBatType(solarBatteryType);
                  setVolts(solarNominalVoltage);
                  setIsEditingSolar(true);
                }}
                className="px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-300" />
                <span>Chỉnh sửa</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSolar(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white border border-white/10"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveSolar}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/25 cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            )}
            <Switch
              checked={solarWarningEnabled}
              onCheckedChange={(c) => setSolarWarning(c, minPct, batType, volts)}
              className="data-[state=checked]:bg-cyan-500 scale-125"
            />
          </div>
        </div>

        {/* Solar Battery State of Charge Meter */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono mb-2">
            <span>SOC: <strong className="text-emerald-400 text-sm">{solarCurrentPercent}%</strong></span>
            <span>Điện áp: <strong className="text-white text-sm">{solarCurrentVoltage} V</strong></span>
            <span>Ngưỡng báo động: <strong className="text-amber-400 text-sm">&lt; {solarMinPercent}%</strong></span>
          </div>

          <div className="h-3.5 w-full rounded-full bg-slate-950 border border-white/15 relative overflow-hidden p-0.5">
            <div
              style={{ width: `${solarCurrentPercent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-500"
            />
          </div>
        </div>

        {/* 4 Cards / Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-5">
          {/* 1. % Min kích hoạt */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Ngưỡng Pin Yếu
            </span>
            {isEditingSolar ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={minPct}
                    onChange={(e) => setMinPct(parseInt(e.target.value, 10) || 20)}
                    className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-400 text-base font-bold text-white font-mono"
                  />
                  <span className="text-sm font-bold text-cyan-400">%</span>
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1">
                  {[15, 20, 25, 30].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMinPct(p)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        minPct === p ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-black text-amber-400 font-mono">
                  &lt; {solarMinPercent} %
                </span>
              </div>
            )}
          </div>

          {/* 2. Loại Pin */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Loại Pin
            </span>
            {isEditingSolar ? (
              <div className="flex flex-col gap-1">
                {[
                  { id: 'LiFePO4', label: 'LiFePO4' },
                  { id: 'Lithium-Ion', label: 'Lithium-Ion NMC' },
                  { id: 'Ắc quy Gel Solar', label: 'Gel Solar' },
                  { id: 'Axit Chì', label: 'Axit Chì' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBatType(item.id)}
                    className={`px-2 py-1 rounded-lg text-left text-xs font-bold transition-all ${
                      batType === item.id
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-950 border border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <span className="text-xl font-bold text-white block">
                  {solarBatteryType}
                </span>
              </div>
            )}
          </div>

          {/* 3. Số Vol Của Pin */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Điện Áp Danh Định
            </span>
            {isEditingSolar ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={volts}
                    onChange={(e) => setVolts(parseFloat(e.target.value) || 12)}
                    className="w-20 px-2.5 py-1 rounded-lg bg-slate-950 border border-cyan-400 text-base font-bold text-white font-mono"
                  />
                  <span className="text-sm font-bold text-slate-300">V</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[12, 24, 48].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVolts(v)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        volts === v ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-black text-cyan-300 font-mono">
                  {solarNominalVoltage} V
                </span>
              </div>
            )}
          </div>

          {/* 4. Mức pin hiện tại */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Trạng Thái Thực Tế
            </span>
            <div>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {solarCurrentPercent}%
              </span>
              <span className="text-sm text-slate-300 font-mono ml-1.5">({solarCurrentVoltage}V)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

