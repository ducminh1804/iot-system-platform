import React, { useState } from 'react';
import { Sliders, Gauge, Play, Square, RotateCcw, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { SpeedometerGauge } from '@/components/hydrolix/SpeedometerGauge';

export const ScadaControlView: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);
  const [pressureBar, setPressureBar] = useState<number>(142.5);
  const [flowLpm, setFlowLpm] = useState<number>(38.2);
  const [isPumpRunning, setIsPumpRunning] = useState<boolean>(true);
  const [isEmergencyBrake, setIsEmergencyBrake] = useState<boolean>(false);

  const setLevel = (level: 1 | 2 | 3) => {
    setActiveLevel(level);
    if (level === 1) setPressureBar(75.0);
    else if (level === 2) setPressureBar(140.0);
    else setPressureBar(220.0);
    toast.success(`Hydraulic Pressure set to Level ${level}`, { duration: 2000 });
  };

  const toggleEmergency = () => {
    setIsEmergencyBrake((prev) => {
      const next = !prev;
      if (next) {
        toast.error('EMERGENCY BRAKE ENGAGED - ALL VALVES PURGED', { duration: 4000 });
        setIsPumpRunning(false);
      } else {
        toast.info('Emergency brake released - Ready to prime', { duration: 2500 });
      }
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1E2126] text-slate-800 dark:text-slate-200 overflow-y-auto select-none p-3 lg:p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#2D3137]">
        <div className="flex items-center gap-3">
          <div className="bg-[#E52E2D] text-white p-2 rounded">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Hydraulic Actuator & Valve Control
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High-pressure proportional valve station and aerodynamic rotor brake loop
            </p>
          </div>
        </div>

        {/* Emergency Stop Button */}
        <button
          onClick={toggleEmergency}
          className={`px-4 py-1.5 rounded font-black text-xs uppercase tracking-wider transition-transform active:scale-95 shadow-md flex items-center gap-2 ${
            isEmergencyBrake
              ? 'bg-amber-500 hover:bg-amber-600 text-black animate-pulse'
              : 'bg-[#E52E2D] hover:bg-[#D42625] text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>{isEmergencyBrake ? 'RESET E-STOP' : 'EMERGENCY STOP'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {/* Panel 1: Valve Stage Selector */}
        <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
              Proportional Valve Stages
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Calibrated throttle levels for main hydraulic accumulator
            </p>

            <div className="space-y-3">
              {[
                {
                  level: 1 as const,
                  title: 'Mức áp lực 1 (Eco Pitch)',
                  desc: '27.8% Throttle - 75 bar operating pressure',
                  color: 'bg-emerald-600',
                },
                {
                  level: 2 as const,
                  title: 'Mức áp lực 2 (Nominal)',
                  desc: '50.0% Throttle - 140 bar rated pressure',
                  color: 'bg-amber-500',
                },
                {
                  level: 3 as const,
                  title: 'Mức áp lực Full (Storm / Braking)',
                  desc: '100% Throttle - 220 bar maximum relief',
                  color: 'bg-rose-600',
                },
              ].map((stage) => (
                <button
                  key={stage.level}
                  onClick={() => setLevel(stage.level)}
                  className={`w-full text-left p-3 rounded border transition-all ${
                    activeLevel === stage.level
                      ? 'border-[#E52E2D] bg-white dark:bg-[#1D2024] shadow-sm ring-1 ring-[#E52E2D]'
                      : 'border-slate-200 dark:border-[#33373E] bg-white/50 dark:bg-[#202328] hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {stage.title}
                    </span>
                    <span
                      className={`w-3 h-3 rounded-full ${
                        activeLevel === stage.level ? stage.color : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    {stage.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#2D3137] flex items-center justify-between text-xs">
            <span className="text-slate-400">Current Loop:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {isEmergencyBrake ? 'TRIPPED / BYPASS' : `STAGE ${activeLevel} - NORMAL`}
            </span>
          </div>
        </div>

        {/* Panel 2: Live Pressure & Flow Telemetry Dial - SpeedometerGauge Landmark 3 Mốc */}
        <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Đồng Hồ Áp Lực 3 Mốc (Proportional Valve)
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E52E2D]/15 text-[#E52E2D]">
              Mức {isEmergencyBrake ? '0 (Tắt)' : activeLevel}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Đồng hồ đo áp lực 3 vùng: Mức 1 (Xanh -40°), Mức 2 (Vàng 0°), Mức 3 (Đỏ +90° kịch kim)
          </p>

          <div className="flex-1 flex items-center justify-center my-auto py-1">
            <SpeedometerGauge
              value={isEmergencyBrake ? 0 : activeLevel === 1 ? 27.8 : activeLevel === 2 ? 50 : 100}
              onChange={(val) => {
                if (val <= 10) {
                  setIsEmergencyBrake(true);
                } else {
                  setIsEmergencyBrake(false);
                  if (val < 38) setLevel(1);
                  else if (val < 75) setLevel(2);
                  else setLevel(3);
                }
              }}
              size={360}
              variant="embedded"
              showControls={true}
              showMetrics={true}
              unit="Bar"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-center border-t border-slate-200 dark:border-[#2D3137] pt-3 mt-2">
            <div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                {pressureBar.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Line Pressure (bar)</div>
            </div>
            <div>
              <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                {flowLpm.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Return Flow (L/min)</div>
            </div>
          </div>
        </div>

        {/* Panel 3: Pump Station Motor Controls */}
        <div className="bg-slate-50 dark:bg-[#25282E] border border-slate-200 dark:border-[#33373E] rounded p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
              Pump Motor Controls
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              400V 3-phase high-pressure motor pump drive
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-[#1D2024] rounded border border-slate-200 dark:border-[#33373E]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Pump State:</span>
                </div>
                <span
                  className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                    isPumpRunning
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                  }`}
                >
                  {isPumpRunning ? 'RUNNING (1480 RPM)' : 'STOPPED'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsPumpRunning(true);
                    toast.success('Main hydraulic pump started');
                  }}
                  disabled={isPumpRunning || isEmergencyBrake}
                  className="py-2 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>START PUMP</span>
                </button>
                <button
                  onClick={() => {
                    setIsPumpRunning(false);
                    toast.info('Hydraulic pump stopped');
                  }}
                  disabled={!isPumpRunning}
                  className="py-2 rounded bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>STOP PUMP</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#2D3137] flex items-center justify-between text-xs text-slate-500">
            <span>Interlock:</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Normal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
