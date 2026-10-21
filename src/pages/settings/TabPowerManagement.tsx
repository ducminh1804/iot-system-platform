import React, { useState } from 'react';
import {
  Edit2,
  Send,
  Zap,
  Server,
  Sun,
  RefreshCw,
  BatteryCharging,
  BatteryMedium,
  CheckCircle2,
  AlertTriangle,
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
    toast.success('Đã lưu cấu hình Pin Năng Lượng Mặt Trời!');
  };

  const handleSave36 = () => {
    setBattery36Warning(battery36WarningEnabled, spikeMa);
    setNotifyServer(notifyServerEnabled, endpoint);
    setIsEditing36(false);
    toast.success('Đã lưu cấu hình cảnh báo Pin 3.6V!');
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
      {/* 1. CELL A: 3.6V LITHIUM BACKUP POWER CORE */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Power Grid A // Internal Cell
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Li-SOCl2 3.6V
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Nguồn Pin Dự Phòng 3.6V &amp; Giám Sát Dòng Tải
              </h2>
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
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Hiệu chỉnh ngưỡng</span>
              </button>
            )}
            <Switch
              checked={battery36WarningEnabled}
              onCheckedChange={(c) => setBattery36Warning(c, spikeMa)}
              className="data-[state=checked]:bg-amber-500 scale-110"
            />
          </div>
        </div>

        {/* Current Headroom Visual Arc & Bar */}
        <div className="mt-5 p-4 rounded-xl bg-[#0D1014] border border-slate-800">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">
              Dòng tải đo được: <strong className="text-emerald-400 font-bold">{currentMa} mA</strong>
            </span>
            <span className="text-slate-300">
              Khoảng an toàn: <strong className="text-cyan-300">+{headroomMa} mA</strong>
            </span>
            <span className="text-slate-400">
              Ngưỡng báo động Spike: <strong className="text-amber-400">&gt; {battery36SpikeThresholdMa} mA</strong>
            </span>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-900 border border-slate-800 relative overflow-hidden flex items-center">
            <div
              style={{ width: `${currentRatio}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
            <span>0 mA (Idle)</span>
            <span className="text-emerald-400 font-bold">Dòng tải ổn định ({currentRatio}% dung sai)</span>
            <span>{battery36SpikeThresholdMa} mA (Spike Trigger)</span>
          </div>
        </div>

        {/* 4 Instrument Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Điện Áp Pin 3.6V
            </span>
            <span className="text-2xl font-black text-white font-mono">
              {battery36CurrentVoltage.toFixed(2)} <span className="text-xs text-slate-400 font-sans">V</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 block mt-1">● Tình trạng tốt (98%)</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Dòng Xả Tức Thời
            </span>
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {currentMa} <span className="text-xs text-slate-400 font-sans">mA</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">Tải động cơ van &amp; MCU</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Ngưỡng Cảnh Báo Spike
            </span>
            {isEditing36 ? (
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  type="number"
                  value={spikeMa}
                  onChange={(e) => setSpikeMa(parseInt(e.target.value, 10) || 35)}
                  className="w-16 px-2 py-0.5 rounded bg-black border border-amber-500 text-sm font-bold text-white font-mono"
                />
                <span className="text-xs font-bold text-slate-400">mA</span>
              </div>
            ) : (
              <span className="text-2xl font-black text-amber-400 font-mono">
                &gt; {battery36SpikeThresholdMa} <span className="text-xs text-slate-400 font-sans">mA</span>
              </span>
            )}
            <span className="text-[10px] font-mono text-slate-400 block mt-1">Phát hiện kẹt cơ khí</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800 flex flex-col justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Kênh Thông Báo Server
            </span>
            <span className="text-base font-black text-cyan-300 font-mono flex items-center gap-1.5 mt-1">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>{notifyServerEnabled ? 'ONLINE' : 'MUTED'}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">HTTP REST Webhook</span>
          </div>
        </div>

        {/* Edit Endpoint Form */}
        {isEditing36 && (
          <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">Webhook Endpoint:</span>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:border-amber-400 outline-hidden"
                placeholder="https://scada-api.example.com/alerts/power"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => setIsEditing36(false)}
                className="px-3 py-1 rounded text-xs font-bold text-slate-400 hover:text-white"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSave36}
                className="px-3.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black"
              >
                Lưu Cấu Hình
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            disabled={isTestingServer}
            onClick={handleRunServerTest}
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-2 cursor-pointer bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/40 px-3.5 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isTestingServer ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{isTestingServer ? 'Đang gửi bản tin thử nghiệm...' : 'Gửi Bản Tin Thử Nghiệm Webhook'}</span>
          </button>
        </div>
      </div>

      {/* 2. CELL B: SOLAR PHOTOVOLTAIC & ENERGY STORAGE ARRAY */}
      <div className="relative overflow-hidden rounded-2xl bg-[#111418] border border-slate-800 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 flex items-center justify-center shadow-lg shadow-yellow-500/10">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  Power Grid B // Photovoltaic Matrix
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {solarBatteryType}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Hệ Thống Pin Sạc Năng Lượng Mặt Trời (Solar PV)
              </h2>
            </div>
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
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Hiệu chỉnh thông số</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingSolar(false)}
                  className="px-3 py-1 rounded text-xs font-bold text-slate-400 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveSolar}
                  className="px-3.5 py-1 rounded bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black shadow-md cursor-pointer"
                >
                  Lưu
                </button>
              </div>
            )}
            <Switch
              checked={solarWarningEnabled}
              onCheckedChange={(c) => setSolarWarning(c, minPct, batType, volts)}
              className="data-[state=checked]:bg-yellow-500 scale-110"
            />
          </div>
        </div>

        {/* Circular Radial SOC & Bar Visual */}
        <div className="mt-5 p-4 rounded-xl bg-[#0D1014] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Radial Gauge SVG */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#1F2937"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#00E676"
                  strokeWidth="3.5"
                  strokeDasharray="94.2"
                  strokeDashoffset={94.2 - (94.2 * solarCurrentPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-base font-black text-white">{solarCurrentPercent}%</span>
                <span className="text-[8px] text-slate-400 uppercase">SOC</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-white">Dung Lượng Tích Trữ (State Of Charge)</h4>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Điện áp thực tế: <strong className="text-white">{solarCurrentVoltage}V</strong> / Danh định: <strong className="text-yellow-400">{solarNominalVoltage}V</strong>
              </p>
              <p className="text-[11px] text-emerald-400 font-mono mt-1">
                ● Chu kỳ nạp quang điện đang diễn ra ổn định
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs text-slate-400 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-5">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Ngưỡng báo động:</span>
              <strong className="text-amber-400 text-sm">&lt; {solarMinPercent}%</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Công nghệ pin:</span>
              <strong className="text-white text-sm">{solarBatteryType}</strong>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Ngưỡng Kích Hoạt Cảnh Báo
            </span>
            {isEditingSolar ? (
              <div className="space-y-1.5 mt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={minPct}
                    onChange={(e) => setMinPct(parseInt(e.target.value, 10) || 20)}
                    className="w-16 px-2 py-0.5 rounded bg-black border border-yellow-500 text-sm font-bold text-white font-mono"
                  />
                  <span className="text-xs font-bold text-slate-400">%</span>
                </div>
                <div className="flex items-center gap-1">
                  {[15, 20, 25, 30].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setMinPct(p)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        minPct === p ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-2xl font-black text-amber-400 font-mono">
                &lt; {solarMinPercent}%
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Hóa Học Pin (Chemistry)
            </span>
            {isEditingSolar ? (
              <div className="flex flex-col gap-1 mt-1">
                {[
                  { id: 'LiFePO4', label: 'LiFePO4 (Khuyên dùng)' },
                  { id: 'Lithium-Ion', label: 'Lithium-Ion NMC' },
                  { id: 'Ắc quy Gel Solar', label: 'Gel Solar 12V' },
                  { id: 'Axit Chì', label: 'Axit Chì' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBatType(item.id)}
                    className={`px-2 py-0.5 rounded text-left text-xs font-mono font-bold cursor-pointer ${
                      batType === item.id ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : (
              <span className="text-base font-bold text-white block mt-1">
                {solarBatteryType}
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Điện Áp Danh Định
            </span>
            {isEditingSolar ? (
              <div className="space-y-1.5 mt-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    value={volts}
                    onChange={(e) => setVolts(parseFloat(e.target.value) || 12)}
                    className="w-16 px-2 py-0.5 rounded bg-black border border-yellow-500 text-sm font-bold text-white font-mono"
                  />
                  <span className="text-xs font-bold text-slate-400">V</span>
                </div>
                <div className="flex items-center gap-1">
                  {[12, 24, 48].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVolts(v)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        volts === v ? 'bg-yellow-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v}V
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-2xl font-black text-white font-mono">
                {solarNominalVoltage} V
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#0D1014] border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Dung Lượng Khả Dụng
            </span>
            <div className="mt-1">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {solarCurrentPercent}%
              </span>
              <span className="text-xs text-slate-400 font-mono ml-1.5">({solarCurrentVoltage}V)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
