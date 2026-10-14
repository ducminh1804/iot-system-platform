import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TurbineHeroViewport } from '@/components/hydrolix/TurbineHeroViewport';
import { PressureControlCard } from '@/components/hydrolix/PressureControlCard';
import { RealTimePowerCard } from '@/components/hydrolix/RealTimePowerCard';
import { WeatherAndTempCard } from '@/components/hydrolix/WeatherAndTempCard';
import { WindInformationCard } from '@/components/hydrolix/WindInformationCard';
import { OverviewCard } from '@/components/hydrolix/OverviewCard';
import { toast } from 'sonner';
import type { HydrolixOutletContext } from '@/components/hydrolix/types';

export const OverviewPage: React.FC = () => {
  const { turbineData, viewportMode, handlePrevTurbine, handleNextTurbine } =
    useOutletContext<HydrolixOutletContext>();

  return (
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
  );
};

export default OverviewPage;
