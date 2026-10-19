import { create } from 'zustand';
import { toast } from 'sonner';

export interface RtcScheduleStage {
  id: number;
  name: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  targetLevel: 1 | 2 | 3;
}

export interface CycleIntervalStage {
  id: number;
  name: string;
  enabled: boolean;
  runDurationMin: number;
  pauseDurationMin: number;
  targetLevel: 1 | 2 | 3;
}

export interface PressureStepConfig {
  id: number;
  name: string;
  enabled: boolean;
  minPressureBar: number;
  maxPressureBar: number;
  targetLevel: 1 | 2 | 3;
}

export interface SettingsState {
  // 1. Cấu hình cách thức điều khiển
  controlMode: 'manual' | 'rtc' | 'pressure_adaptive';
  inletOverrideEnabled: boolean; // Cần gạt vận hành dựa theo áp suất đầu vào
  inletThresholdBar: number; // Ngưỡng áp lực In (vd: 1.4 bar)
  inletCycleMinutes: number; // Chu kỳ kiểm tra (vd: 5 phút)
  inletAction: 'FULL' | 'LEVEL_2' | 'LEVEL_1'; // Hành động: mở xả tràn - mở full
  
  // Hẹn giờ thời gian thực (5 Giai đoạn như web cũ)
  rtcStages: RtcScheduleStage[];
  cycleStages: CycleIntervalStage[];

  // 2. Calib cảm biến áp lực
  calibRangeMin: number;
  calibRangeMax: number; // vd: 0 - 10 bar
  calibUnit: 'Bar' | 'mH2O' | 'kPa' | 'PSI';
  zeroConfirmed: boolean;
  zeroOffsetMv: number;
  point1Confirmed: boolean; // Mặc định bắt buộc phải xác nhận
  point1ValueBar: number;
  point2Confirmed: boolean; // Tùy chọn
  point2ValueBar: number;
  lastCalibratedDate: string;

  // Cảnh báo tiêu thụ năng lượng bất thường (Pin 3.6V)
  battery36WarningEnabled: boolean;
  battery36CurrentVoltage: number;
  battery36SpikeThresholdMa: number;
  notifyServerEnabled: boolean; // Thông báo về server
  serverEndpoint: string;

  // Cảnh báo pin Solar yếu
  solarWarningEnabled: boolean;
  solarMinPercent: number; // % min để kích hoạt cảnh báo
  solarBatteryType: string; // Loại pin: LiFePO4, Lithium-ion, Gel Solar, Lead-Acid
  solarNominalVoltage: number; // Số vol của pin: 12V, 24V, 48V...
  solarCurrentPercent: number;
  solarCurrentVoltage: number;

  // 4. Cảnh báo lưu lượng, áp suất thất thường & Học dữ liệu 7 ngày
  masterAnomalyEnabled: boolean; // Nút gạt chung cho tất cả thiết bị
  anomalyDeviationPercent: number; // Mức % so sánh so với data quá khứ (vd: 20%)
  anomalyPressureDeviationPercent: number;
  nonMonitoringDays: number[]; // Lập lịch không quan sát dữ liệu trong ngày nào: 0=CN, 1=T2,... 6=T7
  globalResetTimestamp: string | null;

  // Riêng thiết bị ID 1015
  device1015LearningDay: number; // Thu thập 7 ngày: vd đang ngày 4/7
  device1015TotalSamples: number;
  device1015IsLearningComplete: boolean;
  device1015LastReset: string;

  // Web cũ: Cài đặt áp suất bảo vệ & Tự động
  floodProtectionEnabled: boolean;
  floodThresholdBar: number;
  pressureStopEnabled: boolean;
  stopLowPressureBar: number;
  pressureSteps: PressureStepConfig[];

  // Actions
  setControlMode: (mode: 'manual' | 'rtc' | 'pressure_adaptive') => void;
  setInletOverrideEnabled: (val: boolean) => void;
  setInletThresholdBar: (val: number) => void;
  setInletCycleMinutes: (val: number) => void;
  toggleRtcStage: (id: number) => void;
  updateRtcStage: (id: number, partial: Partial<RtcScheduleStage>) => void;
  
  // Calib actions
  setCalibRange: (min: number, max: number, unit?: 'Bar' | 'mH2O' | 'kPa' | 'PSI') => void;
  confirmZeroPoint: () => void;
  confirmPoint1: (value: number) => void;
  confirmPoint2: (value: number) => void;
  resetCalibration: () => void;

  // Battery actions
  setBattery36Warning: (enabled: boolean, spikeThreshold?: number) => void;
  setNotifyServer: (enabled: boolean, endpoint?: string) => void;
  testServerNotification: () => Promise<boolean>;
  setSolarWarning: (enabled: boolean, minPercent: number, batteryType: string, nominalVoltage: number) => void;

  // Anomaly actions
  setMasterAnomalyEnabled: (val: boolean) => void;
  setAnomalyDeviationPercent: (flowPct: number, pressPct?: number) => void;
  toggleNonMonitoringDay: (day: number) => void;
  resetGlobalSystem: () => void;
  resetDevice1015Baseline: () => void;

  // Legacy actions
  togglePressureStep: (id: number) => void;
  updatePressureStep: (id: number, partial: Partial<PressureStepConfig>) => void;
  setFloodProtection: (enabled: boolean, threshold: number) => void;
  setPressureStop: (enabled: boolean, threshold: number) => void;
  
  // General Save
  saveAllSettings: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // 1. Cách thức điều khiển
  controlMode: 'rtc',
  inletOverrideEnabled: true,
  inletThresholdBar: 1.4, // Dưới ngưỡng 1.4 bar
  inletCycleMinutes: 5, // Chu kỳ 5 phút
  inletAction: 'FULL', // Mở ra xả tràn - Mở full

  // 5 Giai đoạn hẹn giờ RTC từ web cũ
  rtcStages: [
    { id: 1, name: 'Giai đoạn 1', enabled: true, startTime: '05:00', endTime: '09:00', targetLevel: 2 },
    { id: 2, name: 'Giai đoạn 2', enabled: true, startTime: '09:00', endTime: '16:30', targetLevel: 1 },
    { id: 3, name: 'Giai đoạn 3', enabled: false, startTime: '16:30', endTime: '21:00', targetLevel: 2 },
    { id: 4, name: 'Giai đoạn 4', enabled: false, startTime: '21:00', endTime: '23:30', targetLevel: 3 },
    { id: 5, name: 'Giai đoạn 5', enabled: false, startTime: '23:30', endTime: '05:00', targetLevel: 1 },
  ],

  cycleStages: [
    { id: 1, name: 'Khoảng chu kỳ 1', enabled: true, runDurationMin: 45, pauseDurationMin: 15, targetLevel: 2 },
    { id: 2, name: 'Khoảng chu kỳ 2', enabled: false, runDurationMin: 30, pauseDurationMin: 30, targetLevel: 1 },
    { id: 3, name: 'Khoảng chu kỳ 3', enabled: false, runDurationMin: 60, pauseDurationMin: 20, targetLevel: 3 },
  ],

  // 2. Calib cảm biến áp lực
  calibRangeMin: 0.0,
  calibRangeMax: 10.0, // 0 - 10 Bar
  calibUnit: 'Bar',
  zeroConfirmed: true,
  zeroOffsetMv: 4.02,
  point1Confirmed: true, // Mặc định phải xác nhận
  point1ValueBar: 5.0,
  point2Confirmed: false, // Tùy chọn
  point2ValueBar: 9.0,
  lastCalibratedDate: '12/10/2026 09:15',

  // 3. Pin 3.6V & Server alert
  battery36WarningEnabled: true,
  battery36CurrentVoltage: 3.62,
  battery36SpikeThresholdMa: 35,
  notifyServerEnabled: true,
  serverEndpoint: 'https://api.hydrolix.iot/v1/telemetry/alarms/battery-drain',

  // Pin Solar
  solarWarningEnabled: true,
  solarMinPercent: 20, // % min để kích hoạt cảnh báo
  solarBatteryType: 'LiFePO4 (Lithium Iron Phosphate)',
  solarNominalVoltage: 12.0, // 12V
  solarCurrentPercent: 78,
  solarCurrentVoltage: 13.2,

  // 4. Cảnh báo thất thường & Học 7 ngày
  masterAnomalyEnabled: true,
  anomalyDeviationPercent: 20, // Lệch 20% so với quá khứ
  anomalyPressureDeviationPercent: 15,
  nonMonitoringDays: [0, 6], // Mặc định bỏ qua Chủ Nhật (0) và Thứ 7 (6)
  globalResetTimestamp: null,

  // Thiết bị 1015
  device1015LearningDay: 4, // Đang học ngày 4/7
  device1015TotalSamples: 4892,
  device1015IsLearningComplete: false,
  device1015LastReset: '10/10/2026 08:00',

  // Web cũ bổ sung
  floodProtectionEnabled: true,
  floodThresholdBar: 1.4,
  pressureStopEnabled: false,
  stopLowPressureBar: 0.5,
  pressureSteps: [
    { id: 1, name: 'Mức áp 1', enabled: true, minPressureBar: 1.0, maxPressureBar: 2.2, targetLevel: 1 },
    { id: 2, name: 'Mức áp 2', enabled: true, minPressureBar: 2.2, maxPressureBar: 3.8, targetLevel: 2 },
    { id: 3, name: 'Mức áp 3', enabled: false, minPressureBar: 3.8, maxPressureBar: 6.0, targetLevel: 3 },
  ],

  // Implementations
  setControlMode: (mode) => {
    set({ controlMode: mode });
    const label = mode === 'manual' ? 'Thủ công' : mode === 'rtc' ? 'Hẹn giờ thời gian thực' : 'Tự động thích ứng áp suất';
    toast.info(`Chế độ điều khiển chuyển sang: ${label}`);
  },

  setInletOverrideEnabled: (val) => {
    set({ inletOverrideEnabled: val });
    if (val) {
      toast.warning('Đã kích hoạt ưu tiên xả tràn theo áp suất đầu vào. RTC sẽ tự động vô hiệu hóa khi áp In < ngưỡng.');
    } else {
      toast.info('Đã tắt ưu tiên xả tràn. Hệ thống chạy theo lịch RTC bình thường.');
    }
  },

  setInletThresholdBar: (val) => set({ inletThresholdBar: val }),
  setInletCycleMinutes: (val) => set({ inletCycleMinutes: val }),

  toggleRtcStage: (id) => {
    set((state) => ({
      rtcStages: state.rtcStages.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  },

  updateRtcStage: (id, partial) => {
    set((state) => ({
      rtcStages: state.rtcStages.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    }));
  },

  setCalibRange: (min, max, unit) => {
    set((state) => ({
      calibRangeMin: min,
      calibRangeMax: max,
      calibUnit: unit || state.calibUnit,
    }));
    toast.success(`Đã cập nhật dải đo cảm biến: ${min} - ${max} ${unit || get().calibUnit}`);
  },

  confirmZeroPoint: () => {
    set({ zeroConfirmed: true, lastCalibratedDate: new Date().toLocaleString('vi-VN') });
    toast.success('Xác nhận mức áp 0 Bar thành công! Đã lưu điểm mốc Zero Offset.');
  },

  confirmPoint1: (value) => {
    set({ point1Confirmed: true, point1ValueBar: value, lastCalibratedDate: new Date().toLocaleString('vi-VN') });
    toast.success(`Xác nhận mức áp 1 (${value} Bar) thành công! Điểm chuẩn bắt buộc đã hoàn tất.`);
  },

  confirmPoint2: (value) => {
    set({ point2Confirmed: true, point2ValueBar: value, lastCalibratedDate: new Date().toLocaleString('vi-VN') });
    toast.success(`Xác nhận mức áp 2 (${value} Bar - Tùy chọn) thành công! Đã tối ưu đường cong phi tuyến.`);
  },

  resetCalibration: () => {
    set({
      calibRangeMin: 0.0,
      calibRangeMax: 10.0,
      calibUnit: 'Bar',
      zeroConfirmed: true,
      point1Confirmed: true,
      point1ValueBar: 5.0,
      point2Confirmed: false,
      point2ValueBar: 9.0,
      lastCalibratedDate: new Date().toLocaleString('vi-VN'),
    });
    toast.info('Đã khôi phục cài đặt calib về thông số xuất xưởng.');
  },

  setBattery36Warning: (enabled, spikeThreshold) => {
    set((state) => ({
      battery36WarningEnabled: enabled,
      battery36SpikeThresholdMa: spikeThreshold ?? state.battery36SpikeThresholdMa,
    }));
    toast.success(`Cảnh báo nguồn pin 3.6V: ${enabled ? 'BẬT' : 'TẮT'}`);
  },

  setNotifyServer: (enabled, endpoint) => {
    set((state) => ({
      notifyServerEnabled: enabled,
      serverEndpoint: endpoint ?? state.serverEndpoint,
    }));
  },

  testServerNotification: async () => {
    toast.loading('Đang gửi gói tin cảnh báo giả lập về Server...', { id: 'test-srv' });
    await new Promise((r) => setTimeout(r, 900));
    toast.success('Server đã phản hồi 200 OK! Gói tin cảnh báo pin 3.6V truyền dẫn thành công.', { id: 'test-srv' });
    return true;
  },

  setSolarWarning: (enabled, minPercent, batteryType, nominalVoltage) => {
    set({
      solarWarningEnabled: enabled,
      solarMinPercent: minPercent,
      solarBatteryType: batteryType,
      solarNominalVoltage: nominalVoltage,
    });
    toast.success('Đã lưu cấu hình giám sát Pin Solar thành công!');
  },

  setMasterAnomalyEnabled: (val) => {
    set({ masterAnomalyEnabled: val });
    if (val) {
      toast.success('Đã BẬT giám sát thất thường toàn hệ thống (Áp dụng cho tất cả thiết bị).');
    } else {
      toast.warning('Đã TẮT giám sát thất thường toàn hệ thống.');
    }
  },

  setAnomalyDeviationPercent: (flowPct, pressPct) => {
    set((state) => ({
      anomalyDeviationPercent: flowPct,
      anomalyPressureDeviationPercent: pressPct ?? state.anomalyPressureDeviationPercent,
    }));
    toast.info(`Cập nhật ngưỡng so sánh dữ liệu quá khứ: Lưu lượng ±${flowPct}%, Áp suất ±${pressPct ?? get().anomalyPressureDeviationPercent}%`);
  },

  toggleNonMonitoringDay: (day) => {
    set((state) => {
      const exists = state.nonMonitoringDays.includes(day);
      const nextDays = exists ? state.nonMonitoringDays.filter((d) => d !== day) : [...state.nonMonitoringDays, day];
      return { nonMonitoringDays: nextDays };
    });
  },

  resetGlobalSystem: () => {
    const now = new Date().toLocaleString('vi-VN');
    set({
      globalResetTimestamp: now,
      device1015LearningDay: 1,
      device1015TotalSamples: 12,
      device1015IsLearningComplete: false,
      device1015LastReset: now,
    });
    toast.error('ĐÃ RESET TOÀN BỘ HỆ THỐNG! Tất cả baseline 7 ngày đã bị xóa và bắt đầu thu thập lại từ Ngày 1.');
  },

  resetDevice1015Baseline: () => {
    const now = new Date().toLocaleString('vi-VN');
    set({
      device1015LearningDay: 1,
      device1015TotalSamples: 8,
      device1015IsLearningComplete: false,
      device1015LastReset: now,
    });
    toast.warning('Đã Reset dữ liệu học riêng cho Thiết bị 1015! Hệ thống bắt đầu tính lại từ đầu đủ 7 ngày.');
  },

  togglePressureStep: (id) => {
    set((state) => ({
      pressureSteps: state.pressureSteps.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)),
    }));
  },

  updatePressureStep: (id, partial) => {
    set((state) => ({
      pressureSteps: state.pressureSteps.map((s) => (s.id === id ? { ...s, ...partial } : s)),
    }));
  },

  setFloodProtection: (enabled, threshold) => {
    set({ floodProtectionEnabled: enabled, floodThresholdBar: threshold });
  },

  setPressureStop: (enabled, threshold) => {
    set({ pressureStopEnabled: enabled, stopLowPressureBar: threshold });
  },

  saveAllSettings: () => {
    toast.success('Tất cả cấu hình cài đặt đã được nạp và đồng bộ xuống Thiết Bị 1015 qua sóng RF!');
  },
}));
