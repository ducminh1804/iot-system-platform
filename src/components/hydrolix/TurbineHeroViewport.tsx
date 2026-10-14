import React, { useState } from 'react';
import { Plus, Minus, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';
import turbineBg from '@/assets/wind-turbine-bg.jpg';
import { TurbineTelemetry } from './types';

interface TurbineHeroViewportProps {
  telemetry: TurbineTelemetry;
  viewportMode: 'camera' | 'model';
  onPrevTurbine?: () => void;
  onNextTurbine?: () => void;
}

export const TurbineHeroViewport: React.FC<TurbineHeroViewportProps> = ({
  telemetry,
  viewportMode,
  onPrevTurbine,
  onNextTurbine,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showStatusCard, setShowStatusCard] = useState(true);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));

  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-[340px] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white/40 select-none group">
      {/* Background 3D Viewport Simulation */}
      <div className="absolute inset-0 overflow-hidden bg-slate-900">
        <img
          src={turbineBg}
          alt="3D Wind Turbine Digital Twin"
          style={{ transform: `scale(${zoomLevel})` }}
          className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
            viewportMode === 'model' ? 'filter contrast-125 saturate-50 hue-rotate-15' : ''
          }`}
        />
        {/* Soft atmospheric gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/15" />

        {/* Dynamic Blade Rotation Overlay Indicator (Subtle high-tech animation) */}
        <div className="absolute top-[28%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/10 border-dashed pointer-events-none opacity-40 animate-[spin_20s_linear_infinite]" />
      </div>

      {/* Left Zoom Controls Pill */}
      <div className="absolute top-6 left-6 z-10 flex flex-col items-center p-1 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white shadow-lg transition-colors">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="w-4 h-[1px] bg-white/20 my-1" />
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/20 active:scale-95 transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Center Prev / Next Controls */}
      <div className="absolute bottom-5 left-[30%] z-10 hidden sm:flex items-center gap-1.5 p-1 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 text-white/80 shadow-md">
        <button
          type="button"
          onClick={onPrevTurbine}
          aria-label="Previous turbine"
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onNextTurbine}
          aria-label="Next turbine"
          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left In-situ Telemetry HUD Card */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center gap-4 p-3.5 px-5 rounded-2xl bg-slate-900/45 backdrop-blur-md border border-white/25 text-white shadow-xl">
        <div className="pr-4 border-r border-white/20">
          <p className="text-[11px] text-white/70 font-medium tracking-tight">Power (10m)</p>
          <p className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            {telemetry.power10m}
            <span className="text-xs font-normal text-white/80 ml-1">kW</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] text-white/70 font-medium tracking-tight">Total Energy</p>
          <p className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            {telemetry.totalEnergy}
            <span className="text-xs font-normal text-white/80 ml-1">GWh</span>
          </p>
        </div>
      </div>

      {/* Right Floating Status Card */}
      {showStatusCard && (
        <div className="absolute top-6 right-6 z-10 w-56 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/25 text-white shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/15 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/90">Status</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-500/25 border border-emerald-400/40 text-emerald-300">
                {telemetry.status}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowStatusCard(false)}
              aria-label="Close status panel"
              className="w-5 h-5 flex items-center justify-center rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Key-Value rows */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-white/75">
              <span>Energy Received</span>
              <span className="font-semibold text-white">{telemetry.energyReceived}%</span>
            </div>
            <div className="flex items-center justify-between text-white/75">
              <span>Rotor</span>
              <span className="font-semibold text-white">{telemetry.rotorControl}</span>
            </div>
            <div className="flex items-center justify-between text-white/75">
              <span>Nacelle</span>
              <span className="font-semibold text-white">{telemetry.nacelleOrientation}</span>
            </div>
            <div className="flex items-center justify-between text-white/75">
              <span>Converter</span>
              <span className="font-semibold text-white">{telemetry.converterStatus}</span>
            </div>
            <div className="flex items-center justify-between text-white/75 pt-1 border-t border-white/10">
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                Warnings
              </span>
              <span className="font-bold text-amber-400">
                {String(telemetry.warningsCount).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
