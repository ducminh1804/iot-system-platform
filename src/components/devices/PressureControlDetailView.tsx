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
  ControlModeId,
} from './pressure-control';

import { DeviceStation } from './mockDeviceData';

export { formatVNNumber };

interface PressureControlDetailViewProps {
  onBack: () => void;
  station?: DeviceStation | null;
}

export function PressureControlDetailView({ onBack, station }: PressureControlDetailViewProps) {
  // Thông tin định danh trạm (Tên - ID - Version)
  const [stationMeta, setStationMeta] = useState<StationMetaInfo>({
    name: station?.name || 'Thiết bị điều khiển áp lực',
    stationId: station?.stationId || '1015',
    version: station?.version || 'version 1',
  });

  useEffect(() => {
    if (station) {
      setStationMeta({
        name: station.name,
        stationId: station.stationId,
        version: station.version || 'version 1',
      });
    }
  }, [station]);

  // Trạng thái hiển thị modal cài đặt
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Trạng thái mức áp đang chọn kích hoạt:
  // 0: Đóng nước (cả 3 đồng hồ về 0) | 1: Mức áp 1 | 2: Mức áp 2 | 3: Mở full
  const [activeLevel, setActiveLevel] = useState<ActivePressureLevel>(1);
  // Lưu mức áp hoạt động trước đó để khôi phục khi click lần 2 tắt Đóng nước
  const [prevLevel, setPrevLevel] = useState<1 | 2 | 3>(1);

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
    const activeMode = config.controlMechanism?.activeMode ?? 'schedule_rtc';
    if (activeMode === 'schedule_rtc' || activeMode === 'input_pressure_priority') {
      const modeNames: Record<string, string> = {
        schedule_rtc: 'Hẹn giờ RTC',
        input_pressure_priority: 'Ưu tiên áp suất',
      };
      const modeName = modeNames[activeMode] || 'Tự động';
      toast.warning(`Trạm đang chạy chế độ ${modeName}. Chỉ điều khiển được ở chế độ Thủ công.`);
      return;
    }

    const formatted = getFormattedNow();
    setActiveLevel(level);
    setPrevLevel(level);

    if (level === 1) {
      setGaugeVal1(config.targetP1);
      setGaugeVal2(0);
      setGaugeVal3(0);
      setLastActionTimes((prev) => ({ ...prev, 1: formatted }));
      toast.success('Đã kích hoạt Mức áp 1');
    } else if (level === 2) {
      setGaugeVal1(0);
      setGaugeVal2(config.targetP2);
      setGaugeVal3(0);
      setLastActionTimes((prev) => ({ ...prev, 2: formatted }));
      toast.success('Đã kích hoạt Mức áp 2');
    } else {
      setGaugeVal1(0);
      setGaugeVal2(0);
      setGaugeVal3(config.targetP3);
      setLastActionTimes((prev) => ({ ...prev, 3: formatted }));
      toast.success('Đã kích hoạt Mở full');
    }
  };

  // Xử lý khi click vào ô "Đóng nước":
  // - Nếu đang mở (activeLevel !== 0): Đóng nước (activeLevel = 0)
  // - Nếu đã đang đóng (activeLevel === 0): Click lần 2 sẽ tắt đóng nước, mở lại mức áp trước đó!
  const handleShutoffWater = () => {
    const formatted = getFormattedNow();

    if (activeLevel === 0) {
      // Click lần 2: Tắt chế độ đóng nước, khôi phục lại mức áp trước đó
      const resumeLevel = prevLevel || 1;
      setActiveLevel(resumeLevel);

      if (resumeLevel === 1) {
        setGaugeVal1(config.targetP1);
        setGaugeVal2(0);
        setGaugeVal3(0);
        setLastActionTimes((prev) => ({ ...prev, 1: formatted }));
        toast.success('Đã mở nước lại (Mức áp 1)');
      } else if (resumeLevel === 2) {
        setGaugeVal1(0);
        setGaugeVal2(config.targetP2);
        setGaugeVal3(0);
        setLastActionTimes((prev) => ({ ...prev, 2: formatted }));
        toast.success('Đã mở nước lại (Mức áp 2)');
      } else {
        setGaugeVal1(0);
        setGaugeVal2(0);
        setGaugeVal3(config.targetP3);
        setLastActionTimes((prev) => ({ ...prev, 3: formatted }));
        toast.success('Đã mở nước lại (Mở full)');
      }
    } else {
      // Đang chạy bình thường -> Click để Đóng nước
      setPrevLevel(activeLevel);
      setActiveLevel(0);
      setGaugeVal1(0);
      setGaugeVal2(0);
      setGaugeVal3(0);
      setLastActionTimes((prev) => ({ ...prev, 4: formatted }));
      toast.success('Đã đóng nước trạm');
    }
  };

  // Lưu cấu hình từ modal cài đặt
  const handleSaveSettings = () => {
    if (activeLevel === 1) setGaugeVal1(config.targetP1);
    else if (activeLevel === 2) setGaugeVal2(config.targetP2);
    else if (activeLevel === 3) setGaugeVal3(config.targetP3);

    toast.success('Đã lưu cấu hình trạm thành công');
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
        rtcTime={rtcTime}
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
        currentFlowRate={currentFlowRate}
        currentSolarVoltage={solarBatteryVoltage}
        currentLoggerVoltage={loggerBatteryVoltage}
        currentPressureIn={currentPressureIn}
        currentPressureOut={currentPressureOut}
        onChangeConfig={setConfig}
        onSave={handleSaveSettings}
        onResetDefaults={handleResetDefaults}
        onSyncRTC={handleSyncRTC}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
