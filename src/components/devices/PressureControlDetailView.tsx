import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  PressureStationConfig,
  ActivePressureLevel,
  DEFAULT_PRESSURE_CONFIG,
  StationMetaInfo,
  formatVNNumber,
  PressureControlHeader,
  PressureLevelControls,
  PressureTelemetryGrid,
  PressureSettingsModal,
} from './pressure-control';

export { formatVNNumber };

interface PressureControlDetailViewProps {
  onBack: () => void;
}

export function PressureControlDetailView({ onBack }: PressureControlDetailViewProps) {
  // Thông tin định danh trạm (Tên - ID - Version)
  const [stationMeta, setStationMeta] = useState<StationMetaInfo>({
    name: 'Thiết bị điều khiển áp lực',
    stationId: '1015',
    version: 'version 1',
  });

  // Trạng thái hiển thị modal cài đặt
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Trạng thái mức áp đang chọn kích hoạt:
  // 0: Đóng nước (cả 3 đồng hồ về 0) | 1: Mức áp 1 | 2: Mức áp 2 | 3: Mở full
  const [activeLevel, setActiveLevel] = useState<ActivePressureLevel>(1);

  // Cấu hình tham số trạm (Settings State)
  const [config, setConfig] = useState<PressureStationConfig>(DEFAULT_PRESSURE_CONFIG);

  // Giá trị kim đồng hồ của từng mức (0 = Tắt hoàn toàn)
  const [gaugeVal1, setGaugeVal1] = useState<number>(DEFAULT_PRESSURE_CONFIG.targetP1);
  const [gaugeVal2, setGaugeVal2] = useState<number>(0);
  const [gaugeVal3, setGaugeVal3] = useState<number>(0);
  const [rtcTime, setRtcTime] = useState<string>('21-10-2026 14:27:25');

  // Thời gian gần nhất thực hiện thao tác trên từng mức
  const [lastActionTimes, setLastActionTimes] = useState<{
    1: string;
    2: string;
    3: string;
    4: string;
  }>({
    1: '21-10-2026 14:15:20',
    2: '21-10-2026 14:02:15',
    3: '21-10-2026 13:45:00',
    4: '21-10-2026 13:30:00',
  });

  // Giá trị đo đạc tương ứng với mức đang bật (Nếu activeLevel === 0 thì nước đóng)
  const currentPressureIn = 25.9;
  const currentPressureOut =
    activeLevel === 0 ? 0.0 : activeLevel === 1 ? 16.8 : activeLevel === 2 ? 20.5 : 25.5;
  const currentDeltaP = Math.abs(currentPressureIn - currentPressureOut);
  const currentFlowRate = activeLevel === 0 ? 0.0 : 49.6;
  const currentVelocity = activeLevel === 0 ? 0.0 : 0.8;
  const solarBatteryVoltage = 12.46;
  const loggerBatteryVoltage = 3.6;

  // Real-time clock update (live second ticking)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      const hh = String(now.getHours()).padStart(2, '0');
      const min = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setRtcTime(`${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getFormattedNow = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}:${ss}`;
  };

  // Xử lý khi click vào 1 trong 3 đồng hồ: Dịch kim lên mức tương ứng, 2 đồng hồ còn lại quay về 0
  const handleSelectLevel = (level: 1 | 2 | 3) => {
    const formatted = getFormattedNow();
    setActiveLevel(level);

    if (level === 1) {
      setGaugeVal1(config.targetP1);
      setGaugeVal2(0);
      setGaugeVal3(0);
      setLastActionTimes((prev) => ({ ...prev, 1: formatted }));
      toast.success('Đã gửi tín hiệu');
    } else if (level === 2) {
      setGaugeVal1(0);
      setGaugeVal2(config.targetP2);
      setGaugeVal3(0);
      setLastActionTimes((prev) => ({ ...prev, 2: formatted }));
      toast.success('Đã gửi tín hiệu');
    } else {
      setGaugeVal1(0);
      setGaugeVal2(0);
      setGaugeVal3(config.targetP3);
      setLastActionTimes((prev) => ({ ...prev, 3: formatted }));
      toast.success('Đã gửi tín hiệu');
    }
  };

  // Xử lý khi click vào ô "Đóng nước": Hạ cả 3 đồng hồ về 0, chuyển activeLevel về 0
  const handleShutoffWater = () => {
    const formatted = getFormattedNow();
    setActiveLevel(0);
    setGaugeVal1(0);
    setGaugeVal2(0);
    setGaugeVal3(0);
    setLastActionTimes((prev) => ({ ...prev, 4: formatted }));
    toast.success('Đã gửi tín hiệu');
  };

  // Lưu cấu hình từ modal cài đặt
  const handleSaveSettings = () => {
    if (activeLevel === 1) setGaugeVal1(config.targetP1);
    else if (activeLevel === 2) setGaugeVal2(config.targetP2);
    else if (activeLevel === 3) setGaugeVal3(config.targetP3);

    toast.success('Đã gửi tín hiệu');
    setIsSettingsOpen(false);
  };

  // Khôi phục mặc định
  const handleResetDefaults = () => {
    setConfig(DEFAULT_PRESSURE_CONFIG);
    toast.success('Đã gửi tín hiệu');
  };

  // Đồng bộ RTC ngay lập tức
  const handleSyncRTC = () => {
    setRtcTime(getFormattedNow());
    toast.success('Đã gửi tín hiệu');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between min-h-0 select-none overflow-hidden space-y-1.5 sm:space-y-2.5 lg:space-y-3">
      {/* 1. TOP HEADER BAR */}
      <PressureControlHeader
        stationName={stationMeta.name}
        stationId={stationMeta.stationId}
        version={stationMeta.version}
        ratio0={config.ratio0}
        ratio90={config.ratio90}
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
        onBack={onBack}
      />

      {/* 2. MAIN MONITOR VIEW */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        <div className="w-full h-full flex flex-col justify-between space-y-1.5 sm:space-y-2.5 lg:space-y-3">
          {/* Middle Row: 3 Gauges + Water Shutoff Card */}
          <PressureLevelControls
            activeLevel={activeLevel}
            gaugeVal1={gaugeVal1}
            gaugeVal2={gaugeVal2}
            gaugeVal3={gaugeVal3}
            lastActionTimes={lastActionTimes}
            onSelectLevel={handleSelectLevel}
            onShutoffWater={handleShutoffWater}
          />

          {/* Bottom Row: 3 Telemetry Cards */}
          <PressureTelemetryGrid
            currentFlowRate={currentFlowRate}
            currentVelocity={currentVelocity}
            currentPressureIn={currentPressureIn}
            currentPressureOut={currentPressureOut}
            currentDeltaP={currentDeltaP}
            rtcTime={rtcTime}
            solarBatteryVoltage={solarBatteryVoltage}
            loggerBatteryVoltage={loggerBatteryVoltage}
          />
        </div>
      </div>

      {/* 3. SETTINGS MODAL CENTERED DIALOG */}
      <PressureSettingsModal
        isOpen={isSettingsOpen}
        stationMeta={stationMeta}
        onUpdateStationMeta={setStationMeta}
        config={config}
        rtcTime={rtcTime}
        onChangeConfig={setConfig}
        onSave={handleSaveSettings}
        onResetDefaults={handleResetDefaults}
        onSyncRTC={handleSyncRTC}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
