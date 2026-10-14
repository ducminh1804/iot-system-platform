import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MOCK_TURBINES, TurbineTelemetry, HydrolixOutletContext } from './types';
import { HydrolixSidebar } from './HydrolixSidebar';
import { HydrolixHeader } from './HydrolixHeader';
import { toast } from 'sonner';

export const HydrolixLayout: React.FC = () => {
  const [selectedTurbineId, setSelectedTurbineId] = useState<string>('T-05');
  const [viewportMode, setViewportMode] = useState<'camera' | 'model'>('camera');
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

  const contextValue: HydrolixOutletContext = {
    turbineData,
    viewportMode,
    handlePrevTurbine,
    handleNextTurbine,
    selectedTurbineId,
    handleSelectTurbine,
  };

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

        {/* Dashboard Workspace Body (Dock + Route Page) */}
        <div className="flex flex-col md:flex-row items-stretch gap-3 w-full">
          {/* Left Floating Dock Navigation */}
          <div className="self-center md:self-auto flex md:flex-col shrink-0">
            <HydrolixSidebar />
          </div>

          {/* Active Route Content */}
          <Outlet context={contextValue} />
        </div>
      </div>
    </div>
  );
};

export default HydrolixLayout;
