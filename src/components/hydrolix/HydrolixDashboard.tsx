import React, { useState, useEffect } from 'react';
import { MOCK_TURBINES, TurbineTelemetry } from './types';
import { HydrolixSidebar } from './HydrolixSidebar';
import { HydrolixHeader } from './HydrolixHeader';
import { TurbineHeroViewport } from './TurbineHeroViewport';
import { PressureControlCard } from './PressureControlCard';
import { RealTimePowerCard } from './RealTimePowerCard';
import { WeatherAndTempCard } from './WeatherAndTempCard';
import { WindInformationCard } from './WindInformationCard';
import { OverviewCard } from './OverviewCard';
import { SpeedometerGauge } from './SpeedometerGauge';
import { Activity, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const HydrolixDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTurbineId, setSelectedTurbineId] = useState<string>('T-05');
  const [viewportMode, setViewportMode] = useState<'camera' | 'model'>('camera');
  const [showGaugeModal, setShowGaugeModal] = useState<boolean>(false);
  const [turbineData, setTurbineData] = useState<TurbineTelemetry>(() => {
    return MOCK_TURBINES.find((t) => t.id === 'T-05') || MOCK_TURBINES[0];
  });

  // Handle turbine change
  const handleSelectTurbine = (id: string) => {
    setSelectedTurbineId(id);
    const found = MOCK_TURBINES.find((t) => t.id === id);
    if (found) {
      setTurbineData(found);
      toast.info(`Switched view to ${found.name}`, { duration: 2000 });
    }
  };

  const handlePrevTurbine = () => {
    const currentIndex = MOCK_TURBINES.findIndex((t) => t.id === selectedTurbineId);
    const prevIndex = (currentIndex - 1 + MOCK_TURBINES.length) % MOCK_TURBINES.length;
    handleSelectTurbine(MOCK_TURBINES[prevIndex].id);
  };

  const handleNextTurbine = () => {
    const currentIndex = MOCK_TURBINES.findIndex((t) => t.id === selectedTurbineId);
    const nextIndex = (currentIndex + 1) % MOCK_TURBINES.length;
    handleSelectTurbine(MOCK_TURBINES[nextIndex].id);
  };

  // Subtle real-time live telemetry tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTurbineData((prev) => {
        // Small random fluctuations around current values
        const deltaPower = (Math.random() - 0.5) * 4;
        const newKw = Math.round((prev.realtimePower.currentKw + deltaPower) * 10) / 10;
        const newWind = Math.round((prev.wind.windSpeed + (Math.random() - 0.5) * 0.2) * 10) / 10;

        return {
          ...prev,
          power10m: Math.round((prev.power10m + (Math.random() - 0.5) * 0.5) * 10) / 10,
          realtimePower: {
            ...prev.realtimePower,
            currentKw: newKw,
            capacityPercent: Math.round((newKw / 900) * 1000) / 10,
          },
          wind: {
            ...prev.wind,
            windSpeed: newWind,
          },
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#1b434a] text-slate-900 p-2 sm:p-4 lg:p-6 flex items-center justify-center font-sans antialiased overflow-x-clip selection:bg-blue-500 selection:text-white">
      {/* Outer Dashboard Shell Canvas matching reference image */}
      <div className="relative w-full max-w-[1540px] rounded-[28px] bg-[#224e56]/90 backdrop-blur-xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-3 sm:p-4.5 flex flex-col gap-3">
        {/* Top Header Toolbar */}
        <HydrolixHeader
          selectedTurbine={selectedTurbineId}
          onSelectTurbine={handleSelectTurbine}
          viewportMode={viewportMode}
          onViewportModeChange={setViewportMode}
          turbines={MOCK_TURBINES.map((t) => ({ id: t.id, name: t.name }))}
        />

        {/* Dashboard Workspace Body (Dock + Grids) */}
        <div className="flex flex-col md:flex-row items-stretch gap-3 w-full">
          {/* Left Floating Dock Navigation (N3 Archetype) */}
          <div className="self-center md:self-auto flex md:flex-col shrink-0">
            <HydrolixSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Telemetry & Visualizer Canvas */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* Upper Row: 3D Twin Viewport (2 cols) + Active Power Chart (1 col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
              {/* 3D Digital Twin Viewport (Hero Area) */}
              <div className="lg:col-span-2 w-full h-[320px] lg:h-[350px]">
                <TurbineHeroViewport
                  telemetry={turbineData}
                  viewportMode={viewportMode}
                  onPrevTurbine={handlePrevTurbine}
                  onNextTurbine={handleNextTurbine}
                />
              </div>

              {/* Hydraulic Pressure Stage Control Card (3-Stage Switch) */}
              <div className="lg:col-span-1 w-full h-[320px] lg:h-[350px]">
                <PressureControlCard />
              </div>
            </div>

            {/* Lower Row: 4-Column Telemetry Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 w-full">
              {/* Card 1: Real-Time Power Semi-Circular Radial Gauge */}
              <div className="h-[270px]">
                <RealTimePowerCard telemetry={turbineData} />
              </div>

              {/* Card 2: The weather today + Temperature Vertical Thermometers */}
              <div className="h-[270px]">
                <WeatherAndTempCard telemetry={turbineData} />
              </div>

              {/* Card 3: Wind Information Polar Radar Directional Dial */}
              <div className="h-[270px]">
                <WindInformationCard telemetry={turbineData} />
              </div>

              {/* Card 4: Overview Radial Dotted Dial + Telemetry Stats */}
              <div className="h-[270px]">
                <OverviewCard
                  telemetry={turbineData}
                  onReload={() => {
                    toast.success('Telemetry data refreshed from turbine controller', {
                      duration: 2500,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Pill: Mở trực tiếp Studio Đồng Hồ SVG Khớp 100% Ảnh Mẫu */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => setShowGaugeModal(true)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-950 text-white font-bold text-xs shadow-[0_12px_32px_rgba(0,0,0,0.4)] hover:scale-105 active:scale-95 transition-all border border-blue-400/40 backdrop-blur-xl group ring-2 ring-blue-500/30"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <Activity className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>⚡ Studio Đồng Hồ SVG (Khớp 100% Mẫu)</span>
        </button>
      </div>

      {/* Modal Studio Trải Nghiệm Tương Tác & Animation Siêu Mượt */}
      {showGaugeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 sm:p-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 px-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Speedometer Semicircle Gauge Studio
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Mẫu SVG chuẩn xác 100% khớp ảnh tham chiếu · Animation kim siêu mượt
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGaugeModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Speedometer Gauge Component */}
            <div className="py-2 flex justify-center">
              <SpeedometerGauge size={480} showControls={true} showMetrics={true} easingStyle="spring" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
