import React, { useState } from 'react';
import { CloudSun, Sun, Thermometer, MoreHorizontal, AlertTriangle } from 'lucide-react';
import { TurbineTelemetry } from './types';

interface WeatherAndTempCardProps {
  telemetry: TurbineTelemetry;
}

export const WeatherAndTempCard: React.FC<WeatherAndTempCardProps> = ({ telemetry }) => {
  const { weather, temperatures } = telemetry;
  const [selectedHour, setSelectedHour] = useState<string>('Now');

  const tempItems = [
    { label: 'Bearing', value: temperatures.bearing, max: 100, isAlert: false },
    { label: 'Ambient', value: temperatures.ambient, max: 100, isAlert: true },
    { label: 'Rotor', value: temperatures.rotor, max: 100, isAlert: false },
    { label: 'Stator', value: temperatures.stator, max: 100, isAlert: false },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between gap-3 p-4 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] select-none">
      {/* Upper Section: The weather today */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <CloudSun className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
              The weather today
            </h3>
          </div>
          <button
            type="button"
            aria-label="Options"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Hourly Forecast Pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {weather.hourly.map((h) => {
            const isSelected = selectedHour === h.time;
            return (
              <button
                key={h.time}
                type="button"
                onClick={() => setSelectedHour(h.time)}
                className={`flex flex-col items-start p-2 rounded-xl transition-all text-left outline-none ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-100/60 dark:bg-slate-800/50 hover:bg-slate-200/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-[10px] font-medium opacity-80">{h.time}</span>
                <div className="flex items-center gap-1 mt-1">
                  <Sun className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-amber-500'}`} />
                  <span className="text-xs font-bold">{h.temp}°</span>
                </div>
                <span className="text-[9px] opacity-75 mt-0.5">{h.windSpeed}m/s</span>
              </button>
            );
          })}
        </div>

        {/* Pagination Dots indicator */}
        <div className="flex items-center justify-center gap-1 mt-2">
          <span className="w-4 h-1 rounded-full bg-blue-600" />
          <span className="w-1.5 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-slate-100 dark:bg-slate-800/80 -mx-1" />

      {/* Lower Section: Temperature Thermometers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
              Temperature
            </h3>
          </div>
          <button
            type="button"
            aria-label="Options"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Vertical Capsule Progress Thermometers */}
        <div className="grid grid-cols-4 gap-2">
          {tempItems.map((item) => {
            const fillHeightPercent = Math.min((item.value / item.max) * 100, 100);

            return (
              <div key={item.label} className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {item.value}°C
                </span>

                {/* Capsule Column */}
                <div className="relative w-8 h-20 rounded-xl bg-slate-100 dark:bg-slate-800/70 overflow-hidden flex flex-col justify-end p-0.5">
                  <div
                    style={{ height: `${fillHeightPercent}%` }}
                    className={`w-full rounded-lg transition-all duration-700 ease-out ${
                      item.isAlert
                        ? 'bg-gradient-to-t from-blue-500 via-sky-400 to-amber-400'
                        : 'bg-gradient-to-t from-blue-600 via-sky-400 to-sky-200'
                    }`}
                  />
                  {item.isAlert && (
                    <div className="absolute inset-x-0 bottom-1 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-sm">
                        <AlertTriangle className="w-3 h-3 text-amber-300 fill-amber-300" />
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1.5">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
